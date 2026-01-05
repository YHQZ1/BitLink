# BitLink

BitLink is a **production-grade URL shortening and analytics platform** built with a **system-design-first approach**. It is engineered to handle high-throughput redirect traffic, provide deep analytics, and remain resilient under failure — prioritizing correctness, performance, and scalability over CRUD simplicity.

This project is intentionally designed as a real-world backend system, not a tutorial demo.

---

## Why BitLink Exists

Most URL shorteners stop at:

- storing links
- incrementing counters
- serving redirects

BitLink goes further.

It treats URL shortening as a **high-volume, latency-sensitive system problem**, where:

- redirects must be fast and reliable
- analytics must not block critical paths
- infrastructure must scale horizontally
- failures must be isolated, not catastrophic

---

## Core Capabilities

### Authentication & Identity

- Email and password authentication
- OAuth 2.0 integration with Google and GitHub
- Unified user identity across providers (email-based merging)
- Stateless JWT-based authentication
- Controlled guest access with upgrade-to-user link migration

---

### Link Management

- URL shortening with optional custom aliases
- Collision detection and alias validation
- QR code generation per short link
- Link activation, expiration, and status control
- Ownership migration for guest-created links after authentication

---

### Analytics Engine

Analytics are designed as **events**, not counters.

- Event-based click tracking
- Device, browser, and OS detection via user-agent parsing
- Geo-location resolution (country and city)
- Referrer and traffic source classification
- Per-link analytics and account-wide aggregation
- Time-range filtering and peak activity analysis

Analytics processing is intentionally **decoupled from redirects** to guarantee availability and performance.

---

### Dashboards

- Centralized analytics dashboard
- Per-link performance breakdowns
- Traffic trends and usage insights
- Efficient aggregation queries designed for large datasets
- Optimized reads using indexed collections

---

## High-Level Architecture

```
Client
  ↓
CDN (Edge Caching)
  ↓
Reverse Proxy / Load Balancer
  ↓
Stateless Backend API (Dockerized)
  ↓
Cache Layer (Hot Redirects)
  ↓
MongoDB Atlas
```

### Key Architectural Decisions

- Redirects are optimized for **low latency and high availability**
- Analytics writes are processed asynchronously
- Backend services are stateless to allow horizontal scaling
- Cache-first reads minimize database load
- Infrastructure is designed to tolerate partial failures

---

## Redirect & Analytics Flow

1. Incoming short-link request hits the CDN
2. Reverse proxy forwards the request to the backend
3. Cache is checked for redirect metadata
4. Redirect is validated and executed immediately
5. Analytics event is queued asynchronously
6. Redirect response is returned without waiting on analytics

**Analytics failures never block redirects.**

---

## Tech Stack

### Frontend

- React (Vite)
- Deployed on Vercel
- Custom domain with HTTPS
- Optimized for fast interaction with analytics dashboards

---

### Backend

- Node.js with Express
- Dockerized services
- Stateless API design
- Deployed on AWS
- Horizontally scalable behind a load balancer

---

### Database

- MongoDB Atlas
- Indexed collections for redirects and analytics
- Aggregation pipelines for reporting and dashboards
- Optimized schema design for read-heavy workloads

---

### Infrastructure & System Design

- CDN for edge caching and reduced redirect latency
- Reverse proxy and load balancing
- Redis-backed caching for hot paths
- API-level and redirect-level rate limiting
- Asynchronous job processing via queues
- Environment-driven configuration across services

---

### Observability & Infrastructure as Code (Planned)

- Metrics collection and visualization with Prometheus and Grafana
- Kubernetes-based orchestration and service scaling
- Terraform for infrastructure provisioning
- Centralized logging and monitoring

---

## Backend Design Principles

The backend follows strict separation of responsibilities:

- **Controllers**
  Handle HTTP concerns only (request validation, response shaping)

- **Services**
  Encapsulate business logic, invariants, and workflows

- **Models**
  Define schemas, indexes, and database constraints

- **Utilities**
  Stateless helpers (user-agent parsing, geo lookups, formatting)

A previously monolithic controller-heavy design was fully refactored into this structure to improve:

- maintainability
- testability
- long-term scalability

---

## Scalability & Performance Strategy

BitLink is built for **bursty, read-heavy traffic**, typical of redirect systems:

- CDN-friendly redirect endpoints
- Cache-first redirect resolution
- Stateless backend instances for horizontal scaling
- Rate limiting to protect downstream services
- Optimized MongoDB indexes and aggregations
- Clear migration path to Kubernetes-based scaling

The system prioritizes **availability and latency** over strict real-time analytics consistency.

---

## Failure Handling & Resilience

- Redirects continue functioning even if analytics processing fails
- Cache misses gracefully fall back to database reads
- Rate limits prevent abuse and traffic spikes from overwhelming services
- Stateless services allow fast recovery and redeployment
- Partial failures are isolated rather than cascading

---

## Security

- Bcrypt-based password hashing
- Signed and verified JWTs
- OAuth tokens never exposed to the client
- Strict CORS and request validation
- Authorization enforced across all protected routes
- Controlled guest access with server-side constraints

---

## Deployment Overview

- **Frontend:** Vercel (custom domain, HTTPS)
- **Backend:** AWS (Dockerized services)
- **Database:** MongoDB Atlas
- **Caching:** Redis
- **Traffic Management:** CDN + reverse proxy + load balancing
- **Configuration:** Environment-driven across all services

---

## Design Tradeoffs

- Redirect availability is prioritized over analytics completeness
- Analytics are eventually consistent by design
- The system favors horizontal scaling over vertical optimization
- Some workloads are intentionally decoupled to tolerate failure

These tradeoffs are deliberate and reflect real-world system constraints.

---

## Purpose

BitLink was built to:

- Apply real system-design principles to a real product
- Design analytics beyond simple counters
- Build a production-ready redirect pipeline
- Practice scalable backend and infrastructure architecture
- Think in terms of traffic, latency, failures, and growth
