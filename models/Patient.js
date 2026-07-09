// models/Patient.js
// All raw SQL queries for the patients table (Model Layer)

const db = require('../config/db');

const Patient = {
  // CREATE — Insert a new patient
  create: async (data) => {
    const sql = `
      INSERT INTO patients (full_name, email, phone, dob, gender, address, blood_group)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.execute(sql, [
      data.full_name, data.email, data.phone,
      data.dob, data.gender, data.address, data.blood_group
    ]);
    return result;
  },

  // READ ALL — Get all patients
  findAll: async () => {
    const [rows] = await db.execute(
      'SELECT * FROM patients ORDER BY created_at DESC'
    );
    return rows;
  },

  // READ ONE — Get patient by ID
  findById: async (id) => {
    const [rows] = await db.execute(
      'SELECT * FROM patients WHERE id = ?', [id]
    );
    return rows[0];
  },

  // READ — Find by email (used for duplicate check)
  findByEmail: async (email) => {
    const [rows] = await db.execute(
      'SELECT * FROM patients WHERE email = ?', [email]
    );
    return rows[0];
  },

  // UPDATE — Update patient info
  update: async (id, data) => {
    const sql = `
      UPDATE patients
      SET full_name=?, phone=?, dob=?, gender=?, address=?, blood_group=?
      WHERE id=?
    `;
    const [result] = await db.execute(sql, [
      data.full_name, data.phone, data.dob,
      data.gender, data.address, data.blood_group, id
    ]);
    return result;
  },

  // DELETE — Remove a patient record
  delete: async (id) => {
    const [result] = await db.execute(
      'DELETE FROM patients WHERE id = ?', [id]
    );
    return result;
  },

  // Get patient with their appointments
  findWithAppointments: async (id) => {
    const sql = `
      SELECT
        p.*,
        a.id AS appointment_id,
        a.appointment_date, a.appointment_time,
        a.reason, a.status,
        d.full_name AS doctor_name,
        dep.name AS department
      FROM patients p
      LEFT JOIN appointments a  ON a.patient_id = p.id
      LEFT JOIN doctors      d  ON a.doctor_id  = d.id
      LEFT JOIN departments dep ON d.department_id = dep.id
      WHERE p.id = ?
      ORDER BY a.appointment_date DESC
    `;
    const [rows] = await db.execute(sql, [id]);
    return rows;
  }
};

module.exports = Patient;
