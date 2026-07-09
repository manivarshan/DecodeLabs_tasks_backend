// models/Doctor.js
// All raw SQL queries for the doctors table (Model Layer)

const db = require('../config/db');

const Doctor = {
  // CREATE
  create: async (data) => {
    const sql = `
      INSERT INTO doctors (full_name, email, phone, specialization, department_id, experience_yrs)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.execute(sql, [
      data.full_name, data.email, data.phone,
      data.specialization, data.department_id, data.experience_yrs || 0
    ]);
    return result;
  },

  // READ ALL — with department name joined
  findAll: async () => {
    const sql = `
      SELECT d.*, dep.name AS department_name
      FROM doctors d
      JOIN departments dep ON d.department_id = dep.id
      ORDER BY d.full_name ASC
    `;
    const [rows] = await db.execute(sql);
    return rows;
  },

  // READ ONE
  findById: async (id) => {
    const sql = `
      SELECT d.*, dep.name AS department_name
      FROM doctors d
      JOIN departments dep ON d.department_id = dep.id
      WHERE d.id = ?
    `;
    const [rows] = await db.execute(sql, [id]);
    return rows[0];
  },

  // READ — by department
  findByDepartment: async (dept_id) => {
    const sql = `
      SELECT d.*, dep.name AS department_name
      FROM doctors d
      JOIN departments dep ON d.department_id = dep.id
      WHERE d.department_id = ? AND d.available = TRUE
    `;
    const [rows] = await db.execute(sql, [dept_id]);
    return rows;
  },

  // UPDATE
  update: async (id, data) => {
    const sql = `
      UPDATE doctors
      SET full_name=?, phone=?, specialization=?, department_id=?,
          experience_yrs=?, available=?
      WHERE id=?
    `;
    const [result] = await db.execute(sql, [
      data.full_name, data.phone, data.specialization,
      data.department_id, data.experience_yrs, data.available, id
    ]);
    return result;
  },

  // DELETE
  delete: async (id) => {
    const [result] = await db.execute(
      'DELETE FROM doctors WHERE id = ?', [id]
    );
    return result;
  }
};

module.exports = Doctor;
