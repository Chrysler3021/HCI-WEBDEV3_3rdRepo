// ============================================================
// js/profile-modal.js - Profile Modal Functionality
// ============================================================

/**
 * Initialize profile modal functionality
 * Shows user profile when profile icon/avatar is clicked
 */
function initProfileModal() {
  const userInfoElements = document.querySelectorAll('.user-info');
  const profileModal = document.getElementById('profile-modal');
  
  if (!profileModal) return;
  
  userInfoElements.forEach(element => {
    element.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      openProfileModal();
    });
  });
  
  // Close modal when clicking outside
  profileModal.addEventListener('click', function(e) {
    if (e.target === profileModal) {
      closeProfileModal();
    }
  });
  
  // Close modal on escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeProfileModal();
    }
  });
}

/**
 * Open profile modal and populate with current user data
 */
function openProfileModal() {
  const profileModal = document.getElementById('profile-modal');
  const session = ZC_DB.getSession();
  
  if (!session || !session.user) {
    console.error('No user session found');
    return;
  }
  
  const user = session.user;
  
  // Get initials for avatar
  const firstInitial = user.firstName ? user.firstName.charAt(0).toUpperCase() : '';
  const lastInitial = user.lastName ? user.lastName.charAt(0).toUpperCase() : '';
  const initials = (firstInitial + lastInitial) || 'U';
  
  // Populate modal content
  const avatarEl = profileModal.querySelector('.profile-modal-avatar');
  const nameEl = profileModal.querySelector('.profile-modal-name');
  const roleEl = profileModal.querySelector('.profile-modal-role');
  const bodyEl = profileModal.querySelector('.profile-modal-body');
  
  if (avatarEl) avatarEl.textContent = initials;
  if (nameEl) nameEl.textContent = `${user.firstName || ''} ${user.lastName || ''}`.trim();
  if (roleEl) {
    const roleDisplay = getRoleDisplay(user.role);
    roleEl.textContent = roleDisplay;
  }
  
  // Populate profile details
  if (bodyEl) {
    bodyEl.innerHTML = generateProfileDetails(user);
  }
  
  // Show modal with animation
  profileModal.classList.add('active');
}

/**
 * Close profile modal
 */
function closeProfileModal() {
  const profileModal = document.getElementById('profile-modal');
  if (profileModal) {
    profileModal.classList.remove('active');
  }
}

/**
 * Generate HTML for profile details
 */
function generateProfileDetails(user) {
  let html = '';
  
  // Email
  if (user.email) {
    html += `
      <div class="profile-detail">
        <div class="profile-detail-icon">
          <i class="fa-solid fa-envelope"></i>
        </div>
        <div class="profile-detail-content">
          <div class="profile-detail-label">Email</div>
          <div class="profile-detail-value">${escapeHtml(user.email)}</div>
        </div>
      </div>
    `;
  }
  
  // Phone
  if (user.phone) {
    html += `
      <div class="profile-detail">
        <div class="profile-detail-icon">
          <i class="fa-solid fa-phone"></i>
        </div>
        <div class="profile-detail-content">
          <div class="profile-detail-label">Contact</div>
          <div class="profile-detail-value">${escapeHtml(user.phone)}</div>
        </div>
      </div>
    `;
  }
  
  // Barangay
  if (user.barangay) {
    html += `
      <div class="profile-detail">
        <div class="profile-detail-icon">
          <i class="fa-solid fa-map-pin"></i>
        </div>
        <div class="profile-detail-content">
          <div class="profile-detail-label">Barangay</div>
          <div class="profile-detail-value">${escapeHtml(user.barangay)}</div>
        </div>
      </div>
    `;
  }
  
  // Role
  if (user.role) {
    html += `
      <div class="profile-detail">
        <div class="profile-detail-icon">
          <i class="fa-solid fa-briefcase"></i>
        </div>
        <div class="profile-detail-content">
          <div class="profile-detail-label">Role</div>
          <div class="profile-detail-value">${getRoleDisplay(user.role)}</div>
        </div>
      </div>
    `;
  }
  
  // KYC Status
  if (user.kycStatus) {
    const statusIcon = user.kycStatus === 'verified' ? 'fa-check-circle' : 
                       user.kycStatus === 'pending' ? 'fa-clock' : 'fa-circle-xmark';
    const statusText = user.kycStatus.charAt(0).toUpperCase() + user.kycStatus.slice(1);
    html += `
      <div class="profile-detail">
        <div class="profile-detail-icon">
          <i class="fa-solid ${statusIcon}"></i>
        </div>
        <div class="profile-detail-content">
          <div class="profile-detail-label">KYC Status</div>
          <div class="profile-detail-value">${statusText}</div>
        </div>
      </div>
    `;
  }
  
  return html;
}

/**
 * Get display text for user role
 */
function getRoleDisplay(role) {
  const roleMap = {
    'superadmin': 'Super Admin',
    'admin': 'City Administrator',
    'officer': 'City Officer',
    'driver': 'Collection Driver',
    'citizen': 'Citizen'
  };
  return roleMap[role] || role.charAt(0).toUpperCase() + role.slice(1);
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Handle edit profile button click
 */
function handleEditProfile() {
  const session = ZC_DB.getSession();
  if (!session || !session.user) return;
  
  const role = session.user.role;
  const profilePages = {
    'driver': 'driver-profile.html',
    'citizen': 'my-profile.html',
    'officer': 'officer-kyc-review.html',
    'admin': 'admin-users.html',
    'superadmin': 'admin-users.html'
  };
  
  const profilePage = profilePages[role] || '#';
  window.location.href = profilePage;
}

/**
 * Handle logout button click
 */
function handleLogout() {
  ZC_DB.clearSession();
  window.location.href = 'login.html';
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initProfileModal);
} else {
  initProfileModal();
}
