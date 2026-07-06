<!-- Generated: 2026-07-06 | Scanned configs: 5 | Token estimate: ~200 -->
# External Dependencies & Services Map

The College ERP incorporates several external services to power its multi-tenant SaaS features, messaging queues, single sign-on authentication, and AI capabilities.

## Database & Caching
- **PostgreSQL 15**: Primary database storage. Schema partitioning isolates client data.
- **Redis 7 (Alpine)**: Cache repository and fast session store. Also functions as the message broker for Celery asynchronous background queues.

## Authentication & Integrations
- **Keycloak 22.x**: OpenID Connect (OIDC) Single Sign-On (SSO) authentication system. Maps client user groups to ERP application roles.
- **MinIO**: S3-compatible cloud storage server. Hosts and secures student avatars, uploaded assignments, and document verifications.

## Search & Vector Database
- **Meilisearch v1.3**: Integrated search index for fast lookup of student, staff, and visitor registers.
- **ChromaDB**: Native vector database used for local embedding retrieval to support AI operations.

## AI Suite Core
- **Ollama**: Hosting container running local LLMs (e.g. Llama3, Mistral) to generate custom examination test papers and course timetables directly.
- **Celery / Celery Worker**: Orchestrates long-running task executions, such as rendering PDF exam sheets and compiling reports, without locking HTTP threads.
