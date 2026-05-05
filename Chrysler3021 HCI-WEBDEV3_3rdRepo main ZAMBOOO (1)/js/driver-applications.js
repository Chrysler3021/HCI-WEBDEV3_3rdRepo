// ============================================================
// js/driver-applications.js - Driver Application Management
// ============================================================

const driverApplications = [

  // ── PENDING (5) ──────────────────────────────────────────
  {
    id: "APP-001",
    name: "Pedro Alcantara",
    experience: "5+ years",
    preferredBarangay: "Rio Hondo",
    status: "Pending",
    appliedDate: "Mar 14, 2025",
    licenseType: "Professional",
    licenseNo: "N01-23-001234",
    licenseExpiry: "Dec 2027",
    contact: "0917 555 1234",
    notes: "I am very passionate about keeping our barangay clean. I have experience driving trucks for 6 years and I am available full time."
  },
  {
    id: "APP-002",
    name: "Leonora Buenaventura",
    experience: "3–5 years",
    preferredBarangay: "Rio Hondo",
    status: "Pending",
    appliedDate: "Mar 13, 2025",
    licenseType: "Non-Professional",
    licenseNo: "D02-21-009876",
    licenseExpiry: "Jun 2026",
    contact: "0929 888 5678",
    notes: "I would like to help the barangay with waste collection. I am available on weekdays and Saturday mornings."
  },
  {
    id: "APP-003",
    name: "Juan dela Cruz",
    experience: "1–3 years",
    preferredBarangay: "Rio Hondo",
    status: "Pending",
    appliedDate: "Mar 13, 2025",
    licenseType: "Professional",
    licenseNo: "N04-24-003311",
    licenseExpiry: "Mar 2028",
    contact: "0917 123 4567",
    notes: "I want to actively serve my community beyond just reporting. I am a full-time resident of Rio Hondo and can commit to daily routes."
  },
  {
    id: "APP-004",
    name: "Maricel Santos",
    experience: "3–5 years",
    preferredBarangay: "Rio Hondo",
    status: "Pending",
    appliedDate: "Mar 15, 2025",
    licenseType: "Professional",
    licenseNo: "N02-22-005567",
    licenseExpiry: "Aug 2027",
    contact: "0922 333 4455",
    notes: "I have been driving for the city for 4 years and wish to contribute to my barangay's waste management program."
  },
  {
    id: "APP-005",
    name: "Eduardo Bautista",
    experience: "1–3 years",
    preferredBarangay: "Rio Hondo",
    status: "Pending",
    appliedDate: "Mar 16, 2025",
    licenseType: "Non-Professional",
    licenseNo: "D05-23-012345",
    licenseExpiry: "Nov 2026",
    contact: "0918 777 8899",
    notes: "Fresh applicant eager to serve. I have my own route experience from delivering goods in Rio Hondo for 2 years."
  },

  // ── APPROVED (3) ─────────────────────────────────────────
  {
    id: "APP-006",
    email: "driver@gmail.com",
    name: "Rodel Macaraeg",
    experience: "5+ years",
    preferredBarangay: "Rio Hondo",
    status: "Approved",
    appliedDate: "Mar 08, 2025",
    licenseType: "Professional",
    licenseNo: "N05-20-000123",
    licenseExpiry: "Jun 2028",
    contact: "0918 222 3333",
    approvedDate: "Mar 10, 2025",
    truckNo: "Truck #04",
    notes: "Veteran driver with strong barangay commitment."
  },
  {
    id: "APP-007",
    name: "Salvador Dimacali",
    experience: "5+ years",
    preferredBarangay: "Rio Hondo",
    status: "Approved",
    appliedDate: "Feb 20, 2025",
    licenseType: "Professional",
    licenseNo: "N03-19-008811",
    licenseExpiry: "Sep 2027",
    contact: "0921 444 5566",
    approvedDate: "Feb 25, 2025",
    truckNo: "Truck #01",
    notes: "Very reliable driver with excellent route completion record."
  },
  {
    id: "APP-008",
    name: "Rosario Medina",
    experience: "3–5 years",
    preferredBarangay: "Rio Hondo",
    status: "Approved",
    appliedDate: "Feb 28, 2025",
    licenseType: "Professional",
    licenseNo: "N06-21-004422",
    licenseExpiry: "Jan 2029",
    contact: "0919 666 7788",
    approvedDate: "Mar 05, 2025",
    truckNo: "Truck #07",
    notes: "Experienced driver committed to morning shifts."
  },

  // ── REJECTED (4) ─────────────────────────────────────────
  {
    id: "APP-009",
    name: "Armando Reyes",
    experience: "1–3 years",
    preferredBarangay: "Rio Hondo",
    status: "Rejected",
    appliedDate: "Mar 10, 2025",
    licenseType: "Non-Professional",
    licenseNo: "C03-18-007654",
    licenseExpiry: "Jan 2023",
    contact: "0916 777 8888",
    rejectedDate: "Mar 11, 2025",
    rejectionReason: "Expired license",
    notes: "I want to help my community. I plan to renew my license soon."
  },
  {
    id: "APP-010",
    name: "Roberto Saavedra",
    experience: "Less than 1 year",
    preferredBarangay: "Rio Hondo",
    status: "Rejected",
    appliedDate: "Mar 09, 2025",
    licenseType: "Non-Professional",
    licenseNo: "D01-24-099001",
    licenseExpiry: "Dec 2025",
    contact: "0920 111 2222",
    rejectedDate: "Mar 10, 2025",
    rejectionReason: "Insufficient driving experience",
    notes: "I am eager to learn and grow. I hope to reapply after gaining more experience."
  },
  {
    id: "APP-011",
    name: "Felicidad Ocampo",
    experience: "1–3 years",
    preferredBarangay: "Rio Hondo",
    status: "Rejected",
    appliedDate: "Mar 08, 2025",
    licenseType: "Non-Professional",
    licenseNo: "B02-22-033344",
    licenseExpiry: "Mar 2025",
    contact: "0925 555 6677",
    rejectedDate: "Mar 09, 2025",
    rejectionReason: "License expired",
    notes: "I will renew my license and reapply at the earliest opportunity."
  },
  {
    id: "APP-012",
    name: "Gaudencio Palma",
    experience: "1–3 years",
    preferredBarangay: "Rio Hondo",
    status: "Rejected",
    appliedDate: "Mar 07, 2025",
    licenseType: "Non-Professional",
    licenseNo: "E04-23-077788",
    licenseExpiry: "Jun 2026",
    contact: "0923 888 9900",
    rejectedDate: "Mar 08, 2025",
    rejectionReason: "KYC verification incomplete",
    notes: "I am in the process of completing my KYC documents and will reapply once they are ready."
  }

];

// ── Suspension / demotion storage ────────────────────────
const DRIVER_SUSP_KEY   = 'zc_driver_suspensions';
const DRIVER_DEMOTE_KEY = 'zc_driver_demotions';
const DRIVER_ZC_EMAIL   = { 'APP-006': 'driver@gmail.com' };

function loadDriverSuspensions() {
  try { return JSON.parse(localStorage.getItem(DRIVER_SUSP_KEY)) || {}; }
  catch(e) { return {}; }
}

function persistDriverSuspension(appId, suspended, reason) {
  const all = loadDriverSuspensions();
  all[appId] = { suspended, reason: reason || '' };
  localStorage.setItem(DRIVER_SUSP_KEY, JSON.stringify(all));
  // If this driver has a ZC_DB account, update it so login shows the reason
  const email = DRIVER_ZC_EMAIL[appId];
  if (email) {
    try {
      const users = JSON.parse(localStorage.getItem('zc_users')) || [];
      const idx = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
      if (idx !== -1) {
        users[idx].suspended = suspended;
        users[idx].suspendReason = suspended ? (reason || '') : null;
        localStorage.setItem('zc_users', JSON.stringify(users));
      }
    } catch(e) {}
  }
}

function applyStoredSuspensions() {
  const saved = loadDriverSuspensions();
  driverApplications.forEach(app => {
    if (app.id in saved) {
      app.suspended = saved[app.id].suspended;
      app.suspendReason = saved[app.id].reason;
    } else {
      app.suspended = false;
      app.suspendReason = '';
    }
  });
}

function applyStoredDemotions() {
  let saved;
  try { saved = JSON.parse(localStorage.getItem(DRIVER_DEMOTE_KEY)) || {}; }
  catch(e) { saved = {}; }
  driverApplications.forEach(app => {
    app.demoted = !!(app.id in saved && saved[app.id].demoted);
  });
}

// ── State ──────────────────────────────────────────────────
let currentTab = 'Applications'; // 'Applications' or 'Profiles'
let currentFilter = 'All';
let searchQuery = ''; // Store search query
let pendingSuspendId = null;
let pendingUnsuspendId = null;
let pendingDemoteId = null;
let drvToastTimer = null;

// ── Helpers ────────────────────────────────────────────────
function getCounts() {
  return {
    All:        driverApplications.length,
    Pending:    driverApplications.filter(a => a.status === 'Pending').length,
    Approved:   driverApplications.filter(a => a.status === 'Approved').length,
    Rejected:   driverApplications.filter(a => a.status === 'Rejected').length,
    AllDrivers: driverApplications.filter(a => a.status === 'Approved' && !a.demoted).length,
    Active:     driverApplications.filter(a => a.status === 'Approved' && !a.suspended && !a.demoted).length,
    Suspended:  driverApplications.filter(a => a.status === 'Approved' && a.suspended && !a.demoted).length,
    Demoted:    driverApplications.filter(a => a.status === 'Approved' && a.demoted).length
  };
}

function showDriverToast(msg) {
  const t = document.getElementById('drv-toast');
  if (!t) return;
  t.textContent = msg;
  t.style.opacity = '1';
  t.style.transform = 'translateY(0)';
  clearTimeout(drvToastTimer);
  drvToastTimer = setTimeout(() => {
    t.style.opacity = '0';
    t.style.transform = 'translateY(10px)';
  }, 3000);
}

// ── Sidebar tab sync ─────────────────────────────────────
function renderTabBar() {
  const counts = getCounts();
  const applications = counts.Pending + counts.Rejected;
  const profiles = counts.AllDrivers;

  const appLink  = document.getElementById('sidebar-tab-applications');
  const profLink = document.getElementById('sidebar-tab-profiles');
  const appCount = document.getElementById('sidebar-count-applications');
  const profCount = document.getElementById('sidebar-count-profiles');

  if (appLink) {
    appLink.classList.toggle('active', currentTab === 'Applications');
    if (currentTab === 'Applications') appLink.setAttribute('aria-current', 'page');
    else appLink.removeAttribute('aria-current');
  }
  if (profLink) {
    profLink.classList.toggle('active', currentTab === 'Profiles');
    if (currentTab === 'Profiles') profLink.setAttribute('aria-current', 'page');
    else profLink.removeAttribute('aria-current');
  }
  if (appCount)  appCount.textContent  = applications;
  if (profCount) profCount.textContent = profiles;
}

// ── Filter bar ────────────────────────────────────────────
function renderFilterBar() {
  const bar = document.getElementById('filter-bar');
  if (!bar) return;
  const counts = getCounts();
  let filters;
  
  if (currentTab === 'Applications') {
    filters = [
      { key: 'All',      label: 'All',      count: counts.Pending + counts.Rejected },
      { key: 'Pending',  label: '<i class="fa-solid fa-hourglass-half"></i> Pending', count: counts.Pending },
      { key: 'Rejected', label: '<i class="fa-solid fa-circle-xmark"></i> Rejected', count: counts.Rejected }
    ];
  } else {
    filters = [
      { key: 'All',       label: 'All Drivers',  count: counts.AllDrivers },
      { key: 'Active',    label: '<i class="fa-solid fa-circle-check"></i> Active',   count: counts.Active },
      { key: 'Suspended', label: '<i class="fa-solid fa-ban"></i> Suspended',         count: counts.Suspended },
      { key: 'Demoted',   label: '<i class="fa-solid fa-user-minus"></i> Demoted',    count: counts.Demoted }
    ];
  }
  
  bar.innerHTML = filters.map(f =>
    `<button class="tab-label${currentFilter === f.key ? ' tab-active' : ''}" onclick="setFilter('${f.key}')">
      ${f.label} (${f.count})
    </button>`
  ).join('');
}

// ── Card + drawer HTML builder ─────────────────────────────
function buildCardHTML(app) {
  const isPending  = app.status === 'Pending';
  const isApproved = app.status === 'Approved';
  const isRejected = app.status === 'Rejected';

  const isDemoted   = isApproved && app.demoted;
  const isSuspended = isApproved && app.suspended && !app.demoted;
  const badge = isPending
    ? '<span class="badge badge-yellow">Pending</span>'
    : isDemoted
      ? '<span class="badge badge-demoted">Demoted to Citizen</span>'
      : isApproved
        ? (isSuspended
            ? '<span class="badge badge-red">Suspended</span>'
            : '<span class="badge badge-green">Active</span>')
        : '<span class="badge badge-red">Rejected</span>';

  const avatarClass = isDemoted ? ' rejected-drv' : isApproved ? ' active-drv' : isRejected ? ' rejected-drv' : '';
  const avatarIcon  = isApproved ? 'fa-truck' : 'fa-circle-user';
  const cardClass   = isDemoted ? ' card-rejected' : isApproved ? ' card-approved' : isRejected ? ' card-rejected' : '';

  // ── detail grid ──
  let detailGrid;
  if (isPending) {
    detailGrid = `
      <div><div class="det-label">License Type</div><div class="det-value">${app.licenseType}</div></div>
      <div><div class="det-label">Experience</div><div class="det-value">${app.experience}</div></div>
      <div><div class="det-label">Preferred Barangay</div><div class="det-value">${app.preferredBarangay}</div></div>
      <div><div class="det-label">License No.</div><div class="det-value">${app.licenseNo}</div></div>`;
  } else if (isApproved) {
    detailGrid = `
      <div><div class="det-label">Assigned Truck</div><div class="det-value">${app.truckNo || 'TBD'}</div></div>
      <div><div class="det-label">Experience</div><div class="det-value">${app.experience}</div></div>
      <div><div class="det-label">Preferred Barangay</div><div class="det-value">${app.preferredBarangay}</div></div>
      <div><div class="det-label">Approved</div><div class="det-value">${app.approvedDate || '—'}</div></div>`;
  } else {
    detailGrid = `
      <div><div class="det-label">Reason</div><div class="det-value" style="color:var(--red);">${app.rejectionReason || '—'}</div></div>
      <div><div class="det-label">License Expiry</div><div class="det-value">${app.licenseExpiry}</div></div>
      <div><div class="det-label">Experience</div><div class="det-value">${app.experience}</div></div>
      <div><div class="det-label">Reviewed</div><div class="det-value">${app.rejectedDate || '—'}</div></div>`;
  }

  // ── card action buttons ──
  let actions;
  if (isPending) {
    actions = `
      <button class="btn-view-app" onclick="toggleDrawer('${app.id}')"><i class="fa-solid fa-eye"></i> View Application</button>
      <button class="btn-do-approve" onclick="approveApplication('${app.id}')"><i class="fa-solid fa-arrow-up"></i> Promote</button>
      <button class="btn-do-reject"  onclick="rejectApplication('${app.id}')"><i class="fa-solid fa-xmark"></i> Reject</button>`;
  } else if (isApproved) {
    if (isDemoted) {
      actions = `<button class="btn-view-app" onclick="toggleDrawer('${app.id}')"><i class="fa-solid fa-eye"></i> View Profile</button>`;
    } else {
      actions = `<button class="btn-view-app" onclick="toggleDrawer('${app.id}')"><i class="fa-solid fa-eye"></i> View Profile</button>
        ${isSuspended
          ? `<button class="btn-do-approve" onclick="openUnsuspendDriver('${app.id}')"><i class="fa-solid fa-circle-check"></i> Unsuspend</button>`
          : `<button class="btn-do-reject" onclick="openSuspendDriver('${app.id}')"><i class="fa-solid fa-ban"></i> Suspend</button>`
        }
        <button class="btn-do-demote" onclick="openDemoteDriver('${app.id}')"><i class="fa-solid fa-user-minus"></i> Demote</button>`;
    }
  } else {
    actions = `<button class="btn-view-app" onclick="toggleDrawer('${app.id}')"><i class="fa-solid fa-eye"></i> View Details</button>`;
  }

  // ── drawer inner HTML ──
  let drawerInner;
  if (isPending) {
    drawerInner = `
      <div class="drawer-section-title"><i class="fa-solid fa-user"></i> Applicant Information</div>
      <div class="drawer-info-grid">
        <div class="drawer-info-box"><div class="drawer-info-label">Full Name</div><div class="drawer-info-value">${app.name}</div></div>
        <div class="drawer-info-box"><div class="drawer-info-label">Contact</div><div class="drawer-info-value">${app.contact}</div></div>
        <div class="drawer-info-box"><div class="drawer-info-label">License Type</div><div class="drawer-info-value">${app.licenseType}</div></div>
        <div class="drawer-info-box"><div class="drawer-info-label">License No.</div><div class="drawer-info-value">${app.licenseNo}</div></div>
        <div class="drawer-info-box"><div class="drawer-info-label">License Expiry</div><div class="drawer-info-value">${app.licenseExpiry}</div></div>
        <div class="drawer-info-box"><div class="drawer-info-label">Experience</div><div class="drawer-info-value">${app.experience}</div></div>
        <div class="drawer-info-box"><div class="drawer-info-label">Preferred Barangay</div><div class="drawer-info-value">${app.preferredBarangay}</div></div>
        <div class="drawer-info-box"><div class="drawer-info-label">Applied</div><div class="drawer-info-value">${app.appliedDate}</div></div>
      </div>
      <div class="drawer-section-title"><i class="fa-solid fa-file-lines"></i> Submitted Documents</div>
      <div class="doc-row">
        <div class="doc-box"><i class="fa-solid fa-id-card"></i><span class="doc-label">Driver's License</span><span class="doc-status">Submitted</span></div>
        <div class="doc-box"><i class="fa-solid fa-face-smile"></i><span class="doc-label">Selfie w/ ID</span><span class="doc-status">Submitted</span></div>
        <div class="doc-box"><i class="fa-solid fa-circle-check" style="color:var(--green);"></i><span class="doc-label">KYC Status</span><span class="doc-status" style="color:var(--green);">Verified</span></div>
      </div>
      <div class="drawer-section-title"><i class="fa-solid fa-comment-dots"></i> Applicant's Notes</div>
      <div class="notes-box">"${app.notes}"</div>
      <div class="drawer-actions">
        <button class="drawer-close" onclick="toggleDrawer('${app.id}')"><i class="fa-solid fa-chevron-up"></i> Close</button>
        <button class="btn-do-reject"  onclick="rejectApplication('${app.id}')" style="flex:1;justify-content:center;"><i class="fa-solid fa-xmark"></i> Reject</button>
        <button class="btn-do-approve" onclick="approveApplication('${app.id}')" style="flex:2;justify-content:center;"><i class="fa-solid fa-arrow-up"></i> Promote to Driver</button>
      </div>`;
  } else if (isApproved) {
    drawerInner = `
      <div class="drawer-section-title"><i class="fa-solid fa-user"></i> Driver Information</div>
      <div class="drawer-info-grid">
        <div class="drawer-info-box"><div class="drawer-info-label">Full Name</div><div class="drawer-info-value">${app.name}</div></div>
        <div class="drawer-info-box"><div class="drawer-info-label">Contact</div><div class="drawer-info-value">${app.contact}</div></div>
        <div class="drawer-info-box"><div class="drawer-info-label">Assigned Truck</div><div class="drawer-info-value">${app.truckNo || 'TBD'}</div></div>
        <div class="drawer-info-box"><div class="drawer-info-label">License Type</div><div class="drawer-info-value">${app.licenseType}</div></div>
        <div class="drawer-info-box"><div class="drawer-info-label">License No.</div><div class="drawer-info-value">${app.licenseNo}</div></div>
        <div class="drawer-info-box"><div class="drawer-info-label">Experience</div><div class="drawer-info-value">${app.experience}</div></div>
        <div class="drawer-info-box"><div class="drawer-info-label">Preferred Barangay</div><div class="drawer-info-value">${app.preferredBarangay}</div></div>
        <div class="drawer-info-box"><div class="drawer-info-label">Approved On</div><div class="drawer-info-value">${app.approvedDate || '—'}</div></div>
      </div>
      <div class="drawer-actions">
        <button class="drawer-close" onclick="toggleDrawer('${app.id}')"><i class="fa-solid fa-chevron-up"></i> Close</button>
        ${isDemoted ? `
          <div style="flex:1;display:flex;align-items:center;gap:6px;font-size:13px;font-weight:600;color:var(--muted);padding:0 10px;">
            <i class="fa-solid fa-user-minus"></i> Demoted to Citizen
          </div>
        ` : isSuspended ? `
          <div style="flex:1;display:flex;align-items:center;gap:6px;font-size:13px;font-weight:600;color:var(--red);padding:0 10px;flex-wrap:wrap;">
            <i class="fa-solid fa-ban"></i> Suspended${app.suspendReason ? ': ' + app.suspendReason : ''}
          </div>
          <button class="btn-do-approve" onclick="openUnsuspendDriver('${app.id}')" style="flex:0 0 auto;"><i class="fa-solid fa-circle-check"></i> Unsuspend</button>
          <button class="btn-do-demote" onclick="openDemoteDriver('${app.id}')" style="flex:0 0 auto;"><i class="fa-solid fa-user-minus"></i> Demote</button>
        ` : `
          <div style="flex:1;display:flex;align-items:center;gap:6px;font-size:13px;font-weight:600;color:var(--green);padding:0 10px;">
            <i class="fa-solid fa-circle-check"></i> Active driver
          </div>
          <button class="btn-do-reject" onclick="openSuspendDriver('${app.id}')" style="flex:0 0 auto;"><i class="fa-solid fa-ban"></i> Suspend</button>
          <button class="btn-do-demote" onclick="openDemoteDriver('${app.id}')" style="flex:0 0 auto;"><i class="fa-solid fa-user-minus"></i> Demote</button>
        `}
      </div>`;
  } else {
    drawerInner = `
      <div class="drawer-section-title"><i class="fa-solid fa-user"></i> Applicant Information</div>
      <div class="drawer-info-grid">
        <div class="drawer-info-box"><div class="drawer-info-label">Full Name</div><div class="drawer-info-value">${app.name}</div></div>
        <div class="drawer-info-box"><div class="drawer-info-label">Contact</div><div class="drawer-info-value">${app.contact}</div></div>
        <div class="drawer-info-box"><div class="drawer-info-label">License Type</div><div class="drawer-info-value">${app.licenseType}</div></div>
        <div class="drawer-info-box"><div class="drawer-info-label">License No.</div><div class="drawer-info-value">${app.licenseNo}</div></div>
        <div class="drawer-info-box"><div class="drawer-info-label">License Expiry</div><div class="drawer-info-value" style="color:var(--red);">${app.licenseExpiry}</div></div>
        <div class="drawer-info-box"><div class="drawer-info-label">Rejection Reason</div><div class="drawer-info-value" style="color:var(--red);">${app.rejectionReason || '—'}</div></div>
        <div class="drawer-info-box"><div class="drawer-info-label">Applied</div><div class="drawer-info-value">${app.appliedDate}</div></div>
        <div class="drawer-info-box"><div class="drawer-info-label">Reviewed On</div><div class="drawer-info-value">${app.rejectedDate || '—'}</div></div>
      </div>
      <div class="drawer-section-title"><i class="fa-solid fa-comment-dots"></i> Applicant's Notes</div>
      <div class="notes-box">"${app.notes}"</div>
      <div style="background:#fff0f0;border:1.5px solid #fca5a5;border-radius:9px;padding:10px 14px;font-size:12px;color:var(--red);margin-bottom:14px;display:flex;align-items:center;gap:8px;">
        <i class="fa-solid fa-triangle-exclamation"></i>
        Application rejected: ${app.rejectionReason}. Applicant may reapply when resolved.
      </div>
      <div class="drawer-actions">
        <button class="drawer-close" onclick="toggleDrawer('${app.id}')"><i class="fa-solid fa-chevron-up"></i> Close</button>
      </div>`;
  }

  return `
    <div class="app-card${cardClass}">
      <div class="app-card-header">
        <div class="app-avatar${avatarClass}"><i class="fa-solid ${avatarIcon}"></i></div>
        <div style="flex:1;min-width:0;">
          <div class="app-name">${app.name}</div>
          <div class="app-meta"><i class="fa-solid fa-location-dot"></i> Barangay ${app.preferredBarangay} &nbsp;·&nbsp; Applied ${app.appliedDate}</div>
        </div>
        ${badge}
      </div>
      <div class="app-details-grid">${detailGrid}</div>
      <div class="app-actions">${actions}</div>
    </div>
    <div class="app-drawer" id="drawer-${app.id}">
      <div class="drawer-inner">${drawerInner}</div>
    </div>`;
}

function buildTableRowHTML(app) {
  const isPending  = app.status === 'Pending';
  const isApproved = app.status === 'Approved';
  const isRejected = app.status === 'Rejected';

  const isDemoted   = isApproved && app.demoted;
  const isSuspended = isApproved && app.suspended && !app.demoted;

  let statusBadge;
  if (isPending) {
    statusBadge = '<span class="badge badge-yellow">Pending</span>';
  } else if (isDemoted) {
    statusBadge = '<span class="badge badge-demoted">Demoted</span>';
  } else if (isApproved) {
    if (isSuspended) {
      statusBadge = '<span class="badge badge-red">Suspended</span>';
    } else {
      statusBadge = '<span class="badge badge-green">Active</span>';
    }
  } else {
    statusBadge = '<span class="badge badge-red">Rejected</span>';
  }

  let actions;
  if (currentTab === 'Applications') {
    if (isPending) {
      actions = `
        <button class="btn-view-app" onclick="viewDriverDetails('${app.id}')"><i class="fa-solid fa-eye"></i> View</button>
        <button class="btn-do-approve" onclick="approveApplication('${app.id}')"><i class="fa-solid fa-arrow-up"></i> Promote</button>
        <button class="btn-do-reject"  onclick="rejectApplication('${app.id}')"><i class="fa-solid fa-xmark"></i> Reject</button>`;
    } else {
      actions = `<button class="btn-view-app" onclick="viewDriverDetails('${app.id}')"><i class="fa-solid fa-eye"></i> View</button>`;
    }
  } else {
    if (isDemoted) {
      actions = `<button class="btn-view-app" onclick="viewDriverDetails('${app.id}')"><i class="fa-solid fa-eye"></i> View</button>`;
    } else {
      actions = `<button class="btn-view-app" onclick="viewDriverDetails('${app.id}')"><i class="fa-solid fa-eye"></i> View</button>
        ${isSuspended
          ? `<button class="btn-do-approve" onclick="openUnsuspendDriver('${app.id}')"><i class="fa-solid fa-circle-check"></i> Unsuspend</button>`
          : `<button class="btn-do-reject" onclick="openSuspendDriver('${app.id}')"><i class="fa-solid fa-ban"></i> Suspend</button>`
        }
        <button class="btn-do-demote" onclick="openDemoteDriver('${app.id}')"><i class="fa-solid fa-user-minus"></i> Demote</button>`;
    }
  }

  if (currentTab === 'Applications') {
    return `<tr>
      <td>${app.name}</td>
      <td>${app.licenseNo}</td>
      <td>${app.experience}</td>
      <td>${app.appliedDate}</td>
      <td>${statusBadge}</td>
      <td>${actions}</td>
    </tr>`;
  } else {
    return `<tr>
      <td>${app.name}</td>
      <td>${app.licenseNo}</td>
      <td>${app.truckNo || 'TBD'}</td>
      <td>${statusBadge}</td>
      <td>${actions}</td>
    </tr>`;
  }
}

function buildSectionHeading(status) {
  if (status === 'Pending') {
    return `<div class="section-heading"><i class="fa-solid fa-hourglass-half" style="color:var(--yellow);"></i> Pending Applications</div>`;
  } else if (status === 'Approved') {
    return `<div class="section-heading"><i class="fa-solid fa-circle-check" style="color:var(--green);"></i> Approved — Active Drivers</div>`;
  } else {
    return `<div class="section-heading"><i class="fa-solid fa-circle-xmark" style="color:var(--red);"></i> Rejected Applications</div>`;
  }
}

// ── Main render ────────────────────────────────────────────
function render() {
  renderTabBar();
  renderFilterBar();
  const tableHead = document.getElementById('drivers-table-head');
  const tableBody = document.getElementById('drivers-table-body');
  if (!tableHead || !tableBody) return;

  // Set table headers based on tab
  let headers;
  if (currentTab === 'Applications') {
    headers = ['Name', 'License No.', 'Experience', 'Applied Date', 'Status', 'Actions'];
  } else {
    headers = ['Name', 'License No.', 'Truck Assigned', 'Status', 'Actions'];
  }
  tableHead.innerHTML = '<tr>' + headers.map(h => '<th>' + h + '</th>').join('') + '</tr>';

  let apps = [];
  
  if (currentTab === 'Applications') {
    // Show Pending and Rejected applications
    if (currentFilter === 'All') {
      apps = driverApplications.filter(a => a.status === 'Pending' || a.status === 'Rejected');
    } else {
      apps = driverApplications.filter(a => a.status === currentFilter);
    }
  } else {
    // Show Approved driver profiles only
    apps = driverApplications.filter(a => a.status === 'Approved');
    // Apply sub-filter
    if (currentFilter === 'All')       apps = apps.filter(a => !a.demoted);
    if (currentFilter === 'Active')    apps = apps.filter(a => !a.suspended && !a.demoted);
    if (currentFilter === 'Suspended') apps = apps.filter(a =>  a.suspended && !a.demoted);
    if (currentFilter === 'Demoted')   apps = apps.filter(a =>  a.demoted);
  }

  // Apply search filter
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    apps = apps.filter(function(a) {
      return a.name.toLowerCase().includes(query) ||
             a.licenseNo.toLowerCase().includes(query) ||
             a.contact.toLowerCase().includes(query);
    });
  }
  
  let rows = '';
  if (apps.length === 0) {
    const colspan = headers.length;
    if (currentTab === 'Applications') {
      if (searchQuery.trim()) {
        rows = '<tr><td colspan="' + colspan + '" style="text-align:center;padding:48px;color:var(--muted);font-size:14px;"><i class="fa-solid fa-inbox" style="font-size:2rem;display:block;margin-bottom:10px;"></i>No applications match <strong>"' + escapeHtml(searchQuery) + '"</strong>.</td></tr>';
      } else {
        rows = '<tr><td colspan="' + colspan + '" style="text-align:center;padding:48px;color:var(--muted);font-size:14px;"><i class="fa-solid fa-inbox" style="font-size:2rem;display:block;margin-bottom:10px;"></i>No applications in this category.</td></tr>';
      }
    } else {
      if (searchQuery.trim()) {
        rows = '<tr><td colspan="' + colspan + '" style="text-align:center;padding:48px;color:var(--muted);font-size:14px;"><i class="fa-solid fa-users" style="font-size:2rem;display:block;margin-bottom:10px;"></i>No drivers match <strong>"' + escapeHtml(searchQuery) + '"</strong>.</td></tr>';
      } else {
        rows = '<tr><td colspan="' + colspan + '" style="text-align:center;padding:48px;color:var(--muted);font-size:14px;"><i class="fa-solid fa-users" style="font-size:2rem;display:block;margin-bottom:10px;"></i>No active drivers yet.</td></tr>';
      }
    }
  } else {
    apps.forEach(function(app) { rows += buildTableRowHTML(app); });
  }

  tableBody.innerHTML = rows;
}

// ── Helper to escape HTML ──────────────────────────────────
function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── Public actions ─────────────────────────────────────────
function viewDriverDetails(id) {
  const app = driverApplications.find(function(a) { return a.id === id; });
  if (!app) return;
  const content = document.getElementById('view-driver-content');
  if (!content) return;

  const isPending  = app.status === 'Pending';
  const isApproved = app.status === 'Approved';
  const isRejected = app.status === 'Rejected';

  let html = `
    <div style="margin-bottom:16px;">
      <strong>${app.name}</strong><br>
      <span style="color:var(--muted);">${app.contact}</span>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px;">
      <div><strong>License No:</strong> ${app.licenseNo}</div>
      <div><strong>License Type:</strong> ${app.licenseType}</div>
      <div><strong>Experience:</strong> ${app.experience}</div>
      <div><strong>Barangay:</strong> ${app.preferredBarangay}</div>
      <div><strong>Applied:</strong> ${app.appliedDate}</div>
      <div><strong>Status:</strong> ${app.status}</div>
  `;

  if (isApproved) {
    html += `<div><strong>Approved:</strong> ${app.approvedDate || '—'}</div>
      <div><strong>Truck:</strong> ${app.truckNo || 'TBD'}</div>`;
  } else if (isRejected) {
    html += `<div><strong>Rejected:</strong> ${app.rejectedDate || '—'}</div>
      <div><strong>Reason:</strong> ${app.rejectionReason || '—'}</div>`;
  }

  html += `</div>`;

  if (app.notes) {
    html += `<div><strong>Notes:</strong><br><em>${app.notes}</em></div>`;
  }

  content.innerHTML = html;
  document.getElementById('modal-viewDriver').classList.remove('hidden');
}

function setTab(tab) {
  currentTab = tab;
  currentFilter = 'All';
  searchQuery = '';
  document.getElementById('driver-search').value = '';
  const title = document.querySelector('.topbar-title');
  if (title) title.textContent = tab === 'Applications' ? 'Applications' : 'Driver Profiles';
  render();
}

function setFilter(filter) {
  currentFilter = filter;
  render();
}

function filterDrivers() {
  searchQuery = document.getElementById('driver-search').value;
  render();
}

function approveApplication(id) {
  const app = driverApplications.find(function(a) { return a.id === id; });
  if (!app) return;
  document.getElementById('promote-driver-name').textContent = app.name;
  const confirmBtn = document.getElementById('promote-driver-confirm-btn');
  confirmBtn.onclick = function() {
    app.status = 'Approved';
    app.approvedDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    app.truckNo = 'Pending Assignment';
    document.getElementById('modal-promoteDriver').classList.add('hidden');
    if (typeof NOTIFS_DB !== 'undefined') {
      NOTIFS_DB.add({
        driverName: app.name,
        type:       'account-promoted',
        title:      'Application Approved — Welcome to the Driver Portal',
        desc:       'Your driver application for Barangay ' + app.preferredBarangay + ' has been approved by the barangay officer. You now have access to the Driver Portal and will be assigned collection routes.',
        tag:        'Promoted',
        tagColor:   'green',
        icon:       'fa-truck',
        iconColor:  'green'
      });
    }
    render();
  };
  document.getElementById('modal-promoteDriver').classList.remove('hidden');
}

function rejectApplication(id) {
  const app = driverApplications.find(function(a) { return a.id === id; });
  if (!app) return;
  document.getElementById('reject-driver-name').textContent = app.name;
  const confirmBtn = document.getElementById('reject-driver-confirm-btn');
  confirmBtn.onclick = function() {
    const reason = document.getElementById('reject-driver-reason').value;
    if (!reason) {
      document.getElementById('reject-driver-reason').style.borderColor = 'var(--red)';
      return;
    }
    document.getElementById('reject-driver-reason').style.borderColor = '';
    app.status = 'Rejected';
    app.rejectedDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    app.rejectionReason = reason;
    closeRejectDriverModal();
    render();
  };
  document.getElementById('modal-rejectDriver').classList.remove('hidden');
}

function toggleDrawer(id) {
  const drawer = document.getElementById('drawer-' + id);
  if (drawer) drawer.classList.toggle('drawer-open');
}

// ── Suspend driver ─────────────────────────────────────────
function openSuspendDriver(id) {
  pendingSuspendId = id;
  const app = driverApplications.find(a => a.id === id);
  if (!app) return;
  const nameEl = document.getElementById('suspend-driver-name');
  if (nameEl) nameEl.textContent = app.name;
  const reasonEl = document.getElementById('suspend-driver-reason');
  if (reasonEl) { reasonEl.value = ''; reasonEl.style.borderColor = ''; }
  const notesEl = document.getElementById('suspend-driver-notes');
  if (notesEl) notesEl.value = '';
  document.getElementById('modal-suspendDriver').classList.remove('hidden');
}

function closeSuspendDriverModal() {
  document.getElementById('modal-suspendDriver').classList.add('hidden');
  pendingSuspendId = null;
}

function confirmSuspendDriver() {
  const reasonEl = document.getElementById('suspend-driver-reason');
  const reason = reasonEl ? reasonEl.value.trim() : '';
  if (!reason) {
    if (reasonEl) reasonEl.style.borderColor = 'var(--red)';
    return;
  }
  if (reasonEl) reasonEl.style.borderColor = '';
  const notesEl = document.getElementById('suspend-driver-notes');
  const notes = notesEl ? notesEl.value.trim() : '';
  const fullReason = notes ? reason + ' — ' + notes : reason;
  const app = driverApplications.find(a => a.id === pendingSuspendId);
  if (app) {
    app.suspended = true;
    app.suspendReason = fullReason;
    persistDriverSuspension(app.id, true, fullReason);
    if (typeof NOTIFS_DB !== 'undefined') {
      NOTIFS_DB.add({
        driverName: app.name,
        type:       'account-suspended',
        title:      'Account Suspended',
        desc:       'Your driver account has been temporarily suspended. Reason: ' + fullReason + '. Please contact your barangay officer for more information.',
        tag:        'Suspended',
        tagColor:   'red',
        icon:       'fa-ban',
        iconColor:  'red'
      });
    }
  }
  closeSuspendDriverModal();
  render();
  showDriverToast('✓ ' + (app ? app.name : 'Driver') + ' has been suspended.');
}

// ── Unsuspend driver ───────────────────────────────────────
function openUnsuspendDriver(id) {
  pendingUnsuspendId = id;
  const app = driverApplications.find(a => a.id === id);
  if (!app) return;
  const nameEl = document.getElementById('unsuspend-driver-name');
  if (nameEl) nameEl.textContent = app.name;
  document.getElementById('modal-unsuspendDriver').classList.remove('hidden');
}

function closeUnsuspendDriverModal() {
  document.getElementById('modal-unsuspendDriver').classList.add('hidden');
  pendingUnsuspendId = null;
}

function confirmUnsuspendDriver() {
  const app = driverApplications.find(a => a.id === pendingUnsuspendId);
  if (app) {
    app.suspended = false;
    app.suspendReason = '';
    persistDriverSuspension(app.id, false, '');
    if (typeof NOTIFS_DB !== 'undefined') {
      NOTIFS_DB.add({
        driverName: app.name,
        type:       'account-restored',
        title:      'Account Suspension Lifted',
        desc:       'Your driver account suspension has been lifted by the barangay officer. You can now access the Driver Portal and your assigned routes.',
        tag:        'Restored',
        tagColor:   'green',
        icon:       'fa-circle-check',
        iconColor:  'green'
      });
    }
  }
  closeUnsuspendDriverModal();
  render();
  showDriverToast('✓ ' + (app ? app.name : 'Driver') + '\'s account has been restored.');
}

// ── Demote driver ──────────────────────────────────────────
function openDemoteDriver(id) {
  pendingDemoteId = id;
  const app = driverApplications.find(a => a.id === id);
  if (!app) return;
  const nameEl = document.getElementById('demote-driver-name');
  if (nameEl) nameEl.textContent = app.name;
  document.getElementById('modal-demoteDriver').classList.remove('hidden');
}

function closeDemoteDriverModal() {
  document.getElementById('modal-demoteDriver').classList.add('hidden');
  pendingDemoteId = null;
}

function confirmDemoteDriver() {
  const app = driverApplications.find(a => a.id === pendingDemoteId);
  if (app) {
    app.demoted = true;
    app.suspended = false;
    app.suspendReason = '';
    // Persist demotion
    let allD = {};
    try { allD = JSON.parse(localStorage.getItem(DRIVER_DEMOTE_KEY)) || {}; } catch(e) {}
    allD[app.id] = { demoted: true };
    localStorage.setItem(DRIVER_DEMOTE_KEY, JSON.stringify(allD));
    // Clear any suspension record
    persistDriverSuspension(app.id, false, '');
    // Update ZC_DB user role to 'citizen'
    const email = DRIVER_ZC_EMAIL[app.id];
    if (email) {
      try {
        const users = JSON.parse(localStorage.getItem('zc_users')) || [];
        const idx = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
        if (idx !== -1) {
          users[idx].role = 'citizen';
          users[idx].suspended = false;
          users[idx].suspendReason = null;
          localStorage.setItem('zc_users', JSON.stringify(users));
        }
      } catch(e) {}
    }
  }
  closeDemoteDriverModal();
  render();
  showDriverToast('✓ ' + (app ? app.name : 'Driver') + ' has been demoted to Citizen.');
}

// ── Auto-initialize ────────────────────────────────────────
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    applyStoredDemotions();
    applyStoredSuspensions();
    render();
  });
} else {
  applyStoredDemotions();
  applyStoredSuspensions();
  render();
}
