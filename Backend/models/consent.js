const mongoose = require('mongoose');

const consentSchema = mongoose.Schema({
    patientEmail: {
        type: String,
        required: true,
        index: true
    },
    hospitalEmail: {
        type: String,
        required: true,
        index: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Granted', 'Revoked', 'Denied'],
        default: 'Pending',
        required: true
    },
    requestedAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

consentSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

consentSchema.set('toJSON', {
    virtuals: true
});

exports.Consent = mongoose.model('Consent', consentSchema);
