const mongoose = require('mongoose');
const { encrypt, decrypt } = require('../utils/encryption');

const labtestSchema = mongoose.Schema({
    patemail: {
        type: String,
        required: true,    
    },
    labemail: {
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
    test_name: {
        type: String,
        required: true,    
    },
    range: {
        type: String,
        required: true,    
        get: decrypt,
        set: encrypt
    },
    actual_range: {
        type: String,
        required: true,    
        get: decrypt,
        set: encrypt
    },
    level: {
        type: String,
        required: true,    
        get: decrypt,
        set: encrypt
    },
    date: {
        type: String,
        required: true,    
    },
    report: {
        type: String,
        default: ''
    },
    dateCreated: {
        type: Date,
        default: Date.now,
    }
});

labtestSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

labtestSchema.set('toJSON', {
    virtuals: true,
    getters: true
});

labtestSchema.set('toObject', {
    getters: true
});

exports.Labtest = mongoose.model('Labtest', labtestSchema);
