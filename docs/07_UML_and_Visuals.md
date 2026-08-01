# System Visualization & UML Diagrams

## 1. System Modeling Overview

### 1.1 Overview
Unified Modeling Language (UML) and architectural diagrams provide a standardized visual abstraction of the Student Management System. These diagrams capture the static structure, dynamic behavior, and physical deployment topologies of the enterprise software.

### 1.2 Purpose
To facilitate high-level communication between software architects, backend developers, frontend developers, and non-technical stakeholders (e.g., University Administration). Visual models eliminate ambiguity present in text-based requirements, ensuring all teams are building towards the exact same architectural vision.

### 1.3 Technical Explanation
The system utilizes both Structural Diagrams (Class, Component, Deployment, Package) which show how the system is constructed, and Behavioral Diagrams (Use Case, Sequence, Activity, State) which show how the system reacts over time to various stimuli and API requests.

### 1.4 Workflow
Architects design these models during the Software Design phase *before* a single line of code is written. These diagrams act as the blueprints. If a developer is unsure how the Authentication process should flow, they consult the Sequence Diagram rather than making assumptions.

### 1.5 Real-world Example
When onboarding a new backend engineer, instead of forcing them to read 10,000 lines of Node.js code to understand how the system is deployed across AWS, they are simply handed the Deployment Diagram. Within 5 minutes, they understand the relationship between the Load Balancers, Node instances, and the RDS Database.

### 1.6 Advantages
- **Risk Mitigation:** Identifying architectural flaws (like a circular dependency) on a whiteboard or UML diagram is practically free. Identifying and fixing it after 6 months of coding costs thousands of dollars.

### 1.7 Best Practices
- **Keep it Abstract:** Diagrams should not contain pseudo-code or overly granular details (like specific CSS classes). They must remain at a high level of architectural abstraction.

### 1.8 Limitations
- **Documentation Drift:** As the codebase rapidly evolves in an Agile environment, static UML diagrams often become outdated if not rigorously maintained alongside the code.

### 1.9 Future Improvements
- **Auto-generation:** Implementing tools (like TypeDoc or Prisma) that automatically generate and update Class Diagrams and ERDs directly from the source code, eliminating documentation drift.

---

## 2. ASCII Architecture & UML Diagrams

### 2.1 Entity Relationship Diagram (ERD)
*Maps the Relational Database Structure.*
```text
+-------------------+       +-------------------+       +-------------------+
|    Departments    |       |     Students      |       |    Enrollments    |
+-------------------+       +-------------------+       +-------------------+
| PK dept_id        |<------| FK dept_id        |       | PK enroll_id      |
|    dept_name      |       | PK student_id     |<------| FK student_id     |
|    head_of_dept   |       |    first_name     |       | FK course_id      |
+-------------------+       |    last_name      |       |    semester       |
                            |    email (UNIQUE) |       |    final_grade    |
                            |    gpa            |       +-------------------+
                            +-------------------+
```

### 2.2 Deployment & Network Diagram (Production Architecture)
*Shows how the software maps to physical/cloud infrastructure.*
```text
                      [ Global Internet / HTTPS ]
                                  |
                                  V
                      +-------------------------+
                      | AWS Route 53 (DNS)      |
                      +-------------------------+
                                  |
            +-------------------------------------------+
            | Cloudflare CDN (Serves React Static UI)   |
            +-------------------------------------------+
                                  | (API Requests)
                                  V
                      +-------------------------+
                      | AWS Application Load    |
                      | Balancer (ALB)          |
                      +-------------------------+
                                  |
           +----------------------+----------------------+
           |                      |                      |
           V                      V                      V
+-------------------+  +-------------------+  +-------------------+
| Docker Container  |  | Docker Container  |  | Docker Container  |
| Node.js / Express |  | Node.js / Express |  | Node.js / Express |
+-------------------+  +-------------------+  +-------------------+
           |                      |                      |
           +----------------------+----------------------+
                                  |
                                  V
                      +-------------------------+
                      | AWS RDS Multi-AZ        |
                      | (MySQL Primary DB)      |
                      +-------------------------+
                                  |
                      +-------------------------+
                      | AWS RDS Read Replica    |
                      +-------------------------+
```

### 2.3 Component Diagram
*Displays structural wiring of software components.*
```text
 [React Web Client] 
        | (JSON over HTTPS)
        V
 +---------------------------------------------------+
 | Student Management API (Node.js)                  |
 |                                                   |
 |  [Auth Controller] <--> [JWT Service]             |
 |          |                                        |
 |  [Student Controller] <--> [Student Repository]   |
 |                                    |              |
 +------------------------------------|--------------+
                                      | (TCP / SQL Port 3306)
                                      V
                             [MySQL Database]
```

### 2.4 Sequence Diagram (JWT Authentication Flow)
*Maps the chronological order of a login request.*
```text
Client (React)              API Gateway (Node)             Database
      |                              |                         |
      |---1. POST /login (Credentials)-->|                         |
      |                              |---2. SELECT user by email-->|
      |                              |<--3. Return Hashed Pwd------|
      |                              |                         |
      |                              | (4. bcrypt.compare())   |
      |                              | (5. Generate JWT)       |
      |                              |                         |
      |<--6. 200 OK + JWT Token------|                         |
      |                              |                         |
      |---7. GET /students + JWT---->|                         |
      |                              | (8. Verify JWT Signature)|
      |                              |---9. SELECT * students----->|
      |                              |<--10. Return Rows-----------|
      |<--11. 200 OK + JSON Data-----|                         |
```

### 2.5 State Machine Diagram (Student Lifecycle)
*Shows the states a Student entity can transition through.*
```text
[*] --> [Applicant]
          | (Payment Cleared)
          V
   [Enrolled / Active] <------> [Academic Probation]
          |                              |
 (Completed Credits)               (GPA < 1.0)
          |                              |
          V                              V
      [Alumni]                      [Expelled]
          |                              |
          V                              V
         [*]                            [*]
```

### 2.6 Package Diagram
*Shows how the codebase is modularized.*
```text
+-----------------------+      +-----------------------+
|  Frontend Package     |      |  Backend Package      |
|-----------------------|      |-----------------------|
| - Components          |      | - Routes              |
| - Contexts            |......| - Controllers         |
| - Hooks               |  |   | - Services            |
| - Assets              |  |   | - Repositories        |
| - Utils               |  |   | - Middleware          |
+-----------------------+  |   +-----------------------+
                           |               :
                        (HTTP)         (SQL Driver)
                           |               V
                           |   +-----------------------+
                           |   |  Database Package     |
                           +..>|-----------------------|
                               | - Tables              |
                               | - Views               |
                               | - Stored Procedures   |
                               +-----------------------+
```

### 2.7 Activity Diagram (Registration Process)
*Flowchart style diagram for business logic.*
```text
       [Start]
          |
    (Submit Form)
          |
          V
   [Validate Inputs]
          |
  +-------+-------+
  |               |
[Valid]       [Invalid]
  |               |
  V               V
[Check DB]   [Return 400 Error]
  |               |
  V              [*]
[Exists?] --Yes--> [Return 409 Conflict] -> [*]
  | 
  No
  V
[Hash Password]
  |
  V
[Insert Record]
  |
  V
[Send Welcome Email]
  |
  V
[Return 201 Created]
  |
 [*]
```
