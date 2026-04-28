// ============================================================
// js/register.js - Registration Form Logic
// ============================================================

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
  return /^(\+63|0)[0-9]{10}$/.test(phone.replace(/-/g, ''));
}

function validatePassword(password) {
  return password.length >= 8;
}

// ── Per-panel validators ───────────────────────────────────

function validatePanel1() {
  var firstName = document.getElementById('regFirstName');
  var lastName  = document.getElementById('regLastName');
  var email     = document.getElementById('regEmail');
  var phone     = document.getElementById('regPhone');
  var ok = true;

  [firstName, lastName].forEach(function (el) {
    if (!el) return;
    if (!el.value.trim()) { el.style.borderColor = '#dc2626'; ok = false; }
    else el.style.borderColor = '';
  });

  if (email) {
    if (!email.value.trim() || !validateEmail(email.value)) {
      email.style.borderColor = '#dc2626'; ok = false;
    } else { email.style.borderColor = ''; }
  }

  if (phone) {
    if (!phone.value.trim() || !validatePhone(phone.value)) {
      phone.style.borderColor = '#dc2626'; ok = false;
    } else { phone.style.borderColor = ''; }
  }

  return ok;
}

function validatePanel2() {
  var barangay    = document.getElementById('regBarangay');
  var address     = document.getElementById('regAddress');
  var fullAddress = document.getElementById('regFullAddress');
  var ok = true;

  [barangay, address, fullAddress].forEach(function (el) {
    if (!el) return;
    if (!el.value.trim()) { el.style.borderColor = '#dc2626'; ok = false; }
    else el.style.borderColor = '';
  });

  return ok;
}

function validatePanel3() {
  var password        = document.getElementById('regPassword');
  var confirmPassword = document.getElementById('regConfirmPassword');
  var terms           = document.getElementById('terms');
  var ok = true;

  if (!password || !validatePassword(password.value)) {
    if (password) password.style.borderColor = '#dc2626';
    ok = false;
  } else { if (password) password.style.borderColor = ''; }

  if (password && confirmPassword && password.value !== confirmPassword.value) {
    confirmPassword.style.borderColor = '#dc2626';
    ok = false;
  } else { if (confirmPassword) confirmPassword.style.borderColor = ''; }

  if (!terms || !terms.checked) {
    ok = false;
  }

  return ok;
}

// ── Final submit ───────────────────────────────────────────

function submitRegistration() {
  var errorMsg  = document.getElementById('regErrorMsg');
  var errorText = document.getElementById('regErrorText');

  function showError(msg) {
    if (errorText) errorText.textContent = msg;
    if (errorMsg)  errorMsg.style.display = 'block';
  }

  if (!validatePanel3()) {
    var pw  = document.getElementById('regPassword');
    var cpw = document.getElementById('regConfirmPassword');
    var terms = document.getElementById('terms');

    if (pw && !validatePassword(pw.value)) {
      showError('Password must be at least 8 characters.');
    } else if (pw && cpw && pw.value !== cpw.value) {
      showError('Passwords do not match.');
    } else if (!terms || !terms.checked) {
      showError('You must agree to the Terms of Service to continue.');
    } else {
      showError('Please fix the errors above.');
    }
    return;
  }

  if (errorMsg) errorMsg.style.display = 'none';

  var data = {
    firstName:   (document.getElementById('regFirstName')   || {}).value || '',
    lastName:    (document.getElementById('regLastName')    || {}).value || '',
    email:       (document.getElementById('regEmail')       || {}).value || '',
    phone:       (document.getElementById('regPhone')       || {}).value || '',
    barangay:    (document.getElementById('regBarangay')    || {}).value || '',
    address:     (document.getElementById('regAddress')     || {}).value || '',
    fullAddress: (document.getElementById('regFullAddress') || {}).value || '',
    password:    (document.getElementById('regPassword')    || {}).value || ''
  };

  var result = ZC_DB.register(data);

  if (result.ok) {
    window.location.href = 'kyc-verification.html';
  } else {
    showError(result.error);
  }
}

// ── Form navigation (validation gates) ────────────────────

function initFormNavigation() {
  document.querySelectorAll('label[for="radio2"]').forEach(function (label) {
    label.addEventListener('click', function (e) {
      // Only block forward navigation (panel1 → panel2), not the Back button
      var panel1 = document.getElementById('panel1');
      if (panel1 && panel1.style.display !== 'none') {
        if (!validatePanel1()) { e.preventDefault(); e.stopPropagation(); }
      }
    });
  });

  document.querySelectorAll('label[for="radio3"]').forEach(function (label) {
    label.addEventListener('click', function (e) {
      if (!validatePanel2()) { e.preventDefault(); e.stopPropagation(); }
    });
  });
}

// ── Real-time blur feedback ────────────────────────────────

function initRegisterForm() {
  initFormNavigation();

  var emailEl = document.getElementById('regEmail');
  if (emailEl) {
    emailEl.addEventListener('blur', function () {
      this.style.borderColor = (this.value && !validateEmail(this.value)) ? '#dc2626' : '';
    });
  }

  var phoneEl = document.getElementById('regPhone');
  if (phoneEl) {
    phoneEl.addEventListener('blur', function () {
      this.style.borderColor = (this.value && !validatePhone(this.value)) ? '#dc2626' : '';
    });
  }

  var pwEl = document.getElementById('regPassword');
  if (pwEl) {
    pwEl.addEventListener('blur', function () {
      this.style.borderColor = (this.value && !validatePassword(this.value)) ? '#dc2626' : '';
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initRegisterForm);
} else {
  initRegisterForm();
}
