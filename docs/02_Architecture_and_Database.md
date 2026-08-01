# Chapter 5: Complete System Architecture

The Student Management System is constructed using a robust **3-Tier Architecture** alongside the **Client-Server Model**. This separation of concerns ensures that the application is highly scalable, secure, and maintainable.

## 5.1 Presentation Layer (Client Layer)
The Presentation Layer is the user-facing interface, built entirely with **React.js**. It is responsible for rendering the UI components, managing localized application state, and capturing user inputs.
- **Technologies:** React, HTML5, CSS3 (Vanilla), React Router, Axios.
- **Role:** It acts as a Single Page Application (SPA). When an administrator interacts with a form (e.g., adding a student), the Presentation Layer captures this data, performs initial client-side validation, and utilizes Axios to dispatch HTTP requests to the backend without triggering a full page reload.

## 5.2 Business Logic Layer (API Layer)
Acting as the intermediary, the Business Logic Layer is powered by **Node.js** and **Express.js**.
- **Role:** It exposes a set of RESTful API endpoints. When a request arrives from the Client Layer, this layer parses the JSON payload, applies core business logic (e.g., checking if a student is eligible for a major transfer), executes security protocols (validation, authentication), and dictates how the Data Layer should be manipulated.
- **Statelessness:** The API is designed to be stateless. Each request from the client contains all the information the server needs to fulfill that request.

## 5.3 Data Layer (Database Layer)
The foundation of the system is the Data Layer, utilizing a **Relational SQL Database (SQLite/MySQL)**.
- **Role:** It is strictly responsible for the persistent storage, retrieval, and management of structured data. It enforces data integrity through Primary Keys, Constraints, and Data Types.

## 5.4 Data Flow and Request Lifecycle
```text
[ Administrator ]
       | 1. Enters Data & Clicks Submit
       V
[ React Frontend ]
       | 2. Validates Input
       | 3. Axios sends POST HTTP request containing JSON
       V
[ Express.js Server ]
       | 4. Middleware parses JSON
       | 5. Router forwards to specific Controller
       | 6. Controller validates business rules
       V
[ Database Connection ]
       | 7. Executes Parameterized SQL Query (INSERT INTO...)
       V
[ SQL Database ]
       | 8. Database validates constraints (e.g. UNIQUE email)
       | 9. Returns success/failure confirmation
       V
[ Express.js Server ]
       | 10. Formats HTTP Response (e.g. 201 Created)
       V
[ React Frontend ]
       | 11. Receives JSON response
       | 12. Updates React State dynamically
       V
[ Administrator ]
         Views updated UI seamlessly
```

---

# Chapter 6: Complete Database Design

A meticulous database design is critical for ensuring instant record retrieval and absolute data integrity. The system employs a highly normalized Relational Database structure.

## 6.1 Database Schema and Tables

The core of the system currently revolves around the `students` table, though the architecture is designed to expand into a multi-table structure (e.g., separating departments and enrollments).

### Primary Table: `students`

| Column Name      | Data Type | Constraints                           | Description                                  |
| ---------------- | --------- | ------------------------------------- | -------------------------------------------- |
| `id`             | INTEGER   | PRIMARY KEY, AUTOINCREMENT            | Unique identifier for each student record.   |
| `firstName`      | TEXT      | NOT NULL                              | The student's legal first name.              |
| `lastName`       | TEXT      | NOT NULL                              | The student's legal last name.               |
| `email`          | TEXT      | NOT NULL, UNIQUE                      | The student's institutional email address.   |
| `major`          | TEXT      | NOT NULL                              | The department or degree program.            |
| `enrollmentDate` | TEXT      | None                                  | ISO formatted date string of enrollment.     |
| `gpa`            | REAL      | CHECK(gpa >= 0.0 AND gpa <= 4.0)      | Grade Point Average (Decimal).               |

## 6.2 Keys and Constraints
- **Primary Key (PK):** The `id` column serves as the primary key. It guarantees that every single row is uniquely identifiable. It is auto-incrementing, removing the burden of manual ID management from the administrator.
- **Foreign Keys (FK) [Future Scope]:** In subsequent iterations where a `departments` table is introduced, the `major` column will transition to `department_id`, acting as a Foreign Key referencing `departments(id)`.
- **UNIQUE Constraint:** Applied to the `email` column. The database engine physically rejects any `INSERT` or `UPDATE` operation attempting to introduce an email that already exists, preventing duplicate student profiles at the lowest architectural level.

## 6.3 Normalization
The database strictly adheres to the principles of normalization to eliminate redundant data and ensure dependencies make sense.
- **1st Normal Form (1NF):** All columns contain atomic values. For example, the student's name is split into `firstName` and `lastName` rather than a single `fullName` string, allowing for specific sorting and querying.
- **2nd Normal Form (2NF):** It is in 1NF, and all non-key attributes are fully functionally dependent on the primary key (`id`).
- **3rd Normal Form (3NF):** It is in 2NF, and there are no transitive dependencies. (e.g., The student's GPA depends directly on the student ID, not on their major).

## 6.4 Sample SQL Queries

**Creating the Table:**
```sql
CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    major TEXT NOT NULL,
    enrollmentDate TEXT,
    gpa REAL
);
```

**Optimized Retrieval (Read):**
```sql
SELECT id, firstName, lastName, major, gpa FROM students ORDER BY lastName ASC;
```

**Secure Parameterized Insertion (Create):**
```sql
INSERT INTO students (firstName, lastName, email, major, enrollmentDate, gpa) 
VALUES (?, ?, ?, ?, ?, ?);
```

**Accurate Update (Update):**
*(Using COALESCE allows the system to only update fields that were actually provided by the frontend)*
```sql
UPDATE students SET 
    firstName = COALESCE(?, firstName),
    major = COALESCE(?, major)
WHERE id = ?;
```

## 6.5 Indexing Strategy
To ensure the requirement of "Fast Record Retrieval", indexing is heavily utilized. 
By default, the Primary Key (`id`) creates a Clustered Index, making ID-based lookups mathematically instantaneous using a B-Tree structure.
Furthermore, because the `email` column is marked as `UNIQUE`, the SQL engine automatically generates a Non-Clustered Index for it. 
If the institution frequently searches by student names, a composite index would be applied:
```sql
CREATE INDEX idx_student_name ON students(lastName, firstName);
```
