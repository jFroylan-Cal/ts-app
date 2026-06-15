# TaskMaster - Enterprise Project Management System

**TaskMaster** is a robust project management solution built for high-performance teams. Beyond basic task tracking, this platform focuses on operational efficiency, proactive deadline monitoring, and data-driven insights.

## 🚀 Key Features

*   **Advanced Dependency Engine (Blockers):** Implements complex task linking logic. Users cannot start or complete tasks if they are currently blocked by unfinished dependencies.
*   **Proactive Health Monitoring:** Integrated **Cron Jobs** evaluate project health daily, automatically flagging "At Risk" or "Delayed" projects based on real-time deadlines.
*   **Audit Log & Activity Feed:** A comprehensive traceability system powered by an **Event-Driven Architecture** that records every significant action across teams and projects.
*   **Enterprise Security & RBAC:** Granular Role-Based Access Control, distinguishing between strategic **Project Owners** and operational **Team Leaders**.
*   **Clean Architecture:** Built using **NestJS** following the Controller-Service-Repository pattern and Hexagonal principles for high maintainability.

## 🛠️ Tech Stack

*   **Backend:** Node.js, NestJS (TypeScript)
*   **Package Manager:** pnpm (Fast, disk-efficient, and strict)
*   **Database:** PostgreSQL + TypeORM
*   **Scheduling:** @nestjs/schedule (Cron Jobs)
*   **Documentation:** Swagger / OpenAPI
*   **Testing:** Jest (Unit & E2E)

---

## ⚙️ Project Setup

### Prerequisites
*   **Node.js** (v18.x or higher)
*   **PostgreSQL**: Ensure you have a database named `ts-app` initialized.
*   **Environment Variables**: Copy `.envTemplate` to a new `.env` file and update your credentials.

### Installation
```bash
# 1. Install dependencies
$ pnpm install

# 2. If prompted for ignored build scripts, run:
$ pnpm rebuild @nestjs/core argon2

# Development mode
$ pnpm run start

# Watch mode (Recommended for development)
$ pnpm run start:dev

# Production mode
$ pnpm run start:prod