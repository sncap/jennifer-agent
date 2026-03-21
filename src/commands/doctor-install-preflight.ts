import dns from "node:dns/promises";
import { readBestEffortConfig } from "../config/config.js";
import type { RuntimeEnv } from "../runtime.js";
import { note } from "../terminal/note.js";

export type PreflightStatus =
  | "ok"
  | "dns_fail"
  | "timeout"
  | "tls_fail"
  | "tcp_blocked"
  | "auth_invalid"
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

function classifyFetchError(message: string): { status: PreflightStatus; detail: string } {
  if (/abort|timed out/i.test(message)) {
    return { status: "timeout", detail: message };
  }
  if (/certificate|tls|ssl/i.test(message)) {
    return { status: "tls_fail", detail: message };
  }
  if (/econnrefused|ehostunreach|enetunreach|socket hang up/i.test(message)) {
    return { status: "tcp_blocked", detail: message };
  }
  return { status: "unknown", detail: message };
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
    return classifyFetchError(message);
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
    tcp_blocked: "TCP_BLOCKED",
    auth_invalid: "AUTH_INVALID",
    blocked: "BLOCKED",
    malformed_proxy: "MALFORMED_PROXY",
    unknown: "UNKNOWN",
  }[check.status];
  return `- ${check.label}: ${statusLabel}${check.detail ? ` (${check.detail})` : ""}`;
}

function resolveConfiguredProviderChecks(): Array<{ label: string; host: string; url: string }> {
  const cfg = readBestEffortConfig();
  const providers = (cfg as { models?: { providers?: Record<string, { baseUrl?: string }> } })
    ?.models?.providers;
  const checks: Array<{ label: string; host: string; url: string }> = [];
  const seen = new Set<string>();

  const addCheck = (label: string, rawUrl?: string) => {
    if (!rawUrl?.trim()) {
      return;
    }
    try {
      const url = new URL(rawUrl);
      const key = `${label}:${url.origin}`;
      if (seen.has(key)) {
        return;
      }
      seen.add(key);
      checks.push({ label, host: url.hostname, url: url.origin });
    } catch {
      // ignore malformed provider base urls in preflight MVP
    }
  };

  addCheck(
    "OpenAI",
    providers?.openai?.baseUrl ??
      (process.env.OPENAI_API_KEY ? "https://api.openai.com/v1" : undefined),
  );
  addCheck(
    "Anthropic",
    providers?.anthropic?.baseUrl ??
      (process.env.ANTHROPIC_API_KEY ? "https://api.anthropic.com" : undefined),
  );
  addCheck(
    "Gemini",
    providers?.google?.baseUrl ??
      providers?.gemini?.baseUrl ??
      (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY
        ? "https://generativelanguage.googleapis.com/v1beta"
        : undefined),
  );
  addCheck(
    "OpenRouter",
    providers?.openrouter?.baseUrl ??
      (process.env.OPENROUTER_API_KEY ? "https://openrouter.ai/api/v1" : undefined),
  );

  return checks;
}

async function checkTelegramBotApi(): Promise<ReachabilityCheck> {
  const host = "api.telegram.org";
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim() ?? "";
  const dnsResult = await resolveDns(host);
  if (dnsResult.status !== "ok") {
    return { ...dnsResult, label: "Telegram Bot API" };
  }
  if (!token) {
    const head = await fetchHead("https://api.telegram.org/");
    return { label: "Telegram Bot API", host, status: head.status, detail: head.detail };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/getMe`, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (response.status === 401 || response.status === 404) {
      return {
        label: "Telegram Bot API",
        host,
        status: "auth_invalid",
        detail: `HTTP ${response.status}`,
      };
    }
    return {
      label: "Telegram Bot API",
      host,
      status: response.ok ? "ok" : "blocked",
      detail: `HTTP ${response.status}`,
    };
  } catch (err) {
    clearTimeout(timeout);
    const message = err instanceof Error ? err.message : String(err);
    const classified = classifyFetchError(message);
    return {
      label: "Telegram Bot API",
      host,
      status: classified.status,
      detail: classified.detail,
    };
  }
}

function buildRecommendation(params: {
  proxy: ProxySummary;
  installChecks: ReachabilityCheck[];
  providerChecks: ReachabilityCheck[];
  telegram: ReachabilityCheck;
}): string[] {
  const installOk = params.installChecks.every((check) => check.status === "ok");
  const providerBlocked = params.providerChecks.some(
    (check) => !["ok", "auth_invalid"].includes(check.status),
  );
  const telegramOk = params.telegram.status === "ok";

  if (!installOk) {
    return [
      "Jennifer install path is blocked or incomplete from this host.",
      "Recommendation: fix proxy/DNS/TLS issues first, then rerun install preflight.",
    ];
  }
  if (providerBlocked) {
    return [
      "Jennifer core install is likely to succeed.",
      "One or more configured model providers look blocked or unreliable from this host.",
      "Recommendation: fix provider/proxy reachability before relying on hosted models.",
    ];
  }
  if (telegramOk && params.proxy.detected) {
    return ["Jennifer core install is likely to succeed.", "Recommended mode: direct via proxy."];
  }
  if (telegramOk) {
    return ["Jennifer core install is likely to succeed.", "Recommended mode: direct mode."];
  }
  if (params.telegram.status === "auth_invalid") {
    return [
      "Jennifer core install is likely to succeed.",
      "Telegram is reachable, but the configured bot token looks invalid.",
      "Recommendation: fix Telegram bot auth locally before switching topology.",
    ];
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
    "- Jennifer CLI runtime: OK",
  ];
  note(tooling.join("\n"), "Runtime");

  const installChecks = await Promise.all([
    checkHost("openclaw.ai", "openclaw.ai", "https://openclaw.ai/"),
    checkHost("npm registry", "registry.npmjs.org", "https://registry.npmjs.org/"),
    checkHost("GitHub", "github.com", "https://github.com/"),
  ]);
  note(installChecks.map(formatCheckLine).join("\n"), "Install path");

  const providerTargets = resolveConfiguredProviderChecks();
  const providerChecks = await Promise.all(
    providerTargets.map((target) => checkHost(target.label, target.host, target.url)),
  );
  if (providerChecks.length > 0) {
    note(providerChecks.map(formatCheckLine).join("\n"), "Providers");
  }

  const telegram = await checkTelegramBotApi();
  note(formatCheckLine(telegram), "Telegram");

  const recommendation = buildRecommendation({
    proxy,
    installChecks,
    providerChecks,
    telegram,
  });
  note(recommendation.map((line) => `- ${line}`).join("\n"), "Recommendation");
  runtime.log("Install preflight complete.");
}
