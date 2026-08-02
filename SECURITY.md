# Security Policy

## Supported Versions

Only the latest release of Sanatan Dharma Suite receives active security updates and vulnerability patches.

| Version | Supported          |
| ------- | ------------------ |
| v0.1.x  | :white_check_mark: |
| < 0.1   | :x:                |

---

## Reporting Vulnerabilities

We take the security of the Sanatan Dharma Suite seriously. If you discover a security vulnerability or potential privacy defect, please report it responsibly.

**Please DO NOT create a public GitHub issue for security vulnerabilities.**

### How to Submit a Vulnerability Report

Send an encrypted or plain email to **security@sanatantools.org** containing:

1. **Description**: A clear description of the vulnerability and its potential impact.
2. **Steps to Reproduce**: Proof-of-concept code, payload, or step-by-step reproduction instructions.
3. **Affected Component**: URL, API endpoint, or source code file path.
4. **Suggested Remediation**: (Optional) Recommended code fix or mitigation strategy.

---

## Response Timeline SLA

- **Initial Acknowledgment**: Within 24 hours of receipt.
- **Triage & Severity Assessment**: Within 48 hours.
- **Patch Resolution & Release**:
  - **Critical / High Severity**: Within 7 business days.
  - **Medium / Low Severity**: Within 14 business days.

---

## Security Best Practices in Sanatan Dharma Suite

1. **Database Row Level Security (RLS)**: All Supabase tables enforce PostgreSQL RLS policies. Staff operations use role validation (`is_staff`).
2. **Privacy & Anonymization**: Client IP addresses are hashed using SHA-256 with a daily rotating salt before storing. No raw IP data or unhashed sensitive credentials are saved.
3. **Environment Secrets**: Secrets (JWT keys, Service Role keys, API tokens) must never be committed to Git. Always use `.env`.
4. **Input Validation**: All public API endpoints validate incoming JSON payloads using Zod schemas.

---

## Responsible Disclosure Policy

If you follow these guidelines in good faith, we pledge not to pursue legal action against security researchers reporting vulnerabilities.
