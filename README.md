# BitLink

BitLink is a production-oriented URL shortening and analytics platform built with a strong emphasis on backend architecture, scalability, and clean code separation. The system supports authenticated and guest workflows, detailed analytics, and OAuth-based identity unification, designed from a system-design perspective rather than a CRUD application mindset.

---

## Overview

BitLink enables users to create short links, manage them through a dashboard, and analyze traffic patterns at both link-level and account-level granularity. The backend is fully refactored into a service-driven architecture and designed to scale horizontally with caching, load balancing, and async processing in mind.

---

## Core Capabilities

### Authentication & Identity
- Email/password authentication
- OAuth 2.0 with GitHub and Google
- Single logical user mapped across providers via email
- JWT-based stateless auth
- Limited guest usage with post-signup migration

### Link Management
- Custom aliases with collision handling
- QR code generation
- Link updates, deletion, expiration
- Active/inactive link tracking
- Guest link migration after authentication

### Analytics
- Event-based click tracking
- Device, browser, OS detection
- Geo-resolution (country, city)
- Referrer categorization
- Per-link and global analytics
- Time-window filtering and peak-hour analysis

---

## Architecture

### High-Level Design

- Frontend: React (Vite) on Vercel  
- Backend: Node.js + Express on Render  
- Database: MongoDB (Mongoose)  
- Auth: JWT + OAuth 2.0  
- Analytics: Write-optimized event model  

```

Client → Frontend → Backend API → Database

```

The backend is stateless and suitable for horizontal scaling behind a load balancer.

---

## Backend Design

The backend follows strict separation of concerns:

- **Controllers**: HTTP lifecycle only
- **Services**: Business logic and invariants
- **Utilities**: Stateless helpers (UA parsing, geo lookup)
- **Models**: Schema definitions and database constraints

A previously monolithic controller (~1000 lines) was decomposed into focused services, improving maintainability, testability, and extensibility.

---

## Analytics Flow

1. Short link is resolved
2. Redirect is validated and executed
3. Analytics event is recorded asynchronously
4. Link metadata is updated (clicks, last activity)
5. Redirect proceeds regardless of analytics outcome

Redirect latency is never blocked by analytics writes.

---

## Scalability & System Design

The system is designed and implemented with:

- Redis-backed caching for hot redirects
- Rate limiting at the API and redirect layer
- Asynchronous analytics processing
- Stateless backend instances behind a load balancer
- CDN-friendly redirect endpoints
- MongoDB indexing and aggregation optimization
- Clear upgrade path to message queues and stream processing

---

## Security

- Bcrypt password hashing
- Signed and verified JWTs
- OAuth tokens never exposed client-side
- Strict CORS configuration
- Authorization enforced on all protected routes
- Guest access constrained by session rules

---

## Deployment

- Frontend: Vercel
- Backend: Render
- Database: External MongoDB
- Environment-based configuration
- Dockerized services for local and production parity

---

## Purpose

BitLink was built to:
- Apply real system-design principles to a real product
- Design analytics pipelines beyond simple counters
- Implement OAuth correctly in production
- Practice backend refactoring at scale
- Think in terms of traffic, failure modes, and growth
