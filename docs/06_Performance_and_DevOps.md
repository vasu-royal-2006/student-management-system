# Enterprise Performance Engineering & DevOps

## 1. Performance Optimization

### 1.1 Overview
At the scale of 50,000+ active student records, rendering UI components and executing database queries naively will lead to browser crashes and server exhaustion. The system incorporates aggressive optimizations across the React frontend and Node backend.

### 1.2 Purpose
To ensure the administrative dashboard remains responsive (under 100ms interaction latency) and the backend API responds under 200ms at the 95th percentile, maximizing administrative productivity.

### 1.3 Technical Explanation
- **Frontend (React):**
  - *Lazy Loading & Code Splitting:* React dynamically loads components (like the "Settings" or "Reports" views) only when the user routes to them, reducing the initial JavaScript bundle size from 2MB to 200KB.
  - *Memoization:* Utilizing `React.useMemo` and `React.useCallback` prevents expensive re-renders of the large data table when unrelated state (like opening a modal) changes.
  - *Virtualization:* Instead of rendering 50,000 HTML `<tr>` elements (which would crash the browser), `react-window` is used to only render the 20 rows currently visible on the screen.
  - *Debouncing:* Search inputs are wrapped in a 300ms debounce function. Typing "John" fires one API request after the user stops typing, rather than four requests.
- **Backend (Node.js/SQL):**
  - *Pagination:* The API enforces a `LIMIT` and `OFFSET`. The frontend never receives 50,000 records at once.
  - *Caching:* Redis sits in front of the database. A query for "All Departments" is cached for 24 hours since it rarely changes, dropping DB load by 15%.
  - *Connection Pooling:* Node.js maintains 10 persistent connections to the SQL database, avoiding the massive TCP handshake overhead of opening a new connection per request.
  - *Compression:* Express uses `compression` middleware to GZIP JSON payloads, reducing network transfer sizes by up to 70%.

### 1.4 Workflow (Caching)
1. Request hits `GET /api/v1/students?major=CS`.
2. Controller checks Redis for the key `students:CS`.
3. If Cache Hit: Returns Redis data immediately (2ms).
4. If Cache Miss: Queries SQL (50ms), saves the result to Redis with a 5-minute TTL, and returns data to the client.

### 1.5 Real-world Example
During the initial rollout, administrators complained the dashboard froze for 5 seconds upon loading. The issue was the React frontend attempting to parse and render 20,000 rows simultaneously. Implementing **Virtualization** reduced the DOM nodes from 20,000 to 30, instantly fixing the freeze and dropping memory usage by 90%.

### 1.6 Advantages
- **UX & Scalability:** Users experience desktop-native performance on the web, and servers can handle 10x more concurrent users on the same hardware.

### 1.7 Best Practices
- **Asset Optimization & CDN:** All static assets (images, CSS) should be optimized, minified, and served from a global CDN (Content Delivery Network) like Cloudflare to reduce geographic latency.

### 1.8 Limitations
- **Cache Invalidation:** Caching introduces the "Stale Data" problem. If a student is updated, the Redis cache must be explicitly purged, which adds complexity to the PUT/DELETE controllers.

### 1.9 Future Improvements
- **Tree Shaking:** Configuring Vite/Rollup to aggressively remove unused CSS and JavaScript functions from the final production bundle.

---

## 2. DevOps & Continuous Deployment

### 2.1 Overview
Enterprise software requires rigorous, automated deployment pipelines. Code is never manually FTP'd to a server. We utilize Git, GitHub Actions, Docker, and orchestrated deployment strategies.

### 2.2 Purpose
To eliminate human error during deployments, ensure code is thoroughly tested before reaching production, and enable rapid rollback capabilities if a bug is introduced.

### 2.3 Technical Explanation
- **Git Workflow (GitFlow):** Developers branch off `develop` into `feature/xyz`. Pull Requests (PRs) require 2 approvals before merging. 
- **CI/CD Pipeline (GitHub Actions):** 
  - *Continuous Integration (CI):* Every PR triggers a GitHub Action that runs ESLint, compiles the code, and executes Jest Unit Tests. If tests fail, the PR cannot be merged.
  - *Continuous Deployment (CD):* Merging to the `main` branch triggers the deployment pipeline.
- **Containerization (Docker):** The Node.js application is packaged into a Docker image with an explicit Node Alpine version. This guarantees "it works on my machine" translates perfectly to "it works in production."
- **Environment Variables:** Handled by the deployment platform (e.g., AWS Parameter Store). Docker containers pull these variables at runtime.
- **Rollback Strategy:** Because deployments are just Docker image swaps, rolling back a catastrophic bug is as simple as reverting the load balancer to point to the previous Docker image hash (taking seconds instead of minutes).

### 2.4 Workflow (Deployment)
1. Developer merges PR to `main`.
2. GitHub Action detects merge, checks out code.
3. Action runs `npm test`.
4. Action builds Docker Image: `docker build -t sms-backend:latest .`
5. Action pushes Image to AWS ECR (Elastic Container Registry).
6. Action triggers AWS ECS to gracefully drain old containers and start the new containers.

### 2.5 Real-world Example
A critical security patch for Express.js was released. A developer updated the package, created a PR, and merged it. The automated CI/CD pipeline built the new Docker image and deployed it to production across 5 servers in exactly 4 minutes, with zero downtime, and without the developer ever SSH-ing into a server.

### 2.6 Advantages
- **Zero Downtime Deployments:** Orchestrators like Kubernetes or ECS handle rolling updates, meaning the system remains 100% available to administrators while the software is being upgraded in the background.

### 2.7 Best Practices
- **Infrastructure as Code (IaC):** Use Terraform to provision the servers and databases. Infrastructure should be version-controlled exactly like application code.

### 2.8 Limitations
- **Pipeline Complexity:** Maintaining complex Dockerfiles, YAML workflows, and CI/CD scripts requires specialized DevOps engineering knowledge and constant upkeep.

### 2.9 Future Improvements
- **Canary Releases:** Deploying the new version of the software to only 5% of the administrative staff first, monitoring error logs, and automatically rolling back if error rates spike.
