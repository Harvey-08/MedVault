const mongoose = require('mongoose');
mongoose.pluralize(null);
const bcrypt = require('bcryptjs');
const { User } = require('./models/user');

require('dotenv').config();

const connectionString = process.env.CONNECTION_STRING || 'mongodb://127.0.0.1:27017/';

mongoose.connect(connectionString, {
    dbName: 'Hospital_App'
}).then(async () => {
    console.log('Connected to database. Checking for Admin account...');

    // Check if an Admin user already exists (by email OR role)
    const adminExists = await User.findOne({
        $or: [
            { email: 'admin@gmail.com' },
            { role: 'Admin' }
        ]
    });

    if (adminExists) {
        console.log('Admin account already exists.');
        process.exit(0);
    }

    // Create the Admin user
    const adminUser = new User({
        name: 'Admin',
        email: 'admin@gmail.com',
        passwordHash: bcrypt.hashSync('admin#2387', 10),
        phone: '9876543210',
        role: 'Admin',
        city: 'System',
        status: 'Approved',
        agreedToPrivacyPolicy: true
    });
    await adminUser.save();

    console.log('-----------------------------------');
    console.log('MedVault admin account seeded successfully!');
    console.log('Admin credentials:');
    console.log('Email: admin@gmail.com');
    console.log('Password: admin#2387');
    console.log('-----------------------------------');
    process.exit(0);
}).catch(err => {
    console.error('Error connecting to the database or seeding Admin:', err);
    process.exit(1);
});
