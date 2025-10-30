// src/scripts/drawer.js

/**
 * Opens a drawer element.
 * @param {HTMLElement} drawer - The drawer element to open.
 * @param {HTMLElement} button - The button that triggered the drawer.
 */
function openDrawer(drawer, button) {
  drawer.setAttribute('data-open', 'true');
  button?.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

/**
 * Closes a drawer element.
 * @param {HTMLElement} drawer - The drawer element to close.
 * @param {HTMLElement} button - The button that triggered the drawer.
 */
function closeDrawer(drawer, button) {
  drawer.setAttribute('data-open', 'false');
  button?.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

/**
 * Toggles the 'data-open' attribute on a drawer element.
 * @param {HTMLElement} drawer - The drawer element to toggle.
 * @param {HTMLElement} button - The button that triggered the drawer.
 */
function toggleDrawer(drawer, button) {
  const isOpen = drawer.getAttribute('data-open') === 'true';
  if (isOpen) {
    closeDrawer(drawer, button);
  } else {
    openDrawer(drawer, button);
  }
}

function setupDrawers() {
  const langDrawer = document.getElementById('lang-drawer');
  const menuDrawer = document.getElementById('menu-drawer');
  const btnLang = document.getElementById('btn-lang');
  const btnMenu = document.getElementById('btn-menu');

  // Attach event listeners to the main header buttons
  btnLang?.addEventListener('click', () => {
    if (menuDrawer?.getAttribute('data-open') === 'true') {
      // Close the menu drawer if it's open
      closeDrawer(menuDrawer, btnMenu);
    }
    toggleDrawer(langDrawer, btnLang);
  });

  btnMenu?.addEventListener('click', () => {
    if (langDrawer?.getAttribute('data-open') === 'true') {
      // Close the language drawer if it's open
      closeDrawer(langDrawer, btnLang);
    }
    toggleDrawer(menuDrawer, btnMenu);
  });

  // Attach event listeners to all 'data-close' buttons within drawers
  document.querySelectorAll('[data-close]').forEach(button => {
    button.addEventListener('click', (event) => {
      // Find the nearest parent drawer and close it
      const drawer = event.target.closest('.drawer');
      if (drawer) {
        const relatedButton = drawer.id === 'lang-drawer' ? btnLang : btnMenu;
        closeDrawer(drawer, relatedButton);
      }
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (langDrawer?.getAttribute('data-open') === 'true') {
        closeDrawer(langDrawer, btnLang);
      }
      if (menuDrawer?.getAttribute('data-open') === 'true') {
        closeDrawer(menuDrawer, btnMenu);
      }
    }
  });

  // Close on overlay click
  [langDrawer, menuDrawer].forEach(drawer => {
    drawer?.addEventListener('click', (e) => {
      if (e.target === drawer) {
        const relatedButton = drawer.id === 'lang-drawer' ? btnLang : btnMenu;
        closeDrawer(drawer, relatedButton);
      }
    });
  });
}

// Run on page load
document.addEventListener('DOMContentLoaded', setupDrawers);

// Run on Astro page transitions
document.addEventListener('astro:page-load', setupDrawers);