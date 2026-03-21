import { describe, expect, it } from "vitest";
import { summarizeProxyEnv } from "./doctor-install-preflight.js";

describe("summarizeProxyEnv", () => {
  it("returns none when no proxy vars are present", () => {
    const result = summarizeProxyEnv({});
    expect(result.detected).toBe(false);
    expect(result.type).toBe("none");
  });

  it("detects http proxy env and no_proxy", () => {
    const result = summarizeProxyEnv({
      HTTPS_PROXY: "http://proxy.company.local:8080",
      NO_PROXY: "127.0.0.1,localhost",
    });
    expect(result.detected).toBe(true);
    expect(result.type).toBe("http");
    expect(result.hasNoProxy).toBe(true);
    expect(result.values[0]).toContain("HTTPS_PROXY=");
  });

  it("flags malformed proxy values", () => {
    const result = summarizeProxyEnv({
      HTTPS_PROXY: "proxy.company.local:8080",
    });
    expect(result.detected).toBe(true);
    expect(result.type).toBe("malformed");
    expect(result.warnings.length).toBeGreaterThan(0);
  });
});
