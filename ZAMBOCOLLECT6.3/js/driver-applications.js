// ============================================================
// js/driver-applications.js - Driver Application Management
// ============================================================

// Load applications from localStorage (submitted via upgrade-to-driver.html)
var driverApplications = [];

function loadDriverApplicationsFromStorage() {
  try {
    var stored = JSON.parse(localStorage.getItem('zc_driver_applications') || '[]');
    
    // Map stored applications to the format used in the UI
    driverApplications = stored.map(function(app, idx) {
      var appId = 'APP-' + String(1000 + idx).slice(-4);
      
      return {
        id: appId,
        _storageIndex: idx,
        name: app.applicantName || '—',
        email: app.email || '',
        experience: app.experience || '—',
        preferredBarangay: app.preferredBarangay || '—',
        status: app.status || 'Pending',
        appliedDate: app.appliedDate || '—',
        licenseType: app.licenseType || '—',
        licenseNo: app.licenseNumber || '—',
        licenseExpiry: app.licenseExpiry || '—',
        contact: app.contact || '—',
        notes: app.notes || '',
        documents: app.documents || {},
        rejectionReason: app.rejectionReason || '',
        rejectedDate: app.rejectedDate || '',
        approvedDate: app.approvedDate || '',
        truckNo: app.truckNo || ''
      };
    });
  } catch (e) {
    driverApplications = [];
  }
}

// Initialize on page load
loadDriverApplicationsFromStorage();

// Save applications back to localStorage
function saveApplicationsToStorage() {
  try {
    var stored = JSON.parse(localStorage.getItem('zc_driver_applications') || '[]');
    driverApplications.forEach(function(currentApp) {
      var idx = currentApp._storageIndex;
      if (typeof idx === 'number' && idx >= 0 && idx < stored.length) {
        stored[idx].status          = currentApp.status;
        stored[idx].approvedDate    = currentApp.approvedDate;
        stored[idx].rejectedDate    = currentApp.rejectedDate;
        stored[idx].rejectionReason = currentApp.rejectionReason;
        stored[idx].truckNo         = currentApp.truckNo;
        stored[idx].assignedBarangay= currentApp.assignedBarangay;
      }
    });
    localStorage.setItem('zc_driver_applications', JSON.stringify(stored));
  } catch (e) {
    console.error('Error saving applications to storage:', e);
  }
}

// ── Suspension / demotion storage ────────────────────────
const DRIVER_SUSP_KEY   = 'zc_driver_suspensions';
const DRIVER_DEMOTE_KEY = 'zc_driver_demotions';
const DRIVER_ZC_EMAIL   = {};

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
let barangayFilter = 'All';
let searchQuery = '';
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

// ── Barangay filter helpers ────────────────────────────────
function getUniqueBarangays() {
  const set = new Set();
  driverApplications.forEach(function(a) {
    if (a.preferredBarangay) set.add(a.preferredBarangay);
    if (a.assignedBarangay)  set.add(a.assignedBarangay);
  });
  return Array.from(set).sort();
}

function populateBarangayFilter() {
  const sel = document.getElementById('barangay-filter');
  if (!sel) return;
  const barangays = getUniqueBarangays();
  const current = barangayFilter;
  sel.innerHTML = '<option value="All">All Barangays</option>' +
    barangays.map(function(b) {
      return '<option value="' + b + '"' + (current === b ? ' selected' : '') + '>' + b + '</option>';
    }).join('');
}

function setBarangayFilter(val) {
  barangayFilter = val;
  render();
}

// ── Sidebar tab sync ─────────────────────────────────────
function renderTabBar() {
  const counts = getCounts();
  const applications = counts.Pending;
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
      { key: 'All',     label: '<i class="fa-solid fa-hourglass-half"></i> Pending Applications', count: counts.Pending }
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
    const docDefs = [
      { key: 'driversLicense',      label: "Driver's License",     icon: 'fa-id-card' },
      { key: 'resumeBiodata',        label: 'Resume / Biodata',     icon: 'fa-file-lines' },
      { key: 'nbiClearance',         label: 'NBI Clearance',        icon: 'fa-shield-halved' },
      { key: 'policeClearance',      label: 'Police Clearance',     icon: 'fa-building-shield' },
      { key: 'barangayClearance',    label: 'Barangay Clearance',   icon: 'fa-house' },
      { key: 'medicalCertificate',   label: 'Medical Certificate',  icon: 'fa-notes-medical' },
      { key: 'drugTestResult',       label: 'Drug Test Result',     icon: 'fa-flask-vial' },
      { key: 'psaBirthCertificate',  label: 'PSA Birth Certificate',icon: 'fa-certificate' }
    ];
    const docs = app.documents || {};
    const docBoxes = docDefs.map(function(d) {
      const img = docs[d.key];
      return `<div class="doc-box">
        <div class="doc-box-label"><i class="fa-solid ${d.icon}" style="margin-right:4px;"></i>${d.label}</div>
        <div class="doc-box-img">${img
          ? `<img src="${img}" alt="${d.label}" style="width:100%;height:100%;object-fit:cover;display:block;" />`
          : `<div class="no-photo"><i class="fa-solid fa-image"></i><span>No photo</span></div>`
        }</div>
      </div>`;
    }).join('');
    const submittedCount = docDefs.filter(function(d) { return !!docs[d.key]; }).length;

    drawerInner = `
      <div class="drawer-section-title"><i class="fa-solid fa-user"></i> Applicant Information</div>
      <div class="drawer-info-grid">
        <div class="drawer-info-box"><div class="drawer-info-label">Full Name</div><div class="drawer-info-value">${app.name}</div></div>
        <div class="drawer-info-box"><div class="drawer-info-label">Contact</div><div class="drawer-info-value">${app.contact}</div></div>
        <div class="drawer-info-box"><div class="drawer-info-label">License Type</div><div class="drawer-info-value">${app.licenseType}</div></div>
        <div class="drawer-info-box"><div class="drawer-info-label">License No.</div><div class="drawer-info-value">${app.licenseNo}</div></div>
        <div class="drawer-info-box"><div class="drawer-info-label">License Expiry</div><div class="drawer-info-value">${app.licenseExpiry}</div></div>
        <div class="drawer-info-box"><div class="drawer-info-label">Experience</div><div class="drawer-info-value">${app.experience}</div></div>
        <div class="drawer-info-box"><div class="drawer-info-label">Requested Barangay</div><div class="drawer-info-value">${app.preferredBarangay}</div></div>
        <div class="drawer-info-box"><div class="drawer-info-label">Applied</div><div class="drawer-info-value">${app.appliedDate}</div></div>
      </div>
      <div class="drawer-section-title"><i class="fa-solid fa-camera"></i> Submitted Documents (${submittedCount}/8)</div>
      <div class="doc-row">${docBoxes}</div>
      <div class="drawer-section-title"><i class="fa-solid fa-comment-dots"></i> Applicant's Notes</div>
      <div class="notes-box">"${app.notes || '—'}"</div>
      <div class="drawer-actions">
        <button class="drawer-close" onclick="toggleDrawer('${app.id}')"><i class="fa-solid fa-chevron-up"></i> Close</button>
        <button class="btn-do-reject"  onclick="rejectApplication('${app.id}')" style="flex:1;justify-content:center;"><i class="fa-solid fa-xmark"></i> Reject</button>
        <button class="btn-do-approve" onclick="approveApplication('${app.id}')" style="flex:2;justify-content:center;"><i class="fa-solid fa-truck"></i> Approve &amp; Assign Barangay</button>
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
      <td><span style="display:inline-flex;align-items:center;gap:4px;"><i class="fa-solid fa-location-dot" style="color:var(--primary);font-size:11px;"></i>${app.preferredBarangay}</span></td>
      <td>${app.appliedDate}</td>
      <td>${statusBadge}</td>
      <td style="white-space:nowrap;">${actions}</td>
    </tr>`;
  } else {
    const bgy = app.assignedBarangay || app.preferredBarangay;
    return `<tr>
      <td>${app.name}</td>
      <td>${app.licenseNo}</td>
      <td>${app.truckNo || 'TBD'}</td>
      <td><span style="display:inline-flex;align-items:center;gap:4px;"><i class="fa-solid fa-location-dot" style="color:var(--primary);font-size:11px;"></i>${bgy}</span></td>
      <td>${statusBadge}</td>
      <td style="white-space:nowrap;">${actions}</td>
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
  populateBarangayFilter();
  const tableHead = document.getElementById('drivers-table-head');
  const tableBody = document.getElementById('drivers-table-body');
  if (!tableHead || !tableBody) return;

  // Set table headers based on tab
  let headers;
  if (currentTab === 'Applications') {
    headers = ['Name', 'License No.', 'Experience', 'Barangay', 'Applied Date', 'Status', 'Actions'];
  } else {
    headers = ['Name', 'License No.', 'Truck Assigned', 'Barangay', 'Status', 'Actions'];
  }
  tableHead.innerHTML = '<tr>' + headers.map(function(h) { return '<th>' + h + '</th>'; }).join('') + '</tr>';

  let apps = [];

  if (currentTab === 'Applications') {
    apps = driverApplications.filter(function(a) { return a.status === 'Pending'; });
  } else {
    apps = driverApplications.filter(function(a) { return a.status === 'Approved'; });
    if (currentFilter === 'All')       apps = apps.filter(function(a) { return !a.demoted; });
    if (currentFilter === 'Active')    apps = apps.filter(function(a) { return !a.suspended && !a.demoted; });
    if (currentFilter === 'Suspended') apps = apps.filter(function(a) { return  a.suspended && !a.demoted; });
    if (currentFilter === 'Demoted')   apps = apps.filter(function(a) { return  a.demoted; });
  }

  // Apply barangay filter
  if (barangayFilter !== 'All') {
    apps = apps.filter(function(a) {
      const bgy = currentTab === 'Profiles'
        ? (a.assignedBarangay || a.preferredBarangay)
        : a.preferredBarangay;
      return bgy === barangayFilter;
    });
  }

  // Apply search filter
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    apps = apps.filter(function(a) {
      return a.name.toLowerCase().includes(query) ||
             (a.licenseNo || '').toLowerCase().includes(query) ||
             (a.contact || '').toLowerCase().includes(query);
    });
  }
  
  let rows = '';
  if (apps.length === 0) {
    const colspan = headers.length;
    if (currentTab === 'Applications') {
      if (searchQuery.trim()) {
        rows = '<tr><td colspan="' + colspan + '" style="text-align:center;padding:48px;color:var(--muted);font-size:14px;"><i class="fa-solid fa-inbox" style="font-size:2rem;display:block;margin-bottom:10px;"></i>No applications match <strong>"' + escapeHtml(searchQuery) + '"</strong>.</td></tr>';
      } else {
        rows = '<tr><td colspan="' + colspan + '" style="text-align:center;padding:48px;color:var(--muted);font-size:14px;"><i class="fa-solid fa-inbox" style="font-size:2rem;display:block;margin-bottom:10px;"></i>No pending applications.</td></tr>';
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

  const docDefs = [
    { key: 'driversLicense',      label: "Driver's License" },
    { key: 'resumeBiodata',        label: 'Resume / Biodata' },
    { key: 'nbiClearance',         label: 'NBI Clearance' },
    { key: 'policeClearance',      label: 'Police Clearance' },
    { key: 'barangayClearance',    label: 'Barangay Clearance' },
    { key: 'medicalCertificate',   label: 'Medical Certificate' },
    { key: 'drugTestResult',       label: 'Drug Test Result' },
    { key: 'psaBirthCertificate',  label: 'PSA Birth Certificate' }
  ];
  const docs = app.documents || {};

  let html = `
    <div style="margin-bottom:12px;">
      <div style="font-size:16px;font-weight:700;color:var(--text);">${app.name}</div>
      <div style="font-size:13px;color:var(--muted);">${app.contact}</div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px;font-size:13px;">
      <div><strong>License No:</strong> ${app.licenseNo}</div>
      <div><strong>License Type:</strong> ${app.licenseType}</div>
      <div><strong>Experience:</strong> ${app.experience}</div>
      <div><strong>Requested Barangay:</strong> ${app.preferredBarangay}</div>
      <div><strong>Applied:</strong> ${app.appliedDate}</div>
      <div><strong>Status:</strong> ${app.status}</div>
  `;

  if (isApproved) {
    html += `<div><strong>Approved:</strong> ${app.approvedDate || '—'}</div>
      <div><strong>Assigned Barangay:</strong> ${app.assignedBarangay || app.preferredBarangay}</div>`;
  } else if (isRejected) {
    html += `<div><strong>Rejected:</strong> ${app.rejectedDate || '—'}</div>
      <div><strong>Reason:</strong> ${app.rejectionReason || '—'}</div>`;
  }

  html += `</div>`;

  if (app.notes) {
    html += `<div style="margin-bottom:14px;font-size:13px;"><strong>Notes:</strong><br><em style="color:var(--muted);">${app.notes}</em></div>`;
  }

  const submittedCount = docDefs.filter(function(d) { return !!docs[d.key]; }).length;
  if (submittedCount > 0) {
    html += `<div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.6px;color:var(--muted);margin-bottom:10px;display:flex;align-items:center;gap:6px;">
      <i class="fa-solid fa-camera"></i> Submitted Documents (${submittedCount}/8)
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:8px;margin-bottom:4px;">`;
    docDefs.forEach(function(d) {
      const img = docs[d.key];
      html += `<div style="border:1.5px solid var(--border);border-radius:8px;overflow:hidden;">
        <div style="padding:5px 8px;font-size:10px;font-weight:700;color:var(--muted);background:var(--surface2);border-bottom:1px solid var(--border);">${d.label}</div>
        <div style="aspect-ratio:4/3;background:var(--surface3);display:flex;align-items:center;justify-content:center;">
          ${img
            ? `<img src="${img}" style="width:100%;height:100%;object-fit:cover;display:block;" />`
            : `<span style="font-size:11px;color:var(--muted);padding:6px;text-align:center;"><i class="fa-solid fa-image" style="display:block;font-size:1.3rem;margin-bottom:4px;"></i>No photo</span>`
          }
        </div>
      </div>`;
    });
    html += `</div>`;
  }

  content.innerHTML = html;

  const actionsEl = document.getElementById('view-driver-actions');
  if (actionsEl) {
    if (isPending) {
      actionsEl.innerHTML =
        `<button class="btn btn-outline btn-sm" onclick="document.getElementById('modal-viewDriver').classList.add('hidden')" style="flex:0 0 auto;">Close</button>
        <div style="flex:1;"></div>
        <button class="btn btn-red btn-sm" onclick="document.getElementById('modal-viewDriver').classList.add('hidden');rejectApplication('${app.id}')"><i class="fa-solid fa-xmark"></i> Reject</button>
        <button class="btn btn-green btn-sm" onclick="document.getElementById('modal-viewDriver').classList.add('hidden');approveApplication('${app.id}')"><i class="fa-solid fa-arrow-up"></i> Promote</button>`;
    } else {
      actionsEl.innerHTML =
        `<button class="btn btn-outline btn-sm" onclick="document.getElementById('modal-viewDriver').classList.add('hidden')" style="flex:1;">Close</button>`;
    }
  }

  document.getElementById('modal-viewDriver').classList.remove('hidden');
}

function setTab(tab) {
  currentTab = tab;
  currentFilter = 'All';
  barangayFilter = 'All';
  searchQuery = '';
  const searchEl = document.getElementById('driver-search');
  if (searchEl) searchEl.value = '';
  const sel = document.getElementById('barangay-filter');
  if (sel) sel.value = 'All';
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
  const barangayEl = document.getElementById('promote-driver-barangay');
  if (barangayEl) barangayEl.textContent = app.preferredBarangay || 'their requested barangay';
  const confirmBtn = document.getElementById('promote-driver-confirm-btn');
  confirmBtn.onclick = function() {
    app.status = 'Approved';
    app.approvedDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    app.truckNo = 'Pending Assignment';
    app.assignedBarangay = app.preferredBarangay;
    saveApplicationsToStorage();
    document.getElementById('modal-promoteDriver').classList.add('hidden');

    // Upgrade the user account in zc_users and zc_session
    try {
      const users = JSON.parse(localStorage.getItem('zc_users') || '[]');
      const appEmail = (app.email || '').toLowerCase();
      const appName  = (app.name  || '').toLowerCase();

      // Match by email first; fall back to matching by full name
      let idx = appEmail
        ? users.findIndex(u => (u.email || '').toLowerCase() === appEmail)
        : -1;
      if (idx === -1) {
        idx = users.findIndex(u => {
          const full = ((u.firstName || '') + ' ' + (u.lastName || '')).trim().toLowerCase();
          return full === appName;
        });
      }

      if (idx !== -1) {
        users[idx].role             = 'driver';
        users[idx].assignedBarangay = app.preferredBarangay;
        localStorage.setItem('zc_users', JSON.stringify(users));

        // Also update the active session if this user is currently logged in
        try {
          const session = JSON.parse(sessionStorage.getItem('zc_session') || 'null');
          if (session) {
            const sessEmail = (session.email || '').toLowerCase();
            const sessName  = ((session.firstName || session.name || '') + ' ' + (session.lastName || '')).trim().toLowerCase();
            if ((appEmail && sessEmail === appEmail) || (!appEmail && sessName === appName)) {
              session.role             = 'driver';
              session.assignedBarangay = app.preferredBarangay;
              sessionStorage.setItem('zc_session', JSON.stringify(session));
            }
          }
        } catch(e) {}

        // Clear the pending application flag so upgrade-to-driver.html shows
        // the wizard again if this user ever visits it (not the pending panel)
        try {
          const pendRaw = localStorage.getItem('zc_my_driver_app');
          if (pendRaw) {
            const pend = JSON.parse(pendRaw);
            const pendEmail = (pend.email || '').toLowerCase();
            const pendName  = (pend.name  || '').toLowerCase();
            if ((appEmail && pendEmail === appEmail) || (!appEmail && pendName === appName)) {
              localStorage.removeItem('zc_my_driver_app');
            }
          }
        } catch(e) {}
      }
    } catch(e) {}
    if (typeof NOTIFS_DB !== 'undefined') {
      NOTIFS_DB.add({
        citizenName: app.name,
        driverName:  app.name,
        type:        'account-promoted',
        title:       'Application Approved — Welcome to the Driver Portal!',
        desc:        'Your driver application has been approved by the city administrator. You have been assigned to ' + (app.preferredBarangay || 'your requested barangay') + '. Log in again to access the Driver Portal and your assigned collection routes.',
        tag:         'Approved',
        tagColor:    'green',
        icon:        'fa-truck',
        iconColor:   'green'
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
    const notes = document.getElementById('reject-driver-notes').value.trim();
    const fullReason = notes ? reason + ' — ' + notes : reason;
    app.status = 'Rejected';
    app.rejectedDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    app.rejectionReason = fullReason;
    saveApplicationsToStorage();
    closeRejectDriverModal();
    if (typeof NOTIFS_DB !== 'undefined') {
      NOTIFS_DB.add({
        citizenName: app.name,
        driverName:  app.name,
        type:        'application-rejected',
        title:       'Application Rejected',
        desc:        'Your driver application has been reviewed and rejected. Reason: ' + fullReason + '. You may reapply after addressing the feedback.',
        tag:         'Rejected',
        tagColor:    'red',
        icon:        'fa-circle-xmark',
        iconColor:   'red'
      });
    }
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
  const reasonEl = document.getElementById('demote-driver-reason');
  if (reasonEl) { reasonEl.value = ''; reasonEl.style.borderColor = ''; }
  const notesEl = document.getElementById('demote-driver-notes');
  if (notesEl) notesEl.value = '';
  document.getElementById('modal-demoteDriver').classList.remove('hidden');
}

function closeDemoteDriverModal() {
  document.getElementById('modal-demoteDriver').classList.add('hidden');
  pendingDemoteId = null;
  const reasonEl = document.getElementById('demote-driver-reason');
  if (reasonEl) { reasonEl.value = ''; reasonEl.style.borderColor = ''; }
  const notesEl = document.getElementById('demote-driver-notes');
  if (notesEl) notesEl.value = '';
}

function confirmDemoteDriver() {
  const reasonEl = document.getElementById('demote-driver-reason');
  const reason = reasonEl ? reasonEl.value.trim() : '';
  if (!reason) {
    if (reasonEl) reasonEl.style.borderColor = 'var(--red)';
    return;
  }
  if (reasonEl) reasonEl.style.borderColor = '';
  const notesEl = document.getElementById('demote-driver-notes');
  const notes = notesEl ? notesEl.value.trim() : '';
  const fullReason = notes ? reason + ' — ' + notes : reason;

  const app = driverApplications.find(a => a.id === pendingDemoteId);
  if (app) {
    app.demoted = true;
    app.demoteReason = fullReason;
    app.demotedDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    app.suspended = false;
    app.suspendReason = '';

    // Persist demotion with reason
    let allD = {};
    try { allD = JSON.parse(localStorage.getItem(DRIVER_DEMOTE_KEY)) || {}; } catch(e) {}
    allD[app.id] = { demoted: true, reason: fullReason, date: app.demotedDate };
    localStorage.setItem(DRIVER_DEMOTE_KEY, JSON.stringify(allD));

    // Clear any suspension record
    persistDriverSuspension(app.id, false, '');

    // Update zc_users role to 'citizen' by email (same lookup as approveApplication)
    try {
      const users = JSON.parse(localStorage.getItem('zc_users') || '[]');
      const appEmail = (app.email || '').toLowerCase();
      const appName  = (app.name  || '').toLowerCase();
      let idx = appEmail
        ? users.findIndex(u => (u.email || '').toLowerCase() === appEmail)
        : -1;
      if (idx === -1) {
        idx = users.findIndex(u => {
          const full = ((u.firstName || '') + ' ' + (u.lastName || '')).trim().toLowerCase();
          return full === appName;
        });
      }
      if (idx !== -1) {
        users[idx].role = 'citizen';
        users[idx].suspended = false;
        users[idx].suspendReason = null;
        localStorage.setItem('zc_users', JSON.stringify(users));

        // Also update active session if this is the currently logged-in user
        try {
          const session = JSON.parse(sessionStorage.getItem('zc_session') || 'null');
          if (session) {
            const sessEmail = (session.email || '').toLowerCase();
            const sessName  = ((session.firstName || session.name || '') + ' ' + (session.lastName || '')).trim().toLowerCase();
            if ((appEmail && sessEmail === appEmail) || (!appEmail && sessName === appName)) {
              session.role = 'citizen';
              sessionStorage.setItem('zc_session', JSON.stringify(session));
            }
          }
        } catch(e) {}
      }
    } catch(e) {}

    if (typeof NOTIFS_DB !== 'undefined') {
      NOTIFS_DB.add({
        driverName: app.name,
        type:       'account-demoted',
        title:      'Driver Account Demoted',
        desc:       'Your driver account has been demoted back to Citizen. Reason: ' + fullReason + '. To regain driver access, you must submit a new Driver Application.',
        tag:        'Demoted',
        tagColor:   'red',
        icon:       'fa-user-minus',
        iconColor:  'red'
      });
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
