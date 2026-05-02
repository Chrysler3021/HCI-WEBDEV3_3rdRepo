# Separation of Concerns Refactoring Plan

## Overview
Extracting all inline JavaScript from HTML files and moving logic into modular external files following best practices.

## New Folder Structure
```
js/
├── global.js              # Shared utilities (modals, toasts, common functions)
├── auth.js                # Login authentication
├── register.js            # Registration form handling
├── navigation.js          # Sidebar, hamburger, nav interactions
├── forms.js               # Form validation & submission
├── citizen.js             # Citizen page logic
├── officer.js             # Officer page logic
├── driver.js              # Driver page logic
├── admin.js               # Admin page logic
└── utils/
    ├── storage.js         # localStorage utilities
    ├── validators.js      # Form validation utilities
    └── dom-helpers.js     # DOM utility functions
```

## Refactoring Phases

### **Phase 1: Global & Authentication** ✅ IN PROGRESS
- [ ] `js/global.js` - Common utilities
- [ ] `js/navigation.js` - Sidebar/hamburger menu logic
- [ ] Login.html - Remove inline script, add IDs/classes
- [ ] Register.html - Remove inline script, add IDs/classes
- [ ] index.html - Extract landing page JavaScript

### **Phase 2: Core Features**
- [ ] Officer KYC Review (officer-kyc-review.html)
- [ ] Officer Pending Reports (officer-pending-reports.html)
- [ ] Citizen Submit Report (submit-report.html)

### **Phase 3: Admin & Driver**
- [ ] Admin Dashboard pages
- [ ] Driver pages
- [ ] Utility pages

### **Phase 4: Polish & Testing**
- [ ] Remove all inline event handlers
- [ ] Ensure all functionality works
- [ ] Performance optimization

## Key Principles

1. **HTML = Structure Only**
   - No inline JavaScript
   - No onclick, onchange, onmouseover handlers
   - Semantic markup with meaningful IDs and classes

2. **CSS = Styling Only**
   - CSS handles hover states where possible
   - Use CSS classes for state management

3. **JavaScript = Behavior Only**
   - Event delegation for dynamic content
   - Document.addEventListener() for global listeners
   - Modular functions for specific pages

4. **Data Management**
   - Use data-* attributes for configuration
   - localStorage for persistence
   - Clean separation of concerns

## Example Pattern: Before & After

### BEFORE (Inline):
```html
<button onclick="showToast('Success')">Click me</button>
<script>
  function showToast(msg) {
    const el = document.getElementById('toast');
    el.textContent = msg;
    el.classList.add('show');
    setTimeout(() => el.classList.remove('show'), 3500);
  }
</script>
```

### AFTER (Modular):
```html
<button class="btn-action" data-action="show-toast" data-message="Success">Click me</button>
<!-- External script -->
<script src="js/global.js"></script>
```

```javascript
// js/global.js
export function showToast(message) {
  const el = document.getElementById('toast');
  el.textContent = message;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 3500);
}

document.addEventListener('click', (e) => {
  if (e.target.dataset.action === 'show-toast') {
    showToast(e.target.dataset.message);
  }
});
```

## Implementation Status
- Created: js/auth.js (existing)
- To Create: js/global.js, js/navigation.js, js/register.js
- To Update: Login.html, Register.html, index.html
