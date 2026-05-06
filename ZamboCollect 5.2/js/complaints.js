// ============================================================
// js/complaints.js — Complaint Reports DB for ZamboCollect
// ============================================================

var COMPLAINTS_DB = (function () {

  var KEY         = 'zc_complaints';
  var ACTIONS_KEY = 'zc_officer_actions';

  function _getAll() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; }
    catch (e) { return []; }
  }

  function _save(items) {
    localStorage.setItem(KEY, JSON.stringify(items));
  }

  function _nowStr() {
    return new Date().toLocaleString('en-US', {
      year: 'numeric', month: 'short', day: '2-digit',
      hour: '2-digit', minute: '2-digit'
    });
  }

  function _logAction(data) {
    try {
      var actions = JSON.parse(localStorage.getItem(ACTIONS_KEY)) || [];
      actions.unshift({
        id:          'ACT-' + Date.now(),
        officerId:   data.officerId   || '',
        officerName: data.officerName || 'Officer',
        barangay:    data.barangay    || '',
        action:      data.action,
        targetId:    data.targetId    || '',
        targetType:  data.targetType  || 'complaint',
        details:     data.details     || '',
        timestamp:   new Date().toISOString(),
        dateStr:     _nowStr()
      });
      localStorage.setItem(ACTIONS_KEY, JSON.stringify(actions));
    } catch (e) {}
  }

  // ── Public API ─────────────────────────────────────────────

  function add(data) {
    var items = _getAll();
    var id = 'CMP-' + Date.now().toString().slice(-6);
    var item = {
      id:                  id,
      reportId:            data.reportId            || '',
      citizenId:           data.citizenId           || '',
      citizenName:         data.citizenName         || 'Citizen',
      driverId:            data.driverId            || '',
      driverName:          data.driverName          || 'Driver',
      barangay:            data.barangay            || '',
      location:            data.location            || '',
      complaintPhoto:      data.complaintPhoto      || null,
      originalReportPhoto: data.originalReportPhoto || null,
      description:         data.description         || '',
      status:              'pending',
      submittedAt:         new Date().toISOString(),
      dateStr:             _nowStr(),
      reviewedAt:          null,
      reviewedBy:          null,
      officerName:         null,
      reviewNotes:         ''
    };
    items.unshift(item);
    _save(items);
    return item;
  }

  function getAll()    { return _getAll(); }

  function getById(id) {
    var items = _getAll();
    for (var i = 0; i < items.length; i++) {
      if (items[i].id === id) return items[i];
    }
    return null;
  }

  function getByBarangay(barangay) {
    return _getAll().filter(function (c) { return c.barangay === barangay; });
  }

  function getByReportId(reportId) {
    var items = _getAll();
    for (var i = 0; i < items.length; i++) {
      if (items[i].reportId === reportId) return items[i];
    }
    return null;
  }

  function getPendingByBarangay(barangay) {
    return _getAll().filter(function (c) {
      return c.status === 'pending' && (!barangay || c.barangay === barangay);
    });
  }

  function approve(id, officerName, officerId, barangay) {
    var items = _getAll();
    var item  = null;
    for (var i = 0; i < items.length; i++) {
      if (items[i].id === id) { item = items[i]; break; }
    }
    if (!item) return null;

    item.status      = 'approved';
    item.reviewedAt  = new Date().toISOString();
    item.reviewedBy  = officerId   || '';
    item.officerName = officerName || 'Officer';
    _save(items);

    // Suspend the driver who falsely marked the report as collected
    if (item.driverId && typeof ZC_DB !== 'undefined') {
      ZC_DB.suspendDriver(item.driverId, officerName, officerId);
    }

    // Notify the citizen
    if (typeof NOTIFS_DB !== 'undefined') {
      NOTIFS_DB.add({
        citizenId:   item.citizenId,
        citizenName: item.citizenName,
        type:        'complaint-approved',
        reportId:    item.reportId,
        title:       'Your complaint has been verified',
        desc:        'Your problem report for Report #' + item.reportId + ' was confirmed by ' + (officerName || 'the barangay officer') + '. The driver has been suspended. Thank you for your transparency.',
        tag:         'Verified',
        tagColor:    'green',
        icon:        'fa-circle-check',
        iconColor:   'green'
      });
    }

    _logAction({
      officerId:   officerId,
      officerName: officerName,
      barangay:    barangay || item.barangay,
      action:      'complaint_approved',
      targetId:    id,
      details:     'Approved complaint ' + id + ' on report ' + item.reportId + '. Driver ' + item.driverName + ' suspended.'
    });

    return item;
  }

  function reject(id, officerName, officerId, barangay, reason) {
    var items = _getAll();
    var item  = null;
    for (var i = 0; i < items.length; i++) {
      if (items[i].id === id) { item = items[i]; break; }
    }
    if (!item) return null;

    item.status      = 'rejected';
    item.reviewedAt  = new Date().toISOString();
    item.reviewedBy  = officerId   || '';
    item.officerName = officerName || 'Officer';
    item.reviewNotes = reason      || '';
    _save(items);

    if (typeof NOTIFS_DB !== 'undefined') {
      NOTIFS_DB.add({
        citizenId:   item.citizenId,
        citizenName: item.citizenName,
        type:        'complaint-rejected',
        reportId:    item.reportId,
        title:       'Your complaint was not verified',
        desc:        'Your problem report for Report #' + item.reportId + ' could not be confirmed by ' + (officerName || 'the barangay officer') + (reason ? '. Reason: ' + reason : '.'),
        tag:         'Not Verified',
        tagColor:    'red',
        icon:        'fa-circle-xmark',
        iconColor:   'red'
      });
    }

    _logAction({
      officerId:   officerId,
      officerName: officerName,
      barangay:    barangay || item.barangay,
      action:      'complaint_rejected',
      targetId:    id,
      details:     'Rejected complaint ' + id + ' on report ' + item.reportId + '. Reason: ' + (reason || 'none')
    });

    return item;
  }

  function getCounts(barangay) {
    var items = barangay ? getByBarangay(barangay) : _getAll();
    var c = { total: 0, pending: 0, approved: 0, rejected: 0 };
    items.forEach(function (i) {
      c.total++;
      if (i.status === 'pending')  c.pending++;
      if (i.status === 'approved') c.approved++;
      if (i.status === 'rejected') c.rejected++;
    });
    return c;
  }

  return {
    add:                  add,
    getAll:               getAll,
    getById:              getById,
    getByBarangay:        getByBarangay,
    getByReportId:        getByReportId,
    getPendingByBarangay: getPendingByBarangay,
    approve:              approve,
    reject:               reject,
    getCounts:            getCounts
  };

}());
