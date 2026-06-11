const { Labtest } = require('../models/labtest');
const { Consent } = require('../models/consent');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const auth = require('../helpers/jwt');
const logEvent = require('../helpers/auditLogger');
const { validateBody, labtestSchema } = require('../helpers/validation');

// Set up multer storage for storing uploaded files (PDFs and images)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/'); // Ensure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Generate unique filename
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Allow PDF, images (JPEG, PNG), Excel files, Word documents, and text files
    const allowedMimeTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/jpg',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'application/msword', // .doc
      'text/plain', // .txt
      'text/csv' // .csv
    ];
    
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true); // Accept file
    } else {
      cb(new Error('Invalid file type! Allowed types: PDF, JPEG, PNG, Excel (.xlsx, .xls), Word (.docx, .doc), TXT, CSV'), false); // Reject file
    }
  }
});

// Routes

// Get all labtests (filtered by role/email)
router.get('/', auth, auth.checkRole(['Patient', 'Hospital', 'Lab', 'Admin']), async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'Patient') {
      query = { patemail: { $regex: new RegExp('^' + req.user.email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i') } };
    } else if (req.user.role === 'Lab') {
      query = { labemail: { $regex: new RegExp('^' + req.user.email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i') } };
    } else if (req.user.role === 'Hospital') {
      const hospitalEmailRegex = new RegExp('^' + req.user.email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i');
      // Find which patients have granted historical access consent to this hospital
      const consentedPatients = await Consent.find({
        hospitalEmail: { $regex: hospitalEmailRegex },
        status: 'Granted'
      }).select('patientEmail');

      const patientEmailRegexes = consentedPatients.map(c => new RegExp('^' + c.patientEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i'));

      query = {
        $or: [
          { hospitalemail: { $regex: hospitalEmailRegex } }, // Created/linked to this hospital
          { patemail: { $in: patientEmailRegexes } } // Patient has granted access
        ]
      };
    }
    
    const labtestList = await Labtest.find(query);
    await logEvent(req.user.email, req.user.role, 'VIEW_LABTEST_LIST', 'SUCCESS');
    res.status(200).send(labtestList);
  } catch (error) {
    await logEvent(req.user.email, req.user.role, 'VIEW_LABTEST_LIST', 'DENIED', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get specific labtest by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const labtest = await Labtest.findById(req.params.id);
    if (!labtest) {
      await logEvent(req.user.email, req.user.role, 'VIEW_LABTEST', 'DENIED', `Not found: ${req.params.id}`);
      return res.status(404).json({ success: false, message: 'Labtest not found!' });
    }
    
    // Ownership and consent check
    let hasConsent = false;
    if (req.user.role === 'Hospital') {
      const consent = await Consent.findOne({
        patientEmail: { $regex: new RegExp('^' + labtest.patemail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i') },
        hospitalEmail: { $regex: new RegExp('^' + req.user.email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i') },
        status: 'Granted'
      });
      hasConsent = !!consent;
    }

    const isPatient = req.user.email && labtest.patemail && req.user.email.toLowerCase() === labtest.patemail.toLowerCase();
    const isLab = req.user.email && labtest.labemail && req.user.email.toLowerCase() === labtest.labemail.toLowerCase();
    const isHospital = req.user.email && labtest.hospitalemail && req.user.email.toLowerCase() === labtest.hospitalemail.toLowerCase();

    if (req.user.role !== 'Admin' && 
        !isPatient && 
        !isLab && 
        !isHospital &&
        !hasConsent) {
      await logEvent(req.user.email, req.user.role, 'VIEW_LABTEST', 'DENIED', `BOLA attempt: ${req.params.id}`);
      return res.status(403).json({ success: false, error: 'Access denied. Consent required.' });
    }

    await logEvent(req.user.email, req.user.role, 'VIEW_LABTEST', 'SUCCESS', req.params.id);
    res.status(200).send(labtest);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Upload labtest (Lab assistant only)
router.post('/', auth, auth.checkRole(['Lab']), upload.single('report'), validateBody(labtestSchema), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ success: false, error: 'No file in the request' });
    }

    // Verify ownership
    if (req.user.email !== req.body.labemail) {
      await logEvent(req.user.email, req.user.role, 'CREATE_LABTEST', 'DENIED', `Mismatch: body ${req.body.labemail}`);
      return res.status(403).json({ success: false, error: 'Access denied. Lab email mismatch.' });
    }
    
    const fileName = file.filename;
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

    let labtest = new Labtest({
        patemail: req.body.patemail,
        labemail: req.body.labemail,
        hospitalemail: req.body.hospitalemail,
        patient_name: req.body.patient_name,
        test_name: req.body.test_name,
        range: req.body.range,
        actual_range: req.body.actual_range,
        level: req.body.level,
        date: req.body.date,
        report: `${basePath}${fileName}`, // Store the file path
    });

    labtest = await labtest.save();
    if (!labtest) {
      return res.status(400).json({ success: false, error: 'The labtest cannot be created!' });
    }
    await logEvent(req.user.email, req.user.role, 'CREATE_LABTEST', 'SUCCESS', `Created labtest ID ${labtest.id} for patient ${req.body.patemail}`);
    res.status(201).json(labtest);
  } catch (error) {
    if (error.message && error.message.includes('Invalid file type')) {
      await logEvent(req.user.email, req.user.role, 'CREATE_LABTEST', 'DENIED', error.message);
      return res.status(400).json({ success: false, error: error.message });
    }
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete labtest (Admin only)
router.delete('/:id', auth, auth.checkRole(['Admin']), async (req, res) => {
  try {
    const labtest = await Labtest.findByIdAndDelete(req.params.id);
    if (!labtest) {
      await logEvent(req.user.email, req.user.role, 'DELETE_LABTEST', 'DENIED', `Not found: ${req.params.id}`);
      return res.status(404).json({ success: false, message: 'Labtest not found!' });
    }
    await logEvent(req.user.email, req.user.role, 'DELETE_LABTEST', 'SUCCESS', `Deleted ID ${req.params.id}`);
    res.status(200).json({ success: true, message: 'The labtest is deleted!' });
  } catch (error) {
    await logEvent(req.user.email, req.user.role, 'DELETE_LABTEST', 'DENIED', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update labtest details (Lab assistant only)
router.put('/:id', auth, auth.checkRole(['Lab']), validateBody(labtestSchema), async (req, res) => {
  try {
    const existing = await Labtest.findById(req.params.id);
    if (!existing) {
      await logEvent(req.user.email, req.user.role, 'UPDATE_LABTEST', 'DENIED', `Not found: ${req.params.id}`);
      return res.status(404).json({ success: false, message: 'Labtest not found!' });
    }

    // Verify ownership
    if (req.user.email !== existing.labemail) {
      await logEvent(req.user.email, req.user.role, 'UPDATE_LABTEST', 'DENIED', `BOLA attempt: ${req.params.id}`);
      return res.status(403).json({ success: false, error: 'Access denied. You did not upload this lab test.' });
    }

    const labtest = await Labtest.findByIdAndUpdate(
      req.params.id,
      {
        patemail: req.body.patemail,
        labemail: req.body.labemail,
        hospitalemail: req.body.hospitalemail,
        patient_name: req.body.patient_name,
        test_name: req.body.test_name,
        range: req.body.range,
        actual_range: req.body.actual_range,
        level: req.body.level,
        date: req.body.date,
      },
      { new: true }
    );

    if (!labtest) return res.status(400).send('The labtest cannot be updated!');
    await logEvent(req.user.email, req.user.role, 'UPDATE_LABTEST', 'SUCCESS', req.params.id);
    res.status(200).send(labtest);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update the labtest's report file (Lab assistant only)
router.put('/upload_image/:id', auth, auth.checkRole(['Lab']), upload.single('report'), async (req, res) => {
  try {
    const existing = await Labtest.findById(req.params.id);
    if (!existing) {
      await logEvent(req.user.email, req.user.role, 'UPLOAD_LAB_REPORT', 'DENIED', `Not found: ${req.params.id}`);
      return res.status(404).json({ success: false, message: 'Labtest not found!' });
    }

    // Verify ownership
    if (req.user.email !== existing.labemail) {
      await logEvent(req.user.email, req.user.role, 'UPLOAD_LAB_REPORT', 'DENIED', `BOLA attempt: ${req.params.id}`);
      return res.status(403).json({ success: false, error: 'Access denied.' });
    }

    const file = req.file;
    if (!file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    const fileName = file.filename;
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

    const updatedLabtest = await Labtest.findByIdAndUpdate(
      req.params.id,
      { report: `${basePath}${fileName}` }, // Update the file path
      { new: true }
    );

    await logEvent(req.user.email, req.user.role, 'UPLOAD_LAB_REPORT', 'SUCCESS', req.params.id);
    res.status(200).json({ success: true, message: 'Labtest report updated successfully', labtest: updatedLabtest });
  } catch (error) {
    if (error.message && error.message.includes('Invalid file type')) {
      await logEvent(req.user.email, req.user.role, 'UPLOAD_LAB_REPORT', 'DENIED', error.message);
      return res.status(400).json({ success: false, error: error.message });
    }
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;

