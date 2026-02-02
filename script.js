// Write JavaScript here
// script.js
(function () {
  const button = document.getElementById('rsvp-button');
  const form = document.getElementById('rsvp-form');
  const submitButton = document.getElementById('rsvp-submit');
  const nameInput = document.getElementById('rsvp-name');
  const dietaryInput = document.getElementById('rsvp-dietary');

  if (!button || !form || !submitButton || !nameInput) return;

  function getQuantities(course) {
    const qtySelects = form.querySelectorAll(`.item-qty[data-course="${course}"]`);
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
    if (nameInput.value.trim().length > 0) {
      submitButton.removeAttribute('hidden');
    } else {
      submitButton.setAttribute('hidden', '');
    }
  }

  nameInput.addEventListener('input', updateSubmitVisibility);

  button.addEventListener('click', function () {
    const isHidden = form.hasAttribute('hidden');
    if (isHidden) {
      form.removeAttribute('hidden');
      form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      form.setAttribute('hidden', '');
    }
  });

  submitButton.addEventListener('click', function () {
    const name = nameInput.value.trim();
    const starterChoices = getQuantities('Starter');
    const mainChoices = getQuantities('Main');
    const dessertChoices = getQuantities('Dessert');
    const dietary = dietaryInput ? dietaryInput.value.trim() : '';

    if (!name) return;

    submitButton.disabled = true;
    submitButton.innerText = "Sending...";

    const payload = {
      name: name,
      starter_choices: starterChoices,
      main_choices: mainChoices,
      dessert_choices: dessertChoices,
      dietary: dietary
    };

    fetch('https://script.google.com/macros/s/AKfycbxWN7JyhVS4SbQG3_bezW577zrM_nGK9qyZ45lGEXL0kTr2-K0WmhJAzO-xjKE9Uly3/exec', {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(payload)
    })
    .then(function() {
  
      // 1. Create the success paragraph
      const successMsg = document.createElement('p');
      successMsg.innerHTML = `<img src="two-birds.jpg" alt="Wedding Illustration" class="form-illustration"><br>
<strong>Thank you, ${name}!<br><br> If you'd like to give a gift <br> To help us on our way. <br> Some cash for our honeymoon <br> Would really make our day!<br> Thank you</strong>`;
      
      // 2. Add some styling via JS
      successMsg.style.color = '#c9a36a'; // Matches your --accent color
      successMsg.style.marginTop = '5rem';
      successMsg.style.marginBottom = '5rem';
      successMsg.style.fontSize = '1.1rem';
      
      // 3. Insert it into the section where the form was
      form.parentNode.appendChild(successMsg);

      // 4. Hide the form and the original RSVP button
      form.setAttribute('hidden', '');
      button.style.display = 'none'; 
      
    })
    .catch(function (error) {
      console.error('[RSVP] Error:', error);
      alert('There was a problem sending your RSVP. Please try again.');
      submitButton.disabled = false;
      submitButton.innerText = "Submit";
    });
  });
})();

// Canvas petals
// -------------
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
    for (let i = 0; i < 1; i++) {
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