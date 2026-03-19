import path from "node:path";

export const DEFAULT_CLI_NAME = "openclaw";
export const PREFERRED_CLI_NAME = "jennifer";

const KNOWN_CLI_NAMES = new Set([DEFAULT_CLI_NAME, PREFERRED_CLI_NAME]);
const KNOWN_CLI_BASENAMES = new Map([
  [DEFAULT_CLI_NAME, DEFAULT_CLI_NAME],
  [`${DEFAULT_CLI_NAME}.mjs`, DEFAULT_CLI_NAME],
  [`${DEFAULT_CLI_NAME}.js`, DEFAULT_CLI_NAME],
  [PREFERRED_CLI_NAME, PREFERRED_CLI_NAME],
  [`${PREFERRED_CLI_NAME}.mjs`, PREFERRED_CLI_NAME],
  [`${PREFERRED_CLI_NAME}.js`, PREFERRED_CLI_NAME],
]);
const CLI_PREFIX_RE = /^(?:((?:pnpm|npm|bunx|npx)\s+))?(openclaw|jennifer)\b/;

export function resolveCliName(argv: string[] = process.argv): string {
  const argv1 = argv[1];
  if (!argv1) {
    return DEFAULT_CLI_NAME;
  }
  const base = path.basename(argv1).trim();
  const mapped = KNOWN_CLI_BASENAMES.get(base);
  if (mapped && KNOWN_CLI_NAMES.has(mapped)) {
    return mapped;
  }
  if (KNOWN_CLI_NAMES.has(base)) {
    return base;
  }
  return DEFAULT_CLI_NAME;
}

export function replaceCliName(command: string, cliName = resolveCliName()): string {
  if (!command.trim()) {
    return command;
  }
  if (!CLI_PREFIX_RE.test(command)) {
    return command;
  }
  return command.replace(CLI_PREFIX_RE, (_match, runner: string | undefined) => {
    return `${runner ?? ""}${cliName}`;
  });
}
