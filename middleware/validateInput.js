// middleware/validateInput.js
// Input validation middleware using express-validator

const { body, param, validationResult } = require('express-validator');

// ─── Reusable helper: run validations and return errors ───────────────────────
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(e => ({ field: e.path, message: e.msg }))
    });
  }
  next();
};

// ─── Patient Validators ───────────────────────────────────────────────────────
const patientRegisterRules = [
  body('full_name').trim().notEmpty().withMessage('Full name is required'),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('phone')
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Valid 10-digit Indian phone number required'),
  body('dob').isDate().withMessage('Valid date of birth required (YYYY-MM-DD)'),
  body('gender')
    .isIn(['Male', 'Female', 'Other'])
    .withMessage('Gender must be Male, Female, or Other'),
  body('blood_group')
    .optional()
    .isIn(['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'])
    .withMessage('Invalid blood group'),
];

const patientUpdateRules = [
  body('full_name').trim().notEmpty().withMessage('Full name is required'),
  body('phone')
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Valid 10-digit phone number required'),
  body('dob').isDate().withMessage('Valid date of birth required'),
  body('gender').isIn(['Male', 'Female', 'Other']).withMessage('Invalid gender'),
];

// ─── Doctor Validators ────────────────────────────────────────────────────────
const doctorRules = [
  body('full_name').trim().notEmpty().withMessage('Doctor name is required'),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('phone').matches(/^[6-9]\d{9}$/).withMessage('Valid phone number required'),
  body('specialization').trim().notEmpty().withMessage('Specialization is required'),
  body('department_id').isInt({ min: 1 }).withMessage('Valid department ID required'),
  body('experience_yrs')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Experience must be a non-negative number'),
];

// ─── Appointment Validators ───────────────────────────────────────────────────
const appointmentRules = [
  body('patient_id').isInt({ min: 1 }).withMessage('Valid patient ID required'),
  body('doctor_id').isInt({ min: 1 }).withMessage('Valid doctor ID required'),
  body('appointment_date')
    .isDate()
    .withMessage('Valid appointment date required (YYYY-MM-DD)')
    .custom((value) => {
      const date = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (date < today) throw new Error('Appointment date cannot be in the past');
      return true;
    }),
  body('appointment_time')
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage('Valid time required (HH:MM format)'),
];

const statusUpdateRules = [
  body('status')
    .isIn(['Pending', 'Confirmed', 'Completed', 'Cancelled'])
    .withMessage('Status must be: Pending, Confirmed, Completed, or Cancelled'),
];

module.exports = {
  validate,
  patientRegisterRules,
  patientUpdateRules,
  doctorRules,
  appointmentRules,
  statusUpdateRules,
};
