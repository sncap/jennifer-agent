import { afterEach, describe, expect, it, vi } from "vitest";
import type { OpenClawConfig } from "../../config/config.js";
import type { HandleCommandsParams } from "./commands-types.js";

const triggerInternalHookMock = vi.fn(async () => {});

vi.mock("../../hooks/internal-hooks.js", async () => {
  const actual = await vi.importActual<typeof import("../../hooks/internal-hooks.js")>(
    "../../hooks/internal-hooks.js",
  );
  return {
    ...actual,
    triggerInternalHook: triggerInternalHookMock,
  };
});

const { handleCommands } = await import("./commands-core.js");

function buildParams(commandBody: string, chatType: "direct" | "group"): HandleCommandsParams {
  const cfg = {
    commands: { text: true },
    channels: { telegram: { allowFrom: ["*"] } },
  } as OpenClawConfig;
  return {
    ctx: {
      Provider: "telegram",
      Surface: "telegram",
      OriginatingChannel: "telegram",
      AccountId: "default",
      ChatType: chatType,
      SenderId: "123",
      From: "telegram:123",
      To: chatType === "direct" ? "telegram:bot" : "telegram:group",
      RawBody: commandBody,
      Body: commandBody,
      CommandBody: commandBody,
      BodyForCommands: commandBody,
      BodyForAgent: commandBody,
      BodyStripped: commandBody,
    } as never,
    cfg,
    command: {
      surface: "telegram",
      channel: "telegram",
      ownerList: ["123"],
      senderIsOwner: true,
      isAuthorizedSender: true,
      senderId: "123",
      rawBodyNormalized: commandBody,
      commandBodyNormalized: commandBody,
      from: "telegram:123",
      to: chatType === "direct" ? "telegram:bot" : "telegram:group",
    },
    directives: {},
    elevated: { enabled: false, allowed: false, failures: [] },
    sessionKey: "agent:main:telegram:direct:123",
    workspaceDir: "/tmp/jennifer-test",
    defaultGroupActivation: () => "mention",
    resolvedVerboseLevel: "low",
    resolvedReasoningLevel: "none",
    resolveDefaultThinkingLevel: async () => undefined,
    provider: "openai",
    model: "gpt-4.1",
    contextTokens: 0,
    isGroup: chatType === "group",
  } as unknown as HandleCommandsParams;
}

afterEach(() => {
  triggerInternalHookMock.mockReset();
});

describe("recovery command aliases", () => {
  it("maps 인크래더블제니 세션초기화 to reset hooks for authorized direct chats", async () => {
    const params = buildParams("인크래더블제니 세션초기화", "direct");
    const result = await handleCommands(params);
    expect(result.shouldContinue).toBe(true);
    expect(params.command.commandBodyNormalized).toBe("/reset");
    expect(triggerInternalHookMock).toHaveBeenCalledWith(
      expect.objectContaining({ type: "command", action: "reset" }),
    );
  });

  it("blocks 인크래더블제니 비상복구 in groups", async () => {
    const result = await handleCommands(buildParams("인크래더블제니 비상복구", "group"));
    expect(result.shouldContinue).toBe(false);
    expect(result.reply?.text).toContain("direct chats");
    expect(triggerInternalHookMock).not.toHaveBeenCalled();
  });
});
