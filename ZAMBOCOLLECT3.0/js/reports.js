// ============================================================
// js/reports.js — localStorage Report Database for ZamboCollect
// ============================================================

var REPORTS_DB = (function () {

  var KEY = 'zc_reports';

  // Mock driver pool for auto-assignment
  var DRIVERS = [
    'Rodel Macaraeg (Truck #04)',
    'Carlo Dimacali (Truck #01)',
    'Mark Alvarado (Truck #07)'
  ];
  var _driverIndex = 0;

  function _nextDriver() {
    var d = DRIVERS[_driverIndex % DRIVERS.length];
    _driverIndex++;
    return d;
  }

  // ── Private ────────────────────────────────────────────────

  function getAll() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; }
    catch (e) { return []; }
  }

  function _save(reports) {
    localStorage.setItem(KEY, JSON.stringify(reports));
  }

  function _update(id, fields) {
    var reports = getAll();
    for (var i = 0; i < reports.length; i++) {
      if (reports[i].id === id) {
        for (var k in fields) reports[i][k] = fields[k];
        _save(reports);
        return reports[i];
      }
    }
    return null;
  }

  function _nowStr() {
    return new Date().toLocaleString('en-US', {
      year: 'numeric', month: 'short', day: '2-digit',
      hour: '2-digit', minute: '2-digit'
    });
  }

  function _dateStr() {
    return new Date().toLocaleString('en-US', {
      year: 'numeric', month: 'short', day: '2-digit'
    });
  }

  // ── Public API ─────────────────────────────────────────────

  /**
   * Add a new citizen report.
   * @returns {object} the saved report
   */
  function add(data) {
    var reports = getAll();
    var id = 'RPT-' + Date.now().toString().slice(-6);
    var report = {
      id:          id,
      location:    data.location,
      barangay:    data.barangay,
      wasteType:   data.wasteType,
      urgency:     data.urgency,
      description: data.description || '',
      photo:       data.photo       || null,
      timestamp:   new Date().toISOString(),
      dateStr:     _nowStr(),
      citizen:     data.citizen || 'Citizen',
      contact:     data.contact || '',
      status:      'pending'
    };
    reports.unshift(report); // newest first
    _save(reports);
    return report;
  }

  /**
   * Approve a pending report.
   * @param {string} id
   * @param {string} officerName
   */
  function approve(id, officerName) {
    return _update(id, {
      status:         'approved',
      approvedBy:     officerName || 'Officer',
      approvedDate:   _dateStr(),
      assignedDriver: _nextDriver()
    });
  }

  /**
   * Reject a pending report.
   * @param {string} id
   * @param {string} reason
   * @param {string} officerName
   */
  function reject(id, reason, officerName) {
    return _update(id, {
      status:          'rejected',
      rejectedBy:      officerName || 'Officer',
      rejectedDate:    _dateStr(),
      rejectionReason: reason || 'No reason provided'
    });
  }

  /**
   * Mark an approved report as collected by a driver.
   * @param {string} id
   * @param {string} driverName
   */
  function collect(id, driverName) {
    return _update(id, {
      status:        'collected',
      collectedBy:   driverName || 'Driver',
      collectedDate: _dateStr()
    });
  }

  /**
   * Get a report by ID.
   */
  function getById(id) {
    var reports = getAll();
    for (var i = 0; i < reports.length; i++) {
      if (reports[i].id === id) return reports[i];
    }
    return null;
  }

  /**
   * Get counts by status (for stats cards and badges).
   */
  function getCounts() {
    var reports = getAll();
    var c = { total: 0, pending: 0, approved: 0, rejected: 0, collected: 0, critical: 0 };
    reports.forEach(function (r) {
      c.total++;
      if (r.status === 'pending')    c.pending++;
      if (r.status === 'approved')   c.approved++;
      if (r.status === 'rejected')   c.rejected++;
      if (r.status === 'collected')  c.collected++;
      if (r.urgency === 'critical' && r.status === 'pending') c.critical++;
    });
    return c;
  }

  return { getAll: getAll, getById: getById, add: add, approve: approve, reject: reject, collect: collect, getCounts: getCounts };

}());
