// server.js
// Entry point — Hospital Appointment Management System
// MVC Architecture | Node.js + Express + MySQL

require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const path    = require('path');

// Import Routes
const patientRoutes     = require('./routes/patientRoutes');
const doctorRoutes      = require('./routes/doctorRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');

// Import Middleware
const { errorHandler, notFound } = require('./middleware/errorHandler');

const app  = express();
const PORT = process.env.PORT || 5000;

// ─── Core Middleware ──────────────────────────────────────────────────────────
app.use(cors({
  origin: '*', // In production, restrict this to your frontend domain
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/patients',     patientRoutes);
app.use('/api/doctors',      doctorRoutes);
app.use('/api/appointments', appointmentRoutes);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: '🏥 Hospital API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// ─── Frontend Fallback ────────────────────────────────────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// ─── Error Handling (must be last) ────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('');
  console.log('🏥 ================================================');
  console.log(`   Hospital Appointment Management System`);
  console.log(`   Server running on: http://localhost:${PORT}`);
  console.log(`   API base:          http://localhost:${PORT}/api`);
  console.log(`   Health check:      http://localhost:${PORT}/api/health`);
  console.log('   ================================================');
  console.log('');
});

module.exports = app;
