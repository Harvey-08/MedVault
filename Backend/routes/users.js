const { User } = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Get all users
router.get('/', async (req, res) => {
    try {
        const userList = await User.find().select('-passwordHash');
        res.status(200).json(userList);
    } catch (error) {
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// Get a user by ID
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-passwordHash');
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// Create a new user
router.post('/', async (req, res) => {
    try {
        const { name, email, password, phone, role, city, question1, question2, status } = req.body;
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
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to create user' });
    }
});

// Create a new user
router.post('/lab', async (req, res) => {
    try {
        const { name, email, password, phone, role, city, hospitalemail } = req.body;
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
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to create user' });
    }
});


router.delete('/:id', (req, res) => {
    User
        .findByIdAndRemove(req.params.id).then(prescription => {
            if (prescription) {
                return res.status(200).json({ success: true, message: 'the user is deleted!' })
            } else {
                return res.status(404).json({ success: false, message: "user not found!" })
            }
        }).catch(err => {
            return res.status(500).json({ success: false, error: err })
        })
})
router.post('/login', async (req, res) => {
    try {
        const { email, password, role: expectedRole } = req.body;

        // Find user only by email. Role is determined from the user document itself.
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Incorrect password' });
        }

        // Special handling for admin@gmail.com - treat as Admin role if role field is missing
        let actualRole = user.role;
        if (email.toLowerCase() === 'admin@gmail.com' && !actualRole) {
            actualRole = 'Admin';
        }

        // Enforce single admin credential
        if (expectedRole === 'Admin' && email.toLowerCase() !== 'admin@gmail.com') {
            return res.status(403).json({
                error: 'Invalid admin credentials.'
            });
        }

        // Validate that the expected role matches the user's actual role
        if (expectedRole && expectedRole !== actualRole) {
            const expectedLabel = expectedRole || 'the correct';
            const actualLabel = actualRole || 'this account role';
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

router.put('/status/:id', async (req, res) => {
    const user = await User.findByIdAndUpdate(
        req.params.id,
        {
            status: req.body.status
        },
        { new: true }
    )

    if (!user)
        return res.status(400).send('the user cannot be created!')

    res.send(user);
})

router.put('/:id', async (req, res) => {
    try {
        const { name, email, password, phone, city, role, question1, question2, status } = req.body;
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
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

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update user' });
    }
});


router.put('/admin/:id', async (req, res) => {
    try {
        const adminExist = await User.findById(req.params.id);

        if (!adminExist) {
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
                mobile: req.body.mobile
            },
            { new: true } // Return the updated document
        );

        if (!updatedAdmin) {
            return res.status(400).send('Failed to update admin');
        }

        res.send(updatedAdmin);
    } catch (error) {
        res.status(500).send(`Server error: ${error.message}`);
    }
});
// Reset password
router.post('/reset_password', async (req, res) => {
    try {
        const { email, question1, question2, newPassword } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.question1 !== question1 || user.question2 !== question2) {
            return res.status(400).json({ error: 'Security questions do not match' });
        }

        const hashedPassword = bcrypt.hashSync(newPassword, 10);
        user.passwordHash = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Change password (using old password)
router.post('/change_password', async (req, res) => {
    try {
        const { email, oldPassword, newPassword } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Verify old password
        if (!bcrypt.compareSync(oldPassword, user.passwordHash)) {
            return res.status(401).json({ error: 'Invalid old password' });
        }

        // Hash and update new password
        user.passwordHash = bcrypt.hashSync(newPassword, 10);
        await user.save();

        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error('Error changing password:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
