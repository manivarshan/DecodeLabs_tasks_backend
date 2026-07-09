// controllers/doctorController.js
// Business logic for doctor endpoints (Controller Layer)

const Doctor  = require('../models/Doctor');
const db      = require('../config/db');

// GET /api/doctors
const getAllDoctors = async (req, res, next) => {
  try {
    const doctors = await Doctor.findAll();
    res.status(200).json({ success: true, count: doctors.length, data: doctors });
  } catch (err) {
    next(err);
  }
};

// GET /api/doctors/:id
const getDoctorById = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    res.status(200).json({ success: true, data: doctor });
  } catch (err) {
    next(err);
  }
};

// GET /api/doctors/department/:deptId
const getDoctorsByDepartment = async (req, res, next) => {
  try {
    const doctors = await Doctor.findByDepartment(req.params.deptId);
    res.status(200).json({ success: true, count: doctors.length, data: doctors });
  } catch (err) {
    next(err);
  }
};

// POST /api/doctors
const createDoctor = async (req, res, next) => {
  try {
    const result = await Doctor.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Doctor added successfully',
      data: { id: result.insertId, ...req.body },
    });
  } catch (err) {
    next(err);
  }
};

// PUT /api/doctors/:id
const updateDoctor = async (req, res, next) => {
  try {
    const existing = await Doctor.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    const result = await Doctor.update(req.params.id, req.body);
    if (result.affectedRows === 0) {
      return res.status(400).json({ success: false, message: 'Update failed' });
    }
    res.status(200).json({ success: true, message: 'Doctor updated successfully' });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/doctors/:id
const deleteDoctor = async (req, res, next) => {
  try {
    const existing = await Doctor.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    await Doctor.delete(req.params.id);
    res.status(200).json({ success: true, message: 'Doctor removed successfully' });
  } catch (err) {
    next(err);
  }
};

// GET /api/doctors/departments — list all departments
const getDepartments = async (req, res, next) => {
  try {
    const [rows] = await db.execute('SELECT * FROM departments ORDER BY name');
    res.status(200).json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllDoctors,
  getDoctorById,
  getDoctorsByDepartment,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  getDepartments,
};
