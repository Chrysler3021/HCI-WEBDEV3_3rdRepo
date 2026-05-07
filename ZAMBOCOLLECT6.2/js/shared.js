/* shared.js — ZamboCollect universal utilities
   Scroll-to-top, table sorting, toast helper.
   Included on all portal pages via shared.css's scroll-top-btn. */

(function () {
  'use strict';

  /* ── Scroll-to-top ──────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.getElementById('scrollTopBtn');
    if (!btn) return;

    var scroller = document.querySelector('.main-content') || window;

    function onScroll() {
      var y = scroller === window ? window.scrollY : scroller.scrollTop;
      btn.classList.toggle('visible', y > 280);
    }

    if (scroller === window) window.addEventListener('scroll', onScroll, { passive: true });
    else scroller.addEventListener('scroll', onScroll, { passive: true });

    btn.addEventListener('click', function () {
      if (scroller === window) window.scrollTo({ top: 0, behavior: 'smooth' });
      else scroller.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  /* ── Sortable table headers ─────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('th.th-sortable').forEach(function (th) {
      th.addEventListener('click', function () {
        var table = th.closest('table');
        if (!table) return;

        var idx = Array.prototype.indexOf.call(th.parentElement.children, th);
        var asc = !th.classList.contains('sort-asc');

        th.parentElement.querySelectorAll('th').forEach(function (t) {
          t.classList.remove('sort-asc', 'sort-desc');
        });
        th.classList.add(asc ? 'sort-asc' : 'sort-desc');

        var tbody = table.querySelector('tbody');
        if (!tbody) return;
        var rows = Array.prototype.slice.call(tbody.querySelectorAll('tr'));

        rows.sort(function (a, b) {
          var aVal = (a.cells[idx] ? a.cells[idx].textContent : '').trim();
          var bVal = (b.cells[idx] ? b.cells[idx].textContent : '').trim();
          var aNum = parseFloat(aVal.replace(/[^0-9.\-]/g, ''));
          var bNum = parseFloat(bVal.replace(/[^0-9.\-]/g, ''));
          var cmp = isNaN(aNum) || isNaN(bNum)
            ? aVal.localeCompare(bVal)
            : aNum - bNum;
          return asc ? cmp : -cmp;
        });

        rows.forEach(function (r) { tbody.appendChild(r); });
      });
    });
  });

  /* ── Toast helper — ZC.toast(msg, type, title) ─────────── */
  var ICONS = {
    success: 'fa-circle-check',
    error:   'fa-circle-xmark',
    warn:    'fa-triangle-exclamation',
    info:    'fa-circle-info'
  };

  function getOrCreateContainer() {
    var c = document.getElementById('zc-toast-container');
    if (!c) {
      c = document.createElement('div');
      c.id = 'zc-toast-container';
      c.className = 'toast-container';
      document.body.appendChild(c);
    }
    return c;
  }

  function showToast(msg, type, title) {
    type = type || 'info';
    var container = getOrCreateContainer();
    var icon = ICONS[type] || ICONS.info;

    var el = document.createElement('div');
    el.className = 'toast toast-' + type;
    el.innerHTML =
      '<i class="fa-solid ' + icon + ' toast-icon"></i>' +
      '<div class="toast-body">' +
        (title ? '<div class="toast-title">' + title + '</div>' : '') +
        '<div class="toast-msg">' + msg + '</div>' +
      '</div>' +
      '<button class="toast-close" onclick="this.parentElement.remove()"><i class="fa-solid fa-xmark"></i></button>';

    container.appendChild(el);

    requestAnimationFrame(function () {
      requestAnimationFrame(function () { el.classList.add('show'); });
    });

    setTimeout(function () {
      el.classList.remove('show');
      el.classList.add('hide');
      setTimeout(function () { el.remove(); }, 300);
    }, 4200);
  }

  window.ZC = window.ZC || {};
  window.ZC.toast = showToast;

}());
