// models/Appointment.js
// All raw SQL queries for the appointments table (Model Layer)

const db = require('../config/db');

const Appointment = {
  // CREATE — Book a new appointment
  create: async (data) => {
    const sql = `
      INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, reason)
      VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await db.execute(sql, [
      data.patient_id, data.doctor_id,
      data.appointment_date, data.appointment_time,
      data.reason || null
    ]);

    // Log the creation in audit table
    if (result.insertId) {
      await db.execute(
        `INSERT INTO appointment_status_log (appointment_id, old_status, new_status, changed_by)
         VALUES (?, NULL, 'Pending', 'system')`,
        [result.insertId]
      );
    }
    return result;
  },

  // READ ALL — with patient and doctor details joined
  findAll: async () => {
    const sql = `
      SELECT
        a.id, a.appointment_date, a.appointment_time,
        a.reason, a.status, a.notes, a.created_at,
        p.id AS patient_id, p.full_name AS patient_name, p.phone AS patient_phone,
        d.id AS doctor_id, d.full_name AS doctor_name,
        dep.name AS department
      FROM appointments a
      JOIN patients     p   ON a.patient_id = p.id
      JOIN doctors      d   ON a.doctor_id  = d.id
      JOIN departments  dep ON d.department_id = dep.id
      ORDER BY a.appointment_date ASC, a.appointment_time ASC
    `;
    const [rows] = await db.execute(sql);
    return rows;
  },

  // READ ONE — Get full appointment details by ID
  findById: async (id) => {
    const sql = `
      SELECT
        a.*,
        p.full_name AS patient_name, p.email AS patient_email, p.phone AS patient_phone,
        d.full_name AS doctor_name, d.specialization,
        dep.name AS department
      FROM appointments a
      JOIN patients     p   ON a.patient_id = p.id
      JOIN doctors      d   ON a.doctor_id  = d.id
      JOIN departments  dep ON d.department_id = dep.id
      WHERE a.id = ?
    `;
    const [rows] = await db.execute(sql, [id]);
    return rows[0];
  },

  // READ — Check if doctor already has an appointment at same date+time
  checkConflict: async (doctor_id, date, time, excludeId = null) => {
    let sql = `
      SELECT id FROM appointments
      WHERE doctor_id = ? AND appointment_date = ? AND appointment_time = ?
      AND status NOT IN ('Cancelled', 'Completed')
    `;
    const params = [doctor_id, date, time];
    if (excludeId) {
      sql += ' AND id != ?';
      params.push(excludeId);
    }
    const [rows] = await db.execute(sql, params);
    return rows.length > 0;
  },

  // UPDATE STATUS — Confirm, Complete, or Cancel
  updateStatus: async (id, newStatus, notes, changedBy = 'admin') => {
    // Get current status first for audit log
    const [current] = await db.execute(
      'SELECT status FROM appointments WHERE id = ?', [id]
    );
    const oldStatus = current[0]?.status;

    const [result] = await db.execute(
      'UPDATE appointments SET status = ?, notes = ? WHERE id = ?',
      [newStatus, notes || null, id]
    );

    // Write to audit log
    if (result.affectedRows > 0) {
      await db.execute(
        `INSERT INTO appointment_status_log (appointment_id, old_status, new_status, changed_by)
         VALUES (?, ?, ?, ?)`,
        [id, oldStatus, newStatus, changedBy]
      );
    }
    return result;
  },

  // DELETE — Cancel/remove an appointment
  delete: async (id) => {
    const [result] = await db.execute(
      'DELETE FROM appointments WHERE id = ?', [id]
    );
    return result;
  },

  // READ — Get status audit log for an appointment
  getStatusLog: async (id) => {
    const [rows] = await db.execute(
      `SELECT * FROM appointment_status_log
       WHERE appointment_id = ? ORDER BY changed_at ASC`,
      [id]
    );
    return rows;
  }
};

module.exports = Appointment;
