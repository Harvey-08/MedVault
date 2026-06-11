const { AuditLog } = require('../models/auditLog');

/**
 * Asynchronously writes an audit event log to the database.
 * Prevents errors from bubbling up to avoid disrupting core business flows.
 * 
 * @param {string} actor - User email or "anonymous"
 * @param {string} role - User role (Patient, Hospital, Lab, Admin)
 * @param {string} action - Action identifier tag
 * @param {string} status - SUCCESS or DENIED
 * @param {string|object} details - Contextual action metadata
 */
const logEvent = async (actor, role, action, status, details = '') => {
  try {
    const log = new AuditLog({
      actor: actor || 'anonymous',
      role: role || 'anonymous',
      action,
      status,
      details: typeof details === 'object' ? JSON.stringify(details) : String(details)
    });
    await log.save();
  } catch (err) {
    console.error('Compliance Audit Log failed to save:', err.message);
  }
};

module.exports = logEvent;
