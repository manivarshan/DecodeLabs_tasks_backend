// routes/appointmentRoutes.js
const express = require('express');
const router  = express.Router();

const {
  bookAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  cancelAppointment,
  getStatusLog,
} = require('../controllers/appointmentController');

const {
  validate,
  appointmentRules,
  statusUpdateRules,
} = require('../middleware/validateInput');

// POST   /api/appointments              — Book appointment
router.post('/', appointmentRules, validate, bookAppointment);

// GET    /api/appointments              — All appointments
router.get('/', getAllAppointments);

// GET    /api/appointments/:id          — One appointment
router.get('/:id', getAppointmentById);

// GET    /api/appointments/:id/log      — Status history
router.get('/:id/log', getStatusLog);

// PUT    /api/appointments/:id/status   — Update status
router.put('/:id/status', statusUpdateRules, validate, updateAppointmentStatus);

// DELETE /api/appointments/:id          — Cancel/remove
router.delete('/:id', cancelAppointment);

module.exports = router;
