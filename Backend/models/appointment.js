const mongoose = require('mongoose');
const { encrypt, decrypt } = require('../utils/encryption');

const appointmentSchema = mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    hospital: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    patemail: {
        type: String,
        required: true,    
    },
    hospitalemail: {
        type: String,
        required: true,    
    },
    patient_name: {
        type: String,
        required: true,    
    },
    doctor_name: {
        type: String,
    },
    reason: {
        type: String,
        required: true,    
        get: decrypt,
        set: encrypt
    },
    appointment_date: {
        type: Date,
        required: true,    
    },
    timeslot: {
        type: String,
        required: true,    
    },
    address: {
        type: String,
        required: true,    
    },
    city: {
        type: String,
        required: true,    
    },
    mobile: {
        type: Number,
        required: true,    
    },
    status: {
        type: String,
        default: 'Pending',   
    },
    dateCreated: {
        type: Date,
        default: Date.now,
    }
});

appointmentSchema.index({ patient: 1, hospital: 1 });

appointmentSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

appointmentSchema.set('toJSON', {
    virtuals: true,
    getters: true
});

appointmentSchema.set('toObject', {
    getters: true
});

exports.Appointment = mongoose.model('Appointment', appointmentSchema);
