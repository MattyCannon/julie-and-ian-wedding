// Write JavaScript here
// script.js
(function () {
  const button = document.getElementById('rsvp-button');
  const form = document.getElementById('rsvp-form');
  const submitButton = document.getElementById('rsvp-submit');
  const nameInput = document.getElementById('rsvp-name');
  const dietaryInput = document.getElementById('rsvp-dietary');

  if (!button || !form || !submitButton || !nameInput) return;

  const comingInputs = form.querySelectorAll('input[name="coming"]');

  // Helper to compile choices into a readable string
  function getQuantities() {
    const qtySelects = form.querySelectorAll('.item-qty');
    let summary = [];
    
    qtySelects.forEach(select => {
      const val = parseInt(select.value);
      if (val > 0) {
        const itemName = select.getAttribute('data-item');
        summary.push(`${val} x ${itemName}`);
      }
    });
    
    return summary.join(', ');
  }

  function updateSubmitVisibility() {
    const comingSelected = form.querySelector('input[name="coming"]:checked');
    const nameFilled = nameInput.value.trim().length > 0;
    if (comingSelected && nameFilled) {
      submitButton.removeAttribute('hidden');
    } else {
      submitButton.setAttribute('hidden', '');
    }
  }

  comingInputs.forEach(input => input.addEventListener('change', updateSubmitVisibility));
  nameInput.addEventListener('input', updateSubmitVisibility);

  button.addEventListener('click', function () {
    form.hasAttribute('hidden') ? form.removeAttribute('hidden') : form.setAttribute('hidden', '');
    if (!form.hasAttribute('hidden')) form.scrollIntoView({ behavior: 'smooth' });
  });

  submitButton.addEventListener('click', function () {
    const comingSelected = form.querySelector('input[name="coming"]:checked');
    const name = nameInput.value.trim();
    const allChoices = getQuantities(); // This gets all Starters, Mains, and Desserts
    const dietary = dietaryInput ? dietaryInput.value.trim() : '';

    submitButton.disabled = true;
    submitButton.innerText = "Sending...";

    const payload = {
      coming: comingSelected.value,
      name: name,
      choices: allChoices, // Sent as one string: "2 x Soup, 1 x Salmon, 3 x Torte"
      dietary: dietary
    };

    fetch('https://script.google.com/macros/s/AKfycbzSQhSpJTAUZhre1nM06P-4E8KldQJUuBzBEDxupPNkM-ecUkHRhc0woXSKkM1hiQSV/exec', {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(payload)
    })
    .then(() => {
      alert('Thank you for your RSVP, ' + name + '!');
      form.setAttribute('hidden', '');
      button.innerText = "RSVP Sent!";
      button.disabled = true;
    })
    .catch(error => {
      console.error('[RSVP] Error:', error);
      submitButton.disabled = false;
      submitButton.innerText = "Submit";
    });
  });
})();

const canvas = document.getElementById('blossomCanvas');
const ctx = canvas.getContext('2d');
const treeElement = document.getElementById('cherry-tree');

let petals = [];

// Match canvas size to window size
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

class Petal {
    constructor(startX, startY) {
        this.x = startX + (Math.random() * 100 - 50); // Spawn near tree center
        this.y = startY ;
        this.size = Math.random() * 8 + 3;
        this.speedY = Math.random() * 1.0 + 1;
        this.speedX = Math.random() * 3 - 1;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 1.5;
        this.opacity = 0.6;
    }

    update() {
        this.y += this.speedY;
        this.x += this.speedX + Math.sin(this.y / 40) * 0.5; // Sway motion
        this.rotation += this.rotationSpeed;
        
        // Start fading out as they hit the bottom
        if (this.y > canvas.height * 0.8) {
            this.opacity -= 0.01;
        }
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation * Math.PI / 180);
        ctx.beginPath();
        // A simple petal shape
        ctx.ellipse(0, 0, this.size, this.size / 1.5, 0, 0, 2 * Math.PI);
        ctx.fillStyle = `rgba(255, 192, 203, ${this.opacity})`;
        ctx.fill();
        ctx.restore();
    }
}

// Event: Create petals on scroll
window.addEventListener('scroll', () => {
    const rect = treeElement.getBoundingClientRect();
    const treeCenterX = rect.left + rect.width / 2;
    const treeCenterY = rect.top + rect.height / 2;

    // Create 5 petals for every scroll "tick"
    for (let i = 0; i < 5; i++) {
        petals.push(new Petal(treeCenterX, treeCenterY));
    }
});

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = petals.length - 1; i >= 0; i--) {
        petals[i].update();
        petals[i].draw();

        // Clean up memory
        if (petals[i].opacity <= 0 || petals[i].y > canvas.height) {
            petals.splice(i, 1);
        }
    }
    requestAnimationFrame(animate);
}

animate();