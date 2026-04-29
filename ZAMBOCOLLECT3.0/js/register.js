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
  var firstName  = document.getElementById('regFirstName');
  var middleName = document.getElementById('regMiddleName');
  var lastName   = document.getElementById('regLastName');
  var email      = document.getElementById('regEmail');
  var phone      = document.getElementById('regPhone');
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
    middleName:  (document.getElementById('regMiddleName')  || {}).value || '',
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

// ── OTP ────────────────────────────────────────────────────

function showOTPModal() {
  var emailEl = document.getElementById('regEmail');
  var display = document.getElementById('otp-email-display');
  if (display && emailEl) display.textContent = emailEl.value;

  var modal = document.getElementById('otp-modal');
  if (!modal) return;
  modal.style.display = 'flex';

  var boxes = modal.querySelectorAll('.otp-box');
  boxes.forEach(function (b) { b.value = ''; b.classList.remove('otp-filled'); });
  if (boxes[0]) boxes[0].focus();

  var err = document.getElementById('otp-error');
  if (err) err.style.display = 'none';
}

function verifyOTP() {
  var boxes = document.querySelectorAll('#otp-modal .otp-box');
  var code = '';
  boxes.forEach(function (b) { code += b.value; });

  if (/^\d{6}$/.test(code)) {
    document.getElementById('otp-modal').style.display = 'none';
    document.getElementById('radio2').checked = true;
  } else {
    var err = document.getElementById('otp-error');
    if (err) err.style.display = 'block';
    boxes.forEach(function (b) { b.style.borderColor = '#dc2626'; });
  }
}

function initOTPBoxes() {
  var boxes = document.querySelectorAll('#otp-modal .otp-box');
  boxes.forEach(function (box, i) {
    box.addEventListener('input', function () {
      this.value = this.value.replace(/[^0-9]/g, '');
      if (this.value) {
        this.classList.add('otp-filled');
        this.style.borderColor = '';
        if (i < boxes.length - 1) boxes[i + 1].focus();
      } else {
        this.classList.remove('otp-filled');
      }
    });

    box.addEventListener('keydown', function (e) {
      if (e.key === 'Backspace' && !this.value && i > 0) {
        boxes[i - 1].value = '';
        boxes[i - 1].classList.remove('otp-filled');
        boxes[i - 1].focus();
      }
      if (e.key === 'Enter') verifyOTP();
    });

    box.addEventListener('paste', function (e) {
      e.preventDefault();
      var pasted = (e.clipboardData || window.clipboardData).getData('text').replace(/[^0-9]/g, '').slice(0, 6);
      pasted.split('').forEach(function (digit, j) {
        if (boxes[i + j]) { boxes[i + j].value = digit; boxes[i + j].classList.add('otp-filled'); }
      });
      var next = i + pasted.length;
      if (next < boxes.length) boxes[next].focus();
    });
  });
}

// ── Form navigation (validation gates) ────────────────────

function initFormNavigation() {
  document.querySelectorAll('label[for="radio2"]').forEach(function (label) {
    label.addEventListener('click', function (e) {
      // Only intercept forward navigation (panel1 → panel2), not Back from panel3
      if (document.getElementById('radio1').checked) {
        e.preventDefault();
        e.stopPropagation();
        if (validatePanel1()) showOTPModal();
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
  initOTPBoxes();

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
