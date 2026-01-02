# BitLink

BitLink is a production-grade URL shortening and analytics platform engineered with a **system-design-first mindset**. It focuses on scalability, fault tolerance, and clean architectural boundaries rather than being a basic CRUD demo.

The platform supports authenticated and guest workflows, deep analytics, QR codes, and a horizontally scalable backend backed by modern infrastructure patterns.

---

## Overview

BitLink allows users to create, manage, and analyze short links through a performant dashboard. It provides **per-link and global analytics**, real-time redirect handling, and a backend designed to scale under high traffic.

The system is containerized, cache-aware, rate-limited, CDN-friendly, and built to evolve into a Kubernetes-orchestrated environment with full observability and infrastructure-as-code.

---

## Core Features

### Authentication & Identity

- Email and password authentication
- OAuth 2.0 with GitHub and Google
- Unified user identity across providers (email-based)
- JWT-based stateless authentication
- Limited guest usage with post-signup link migration

### Link Management

- URL shortening with custom aliases
- Collision handling and validation
- QR code generation per link
- Link expiration and status management
- Guest link ownership migration after authentication

### Analytics

- Event-based click tracking
- Device, browser, and OS detection
- Geo-location resolution (country, city)
- Referrer and source classification
- Per-link and account-level analytics
- Time-range filtering and peak activity analysis

### Dashboards

- Centralized analytics dashboard
- Per-link performance views
- Traffic trends and usage insights
- Optimized aggregation queries for large datasets

---

## High-Level Architecture

```
Client
  ↓
CDN
  ↓
Reverse Proxy / Load Balancer
  ↓
Backend API (Dockerized, Stateless)
  ↓
Cache (Hot paths)
  ↓
MongoDB Atlas
```

Redirects are optimized for **low latency**, while analytics writes are handled asynchronously to avoid blocking the request path.

---

## Tech Stack

### Frontend

- React (Vite)
- Deployed on Vercel
- Custom domain with HTTPS

### Backend

- Node.js + Express
- Dockerized services
- Hosted on AWS
- Stateless architecture for horizontal scaling

### Database

- MongoDB Atlas
- Indexed collections for analytics and redirects
- Aggregation pipelines for reporting

### Infrastructure & System Design

- CDN for edge caching and faster redirects
- Reverse proxy and load balancing
- Redis-backed caching for hot links
- API-level and redirect-level rate limiting
- Asynchronous processing via queues
- Environment-based configuration

### Observability & IaC (Ongoing / Upcoming)

- Metrics and dashboards with Prometheus and Grafana
- Kubernetes-based orchestration and load balancing
- Terraform for infrastructure as code
- Centralized logging and monitoring

---

## Backend Design Principles

The backend follows strict separation of concerns:

- **Controllers** – HTTP lifecycle and request validation only
- **Services** – Core business logic and invariants
- **Models** – Database schemas and constraints
- **Utilities** – Stateless helpers (UA parsing, geo lookup, etc.)

A previously monolithic controller layer was fully refactored into focused services, improving maintainability, testability, and scalability.

---

## Analytics Flow

1. Short link request is received
2. Cache is checked for redirect metadata
3. Redirect is validated and executed
4. Analytics event is queued asynchronously
5. Link metadata is updated independently

Analytics failures **never block redirects**.

---

## Scalability & Performance

BitLink is designed with real-world traffic in mind:

- CDN-friendly redirect endpoints
- Redis caching for high-frequency links
- Stateless backend instances behind a load balancer
- Rate limiting to prevent abuse
- Optimized MongoDB indexes and aggregations
- Clear migration path to Kubernetes and advanced queueing

---

## Security

- Bcrypt password hashing
- Signed and verified JWTs
- OAuth tokens never exposed to the client
- Strict CORS and request validation
- Authorization enforced on all protected routes
- Controlled guest access with server-side constraints

---

## Deployment

- Frontend: Vercel (custom domain)
- Backend: AWS (Dockerized)
- Database: MongoDB Atlas
- CDN, proxy, and load balancer in front of backend
- Environment-driven configuration for all services

---

## Purpose

BitLink was built to:

- Apply real system-design principles to a real product
- Design analytics beyond simple counters
- Build a production-ready redirect pipeline
- Practice scalable backend architecture
- Think in terms of traffic, failure modes, and growth
