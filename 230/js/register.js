// ============================================================
// js/register.js - Registration Form Logic
// ============================================================

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean}
 */
function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Validate phone number (Philippine format)
 * @param {string} phone - Phone to validate
 * @returns {boolean}
 */
function validatePhone(phone) {
  const regex = /^(\+63|0)[0-9]{10}$/;
  return regex.test(phone.replace(/-/g, ''));
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {boolean}
 */
function validatePassword(password) {
  return password.length >= 8;
}

/**
 * Get form panel data
 * @param {number} panelNumber - Panel number (1, 2, or 3)
 * @returns {Object} Form data
 */
export function getPanelData(panelNumber) {
  const panel = document.getElementById(`panel${panelNumber}`);
  if (!panel) return null;

  const inputs = panel.querySelectorAll('input, select, textarea');
  const data = {};

  inputs.forEach(input => {
    if (input.type !== 'checkbox' && input.type !== 'radio') {
      data[input.name || input.placeholder] = input.value;
    } else if (input.type === 'checkbox' && input.checked) {
      data[input.id] = true;
    }
  });

  return data;
}

/**
 * Validate panel 1 (Personal Info)
 * @returns {boolean}
 */
export function validatePanel1() {
  const panel = document.getElementById('panel1');
  if (!panel) return true;

  const inputs = panel.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"]');
  let isValid = true;

  inputs.forEach(input => {
    if (!input.value.trim()) {
      input.style.borderColor = '#dc2626';
      isValid = false;
    } else if (input.type === 'email' && !validateEmail(input.value)) {
      input.style.borderColor = '#dc2626';
      isValid = false;
    } else if (input.type === 'tel' && !validatePhone(input.value)) {
      input.style.borderColor = '#dc2626';
      isValid = false;
    } else {
      input.style.borderColor = '';
    }
  });

  return isValid;
}

/**
 * Validate panel 2 (Location)
 * @returns {boolean}
 */
export function validatePanel2() {
  const panel = document.getElementById('panel2');
  if (!panel) return true;

  const inputs = panel.querySelectorAll('input, select');
  let isValid = true;

  inputs.forEach(input => {
    if (!input.value.trim()) {
      input.style.borderColor = '#dc2626';
      isValid = false;
    } else {
      input.style.borderColor = '';
    }
  });

  return isValid;
}

/**
 * Validate panel 3 (Security)
 * @returns {boolean}
 */
export function validatePanel3() {
  const panel = document.getElementById('panel3');
  if (!panel) return true;

  const password = panel.querySelector('input[type="password"]:first-of-type');
  const confirmPassword = panel.querySelector('input[type="password"]:last-of-type');
  const terms = document.getElementById('terms');

  let isValid = true;

  if (!password || !validatePassword(password.value)) {
    if (password) password.style.borderColor = '#dc2626';
    isValid = false;
  } else if (password) {
    password.style.borderColor = '';
  }

  if (password && confirmPassword && password.value !== confirmPassword.value) {
    if (confirmPassword) confirmPassword.style.borderColor = '#dc2626';
    isValid = false;
  } else if (confirmPassword) {
    confirmPassword.style.borderColor = '';
  }

  if (!terms || !terms.checked) {
    isValid = false;
  }

  return isValid;
}

/**
 * Initialize form panel navigation
 */
export function initFormNavigation() {
  const radio1 = document.getElementById('radio1');
  const radio2 = document.getElementById('radio2');
  const radio3 = document.getElementById('radio3');

  if (!radio1 || !radio2 || !radio3) return;

  // Prevent moving forward without validation
  document.querySelectorAll('label[for="radio2"]').forEach(label => {
    label.addEventListener('click', function(e) {
      if (!validatePanel1()) {
        e.preventDefault();
        e.stopPropagation();
      }
    });
  });

  document.querySelectorAll('label[for="radio3"]').forEach(label => {
    label.addEventListener('click', function(e) {
      if (!validatePanel2()) {
        e.preventDefault();
        e.stopPropagation();
      }
    });
  });
}

/**
 * Initialize registration form
 */
export function initRegisterForm() {
  initFormNavigation();
  
  // Add real-time validation feedback
  document.querySelectorAll('input[type="email"]').forEach(input => {
    input.addEventListener('blur', function() {
      if (this.value && !validateEmail(this.value)) {
        this.style.borderColor = '#dc2626';
      } else {
        this.style.borderColor = '';
      }
    });
  });

  document.querySelectorAll('input[type="tel"]').forEach(input => {
    input.addEventListener('blur', function() {
      if (this.value && !validatePhone(this.value)) {
        this.style.borderColor = '#dc2626';
      } else {
        this.style.borderColor = '';
      }
    });
  });

  document.querySelectorAll('input[type="password"]').forEach(input => {
    input.addEventListener('blur', function() {
      if (this.value && !validatePassword(this.value)) {
        this.style.borderColor = '#dc2626';
      } else {
        this.style.borderColor = '';
      }
    });
  });
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initRegisterForm);
} else {
  initRegisterForm();
}
