// ============================================================
// js/db.js — localStorage "Database" for ZamboCollect
// ============================================================

var ZC_DB = (function () {

  var USERS_KEY            = 'zc_users';
  var SESSION_KEY          = 'zc_session';
  var NAME_CHANGE_REQ_KEY  = 'zc_name_change_requests';

  var ROLE_DASHBOARDS = {
    superadmin: 'superadmin-dashboard.html',
    admin:      'admin-dashboard.html',
    officer:    'officer-dashboard.html',
    driver:     'dashboard-driver.html',
    citizen:    'citizen-dashboard.html'
  };

  // Pre-seeded demo accounts
  var SEED_USERS = [
    {
      id: 'DEMO-1', firstName: 'Super', lastName: 'Admin',
      email: 'superadmin@gmail.com', password: 'superadmin123',
      role: 'superadmin', phone: '09170000001', barangay: '',
      address: '', fullAddress: '', kycStatus: 'verified',
      createdAt: '2024-01-01T00:00:00.000Z'
    },
    {
      id: 'DEMO-2', firstName: 'Admin', lastName: 'User',
      email: 'admin@gmail.com', password: 'admin123',
      role: 'admin', phone: '09170000002', barangay: '',
      address: '', fullAddress: '', kycStatus: 'verified',
      createdAt: '2024-01-01T00:00:00.000Z'
    },
    {
      id: 'DEMO-3', firstName: 'Maria', lastName: 'Santos',
      email: 'officer@gmail.com', password: 'officer123',
      role: 'officer', phone: '09171234567', barangay: 'Rio Hondo',
      address: 'Barangay Hall, Rio Hondo', fullAddress: 'Barangay Hall, Rio Hondo, Zamboanga City',
      kycStatus: 'verified', createdAt: '2024-01-01T00:00:00.000Z'
    },
    {
      id: 'DEMO-4', firstName: 'Rodel', lastName: 'Macaraeg',
      email: 'driver@gmail.com', password: 'driver123',
      role: 'driver', phone: '09182223333', barangay: 'Rio Hondo',
      address: '25 Mabuhay St.', fullAddress: '25 Mabuhay St., Rio Hondo, Zamboanga City',
      kycStatus: 'verified', createdAt: '2024-01-01T00:00:00.000Z'
    },
    {
      id: 'DEMO-5', firstName: 'Juan', lastName: 'dela Cruz',
      email: 'citizen@gmail.com', password: 'citizen123',
      role: 'citizen', phone: '09171234567', barangay: 'Barangay Tetuan',
      address: '10 Rizal Ave.', fullAddress: '10 Rizal Ave., Tetuan, Zamboanga City',
      kycStatus: 'pending', createdAt: '2024-01-01T00:00:00.000Z'
    }
  ];

  // ── Private helpers ────────────────────────────────────────

  function getUsers() {
    try { return JSON.parse(localStorage.getItem(USERS_KEY)) || []; }
    catch (e) { return []; }
  }

  function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  function getNameChangeRequests() {
    try { return JSON.parse(localStorage.getItem(NAME_CHANGE_REQ_KEY)) || []; }
    catch (e) { return []; }
  }

  function saveNameChangeRequests(requests) {
    localStorage.setItem(NAME_CHANGE_REQ_KEY, JSON.stringify(requests));
  }

  // ── Public API ─────────────────────────────────────────────

  /** Seed demo accounts on very first load (runs once per browser) */
  function init() {
    if (!localStorage.getItem(USERS_KEY)) {
      saveUsers(SEED_USERS);
    }
  }

  /** Find a user object by email (case-insensitive). Returns null if not found. */
  function findByEmail(email) {
    var e = email.toLowerCase().trim();
    var users = getUsers();
    for (var i = 0; i < users.length; i++) {
      if (users[i].email.toLowerCase() === e) return users[i];
    }
    return null;
  }

  /** Find a user by their current OR old name (for search to work with old names). */
  function findByName(query) {
    var q = query.toLowerCase().trim();
    var users = getUsers();
    var results = [];
    for (var i = 0; i < users.length; i++) {
      var u = users[i];
      var currentName = [u.firstName, u.middleName, u.lastName].filter(Boolean).join(' ').toLowerCase();
      var oldName = [u.oldFirstName, u.oldMiddleName, u.oldLastName].filter(Boolean).join(' ').toLowerCase();
      if (currentName.includes(q) || oldName.includes(q)) {
        results.push(u);
      }
    }
    return results;
  }

  /**
   * Register a new citizen account.
   * @param {{ firstName, lastName, email, phone, street, barangay, city, province, zip, password }} data
   * @returns {{ ok: boolean, user?: object, error?: string }}
   */
  function register(data) {
    if (findByEmail(data.email)) {
      return { ok: false, error: 'An account with that email already exists.' };
    }
    var user = {
      id:         'USR-' + Date.now(),
      firstName:  data.firstName.trim(),
      middleName: data.middleName ? data.middleName.trim() : '',
      lastName:   data.lastName.trim(),
      email:      data.email.toLowerCase().trim(),
      phone:      data.phone.trim(),
      street:     data.street.trim(),
      barangay:   data.barangay,
      city:       (data.city || '').trim(),
      province:   (data.province || '').trim(),
      zip:        (data.zip || '').trim(),
      password:   data.password,
      role:       'citizen',
      kycStatus:  'pending',
      createdAt:  new Date().toISOString()
    };
    var users = getUsers();
    users.push(user);
    saveUsers(users);
    setSession(user);
    return { ok: true, user: user };
  }

  /**
   * Authenticate a user with email + password.
   * @returns {{ ok: boolean, user?: object, dashboard?: string, error?: string }}
   */
  function login(email, password) {
    var user = findByEmail(email);
    if (!user) return { ok: false, error: 'No account found with that email.' };
    if (user.password !== password) return { ok: false, error: 'Incorrect password.' };
    if (user.suspended) {
      var reason = user.suspendReason || user.suspensionReason || '';
      var suspMsg = 'Your account has been suspended.';
      if (reason) suspMsg += ' Reason: ' + reason + '.';
      suspMsg += ' Contact your administrator.';
      return { ok: false, error: suspMsg };
    }
    setSession(user);
    return {
      ok:        true,
      user:      user,
      dashboard: ROLE_DASHBOARDS[user.role] || 'citizen-dashboard.html'
    };
  }

  /** Save the logged-in user to localStorage (password excluded). */
  function setSession(user) {
    var safe = {};
    for (var k in user) {
      if (k !== 'password') safe[k] = user[k];
    }
    localStorage.setItem(SESSION_KEY, JSON.stringify(safe));
  }

  /** Retrieve the current logged-in user, or null. */
  function getSession() {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY)); }
    catch (e) { return null; }
  }

  /** Log the current user out. */
  function clearSession() {
    localStorage.removeItem(SESSION_KEY);
  }

  /**
   * Submit a name change request for a citizen.
   * @param {{ userId, firstName, middleName, lastName }} data
   * @returns {{ ok: boolean, error?: string, requestId?: string }}
   */
  function submitNameChangeRequest(data) {
    var users = getUsers();
    var user = null;
    for (var i = 0; i < users.length; i++) {
      if (users[i].id === data.userId) {
        user = users[i];
        break;
      }
    }
    if (!user) return { ok: false, error: 'User not found.' };

    var request = {
      id: 'NCR-' + Date.now(),
      userId: data.userId,
      oldFirstName: user.firstName,
      oldMiddleName: user.middleName || '',
      oldLastName: user.lastName,
      newFirstName: data.firstName.trim(),
      newMiddleName: data.middleName ? data.middleName.trim() : '',
      newLastName: data.lastName.trim(),
      status: 'pending',
      requestedAt: new Date().toISOString(),
      reviewedAt: null,
      reviewedBy: null,
      reviewNotes: ''
    };

    var requests = getNameChangeRequests();
    requests.push(request);
    saveNameChangeRequests(requests);

    return { ok: true, requestId: request.id };
  }

  /** Get all pending name change requests. */
  function getPendingNameChangeRequests() {
    var requests = getNameChangeRequests();
    return requests.filter(function(r) { return r.status === 'pending'; });
  }

  /** Get name change requests for a specific barangay. */
  function getNameChangeRequestsByBarangay(barangay) {
    var requests = getNameChangeRequests();
    var users = getUsers();
    return requests.filter(function(r) {
      var user = null;
      for (var i = 0; i < users.length; i++) {
        if (users[i].id === r.userId) {
          user = users[i];
          break;
        }
      }
      return user && user.barangay === barangay && r.status === 'pending';
    });
  }

  /**
   * Approve a name change request.
   * @param {{ requestId, officerId, notes }} data
   */
  function approveNameChangeRequest(data) {
    var requests = getNameChangeRequests();
    var request = null;
    for (var i = 0; i < requests.length; i++) {
      if (requests[i].id === data.requestId) {
        request = requests[i];
        break;
      }
    }
    if (!request) return { ok: false, error: 'Request not found.' };

    request.status = 'approved';
    request.reviewedAt = new Date().toISOString();
    request.reviewedBy = data.officerId;
    request.reviewNotes = data.notes || '';

    // Update user's name
    var users = getUsers();
    var user = null;
    for (var i = 0; i < users.length; i++) {
      if (users[i].id === request.userId) {
        user = users[i];
        break;
      }
    }
    if (user) {
      user.oldFirstName = user.firstName;
      user.oldMiddleName = user.middleName || '';
      user.oldLastName = user.lastName;
      user.firstName = request.newFirstName;
      user.middleName = request.newMiddleName;
      user.lastName = request.newLastName;
      saveUsers(users);
      setSession(user);

      // Create notification for the citizen (if notification system is available)
      if (typeof NOTIFS_DB !== 'undefined') {
        var newName = [request.newFirstName, request.newMiddleName, request.newLastName].filter(Boolean).join(' ');
        NOTIFS_DB.add({
          citizenId: user.id,
          citizenName: user.firstName + ' ' + user.lastName,
          type: 'approved',
          title: 'Name Change Approved',
          desc: 'Your name has been successfully updated to ' + newName + '.',
          tag: 'Approved',
          tagColor: 'green',
          icon: 'fa-circle-check',
          iconColor: 'green'
        });
      }
    }

    saveNameChangeRequests(requests);
    return { ok: true };
  }

  /**
   * Reject a name change request.
   * @param {{ requestId, officerId, notes }} data
   */
  function rejectNameChangeRequest(data) {
    var requests = getNameChangeRequests();
    var request = null;
    for (var i = 0; i < requests.length; i++) {
      if (requests[i].id === data.requestId) {
        request = requests[i];
        break;
      }
    }
    if (!request) return { ok: false, error: 'Request not found.' };

    request.status = 'rejected';
    request.reviewedAt = new Date().toISOString();
    request.reviewedBy = data.officerId;
    request.reviewNotes = data.notes || '';

    // Find the citizen to get their details
    var users = getUsers();
    var citizen = null;
    for (var i = 0; i < users.length; i++) {
      if (users[i].id === request.userId) {
        citizen = users[i];
        break;
      }
    }

    saveNameChangeRequests(requests);

    // Create notification for the citizen (if notification system is available)
    if (typeof NOTIFS_DB !== 'undefined' && citizen) {
      var notifMsg = data.notes ? 'Your name change request was not approved. Reason: ' + data.notes : 'Your name change request was not approved.';
      NOTIFS_DB.add({
        citizenId: citizen.id,
        citizenName: citizen.firstName + ' ' + citizen.lastName,
        type: 'rejected',
        title: 'Name Change Request Rejected',
        desc: notifMsg,
        tag: 'Rejected',
        tagColor: 'red',
        icon: 'fa-circle-xmark',
        iconColor: 'red'
      });
    }

    return { ok: true };
  }

  /** Get name change request by ID. */
  function getNameChangeRequest(requestId) {
    var requests = getNameChangeRequests();
    for (var i = 0; i < requests.length; i++) {
      if (requests[i].id === requestId) return requests[i];
    }
    return null;
  }

  // ── Driver Profile Change Requests ─────────────────────────

  var DRIVER_PROFILE_KEY = 'zc_driver_profile_requests';

  function _getDriverProfileRequests() {
    try { return JSON.parse(localStorage.getItem(DRIVER_PROFILE_KEY)) || []; }
    catch (e) { return []; }
  }

  function _saveDriverProfileRequests(reqs) {
    localStorage.setItem(DRIVER_PROFILE_KEY, JSON.stringify(reqs));
  }

  /**
   * Submit a driver profile change request.
   * Supersedes any existing pending request from the same driver.
   * @param {{ driverId, driverName, driverEmail, changes }} data
   *   changes: { firstName?, middleName?, lastName?, phone?, email?, emergencyContact?, emergencyNumber? }
   *   Each field: { old: '...', new: '...' }
   */
  function submitDriverProfileRequest(data) {
    var reqs = _getDriverProfileRequests();
    // Supersede any existing pending request for this driver
    reqs.forEach(function (r) {
      if (r.driverId === data.driverId && r.status === 'pending') r.status = 'superseded';
    });
    var req = {
      id:          'DPR-' + Date.now(),
      driverId:    data.driverId    || '',
      driverName:  data.driverName  || '',
      driverEmail: data.driverEmail || '',
      status:      'pending',
      submittedAt: new Date().toISOString(),
      reviewedAt:  null,
      reviewedBy:  null,
      reviewNotes: '',
      changes:     data.changes || {}
    };
    reqs.push(req);
    _saveDriverProfileRequests(reqs);
    return req;
  }

  /** Get the single pending profile request for a driver (most recent), or null. */
  function getPendingDriverProfileRequest(driverId) {
    var reqs = _getDriverProfileRequests();
    for (var i = reqs.length - 1; i >= 0; i--) {
      if (reqs[i].driverId === driverId && reqs[i].status === 'pending') return reqs[i];
    }
    return null;
  }

  /** Get all pending profile requests across all drivers. */
  function getPendingDriverProfileRequests() {
    return _getDriverProfileRequests().filter(function (r) { return r.status === 'pending'; });
  }

  /**
   * Approve a driver profile change request and apply the changes.
   * @param {string} requestId
   * @param {string} officerName
   */
  function approveDriverProfileRequest(requestId, officerName) {
    var reqs = _getDriverProfileRequests();
    var req = null;
    for (var i = 0; i < reqs.length; i++) {
      if (reqs[i].id === requestId) { req = reqs[i]; break; }
    }
    if (!req) return { ok: false, error: 'Request not found.' };

    req.status     = 'approved';
    req.reviewedAt = new Date().toISOString();
    req.reviewedBy = officerName || 'Officer';

    // Apply changes to the user record
    var users = getUsers();
    var user  = null;
    for (var j = 0; j < users.length; j++) {
      if (users[j].id === req.driverId) { user = users[j]; break; }
    }
    if (user) {
      var c = req.changes;
      if (c.firstName  !== undefined) user.firstName  = c.firstName.new;
      if (c.middleName !== undefined) user.middleName = c.middleName.new;
      if (c.lastName   !== undefined) user.lastName   = c.lastName.new;
      if (c.phone      !== undefined) user.phone      = c.phone.new;
      if (c.email      !== undefined) user.email      = c.email.new;
      if (c.emergencyContact !== undefined) user.emergencyContact = c.emergencyContact.new;
      if (c.emergencyNumber  !== undefined) user.emergencyNumber  = c.emergencyNumber.new;
      saveUsers(users);
      // Update session if this is the logged-in driver
      var session = getSession();
      if (session && session.id === req.driverId) setSession(user);
    }

    _saveDriverProfileRequests(reqs);

    if (typeof NOTIFS_DB !== 'undefined') {
      NOTIFS_DB.add({
        driverId:   req.driverId,
        driverName: req.driverName,
        type:       'profile-approved',
        title:      'Profile Update Approved',
        desc:       'Your profile change request has been approved by ' + (officerName || 'the barangay officer') + '. Your information has been updated.',
        tag:        'Approved',
        tagColor:   'green',
        icon:       'fa-circle-check',
        iconColor:  'green'
      });
    }
    return { ok: true };
  }

  /**
   * Reject a driver profile change request.
   * @param {string} requestId
   * @param {string} officerName
   * @param {string} notes
   */
  function rejectDriverProfileRequest(requestId, officerName, notes) {
    var reqs = _getDriverProfileRequests();
    var req  = null;
    for (var i = 0; i < reqs.length; i++) {
      if (reqs[i].id === requestId) { req = reqs[i]; break; }
    }
    if (!req) return { ok: false, error: 'Request not found.' };

    req.status      = 'rejected';
    req.reviewedAt  = new Date().toISOString();
    req.reviewedBy  = officerName || 'Officer';
    req.reviewNotes = notes || '';
    _saveDriverProfileRequests(reqs);

    if (typeof NOTIFS_DB !== 'undefined') {
      var msg = 'Your profile change request was not approved by ' + (officerName || 'the barangay officer') + '.';
      if (notes) msg += ' Reason: ' + notes;
      NOTIFS_DB.add({
        driverId:   req.driverId,
        driverName: req.driverName,
        type:       'profile-rejected',
        title:      'Profile Update Not Approved',
        desc:       msg,
        tag:        'Rejected',
        tagColor:   'red',
        icon:       'fa-circle-xmark',
        iconColor:  'red'
      });
    }
    return { ok: true };
  }

  // ── Driver Suspension ──────────────────────────────────────

  var ACTIONS_KEY = 'zc_officer_actions';

  function _nowStr() {
    return new Date().toLocaleString('en-US', {
      year: 'numeric', month: 'short', day: '2-digit',
      hour: '2-digit', minute: '2-digit'
    });
  }

  /**
   * Suspend a driver's account.
   * @param {string} driverId
   * @param {string} officerName
   * @param {string} officerId
   * @param {string|null} until  — ISO date string, or null for indefinite
   */
  function suspendDriver(driverId, officerName, officerId, until) {
    var users = getUsers();
    for (var i = 0; i < users.length; i++) {
      if (users[i].id === driverId) {
        users[i].suspended        = true;
        users[i].suspendedAt      = new Date().toISOString();
        users[i].suspendedUntil   = until || null;
        users[i].suspendedBy      = officerName || 'Officer';
        users[i].suspendedReason  = 'Falsely marked a waste report as collected.';
        saveUsers(users);
        var session = getSession();
        if (session && session.id === driverId) setSession(users[i]);
        _logOfficerAction({
          officerId:   officerId,
          officerName: officerName,
          action:      'driver_suspended',
          targetId:    driverId,
          details:     'Driver ' + (users[i].firstName + ' ' + users[i].lastName).trim() + ' suspended' + (until ? ' until ' + until : ' indefinitely') + '.'
        });
        if (typeof NOTIFS_DB !== 'undefined') {
          NOTIFS_DB.add({
            driverId:   driverId,
            driverName: (users[i].firstName + ' ' + users[i].lastName).trim(),
            type:       'account-suspended',
            title:      'Your account has been suspended',
            desc:       'Your driver account has been suspended by ' + (officerName || 'a barangay officer') + ' due to a verified complaint. Please go to your barangay office to reactivate your account.',
            tag:        'Suspended',
            tagColor:   'red',
            icon:       'fa-ban',
            iconColor:  'red'
          });
        }
        return { ok: true };
      }
    }
    return { ok: false, error: 'Driver not found.' };
  }

  /**
   * Reactivate a suspended driver.
   * @param {string} driverId
   * @param {string} officerName
   * @param {string} officerId
   * @param {string|null} reactivateAt — ISO date string for scheduled reactivation, or null for immediate
   */
  function reactivateDriver(driverId, officerName, officerId, reactivateAt) {
    var users = getUsers();
    for (var i = 0; i < users.length; i++) {
      if (users[i].id === driverId) {
        if (reactivateAt) {
          users[i].suspendedUntil = reactivateAt;
        } else {
          users[i].suspended       = false;
          users[i].suspendedAt     = null;
          users[i].suspendedUntil  = null;
          users[i].suspendedBy     = null;
          users[i].suspendedReason = null;
        }
        saveUsers(users);
        var session = getSession();
        if (session && session.id === driverId) setSession(users[i]);
        _logOfficerAction({
          officerId:   officerId,
          officerName: officerName,
          action:      'driver_reactivated',
          targetId:    driverId,
          details:     'Driver ' + (users[i].firstName + ' ' + users[i].lastName).trim() + (reactivateAt ? ' scheduled for reactivation on ' + reactivateAt : ' reactivated immediately') + '.'
        });
        if (typeof NOTIFS_DB !== 'undefined') {
          var notifDesc = reactivateAt
            ? 'Your driver account will be reactivated on ' + new Date(reactivateAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) + '.'
            : 'Your driver account has been reactivated by ' + (officerName || 'a barangay officer') + '. You may now log in and resume operations.';
          NOTIFS_DB.add({
            driverId:   driverId,
            driverName: (users[i].firstName + ' ' + users[i].lastName).trim(),
            type:       'account-reactivated',
            title:      reactivateAt ? 'Account reactivation scheduled' : 'Your account has been reactivated',
            desc:       notifDesc,
            tag:        'Reactivated',
            tagColor:   'green',
            icon:       'fa-circle-check',
            iconColor:  'green'
          });
        }
        return { ok: true };
      }
    }
    return { ok: false, error: 'Driver not found.' };
  }

  function getDriverById(id) {
    var users = getUsers();
    for (var i = 0; i < users.length; i++) {
      if (users[i].id === id && users[i].role === 'driver') return users[i];
    }
    return null;
  }

  function _logOfficerAction(data) {
    try {
      var actions = JSON.parse(localStorage.getItem(ACTIONS_KEY)) || [];
      actions.unshift({
        id:          'ACT-' + Date.now(),
        officerId:   data.officerId   || '',
        officerName: data.officerName || 'Officer',
        action:      data.action,
        targetId:    data.targetId    || '',
        details:     data.details     || '',
        timestamp:   new Date().toISOString(),
        dateStr:     _nowStr()
      });
      localStorage.setItem(ACTIONS_KEY, JSON.stringify(actions));
    } catch (e) {}
  }

  function getOfficerActions() {
    try { return JSON.parse(localStorage.getItem(ACTIONS_KEY)) || []; }
    catch (e) { return []; }
  }

  return {
    init:         init,
    findByEmail:  findByEmail,
    findByName:   findByName,
    register:     register,
    login:        login,
    setSession:   setSession,
    getSession:   getSession,
    clearSession: clearSession,
    submitNameChangeRequest:         submitNameChangeRequest,
    getPendingNameChangeRequests:    getPendingNameChangeRequests,
    getNameChangeRequestsByBarangay: getNameChangeRequestsByBarangay,
    approveNameChangeRequest:        approveNameChangeRequest,
    rejectNameChangeRequest:         rejectNameChangeRequest,
    getNameChangeRequest:            getNameChangeRequest,
    submitDriverProfileRequest:      submitDriverProfileRequest,
    getPendingDriverProfileRequest:  getPendingDriverProfileRequest,
    getPendingDriverProfileRequests: getPendingDriverProfileRequests,
    approveDriverProfileRequest:     approveDriverProfileRequest,
    rejectDriverProfileRequest:      rejectDriverProfileRequest,
    suspendDriver:                   suspendDriver,
    reactivateDriver:                reactivateDriver,
    getDriverById:                   getDriverById,
    getOfficerActions:               getOfficerActions
  };

}());

// Auto-init on script load
ZC_DB.init();
