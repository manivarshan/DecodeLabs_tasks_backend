// controllers/appointmentController.js
// Business logic for appointment endpoints (Controller Layer)

const Appointment = require('../models/Appointment');
const Patient     = require('../models/Patient');
const Doctor      = require('../models/Doctor');

// POST /api/appointments
const bookAppointment = async (req, res, next) => {
  try {
    const { patient_id, doctor_id, appointment_date, appointment_time } = req.body;

    // Verify patient exists
    const patient = await Patient.findById(patient_id);
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    // Verify doctor exists and is available
    const doctor = await Doctor.findById(doctor_id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    if (!doctor.available) {
      return res.status(400).json({ success: false, message: 'Doctor is not available' });
    }

    // Check for scheduling conflict
    const conflict = await Appointment.checkConflict(doctor_id, appointment_date, appointment_time);
    if (conflict) {
      return res.status(409).json({
        success: false,
        message: 'Doctor already has an appointment at this date and time. Please choose a different slot.',
      });
    }

    const result = await Appointment.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      data: { id: result.insertId, status: 'Pending', ...req.body },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/appointments
const getAllAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.findAll();
    res.status(200).json({ success: true, count: appointments.length, data: appointments });
  } catch (err) {
    next(err);
  }
};

// GET /api/appointments/:id
const getAppointmentById = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
    res.status(200).json({ success: true, data: appointment });
  } catch (err) {
    next(err);
  }
};

// PUT /api/appointments/:id/status
const updateAppointmentStatus = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    // Business rule: Cannot modify a completed or cancelled appointment
    if (['Completed', 'Cancelled'].includes(appointment.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot update a ${appointment.status} appointment`,
      });
    }

    const result = await Appointment.updateStatus(
      req.params.id,
      req.body.status,
      req.body.notes,
      req.body.changed_by || 'admin'
    );

    res.status(200).json({
      success: true,
      message: `Appointment status updated to ${req.body.status}`,
    });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/appointments/:id
const cancelAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    if (appointment.status === 'Completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel a completed appointment',
      });
    }

    await Appointment.delete(req.params.id);
    res.status(200).json({ success: true, message: 'Appointment cancelled and removed' });
  } catch (err) {
    next(err);
  }
};

// GET /api/appointments/:id/log
const getStatusLog = async (req, res, next) => {
  try {
    const log = await Appointment.getStatusLog(req.params.id);
    res.status(200).json({ success: true, data: log });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  bookAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  cancelAppointment,
  getStatusLog,
};
