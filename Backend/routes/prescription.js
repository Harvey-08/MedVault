const { Prescription } = require('../models/prescription');
const { Consent } = require('../models/consent');
const express = require('express');
const router = express.Router();
const auth = require('../helpers/jwt');
const logEvent = require('../helpers/auditLogger');
const { validateBody, prescriptionSchema, prescriptionStatusSchema } = require('../helpers/validation');
const { checkDrugConflicts } = require('../helpers/drugChecker');


// Get all prescriptions (filtered by logged-in user role/email & active consent)
router.get('/', auth, auth.checkRole(['Patient', 'Hospital', 'Lab', 'Admin']), async (req, res) => {
    try {
        let query = {};
        if (req.user.role === 'Patient') {
            query = { patemail: { $regex: new RegExp('^' + req.user.email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i') } };
        } else if (req.user.role === 'Hospital') {
            const hospitalEmailRegex = new RegExp('^' + req.user.email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i');
            // Check which patients have granted historical access consent to this hospital
            const consentedPatients = await Consent.find({
                hospitalEmail: { $regex: hospitalEmailRegex },
                status: 'Granted'
            }).select('patientEmail');

            const patientEmailRegexes = consentedPatients.map(c => new RegExp('^' + c.patientEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i'));

            query = {
                $or: [
                    { hospitalemail: { $regex: hospitalEmailRegex } }, // Created by this hospital
                    { patemail: { $in: patientEmailRegexes } } // Patient has granted access
                ]
            };
        } else if (req.user.role === 'Lab') {
            const { User } = require('../models/user');
            const labUser = await User.findOne({ email: { $regex: new RegExp('^' + req.user.email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i') } });
            if (!labUser || !labUser.hospitalemail) {
                await logEvent(req.user.email, req.user.role, 'VIEW_PRESCRIPTION_LIST', 'DENIED', 'Lab user is not linked to any hospital');
                return res.status(400).json({ success: false, error: 'Lab user is not linked to any hospital' });
            }
            query = {
                hospitalemail: { $regex: new RegExp('^' + labUser.hospitalemail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i') },
                lab_test: { $ne: '', $exists: true }
            };
        }
        
        const prescriptionList = await Prescription.find(query);
        await logEvent(req.user.email, req.user.role, 'VIEW_PRESCRIPTION_LIST', 'SUCCESS');
        res.status(200).send(prescriptionList);
    } catch (error) {
        await logEvent(req.user.email, req.user.role, 'VIEW_PRESCRIPTION_LIST', 'DENIED', error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get specific prescription by ID (validates consent)
router.get('/:id', auth, async (req, res) => {
    try {
        const prescription = await Prescription.findById(req.params.id);
        if (!prescription) {
            await logEvent(req.user.email, req.user.role, 'VIEW_PRESCRIPTION', 'DENIED', `Not found: ${req.params.id}`);
            return res.status(404).json({ success: false, message: 'Prescription not found!' });
        }
        
        // Ownership check
        const isCreator = req.user.email && prescription.hospitalemail && req.user.email.toLowerCase() === prescription.hospitalemail.toLowerCase();
        const isPatient = req.user.email && prescription.patemail && req.user.email.toLowerCase() === prescription.patemail.toLowerCase();
        
        let hasConsent = false;
        if (req.user.role === 'Hospital') {
            const consent = await Consent.findOne({
                patientEmail: { $regex: new RegExp('^' + prescription.patemail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i') },
                hospitalEmail: { $regex: new RegExp('^' + req.user.email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i') },
                status: 'Granted'
            });
            hasConsent = !!consent;
        }

        let isLabAuthorized = false;
        if (req.user.role === 'Lab') {
            const { User } = require('../models/user');
            const labUser = await User.findOne({ email: { $regex: new RegExp('^' + req.user.email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i') } });
            if (labUser && labUser.hospitalemail && prescription.hospitalemail && labUser.hospitalemail.toLowerCase() === prescription.hospitalemail.toLowerCase() && prescription.lab_test) {
                isLabAuthorized = true;
            }
        }

        if (req.user.role !== 'Admin' && !isCreator && !isPatient && !hasConsent && !isLabAuthorized) {
            await logEvent(req.user.email, req.user.role, 'VIEW_PRESCRIPTION', 'DENIED', `BOLA attempt: ${req.params.id}`);
            return res.status(403).json({ success: false, error: 'Access denied. Consent required.' });
        }
        
        await logEvent(req.user.email, req.user.role, 'VIEW_PRESCRIPTION', 'SUCCESS', req.params.id);
        res.status(200).send(prescription);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Create prescription (Hospital only)
router.post('/', auth, auth.checkRole(['Hospital']), validateBody(prescriptionSchema), async (req, res) => {
    try {
        // Enforce that the hospital email matches the logged-in user
        if (req.user.email !== req.body.hospitalemail) {
            await logEvent(req.user.email, req.user.role, 'CREATE_PRESCRIPTION', 'DENIED', `Mismatch: body ${req.body.hospitalemail}`);
            return res.status(403).json({ success: false, error: 'Access denied. Hospital email mismatch.' });
        }

        // Check for drug interactions
        const conflicts = checkDrugConflicts([
            req.body.medicine_1,
            req.body.medicine_2,
            req.body.medicine_3,
            req.body.medicine_4
        ]);
        if (conflicts.length > 0) {
            const conflictMsg = conflicts.map(c => `[${c.severity}] ${c.message}`).join(', ');
            await logEvent(req.user.email, req.user.role, 'CREATE_PRESCRIPTION', 'DENIED', `Drug interaction: ${conflictMsg}`);
            return res.status(400).json({ success: false, error: `Drug Interaction Warning: ${conflictMsg}` });
        }

        let prescription = new Prescription({
            patemail: req.body.patemail,
            hospitalemail: req.body.hospitalemail,
            doctor_name: req.body.doctor_name,
            patient_name: req.body.patient_name,
            findings: req.body.findings,
            lab_test: req.body.lab_test,
            medicine_1: req.body.medicine_1,
            medicine_2: req.body.medicine_2,
            medicine_3: req.body.medicine_3,
            medicine_4: req.body.medicine_4,
            notes: req.body.notes,
        });

        prescription = await prescription.save();
        if (!prescription) {
            return res.status(400).send('The prescription cannot be created!');
        }
        await logEvent(req.user.email, req.user.role, 'CREATE_PRESCRIPTION', 'SUCCESS', `Created prescription ID ${prescription.id} for patient ${req.body.patemail}`);
        res.status(201).send(prescription);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Delete prescription (Admin only)
router.delete('/:id', auth, auth.checkRole(['Admin']), (req, res) => {
    Prescription.findByIdAndDelete(req.params.id)
        .then(prescription => {
            if (prescription) {
                logEvent(req.user.email, req.user.role, 'DELETE_PRESCRIPTION', 'SUCCESS', `Deleted ID ${req.params.id}`);
                return res.status(200).json({ success: true, message: 'The prescription is deleted!' });
            } else {
                logEvent(req.user.email, req.user.role, 'DELETE_PRESCRIPTION', 'DENIED', `Not found: ${req.params.id}`);
                return res.status(404).json({ success: false, message: "Prescription not found!" });
            }
        })
        .catch(err => {
            logEvent(req.user.email, req.user.role, 'DELETE_PRESCRIPTION', 'DENIED', err.message);
            return res.status(500).json({ success: false, error: err.message });
        });
});

// Update prescription (Hospital only, must be creator)
router.put('/:id', auth, auth.checkRole(['Hospital']), validateBody(prescriptionSchema), async (req, res) => {
    try {
        const existing = await Prescription.findById(req.params.id);
        if (!existing) {
            await logEvent(req.user.email, req.user.role, 'UPDATE_PRESCRIPTION', 'DENIED', `Not found: ${req.params.id}`);
            return res.status(404).json({ success: false, message: 'Prescription not found!' });
        }

        // Verify ownership
        if (req.user.email !== existing.hospitalemail) {
            await logEvent(req.user.email, req.user.role, 'UPDATE_PRESCRIPTION', 'DENIED', `BOLA attempt: ${req.params.id}`);
            return res.status(403).json({ success: false, error: 'Access denied. You did not create this prescription.' });
        }

        // Check for drug interactions
        const conflicts = checkDrugConflicts([
            req.body.medicine_1,
            req.body.medicine_2,
            req.body.medicine_3,
            req.body.medicine_4
        ]);
        if (conflicts.length > 0) {
            const conflictMsg = conflicts.map(c => `[${c.severity}] ${c.message}`).join(', ');
            await logEvent(req.user.email, req.user.role, 'UPDATE_PRESCRIPTION', 'DENIED', `Drug interaction: ${conflictMsg}`);
            return res.status(400).json({ success: false, error: `Drug Interaction Warning: ${conflictMsg}` });
        }

        const prescription = await Prescription.findByIdAndUpdate(
            req.params.id,
            {        
                patemail: req.body.patemail,
                hospitalemail: req.body.hospitalemail,
                doctor_name: req.body.doctor_name,
                patient_name: req.body.patient_name,
                findings: req.body.findings,
                lab_test: req.body.lab_test,
                medicine_1: req.body.medicine_1,
                medicine_2: req.body.medicine_2,
                medicine_3: req.body.medicine_3,
                medicine_4: req.body.medicine_4,
                notes: req.body.notes,
            },
            { new: true }
        );

        await logEvent(req.user.email, req.user.role, 'UPDATE_PRESCRIPTION', 'SUCCESS', req.params.id);
        res.status(200).send(prescription);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Update prescription status (Hospital creator or Admin)
router.put('/status/:id', auth, auth.checkRole(['Hospital', 'Admin']), validateBody(prescriptionStatusSchema), async (req, res) => {
    try {
        const existing = await Prescription.findById(req.params.id);
        if (!existing) {
            await logEvent(req.user.email, req.user.role, 'UPDATE_PRESCRIPTION_STATUS', 'DENIED', `Not found: ${req.params.id}`);
            return res.status(404).json({ success: false, message: 'Prescription not found!' });
        }

        // Verify ownership
        if (req.user.role !== 'Admin' && req.user.email !== existing.hospitalemail) {
            await logEvent(req.user.email, req.user.role, 'UPDATE_PRESCRIPTION_STATUS', 'DENIED', `BOLA attempt: ${req.params.id}`);
            return res.status(403).json({ success: false, error: 'Access denied.' });
        }

        const prescription = await Prescription.findByIdAndUpdate(
            req.params.id,
            {        
                status: req.body.status
            },
            { new: true }
        );

        await logEvent(req.user.email, req.user.role, 'UPDATE_PRESCRIPTION_STATUS', 'SUCCESS', `Updated status of ID ${req.params.id} to ${req.body.status}`);
        res.status(200).send(prescription);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;