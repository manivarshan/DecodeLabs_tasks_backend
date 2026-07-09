# middleware — Validation and Error Handling

This folder contains middleware functions that run between the route and the controller.

---

## Files

### `validateInput.js`

Contains input validation rules using the `express-validator` library.

#### Exported rule sets

| Export | Used By | What It Validates |
|---|---|---|
| `patientRegisterRules` | POST `/patients/register` | name, email, phone format, DOB, gender, blood group |
| `patientUpdateRules` | PUT `/patients/:id` | name, phone, DOB, gender |
| `doctorRules` | POST `/doctors` | name, email, phone, specialization, department ID |
| `appointmentRules` | POST `/appointments` | patient ID, doctor ID, future date only, time format |
| `statusUpdateRules` | PUT `/appointments/:id/status` | status must be one of the 4 valid values |
| `validate` | All routes | Runs checks and returns 400 if any fail |

#### Example validation rule

```js
body('phone')
  .matches(/^[6-9]\d{9}$/)
  .withMessage('Valid 10-digit Indian phone number required')
```

#### Validation response format

If validation fails, the response is:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "email", "message": "Valid email is required" },
    { "field": "phone", "message": "Valid 10-digit phone required" }
  ]
}
```

---

### `errorHandler.js`

Global error handler and 404 handler that must be registered last in `server.js`.

#### `errorHandler(err, req, res, next)`

Catches any error thrown in a controller via `next(err)`.

| Error Code | Meaning | Response |
|---|---|---|
| `ER_DUP_ENTRY` | MySQL duplicate record | 409 Conflict |
| `ER_NO_REFERENCED_ROW_2` | Invalid foreign key ID | 400 Bad Request |
| Other | Generic server error | 500 Internal Server Error |

#### `notFound(req, res)`

Catches requests to undefined routes and returns:

```json
{
  "success": false,
  "message": "Route not found: GET /api/unknown"
}
```
