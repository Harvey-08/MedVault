const { Appointment } = require('../models/appointment');
const express = require('express');
const router = express.Router();
const moment = require('moment');
const { generateAvailableSlots } = require('../utils/slotGenerator'); // Adjust the path to where your slotGenerator.js file is located

const { Hospital } = require('../models/hospital'); // Import Hospital model

// Get available time slots for a specific date
router.get('/available-slots', async (req, res) => {
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

router.get(`/`,  async (req, res) =>{
  const appointmentList = await Appointment.find();

  if(!appointmentList) {
      res.status(500).json({success: false})
  } 
  res.status(200).send(appointmentList);
})


  
router.get(`/:id`, async (req, res) =>{
  const appointmentList = await Appointment.findById(req.params.id);
  if(!appointmentList) {
      res.status(500).json({success: false})
  } 
  res.send(appointmentList);
})


// Get specific appointment by ID
router.get('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found!' });
    }
    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create a new appointment
router.post('/', async (req, res) => {
  const { patemail, hospitalemail,doctor_name, patient_name, reason, appointment_date, timeslot, address, city, mobile } = req.body;

  if (!patemail || !hospitalemail || !doctor_name || !patient_name || !reason || !appointment_date || !timeslot || !address || !city || !mobile) {
    return res.status(400).json({ message: 'Please provide all the required fields.' });
  }

  try {
    const appointmentDate = moment(appointment_date).toDate(); // Use toDate() directly here

    // Check for existing appointment with the same date and time slot
    const existingAppointment = await Appointment.findOne({
      appointment_date: appointmentDate,
      timeslot,
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
      appointment_date,
      timeslot,
      address,
      city,
      mobile,
    });

    await newAppointment.save();
    res.status(201).json({ message: 'Appointment booked successfully', appointment: newAppointment });
  } catch (error) {
    console.error('Error booking appointment:', error);
    res.status(500).json({ message: 'Server error while booking appointment.' });
  }
});


router.put('/status/:id',  async (req, res)=> {
  const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      {        
          status: req.body.status
      },
      { new: true}
  )

  if(!appointment)
  return res.status(400).send('the appointment cannot be created!')

  res.send(appointment);
})


// Delete an appointment
router.delete('/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found!' });
    res.status(200).json({ success: true, message: 'The appointment has been deleted!' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
