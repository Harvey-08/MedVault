const mongoose = require('mongoose');

const auditLogSchema = mongoose.Schema({
    actor: {
        type: String,
        required: true, // User email or "anonymous"
        index: true
    },
    role: {
        type: String,
        required: true // "Patient", "Hospital", "Lab", "Admin", "anonymous"
    },
    action: {
        type: String,
        required: true // e.g. "VIEW_PRESCRIPTION", "CREATE_PRESCRIPTION"
    },
    status: {
        type: String,
        enum: ['SUCCESS', 'DENIED'],
        required: true,
        index: true
    },
    details: {
        type: String,
        default: ''
    },
    timestamp: {
        type: Date,
        default: Date.now,
        index: true
    }
});

auditLogSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

auditLogSchema.set('toJSON', {
    virtuals: true
});

exports.AuditLog = mongoose.model('AuditLog', auditLogSchema);
