# Manuals & Technical Guides

## 1. Developer Guide & Complete Folder Structure

### 1.1 Overview
This guide provides onboarding developers with a highly granular view of the project's topography. The structure adheres to MVC and clean-code principles, ensuring a predictable development environment.

### 1.2 Purpose
To drastically reduce the onboarding time for new software engineers. By enforcing a strict structural convention, developers know exactly where to locate validation logic, database queries, and UI components without searching globally.

### 1.3 Technical Explanation (Folder Structure)

```text
Student Management System/
│
├── .github/
│   └── workflows/
│       └── deploy.yml              # CI/CD GitHub Actions Pipeline Configuration
│
├── backend/                        # Node.js API Service
│   ├── .env                        # Environment Secrets (DB Passwords, JWT Secrets)
│   ├── package.json
│   ├── Dockerfile                  # Containerization instructions
│   │
│   ├── config/                     # Configuration singletons
│   │   └── database.js             # DB Connection pooling and initialization
│   │
│   ├── controllers/                # Business logic and request handling
│   │   ├── authController.js       # Login, token generation
│   │   └── studentController.js    # CRUD logic for students
│   │
│   ├── middlewares/                # Express middleware chain
│   │   ├── authMiddleware.js       # JWT decoding and verification
│   │   ├── rbacMiddleware.js       # Role-Based Access Control logic
│   │   └── errorMiddleware.js      # Global error handler (try/catch interceptor)
│   │
│   ├── models/ (or repositories/)  # Data Access Layer (SQL interactions)
│   │   └── studentModel.js         # SQL Parameterized Queries (SELECT, INSERT)
│   │
│   ├── routes/                     # API routing definitions
│   │   ├── authRoutes.js           # maps /api/auth -> authController
│   │   └── studentRoutes.js        # maps /api/students -> studentController
│   │
│   ├── utils/                      # Helper functions
│   │   ├── logger.js               # Winston logging configurations
│   │   └── validators.js           # Regex and input sanitization functions
│   │
│   └── server.js                   # Application entry point, mounts routes
│
└── frontend/                       # React Presentation Layer
    ├── .env                        # Vite environment variables (VITE_API_URL)
    ├── package.json
    ├── vite.config.js              # Rollup bundling settings
    │
    ├── public/                     # Static served assets (favicons, robots.txt)
    │
    ├── src/
    │   ├── assets/                 # Compiled assets (images, global SVGs)
    │   │
    │   ├── components/             # Reusable UI fragments
    │   │   ├── common/             # Generic components (Buttons, Modals, Inputs)
    │   │   └── layout/             # Navbar, Sidebar, Footer
    │   │
    │   ├── pages/                  # Routable view components
    │   │   ├── DashboardPage.jsx   # Contains StudentList and stats
    │   │   └── LoginPage.jsx       # Authentication UI
    │   │
    │   ├── hooks/                  # Custom React Hooks
    │   │   └── useAuth.js          # manages JWT token state and expiration
    │   │
    │   ├── services/               # API interaction layer
    │   │   └── api.js              # Axios instance configuration (Interceptors)
    │   │
    │   ├── contexts/               # Global state providers
    │   │   └── AuthContext.jsx     # Provides user object to React tree
    │   │
    │   ├── styles/                 # Global CSS and Design Tokens
    │   │   └── index.css           # Glassmorphism variables
    │   │
    │   ├── App.jsx                 # React Router definitions
    │   └── main.jsx                # React DOM Mount
```

### 1.4 Workflow (Adding a New Feature)
1. **Database:** Add a new table/column in `backend/config/database.js`.
2. **Model:** Write the SQL query inside `backend/models/`.
3. **Controller:** Write the request logic inside `backend/controllers/`.
4. **Route:** Expose the endpoint in `backend/routes/`.
5. **Service:** Add an Axios fetch function in `frontend/src/services/api.js`.
6. **Component:** Build the UI in `frontend/src/components/`.
7. **Page:** Assemble the components in `frontend/src/pages/`.

---

## 2. Administrator Manual

### 2.1 Overview
This manual provides operational instructions for authorized University Administrators utilizing the web dashboard.

### 2.2 Security Guidelines
- **Authentication:** Access requires a valid University Email and password. Do not share credentials. Sessions automatically timeout after 15 minutes of inactivity.
- **Audit Trails:** Be advised that all actions (Create, Update, Delete) are cryptographically logged to your specific user ID.

### 2.3 Dashboard Navigation
- **Primary View:** Upon login, the master Student Roster is displayed.
- **Adding a Record:** Click the prominent `+ Add New Student` button in the top right. Ensure all fields marked with an asterisk (*) are filled. Email addresses must be universally unique; the system will reject duplicates.
- **Editing a Record:** Locate the student via the Search bar (future) or pagination, and click the `Edit (✎)` icon. Only modify the fields requiring changes. Leaving a field untouched preserves its original data.
- **Deleting a Record (SuperAdmin Only):** Click the `Delete (🗑)` icon. A destructive warning prompt will appear. **Warning:** Deletions are cascaded. Deleting a student irreversibly deletes their financial and academic histories. Proceed with extreme caution.

---

## 3. Installation & Maintenance Guide

### 3.1 Local Environment Setup
1. Clone the repository: `git clone https://github.com/org/sms.git`
2. Install concurrent dependencies: `npm install` in the root directory.
3. Establish Environment Variables:
   - Create `backend/.env`: Provide `PORT=5000` and `JWT_SECRET=super_secure_string`.
   - Create `frontend/.env`: Provide `VITE_API_URL=http://localhost:5000`.
4. Run unified development server: `npm run dev`.

### 3.2 Maintenance and Updates
- **Dependency Auditing:** Run `npm audit` monthly to identify and patch security vulnerabilities in external packages (e.g., Express or React).
- **Database Backup Verification:** Test restoring the SQLite/MySQL database from the automated nightly backup at least once per quarter on a staging server to verify backup integrity.
- **Log Rotation:** Ensure Winston/Morgan backend logs are rotating weekly to prevent the server's hard drive from filling up with textual log data.
