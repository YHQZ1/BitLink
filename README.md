# BitLink

**BitLink** is a **production-grade URL shortening and analytics platform** built with a **system-design-first approach**.

The system is designed to handle **high-throughput redirect traffic** while collecting rich analytics without impacting redirect latency. Critical workloads such as analytics processing are **decoupled from the redirect path** using an asynchronous queue architecture.

The goal of the project is to simulate the architecture of a **real SaaS backend system**, emphasizing scalability, failure isolation, and performance.

---

# Core Features

## Authentication & Identity

- Email/password authentication
- OAuth 2.0 login (Google, GitHub)
- Stateless JWT-based authentication
- Unified user identity across providers
- Guest link creation with automatic ownership migration after login

---

## Link Management

- Short URL generation
- Custom aliases
- Collision detection
- QR code generation
- Link activation and expiration controls
- Ownership migration for guest-created links

---

## Analytics System

BitLink records **click events instead of simple counters**, enabling richer traffic insights.

Tracked metadata includes:

- device type
- browser
- operating system
- geographic location
- referrer source
- timestamp

Analytics capabilities:

- per-link analytics
- account-wide analytics
- time-range filtering
- peak traffic analysis

Analytics processing is **asynchronous** to ensure redirects remain fast and reliable.

---

# System Architecture

```
                Client
                   │
                   ▼
              CDN / Edge
                   │
                   ▼
                 Nginx
                   │
                   ▼
            Stateless API
                   │
        ┌──────────┴──────────┐
        ▼                     ▼
    Redis Cache           BullMQ Queue
        │                     │
        ▼                     ▼
     MongoDB            Worker Process
                            │
                            ▼
                         MongoDB
```

The architecture separates **latency-critical redirect operations** from **analytics processing workloads**.

---

# Redirect Pipeline

```
User Request
      │
      ▼
CDN / Edge
      │
      ▼
Nginx Reverse Proxy
      │
      ▼
Backend API
      │
      ├── Redis Cache Lookup
      │
      ├── MongoDB Fallback (cache miss)
      │
      ├── Enqueue analytics event
      │
      ▼
Immediate Redirect Response
```

Key design principle:

**Redirect responses never wait for analytics processing.**

---

# Asynchronous Analytics Processing

Analytics events are processed using **BullMQ workers backed by Redis**.

Workflow:

```
Redirect request
      │
      ▼
Analytics job added to queue
      │
      ▼
BullMQ Worker consumes job
      │
      ▼
Event processed and stored
```

Benefits:

- redirect latency remains minimal
- analytics processing scales independently
- worker failures do not affect redirect availability

---

# Tech Stack

## Frontend

- React
- Vite
- TailwindCSS

Responsibilities:

- link management UI
- analytics dashboards
- authentication flows

Deployment:

- Vercel (global CDN and automatic deployments)

---

## Backend

- Node.js runtime
- Express framework
- Stateless API architecture
- Dockerized services

Responsibilities:

- redirect handling
- link management APIs
- authentication
- analytics event generation

Testing:

- Jest

Code quality:

- ESLint

---

## Caching, Queues, and Rate Limiting

**Redis**

Used for:

- hot redirect caching
- API rate limiting
- queue backend

**BullMQ**

Used for:

- asynchronous analytics processing
- background job handling

---

## Database

**MongoDB Atlas**

Responsibilities:

- link metadata storage
- analytics event storage
- aggregation queries for dashboards

Indexes are optimized for:

- short code lookups
- analytics queries

---

# Reverse Proxy & Traffic Management

**Nginx**

Used as a reverse proxy to:

- route traffic to backend services
- buffer incoming requests
- optimize redirect handling

CDN functionality is provided via **Vercel edge infrastructure**.

---

# Deployment Architecture

| Component     | Platform      |
| ------------- | ------------- |
| Frontend      | Vercel        |
| Backend API   | Render        |
| Database      | MongoDB Atlas |
| Cache         | Redis         |
| Queue Workers | BullMQ        |

The system previously ran on **AWS infrastructure with Cloudflare CDN**, but was migrated to **Vercel and Render** to optimize operational costs while maintaining global availability.

---

# CI/CD Pipeline

Deployment automation is handled using:

- GitHub Actions
- Docker

Typical pipeline:

```
Code Push
   │
   ▼
Run Tests (Jest)
   │
   ▼
Build Docker Image
   │
   ▼
Deploy to Render / Vercel
```

---

# Observability

Monitoring and visualization are implemented using:

- Prometheus
- Grafana

Metrics tracked include:

- redirect latency
- queue backlog
- cache hit rate
- API error rates

---

# Infrastructure as Code

Infrastructure provisioning is managed using **Terraform**, allowing consistent environment configuration across:

- development
- staging
- production

This ensures reproducible deployments and simplified infrastructure management.

---

# Design Tradeoffs

Several deliberate tradeoffs were made:

- Redirect availability is prioritized over analytics completeness
- Analytics are eventually consistent
- Asynchronous processing introduces slight analytics delays
- Managed platforms were chosen to reduce infrastructure overhead

These decisions prioritize **reliability, scalability, and operational simplicity**.

---

# Future Improvements

Potential improvements include:

- Kafka-based event streaming for analytics
- ClickHouse or time-series database for analytics workloads
- Kubernetes-based orchestration
- Global edge redirect optimization
- Advanced abuse detection and bot filtering
