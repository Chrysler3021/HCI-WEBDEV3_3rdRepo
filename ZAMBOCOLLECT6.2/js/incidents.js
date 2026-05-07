// ============================================================
// js/incidents.js — Incident Grouping Engine for ZamboCollect
// ============================================================
// Requires: reports.js (REPORTS_DB) and notifs.js (NOTIFS_DB) to be loaded first.
//
// GROUPING RULES:
//   - Report has lat/lng AND is within 30 metres of an existing open incident
//   - AND that incident was created within the last 24 hours
//   → attach report to existing incident
//   Otherwise → create a new incident
//
// If a report has NO lat/lng, a new incident is always created (cannot
// determine proximity without coordinates).
// ============================================================

var INCIDENTS_DB = (function () {

  var KEY            = 'zc_incidents';
  var GROUP_RADIUS_M = 30;        // metres
  var GROUP_HOURS    = 24;        // hours window

  // ── Urgency ordering (for picking highest) ─────────────────
  var URG_ORDER = { critical: 4, high: 3, medium: 2, low: 1 };

  // ── Drivers pool (mirrors reports.js) ──────────────────────
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

  // ── Private helpers ────────────────────────────────────────

  function getAll() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; }
    catch (e) { return []; }
  }

  function _save(incidents) {
    localStorage.setItem(KEY, JSON.stringify(incidents));
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

  // Haversine formula — returns distance in metres
  function _haversine(lat1, lng1, lat2, lng2) {
    var R  = 6371000; // Earth radius in metres
    var dLat = (lat2 - lat1) * Math.PI / 180;
    var dLng = (lng2 - lng1) * Math.PI / 180;
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // Determine highest urgency between two urgency strings
  function _maxUrgency(a, b) {
    var aScore = URG_ORDER[a] || 1;
    var bScore = URG_ORDER[b] || 1;
    return aScore >= bScore ? a : b;
  }

  // Get all REPORTS_DB reports for a given list of report IDs
  function _fetchReports(reportIds) {
    if (typeof REPORTS_DB === 'undefined') return [];
    var all = REPORTS_DB.getAll();
    return all.filter(function (r) {
      return reportIds.indexOf(r.id) !== -1;
    });
  }

  // Update a single incident by ID
  function _updateIncident(id, fields) {
    var incidents = getAll();
    for (var i = 0; i < incidents.length; i++) {
      if (incidents[i].id === id) {
        for (var k in fields) incidents[i][k] = fields[k];
        incidents[i].updatedAt = new Date().toISOString();
        _save(incidents);
        return incidents[i];
      }
    }
    return null;
  }

  // ── Public API ─────────────────────────────────────────────

  /**
   * Find an existing open incident within GROUP_RADIUS_M metres and
   * GROUP_HOURS hours, or create a new one. Links the report to the incident.
   *
   * @param {object} report — the report object just saved by REPORTS_DB.add()
   * @returns {object} the incident (new or existing)
   */
  function findOrCreate(report) {
    var incidents = getAll();
    var now       = Date.now();
    var cutoffMs  = GROUP_HOURS * 60 * 60 * 1000;

    var hasGeo = report.lat != null && report.lng != null &&
                 !isNaN(report.lat) && !isNaN(report.lng);

    // ── Try to attach to existing open incident ──────────────
    for (var i = 0; i < incidents.length; i++) {
      var inc = incidents[i];

      // Only group into pending or approved incidents
      if (inc.status !== 'pending' && inc.status !== 'approved') continue;

      // Within the 24-hour window
      var age = now - new Date(inc.createdAt).getTime();
      if (age > cutoffMs) continue;

      var match = false;

      // 1. Geo match
      if (hasGeo && inc.lat != null && inc.lng != null) {
        var dist = _haversine(report.lat, report.lng, inc.lat, inc.lng);
        if (dist <= GROUP_RADIUS_M) match = true;
      }

      // 2. Text/Barangay match
      if (!match && report.barangay && inc.barangay && report.barangay === inc.barangay) {
        var s1 = (report.location || '').toLowerCase().trim();
        var s2 = (inc.location || '').toLowerCase().trim();
        var d1 = (report.description || '').toLowerCase().trim();
        var d2 = (inc.description || '').toLowerCase().trim();

        // Location text similar
        if (s1 && s2 && (s1 === s2 || s1.indexOf(s2) !== -1 || s2.indexOf(s1) !== -1)) match = true;
        // Description text similar (must be sufficiently long to avoid false positives)
        else if (d1 && d2 && d1.length > 8 && d2.length > 8 && (d1 === d2 || d1.indexOf(d2) !== -1 || d2.indexOf(d1) !== -1)) match = true;
      }

      if (!match) continue;

      // ── Match found — attach report ──────────────────────
      inc.reportIds.push(report.id);
      inc.reportCount = inc.reportIds.length;
      inc.priority    = _maxUrgency(inc.priority, report.urgency || 'low');
      inc.updatedAt   = new Date().toISOString();

      _save(incidents);

      // Stamp the report with this incidentId
      if (typeof REPORTS_DB !== 'undefined') {
        var reports = REPORTS_DB.getAll();
        for (var j = 0; j < reports.length; j++) {
          if (reports[j].id === report.id) {
            reports[j].incidentId = inc.id;
            localStorage.setItem('zc_reports', JSON.stringify(reports));
            break;
          }
        }
      }

      return inc;
    }

    // ── No match — create a new incident ────────────────────
    var newId = 'INC-' + Date.now().toString().slice(-7);
    var incident = {
      id:             newId,
      reportIds:      [report.id],
      reportCount:    1,
      status:         'pending',
      priority:       report.urgency  || 'low',
      wasteType:      report.wasteType || 'other',
      location:       report.location || 'Unknown location',
      barangay:       report.barangay || '',
      lat:            hasGeo ? report.lat : null,
      lng:            hasGeo ? report.lng : null,
      createdAt:      new Date().toISOString(),
      updatedAt:      new Date().toISOString(),
      approvedBy:     null,
      approvedDate:   null,
      assignedDriver: null,
      collectedBy:    null,
      collectedDate:  null,
      rejectedBy:     null,
      rejectionReason: null
    };

    incidents.unshift(incident);
    _save(incidents);

    // Stamp the report with this new incidentId
    if (typeof REPORTS_DB !== 'undefined') {
      var rpts = REPORTS_DB.getAll();
      for (var k = 0; k < rpts.length; k++) {
        if (rpts[k].id === report.id) {
          rpts[k].incidentId = newId;
          localStorage.setItem('zc_reports', JSON.stringify(rpts));
          break;
        }
      }
    }

    return incident;
  }

  /**
   * Get a single incident by ID.
   */
  function getById(id) {
    var incidents = getAll();
    for (var i = 0; i < incidents.length; i++) {
      if (incidents[i].id === id) return incidents[i];
    }
    return null;
  }

  /**
   * Get all report objects linked to an incident.
   */
  function getLinkedReports(incidentId) {
    var inc = getById(incidentId);
    if (!inc) return [];
    return _fetchReports(inc.reportIds);
  }

  /**
   * Approve an incident — assigns same driver to ALL linked pending reports
   * and updates incident-level status.
   *
   * @param {string} incidentId
   * @param {string} officerName
   * @returns {object|null} updated incident
   */
  function approve(incidentId, officerName) {
    var inc = getById(incidentId);
    if (!inc) return null;
    if (inc.status !== 'pending') return inc; // already actioned

    var driver = _nextDriver();

    // Update all linked reports individually
    if (typeof REPORTS_DB !== 'undefined') {
      var allReports = REPORTS_DB.getAll();
      var changed    = false;
      for (var i = 0; i < allReports.length; i++) {
        var r = allReports[i];
        if (inc.reportIds.indexOf(r.id) !== -1 && r.status === 'pending') {
          r.status         = 'approved';
          r.approvedBy     = officerName || 'Officer';
          r.approvedDate   = _dateStr();
          r.assignedDriver = driver;
          r.incidentId     = incidentId;
          changed = true;

          // Notify each citizen
          if (typeof NOTIFS_DB !== 'undefined') {
            NOTIFS_DB.add({
              citizenId:   r.citizenId,
              citizenName: r.citizen,
              type:        'approved',
              reportId:    r.id,
              title:       'Incident ' + incidentId + ' Approved',
              desc:        'Your report (#' + r.id + ') at ' + r.location +
                           ' was approved as part of Incident ' + incidentId +
                           ' by ' + (officerName || 'the barangay officer') +
                           '. A collection driver (' + driver + ') has been assigned.',
              tag:         'Approved',
              tagColor:    'blue',
              icon:        'fa-clipboard-list',
              iconColor:   'blue'
            });
          }
        }
      }
      if (changed) localStorage.setItem('zc_reports', JSON.stringify(allReports));

      // Notify the driver once
      if (typeof NOTIFS_DB !== 'undefined') {
        var driverNameOnly = driver ? driver.split(' (')[0] : '';
        if (driverNameOnly) {
          NOTIFS_DB.add({
            driverName:  driverNameOnly,
            type:        'task-assigned',
            reportId:    inc.id,
            title:       'New Incident assigned — ' + inc.location,
            desc:        'Incident ' + incidentId + ' at ' + inc.location +
                         ' (' + inc.barangay + ') covering ' + inc.reportCount +
                         ' report(s) was approved and assigned to you by ' +
                         (officerName || 'the barangay officer') + '.',
            tag:         'Assigned',
            tagColor:    'blue',
            icon:        'fa-clipboard-list',
            iconColor:   'blue'
          });
        }
      }
    }

    // Update incident record
    return _updateIncident(incidentId, {
      status:         'approved',
      approvedBy:     officerName || 'Officer',
      approvedDate:   _dateStr(),
      assignedDriver: driver
    });
  }

  /**
   * Reject an incident — sets all linked pending reports to rejected.
   *
   * @param {string} incidentId
   * @param {string} reason
   * @param {string} officerName
   * @returns {object|null} updated incident
   */
  function reject(incidentId, reason, officerName) {
    var inc = getById(incidentId);
    if (!inc) return null;

    var rejectionReason = reason || 'No reason provided';

    if (typeof REPORTS_DB !== 'undefined') {
      var allReports = REPORTS_DB.getAll();
      var changed    = false;
      for (var i = 0; i < allReports.length; i++) {
        var r = allReports[i];
        if (inc.reportIds.indexOf(r.id) !== -1 && r.status === 'pending') {
          r.status          = 'rejected';
          r.rejectedBy      = officerName || 'Officer';
          r.rejectedDate    = _dateStr();
          r.rejectionReason = rejectionReason;
          changed = true;

          if (typeof NOTIFS_DB !== 'undefined') {
            NOTIFS_DB.add({
              citizenId:   r.citizenId,
              citizenName: r.citizen,
              type:        'rejected',
              reportId:    r.id,
              title:       'Incident ' + incidentId + ' Not Approved',
              desc:        'Your report (#' + r.id + ') at ' + r.location +
                           ' was not approved. Reason: ' + rejectionReason,
              tag:         'Rejected',
              tagColor:    'red',
              icon:        'fa-circle-xmark',
              iconColor:   'red'
            });
          }
        }
      }
      if (changed) localStorage.setItem('zc_reports', JSON.stringify(allReports));
    }

    return _updateIncident(incidentId, {
      status:          'rejected',
      rejectedBy:      officerName || 'Officer',
      rejectionReason: rejectionReason
    });
  }

  /**
   * Mark an incident as collected — resolves all linked approved reports.
   *
   * @param {string} incidentId
   * @param {string} driverName
   * @returns {object|null} updated incident
   */
  function collect(incidentId, driverName) {
    var inc = getById(incidentId);
    if (!inc) return null;

    if (typeof REPORTS_DB !== 'undefined') {
      var allReports = REPORTS_DB.getAll();
      var changed    = false;
      for (var i = 0; i < allReports.length; i++) {
        var r = allReports[i];
        if (inc.reportIds.indexOf(r.id) !== -1 && r.status === 'approved') {
          r.status          = 'collected';
          r.collectedBy     = driverName || 'Driver';
          r.collectedDate   = _dateStr();
          r.collectionPhoto = null;
          changed = true;

          if (typeof NOTIFS_DB !== 'undefined') {
            NOTIFS_DB.add({
              citizenId:   r.citizenId,
              citizenName: r.citizen,
              type:        'collected',
              reportId:    r.id,
              title:       'Incident ' + incidentId + ' Collected!',
              desc:        'The waste at ' + r.location +
                           ' (Incident ' + incidentId + ', ' + inc.reportCount +
                           ' reports) has been picked up by ' +
                           (driverName || 'the collection team') +
                           '. Thank you for keeping Zamboanga City clean!',
              tag:         'Collected',
              tagColor:    'green',
              icon:        'fa-circle-check',
              iconColor:   'green'
            });
          }
        }
      }
      if (changed) localStorage.setItem('zc_reports', JSON.stringify(allReports));
    }

    return _updateIncident(incidentId, {
      status:        'collected',
      collectedBy:   driverName || 'Driver',
      collectedDate: _dateStr()
    });
  }

  /**
   * Get counts by status.
   */
  function getCounts() {
    var incidents = getAll();
    var c = { total: 0, pending: 0, approved: 0, rejected: 0, collected: 0 };
    incidents.forEach(function (inc) {
      c.total++;
      if (inc.status === 'pending')   c.pending++;
      if (inc.status === 'approved')  c.approved++;
      if (inc.status === 'rejected')  c.rejected++;
      if (inc.status === 'collected') c.collected++;
    });
    return c;
  }

  /**
   * Retroactively group all existing reports that have lat/lng into incidents.
   * Safe to call on first load — skips reports already assigned to an incident.
   * Useful for seeding the incident table from legacy report data.
   */
  function rebuildFromReports() {
    if (typeof REPORTS_DB === 'undefined') return;
    var reports = REPORTS_DB.getAll();
    // Process oldest-first so grouping is chronologically correct
    var sorted = reports.slice().sort(function (a, b) {
      return new Date(a.timestamp) - new Date(b.timestamp);
    });
    sorted.forEach(function (r) {
      if (!r.incidentId) {
        findOrCreate(r);
      }
    });
  }

  // ── Public surface ─────────────────────────────────────────
  return {
    getAll:           getAll,
    getById:          getById,
    getLinkedReports: getLinkedReports,
    findOrCreate:     findOrCreate,
    approve:          approve,
    reject:           reject,
    collect:          collect,
    getCounts:        getCounts,
    rebuildFromReports: rebuildFromReports
  };

}());
