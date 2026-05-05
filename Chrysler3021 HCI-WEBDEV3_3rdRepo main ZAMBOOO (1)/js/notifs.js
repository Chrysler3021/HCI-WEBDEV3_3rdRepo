// ============================================================
// js/notifs.js — Notification Store for ZamboCollect
// ============================================================

var NOTIFS_DB = (function () {

  var KEY = 'zc_notifications';

  function getAll() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; }
    catch (e) { return []; }
  }

  function _save(notifs) {
    localStorage.setItem(KEY, JSON.stringify(notifs));
  }

  function _matchesCitizen(n, citizenId, citizenName) {
    if (citizenId   && n.citizenId   === citizenId)   return true;
    if (citizenName && n.citizenName === citizenName) return true;
    return false;
  }

  function _matchesDriver(n, driverId, driverName) {
    if (driverId   && n.driverId   === driverId)   return true;
    if (driverName && n.driverName === driverName) return true;
    return false;
  }

  /**
   * Add a notification.
   * data: { citizenId, citizenName, driverId, driverName, type, reportId, title, desc, tag, tagColor, icon, iconColor }
   * Citizen types: 'submitted' | 'approved' | 'rejected' | 'collected' | 'kyc' | 'system'
   * Driver types:  'task-assigned' | 'account-promoted' | 'account-suspended' | 'account-restored'
   *                'profile-approved' | 'profile-rejected'
   */
  function add(data) {
    var notifs = getAll();
    var n = {
      id:          'NTF-' + Date.now() + '-' + Math.floor(Math.random() * 9999),
      citizenId:   data.citizenId   || '',
      citizenName: data.citizenName || '',
      driverId:    data.driverId    || '',
      driverName:  data.driverName  || '',
      type:        data.type        || 'report',
      reportId:    data.reportId    || '',
      title:       data.title       || '',
      desc:        data.desc        || '',
      tag:         data.tag         || '',
      tagColor:    data.tagColor    || 'blue',
      icon:        data.icon        || 'fa-bell',
      iconColor:   data.iconColor   || 'blue',
      timestamp:   new Date().toISOString(),
      read:        false
    };
    notifs.unshift(n);
    _save(notifs);
    return n;
  }

  function getForCitizen(citizenId, citizenName) {
    return getAll().filter(function (n) {
      return _matchesCitizen(n, citizenId, citizenName);
    });
  }

  function getForDriver(driverId, driverName) {
    return getAll().filter(function (n) {
      return _matchesDriver(n, driverId, driverName);
    });
  }

  function markRead(id) {
    var notifs = getAll();
    for (var i = 0; i < notifs.length; i++) {
      if (notifs[i].id === id) { notifs[i].read = true; break; }
    }
    _save(notifs);
  }

  function markAllRead(citizenId, citizenName) {
    var notifs = getAll();
    notifs.forEach(function (n) {
      if (_matchesCitizen(n, citizenId, citizenName)) n.read = true;
    });
    _save(notifs);
  }

  function markAllReadForDriver(driverId, driverName) {
    var notifs = getAll();
    notifs.forEach(function (n) {
      if (_matchesDriver(n, driverId, driverName)) n.read = true;
    });
    _save(notifs);
  }

  function getUnreadCount(citizenId, citizenName) {
    return getForCitizen(citizenId, citizenName)
      .filter(function (n) { return !n.read; }).length;
  }

  function getUnreadCountForDriver(driverId, driverName) {
    return getForDriver(driverId, driverName)
      .filter(function (n) { return !n.read; }).length;
  }

  return {
    add:                     add,
    getAll:                  getAll,
    getForCitizen:           getForCitizen,
    getForDriver:            getForDriver,
    markRead:                markRead,
    markAllRead:             markAllRead,
    markAllReadForDriver:    markAllReadForDriver,
    getUnreadCount:          getUnreadCount,
    getUnreadCountForDriver: getUnreadCountForDriver
  };

}());
