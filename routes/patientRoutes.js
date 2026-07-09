// routes/patientRoutes.js
const express = require('express');
const router  = express.Router();

const {
  registerPatient,
  getAllPatients,
  getPatientById,
  getPatientAppointments,
  updatePatient,
  deletePatient,
} = require('../controllers/patientController');

const {
  validate,
  patientRegisterRules,
  patientUpdateRules,
} = require('../middleware/validateInput');

// POST   /api/patients/register  — Register new patient
router.post('/register', patientRegisterRules, validate, registerPatient);

// GET    /api/patients            — List all patients
router.get('/', getAllPatients);

// GET    /api/patients/:id        — Get one patient
router.get('/:id', getPatientById);

// GET    /api/patients/:id/appointments — Patient appointment history
router.get('/:id/appointments', getPatientAppointments);

// PUT    /api/patients/:id        — Update patient
router.put('/:id', patientUpdateRules, validate, updatePatient);

// DELETE /api/patients/:id        — Delete patient
router.delete('/:id', deletePatient);

module.exports = router;
