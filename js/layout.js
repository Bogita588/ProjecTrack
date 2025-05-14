
    fetch('navbar.html')
  .then(res => res.text())
  .then(data => {
    document.getElementById('navbar-container').innerHTML = data;

    // After navbar loads, set up mobile menu toggle
    const menuIcon = document.getElementById('mobile-menu-icon');
    const navLinks = document.querySelector('.nav-links');

    if (menuIcon && navLinks) {
      menuIcon.addEventListener('click', () => {
        navLinks.classList.toggle('active');
      });
    }
  });

    // Load footer
    fetch('footer.html')
      .then(res => res.text())
      .then(data => {
        document.getElementById('footer-container').innerHTML = data;
      });
  