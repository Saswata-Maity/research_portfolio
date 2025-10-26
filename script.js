document.addEventListener("DOMContentLoaded", function () {
  // =======================
  // Particles.js
  // =======================
  if (document.getElementById("particles-js")) {
    particlesJS("particles-js", {
      particles: {
        number: { value: 100, density: { enable: true, value_area: 800 } },
        color: { value: "#4db6ac" },
        shape: { type: "circle" },
        opacity: { value: 0.5 },
        size: { value: 3, random: true },
        line_linked: {
          enable: true,
          distance: 150,
          color: "#4db6ac",
          opacity: 0.4,
          width: 1
        },
        move: { enable: true, speed: 2, out_mode: "out" }
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: { enable: true, mode: "repulse" },
          onclick: { enable: true, mode: "push" },
          resize: true
        },
        modes: {
          repulse: { distance: 100, duration: 0.4 },
          push: { particles_nb: 4 }
        }
      },
      retina_detect: true
    });
  }

  // =======================
  // Leaflet map
  // =======================
  const mapEl = document.getElementById("map");
  if (mapEl) {
    const map = L.map("map").setView([22.5726, 88.3639], 4);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    L.marker([22.5726, 88.3639])
      .addTo(map)
      .bindPopup("Kolkata, India")
      .openPopup();
  }

  // =======================
  // Smooth scrolling
  // =======================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // =======================
  // Data for projects
  // =======================
  const projects = [
    {
      title: "MoNuSeg Histopatholgy WSI segmentation",
      description:
        "A simple lightweight traditional U-Net framework designed with Separable CNNs achieving a IOU score of 0.5444 and  Dice score of 0.705 on the MoNuSeg 2018 test data",
      link: "https://github.com/Saswata-Maity/Image_segmentayion_MoNuSeg/blob/main/version1.ipynb"
    },
    {
      title: "Heart Attack Prediction App",
      description:
        "Web app developed using Kaggle dataset to determine if a person has a high or low chance of heart attack.",
      link: "https://heartattackpred-webapp.onrender.com/"
    },
    {
      title: "Crop Disease Prediction",
      description:
        "Web app to classify plant disease type with 99.01% accuracy and 98.65% confidence.",
      link: "https://github.com/Saswata-Maity/crop_disease_pred/blob/main/crop_jupyter_source.ipynb"
    }
  ];

  // =======================
  // Data for certifications
  // =======================
  const certifications = [
    {
    title: "Generative Adversarial Networks (GANs)",
    issuer: "Coursera (By Deeplearning.Ai)",
    date: "October 19, 2025",
    link: "https://coursera.org/share/ec54b65d5908bddac6f27424b3bcbee0"
  },
  {
    title: "Tensorflow:Advanced Techniques Specialization",
    issuer: "Coursera (By Deeplearning.Ai)",
    date: "March 13, 2025",
    link: "https://coursera.org/share/53bca3964224b6f269a88551fb7e86d0"
  },
  {
    title: "Tensorflow Developer",
    issuer: "Coursera (By Deeplearning.Ai)",
    date: "March 10, 2025",
    link: "https://coursera.org/share/b67546723ee35958347a919f7dd768ec"
  },
  {
    title: "Deep Learning Specialization",
    issuer: "Coursera (By Deeplearning.Ai)",
    date: "February 1, 2025",
    link: "https://coursera.org/share/bf183daa93e360a34bcaf1c8399586df"
  },
  {
    title: "Artifcial Intelligence and Data Science",
    issuer: "Jadavpur University,Kolkata",
    date: "May-November, 2024",
    link: "https://drive.google.com/file/d/1g5Xpwro1Xbiv39kKtVewOk6lkTrY-edN/view?usp=sharing"
  },
  {
    title: "Natural Language Processing Specialization",
    issuer: "Coursera (By Deeplearning.Ai)",
    date: "September 23, 2024",
    link: "https://coursera.org/share/299cee37e5651ac14166fdca3dfba271"
  },
  {
    title: "Machine Learning Specialization",
    issuer: "Coursera (By Deeplearning.Ai)",
    date: "April 16, 2024",
    link: "https://coursera.org/share/7cbe07f39b3058ce14938bf56e53449d"
  },
  {
    title: "SQL TOP 50 BADGE (Leet Code)",
    issuer: "LEETCODE",
    date: "April 16, 2024",
    link: "https://leetcode.com/medal/?showImg=0&id=3182394&isLevel=false"
  },
  {
    title: "SQL Intermediate",
    issuer: "HackerRank",
    date: "September 14, 2023",
    link: "https://www.hackerrank.com/certificates/fec12e2f45e5"
  },
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
  }
];


  // =======================
  // Render helpers
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

  // =======================
  // Populate projects & certifications
  // =======================
  const projectsGrid = document.getElementById("projects-grid");
  if (projectsGrid) {
    projectsGrid.innerHTML = projects.map(createProjectItem).join("");
  }

  const certificationsGrid = document.getElementById("certifications-grid");
  if (certificationsGrid) {
    certificationsGrid.innerHTML = certifications
      .map(createCertificationItem)
      .join("");
  }

  // =======================
  // Reviews Section
  // =======================
  const reviewsGrid = document.getElementById("reviews-grid");
  if (reviewsGrid) {
    const addReviewBtn = document.createElement("button");
    addReviewBtn.textContent = "➕ Add Review";
    addReviewBtn.classList.add("btn");
    reviewsGrid.before(addReviewBtn);

    addReviewBtn.addEventListener("click", function () {
      const userId = prompt("Enter Reviewer ID:");
      const userPass = prompt("Enter Password:");

      if (
        userId === "starklabs24" &&
        userPass === "musou_isshin_kaminari_no_mikoto"
      ) {
        window.location.href =
          "https://docs.google.com/forms/d/e/1FAIpQLSdSG2Qcg6XdsNWKlDw9k7D6kYzcVG-pI-JGXdq0_ikfBV2zNA/viewform?usp=sharing";
      } else {
        alert("Invalid credentials. Access denied.");
      }
    });
  }

  // =======================
  // Mobile Menu Toggle
  // =======================
  const menuToggle = document.querySelector(".menu-toggle");
  const mainNav = document.querySelector(".main-nav");

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      mainNav.classList.toggle("show");
    });

    // Close menu when a nav link is clicked
    mainNav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        mainNav.classList.remove("show");
      });
    });
  }
});

const canvas = document.getElementById("nnCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// ---------------- Layer + Node Setup ----------------
const layers = [5, 8, 12, 8, 5]; // number of nodes in each layer
const layerSpacing = canvas.width / (layers.length + 1);
const nodeRadius = 14;

let nodes = [];
let connections = [];
let particles = [];

// Initialize nodes
layers.forEach((count, layerIndex) => {
  const x = (layerIndex + 1) * layerSpacing;
  const spacing = canvas.height / (count + 1);
  for (let i = 0; i < count; i++) {
    const y = (i + 1) * spacing;
    nodes.push({ x, y, layer: layerIndex });
  }
});

// Initialize connections
nodes.forEach((node) => {
  nodes.forEach((target) => {
    if (target.layer === node.layer + 1) {
      connections.push({ from: node, to: target });
    }
  });
});















// ======= CNN Visualization for Home Page =======
if (document.getElementById("nnCanvas")) {

  const canvas = document.getElementById("nnCanvas");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    buildLayout();
  });

  // ---- Layers ----
  let layers = [
    { type:"input", size:8 },
    { type:"conv", maps:3, size:10, depthOffset:24 },
    { type:"conv", maps:2, size:8, depthOffset:20 },
    { type:"conv", maps:2, size:6, depthOffset:16 },
    { type:"flatten", neurons:6 },
    { type:"dense", neurons:4 },
    { type:"dense", neurons:3 },
    { type:"softmax", neurons:2 }
  ];

  let connections=[];

  // ---- Build Layout ----
  function buildLayout(){
    let x = 120;
    const centerY = canvas.height / 2;

    layers.forEach(layer=>{
      if(layer.type==="input"){
        layer.positions=[];
        let totalHeight = layer.size*20;
        let yStart = centerY - totalHeight/2;
        for(let i=0;i<layer.size;i++){
          for(let j=0;j<layer.size;j++){
            layer.positions.push({x:x, y:yStart+i*20, z:j*20});
          }
        }
        x+=200;
      }else if(layer.type==="conv"){
        layer.positions=[];
        let totalHeight = layer.size*20;
        let yStart = centerY - totalHeight/2;
        for(let m=0;m<layer.maps;m++){
          let map=[];
          for(let i=0;i<layer.size;i++){
            for(let j=0;j<layer.size;j++){
              map.push({
                x:x+m*layer.depthOffset,
                y:yStart+i*20,
                z:j*layer.depthOffset
              });
            }
          }
          layer.positions.push(map);
        }
        x+=220;
      }else if(layer.type==="flatten"){
        layer.positions=[];
        let yStart = centerY - (layer.neurons*20)/2;
        for(let i=0;i<layer.neurons;i++){
          layer.positions.push({x:x, y:yStart+i*20});
        }
        x+=180;
      }else{
        layer.positions=[];
        let spacing=canvas.height/(layer.neurons+1);
        for(let i=0;i<layer.neurons;i++){
          layer.positions.push({x:x, y:(i+1)*spacing});
        }
        x+=200;
      }
    });

    // Connections with pruning
    connections=[];
    for(let l=0;l<layers.length-1;l++){
      let srcLayer = layers[l].positions;
      if(Array.isArray(srcLayer[0])) srcLayer = srcLayer.flat();
      let dstLayer = layers[l+1].positions;
      if(Array.isArray(dstLayer[0])) dstLayer = dstLayer.flat();

      srcLayer.forEach(p=>{
        dstLayer.forEach(q=>{
          if(layers[l].type==="input" && layers[l+1].type==="conv"){
            if(Math.random()>0.02) return;
          }
          if(layers[l].type==="conv" && layers[l+1].type==="conv"){
            if(Math.random()>0.02) return;
          }
          connections.push({from:p,to:q});
        });
      });
    }
  }

  buildLayout();

  // ---- Signals ----
  let signals=[];
  function spawnSignal(){
    if (signals.length > 50) return;
    let srcLayer=layers[0].positions[Math.floor(Math.random()*layers[0].positions.length)];
    let path=[];
    for(let l=1;l<layers.length;l++){
      let dstLayer = layers[l].positions;
      let dst;
      if(Array.isArray(dstLayer[0])) dst=dstLayer.flat()[Math.floor(Math.random()*dstLayer.flat().length)];
      else dst=dstLayer[Math.floor(Math.random()*dstLayer.length)];
      path.push({from:srcLayer, to:dst});
      srcLayer = dst;
    }
    signals.push({path:path, progress:0, speed:0.002+Math.random()*0.004});
  }

  setInterval(spawnSignal,1200);

  // ---- Drawing ----
  function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);

    // Draw faint connections
connections.forEach(link=>{
  ctx.strokeStyle="rgba(77,182,255,0.05)"; // super faint blue
  ctx.beginPath();
  ctx.moveTo(link.from.x+(link.from.z? link.from.z*0.3+5:0),
             link.from.y-(link.from.z? link.from.z*0.3:0)+5);
  ctx.lineTo(link.to.x,link.to.y);
  ctx.stroke();
});

// Draw layers
layers.forEach(layer=>{
  if(layer.type==="input"){
    layer.positions.forEach(p=>{
      ctx.fillStyle="rgba(77,182,172,0.3)"; // lighter / semi-transparent
      ctx.fillRect(p.x+p.z*0.2,p.y-p.z*0.2,10,10);
    });
  }else if(layer.type==="conv"){
    layer.positions.forEach(map=>{
      map.forEach(p=>{
        ctx.fillStyle="rgba(77,182,172,0.3)"; // lighter
        ctx.fillRect(p.x+p.z*0.3,p.y-p.z*0.3,14,14);
      });
    });
  }else if(layer.type==="flatten"){
    layer.positions.forEach(p=>{
      ctx.beginPath();
      ctx.arc(p.x,p.y,3,0,Math.PI*2);
      ctx.fillStyle="rgba(51,51,51,0.2)"; // very faint
      ctx.fill();
    });
  }else if(layer.type==="dense" || layer.type==="softmax"){
    layer.positions.forEach((p,i)=>{
      ctx.beginPath();
      ctx.arc(p.x,p.y,12,0,Math.PI*2);
      ctx.fillStyle="rgba(255,255,255,0.1)"; // barely visible
      ctx.fill();
      ctx.strokeStyle="rgba(77,182,172,0.3)"; // light outline
      ctx.lineWidth=2;
      ctx.stroke();

      if(layer.type==="softmax"){
        ctx.fillStyle="rgba(77,182,172,0.3)";
        ctx.font="14px Arial";
        ctx.fillText((i+1), p.x-4, p.y+5);
      }
    });
  }
});


    // Animate signals (big moving dots only)
    signals.forEach(s=>{
      let idx=Math.floor(s.progress*(s.path.length));
      if(idx>=s.path.length) idx=s.path.length-1;
      let link=s.path[idx];
      let t=(s.progress*s.path.length)-idx;

      let fx = link.from.x+(link.from.z? link.from.z*0.3+5:0);
      let fy = link.from.y-(link.from.z? link.from.z*0.3:0)+5;
      let x = fx+(link.to.x-fx)*t;
      let y = fy+(link.to.y-fy)*t;

      ctx.beginPath();
      ctx.arc(x,y,5,0,Math.PI*2); // ← only big dots (radius=5)
      ctx.fillStyle="#4db6ac";
      ctx.fill();

      s.progress+=s.speed;
    });
    signals=signals.filter(s=>s.progress<1);

    requestAnimationFrame(draw);
  }

  draw();

} // end nnCanvas check

