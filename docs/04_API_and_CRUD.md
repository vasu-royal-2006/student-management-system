# Chapter 9: Complete CRUD Workflow

This chapter details the exact internal sequence of events that transpires when the core CRUD (Create, Read, Update, Delete) operations are executed. 

## 9.1 Create Workflow (POST)
**Scenario:** An administrator adds a new student.
1. **Frontend Flow:** The admin fills out `StudentForm.jsx`. The form's `onSubmit` event handler triggers. The default browser submission is prevented (`e.preventDefault()`). The local React state (`formData`) containing the inputs is bundled into a JSON object.
2. **API Call:** Axios executes `axios.post('http://localhost:5000/api/students', formData)`.
3. **Backend Flow:** Express.js intercepts the request at `router.post('/')`. It destructures the JSON payload from `req.body`.
4. **Validation & Database:** The backend verifies that `firstName`, `lastName`, `email`, and `major` are present. If valid, it prepares the SQL `INSERT` query. 
5. **Execution:** `db.run(sql, params)` is executed. The SQL engine enforces the `UNIQUE` email constraint.
6. **Response:** If successful, the server responds with HTTP Status `200 OK` (or ideally `201 Created`) along with the new `studentId`.
7. **Resolution:** The frontend receives the success response, closes the modal, and calls `refreshStudents()` to re-fetch the complete updated list.

## 9.2 Read Workflow (GET)
**Scenario:** The administrator opens the dashboard.
1. **Frontend Flow:** The `App.jsx` component mounts. The `useEffect` hook triggers the `fetchStudents` function immediately.
2. **API Call:** Axios executes an asynchronous `axios.get('http://localhost:5000/api/students')`.
3. **Backend Flow:** Express.js intercepts the request at `router.get('/')`.
4. **Database Execution:** It runs a simple `SELECT * FROM students` query. The database engine retrieves all rows from the disk.
5. **Response:** The backend formats the SQL rows into a JSON Array and sends it back with HTTP Status `200 OK`.
6. **Resolution:** React receives the JSON array, calls `setStudents(response.data)`, which updates the state. This state change triggers a re-render of `StudentList.jsx`, mapping the array into HTML table rows.

## 9.3 Update Workflow (PUT)
**Scenario:** An administrator changes a student's GPA.
1. **Frontend Flow:** The admin clicks Edit, modifies the GPA in the modal, and clicks Save.
2. **API Call:** Axios executes `axios.put('http://localhost:5000/api/students/:id', formData)`. The ID is dynamically injected into the URL.
3. **Backend Flow:** Express.js intercepts the request at `router.put('/:id')`. It extracts the ID from `req.params` and the modified data from `req.body`.
4. **Database Execution:** The backend runs the `UPDATE` query utilizing `COALESCE`, guaranteeing that only the fields explicitly provided in the payload overwrite the database.
5. **Response:** The database returns the number of changes made. The backend responds with `200 OK`.
6. **Resolution:** The frontend closes the modal and re-fetches the list to reflect the updated GPA.

## 9.4 Delete Workflow (DELETE)
**Scenario:** An administrator removes a student.
1. **Frontend Flow:** The admin clicks Delete. A `window.confirm` dialog prompts for verification. Upon 'Yes', the function continues.
2. **API Call:** Axios executes `axios.delete('http://localhost:5000/api/students/:id')`.
3. **Backend Flow:** Express.js intercepts at `router.delete('/:id')`.
4. **Database Execution:** Runs `DELETE FROM students WHERE id = ?`.
5. **Response:** Backend responds with `200 OK` indicating the number of rows deleted (should be 1).
6. **Resolution:** The frontend calls `refreshStudents()`, pulling the new list from the server which no longer contains the deleted student, seamlessly updating the UI.

---

# Chapter 10: REST API Documentation

The backend exposes a professional, REST-compliant Application Programming Interface (API). All endpoints are prefixed with `/api/students`.

## 10.1 Retrieve All Students
**Purpose:** Fetch the complete roster of students.
- **URL:** `/api/students`
- **Method:** `GET`
- **Headers:** `None`
- **Body:** `None`
- **Success Response (200 OK):**
```json
[
  {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@university.edu",
    "major": "Computer Science",
    "enrollmentDate": "2023-09-01",
    "gpa": 3.8
  }
]
```
- **Error Response (500 Internal Server Error):**
```json
{ "error": "Database connection failed" }
```

## 10.2 Add New Student
**Purpose:** Create a new student record.
- **URL:** `/api/students`
- **Method:** `POST`
- **Headers:** `Content-Type: application/json`
- **Validation:** `firstName`, `lastName`, `email`, and `major` must not be null.
- **Example Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane.smith@university.edu",
  "major": "Mechanical Engineering",
  "enrollmentDate": "2024-01-15",
  "gpa": 4.0
}
```
- **Success Response (200 OK):**
```json
{
  "message": "success",
  "studentId": 2
}
```
- **Error Response (400 Bad Request):**
```json
{ "error": "Missing required fields" }
```

## 10.3 Update Student
**Purpose:** Modify an existing student profile.
- **URL:** `/api/students/:id`
- **Method:** `PUT`
- **Headers:** `Content-Type: application/json`
- **Example Request Body (Partial Update):**
```json
{
  "gpa": 3.9
}
```
- **Success Response (200 OK):**
```json
{
  "message": "success",
  "changes": 1
}
```

## 10.4 Delete Student
**Purpose:** Permanently remove a student record.
- **URL:** `/api/students/:id`
- **Method:** `DELETE`
- **Headers:** `None`
- **Body:** `None`
- **Success Response (200 OK):**
```json
{
  "message": "deleted",
  "changes": 1
}
```
