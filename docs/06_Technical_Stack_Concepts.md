# Chapter 12: Frontend Architecture

The frontend is engineered as a modern Single Page Application (SPA) utilizing Vite as the build tool for unparalleled development speed and optimized production bundling.

## 12.1 Folder Structure
```text
/frontend
 ├── public/           # Static assets
 ├── src/
 │    ├── components/  # Reusable UI elements (StudentList.jsx, StudentForm.jsx)
 │    ├── App.jsx      # Main layout and global state container
 │    ├── main.jsx     # React entry point, mounting to the DOM
 │    └── index.css    # Core design system and CSS variables
 ├── package.json      # Dependencies (react, axios, vite)
 └── vite.config.js    # Bundler configuration
```

## 12.2 State Management and Components
Rather than relying on heavy global state managers like Redux for a straightforward CRUD application, state is lifted to the highest necessary component (`App.jsx`) and passed down via props. 
- **Reusable Components:** `StudentList.jsx` is entirely decoupled from the data fetching logic. It receives an array of students via props and blindly renders them. This makes the component highly reusable (e.g., it could be reused on a specific "Department Roster" page simply by passing it a filtered array).

---

# Chapter 13: Backend Architecture

The Node.js backend acts as the authoritative Business Logic layer.

## 13.1 Folder Structure
```text
/backend
 ├── routes/
 │    └── students.js  # API route definitions and Controller logic
 ├── database.js       # SQLite connection and schema initialization
 ├── server.js         # Express app instantiation and Middleware configuration
 └── package.json      # Dependencies (express, cors, sqlite3)
```

## 13.2 Routes and Controllers
The `server.js` file maintains a clean footprint by delegating route handling. It maps the `/api/students` prefix to the `routes/students.js` file. This modular router file contains both the routing definitions (e.g., `router.get`) and the inline controller logic (e.g., interacting with the database and sending the JSON response). As the application scales, these will be further separated into dedicated `controllers` and `services` directories.

---

# Chapter 14: React Concepts Used

The frontend extensively leverages core React concepts to deliver a highly interactive user experience.

- **Components:** The UI is broken down into independent, reusable pieces (`App`, `StudentList`, `StudentForm`).
- **Props:** Data flows unilaterally downwards. `App.jsx` passes the `students` array to `StudentList` as a Prop. Functions (like `handleEditStudent`) are also passed as props, allowing child components to trigger state changes in the parent.
- **State & useState Hook:** Local variables that dictate what the UI renders. `const [students, setStudents] = useState([])` manages the roster. When `setStudents` is called, React automatically re-renders the DOM to reflect the changes.
- **useEffect Hook:** Used for side effects, specifically data fetching. The empty dependency array `[]` ensures the API is called exactly once when the dashboard initially mounts.
- **Forms & Controlled Inputs:** Form fields are bound to React state. An `onChange` event updates the state, ensuring React is the single source of truth for the input values, making validation and submission seamless.
- **Conditional Rendering:** Utilizing ternary operators (e.g., `{student ? 'Edit Profile' : 'Add New'}`) to reuse the same modal component for both Create and Update workflows.

---

# Chapter 15: Node.js Concepts Used

The backend relies on Node.js conventions for asynchronous processing and API routing.

- **Express & REST APIs:** Express is a minimal routing framework that simplifies handling HTTP verbs (GET, POST, PUT, DELETE) and defining precise RESTful endpoints.
- **Middleware:** `app.use(express.json())` is a built-in middleware that intercepts incoming network requests, parses any JSON payload in the HTTP body, and attaches it to the `req.body` object before it reaches the route handler. `app.use(cors())` manages Cross-Origin Resource Sharing.
- **Asynchronous Execution:** Database queries inherently involve disk I/O, which takes time. Node's non-blocking, event-driven architecture ensures that while waiting for the database to return records, the server can continue processing other incoming requests.

---

# Chapter 16: SQL Concepts Used

The relational database architecture requires strict adherence to SQL paradigms.

- **DDL (Data Definition Language):** Utilized during initialization. `CREATE TABLE IF NOT EXISTS` defines the exact schema, data types (TEXT, INTEGER, REAL), and constraints (PRIMARY KEY) before any data is ever inserted.
- **DML (Data Manipulation Language):** The core CRUD operations. `INSERT` (Create), `SELECT` (Read), `UPDATE` (Update), and `DELETE` (Delete) are used to manipulate the records.
- **Constraints & Normalization:** Applying `UNIQUE` on the email column acts as a physical barrier against duplicated records. By extracting properties logically (normalization), update anomalies are prevented.
- **COALESCE:** A highly optimized SQL function used during the UPDATE operation (`firstName = COALESCE(?, firstName)`). It instructs the database: "If a new first name is provided, use it; otherwise, fall back to the existing first name." This allows the backend to perform partial updates securely without overwriting existing data with NULL values.
