# Chapter 26: UML Diagrams (ASCII Representations)

## 26.1 Use Case Diagram
Describes the interactions between the primary actor (Administrator) and the system.
```text
      Actor: Administrator
             |
             |---> (Login)
             |
             |---> (View Dashboard) ---> <<includes>> (Fetch All Students)
             |
             |---> (Add Student) ---> <<includes>> (Data Validation)
             |
             |---> (Edit Student)
             |
             |---> (Delete Student) ---> <<extends>> (Confirmation Prompt)
```

## 26.2 Sequence Diagram (Add Student)
Visualizes the sequence of messages passed between components during a Create operation.
```text
Admin        React UI        Express API        SQL Database
  |             |                 |                  |
  |--Fills Form-|                 |                  |
  |             |                 |                  |
  |---Submit--->|                 |                  |
  |             |--POST JSON----->|                  |
  |             |                 |--INSERT INTO---->|
  |             |                 |                  |
  |             |                 |<---Returns ID----|
  |             |<--200 OK JSON---|                  |
  |<--UI Update-|                 |                  |
```

## 26.3 Class Diagram (Conceptual)
```text
+-----------------------+       +-------------------------+
|      Student          |       |      Department         |
+-----------------------+       +-------------------------+
| - id: Integer (PK)    |       | - id: Integer (PK)      |
| - firstName: String   |       | - deptName: String      |
| - lastName: String    |       | - headOfDept: String    |
| - email: String       |       +-------------------------+
| - major: String (FK)  |>*----1|
| - gpa: Float          |
+-----------------------+
| + createProfile()     |
| + updateProfile()     |
+-----------------------+
```

---

# Chapter 27: Flowcharts

## 27.1 Create / Registration Flowchart
```text
[Start]
   |
   V
[Admin Clicks "Add Student"]
   |
   V
[Fills Form Data]
   |
   V
<Are all required fields filled?> --- No ---> [Show Frontend Error]
   | Yes
   V
[Send POST Request to API]
   |
   V
[Backend validates Payload]
   |
   V
<Does Email already exist in DB?> --- Yes --> [Return 400 API Error] -> [Show UI Alert]
   | No
   V
[Execute SQL INSERT]
   |
   V
[Return 200 OK]
   |
   V
[Refresh React State]
   |
   V
[End]
```

## 27.2 Delete Flowchart
```text
[Start]
   |
   V
[Admin Clicks "Delete" Icon]
   |
   V
<Prompt: "Are you sure?"> --- Cancel ---> [End]
   | OK
   V
[Send DELETE Request to API with ID]
   |
   V
[Execute SQL DELETE WHERE id=?]
   |
   V
[Return 200 OK]
   |
   V
[Remove Student from React State]
   |
   V
[End]
```
