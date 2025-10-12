// File name: AuditLog
// File name with extension: AuditLog.js
// Full path: E:\cloud_ShubhamJadhav\model\AuditLog.js
// Directory: E:\cloud_ShubhamJadhav\model

// File: models/AuditLog.js
class AuditLog {
  constructor(
    audit_guid,
    flag,
    event_type,
    table_name = null,
    record_key = null,
    action_by = null,
    action_details = null,
    status_ = "SUCCESS",
    created_on = new Date(),
    isactive = true,
    summary = null
  ) {
    this.audit_guid = audit_guid;
    this.flag = flag;
    this.event_type = event_type;
    this.table_name = table_name;
    this.record_key = record_key;
    this.action_by = action_by;
    this.action_details = action_details;
    this.status_ = status_;
    this.created_on = created_on;
    this.isactive = isactive;
    this.summary = summary;
  }

  static fromDatabase(row) {
    return new AuditLog(
      row.audit_guid,
      row.flag,
      row.event_type,
      row.table_name,
      row.record_key,
      row.action_by,
      row.action_details,
      row.status_,
      row.created_on,
      row.isactive,
      row.summary
    );
  }
}

module.exports = AuditLog;
