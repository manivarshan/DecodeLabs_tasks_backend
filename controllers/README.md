# controllers — Business Logic Layer

This folder contains the **Controller** layer of the MVC architecture. Controllers receive HTTP requests, apply business rules, call model methods, and send back HTTP responses.

Controllers do NOT write raw SQL — that is the model's job.

---

## Files

### `patientController.js`

| Function | Route | Business Logic |
|---|---|---|
| `registerPatient` | POST `/api/patients/register` | Checks for duplicate email before inserting |
| `getAllPatients` | GET `/api/patients` | Returns all patient records |
| `getPatientById` | GET `/api/patients/:id` | Returns 404 if not found |
| `getPatientAppointments` | GET `/api/patients/:id/appointments` | JOIN with appointments table |
| `updatePatient` | PUT `/api/patients/:id` | Checks patient exists before updating |
| `deletePatient` | DELETE `/api/patients/:id` | Checks patient exists before deleting |

### `doctorController.js`

| Function | Route | Business Logic |
|---|---|---|
| `getAllDoctors` | GET `/api/doctors` | Returns all with department name |
| `getDoctorById` | GET `/api/doctors/:id` | Returns 404 if not found |
| `getDoctorsByDepartment` | GET `/api/doctors/department/:id` | Filters by department |
| `createDoctor` | POST `/api/doctors` | Inserts new doctor |
| `updateDoctor` | PUT `/api/doctors/:id` | Checks exists before updating |
| `deleteDoctor` | DELETE `/api/doctors/:id` | Checks exists before deleting |
| `getDepartments` | GET `/api/doctors/departments` | Returns all departments |

### `appointmentController.js`

| Function | Route | Business Logic |
|---|---|---|
| `bookAppointment` | POST `/api/appointments` | Verifies patient and doctor exist, checks doctor availability, detects time slot conflicts |
| `getAllAppointments` | GET `/api/appointments` | Returns all with patient + doctor details |
| `getAppointmentById` | GET `/api/appointments/:id` | Returns 404 if not found |
| `updateAppointmentStatus` | PUT `/api/appointments/:id/status` | Blocks update if already Completed or Cancelled |
| `cancelAppointment` | DELETE `/api/appointments/:id` | Blocks if already Completed |
| `getStatusLog` | GET `/api/appointments/:id/log` | Returns full audit trail |

---

## HTTP Status Codes Used

| Code | Meaning | When Used |
|---|---|---|
| 200 | OK | Successful GET or PUT |
| 201 | Created | Successful POST (new resource created) |
| 400 | Bad Request | Business rule violation |
| 404 | Not Found | Record does not exist |
| 409 | Conflict | Duplicate email or scheduling conflict |
| 500 | Server Error | Unexpected database or server error |
