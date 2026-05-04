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

  function _matches(n, citizenId, citizenName) {
    if (citizenId   && n.citizenId   === citizenId)   return true;
    if (citizenName && n.citizenName === citizenName) return true;
    return false;
  }

  /**
   * Add a notification.
   * data: { citizenId, citizenName, type, reportId, title, desc, tag, tagColor, icon, iconColor }
   * type: 'submitted' | 'approved' | 'rejected' | 'collected' | 'kyc' | 'system'
   */
  function add(data) {
    var notifs = getAll();
    var n = {
      id:          'NTF-' + Date.now() + '-' + Math.floor(Math.random() * 9999),
      citizenId:   data.citizenId   || '',
      citizenName: data.citizenName || '',
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
      return _matches(n, citizenId, citizenName);
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
      if (_matches(n, citizenId, citizenName)) n.read = true;
    });
    _save(notifs);
  }

  function getUnreadCount(citizenId, citizenName) {
    return getForCitizen(citizenId, citizenName)
      .filter(function (n) { return !n.read; }).length;
  }

  return {
    add:            add,
    getAll:         getAll,
    getForCitizen:  getForCitizen,
    markRead:       markRead,
    markAllRead:    markAllRead,
    getUnreadCount: getUnreadCount
  };

}());
