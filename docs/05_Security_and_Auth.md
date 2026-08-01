# Chapter 11: Authentication (Future Scope)

While the initial build prioritizes the structural integrity of the CRUD architecture, an enterprise-grade Authentication module is a critical planned enhancement to safeguard institutional data.

## 11.1 JSON Web Tokens (JWT)
Instead of relying on stateful session cookies which restrict scalability, the system will implement stateless JWT authentication.
1. **Login Flow:** The administrator provides credentials (email and password).
2. **Server Verification:** Node.js compares the provided password against the hashed password stored in the database.
3. **Token Generation:** If verified, Express signs a JWT containing the user's ID and Role using a secure `JWT_SECRET` environmental variable. The token is sent back to the client.
4. **Client Storage:** The React frontend stores this token securely in memory or `HttpOnly` cookies.
5. **Authenticated Requests:** Subsequent API requests from Axios will include the JWT in the `Authorization: Bearer <token>` header.

## 11.2 Password Hashing
Raw passwords will never be stored in plain text. The system will utilize **Bcrypt**, a cryptographic hashing function specifically designed to be computationally expensive, thereby resisting brute-force search attacks. During registration, the plain text password is salted and hashed before database insertion.

## 11.3 Role-Based Access Control (RBAC) & Authorization
Not all users require the same level of access.
- **SuperAdmin:** Can manage users, alter database structures, and perform destructive (Delete) actions.
- **Admin/Staff:** Can Create, Read, and Update student profiles, but cannot Delete.
- **Faculty:** Read-only access to academic data.

**Middleware Implementation:** Express middleware functions will be created to verify both the validity of the JWT and the specific role encoded within it before granting access to Protected Routes (e.g., `router.delete` will require SuperAdmin clearance).

---

# Chapter 18: Security 

Robust security is non-negotiable in an educational management context. The application employs multi-layered defense mechanisms.

## 18.1 SQL Injection Prevention
SQL Injection (SQLi) is the most critical vulnerability in database-driven applications. Traditional string concatenation (e.g., `SELECT * FROM students WHERE email = ` + input) allows malicious users to append destructive SQL commands.
- **Solution:** The backend strictly utilizes **Parameterized Queries**. By using `db.run(sql, params)`, the SQL engine treats the user input purely as literal string data, not executable code. It is mathematically impossible for an SQL injection attack to succeed against parameterized endpoints.

## 18.2 Cross-Site Scripting (XSS) Protection
XSS occurs when malicious scripts are injected into benign and trusted websites.
- **Solution:** React inherently protects against XSS by automatically escaping string variables rendered in the JSX. If an administrator inadvertently enters `<script>alert(1)</script>` as a student's name, React renders it as harmless text rather than executing the JavaScript in the browser.

## 18.3 Input Validation & Environment Variables
- **Input Validation:** Validation occurs at three tiers: HTML5 frontend validation, Express backend parsing verification, and Database constraint enforcement. This ensures that only sanitized, expected data types ever enter the database architecture.
- **Environment Variables (`.env`):** Sensitive configuration data, such as database credentials, API keys, and JWT secrets, are never hardcoded into the source code. They are accessed dynamically via `process.env`, preventing accidental exposure when pushing to public repositories like GitHub.

## 18.4 Future Enhancements (Helmet & CORS)
- **Helmet.js:** Will be integrated into the Express pipeline to automatically set secure HTTP headers (e.g., Content Security Policy, X-Frame-Options) to mitigate common web vulnerabilities.
- **CORS (Cross-Origin Resource Sharing):** Currently configured globally for development, production deployment will restrict CORS exclusively to the specific domain hosting the React frontend, rejecting API requests from unauthorized origins.

---

# Chapter 20: Error Handling

A robust error handling strategy is implemented to ensure the system fails gracefully, providing actionable feedback to users rather than crashing abruptly.

## 20.1 Frontend Errors
React utilizes `try...catch` blocks within asynchronous Axios calls. If a network request fails (e.g., the server is offline), the `catch` block intercepts the failure. Instead of throwing a raw JavaScript error into the console, the UI alerts the user gracefully: `"Failed to save student record."`

## 20.2 Backend and API Errors
Express routes are meticulously designed to handle exceptions. 
- **Missing Data (400 Bad Request):** If the frontend submits a payload missing required fields, the server immediately halts the process and returns a 400 error indicating exactly what was missing, saving database processing cycles.
- **Internal Server Errors (500):** If an unexpected failure occurs (e.g., the database file is locked or corrupted), the callback function captures the specific `err.message` and returns a 500 status code. 

## 20.3 Database Errors & Constraint Violations
The SQLite database engine acts as the ultimate gatekeeper. If an administrator attempts to add a student with an email that already exists, the database rejects the `INSERT` command due to the `UNIQUE` constraint. This throws an SQL error which the Express callback captures. Instead of crashing the Node process, Express translates this into an API Error Response, which the frontend then parses to inform the admin that the email is already taken.

## 20.4 Logging
Currently, errors are logged to the terminal console (`console.error`). In a production environment, this will be upgraded to a dedicated logging library (like Winston or Morgan) which writes error logs to a persistent file, enabling developers to conduct post-mortem analysis on system failures.
