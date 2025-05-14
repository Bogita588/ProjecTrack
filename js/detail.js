document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const projectId = urlParams.get("id");

  if (!projectId) {
    document.getElementById("project-title").textContent = "Project not found.";
    return;
  }

  fetch("data/projects.json")
    .then((response) => response.json())
    .then((data) => {
      const project = data.find((p) => p.project_id === projectId);
      if (!project) {
        document.getElementById("project-title").textContent = "Project not found.";
        return;
      }
  

      displayProjectDetails(project);
      displayTimeline(project);
      displayBudgetChart(project);
      displayIssues(project);
      displayResolutions(project);
      // displayRelatedProjects(data, project);
    })
    .catch((error) => {
      console.error("Error fetching project data:", error);
    });

  document.getElementById("submit-feedback").addEventListener("click", () => {
    const rating = document.getElementById("rating").value;
    const comment = document.getElementById("comment").value;
    const feedback = { rating, comment };
    localStorage.setItem(`feedback_${projectId}`, JSON.stringify(feedback));
    document.getElementById("feedback-message").textContent = "Feedback submitted. Thank you!";
  });
});

function displayProjectDetails(project) {
  document.getElementById("project-title").textContent = project.project_name;
  const statusBadge = document.getElementById("project-status");
  statusBadge.textContent = project.project_status;
  statusBadge.className = `status-badge ${project.project_status.toLowerCase().replace(" ", "-")}`;

  document.getElementById("project-county").textContent = project.county;
  document.getElementById("project-sector").textContent = project.sector;
  document.getElementById("project-type").textContent = project.project_type;
  document.getElementById("project-start").textContent = project.start_date;
  document.getElementById("project-expected-end").textContent = project.expected_completion_date;
  document.getElementById("project-actual-end").textContent = project.actual_completion_date || "N/A";
  document.getElementById("project-budgeted").textContent = project.budgeted_amount.toLocaleString();
  document.getElementById("project-actual").textContent = project.actual_expenditure.toLocaleString();
  document.getElementById("project-contract").textContent = project.contract_value.toLocaleString();
  document.getElementById("project-funding").textContent = project.funding_source;
  document.getElementById("project-contractor").textContent = project.contractor_name;
  document.getElementById("project-procurement").textContent = project.procurement_method;
  document.getElementById("project-supervising").textContent = project.supervising_authority;
  document.getElementById("project-compliance").textContent = project.compliance_status;
  document.getElementById("project-visits").textContent = project.site_visits;
  document.getElementById("project-participation").textContent = project.public_participation ? "Yes" : "No";
  document.getElementById("project-rating").textContent = project.community_rating;
  document.getElementById("project-complaints").textContent = project.complaints_logged;
  document.getElementById("project-feedback-channel").textContent = project.feedback_channel;
}

function displayTimeline(project) {
  const timelineContainer = document.getElementById("timeline-container");
  timelineContainer.innerHTML = ""; // Clear any existing content

  const milestones = [
    { label: "Start Date", date: project.start_date },
    { label: "Expected Completion", date: project.expected_completion_date },
    { label: "Actual Completion", date: project.actual_completion_date },
  ];

  milestones.forEach((milestone) => {
    if (milestone.date) {
      const item = document.createElement("div");
      item.className = "timeline-item";
      item.innerHTML = `<strong>${milestone.label}:</strong> ${milestone.date}`;
      timelineContainer.appendChild(item);
    }
  });
}


function displayBudgetChart(project) {
  const ctx = document.getElementById("budget-chart").getContext("2d");

  // Destroy any existing chart to avoid duplicates if re-rendering
  if (window.budgetChart) {
    window.budgetChart.destroy();
  }

  window.budgetChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Budgeted Amount", "Actual Expenditure"],
      datasets: [{
        label: "Amount in KES",
        data: [project.budgeted_amount, project.actual_expenditure],
        backgroundColor: ["#4CAF50", "#FF5252"]
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      },
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: true,
          text: "Budget vs Expenditure"
        }
      }
    }
  });
}

function displayIssues(project) {
  console.log("Project Issues:", project.issues_identified); // ← DEBUG HERE
  const issuesList = document.getElementById("issues-list");
  issuesList.innerHTML = "";

  if (project.issues_identified && project.issues_identified.length > 0) {
    project.issues_identified.forEach((issue) => {
      const li = document.createElement("li");
      li.textContent = issue;
      issuesList.appendChild(li);
    });
  } else {
    issuesList.innerHTML = "<li>No issues reported.</li>";
  }
}



function displayResolutions(project) {
  const resolutionsList = document.getElementById("resolutions-list");
  resolutionsList.innerHTML = "";

  if (project.resolution_actions && project.resolution_actions.length > 0) {
    project.resolution_actions.forEach((action) => {
      const li = document.createElement("li");
      li.textContent = action;
      resolutionsList.appendChild(li);
    });
  } else {
    resolutionsList.innerHTML = "<li>No resolutions recorded.</li>";
  }
}

document.getElementById('submit-feedback').addEventListener('click', function () {
  const rating = document.getElementById('rating').value;
  const comment = document.getElementById('comment').value;
  const message = document.getElementById('feedback-message');
  const list = document.getElementById('feedback-list');

  // Simple validation
  if (!rating || !comment) {
    message.textContent = 'Please fill out both fields.';
    message.style.color = 'red';
    return;
  }

  // Clear message
  message.textContent = '';

  // Create feedback card
  const feedbackItem = document.createElement('div');
  feedbackItem.classList.add('feedback-item');
  feedbackItem.innerHTML = `
    <p><strong>Rating:</strong> ${rating} / 5</p>
    <p>${comment}</p>
  `;

  // Append to feedback list
  list.prepend(feedbackItem);

  // Clear form
  document.getElementById('rating').value = '';
  document.getElementById('comment').value = '';

  message.textContent = 'Feedback submitted!';
  message.style.color = 'green';
});


