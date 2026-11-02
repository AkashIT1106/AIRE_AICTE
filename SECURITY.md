# Security Policy

## Reporting Security Vulnerabilities

AIRE handles sensitive regulatory and admission reconciliation data. Security vulnerabilities should be reported directly to the security coordinator or documented internally with an immediate adversarial mitigation ticket.

## Security Baseline

1. **Central Authorization**: Default-deny on all routes and mutations.
2. **PostgreSQL RLS**: Enforced on all tenant-owned tables.
3. **Identity Vault**: Raw personal identifiers (such as APAAR IDs) are isolated with envelope encryption and never logged in plain text.
4. **Context Isolation**: No shared connection pool state without tenant-context initialization.
