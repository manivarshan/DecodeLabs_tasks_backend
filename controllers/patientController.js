// controllers/patientController.js
// Business logic for patient endpoints (Controller Layer)

const Patient = require('../models/Patient');

// POST /api/patients/register
const registerPatient = async (req, res, next) => {
  try {
    // Check for duplicate email
    const existing = await Patient.findByEmail(req.body.email);
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'A patient with this email is already registered',
      });
    }

    const result = await Patient.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Patient registered successfully',
      data: { id: result.insertId, ...req.body },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/patients
const getAllPatients = async (req, res, next) => {
  try {
    const patients = await Patient.findAll();
    res.status(200).json({
      success: true,
      count: patients.length,
      data: patients,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/patients/:id
const getPatientById = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }
    res.status(200).json({ success: true, data: patient });
  } catch (err) {
    next(err);
  }
};

// GET /api/patients/:id/appointments
const getPatientAppointments = async (req, res, next) => {
  try {
    const rows = await Patient.findWithAppointments(req.params.id);
    if (!rows.length) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }
    res.status(200).json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
};

// PUT /api/patients/:id
const updatePatient = async (req, res, next) => {
  try {
    const existing = await Patient.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    const result = await Patient.update(req.params.id, req.body);
    if (result.affectedRows === 0) {
      return res.status(400).json({ success: false, message: 'Update failed' });
    }
    res.status(200).json({ success: true, message: 'Patient updated successfully' });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/patients/:id
const deletePatient = async (req, res, next) => {
  try {
    const existing = await Patient.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    await Patient.delete(req.params.id);
    res.status(200).json({ success: true, message: 'Patient record deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  registerPatient,
  getAllPatients,
  getPatientById,
  getPatientAppointments,
  updatePatient,
  deletePatient,
};
