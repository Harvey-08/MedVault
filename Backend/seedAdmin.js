const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { User } = require('./models/user');
require('dotenv').config();

const connectionString = process.env.CONNECTION_STRING || 'mongodb://127.0.0.1:27017/';

mongoose.connect(connectionString, {
    dbName: 'Hospital_App'
}).then(async () => {
    console.log('Connected to database. Checking for Admin user...');
    
    const existingAdmin = await User.findOne({ email: 'admin@gmail.com' });
    if (existingAdmin) {
        console.log('Admin user already exists!');
        process.exit(0);
    }

    const adminUser = new User({
        name: 'Super Admin',
        email: 'admin@gmail.com',
        passwordHash: bcrypt.hashSync('admin#2387', 10),
        phone: '0000000000',
        role: 'Admin',
        city: 'System',
        status: 'Approved' 
    });

    await adminUser.save();
    console.log('-----------------------------------');
    console.log('Admin user successfully created!');
    console.log('Email: admin@gmail.com');
    console.log('Password: admin#2387');
    console.log('-----------------------------------');
    process.exit(0);
}).catch(err => {
    console.error('Error connecting to the database or creating admin user:', err);
    process.exit(1);
});
