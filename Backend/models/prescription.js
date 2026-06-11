const mongoose = require('mongoose');
const { encrypt, decrypt } = require('../utils/encryption');

// Schema definition
const prescriptionSchema = mongoose.Schema({
    patemail: {
        type: String,
        required: true,    
    },
    hospitalemail: {
        type: String,
        required: true,    
    },
    doctor_name: {
        type: String,
        required: true,    
    },
    patient_name: {
        type: String,
        required: true,    
    },  
    findings: {
        type: String,
        required: true,    
        get: decrypt,
        set: encrypt
    },
    lab_test: {
        type: String,
    },
    medicine_1: {
        type: String,
        get: decrypt,
        set: encrypt
    },
    medicine_2: {
        type: String,
        get: decrypt,
        set: encrypt
    },
    medicine_3: {
        type: String,
        get: decrypt,
        set: encrypt
    },
    medicine_4: {
        type: String,
        get: decrypt,
        set: encrypt
    },
    notes: {
        type: String,
        get: decrypt,
        set: encrypt
    },
    status: {
        type: String,
        default: 'Pending',   
    },
    dateCreated: {
        type: String, // Store as string to prevent automatic conversion to local time in MongoDB
        default: new Date().toISOString(),
    }
});

prescriptionSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

prescriptionSchema.set('toJSON', {
    virtuals: true,
    getters: true
});

prescriptionSchema.set('toObject', {
    getters: true
});

exports.Prescription = mongoose.model('Prescription', prescriptionSchema);
