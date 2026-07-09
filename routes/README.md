# routes — URL Routing Layer

This folder contains the **Router** layer of the MVC architecture. Each file maps HTTP method + URL path combinations to the correct controller function.

Routes do not contain logic — they are the "address book" that connects URLs to controllers.

---

## Files

### `patientRoutes.js` — mounted at `/api/patients`

```
POST   /api/patients/register       → patientController.registerPatient
GET    /api/patients                → patientController.getAllPatients
GET    /api/patients/:id            → patientController.getPatientById
GET    /api/patients/:id/appointments → patientController.getPatientAppointments
PUT    /api/patients/:id            → patientController.updatePatient
DELETE /api/patients/:id            → patientController.deletePatient
```

### `doctorRoutes.js` — mounted at `/api/doctors`

```
GET    /api/doctors/departments     → doctorController.getDepartments
GET    /api/doctors                 → doctorController.getAllDoctors
GET    /api/doctors/:id             → doctorController.getDoctorById
GET    /api/doctors/department/:id  → doctorController.getDoctorsByDepartment
POST   /api/doctors                 → doctorController.createDoctor
PUT    /api/doctors/:id             → doctorController.updateDoctor
DELETE /api/doctors/:id             → doctorController.deleteDoctor
```

> Note: The `/departments` static route is placed before `/:id` to prevent Express from treating the string "departments" as a dynamic ID parameter.

### `appointmentRoutes.js` — mounted at `/api/appointments`

```
POST   /api/appointments            → appointmentController.bookAppointment
GET    /api/appointments            → appointmentController.getAllAppointments
GET    /api/appointments/:id        → appointmentController.getAppointmentById
GET    /api/appointments/:id/log    → appointmentController.getStatusLog
PUT    /api/appointments/:id/status → appointmentController.updateAppointmentStatus
DELETE /api/appointments/:id        → appointmentController.cancelAppointment
```

---

## Middleware Chaining

Each route chains validation middleware before calling the controller:

```js
router.post('/register', patientRegisterRules, validate, registerPatient);
//                       ^validation rules^   ^check^   ^controller^
```

If validation fails, `validate` sends a 400 response and the controller is never called.
