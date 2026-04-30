const { Labtest } = require('../models/labtest');
const express = require('express');
const router = express.Router();
const multer = require('multer');

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

router.get('/', async (req, res) => {
  try {
    const labtestList = await Labtest.find();
    res.status(200).send(labtestList);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const labtest = await Labtest.findById(req.params.id);
    if (!labtest) {
      return res.status(404).json({ success: false, message: 'Labtest not found!' });
    }
    res.status(200).send(labtest);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/', upload.single('report'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ success: false, error: 'No file in the request' });
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
    res.status(201).json(labtest);
  } catch (error) {
    // Handle multer errors specifically
    if (error.message && error.message.includes('Invalid file type')) {
      return res.status(400).json({ success: false, error: error.message });
    }
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const labtest = await Labtest.findByIdAndDelete(req.params.id);
    if (!labtest) return res.status(404).json({ success: false, message: 'Labtest not found!' });
    res.status(200).json({ success: true, message: 'The labtest is deleted!' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
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
        // You can add logic to handle report update if needed
      },
      { new: true }
    );

    if (!labtest) return res.status(400).send('The labtest cannot be updated!');
    res.status(200).send(labtest);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update the labtest's report file
router.put('/upload_image/:id', upload.single('report'), async (req, res) => {
  try {
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

    if (!updatedLabtest) {
      return res.status(404).json({ success: false, error: 'Labtest not found!' });
    }
    res.status(200).json({ success: true, message: 'Labtest report updated successfully', labtest: updatedLabtest });
  } catch (error) {
    // Handle multer errors specifically
    if (error.message && error.message.includes('Invalid file type')) {
      return res.status(400).json({ success: false, error: error.message });
    }
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;

