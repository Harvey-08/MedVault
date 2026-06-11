const { User } = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../helpers/jwt');
const logEvent = require('../helpers/auditLogger');
const { AuditLog } = require('../models/auditLog');
const {
    validateBody,
    registerSchema,
    labRegisterSchema,
    loginSchema,
    resetPasswordSchema,
    changePasswordSchema
} = require('../helpers/validation');

// Get all users (Admin or Hospital)
router.get('/', auth, auth.checkRole(['Admin', 'Hospital']), async (req, res) => {
    try {
        let query = {};
        if (req.user.role === 'Hospital') {
            query = { role: 'Lab', hospitalemail: req.user.email };
        }
        const userList = await User.find(query).select('-passwordHash');
        await logEvent(req.user.email, req.user.role, 'VIEW_ALL_USERS', 'SUCCESS');
        res.status(200).json(userList);
    } catch (error) {
        await logEvent(req.user.email, req.user.role, 'VIEW_ALL_USERS', 'DENIED', error.message);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// GET /timeline - fetches chronological unified history of the patient
router.get('/timeline', auth, async (req, res) => {
    try {
        const patientEmail = req.query.patientEmail || req.user.email;

        // Verify authorization:
        // 1. If Patient is requesting, they can only view their own timeline
        // 2. If Hospital is requesting, they must either have created a record for this patient OR have 'Granted' consent.
        // 3. Admin is allowed.
        let isAuthorized = false;
        if (req.user.role === 'Admin') {
            isAuthorized = true;
        } else if (req.user.role === 'Patient' && req.user.email.toLowerCase() === patientEmail.toLowerCase()) {
            isAuthorized = true;
        } else if (req.user.role === 'Hospital') {
            const { Consent } = require('../models/consent');

            const patientEmailRegex = new RegExp('^' + patientEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i');
            const hospitalEmailRegex = new RegExp('^' + req.user.email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i');

            const consent = await Consent.findOne({
                patientEmail: { $regex: patientEmailRegex },
                hospitalEmail: { $regex: hospitalEmailRegex }
            });

            if (consent && consent.status === 'Granted') {
                isAuthorized = true;
            }
        }

        if (!isAuthorized) {
            await logEvent(req.user.email, req.user.role, 'VIEW_TIMELINE', 'DENIED', `Unauthorized access to timeline for: ${patientEmail}`);
            return res.status(403).json({ success: false, error: 'Access denied. You do not have permission to view this history.' });
        }

        const { Prescription } = require('../models/prescription');
        const { Appointment } = require('../models/appointment');
        const { Labtest } = require('../models/labtest');

        const patientEmailRegex = new RegExp('^' + patientEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i');

        // Fetch records
        const prescriptions = await Prescription.find({ patemail: { $regex: patientEmailRegex } });
        const appointments = await Appointment.find({ patemail: { $regex: patientEmailRegex } });
        const labtests = await Labtest.find({ patemail: { $regex: patientEmailRegex } });

        // Merge and transform to standardized format
        const timeline = [];

        prescriptions.forEach(p => {
            timeline.push({
                id: p._id,
                type: 'Prescription',
                date: p.dateCreated ? new Date(p.dateCreated) : new Date(),
                title: `Prescription by Dr. ${p.doctor_name}`,
                provider: p.hospitalemail,
                details: {
                    findings: p.findings,
                    medicine_1: p.medicine_1,
                    medicine_2: p.medicine_2,
                    medicine_3: p.medicine_3,
                    medicine_4: p.medicine_4,
                    lab_test: p.lab_test,
                    notes: p.notes,
                    status: p.status
                }
            });
        });

        appointments.forEach(a => {
            timeline.push({
                id: a._id,
                type: 'Appointment',
                date: new Date(a.appointment_date),
                title: `Appointment with Dr. ${a.doctor_name || 'TBD'}`,
                provider: a.hospitalemail,
                details: {
                    reason: a.reason,
                    timeslot: a.timeslot,
                    status: a.status
                }
            });
        });

        labtests.forEach(l => {
            timeline.push({
                id: l._id,
                type: 'Lab Test',
                date: l.date ? new Date(l.date) : new Date(l.dateCreated),
                title: `Lab Test: ${l.test_name}`,
                provider: l.labemail,
                details: {
                    range: l.range,
                    actual_range: l.actual_range,
                    level: l.level,
                    report: l.report
                }
            });
        });

        // Sort chronologically descending (newest first)
        timeline.sort((a, b) => b.date - a.date);

        await logEvent(req.user.email, req.user.role, 'VIEW_TIMELINE', 'SUCCESS', `Viewed timeline for: ${patientEmail}`);
        res.status(200).json(timeline);
    } catch (error) {
        console.error('Error fetching timeline:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// Get current user's profile details
router.get('/profile', auth, async (req, res) => {
    try {
        const userEmail = req.user.email.trim().toLowerCase();
        const user = await User.findOne({ email: { $regex: new RegExp('^' + userEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i') } }).select('-passwordHash');
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error("PROFILE ENDPOINT ERROR:", error);
        res.status(500).json({ success: false, error: 'Internal server error', details: error.message });
    }
});

// Get system audit logs (Admin only)
router.get('/audit-logs', auth, auth.checkRole(['Admin']), async (req, res) => {
    try {
        const logs = await AuditLog.find().sort({ timestamp: -1 });
        res.status(200).json(logs);
    } catch (error) {
        console.error("AUDIT LOGS FETCH ERROR:", error);
        res.status(500).json({ success: false, error: 'Internal server error', details: error.message });
    }
});

// Get a user by ID (Owner or Admin)
router.get('/:id', auth, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-passwordHash');
        if (!user) {
            await logEvent(req.user.email, req.user.role, 'VIEW_USER_BY_ID', 'DENIED', `User not found: ${req.params.id}`);
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        if (req.user.role !== 'Admin' && req.user.email !== user.email) {
            await logEvent(req.user.email, req.user.role, 'VIEW_USER_BY_ID', 'DENIED', `Forbidden access to: ${user.email}`);
            return res.status(403).json({ error: 'Access denied.' });
        }
        await logEvent(req.user.email, req.user.role, 'VIEW_USER_BY_ID', 'SUCCESS', `Viewed user: ${user.email}`);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// Create a new user (Registration)
router.post('/', validateBody(registerSchema), async (req, res) => {
    try {
        const { name, email, password, phone, role, city, question1, question2, status } = req.body;
        
        // Check if email already exists (case-insensitive)
        const existingUser = await User.findOne({ email: { $regex: new RegExp('^' + email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i') } });
        if (existingUser) {
            await logEvent(email, 'anonymous', 'CREATE_USER', 'DENIED', 'Email already registered');
            return res.status(400).json({ error: 'Email already registered' });
        }

        const user = new User({
            name,
            email,
            passwordHash: bcrypt.hashSync(password, 10),
            phone,
            role,
            city,
            question1,
            question2,
            status,
        });

        const savedUser = await user.save();
        await logEvent(savedUser.email, savedUser.role, 'CREATE_USER', 'SUCCESS');
        res.status(201).json(savedUser);
    } catch (error) {
        await logEvent(req.body.email || 'unknown', 'anonymous', 'CREATE_USER', 'DENIED', error.message);
        res.status(500).json({ success: false, error: 'Failed to create user' });
    }
});

// Create a new lab user (Admin or Hospital)
router.post('/lab', validateBody(labRegisterSchema), async (req, res) => {
    try {
        const { name, email, password, phone, role, city, hospitalemail } = req.body;
        
        // Check if email already exists (case-insensitive)
        const existingUser = await User.findOne({ email: { $regex: new RegExp('^' + email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i') } });
        if (existingUser) {
            await logEvent(email, 'anonymous', 'CREATE_USER', 'DENIED', 'Email already registered (Lab)');
            return res.status(400).json({ error: 'Email already registered' });
        }

        const user = new User({
            name,
            email,
            passwordHash: bcrypt.hashSync(password, 10),
            phone,
            role,
            city,
            hospitalemail,
        });

        const savedUser = await user.save();
        await logEvent(savedUser.email, savedUser.role, 'CREATE_USER', 'SUCCESS', `Lab user linked to hospital ${hospitalemail}`);
        res.status(201).json(savedUser);
    } catch (error) {
        await logEvent(req.body.email || 'unknown', 'anonymous', 'CREATE_USER', 'DENIED', error.message);
        res.status(500).json({ success: false, error: 'Failed to create user' });
    }
});

// Delete user (Admin or Hospital)
router.delete('/:id', auth, auth.checkRole(['Admin', 'Hospital']), async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            await logEvent(req.user.email, req.user.role, 'DELETE_USER', 'DENIED', `User not found: ${req.params.id}`);
            return res.status(404).json({ success: false, message: "user not found!" });
        }

        // If requester is a Hospital, they can only delete Lab technicians linked to them
        if (req.user.role === 'Hospital' && (user.role !== 'Lab' || user.hospitalemail !== req.user.email)) {
            await logEvent(req.user.email, req.user.role, 'DELETE_USER', 'DENIED', `Access denied to delete user: ${user.email}`);
            return res.status(403).json({ success: false, error: 'Access denied.' });
        }

        await User.findByIdAndDelete(req.params.id);
        await logEvent(req.user.email, req.user.role, 'DELETE_USER', 'SUCCESS', `Deleted user: ${user.email}`);
        return res.status(200).json({ success: true, message: 'the user is deleted!' });
    } catch (err) {
        await logEvent(req.user.email, req.user.role, 'DELETE_USER', 'DENIED', err.message);
        return res.status(500).json({ success: false, error: err.message });
    }
});

// Login
router.post('/login', validateBody(loginSchema), async (req, res) => {
    try {
        const { email, password, role: expectedRole } = req.body;
        const cleanEmail = email.trim().toLowerCase();

        // Find user by email (case-insensitive to handle legacy mixed-case data)
        const user = await User.findOne({ email: { $regex: new RegExp('^' + cleanEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i') } });

        if (!user) {
            await logEvent(cleanEmail, 'anonymous', 'USER_LOGIN', 'DENIED', 'User not found');
            return res.status(400).json({ error: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

        if (!isPasswordValid) {
            await logEvent(cleanEmail, user.role, 'USER_LOGIN', 'DENIED', 'Incorrect password');
            return res.status(400).json({ error: 'Incorrect password' });
        }

        // Special handling for admin@gmail.com - treat as Admin role if role field is missing
        let actualRole = user.role;
        if (cleanEmail === 'admin@gmail.com' && !actualRole) {
            actualRole = 'Admin';
        }

        // Enforce single admin credential
        if (expectedRole === 'Admin' && cleanEmail !== 'admin@gmail.com') {
            await logEvent(cleanEmail, actualRole, 'USER_LOGIN', 'DENIED', 'Invalid admin credentials');
            return res.status(403).json({
                error: 'Invalid admin credentials.'
            });
        }

        // Validate that the expected role matches the user's actual role
        if (expectedRole && expectedRole !== actualRole) {
            const expectedLabel = expectedRole || 'the correct';
            const actualLabel = actualRole || 'this account role';
            await logEvent(cleanEmail, actualRole, 'USER_LOGIN', 'DENIED', `Role mismatch (expected ${expectedRole}, actual ${actualRole})`);
            return res.status(403).json({
                error: `Access denied. This login is for ${expectedLabel} only. This account is ${actualLabel}. Please use the ${actualLabel} login option.`
            });
        }

        const token = jwt.sign(
            {
                email: user.email,
                role: actualRole,
                status: user.status,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '1d',
                algorithm: 'HS256'
            }
        );

        await logEvent(user.email, actualRole, 'USER_LOGIN', 'SUCCESS');
        res.status(200).json({
            token,
            role: actualRole,
            status: user.status,
            hospitalemail: user.hospitalemail, // Ensure this field is included (for lab users)
        });
    } catch (error) {
        console.error('Error during login:', error.message);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update status (Admin only)
router.put('/status/:id', auth, auth.checkRole(['Admin']), async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            {
                status: req.body.status
            },
            { new: true }
        );

        if (!user) {
            await logEvent(req.user.email, req.user.role, 'UPDATE_USER_STATUS', 'DENIED', `User not found: ${req.params.id}`);
            return res.status(400).send('the user cannot be updated!');
        }

        await logEvent(req.user.email, req.user.role, 'UPDATE_USER_STATUS', 'SUCCESS', `Updated user ${user.email} status to ${req.body.status}`);
        res.send(user);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Update user details (Owner or Admin)
router.put('/:id', auth, async (req, res) => {
    try {
        const { name, email, password, phone, city, role, question1, question2, status } = req.body;
        const user = await User.findById(req.params.id);

        if (!user) {
            await logEvent(req.user.email, req.user.role, 'UPDATE_USER', 'DENIED', `User not found: ${req.params.id}`);
            return res.status(404).json({ error: 'User not found' });
        }

        if (req.user.role !== 'Admin' && req.user.email !== user.email) {
            await logEvent(req.user.email, req.user.role, 'UPDATE_USER', 'DENIED', `Access denied to modify user: ${user.email}`);
            return res.status(403).json({ error: 'Access denied.' });
        }

        let passwordHash = user.passwordHash;
        if (password) {
            passwordHash = bcrypt.hashSync(password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                name,
                email,
                passwordHash,
                phone,
                city,
                role,
                question1,
                question2,
                status,
            },
            { new: true }
        );

        await logEvent(req.user.email, req.user.role, 'UPDATE_USER', 'SUCCESS', `Updated details of user ${updatedUser.email}`);
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update user' });
    }
});

// Update Admin details (Admin only)
router.put('/admin/:id', auth, auth.checkRole(['Admin']), async (req, res) => {
    try {
        const adminExist = await User.findById(req.params.id);

        if (!adminExist) {
            await logEvent(req.user.email, req.user.role, 'UPDATE_ADMIN', 'DENIED', 'Admin not found');
            return res.status(404).send('Admin not found');
        }

        let newPassword;
        // Check if password is being updated
        if (req.body.password) {
            newPassword = bcrypt.hashSync(req.body.password, 10);
        } else {
            newPassword = adminExist.passwordHash; // Use the existing password hash
        }

        // Update the admin fields
        const updatedAdmin = await User.findByIdAndUpdate(
            req.params.id,
            {
                email: req.body.email,
                passwordHash: newPassword,  // Password hash
                phone: req.body.mobile
            },
            { new: true } // Return the updated document
        );

        if (!updatedAdmin) {
            return res.status(400).send('Failed to update admin');
        }

        await logEvent(req.user.email, req.user.role, 'UPDATE_ADMIN', 'SUCCESS');
        res.send(updatedAdmin);
    } catch (error) {
        res.status(500).send(`Server error: ${error.message}`);
    }
});

// Reset password
router.post('/reset_password', validateBody(resetPasswordSchema), async (req, res) => {
    try {
        const { email: rawEmail, question1, question2, newPassword } = req.body;
        const email = rawEmail.trim().toLowerCase();
        const user = await User.findOne({ email: { $regex: new RegExp('^' + email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i') } });

        if (!user) {
            await logEvent(email, 'anonymous', 'RESET_PASSWORD', 'DENIED', 'User not found');
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.question1 !== question1 || user.question2 !== question2) {
            await logEvent(email, user.role, 'RESET_PASSWORD', 'DENIED', 'Security questions do not match');
            return res.status(400).json({ error: 'Security questions do not match' });
        }

        const hashedPassword = bcrypt.hashSync(newPassword, 10);
        user.passwordHash = hashedPassword;
        await user.save();

        await logEvent(email, user.role, 'RESET_PASSWORD', 'SUCCESS');
        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Change password (using old password)
router.post('/change_password', validateBody(changePasswordSchema), async (req, res) => {
    try {
        const { email: rawEmail, oldPassword, newPassword } = req.body;
        const email = rawEmail.trim().toLowerCase();
        const user = await User.findOne({ email: { $regex: new RegExp('^' + email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i') } });

        if (!user) {
            await logEvent(email, 'anonymous', 'CHANGE_PASSWORD', 'DENIED', 'User not found');
            return res.status(404).json({ error: 'User not found' });
        }

        // Verify old password
        if (!bcrypt.compareSync(oldPassword, user.passwordHash)) {
            await logEvent(email, user.role, 'CHANGE_PASSWORD', 'DENIED', 'Invalid old password');
            return res.status(401).json({ error: 'Invalid old password' });
        }

        // Hash and update new password
        user.passwordHash = bcrypt.hashSync(newPassword, 10);
        await user.save();

        await logEvent(email, user.role, 'CHANGE_PASSWORD', 'SUCCESS');
        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error('Error changing password:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});



module.exports = router;
