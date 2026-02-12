const AuditLog = require('./AuditLog');

// Audit log creation function
const createAuditLog = async (action, userId, userRole, details = {}) => {
  try {
    const auditLog = new AuditLog({
      action,
      userId,
      userRole,
      ...details
    });
    await auditLog.save();
  } catch (error) {
    console.error('Error creating audit log:', error);
    // Don't throw error as audit logging should not break the main functionality
  }
};

module.exports = {
  createAuditLog
};
