# Jennifer Network Requirements

## 1. Objective

Enable Jennifer to operate reliably in enterprise environments with:
- proxy
- firewall
- restricted outbound access

---

## 2. Network Modes

### 1) Direct Mode
- No proxy
- Open outbound access

### 2) Proxy Mode
- HTTP/HTTPS or SOCKS proxy
- selective routing

### 3) Relay Mode
- No direct internet
- internal relay server required

---

## 3. Proxy Configuration

### Global Proxy
- HTTP_PROXY
- HTTPS_PROXY
- NO_PROXY

### Service-Specific Proxy

Separate configuration for:

- Telegram API
- LLM APIs
- Git providers
- File downloads

---

## 4. Telegram Requirements

- must support proxy
- must support polling or webhook
- media download must be separated
- retry + timeout required

---

## 5. Media Download Handling

Must include:

- file size limit
- MIME type validation
- retry logic
- timeout
- isolated storage path

---

## 6. Outbound Policy

Default:
- allowlist mode

Must define:
- allowed domains
- blocked domains
- internal-only domains

---

## 7. SSRF Protection

- deny private ranges by default
- allow only required domains
- configurable exceptions

---

## 8. Retry & Timeout

Each request must define:

- connect timeout
- read timeout
- retry count
- backoff strategy

---

## 9. Observability

Must log:

- request failures
- proxy errors
- timeout events
- retry attempts

---

## 10. Security Requirements

- no plaintext secrets
- no direct credential exposure
- environment variable usage required
- token masking in logs

---

## 11. Failure Handling

System must:

- degrade gracefully
- notify user on failure
- retry when safe
- avoid infinite loops

---

## 12. Compatibility

Must work with:

- corporate proxy
- TLS inspection
- VPN environments
- restricted DNS environments

---

## 13. Codex Execution Environment

- must not inherit all env variables
- must use controlled environment
- must respect proxy configuration
- must not expose secrets

---

## 14. Testing Requirements

Must validate:

- Telegram message flow via proxy
- media download success/failure
- LLM API connectivity
- retry behavior
- timeout handling

---

## 15. Definition of Done

Network feature is complete when:

- works under proxy
- fails safely
- logs correctly
- config is documented
