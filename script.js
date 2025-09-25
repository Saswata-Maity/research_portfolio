document.addEventListener("DOMContentLoaded", function() {
  // =======================
  // Particles.js
  // =======================
  particlesJS("particles-js", {
    particles: {
      number: { value: 80, density: { enable: true, value_area: 800 } },
      color: { value: "#4db6ac" },
      shape: { type: "circle" },
      opacity: { value: 0.5, random: false },
      size: { value: 3, random: true },
      line_linked: {
        enable: true,
        distance: 150,
        color: "#4db6ac",
        opacity: 0.4,
        width: 1
      },
      move: { enable: true, speed: 2, direction: "none", random: false, straight: false, out_mode: "out", bounce: false }
    },
    interactivity: {
      detect_on: "canvas",
      events: { onhover: { enable: true, mode: "repulse" }, onclick: { enable: true, mode: "push" }, resize: true },
      modes: { repulse: { distance: 100, duration: 0.4 }, push: { particles_nb: 4 } }
    },
    retina_detect: true
  });

  // =======================
  // Leaflet map
  // =======================
  var map = L.map('map').setView([22.5726, 88.3639], 4);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
  L.marker([22.5726, 88.3639]).addTo(map)
    .bindPopup('Kolkata, India')
    .openPopup();

  // =======================
  // Smooth scrolling
  // =======================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      let target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // =======================
  // Data for projects
  // =======================
  const projects = [
    {
      title: "Dynamic Flight Pricing",
      description: "Processed 500 synthetic data for flight booking and user records, optimizing Decision Tree Regressor with 99.97% accuracy.",
      link: "https://github.com/saswata-maity/Dynamic-Flight-Pricing"
    },
    {
      title: "Credit Card Fraud Analysis",
      description: "Detailed analysis of fraudulent transactions by credit card for corresponding companies using MySQL.",
      link: "https://github.com/Saswata-Maity/fraud-transactions"
    },
    {
      title: "Heart Attack Prediction App",
      description: "Web app developed using Kaggle dataset to determine if a person has a high or low chance of heart attack.",
      link: "https://heartattackpred-webapp.onrender.com/"
    },
    {
      title: "Crop Disease Prediction",
      description: "Web app to classify plant disease type with 99.01% accuracy and 98.65% confidence. Used a separable convolutional self-built architecture for identifying complex patterns.",
      link: "https://crop-disease-prediction-1kel.onrender.com/"
    }
  ];

  // =======================
  // Data for certifications
  // =======================
  const certifications = [
    {
      title: "Google Data Analytics",
      issuer: "Coursera",
      date: "November 13, 2023",
      link: "https://coursera.org/share/2bfddd8df47a60e1fe600e07e707e2eb"
    },
    {
      title: "Google IT Crash Course on Python",
      issuer: "Coursera",
      date: "June 6, 2023",
      link: "https://coursera.org/share/7c205309f91a772e9eb30045ebfa8197"
    },
    {
      title: "SQL Intermediate",
      issuer: "HackerRank",
      date: "September 14, 2023",
      link: "https://www.hackerrank.com/certificates/fec12e2f45e5"
    },
    {
      title: "SQL TOP 50 BADGE (Leet Code)",
      issuer: "LEETCODE",
      date: "April 16, 2024",
      link: "https://leetcode.com/medal/?showImg=0&id=3182394&isLevel=false"
    },
    {
      title: "Machine Learning Specialization",
      issuer: "Coursera (By Deeplearning.Ai)",
      date: "April 16, 2024",
      link: "https://coursera.org/share/7cbe07f39b3058ce14938bf56e53449d"
    },
    {
      title: "Deep Learning Specialization",
      issuer: "Coursera (By Deeplearning.Ai)",
      date: "February 1, 2025",
      link: "https://coursera.org/share/bf183daa93e360a34bcaf1c8399586df"
    },
    {
      title: "Tensorflow Developer",
      issuer: "Coursera (By Deeplearning.Ai)",
      date: "March 10, 2025",
      link: "https://coursera.org/share/b67546723ee35958347a919f7dd768ec"
    }
  ];

  // =======================
  // Functions to render items
  // =======================
  function createProjectItem(project) {
    return `
      <div class="website-item">
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <a href="${project.link}" class="btn" target="_blank">View Project</a>
      </div>
    `;
  }

  function createCertificationItem(cert) {
    return `
      <div class="cert-item">
        <h3>${cert.title}</h3>
        <p>${cert.issuer} - ${cert.date}</p>
        <a href="${cert.link}" class="btn" target="_blank">View Certificate</a>
      </div>
    `;
  }

  function createReviewItem(review) {
    return `
      <div class="review-item">
        <p><strong>${review.name}</strong>: ${review.comment}</p>
      </div>
    `;
  }

  // =======================
  // Populate projects & certifications
  // =======================
  const projectsGrid = document.getElementById('projects-grid');
  if (projectsGrid) {
    projectsGrid.innerHTML = projects.map(createProjectItem).join('');
  }
  const certificationsGrid = document.getElementById('certifications-grid');
  if (certificationsGrid) {
    certificationsGrid.innerHTML = certifications.map(createCertificationItem).join('');
  }

  // =======================
  // Reviews Section
  // =======================
  const reviewsGrid = document.getElementById('reviews-grid');
  const addReviewBtn = document.createElement('button');
  addReviewBtn.textContent = "➕ Add Review";
  addReviewBtn.classList.add("btn");
  if (reviewsGrid) {
    reviewsGrid.before(addReviewBtn);
  }

  addReviewBtn.addEventListener("click", function() {
    const userId = prompt("Enter Reviewer ID:");
    const userPass = prompt("Enter Password:");

    // Replace with your actual credentials
    if (userId === "reviewer" && userPass === "1234") {
      // Redirect to Google Form
      window.open("YOUR_GOOGLE_FORM_LINK_HERE", "_blank");
    } else {
      alert("Invalid credentials. Access denied.");
    }
  });

  // =======================
  // Fetch reviews from Google Sheet (published as CSV/JSON)
  // =======================
  async function fetchReviews() {
    try {
      // Example URL: publish your Google Sheet (File > Publish to web > CSV link)
      const sheetURL = "https://docs.google.com/forms/d/e/1FAIpQLSdSG2Qcg6XdsNWKlDw9k7D6kYzcVG-pI-JGXdq0_ikfBV2zNA/viewform?usp=header";
      const response = await fetch(sheetURL);
      const text = await response.text();

      // Assuming CSV format, parse rows
      const rows = text.split("\n").slice(1); // skip header
      const reviews = rows.map(r => {
        const cols = r.split(",");
        return { name: cols[0], comment: cols[1] }; // adjust to your sheet structure
      });

      if (reviewsGrid) {
        reviewsGrid.innerHTML = reviews.map(createReviewItem).join('');
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  }

  fetchReviews();
});
