# Enterprise Interview Mastery Guide

This document is designed to prepare software engineers for rigorous technical and behavioral interviews by utilizing the Student Management System as the core discussion project.

## 1. System Design & Architecture Questions

**Q: If the university grows to 500,000 students across 5 global campuses, how would you redesign this system?**
*Answer:* I would migrate from a single monolithic RDS instance to a distributed, sharded database (e.g., CockroachDB or AWS Aurora Global Database) partitioning data by `campus_id` to ensure data sovereignty and low latency for local read/writes. I would introduce an API Gateway (like Kong) to handle global rate-limiting and route traffic to regional Kubernetes clusters hosting the Node.js microservices. Caching via Redis would be heavily utilized for read-heavy operations like viewing course catalogs.

**Q: Why REST over GraphQL or gRPC for this specific project?**
*Answer:* For a purely administrative CRUD dashboard where the client and server are maintained by the same team, REST is highly predictable and leverages standard HTTP caching natively. gRPC would be overkill as we are not dealing with high-throughput internal microservice-to-microservice communication. While GraphQL prevents over-fetching, the administrative dashboard typically requires the entire student record anyway, negating GraphQL's primary benefit while introducing query complexity and N+1 database issues.

## 2. React & Frontend Questions

**Q: Explain how you optimized the React render cycle for a table with 50,000 rows.**
*Answer:* Rendering 50,000 DOM nodes simultaneously will cause the browser thread to lock up. I implemented "Windowing" (or Virtualization) using a library like `react-window`. This ensures only the ~20 rows currently visible in the viewport are actually injected into the DOM. As the user scrolls, the DOM nodes are recycled and populated with the next set of data. Additionally, I used `React.memo` on the Row components to prevent them from re-rendering unless their specific `student` prop changed.

**Q: How do you handle asynchronous race conditions in React when fetching data?**
*Answer:* If an admin searches for "A", then types "AB", the network request for "A" might resolve *after* the request for "AB", overwriting the correct state with stale data. I handle this by utilizing the `AbortController` API inside my `useEffect`. When a new search is initiated, the previous Axios request is explicitly aborted.

## 3. Node.js & Express Questions

**Q: Explain the Node.js Event Loop and why it is suitable for this backend.**
*Answer:* Node.js runs on a single main thread using non-blocking I/O. When an Express controller asks the database for 1,000 student records, Node does not halt and wait. It offloads the network/disk I/O to libuv and continues serving other HTTP requests. Once the database finishes, a callback is queued in the Event Loop to send the response. This makes Node incredibly efficient for I/O-heavy applications like CRUD dashboards.

**Q: How do you prevent Node.js from crashing entirely if a runtime exception is thrown?**
*Answer:* I wrap all asynchronous controller logic in a `try...catch` block and pass any caught errors to a global error-handling Express middleware using `next(err)`. At the infrastructure level, I use a process manager like PM2 or Docker restart policies to automatically restart the Node process if it exits with an error code.

## 4. Database (MySQL/SQL) Questions

**Q: What is the difference between a Clustered and Non-Clustered Index, and how are they used in this project?**
*Answer:* A Clustered Index dictates the physical storage order of the data on the disk. A table can only have one; in our system, it is the `student_id` Primary Key. A Non-Clustered index is a separate logical structure containing pointers to the physical rows. I created a Non-Clustered Index on the `email` column because administrators frequently query by email, transforming an O(N) table scan into an O(log N) B-Tree search.

**Q: How do you handle concurrent updates? (e.g., Two admins trying to update the same student's GPA simultaneously).**
*Answer:* I utilize Optimistic Concurrency Control. I would add a `version` integer column to the `students` table. When Admin A fetches the record, version is 1. When they submit the update, the query is: `UPDATE students SET gpa = 3.5, version = 2 WHERE id = 100 AND version = 1`. If Admin B already updated the record, the version would be 2, Admin A's query would affect 0 rows, and the API would return a `409 Conflict` prompting Admin A to refresh.

## 5. Security & Deployment Questions

**Q: How did you secure the JWT authentication?**
*Answer:* The Access Token has a very short lifespan (15 minutes). It is never stored in `localStorage` to prevent XSS theft; it is kept in memory. The Refresh Token is stored in a strict, `HttpOnly`, `Secure` cookie, making it inaccessible to client-side JavaScript. This mitigates both XSS and CSRF vectors.

**Q: Walk me through your CI/CD pipeline.**
*Answer:* When code is pushed to GitHub, GitHub Actions runs ESLint and Jest unit tests. If passed, the Dockerfile is built. The Docker image is tagged with the Git commit hash and pushed to AWS ECR. Finally, AWS ECS is signaled to perform a rolling update, spinning up the new containers and draining the old ones only after the new ones pass their HTTP health checks, ensuring zero-downtime deployment.

## 6. HR & Behavioral Questions (STAR Format)

**Q: Tell me about a time you had to make a technical compromise.**
*Situation:* The university wanted a real-time dashboard showing exactly how many students were logging into the portal per second. 
*Task:* I needed to implement WebSockets (Socket.io) across our load-balanced Node servers.
*Action:* I realized implementing and scaling sticky-sessions and a Redis Pub/Sub adapter for WebSockets would delay the project launch by 3 weeks. I proposed a compromise: implementing short-polling every 10 seconds on the frontend instead.
*Result:* This met the business requirement for "near real-time" data, saved 3 weeks of engineering time, and allowed us to launch the V1 product on schedule.

**Q: How do you handle negative feedback on your code?**
*Answer:* I view code reviews as a collaborative safeguard, not a personal attack. If a senior engineer points out a flaw (e.g., a missing database index in my migration file), I ask clarifying questions to understand the underlying engine mechanics I missed, apply the fix, and document the lesson so I don't repeat the mistake in future PRs.
