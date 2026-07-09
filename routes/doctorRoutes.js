// routes/doctorRoutes.js
const express = require('express');
const router  = express.Router();

const {
  getAllDoctors,
  getDoctorById,
  getDoctorsByDepartment,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  getDepartments,
} = require('../controllers/doctorController');

const { validate, doctorRules } = require('../middleware/validateInput');

// GET    /api/doctors/departments       — All departments (must be before /:id)
router.get('/departments', getDepartments);

// GET    /api/doctors                   — All doctors
router.get('/', getAllDoctors);

// GET    /api/doctors/:id               — One doctor
router.get('/:id', getDoctorById);

// GET    /api/doctors/department/:deptId — By department
router.get('/department/:deptId', getDoctorsByDepartment);

// POST   /api/doctors                   — Add doctor
router.post('/', doctorRules, validate, createDoctor);

// PUT    /api/doctors/:id               — Update doctor
router.put('/:id', validate, updateDoctor);

// DELETE /api/doctors/:id               — Remove doctor
router.delete('/:id', deleteDoctor);

module.exports = router;
