const mongoose = require('mongoose');

const consentSchema = mongoose.Schema({
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

consentSchema.index({ patient: 1, hospital: 1 });

consentSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

consentSchema.set('toJSON', {
    virtuals: true
});

exports.Consent = mongoose.model('Consent', consentSchema);
