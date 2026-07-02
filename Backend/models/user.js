const mongoose = require('mongoose');


// name, email, password, phone, city, question1, question2

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        default: ''
    },
    question1: {
        type: String,
      
    },
    question2: {
        type: String,
       
    },
    hospitalemail: {
        type: String,
       
    },
    status: {
        type: String,
        default: 'Pending',
    },
    agreedToPrivacyPolicy: {
        type: Boolean,
        required: true,
        default: false
    }
});

userSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

userSchema.set('toJSON', {
    virtuals: true,
});

exports.User = mongoose.model('User', userSchema);
exports.userSchema = userSchema;
