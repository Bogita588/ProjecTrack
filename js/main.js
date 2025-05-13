// Mobile menu toggle functionality
const mobileMenuIcon = document.getElementById('mobile-menu-icon');
const navLinks = document.querySelector('.nav-links');

mobileMenuIcon.addEventListener('click', () => {
  mobileMenuIcon.classList.toggle('active'); // Toggle the active state for animation
  navLinks.classList.toggle('active'); // Toggle visibility of nav links
});
