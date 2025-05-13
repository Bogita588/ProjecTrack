// Function to fetch and process project data
fetch('data/projects.json')
  .then(response => response.json())
  .then(projects => {
    renderStatusChart(projects);
    renderBudgetChart(projects);
    renderCompletionChart(projects);
    renderDelayTrendChart(projects);
    renderRatingChart(projects);
    renderProjectTimeline(projects);
  })
  .catch(error => console.error('Error fetching project data:', error));

// 1. Project Status Distribution Chart
function renderStatusChart(projects) {
  const statusCounts = projects.reduce((acc, project) => {
    acc[project.project_status] = (acc[project.project_status] || 0) + 1;
    return acc;
  }, {});

  const ctx = document.getElementById('statusChart').getContext('2d');
  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: Object.keys(statusCounts),
      datasets: [{
        data: Object.values(statusCounts),
        backgroundColor: ['#27ae60', '#f1c40f', '#e74c3c', '#8e44ad', '#3498db']
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Project Status Distribution'
        },
        legend: {
          position: 'bottom'
        }
      }
    }
  });
}

// 2. Budgeted vs. Actual Expenditure Chart
function renderBudgetChart(projects) {
  const projectNames = projects.map(p => p.project_name);
  const budgetedAmounts = projects.map(p => p.budgeted_amount);
  const actualExpenditures = projects.map(p => p.actual_expenditure);

  const ctx = document.getElementById('budgetChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: projectNames,
      datasets: [
        {
          label: 'Budgeted Amount',
          data: budgetedAmounts,
          backgroundColor: '#2980b9'
        },
        {
          label: 'Actual Expenditure',
          data: actualExpenditures,
          backgroundColor: '#c0392b'
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Budgeted vs. Actual Expenditure'
        },
        legend: {
          position: 'bottom'
        }
      },
      scales: {
        x: {
          ticks: {
            autoSkip: false,
            maxRotation: 90,
            minRotation: 45
          }
        },
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

// 3. County-Level Completion Rates Chart
function renderCompletionChart(projects) {
  const countyData = {};

  projects.forEach(project => {
    const county = project.county;
    if (!countyData[county]) {
      countyData[county] = { total: 0, completed: 0 };
    }
    countyData[county].total += 1;
    if (project.project_status === 'Completed') {
      countyData[county].completed += 1;
    }
  });

  const counties = Object.keys(countyData);
  const completionRates = counties.map(county => {
    const data = countyData[county];
    return ((data.completed / data.total) * 100).toFixed(2);
  });

  const ctx = document.getElementById('completionChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: counties,
      datasets: [{
        label: 'Completion Rate (%)',
        data: completionRates,
        backgroundColor: '#16a085'
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'County-Level Completion Rates'
        },
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100
        }
      }
    }
  });
}

// 4. Delay Trends Over Years Chart
function renderDelayTrendChart(projects) {
  const delayData = {};

  projects.forEach(project => {
    const expectedDate = new Date(project.expected_completion_date);
    const actualDate = project.actual_completion_date ? new Date(project.actual_completion_date) : null;

    if (actualDate && actualDate > expectedDate) {
      const year = expectedDate.getFullYear();
      delayData[year] = (delayData[year] || 0) + 1;
    }
  });

  const years = Object.keys(delayData).sort();
  const delays = years.map(year => delayData[year]);

  const ctx = document.getElementById('delayTrendChart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: years,
      datasets: [{
        label: 'Delayed Projects',
        data: delays,
        borderColor: '#e67e22',
        backgroundColor: 'rgba(230, 126, 34, 0.2)',
        fill: true,
        tension: 0.1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Delay Trends Over Years'
        },
        legend: {
          position: 'bottom'
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

// 5. Community Ratings Distribution Chart
function renderRatingChart(projects) {
  const ratingCounts = {};

  projects.forEach(project => {
    const rating = Math.round(project.community_rating);
    ratingCounts[rating] = (ratingCounts[rating] || 0) + 1;
  });

  const ratings = Object.keys(ratingCounts).sort((a, b) => a - b);
  const counts = ratings.map(rating => ratingCounts[rating]);

  const ctx = document.getElementById('ratingChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ratings,
      datasets: [{
        label: 'Number of Projects',
        data: counts,
        backgroundColor: '#9b59b6'
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Community Ratings Distribution'
        },
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0
          }
        },
        x: {
          title: {
            display: true,
            text: 'Community Rating'
          }
        }
      }
    }
  });
}


// 6. Project Lifecycle Timeline
function renderProjectTimeline(projects) {
  const container = document.getElementById('timelineContainer');
  container.innerHTML = ''; // Clear existing content

  projects.forEach(project => {
    const item = document.createElement('div');
    item.className = 'timeline-item';

    const startDate = new Date(project.start_date);
    const expectedCompletionDate = new Date(project.expected_completion_date);
    const actualCompletionDate = project.actual_completion_date ? new Date(project.actual_completion_date) : null;

    item.innerHTML = `
      <h3>${project.project_name}</h3>
      <p><strong>Start:</strong> ${startDate.toDateString()}</p>
      <p><strong>Expected Completion:</strong> ${expectedCompletionDate.toDateString()}</p>
      <p><strong>Actual Completion:</strong> ${actualCompletionDate ? actualCompletionDate.toDateString() : 'N/A'}</p>
      <p><strong>Status:</strong> ${project.project_status}</p>
    `;

    container.appendChild(item);
  });
}

