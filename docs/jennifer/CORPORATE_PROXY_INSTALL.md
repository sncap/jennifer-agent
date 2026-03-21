# Jennifer Corporate Proxy Install Guide

## Purpose

This guide explains how to install Jennifer in environments such as:

- company networks
- proxy-only environments
- networks with outbound filtering
- offices where Telegram may be partially or fully blocked

This guide focuses on **getting Jennifer installed successfully first**.
Telegram connectivity is handled as a separate step because a blocked Telegram path should **not** prevent Jennifer core installation.

---

## 1. Install Philosophy

In restricted environments, treat setup as **three separate goals**:

1. **Install Jennifer core**
   - CLI
   - Gateway
   - local dashboard
   - workspace/config/state

2. **Validate provider connectivity**
   - OpenAI / Anthropic / Gemini / others

3. **Validate Telegram connectivity**
   - direct
   - proxied
   - or remote topology if blocked

If Telegram is blocked but Jennifer core works, that is still a successful install.

---

## 2. Decide Your Network Mode First

Before installing, classify the environment.

### Mode A — Direct internet

Use this when:

- normal HTTPS websites work
- npm and GitHub are reachable directly
- no corporate proxy is required

### Mode B — Corporate HTTP/HTTPS proxy

Use this when:

- the company provides a proxy URL
- direct access is blocked or unreliable
- npm/GitHub/provider traffic must go through a proxy

### Mode C — SOCKS proxy

Use this when:

- the environment gives you a SOCKS endpoint instead of a normal HTTP proxy

### Mode D — Restricted / unknown

Use this when:

- you do not know the network rules
- some sites work and some do not
- Telegram is likely blocked

If you are unsure, start by assuming **Mode D** and run the checks below.

---

## 3. Pre-Install Checklist

Before installing Jennifer, confirm the following.

## Required

- A machine running macOS, Linux, or Windows (WSL2 strongly recommended on Windows)
- Permission to install Node/npm packages or use the installer script
- A model provider you can authenticate to later

## Helpful to know in advance

- Whether the company uses an HTTP/HTTPS proxy
- Whether the company uses TLS inspection / custom root certificates
- Whether GitHub is accessible
- Whether npm registry is accessible
- Whether Telegram is accessible

---

## 4. Proxy Environment Variables

Jennifer/OpenClaw and many supporting tools commonly use these environment variables:

- `HTTP_PROXY`
- `HTTPS_PROXY`
- `ALL_PROXY`
- `NO_PROXY`

Lowercase variants are often also recognized:

- `http_proxy`
- `https_proxy`
- `all_proxy`
- `no_proxy`

## Example

```bash
export HTTP_PROXY="http://proxy.company.local:8080"
export HTTPS_PROXY="http://proxy.company.local:8080"
export NO_PROXY="127.0.0.1,localhost"
```

If your company requires authenticated proxy URLs, the format may look like:

```bash
export HTTPS_PROXY="http://username:password@proxy.company.local:8080"
```

Do not commit credentials into shell history, dotfiles, or shared config unless that is explicitly approved.

---

## 5. Recommended Install Sequence

## Step 1 — Check basic tooling

```bash
node -v
npm -v
git --version
```

If Node is not installed, use the Jennifer installer script first.

## Step 2 — Set proxy environment variables if needed

For macOS/Linux/WSL:

```bash
export HTTP_PROXY="http://proxy.company.local:8080"
export HTTPS_PROXY="http://proxy.company.local:8080"
export NO_PROXY="127.0.0.1,localhost"
```

For PowerShell:

```powershell
$env:HTTP_PROXY="http://proxy.company.local:8080"
$env:HTTPS_PROXY="http://proxy.company.local:8080"
$env:NO_PROXY="127.0.0.1,localhost"
```

## Step 3 — Install Jennifer

### Option A — Installer script (recommended)

macOS / Linux / WSL:

```bash
curl -fsSL https://openclaw.ai/install.sh | bash
```

Windows (PowerShell):

```powershell
iwr -useb https://openclaw.ai/install.ps1 | iex
```

### Option B — Package manager install

```bash
npm install -g openclaw@latest
jennifer onboard --install-daemon
```

If the company network blocks the installer host but allows npm, package-manager install may work better.
If npm is blocked but direct HTTPS to the installer host works, the installer may work better.

## Step 4 — Run onboarding

```bash
jennifer onboard --install-daemon
```

At this stage, prioritize:

- getting the Gateway running
- getting the dashboard open
- confirming provider setup

Do **not** treat Telegram setup as mandatory for install success.

---

## 6. What to Validate First

After install, validate in this order.

## A. CLI works

```bash
jennifer --help
jennifer status
```

## B. Gateway health

```bash
jennifer gateway status
jennifer dashboard
```

## C. Local dashboard access

- Open the dashboard URL printed by the CLI
- Confirm the Control UI loads

## D. Provider connectivity

Try a basic provider-backed task after onboarding.

Only after A-D are healthy should you evaluate Telegram.

---

## 7. Common Failure Layers

This is the most important section in restricted environments.

## Failure type 1 — Install dependencies blocked

Symptoms:

- installer hangs early
- npm install fails
- GitHub fetch fails

Likely causes:

- missing proxy env
- company firewall
- npm/GitHub blocked
- TLS interception / CA trust problem

What to do:

- verify proxy environment variables
- verify npm and GitHub access separately
- check whether the company requires a custom root CA

## Failure type 2 — Gateway works, providers fail

Symptoms:

- dashboard opens
- onboarding completes partially
- model calls fail

Likely causes:

- provider endpoint blocked
- proxy allows npm/GitHub but not model APIs
- provider auth missing or invalid

What to do:

- test provider endpoints separately
- confirm auth values
- consider provider choices that are reachable in the company network

## Failure type 3 — Jennifer works, Telegram fails

Symptoms:

- dashboard works
- local features work
- Telegram bot never responds or cannot connect

Likely causes:

- Telegram Bot API blocked by company firewall
- DNS or TLS interference for Telegram
- proxy does not allow Telegram traffic

What to do:

- do not treat this as install failure
- move to the Telegram decision section below

---

## 8. Telegram Decision Guide

Once Jennifer core is working, choose a Telegram strategy.

## Case A — Telegram direct access works

Use standard Telegram setup.

Follow:

- [Telegram](/channels/telegram)

Typical flow:

```bash
openclaw gateway
openclaw pairing list telegram
openclaw pairing approve telegram <CODE>
```

## Case B — Telegram works only through proxy

Use the same Telegram setup, but ensure the runtime environment includes the required proxy variables.

Important:

- verify the same env vars are available where the Gateway runs
- do not assume your interactive shell env automatically reaches a service manager

## Case C — Telegram is blocked from this machine

This is common in corporate environments.

Recommended approach:

- install Jennifer locally anyway
- use local dashboard / tools / provider access
- move Telegram connectivity to a remote machine

This is the recommended topology when a company firewall blocks Telegram.

---

## 9. Recommended Remote Telegram Topology

If Telegram is blocked on your corporate machine, use this split setup.

## Local corporate machine

Use for:

- Jennifer workspace
- local files/tools
- browser automation
- dashboard
- provider calls (if allowed)

## Remote machine (home server / VPS / personal Mac)

Use for:

- Telegram bot connectivity
- always-on gateway ingress
- stable network path outside company firewall restrictions

This allows Telegram to remain available without forcing the corporate machine to talk directly to Telegram.

If your workflow depends heavily on Telegram, this topology is usually better than fighting the company firewall.

---

## 10. Service Environment Warning

A common mistake is setting proxy env vars in an interactive shell and assuming the background service sees them too.

This often fails.

Check whether the environment variables are available to:

- `jennifer gateway`
- launchd/systemd/Scheduled Tasks
- Docker / VM runtime if used

If interactive shell works but the service does not, compare environments carefully.

---

## 11. Corporate TLS / Custom CA Notes

Some company networks intercept TLS with a custom root certificate.

Symptoms may include:

- certificate errors during install
- npm TLS failures
- random HTTPS failures for GitHub or providers

In those environments, Jennifer may not be the root problem. The host may need the company CA installed so Node/npm/other HTTPS clients trust outbound traffic.

This should be handled according to company policy.

---

## 12. Minimal Success States

In corporate environments, success should be measured in stages.

### Success State 1 — Core install success

- Jennifer CLI installed
- Gateway starts
- dashboard opens

### Success State 2 — Provider success

- at least one model provider works

### Success State 3 — Messaging success

- Telegram direct or proxied access works
- or a remote Telegram topology is chosen

Do not block progress on Stage 3 if Stages 1 and 2 are already healthy.

---

## 13. Recommended First Troubleshooting Commands

```bash
jennifer --help
jennifer status
jennifer gateway status
jennifer dashboard
openclaw doctor --verbose
```

If Telegram is the only broken piece, the next question should be:

> “Is Telegram blocked by this network, and should I switch to a remote Telegram gateway topology?”

—not:

> “Why does Jennifer completely fail?”

---

## 14. Recommended Next Docs

After this guide, the next documents to consult should be:

1. `TELEGRAM_CONNECTIVITY_MODES.md`
2. `REMOTE_TELEGRAM_GATEWAY.md`
3. Telegram channel docs
4. doctor / troubleshooting docs

---

## 15. Summary

For corporate environments, the correct approach is:

1. install Jennifer core first
2. verify dashboard and provider health
3. treat Telegram as a separate connectivity layer
4. use proxy where allowed
5. if Telegram is blocked, move to a remote Telegram gateway pattern

That is the safest and most practical path to making Jennifer usable as a personal assistant in real company networks.
