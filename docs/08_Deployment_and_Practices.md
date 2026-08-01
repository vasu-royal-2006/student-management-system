# Chapter 22: Deployment

Transitioning the application from a local development environment (`localhost`) to a production server requires distinct deployment strategies for the decoupled frontend and backend.

## 22.1 Frontend Deployment (Vercel / Netlify)
The React SPA is purely static HTML, CSS, and JS once built.
- **Workflow:** 
  1. Push the `frontend` directory to GitHub.
  2. Connect the repository to Vercel.
  3. Vercel automatically runs the `npm run build` command defined in Vite.
  4. The output `/dist` folder is deployed globally via Vercel's Edge CDN.

## 22.2 Backend Deployment (Render / Railway)
The Node.js API requires an active server runtime environment.
- **Workflow:**
  1. Push the `backend` directory to GitHub.
  2. Connect the repository to Render (Web Service).
  3. Define the start command: `node server.js`.
  4. Define Environmental Variables (e.g., `PORT`, `DATABASE_URL`).
  5. Render provisions a Linux container, installs dependencies (`npm install`), and binds the Express server to a public URL.

## 22.3 Database Deployment (AWS RDS / DigitalOcean Managed Databases)
While SQLite is excellent for local development, production requires a concurrent database server like MySQL or PostgreSQL.
- **Workflow:** Spin up a managed MySQL instance on DigitalOcean. Update the Node.js backend to connect to this remote URI via environment variables instead of a local SQLite file.

---

# Chapter 24: Software Engineering Practices

The project strictly adheres to industry-standard paradigms to ensure maintainability and scalability.

## 24.1 Separation of Concerns (MVC)
While modern React blurs the lines of traditional MVC, the core principles remain:
- **Model:** The SQL Database strictly handles data schemas and integrity.
- **View:** React strictly handles presentation and UI logic.
- **Controller:** Express.js strictly handles API routing, parsing, and business logic bridging the View and Model.

## 24.2 DRY (Don't Repeat Yourself)
Code duplication is minimized. For example, the `StudentForm` component is entirely reused for both the "Create" and "Update" workflows, dynamically adjusting its title and API endpoint based on whether a `student` prop was passed to it.

## 24.3 KISS (Keep It Simple, Stupid)
The architecture avoids over-engineering. A lightweight SQLite database and simple React state management (avoiding Redux) were chosen to fulfill the specific requirements without introducing unnecessary complexity.

## 24.4 Clean Code
Variables and functions are named declaratively (`handleEditStudent`, `fetchStudents`, `dbPath`). Hardcoded magic numbers are avoided. API routes follow logical, predictable REST conventions.

---

# Chapter 25: Folder Structure

The complete structure of the application emphasizes a strict separation between client-side and server-side code.

```text
Student Management System/
│
├── package.json             # Root package for concurrent execution
├── README.md                # Master documentation
├── docs/                    # Extensive technical documentation suite
│
├── backend/                 # Node.js API Layer
│   ├── node_modules/
│   ├── routes/
│   │   └── students.js      # Express router & controllers
│   ├── database.js          # SQLite connection
│   ├── server.js            # Express entry point
│   └── package.json
│
└── frontend/                # React Presentation Layer
    ├── node_modules/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── StudentList.jsx  # Data table component
    │   │   └── StudentForm.jsx  # Data entry modal component
    │   ├── App.jsx          # Main Dashboard Layout
    │   ├── main.jsx         # React DOM insertion
    │   └── index.css        # Vanilla CSS Design System
    ├── package.json
    └── vite.config.js
```
