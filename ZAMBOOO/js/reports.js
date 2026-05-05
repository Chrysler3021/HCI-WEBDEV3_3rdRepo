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
      citizen:     data.citizen   || 'Citizen',
      citizenId:   data.citizenId || '',
      contact:     data.contact   || '',
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
    var r = _update(id, {
      status:         'approved',
      approvedBy:     officerName || 'Officer',
      approvedDate:   _dateStr(),
      assignedDriver: _nextDriver()
    });
    if (r && typeof NOTIFS_DB !== 'undefined') {
      NOTIFS_DB.add({
        citizenId:   r.citizenId,
        citizenName: r.citizen,
        type:        'approved',
        reportId:    r.id,
        title:       'Report #' + r.id + ' has been approved',
        desc:        'Your report at ' + r.location + ' was approved by ' + (officerName || 'the barangay officer') + '. A collection driver has been auto-assigned.',
        tag:         'Approved',
        tagColor:    'blue',
        icon:        'fa-clipboard-list',
        iconColor:   'blue'
      });
      // Notify the assigned driver
      var driverNameOnly = r.assignedDriver ? r.assignedDriver.split(' (')[0] : '';
      if (driverNameOnly) {
        var wasteLabel = r.wasteType ? (r.wasteType.charAt(0).toUpperCase() + r.wasteType.slice(1)) : 'General';
        var urgLabel   = r.urgency   ? (r.urgency.charAt(0).toUpperCase()   + r.urgency.slice(1))   : 'Low';
        NOTIFS_DB.add({
          driverName:  driverNameOnly,
          type:        'task-assigned',
          reportId:    r.id,
          title:       'New task assigned — ' + r.location,
          desc:        'Report #' + r.id + ' at ' + r.location + ' (' + r.barangay + ') was approved and assigned to you by ' + (officerName || 'the barangay officer') + '. Waste type: ' + wasteLabel + '. Urgency: ' + urgLabel + '.',
          tag:         'Assigned',
          tagColor:    'blue',
          icon:        'fa-clipboard-list',
          iconColor:   'blue'
        });
      }
    }
    return r;
  }

  /**
   * Reject a pending report.
   * @param {string} id
   * @param {string} reason
   * @param {string} officerName
   */
  function reject(id, reason, officerName) {
    var r = _update(id, {
      status:          'rejected',
      rejectedBy:      officerName || 'Officer',
      rejectedDate:    _dateStr(),
      rejectionReason: reason || 'No reason provided'
    });
    if (r && typeof NOTIFS_DB !== 'undefined') {
      NOTIFS_DB.add({
        citizenId:   r.citizenId,
        citizenName: r.citizen,
        type:        'rejected',
        reportId:    r.id,
        title:       'Report #' + r.id + ' was not approved',
        desc:        'Your report at ' + r.location + ' was rejected by ' + (officerName || 'the barangay officer') + '. Reason: ' + (reason || 'No reason provided'),
        tag:         'Rejected',
        tagColor:    'red',
        icon:        'fa-circle-xmark',
        iconColor:   'red'
      });
    }
    return r;
  }

  /**
   * Mark an approved report as collected by a driver.
   * @param {string} id
   * @param {string} driverName
   */
  function collect(id, driverName) {
    var r = _update(id, {
      status:        'collected',
      collectedBy:   driverName || 'Driver',
      collectedDate: _dateStr()
    });
    if (r && typeof NOTIFS_DB !== 'undefined') {
      NOTIFS_DB.add({
        citizenId:   r.citizenId,
        citizenName: r.citizen,
        type:        'collected',
        reportId:    r.id,
        title:       'Report #' + r.id + ' has been collected',
        desc:        'The waste at ' + r.location + ' has been picked up by ' + (driverName || 'the collection team') + '. Thank you for keeping Zamboanga City clean!',
        tag:         'Collected',
        tagColor:    'green',
        icon:        'fa-circle-check',
        iconColor:   'green'
      });
    }
    return r;
  }

  /**
   * Cancel a pending report by the citizen.
   * Can only cancel if status is 'pending'.
   */
  function cancel(id) {
    var report = getById(id);
    if (!report) return null;
    
    // Only allow cancellation if status is 'pending' (remarks not yet approved)
    if (report.status !== 'pending') {
      return null; // Cannot cancel if remarks already approved or in another status
    }
    
    return _update(id, { status: 'cancelled', cancelledAt: _dateStr() });
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

  return { getAll: getAll, getById: getById, add: add, approve: approve, reject: reject, collect: collect, cancel: cancel, getCounts: getCounts };

}());
