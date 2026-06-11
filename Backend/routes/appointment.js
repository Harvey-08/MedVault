const { Appointment } = require('../models/appointment');
const { Consent } = require('../models/consent');
const express = require('express');
const router = express.Router();
const moment = require('moment');
const auth = require('../helpers/jwt');
const logEvent = require('../helpers/auditLogger');
const { validateBody, appointmentSchema, appointmentStatusSchema } = require('../helpers/validation');
const { generateAvailableSlots } = require('../utils/slotGenerator');
const { Hospital } = require('../models/hospital');

// Get available time slots for a specific date (auth required)
router.get('/available-slots', auth, async (req, res) => {
  const { appointment_date, name } = req.query;

  if (!appointment_date || !name) {
      return res.status(400).json({ success: false, message: 'Please provide a valid appointment date and hospital email.' });
  }

  try {
      const appointmentDate = moment(appointment_date, 'YYYY-MM-DD', true);
      if (!appointmentDate.isValid()) {
          return res.status(400).json({ success: false, message: 'Invalid appointment date format.' });
      }

      const hospital = await Hospital.findOne({ name });
      if (!hospital) {
          return res.status(404).json({ success: false, message: 'Hospital not found.' });
      }

      // Find booked appointments for the given date
      const bookedAppointments = await Appointment.find({
          appointment_date: {
              $gte: appointmentDate.startOf('day').toDate(),
              $lt: appointmentDate.endOf('day').toDate(),
          },
      });

      const bookedSlots = bookedAppointments.map(appointment => appointment.timeslot);
      const availableTimeSlots = generateAvailableSlots(hospital.timing, bookedSlots);

      res.status(200).json({ success: true, availableSlots: availableTimeSlots });
  } catch (error) {
      console.error('Error fetching available slots:', error.message);
      res.status(500).json({ success: false, message: 'Server error while fetching available slots.' });
  }
});

// Get all appointments (filtered by user role/email)
router.get(`/`, auth, auth.checkRole(['Patient', 'Hospital', 'Admin']), async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'Patient') {
        query = { patemail: req.user.email };
    } else if (req.user.role === 'Hospital') {
        // Only show appointments that belong to this hospital
        query = { hospitalemail: { $regex: new RegExp('^' + req.user.email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i') } };
    }
    const appointmentList = await Appointment.find(query);
    await logEvent(req.user.email, req.user.role, 'VIEW_APPOINTMENT_LIST', 'SUCCESS');
    res.status(200).send(appointmentList);
  } catch (error) {
    await logEvent(req.user.email, req.user.role, 'VIEW_APPOINTMENT_LIST', 'DENIED', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get specific appointment by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      await logEvent(req.user.email, req.user.role, 'VIEW_APPOINTMENT', 'DENIED', `Not found: ${req.params.id}`);
      return res.status(404).json({ success: false, message: 'Appointment not found!' });
    }
    
    // Ownership and consent check
    let hasConsent = false;
    if (req.user.role === 'Hospital') {
      const consent = await Consent.findOne({
        patientEmail: appointment.patemail,
        hospitalEmail: req.user.email,
        status: 'Granted'
      });
      hasConsent = !!consent;
    }

    if (req.user.role !== 'Admin' && 
        req.user.email !== appointment.patemail && 
        req.user.email !== appointment.hospitalemail &&
        !hasConsent) {
      await logEvent(req.user.email, req.user.role, 'VIEW_APPOINTMENT', 'DENIED', `BOLA attempt: ${req.params.id}`);
      return res.status(403).json({ success: false, error: 'Access denied. Consent required.' });
    }
    
    await logEvent(req.user.email, req.user.role, 'VIEW_APPOINTMENT', 'SUCCESS', req.params.id);
    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create a new appointment (Patient only)
router.post('/', auth, auth.checkRole(['Patient']), validateBody(appointmentSchema), async (req, res) => {
  const { patemail, hospitalemail, doctor_name, patient_name, reason, appointment_date, timeslot, address, city, mobile } = req.body;

  // Enforce patient email matches logged-in user
  if (req.user.email !== patemail) {
    await logEvent(req.user.email, req.user.role, 'CREATE_APPOINTMENT', 'DENIED', `Mismatch: body ${patemail}`);
    return res.status(403).json({ message: 'Access denied. Patient email mismatch.' });
  }

  try {
    const appointmentDate = moment(appointment_date).toDate();

    // Check for existing appointment with the same date and time slot
    const existingAppointment = await Appointment.findOne({
      appointment_date: appointmentDate,
      timeslot,
      hospitalemail // Enforce unique time slot per hospital
    });

    if (existingAppointment) {
      return res.status(400).json({ message: 'The selected time slot is already booked.' });
    }

    // Create new appointment
    const newAppointment = new Appointment({
      patemail,
      hospitalemail,
      patient_name,
      doctor_name,
      reason,
      appointment_date: appointmentDate,
      timeslot,
      address,
      city,
      mobile,
    });

    await newAppointment.save();
    await logEvent(req.user.email, req.user.role, 'CREATE_APPOINTMENT', 'SUCCESS', `Booked appointment ID ${newAppointment.id} for hospital ${hospitalemail}`);
    res.status(201).json({ message: 'Appointment booked successfully', appointment: newAppointment });
  } catch (error) {
    console.error('Error booking appointment:', error);
    res.status(500).json({ message: 'Server error while booking appointment.' });
  }
});

// Update appointment status (Hospital or Admin)
router.put('/status/:id', auth, auth.checkRole(['Hospital', 'Admin']), validateBody(appointmentStatusSchema), async (req, res) => {
  try {
    const existing = await Appointment.findById(req.params.id);
    if (!existing) {
        await logEvent(req.user.email, req.user.role, 'UPDATE_APPOINTMENT_STATUS', 'DENIED', `Not found: ${req.params.id}`);
        return res.status(404).json({ success: false, message: 'Appointment not found!' });
    }

    // Enforce that hospital owns the appointment status update
    if (req.user.role !== 'Admin' && req.user.email !== existing.hospitalemail) {
        await logEvent(req.user.email, req.user.role, 'UPDATE_APPOINTMENT_STATUS', 'DENIED', `BOLA attempt: ${req.params.id}`);
        return res.status(403).json({ success: false, error: 'Access denied. You do not own this appointment.' });
    }

    const appointment = await Appointment.findByIdAndUpdate(
        req.params.id,
        {        
            status: req.body.status
        },
        { new: true }
    );

    if (!appointment)
        return res.status(400).send('the appointment cannot be created!');

    await logEvent(req.user.email, req.user.role, 'UPDATE_APPOINTMENT_STATUS', 'SUCCESS', `Updated status of ID ${req.params.id} to ${req.body.status}`);
    res.send(appointment);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete an appointment (Owner or Admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    const existing = await Appointment.findById(req.params.id);
    if (!existing) {
      await logEvent(req.user.email, req.user.role, 'DELETE_APPOINTMENT', 'DENIED', `Not found: ${req.params.id}`);
      return res.status(404).json({ success: false, message: 'Appointment not found!' });
    }

    // Block if not Admin and not Owner
    if (req.user.role !== 'Admin' && req.user.email !== existing.patemail && req.user.email !== existing.hospitalemail) {
      await logEvent(req.user.email, req.user.role, 'DELETE_APPOINTMENT', 'DENIED', `BOLA attempt: ${req.params.id}`);
      return res.status(403).json({ success: false, error: 'Access denied.' });
    }

    await Appointment.findByIdAndDelete(req.params.id);
    await logEvent(req.user.email, req.user.role, 'DELETE_APPOINTMENT', 'SUCCESS', `Deleted ID ${req.params.id}`);
    res.status(200).json({ success: true, message: 'The appointment has been deleted!' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
