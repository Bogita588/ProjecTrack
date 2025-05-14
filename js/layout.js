
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
  

      
  window.addEventListener('DOMContentLoaded', () => {
    const visitedPages = JSON.parse(localStorage.getItem('visitedPages')) || [];

    const currentPage = {
      url: window.location.href,
      title: document.title,
      timestamp: new Date().toISOString()
    };

    // Avoid duplicates (optional)
    const alreadyVisited = visitedPages.some(p => p.url === currentPage.url);
    if (!alreadyVisited) {
      visitedPages.push(currentPage);
      localStorage.setItem('visitedPages', JSON.stringify(visitedPages));
    }
  });

