// ============================================================
// js/db.js — localStorage "Database" for ZamboCollect
// ============================================================

var ZC_DB = (function () {

  var USERS_KEY   = 'zc_users';
  var SESSION_KEY = 'zc_session';

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

  /**
   * Register a new citizen account.
   * @param {{ firstName, lastName, email, phone, barangay, address, fullAddress, password }} data
   * @returns {{ ok: boolean, user?: object, error?: string }}
   */
  function register(data) {
    if (findByEmail(data.email)) {
      return { ok: false, error: 'An account with that email already exists.' };
    }
    var user = {
      id:          'USR-' + Date.now(),
      firstName:   data.firstName.trim(),
      middleName:  data.middleName ? data.middleName.trim() : '',
      lastName:    data.lastName.trim(),
      email:       data.email.toLowerCase().trim(),
      phone:       data.phone.trim(),
      barangay:    data.barangay,
      address:     data.address.trim(),
      fullAddress: data.fullAddress.trim(),
      password:    data.password,
      role:        'citizen',
      kycStatus:   'pending',
      createdAt:   new Date().toISOString()
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
    if (user.suspended) return { ok: false, error: 'This account has been suspended. Contact your administrator.' };
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

  return {
    init:         init,
    findByEmail:  findByEmail,
    register:     register,
    login:        login,
    setSession:   setSession,
    getSession:   getSession,
    clearSession: clearSession
  };

}());

// Auto-init on script load
ZC_DB.init();
