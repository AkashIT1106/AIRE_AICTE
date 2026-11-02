# Runtime and Deployment Architecture

| Metadata          | Value                                            |
| ----------------- | ------------------------------------------------ |
| Document          | `docs/03-architecture/runtime-and-deployment.md` |
| Authoritative For | Docker Services, Network Topology, Environments  |
| Status            | `CONFIRMED`                                      |
| Source            | PROJECT_PLAN.md §38.1, §38.2, §38.3              |

---

## 1. Docker Compose Services

The local and staging development architecture consists of five coordinated services defined in [`docker-compose.yml`](../../docker-compose.yml):

```text
docker-compose.yml
├── aire-postgres       # PostgreSQL 16 (Port 5432) — Authoritative persistence
├── aire-redis          # Redis 7 Alpine (Port 6379) — Ephemeral BullMQ transport
├── aire-server         # Node.js Express API (Port 4000) — Core backend API
├── aire-workers        # Node.js BullMQ Worker — Background asynchronous processing
└── aire-client         # Vite React SPA (Port 5173 / Nginx) — Web application
```

---

## 2. Network Topology & Trust Boundaries

```
[ Public Internet ]
        |
        v (Port 443 / 80)
+-----------------------+
| Reverse Proxy (Nginx) |
+-----------------------+
   | (Static Assets)               | (/api/v1/*)
   v                               v
[ aire-client ]              [ aire-server ]
(Vite Container)             (Node.js Container)
                                   |
                +------------------+------------------+
                | (Internal TCP)                      | (Internal TCP)
                v                                     v
       [ aire-postgres ]                     [ aire-redis ]
       (Port 5432 - Internal)                (Port 6379 - Internal)
                                                      ^
                                                      |
                                             [ aire-workers ]
                                             (BullMQ Container)
```

- PostgreSQL and Redis listen strictly on the internal Docker network. Host port bindings are restricted to local development environments.
