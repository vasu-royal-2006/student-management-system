# Software Design Document (SDD)

## 1. System Architecture

### 1.1 Overview
The Student Management System architecture is constructed using a decoupled, API-driven **Client-Server Architecture** utilizing a modified **Model-View-Controller (MVC)** pattern.

### 1.2 Purpose
To isolate the presentation layer from the business logic and persistence layers. This separation of concerns allows frontend engineering teams and backend engineering teams to iterate on their respective codebases concurrently without introducing breaking changes to one another.

### 1.3 Technical Explanation
- **View (Presentation Layer):** React.js orchestrates the UI, maintaining a Virtual DOM for rapid, batched updates.
- **Controller (API Layer):** Express.js routes act as the controllers. They intercept network requests, execute middleware (authentication, logging), and invoke business services.
- **Model (Data Layer):** The SQL database handles strict data schema definitions and relationships, completely abstracted from the controllers via raw parameterized queries or an ORM.

### 1.4 Workflow
1. The React **View** fires an Axios Promise representing a user intent (e.g., Delete Student).
2. The Node.js **Controller** intercepts the HTTP DELETE request.
3. The Controller executes business logic (Is the user authorized? Does the student exist?).
4. The Controller commands the **Model** to execute a mutation.
5. The Model returns the execution status to the Controller, which formats a standardized JSON response back to the View.

### 1.5 Real-world Example
During a UI redesign, the university decided to switch from a web dashboard to a native iOS application. Because the architecture is decoupled, the backend Controllers and SQL Models remained entirely untouched. The iOS app simply consumed the existing REST API, saving months of engineering effort.

### 1.6 Advantages
- **Scalability:** The Node.js backend can be scaled horizontally (running 10 instances behind a load balancer) independently of the React frontend, which can be served globally via a cheap CDN.
- **Fault Tolerance:** If the frontend crashes due to a client-side JavaScript error, the backend API remains secure and functional.

### 1.7 Best Practices
- **Statelessness:** The backend must remain completely stateless. No session data should be stored in server memory (RAM). This ensures that any load-balanced server instance can handle any request identically.

### 1.8 Limitations
- **Network Overhead:** Because the View and Controller are physically separated, every action requires a network round-trip, introducing latency compared to a monolith where View and Controller live on the same server.

### 1.9 Future Improvements
- **GraphQL Implementation:** Transitioning from REST to GraphQL to allow the frontend to specify exactly which fields it needs (preventing over-fetching), which is highly beneficial for mobile clients with limited bandwidth.

---

## 2. Design Patterns Utilized

### 2.1 Overview
Enterprise software relies on established Design Patterns to solve recurring architectural problems elegantly and uniformly.

### 2.2 Purpose
To prevent developers from "reinventing the wheel," ensuring the codebase remains predictable, testable, and highly cohesive for any engineer joining the team.

### 2.3 Technical Explanation
- **Repository Pattern:** Abstracts the data layer. Instead of writing SQL queries directly inside Express route handlers, database operations are encapsulated in a `StudentRepository` class. 
- **Singleton Pattern:** Used for the Database Connection Pool. We only ever want one pool manager instantiated across the entire Node.js application memory space to prevent connection leaks.
- **Factory Pattern (Planned):** Useful for generating different types of user objects (e.g., `UserFactory.create('Admin')` vs `UserFactory.create('Faculty')`), handling their distinct initializations internally.
- **Middleware Pattern (Chain of Responsibility):** Express relies heavily on this. A request passes through a chain: `AuthMiddleware` -> `ValidationMiddleware` -> `RouteController`. If one fails, the chain breaks early.

### 2.4 Workflow (Repository Pattern)
1. Controller receives `req.body.gpa`.
2. Controller calls `StudentRepository.updateGPA(id, gpa)`.
3. The Repository securely formats the SQL query and interacts with the DB, returning a mapped object to the Controller.

### 2.5 Real-world Example
We initially used SQLite for development. When migrating to production MySQL, because we used the **Repository Pattern**, we only had to rewrite the SQL dialect within the `StudentRepository` file. The Express controllers didn't even know the database engine had changed, resulting in zero regressions in the API layer.

### 2.6 Advantages
- **Testability:** By injecting mock repositories into our controllers, we can run unit tests on our API logic incredibly fast without actually spinning up a real SQL database.

### 2.7 Best Practices
- **Dependency Injection (DI):** Passing dependencies (like the database instance) into a class constructor rather than hardcoding imports inside the class. This enables loose coupling and makes testing trivial.

### 2.8 Limitations
- **Over-engineering:** Applying complex patterns (like Abstract Factories) to simple CRUD operations can lead to "Spaghetti Code" and unnecessary boilerplate.

### 2.9 Future Improvements
- **Observer Pattern Integration:** When a student's record is deleted, an Observer pattern could trigger independent microservices (e.g., the Notification Service to email the student, and the Audit Service to log the action) without the core Controller needing to know about them.

---

## 3. Software Engineering Principles

### 3.1 Overview
The codebase strictly adheres to foundational software engineering principles to guarantee long-term maintainability.

### 3.2 Purpose
To ensure that as the codebase grows from 10,000 lines of code to 500,000 lines of code, it does not become a fragile "Big Ball of Mud."

### 3.3 Technical Explanation
- **SOLID Principles:** 
  - *Single Responsibility:* Every function and file does exactly one thing. `database.js` manages connections; it doesn't handle HTTP responses.
- **DRY (Don't Repeat Yourself):** Reusable React components (like a generic `<DataTable />`) prevent copying and pasting HTML markup.
- **KISS (Keep It Simple, Stupid):** Choosing straightforward procedural logic in controllers over overly clever nested ternary operators that are hard to read.
- **YAGNI (You Aren't Gonna Need It):** We did not implement a graph database because a relational database handles 99% of our current use cases perfectly. We don't build infrastructure for hypothetical problems.
- **High Cohesion & Loose Coupling:** Components that belong together (like validation logic and API routes) are kept close, while the overall system components (Frontend vs Backend) are kept strictly decoupled via HTTP.

### 3.4 Workflow (Applying DRY)
When building the "Edit Student" and "Add Student" pages, we realized 90% of the UI was identical. Applying DRY, we extracted this into a single `<StudentForm />` component that accepts a `student` prop. If the prop is null, it acts as an "Add" form; if present, it acts as an "Edit" form.

### 3.5 Real-world Example
A junior developer duplicated the SQL connection logic in three different controller files. When the database password changed, the app crashed because they forgot to update one of the files. By enforcing the **DRY principle** and utilizing a **Singleton** connection file (`database.js`), changing the password in one central `.env` file fixed the entire system.

### 3.6 Advantages
- **Maintainability:** A new engineer can easily trace execution flow when responsibilities are single and clear (SOLID).
- **Extensibility:** Loose coupling allows us to rip out the email notification provider (e.g., SendGrid) and replace it with another (e.g., AWS SES) without touching the core student enrollment logic.

### 3.7 Best Practices
- **Code Reviews:** Enforcing these principles requires rigorous peer code reviews. Automated linters (ESLint) can enforce basic syntax, but architectural principles require human oversight.

### 3.8 Limitations
- **Development Velocity:** In the very early stages of a startup, strictly adhering to SOLID and DI can slow down prototyping speed.

### 3.9 Future Improvements
- **SonarQube Integration:** Implementing static code analysis in the CI/CD pipeline to automatically flag code smells that violate DRY or introduce high cyclomatic complexity.
