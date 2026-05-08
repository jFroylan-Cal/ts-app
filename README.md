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
$ npm install

# Development mode
$ npm run start

# Watch mode (Recommended for development)
$ npm run start:dev

# Production mode
$ npm run start:prod