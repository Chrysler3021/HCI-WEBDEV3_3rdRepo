// ============================================================
// js/auth.js - Authentication Logic
// ============================================================

// Allowed users database - map emails to their dashboards
const allowedUsers = {
  "admin@gmail.com": "admin-dashboard.html",
  "officer@gmail.com": "officer-dashboard.html",
  "driver@gmail.com": "dashboard-driver.html",
  "citizen@gmail.com": "citizen-dashboard.html"
};

/**
 * Validate and process login
 * @param {string} email - User email
 * @returns {boolean} - Success/failure
 */
function handleLogin(email) {
  const normalizedEmail = email.trim().toLowerCase();
  const errorMsg = document.getElementById('errorMsg');

  if (allowedUsers[normalizedEmail]) {
    if (errorMsg) errorMsg.style.display = "none";
    
    window.location.href = allowedUsers[normalizedEmail];
    return true;
  } else {
    if (errorMsg) errorMsg.style.display = "block";
    return false;
  }
}

/**
 * Initialize login form
 */
function initLoginForm() {
  const loginForm = document.getElementById('loginForm');
  
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const emailInput = document.getElementById('emailInput');
      if (emailInput) {
        handleLogin(emailInput.value);
      }
    });
  }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLoginForm);
} else {
  initLoginForm();
}

