# Enterprise API Documentation (RESTful)

## 1. API Architectural Overview

### 1.1 Overview
The Student Management System API exposes a suite of stateless RESTful endpoints designed to facilitate communication between the React presentation layer and the SQL data layer. It adheres to strict JSON payload structures and standard HTTP response codes.

### 1.2 Purpose
To decouple the client application from the database, centralizing all business logic, validation, and security protocols within a unified API gateway. This enables multi-channel consumption (Web, iOS, Android, third-party integrations).

### 1.3 Technical Explanation
- **Statelessness:** No client context is stored on the server between requests. Every request contains a JWT authorizing the action.
- **Content Negotiation:** The API strictly accepts and returns `application/json`.
- **Idempotency:** HTTP GET, PUT, and DELETE methods are designed to be idempotent; executing them multiple times yields the same database state.

### 1.4 Workflow (General)
1. Client generates a request (e.g., via Axios).
2. The request hits the Node.js API Gateway.
3. Middleware validates the JWT Auth Header.
4. Express Router forwards to the specific Endpoint Controller.
5. Controller interacts with the SQL Database and returns a standard JSON response.

### 1.5 Real-world Example
When the Mobile Team wants to build a "Student GPA Checker" app, they do not need to understand our SQL schema. They simply send an authenticated `GET` request to `/api/students/:id`, and the API returns the exact JSON structure they need.

### 1.6 Advantages
- **Interoperability:** Any system capable of sending an HTTP request can interact with the SMS.

### 1.7 Best Practices
- **Versioning:** Endpoints should be versioned in production (e.g., `/api/v1/students`) so that introducing breaking changes in `v2` does not crash legacy client applications.

### 1.8 Limitations
- **Over-fetching / Under-fetching:** REST APIs dictate the structure of the response. If the client only needs the student's `firstName`, the `GET` endpoint still returns the entire object, wasting bandwidth.

### 1.9 Future Improvements
- **Swagger/OpenAPI UI Integration:** Generating a live, interactive Swagger UI dashboard where developers can test endpoints directly in the browser without requiring Postman.

---

## 2. API Endpoint Specifications

### 2.1 Fetch All Students

- **Purpose:** Retrieve the paginated master roster of students.
- **Description:** Queries the database for all active student records, restricted by RBAC (Role-Based Access Control).
- **HTTP Method:** `GET`
- **URL:** `/api/v1/students`
- **Headers:** 
  - `Content-Type: application/json`
  - `Authorization: Bearer <token>`
- **Authentication:** Required (JWT)
- **Permissions:** Admin, SuperAdmin
- **Path Parameters:** None
- **Query Parameters:** 
  - `limit` (Optional, default 50): Number of records per page.
  - `offset` (Optional, default 0): Number of records to skip.
- **Request JSON:** None
- **Validation Rules:** Valid JWT token required.

**Example cURL Request:**
```bash
curl -X GET "http://localhost:5000/api/v1/students?limit=10" \
     -H "Authorization: Bearer eyJhbG..." \
     -H "Content-Type: application/json"
```

**Axios Request Example:**
```javascript
const response = await axios.get('/api/v1/students', {
  params: { limit: 10 },
  headers: { Authorization: `Bearer ${token}` }
});
```

**JavaScript Fetch Example:**
```javascript
const response = await fetch('/api/v1/students?limit=10', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
const data = await response.json();
```

**Success Response (200 OK):**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@university.edu",
      "major": "Computer Science",
      "gpa": 3.8
    }
  ],
  "meta": { "totalRecords": 50000, "limit": 10, "offset": 0 }
}
```

**Error Responses:**
- `401 Unauthorized`: Invalid or missing token.
- `403 Forbidden`: Valid token, but user lacks Admin permissions.
- `500 Internal Server Error`: Database connection failure.

**Performance Notes:** Highly optimized using non-clustered indexes on queried fields. Cached via Redis for 60 seconds to reduce DB load.

---

### 2.2 Create New Student

- **Purpose:** Register a new student in the database.
- **Description:** Accepts a JSON payload, validates the inputs, and inserts a new row into the `students` table.
- **HTTP Method:** `POST`
- **URL:** `/api/v1/students`
- **Headers:** 
  - `Content-Type: application/json`
  - `Authorization: Bearer <token>`
- **Authentication:** Required
- **Permissions:** Admin, SuperAdmin
- **Request JSON:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane.smith@university.edu",
  "major": "Mechanical Engineering"
}
```
- **Validation Rules:**
  - `firstName`, `lastName`, `major`: Cannot be null or empty string.
  - `email`: Must match standard email regex. Must be universally unique in the database.

**Axios Request Example:**
```javascript
const response = await axios.post('/api/v1/students', 
  { firstName: "Jane", lastName: "Smith", email: "jane@u.edu", major: "ME" },
  { headers: { Authorization: `Bearer ${token}` } }
);
```

**Success Response (201 Created):**
```json
{
  "status": "success",
  "message": "Student created successfully.",
  "data": { "id": 50001 }
}
```

**Error Responses:**
- `400 Bad Request`: "Missing required fields" or "Invalid email format".
- `409 Conflict`: "Email already exists in the system."

**Performance Notes:** Triggers database recalculation of the B-Tree index on the `email` column.

---

### 2.3 Update Existing Student

- **Purpose:** Modify a student's profile partially or entirely.
- **Description:** Uses the SQL `COALESCE` function to safely apply partial updates based on the provided JSON keys.
- **HTTP Method:** `PUT`
- **URL:** `/api/v1/students/:id`
- **Path Parameters:**
  - `id` (Required): The unique integer ID of the student.
- **Request JSON (Partial Update):**
```json
{
  "gpa": 3.9
}
```

**Axios Request Example:**
```javascript
await axios.put(`/api/v1/students/${studentId}`, { gpa: 3.9 }, { headers: { Authorization: `Bearer ${token}` } });
```

**Success Response (200 OK):**
```json
{
  "status": "success",
  "message": "Record updated.",
  "data": { "changes": 1 }
}
```

**Error Responses:**
- `404 Not Found`: Student ID does not exist.

---

### 2.4 Delete Student

- **Purpose:** Erase a student record permanently.
- **HTTP Method:** `DELETE`
- **URL:** `/api/v1/students/:id`
- **Authentication:** Required
- **Permissions:** SuperAdmin ONLY.

**Success Response (200 OK):**
```json
{
  "status": "success",
  "message": "Student deleted permanently.",
  "data": { "deletedRows": 1 }
}
```

**Performance Notes:** If foreign keys with `ON DELETE CASCADE` are present, this operation may be I/O heavy as it traverses related tables.
