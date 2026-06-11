const express = require('express');
const router = express.Router();
const { Consent } = require('../models/consent');
const { User } = require('../models/user');
const auth = require('../helpers/jwt');
const logEvent = require('../helpers/auditLogger');
const { validateBody, consentRequestSchema, consentActionSchema } = require('../helpers/validation');

// Hospital requests access to a patient's historical records
router.post('/request', auth, auth.checkRole(['Hospital']), validateBody(consentRequestSchema), async (req, res) => {
    try {
        const { patientEmail } = req.body;
        const hospitalEmail = req.user.email;

        // Verify that patient exists
        const patient = await User.findOne({ email: { $regex: new RegExp('^' + patientEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i') }, role: 'Patient' });
        if (!patient) {
            await logEvent(hospitalEmail, req.user.role, 'CONSENT_REQUEST', 'DENIED', `Patient email not registered: ${patientEmail}`);
            return res.status(404).json({ success: false, error: 'Patient email not found.' });
        }

        // Check if a consent mapping already exists
        let consent = await Consent.findOne({
            patientEmail: { $regex: new RegExp('^' + patientEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i') },
            hospitalEmail: { $regex: new RegExp('^' + hospitalEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i') }
        });
        if (consent) {
            // Re-request access
            consent.status = 'Pending';
            consent.updatedAt = Date.now();
            await consent.save();
        } else {
            consent = new Consent({
                patientEmail: patient.email,
                hospitalEmail,
                status: 'Pending'
            });
            await consent.save();
        }

        await logEvent(hospitalEmail, req.user.role, 'CONSENT_REQUEST', 'SUCCESS', `Requested historical access to patient ${patientEmail}`);
        res.status(200).json({ success: true, message: 'Access request submitted successfully.', consent });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Patient grants access to a hospital
router.post('/grant', auth, auth.checkRole(['Patient']), validateBody(consentActionSchema), async (req, res) => {
    try {
        const { hospitalEmail } = req.body;
        const patientEmail = req.user.email;

        let consent = await Consent.findOne({
            patientEmail: { $regex: new RegExp('^' + patientEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i') },
            hospitalEmail: { $regex: new RegExp('^' + hospitalEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i') }
        });
        if (!consent) {
            // If hospital hasn't requested but patient explicitly wants to grant
            consent = new Consent({
                patientEmail,
                hospitalEmail,
                status: 'Granted'
            });
        } else {
            consent.status = 'Granted';
            consent.updatedAt = Date.now();
        }

        await consent.save();
        await logEvent(patientEmail, req.user.role, 'CONSENT_GRANT', 'SUCCESS', `Granted historical access to hospital ${hospitalEmail}`);
        res.status(200).json({ success: true, message: 'Access granted successfully.', consent });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Patient revokes access from a hospital
router.post('/revoke', auth, auth.checkRole(['Patient']), validateBody(consentActionSchema), async (req, res) => {
    try {
        const { hospitalEmail } = req.body;
        const patientEmail = req.user.email;

        let consent = await Consent.findOne({
            patientEmail: { $regex: new RegExp('^' + patientEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i') },
            hospitalEmail: { $regex: new RegExp('^' + hospitalEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i') }
        });
        if (!consent) {
            return res.status(404).json({ success: false, error: 'No active consent record found.' });
        }

        consent.status = 'Revoked';
        consent.updatedAt = Date.now();
        await consent.save();

        await logEvent(patientEmail, req.user.role, 'CONSENT_REVOKE', 'SUCCESS', `Revoked access from hospital ${hospitalEmail}`);
        res.status(200).json({ success: true, message: 'Access revoked successfully.', consent });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Patient denies access request from a hospital
router.post('/deny', auth, auth.checkRole(['Patient']), validateBody(consentActionSchema), async (req, res) => {
    try {
        const { hospitalEmail } = req.body;
        const patientEmail = req.user.email;

        let consent = await Consent.findOne({
            patientEmail: { $regex: new RegExp('^' + patientEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i') },
            hospitalEmail: { $regex: new RegExp('^' + hospitalEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i') }
        });
        if (!consent) {
            return res.status(404).json({ success: false, error: 'No access request found.' });
        }

        consent.status = 'Denied';
        consent.updatedAt = Date.now();
        await consent.save();

        await logEvent(patientEmail, req.user.role, 'CONSENT_DENY', 'SUCCESS', `Denied access to hospital ${hospitalEmail}`);
        res.status(200).json({ success: true, message: 'Access request denied successfully.', consent });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get consent statuses for the logged-in user (Patient or Hospital)
router.get('/status', auth, auth.checkRole(['Patient', 'Hospital', 'Admin']), async (req, res) => {
    try {
        let query = {};
        if (req.user.role === 'Patient') {
            query = { patientEmail: { $regex: new RegExp('^' + req.user.email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i') } };
        } else if (req.user.role === 'Hospital') {
            query = { hospitalEmail: { $regex: new RegExp('^' + req.user.email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i') } };
        }

        const consents = await Consent.find(query);
        res.status(200).json(consents);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
