import dns from "node:dns/promises";
import type { RuntimeEnv } from "../runtime.js";
import { note } from "../terminal/note.js";

export type PreflightStatus =
  | "ok"
  | "dns_fail"
  | "timeout"
  | "tls_fail"
  | "blocked"
  | "malformed_proxy"
  | "unknown";

export type ProxySummary = {
  detected: boolean;
  type: "none" | "http" | "https" | "socks" | "mixed" | "unknown" | "malformed";
  values: string[];
  hasNoProxy: boolean;
  warnings: string[];
};

export type ReachabilityCheck = {
  label: string;
  host: string;
  status: PreflightStatus;
  detail: string;
};

function maskProxyValue(value: string): string {
  try {
    const url = new URL(value);
    if (url.username || url.password) {
      url.username = url.username ? "***" : "";
      url.password = url.password ? "***" : "";
    }
    return url.toString();
  } catch {
    return value.length > 120 ? `${value.slice(0, 117)}...` : value;
  }
}

export function summarizeProxyEnv(env: NodeJS.ProcessEnv = process.env): ProxySummary {
  const proxyKeys = [
    "HTTP_PROXY",
    "HTTPS_PROXY",
    "ALL_PROXY",
    "http_proxy",
    "https_proxy",
    "all_proxy",
  ];
  const noProxyKeys = ["NO_PROXY", "no_proxy"];
  const entries = proxyKeys
    .map((key) => ({ key, value: env[key]?.trim() ?? "" }))
    .filter((entry) => entry.value.length > 0);
  const noProxy = noProxyKeys.map((key) => env[key]?.trim() ?? "").find(Boolean) ?? "";
  const warnings: string[] = [];
  if (entries.length === 0) {
    return { detected: false, type: "none", values: [], hasNoProxy: Boolean(noProxy), warnings };
  }
  const types = new Set<string>();
  for (const entry of entries) {
    const raw = entry.value;
    if (/^socks(4|4a|5|5h)?:\/\//i.test(raw)) {
      types.add("socks");
      continue;
    }
    if (/^https?:\/\//i.test(raw)) {
      types.add(raw.toLowerCase().startsWith("https://") ? "https" : "http");
      continue;
    }
    warnings.push(`${entry.key} looks malformed`);
    types.add("malformed");
  }
  let type: ProxySummary["type"] = "unknown";
  if (types.has("malformed")) {
    type = "malformed";
  } else if (types.size > 1) {
    type = "mixed";
  } else if (types.has("http")) {
    type = "http";
  } else if (types.has("https")) {
    type = "https";
  } else if (types.has("socks")) {
    type = "socks";
  }
  return {
    detected: true,
    type,
    values: entries.map((entry) => `${entry.key}=${maskProxyValue(entry.value)}`),
    hasNoProxy: Boolean(noProxy),
    warnings,
  };
}

async function resolveDns(host: string): Promise<ReachabilityCheck> {
  try {
    await dns.lookup(host);
    return { label: host, host, status: "ok", detail: "DNS OK" };
  } catch (err) {
    return { label: host, host, status: "dns_fail", detail: `DNS failed: ${String(err)}` };
  }
}

async function fetchHead(
  url: string,
  timeoutMs = 5000,
): Promise<{ status: PreflightStatus; detail: string }> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: controller.signal,
    });
    clearTimeout(timeout);
    return {
      status: response.ok || (response.status >= 300 && response.status < 500) ? "ok" : "blocked",
      detail: `HTTP ${response.status}`,
    };
  } catch (err) {
    clearTimeout(timeout);
    const message = err instanceof Error ? err.message : String(err);
    if (/abort|timed out/i.test(message)) {
      return { status: "timeout", detail: message };
    }
    if (/certificate|tls|ssl/i.test(message)) {
      return { status: "tls_fail", detail: message };
    }
    return { status: "unknown", detail: message };
  }
}

async function checkHost(label: string, host: string, url: string): Promise<ReachabilityCheck> {
  const dnsResult = await resolveDns(host);
  if (dnsResult.status !== "ok") {
    return { ...dnsResult, label };
  }
  const head = await fetchHead(url);
  return { label, host, status: head.status, detail: head.detail };
}

function formatCheckLine(check: ReachabilityCheck): string {
  const statusLabel = {
    ok: "OK",
    dns_fail: "DNS_FAIL",
    timeout: "TIMEOUT",
    tls_fail: "TLS_FAIL",
    blocked: "BLOCKED",
    malformed_proxy: "MALFORMED_PROXY",
    unknown: "UNKNOWN",
  }[check.status];
  return `- ${check.label}: ${statusLabel}${check.detail ? ` (${check.detail})` : ""}`;
}

function buildRecommendation(params: {
  proxy: ProxySummary;
  installChecks: ReachabilityCheck[];
  telegram: ReachabilityCheck;
}): string[] {
  const installOk = params.installChecks.every((check) => check.status === "ok");
  const telegramOk = params.telegram.status === "ok";
  if (!installOk) {
    return [
      "Jennifer install path is blocked or incomplete from this host.",
      "Recommendation: fix proxy/DNS/TLS issues first, then rerun install preflight.",
    ];
  }
  if (telegramOk && params.proxy.detected) {
    return ["Jennifer core install is likely to succeed.", "Recommended mode: direct via proxy."];
  }
  if (telegramOk) {
    return ["Jennifer core install is likely to succeed.", "Recommended mode: direct mode."];
  }
  return [
    "Jennifer core install is likely to succeed.",
    "Telegram looks blocked or unreliable from this host.",
    "Recommended mode: local install + remote Telegram gateway.",
  ];
}

export async function runInstallPreflight(runtime: RuntimeEnv): Promise<void> {
  const proxy = summarizeProxyEnv();
  note(
    [
      `- Proxy detected: ${proxy.detected ? "yes" : "no"}`,
      `- Proxy type: ${proxy.type}`,
      ...(proxy.values.length > 0 ? proxy.values.map((value) => `- ${value}`) : []),
      `- NO_PROXY set: ${proxy.hasNoProxy ? "yes" : "no"}`,
      ...proxy.warnings.map((warning) => `- Warning: ${warning}`),
    ].join("\n"),
    "Environment",
  );

  const tooling = [
    `- Node: ${process.version}`,
    `- Platform: ${process.platform}`,
    `- Jennifer CLI runtime: OK`,
  ];
  note(tooling.join("\n"), "Runtime");

  const installChecks = await Promise.all([
    checkHost("openclaw.ai", "openclaw.ai", "https://openclaw.ai/"),
    checkHost("npm registry", "registry.npmjs.org", "https://registry.npmjs.org/"),
    checkHost("GitHub", "github.com", "https://github.com/"),
  ]);
  note(installChecks.map(formatCheckLine).join("\n"), "Install path");

  const telegram = await checkHost(
    "Telegram Bot API",
    "api.telegram.org",
    "https://api.telegram.org/",
  );
  note(formatCheckLine(telegram), "Telegram");

  const recommendation = buildRecommendation({ proxy, installChecks, telegram });
  note(recommendation.map((line) => `- ${line}`).join("\n"), "Recommendation");
  runtime.log("Install preflight complete.");
}
