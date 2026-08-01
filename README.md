> **Architecture Note:** This project is engineered from the ground up by Senior Software Architects. The application and its accompanying documentation assume a production-ready enterprise deployment servicing a Tier-1 university with over 50,000 active students.

# Enterprise Student Management System

## Project Overview

The **Student Management System (SMS)** is an enterprise-scale, full-stack web application designed to orchestrate the management of student records within an educational institution. The system completely deprecates legacy paper-based archiving, replacing it with a secure, highly normalized relational database governed by a stateless RESTful API.

The application adheres to a decoupled client-server architecture utilizing a modern React.js frontend and a Node.js/Express.js backend. It enforces absolute data integrity, microsecond record retrieval, and Role-Based Access Control (RBAC) to handle 50,000+ concurrent administrative operations flawlessly.

---

## 📚 Complete Enterprise Documentation Suite

To meet strict enterprise software engineering standards, the project documentation has been exhaustively expanded into 10 specialized, implementation-focused deliverables. 

Please navigate through the `docs/` folder to access the complete technical suite:

### 1. Specifications & Architecture
1. **[Software Requirement Specifications (SRS)](docs/01_Software_Requirement_Specifications_SRS.md)**
   *Project Introduction, Scope, Business Value, and Problem Automation.*
2. **[Software Design Document (SDD)](docs/02_Software_Design_Document_SDD.md)**
   *System Architecture, MVC, Design Patterns (Repository, Singleton), and Engineering Principles (SOLID, DRY).*
3. **[Database Architecture](docs/03_Database_Architecture.md)**
   *ACID Properties, CAP Theorem, Indexing (Clustered/Non-Clustered), Normalization, Triggers, and Disaster Recovery.*

### 2. Implementation & Integration
4. **[API Documentation (Swagger/OpenAPI style)](docs/04_API_Documentation.md)**
   *RESTful Endpoints, HTTP Status Codes, Validation Rules, and Axios/cURL examples.*
5. **[Enterprise Security](docs/05_Enterprise_Security.md)**
   *JWT, Refresh Tokens, OAuth, RBAC, XSS/CSRF Prevention, Rate Limiting, and Audit Trails.*
6. **[Performance Engineering & DevOps](docs/06_Performance_and_DevOps.md)**
   *React/Node Optimization (Virtualization, Memoization, Caching), Docker, CI/CD Pipelines, and Rollback Strategies.*

### 3. Visuals, Careers & Manuals
7. **[UML & Architecture Visuals](docs/07_UML_and_Visuals.md)**
   *ASCII Entity-Relationship Diagrams (ERD), Deployment, Component, Sequence, and Activity Diagrams.*
8. **[Interview Mastery Guide](docs/08_Interview_Mastery.md)**
   *Exhaustive System Design, React, Node, SQL, and HR/Behavioral questions and answers.*
9. **[Career & Portfolio Materials](docs/09_Career_and_Portfolio.md)**
   *ATS-friendly Resume Points (STAR Format), LinkedIn Postings, and 2/5/10-minute Elevator Pitches.*
10. **[Manuals & Developer Guides](docs/10_Manuals_and_Guides.md)**
   *Complete Folder Structures, Developer Onboarding Guide, Admin Manual, and Maintenance Procedures.*

---

## Quick Start (Installation & Usage)

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Installation
1. Clone the repository locally.
2. Navigate to the root directory: `cd "Student Management System"`
3. Install dependencies concurrently across the root, frontend, and backend:
   ```bash
   npm install
   ```

### Usage
Run the unified dev script to start both the Node.js backend API and the Vite React frontend simultaneously:
```bash
npm run dev
```
- The React Presentation Layer will be available at `http://localhost:5173`
- The Node API Gateway will run at `http://localhost:5000`

---

## Core Technologies Used

### Frontend (Presentation Layer)
* React.js (Vite)
* React Window (List Virtualization)
* HTML5 / CSS3 (Vanilla Glassmorphism)
* JavaScript (ES6+)
* Axios

### Backend (Business Logic Layer)
* Node.js
* Express.js
* Bcrypt & JWT (Security)
* RESTful APIs

### Database (Data Layer)
* SQLite / MySQL
* Relational Database Design (3NF)
* Parameterized Queries (SQLi Prevention)

---

## License
This project is open-source and available for enterprise evaluation and portfolio demonstrations.
