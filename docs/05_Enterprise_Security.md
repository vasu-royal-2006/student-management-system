# Enterprise Security Architecture

## 1. Authentication and Authorization

### 1.1 Overview
Security at the scale of 50,000+ students requires a Zero-Trust architecture. We implement stateless JWT authentication, Refresh Tokens, OAuth 2.0 integrations, and rigorous Role-Based Access Control (RBAC).

### 1.2 Purpose
To ensure that unauthorized actors cannot access sensitive Personally Identifiable Information (PII) or execute destructive commands (e.g., deleting student records), while maintaining a frictionless experience for valid administrators.

### 1.3 Technical Explanation
- **JWT (JSON Web Tokens):** Instead of storing server-side session IDs in Redis, the server issues a cryptographically signed JWT containing the user's `id` and `role`. The client sends this token in the `Authorization: Bearer` header.
- **Refresh Tokens:** To mitigate the risk of stolen JWTs, the Access Token expires every 15 minutes. A long-lived Refresh Token (stored in a secure, `HttpOnly` cookie) is used to silently request a new Access Token in the background.
- **OAuth 2.0:** Administrators can authenticate via their existing Microsoft Azure AD or Google Workspace university accounts, centralizing credential management.
- **Password Hashing:** Utilizing `bcrypt` with a salt factor of 12. Even if the database is compromised, passwords cannot be mathematically reversed.
- **RBAC:** Middleware decodes the JWT and inspects the `role`. If an `Admin` attempts to hit a `SuperAdmin` route, the middleware rejects the request with a `403 Forbidden` before the controller logic even executes.

### 1.4 Workflow (Login and Auth)
1. Admin submits credentials.
2. Server hashes the password and compares it to the DB via `bcrypt.compare()`.
3. Server generates an Access JWT (expires in 15m) and a Refresh JWT (expires in 7 days).
4. Access JWT is sent in the JSON payload; Refresh JWT is set as an `HttpOnly`, `Secure`, `SameSite=Strict` cookie.
5. React stores the Access JWT in RAM.
6. Axios interceptors automatically attach the Access JWT to all outbound requests.

### 1.5 Real-world Example
A disgruntled employee attempts to delete a cohort of 500 students. Because their JWT role is strictly mapped to `Staff` (not `SuperAdmin`), the RBAC middleware intercepts the `DELETE` request, prevents the database execution, and immediately triggers an alert to the IT Security Team.

### 1.6 Advantages
- **Stateless Scaling:** JWTs require zero database lookups to verify (the server just verifies the cryptographic signature), allowing the API to scale to thousands of requests per second effortlessly.

### 1.7 Best Practices
- **Never Store JWTs in LocalStorage:** LocalStorage is accessible via JavaScript and vulnerable to XSS. Store Access Tokens in memory, and Refresh Tokens in `HttpOnly` cookies.

### 1.8 Limitations
- **Token Invalidation:** Because JWTs are stateless, you cannot instantly "revoke" an active Access Token before it expires without implementing a complex Redis blacklist.

### 1.9 Future Improvements
- **Biometric MFA:** Integrating WebAuthn to require FaceID or YubiKey interaction for SuperAdmin destructive actions.

---

## 2. Threat Mitigation & Hardening

### 2.1 Overview
Beyond authentication, the Express.js application and React frontend are hardened against common OWASP Top 10 vulnerabilities including SQLi, XSS, and CSRF.

### 2.2 Purpose
To shield the infrastructure from malicious actors attempting to extract data, deface the application, or execute arbitrary code on the host servers.

### 2.3 Technical Explanation
- **SQL Injection Prevention:** Enforced universally via Parameterized Queries. The database driver sanitizes all inputs natively.
- **XSS (Cross-Site Scripting) Prevention:** React safely escapes all data before rendering JSX. Additionally, a strict Content Security Policy (CSP) is implemented via Helmet.
- **CSRF (Cross-Site Request Forgery) Prevention:** Because we do not rely on standard session cookies for authentication (we use `Bearer` tokens in headers), CSRF attacks are inherently mitigated. The `SameSite=Strict` flag on the Refresh Token cookie provides secondary defense.
- **Helmet.js:** Express middleware that sets 11 secure HTTP headers (e.g., `X-Frame-Options: DENY` prevents Clickjacking).
- **CORS (Cross-Origin Resource Sharing):** Configured to only accept requests originating from the verified production domain (`https://admin.university.edu`), blocking requests from unknown origins.
- **Rate Limiting:** `express-rate-limit` middleware restricts an IP address to 100 requests per 15 minutes, preventing brute-force password attacks and DDoS attempts.
- **Environment Variables & Secrets:** All database URIs, API keys, and JWT secrets are managed via a `.env` file injected by the CI/CD pipeline. Code repositories contain zero hardcoded secrets.
- **Audit Trails:** Every POST, PUT, and DELETE operation logs the `user_id` and `timestamp` to a separate `audit_logs` table for forensic analysis.

### 2.4 Workflow (Rate Limiting)
1. Attacker writes a script to guess admin passwords, firing 50 requests per second to `/api/login`.
2. The Rate Limiter middleware counts requests stored in Redis against the attacker's IP.
3. Upon hitting the 100th request, the server blocks the IP, responding with `429 Too Many Requests`.

### 2.5 Real-world Example
A student discovers the API endpoint URL and attempts to write a script to change their own GPA. Because they do not possess a valid JWT signed by the server's private key, the request fails with `401 Unauthorized`. Even if they try to overwhelm the server with requests, the Rate Limiter bans their IP address.

### 2.6 Advantages
- **Defense in Depth:** If one security layer fails (e.g., an XSS payload slips past validation), another layer (CSP headers) prevents the execution.

### 2.7 Best Practices
- **Input Sanitization:** Trust no user input. Even with parameterized queries, validate the format of the data (e.g., using `Joi` or `Zod` in Node.js) before it touches the business logic.

### 2.8 Limitations
- **False Positives:** Aggressive Rate Limiting might block a legitimate university building if all 50 admins are routing out through a single NAT IP address. 

### 2.9 Future Improvements
- **WAF Integration:** Deploying an AWS Web Application Firewall in front of the Node.js servers to block malicious traffic patterns before they even reach our application infrastructure.
