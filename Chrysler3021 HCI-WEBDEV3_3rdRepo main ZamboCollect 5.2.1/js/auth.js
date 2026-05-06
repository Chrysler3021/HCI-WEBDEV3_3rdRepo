// ============================================================
// js/auth.js - Authentication Logic (backed by ZC_DB)
// ============================================================

function handleLogin(email, password) {
  var errorMsg  = document.getElementById('errorMsg');
  var errorText = document.getElementById('errorText');

  var result = ZC_DB.login(email, password);

  if (result.ok) {
    if (errorMsg) errorMsg.style.display = 'none';
    window.location.href = result.dashboard;
    return true;
  } else {
    if (errorMsg) {
      if (errorText) errorText.textContent = result.error;
      errorMsg.style.display = 'block';
    }
    return false;
  }
}

function togglePasswordVisibility() {
  var input = document.getElementById('passwordInput');
  var icon  = document.getElementById('togglePwIcon');
  if (!input) return;
  if (input.type === 'password') {
    input.type = 'text';
    if (icon) { icon.classList.remove('fa-eye'); icon.classList.add('fa-eye-slash'); }
  } else {
    input.type = 'password';
    if (icon) { icon.classList.remove('fa-eye-slash'); icon.classList.add('fa-eye'); }
  }
}

function fillDemo(email, password) {
  var e = document.getElementById('emailInput');
  var p = document.getElementById('passwordInput');
  if (e) e.value = email;
  if (p) p.value = password;
}

function initLoginForm() {
  var loginForm = document.getElementById('loginForm');
  if (!loginForm) return;

  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var email    = document.getElementById('emailInput');
    var password = document.getElementById('passwordInput');
    if (email && password) {
      handleLogin(email.value, password.value);
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLoginForm);
} else {
  initLoginForm();
}
