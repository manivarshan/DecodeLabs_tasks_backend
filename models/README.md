# models — Data Access Layer

This folder contains the **Model** layer of the MVC architecture. Each file is responsible for one database table and contains all raw SQL queries for that entity.

Models do not contain business logic — they only talk to the database.

---

## Files

### `Patient.js`
| Method | SQL Operation | Description |
|---|---|---|
| `create(data)` | INSERT | Register a new patient |
| `findAll()` | SELECT | Get all patients |
| `findById(id)` | SELECT WHERE | Get one patient by ID |
| `findByEmail(email)` | SELECT WHERE | Check for duplicate email |
| `update(id, data)` | UPDATE | Update patient fields |
| `delete(id)` | DELETE | Remove a patient record |
| `findWithAppointments(id)` | JOIN query | Patient + appointment history |

### `Doctor.js`
| Method | SQL Operation | Description |
|---|---|---|
| `create(data)` | INSERT | Add a new doctor |
| `findAll()` | SELECT JOIN | All doctors with department name |
| `findById(id)` | SELECT JOIN | One doctor with department |
| `findByDepartment(dept_id)` | SELECT WHERE | Available doctors in a department |
| `update(id, data)` | UPDATE | Update doctor fields |
| `delete(id)` | DELETE | Remove doctor |

### `Appointment.js`
| Method | SQL Operation | Description |
|---|---|---|
| `create(data)` | INSERT + audit log | Book appointment, write log entry |
| `findAll()` | SELECT JOIN | All appointments with patient + doctor |
| `findById(id)` | SELECT JOIN | One appointment with full details |
| `checkConflict(...)` | SELECT WHERE | Detect double-booking by doctor |
| `updateStatus(...)` | UPDATE + audit log | Change status, write log entry |
| `delete(id)` | DELETE | Remove appointment |
| `getStatusLog(id)` | SELECT | Full status history audit trail |

---

## Pattern

All models follow the same pattern:

```js
const db = require('../config/db');

const ModelName = {
  methodName: async (params) => {
    const [result] = await db.execute('SQL QUERY', [params]);
    return result;
  }
};

module.exports = ModelName;
```

The controller imports the model and calls its methods. The model never directly handles HTTP requests or responses.
