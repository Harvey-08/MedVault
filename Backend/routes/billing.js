const { Billing } = require('../models/billing');
const express = require('express');
const router = express.Router();
const auth = require('../helpers/jwt');
const logEvent = require('../helpers/auditLogger');
const { validateBody, billingSchema } = require('../helpers/validation');

// Get all billing records (filtered by role/email)
router.get('/', auth, auth.checkRole(['Patient', 'Hospital', 'Admin']), async (req, res) => {
    try {
        let query = {};
        if (req.user.role === 'Patient') {
            query = { patemail: req.user.email };
        } else if (req.user.role === 'Hospital') {
            query = { hospitalemail: req.user.email };
        }
        
        const billingList = await Billing.find(query)
            .populate('patient', '-passwordHash')
            .populate('hospital', '-passwordHash');
        await logEvent(req.user.email, req.user.role, 'VIEW_BILLING_LIST', 'SUCCESS');
        res.status(200).send(billingList);
    } catch (error) {
        await logEvent(req.user.email, req.user.role, 'VIEW_BILLING_LIST', 'DENIED', error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get specific billing by ID
router.get('/:id', auth, async (req, res) => {
    try {
        const billing = await Billing.findById(req.params.id)
            .populate('patient', '-passwordHash')
            .populate('hospital', '-passwordHash');
        if (!billing) {
            await logEvent(req.user.email, req.user.role, 'VIEW_BILLING', 'DENIED', `Not found: ${req.params.id}`);
            return res.status(404).json({ success: false, message: 'Billing record not found!' });
        }
        
        // Block access if not Owner (Patient or Hospital) or Admin
        if (req.user.role !== 'Admin' && 
            req.user.email !== billing.patemail && 
            req.user.email !== billing.hospitalemail) {
            await logEvent(req.user.email, req.user.role, 'VIEW_BILLING', 'DENIED', `BOLA attempt: ${req.params.id}`);
            return res.status(403).json({ success: false, error: 'Access denied. You do not own this record.' });
        }
        
        await logEvent(req.user.email, req.user.role, 'VIEW_BILLING', 'SUCCESS', req.params.id);
        res.status(200).send(billing);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Create billing (Hospital or Admin)
router.post('/', auth, auth.checkRole(['Hospital', 'Admin']), validateBody(billingSchema), async (req, res) => {
    try {
        // Enforce that hospital email matches logged-in user if role is Hospital
        if (req.user.role === 'Hospital' && req.user.email !== req.body.hospitalemail) {
            await logEvent(req.user.email, req.user.role, 'CREATE_BILLING', 'DENIED', `Mismatch: body ${req.body.hospitalemail}`);
            return res.status(403).json({ success: false, error: 'Access denied. Hospital email mismatch.' });
        }

        const { User } = require('../models/user');
        const patientUser = await User.findOne({ email: { $regex: new RegExp('^' + req.body.patemail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i') } });
        const hospitalUser = await User.findOne({ email: { $regex: new RegExp('^' + req.body.hospitalemail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i') } });

        if (!patientUser) {
            return res.status(400).json({ success: false, error: 'Patient account not found.' });
        }
        if (!hospitalUser) {
            return res.status(400).json({ success: false, error: 'Hospital account not found.' });
        }

        let billing = new Billing({
            patient: patientUser._id,
            hospital: hospitalUser._id,
            patemail: req.body.patemail,
            hospitalemail: req.body.hospitalemail,
            patient_name: req.body.patient_name,
            amount: req.body.amount,
            amount_paid: req.body.amount_paid,
            balance: req.body.balance
        });

        billing = await billing.save();
        if (!billing) {
            return res.status(400).send('The billing record cannot be created!');
        }
        await logEvent(req.user.email, req.user.role, 'CREATE_BILLING', 'SUCCESS', `Created billing ID ${billing.id} for patient ${req.body.patemail}`);
        res.status(201).send(billing);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Delete billing (Admin only)
router.delete('/:id', auth, auth.checkRole(['Admin']), (req, res) => {
    Billing.findByIdAndDelete(req.params.id)
        .then(billing => {
            if (billing) {
                logEvent(req.user.email, req.user.role, 'DELETE_BILLING', 'SUCCESS', `Deleted ID ${req.params.id}`);
                return res.status(200).json({ success: true, message: 'The billing is deleted!' });
            } else {
                logEvent(req.user.email, req.user.role, 'DELETE_BILLING', 'DENIED', `Not found: ${req.params.id}`);
                return res.status(404).json({ success: false, message: "Billing not found!" });
            }
        })
        .catch(err => {
            logEvent(req.user.email, req.user.role, 'DELETE_BILLING', 'DENIED', err.message);
            return res.status(500).json({ success: false, error: err.message });
        });
});

// Update billing (Hospital creator or Admin)
router.put('/:id', auth, auth.checkRole(['Hospital', 'Admin']), validateBody(billingSchema), async (req, res) => {
    try {
        const existing = await Billing.findById(req.params.id);
        if (!existing) {
            await logEvent(req.user.email, req.user.role, 'UPDATE_BILLING', 'DENIED', `Not found: ${req.params.id}`);
            return res.status(404).json({ success: false, message: 'Billing not found!' });
        }

        // Verify ownership if role is Hospital
        if (req.user.role === 'Hospital' && req.user.email !== existing.hospitalemail) {
            await logEvent(req.user.email, req.user.role, 'UPDATE_BILLING', 'DENIED', `BOLA attempt: ${req.params.id}`);
            return res.status(403).json({ success: false, error: 'Access denied. You did not create this billing record.' });
        }

        const billing = await Billing.findByIdAndUpdate(
            req.params.id,
            {        
                patemail: req.body.patemail,
                hospitalemail: req.body.hospitalemail,
                patient_name: req.body.patient_name,
                amount: req.body.amount,
                amount_paid: req.body.amount_paid,
                balance: req.body.balance
            },
            { new: true }
        );

        await logEvent(req.user.email, req.user.role, 'UPDATE_BILLING', 'SUCCESS', req.params.id);
        res.status(200).send(billing);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;