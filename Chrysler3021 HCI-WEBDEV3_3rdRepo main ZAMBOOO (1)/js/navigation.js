// ============================================================
// js/navigation.js - Sidebar & Navigation Logic
// ============================================================

/**
 * Initialize hamburger menu toggle
 */
function initHamburgerMenu() {
  const navToggle = document.getElementById('nav-toggle');
  const hamburger = document.querySelector('[data-hamburger]');
  
  if (hamburger && navToggle) {
    hamburger.addEventListener('click', function(e) {
      e.preventDefault();
      navToggle.checked = !navToggle.checked;
    });

    // Close menu when nav item is clicked
    document.querySelectorAll('.nav-item').forEach(link => {
      link.addEventListener('click', function() {
        navToggle.checked = false;
      });
    });
  }
}

/**
 * Initialize mobile hamburger menu (small screen)
 */
function initMobileMenu() {
  const menuToggle = document.getElementById('menu-toggle');
  
  if (menuToggle) {
    document.querySelectorAll('.mobile-nav-menu a').forEach(link => {
      link.addEventListener('click', function() {
        menuToggle.checked = false;
      });
    });
  }
}

/**
 * Handle sidebar overlay click (close menu)
 */
function initSidebarOverlay() {
  const overlay = document.querySelector('.sidebar-overlay');
  const navToggle = document.getElementById('nav-toggle');
  
  if (overlay && navToggle) {
    overlay.addEventListener('click', function() {
      navToggle.checked = false;
    });
  }
}

/**
 * Initialize all navigation elements
 */
function initNavigation() {
  initHamburgerMenu();
  initMobileMenu();
  initSidebarOverlay();
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initNavigation);
} else {
  initNavigation();
}
