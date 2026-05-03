// ============================================================
// js/global.js - Common Utilities & Shared Logic
// ============================================================

/**
 * Display a toast notification message
 * @param {string} message - The message to display
 * @param {number} duration - How long to show (ms)
 */
function showToast(message, duration = 3500) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  
  toast.textContent = message;
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}

/**
 * Toggle modal visibility
 * @param {string} modalId - ID of the modal element
 * @param {boolean} isOpen - True to open, false to close
 */
function toggleModal(modalId, isOpen = null) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  
  if (isOpen === null) {
    // Toggle if not specified
    modal.classList.toggle('hidden');
  } else if (isOpen) {
    modal.classList.remove('hidden');
  } else {
    modal.classList.add('hidden');
  }
}

/**
 * Close modal by clicking outside
 */
function initModalClosers() {
  document.querySelectorAll('[data-modal]').forEach(modal => {
    modal.addEventListener('click', function(e) {
      if (e.target === this) {
        this.classList.add('hidden');
      }
    });
  });
}

/**
 * Initialize close buttons for modals
 */
function initModalButtons() {
  // Close buttons
  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const modalId = this.dataset.closeModal;
      toggleModal(modalId, false);
    });
  });

  // Open buttons
  document.querySelectorAll('[data-open-modal]').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const modalId = this.dataset.openModal;
      toggleModal(modalId, true);
    });
  });
}

/**
 * Apply hover effects to elements
 */
function initHoverEffects() {
  document.querySelectorAll('[data-hover-effect]').forEach(el => {
    el.addEventListener('mouseenter', function() {
      this.style.borderColor = 'var(--primary)';
      this.style.background = 'var(--primary-glow)';
    });

    el.addEventListener('mouseleave', function() {
      this.style.borderColor = 'var(--border)';
      this.style.background = 'var(--surface2)';
    });
  });
}

/**
 * Initialize all global interactive elements
 */
function initGlobal() {
  initModalClosers();
  initModalButtons();
  initHoverEffects();
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGlobal);
} else {
  initGlobal();
}
