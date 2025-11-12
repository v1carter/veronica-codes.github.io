const osPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
if (osPrefersDark) {
  document.documentElement.classList.add("dark-mode");
  document.body.classList.add("dark-mode");
} else {
  document.documentElement.classList.remove("dark-mode");
  document.body.classList.remove("dark-mode");
}

if (window.matchMedia) {
  const match = window.matchMedia('(prefers-color-scheme: dark)');
  autoDarkMode(match.matches);
  match.addEventListener('change', e => {
    autoDarkMode(match.matches);
  });
  function autoDarkMode(state) {
    if (state) {
      document.documentElement.classList.add("dark-mode");
      document.body.classList.add("dark-mode");
    } else {
      document.documentElement.classList.remove("dark-mode");
      document.body.classList.remove("dark-mode");
    }
  }
}

function manualDarkOverride(mode) {
  if (mode === 'dark') {
    document.documentElement.classList.add('dark-mode');
    document.body.classList.add('dark-mode');
  } else if (mode === 'light') {
    document.documentElement.classList.remove('dark-mode');
    document.body.classList.remove('dark-mode');
  }
}

const darkModeToggle = document.getElementById('dark-mode-toggle');
if (darkModeToggle) {
  darkModeToggle.checked = document.body.classList.contains('dark-mode');
  darkModeToggle.addEventListener('change', () => {
    if (darkModeToggle.checked) {
      manualDarkOverride('dark');
    } else {
      manualDarkOverride('light');
    }
    darkModeToggle.checked = document.body.classList.contains('dark-mode');
  });
}

const fun = document.querySelectorAll(".transparent");
fun.forEach(button => {
  button.addEventListener("click", () => {
    confetti({
      particleCount: 200,
      spread: 100,
      origin: { y: 0.6 }
    });
  });
});

function updateTime() {
  const timeElement = document.getElementById('current-time');
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  timeElement.textContent = `${hours}:${minutes} GMT`;
}

setInterval(updateTime, 60000);
updateTime();

function updateYear() {
  const yearElement = document.getElementById('year');
  const currentYear = new Date().getFullYear();
  yearElement.textContent = currentYear;
}

updateYear();

const svg = document.getElementById('boids-svg');
const numBoids = 4;
const boids = [];

function getSvgWidth() {
  return window.innerWidth;
}

class Boid {
  constructor(index) {
    this.index = index;
    const screenWidth = getSvgWidth();
    const boundaryLeft = screenWidth / 2 - 400;
    const boundaryRight = screenWidth / 2 + 400;
    const bikeWidth = 180;
    const spacing = (boundaryRight - boundaryLeft - bikeWidth) / 4;
    this.x = boundaryLeft + bikeWidth / 2 + (index * spacing);
    this.y = 170;
    this.vx = (Math.random() - 0.5) * 0.4 + 0.2;
    this.vy = 0;
    this.isBlue = (index === 1);
    this.element = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    if (this.isBlue) {
      this.element.setAttribute('class', 'plane-blue');
    }
    const image = document.createElementNS('http://www.w3.org/2000/svg', 'image');
    image.setAttribute('href', 'https://res.cloudinary.com/divh0qdsp/image/upload/v1762899405/Untitled_5_lrhcpw.svg');
    image.setAttribute('x', '-90');
    image.setAttribute('y', '-90');
    image.setAttribute('width', '150');
    image.setAttribute('height', '120');
    image.setAttribute('class', 'plane-image');
    this.element.appendChild(image);
    if (index === 0) {
      this.element.setAttribute('class', 'plane-blue');
      const flagFo = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
      flagFo.setAttribute('x', '-70');
      flagFo.setAttribute('y', '-55');
      flagFo.setAttribute('width', '40');
      flagFo.setAttribute('height', '40');
      flagFo.style.cursor = 'pointer';
      const flagIconDiv = document.createElement('div');
      flagIconDiv.style.fontSize = '2rem';
      flagIconDiv.style.color = '#404040';
      flagIconDiv.style.textAlign = 'center';
      flagIconDiv.style.lineHeight = '40px';
      flagIconDiv.style.cursor = 'pointer';
      flagIconDiv.innerHTML = '<i class="fa fa-github"></i>';
      flagIconDiv.addEventListener('click', (e) => {
        e.stopPropagation();
        window.open('https://github.com/v1carter', '_blank');
      });
      flagFo.appendChild(flagIconDiv);
      this.element.appendChild(flagFo);
      this.element.setAttribute('data-link', 'github');
    } else if (index === 1) {
      this.element.setAttribute('class', 'plane-blue');
      const flagFo = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
      flagFo.setAttribute('x', '-70');
      flagFo.setAttribute('y', '-55');
      flagFo.setAttribute('width', '40');
      flagFo.setAttribute('height', '40');
      flagFo.style.cursor = 'pointer';
      const flagIconDiv = document.createElement('div');
      flagIconDiv.style.fontSize = '2rem';
      flagIconDiv.style.color = '#404040';
      flagIconDiv.style.textAlign = 'center';
      flagIconDiv.style.lineHeight = '40px';
      flagIconDiv.style.cursor = 'pointer';
      flagIconDiv.innerHTML = '<i class="fa fa-codepen"></i>';
      flagIconDiv.addEventListener('click', (e) => {
        e.stopPropagation();
        window.open('https://codepen.io/ver_on_ica', '_blank');
      });
      flagFo.appendChild(flagIconDiv);
      this.element.appendChild(flagFo);
      this.element.setAttribute('data-link', 'codepen');
    }
    svg.appendChild(this.element);
  }

  update() {
    const [c1x, c1y] = this.cohesion();
    const [c2x, c2y] = this.separation();
    const [c3x, c3y] = this.alignment();
    this.vx += c1x + c2x + c3x;
    this.vy += c1y + c2y + c3y;
    const constantSpeed = 0.15;
    this.vx = constantSpeed;
    this.vy = 0;
    this.x += this.vx;
    this.y += this.vy;
    const screenWidth = getSvgWidth();
    const bikeWidth = 180;
    const boundaryLeft = screenWidth / 2 - 400;
    const boundaryRight = screenWidth / 2 + 400;
    if (this.x + bikeWidth / 2 > boundaryRight) {
      this.x = boundaryLeft + bikeWidth / 2;
    }
    if (this.x - bikeWidth / 2 < boundaryLeft) {
      this.x = boundaryLeft + bikeWidth / 2;
    }
    this.y = 170;
    this.vy = 0;
    const angle = 0;
    this.element.setAttribute('transform', `translate(${this.x},${this.y}) rotate(${angle})`);
  }

  cohesion() {
    let centerX = 0, centerY = 0;
    let count = 0;
    boids.forEach(other => {
      if (other !== this) {
        centerX += other.x;
        centerY += other.y;
        count++;
      }
    });
    if (count > 0) {
      centerX /= count;
      centerY /= count;
      return [(centerX - this.x) * 0.000001, (centerY - this.y) * 0.000001];
    }
    return [0, 0];
  }

  separation() {
    let moveX = 0, moveY = 0;
    boids.forEach(other => {
      if (other !== this) {
        const dx = this.x - other.x;
        const dy = this.y - other.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const minDistance = 220;
        if (dist < minDistance) {
          moveX += dx / (dist + 1);
          moveY += dy / (dist + 1);
        }
      }
    });
    return [moveX * 0.5, moveY * 0.5];
  }

  alignment() {
    let avgVx = 0, avgVy = 0;
    let count = 0;
    boids.forEach(other => {
      if (other !== this) {
        avgVx += other.vx;
        avgVy += other.vy;
        count++;
      }
    });
    if (count > 0) {
      avgVx /= count;
      avgVy /= count;
      return [(avgVx - this.vx) * 0.05, (avgVy - this.vy) * 0.05];
    }
    return [0, 0];
  }
}

for (let i = 0; i < numBoids; i++) {
  boids.push(new Boid(i));
}

function resolveCollisions() {
  const bikeWidth = 180;
  const minSeparation = bikeWidth - 20;
  for (let i = 0; i < boids.length; i++) {
    for (let j = i + 1; j < boids.length; j++) {
      const a = boids[i];
      const b = boids[j];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 0.0001;
      if (dist < minSeparation) {
        const overlap = (minSeparation - dist) / 2;
        const nx = dx / dist;
        const ny = dy / dist;
        a.x += nx * overlap;
        a.y += ny * overlap;
        b.x -= nx * overlap;
        b.y -= ny * overlap;
        if (a.vx < 0.1) a.vx = 0.1;
        if (b.vx < 0.1) b.vx = 0.1;
        const angleA = 0;
        const angleB = 0;
        a.element.setAttribute('transform', `translate(${a.x},${a.y}) rotate(${angleA})`);
        b.element.setAttribute('transform', `translate(${b.x},${b.y}) rotate(${angleB})`);
      }
    }
  }
}

function updateLogoZIndex() {
  boids.forEach(boid => {
    if (boid.element.getAttribute('data-link')) {
      boid.element.style.zIndex = 2000;
      const fo = boid.element.querySelector('foreignObject');
      if (fo) fo.style.zIndex = 2001;
    } else {
      boid.element.style.zIndex = '';
    }
  });
}

function keepWithinBounds(boid) {
  const screenWidth = getSvgWidth();
  const bikeWidth = 180;
  const boundaryLeft = screenWidth / 2 - 400;
  const boundaryRight = screenWidth / 2 + 400;
  if (boid.x + bikeWidth / 2 > boundaryRight) {
    boid.x = boundaryLeft + bikeWidth / 2;
  }
  if (boid.x - bikeWidth / 2 < boundaryLeft) {
    boid.x = boundaryLeft + bikeWidth / 2;
  }
}

function animate() {
  boids.forEach(boid => boid.update());
  resolveCollisions();
  boids.forEach(boid => {
    keepWithinBounds(boid);
    const angle = 0;
    boid.element.setAttribute('transform', `translate(${boid.x},${boid.y}) rotate(${angle})`);
  });
  updateLogoZIndex();
  requestAnimationFrame(animate);
}

animate();