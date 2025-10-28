// src/scripts/drawer.js

/**
 * Toggles the 'data-open' attribute on a drawer element.
 * @param {HTMLElement} drawer - The drawer element to toggle.
 */
function toggleDrawer(drawer) {
  const isOpen = drawer.getAttribute('data-open') === 'true';
  drawer.setAttribute('data-open', !isOpen);
}

document.addEventListener('DOMContentLoaded', () => {
  const langDrawer = document.getElementById('lang-drawer');
  const menuDrawer = document.getElementById('menu-drawer');
  
  // Attach event listeners to the main header buttons
  document.getElementById('btn-lang')?.addEventListener('click', () => {
    if (menuDrawer?.getAttribute('data-open') === 'true') {
      // Close the menu drawer if it's open
      toggleDrawer(menuDrawer);
    }
    toggleDrawer(langDrawer);
  });
  
  document.getElementById('btn-menu')?.addEventListener('click', () => {
    if (langDrawer?.getAttribute('data-open') === 'true') {
      // Close the language drawer if it's open
      toggleDrawer(langDrawer);
    }
    toggleDrawer(menuDrawer);
  });

  // Attach event listeners to all 'data-close' buttons within drawers
  document.querySelectorAll('[data-close]').forEach(button => {
    button.addEventListener('click', (event) => {
      // Find the nearest parent drawer and close it
      const drawer = event.target.closest('.drawer');
      if (drawer) {
        toggleDrawer(drawer);
      }
    });
  });
});