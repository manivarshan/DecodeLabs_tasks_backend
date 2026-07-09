# Backend — Node.js REST API

This is the Express.js backend for the MediBook Hospital Appointment Management System.

---

## Architecture — MVC Pattern

```
backend/
├── config/         -- Database connection pool (TiDB Cloud)
├── models/         -- Raw SQL queries (Model layer)
├── controllers/    -- Business logic (Controller layer)
├── routes/         -- URL routing (Router layer)
├── middleware/     -- Input validation and error handling
├── server.js       -- Application entry point
├── .env            -- Environment variables (not committed to git)
└── package.json    -- Dependencies
```

---

## API Endpoints

### Health Check
| Method | Route | Description |
|---|---|---|
| GET | `/api/health` | Check if server is running |

### Patients — `/api/patients`
| Method | Route | Description |
|---|---|---|
| POST | `/api/patients/register` | Register a new patient |
| GET | `/api/patients` | Get all patients |
| GET | `/api/patients/:id` | Get patient by ID |
| GET | `/api/patients/:id/appointments` | Get patient with appointment history |
| PUT | `/api/patients/:id` | Update patient info |
| DELETE | `/api/patients/:id` | Delete patient (cascades appointments) |

### Doctors — `/api/doctors`
| Method | Route | Description |
|---|---|---|
| GET | `/api/doctors` | Get all doctors |
| GET | `/api/doctors/:id` | Get doctor by ID |
| GET | `/api/doctors/departments` | Get all departments |
| GET | `/api/doctors/department/:deptId` | Doctors by department |
| POST | `/api/doctors` | Add new doctor |
| PUT | `/api/doctors/:id` | Update doctor info |
| DELETE | `/api/doctors/:id` | Remove doctor |

### Appointments — `/api/appointments`
| Method | Route | Description |
|---|---|---|
| POST | `/api/appointments` | Book appointment |
| GET | `/api/appointments` | Get all appointments |
| GET | `/api/appointments/:id` | Get appointment by ID |
| PUT | `/api/appointments/:id/status` | Update appointment status |
| DELETE | `/api/appointments/:id` | Cancel appointment |
| GET | `/api/appointments/:id/log` | Get status change audit log |

---

## Response Format

All endpoints return JSON in this format:

```json
{
  "success": true,
  "message": "Description",
  "count": 5,
  "data": [ ... ]
}
```

Error responses:
```json
{
  "success": false,
  "message": "What went wrong",
  "errors": [{ "field": "email", "message": "Valid email required" }]
}
```

---

## Environment Variables

Create a `.env` file in this folder:

```env
DB_HOST=your-cluster.tidbcloud.com
DB_PORT=4000
DB_USER=your_username.root
DB_PASSWORD=your_password
DB_NAME=hospital_db
PORT=5000
NODE_ENV=development
```

---

## Scripts

```bash
npm run dev    # Start with nodemon (auto-restart on file changes)
npm start      # Start in production mode
```

---

## Dependencies

| Package | Purpose |
|---|---|
| express | HTTP server and routing |
| mysql2 | MySQL/TiDB Cloud driver with Promise support |
| dotenv | Load environment variables from .env |
| cors | Enable cross-origin requests |
| express-validator | Input validation and sanitization |
| nodemon (dev) | Auto-restart on file changes |
