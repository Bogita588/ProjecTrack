let allProjects = [];

document.addEventListener("DOMContentLoaded", () => {
  fetch('data/projects.json')
    .then(response => response.json())
    .then(data => {
      allProjects = data;
      populateFilters(data);
      displayProjects(data);
    });

  document.getElementById("filter-form").addEventListener("submit", (e) => {
    e.preventDefault();
    applyFilters();
  });
});

function populateFilters(data) {
  const counties = new Set();
  const types = new Set();
  const sectors = new Set();

  data.forEach(project => {
    if (project.county) counties.add(project.county);
    if (project.project_type) types.add(project.project_type);
    if (project.sector) sectors.add(project.sector);
  });

  const countySelect = document.getElementById("filter-county");
  counties.forEach(county => {
    countySelect.innerHTML += `<option value="${county}">${county}</option>`;
  });

  const typeSelect = document.getElementById("filter-type");
  types.forEach(type => {
    typeSelect.innerHTML += `<option value="${type}">${type}</option>`;
  });

  const sectorSelect = document.getElementById("filter-sector");
  sectors.forEach(sector => {
    sectorSelect.innerHTML += `<option value="${sector}">${sector}</option>`;
  });
}

// function displayProjects(projects) {
//   const grid = document.getElementById("projects-grid");
//   grid.innerHTML = "";

//   if (projects.length === 0) {
//     grid.innerHTML = "<p>No projects found.</p>";
//     return;
//   }

//   projects.forEach(project => {
//     const card = document.createElement("div");
//     card.className = "project-card";

//     card.innerHTML = `
//       <h3>${project.project_name}</h3>
//       <div class="status ${project.project_status.toLowerCase().replace(" ", "-")}">
//         ${project.project_status}
//       </div>
//       <p><strong>County:</strong> ${project.county}</p>
//       <p><strong>Type:</strong> ${project.project_type}</p>
//       <p><strong>Sector:</strong> ${project.sector}</p>
//       <p><strong>Cost:</strong> KES ${project.budgeted_amount.toLocaleString()}</p>
//     `;

//     grid.appendChild(card);
//   });
// }

function displayProjects(projects) {
  const grid = document.getElementById("projects-grid");
  grid.innerHTML = "";

  if (projects.length === 0) {
    grid.innerHTML = "<p>No projects found.</p>";
    return;
  }

  projects.forEach(project => {
    const card = document.createElement("div");
    card.className = "project-card";

    // Normalize status for CSS class
    const statusClass = project.project_status.toLowerCase().replace(/\s+/g, "-");

    card.innerHTML = `
      <h3>${project.project_name}</h3>
      <div class="status ${statusClass}">
        ${project.project_status}
      </div>
      <p><strong>County:</strong> ${project.county}</p>
      <p><strong>Type:</strong> ${project.project_type}</p>
      <p><strong>Sector:</strong> ${project.sector}</p>
      <p><strong>Cost:</strong> KES ${project.budgeted_amount.toLocaleString()}</p>
      <a href="projectDetail.html?id=${project.project_id}" class="view-link" >View Details</a>
    `;

    grid.appendChild(card);
  });
}


function applyFilters() {
  const county = document.getElementById("filter-county").value;
  const status = document.getElementById("filter-status").value;
  const type = document.getElementById("filter-type").value;
  const sector = document.getElementById("filter-sector").value;
  const minBudget = parseFloat(document.getElementById("min-budget").value) || 0;
  const maxBudget = parseFloat(document.getElementById("max-budget").value) || Infinity;

  const filtered = allProjects.filter(project =>
    (county === "" || project.county === county) &&
    (status === "" || project.project_status === status) &&
    (type === "" || project.project_type === type) &&
    (sector === "" || project.sector === sector) &&
    project.budgeted_amount >= minBudget &&
    project.budgeted_amount <= maxBudget
  );

  displayProjects(filtered);
}
