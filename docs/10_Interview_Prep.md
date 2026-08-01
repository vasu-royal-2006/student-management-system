# Chapter 28: Interview Preparation

This section provides a rigorous preparation guide for a Full Stack Software Engineering interview, based directly on the architecture and technologies used in the Student Management System.

## 28.1 Technical Questions (Architecture)
**Q1: Why did you choose a 3-tier architecture over a monolithic MVC framework like Django or Ruby on Rails?**
*Answer:* A decoupled 3-tier architecture (React frontend, Node API, SQL Database) allows the frontend and backend to scale independently. If we decide to build a mobile app later, the mobile app can consume the exact same Node.js REST API without any backend modifications. A monolithic application would require tight coupling between the views and the controllers, making cross-platform expansion difficult.

**Q2: What is the difference between client-side rendering (CSR) and server-side rendering (SSR), and which does your app use?**
*Answer:* My app uses CSR via React (Vite). In CSR, the server sends a barebones HTML file and a bundle of JavaScript. The browser executes the JS to render the UI dynamically. In SSR (like Next.js), the server generates the full HTML per request. CSR is ideal for this dashboard because once loaded, subsequent interactions (like opening the Edit modal) are lightning fast and do not require network requests for UI changes, only for data payloads.

## 28.2 React Questions
**Q3: Explain the component lifecycle and how you handled it in functional components.**
*Answer:* In class components, we had `componentDidMount` and `componentWillUnmount`. In my application, I use the `useEffect` hook. To fetch the student list when the dashboard loads, I pass an empty dependency array `[]` to `useEffect`, mimicking `componentDidMount`, ensuring the Axios request fires exactly once.

**Q4: How did you manage state without Redux?**
*Answer:* For a CRUD application of this scope, Redux introduces unnecessary boilerplate. I utilized 'Lifting State Up'. The `students` array is held in `App.jsx` (the parent). I passed the state down as props to `StudentList` for rendering, and passed the `refreshStudents` function down to `StudentForm` so the child could trigger a state update in the parent after a successful POST request.

## 28.3 Node.js & Express Questions
**Q5: Node.js is single-threaded. How does it handle multiple concurrent requests without blocking?**
*Answer:* Node utilizes the Event Loop and asynchronous non-blocking I/O. When an Express route receives a request that requires a database query, it offloads that I/O task to the system kernel (via libuv). The main thread continues serving other client requests. Once the database returns the data, a callback is placed in the event queue to formulate and send the JSON response.

**Q6: What is middleware in Express? How did you use it?**
*Answer:* Middleware are functions that have access to the request object (`req`), response object (`res`), and the `next` function in the application's request-response cycle. I used `express.json()` as middleware to automatically parse incoming JSON payloads into JS objects, and `cors()` to manage Cross-Origin Resource Sharing security policies.

## 28.4 SQL & Database Questions
**Q7: Explain Normalization and how it applies to your schema.**
*Answer:* Normalization minimizes data redundancy. In 1NF, I ensured all columns (like `firstName` and `lastName`) were atomic. In 3NF, I ensured no transitive dependencies existed. For example, if we add departments, we wouldn't store "Department Head Name" in the `students` table, because it depends on the Department, not the Student ID. We would use a Foreign Key instead.

**Q8: What is SQL Injection, and how did you prevent it?**
*Answer:* SQL Injection is when a malicious user inputs SQL commands into a form (e.g., `'; DROP TABLE students; --`) to manipulate the database. I prevented this entirely by using Parameterized Queries. The database driver treats the user input strictly as a literal value to be inserted, not as executable SQL code.

**Q9: Why did you use `COALESCE` in your UPDATE query?**
*Answer:* `COALESCE` returns the first non-null value in a list. In my `PUT` endpoint, I wrote `firstName = COALESCE(?, firstName)`. If the client only wants to update the GPA, they don't send the `firstName`. The parameter arrives as `undefined/null`. `COALESCE` sees the null, and falls back to the existing `firstName` value in the database, allowing for secure, partial updates.

## 28.5 HR & Behavioral Questions
**Q10: What was the most challenging technical hurdle you faced in this project?**
*Answer:* Ensuring data synchronization between the React state and the backend database. Initially, if an update failed on the server but succeeded in the local React state, the user saw false data. I solved this by strictly awaiting the HTTP `200 OK` response from the server *before* calling `refreshStudents()` to re-sync the UI with the ultimate source of truth.

**Q11: If you had 2 more weeks to work on this, what would you add?**
*Answer:* I would implement JWT-based authentication to secure the API routes, add a Redis cache layer for the `GET /students` route to improve read performance at scale, and implement server-side pagination to handle datasets of 10,000+ students without degrading frontend performance.
