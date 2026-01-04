// Consolidated main.js for static site usage (No Build Tool)

class Guide {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.x = window.innerWidth - 100;
    this.y = window.innerHeight - 100;
    // Ensure non-zero speed for full screen movement
    this.dx = (Math.random() > 0.5 ? 1 : -1) * (2 + Math.random() * 2);
    this.dy = (Math.random() > 0.5 ? 1 : -1) * (2 + Math.random() * 2);
    this.width = 80;
    this.height = 80;
    this.isHovered = false;

    this.render();
    this.attachScrollListener();
    this.startMovement();

    this.say("Hi! I'm Bubble's! 👋");
    setTimeout(() => {
      this.say("I'm floating around! Catch me if you can!");
    }, 3000);
  }

  render() {
    this.element = document.createElement('div');
    this.element.className = 'bubble-guide';
    this.element.style.position = 'fixed';
    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;

    // Stop moving when hovered
    this.element.addEventListener('mouseenter', () => {
      this.isHovered = true;
      this.element.style.transform = 'scale(1.1)';
    });
    this.element.addEventListener('mouseleave', () => {
      this.isHovered = false;
      this.element.style.transform = 'scale(1)';
    });

    // Bubble's visual body
    this.element.innerHTML = `
      <div class="bubble-speech" id="bubble-speech"></div>
      <div class="bubble-body">
        <div class="bubble-face">
          <div class="eye left"></div>
          <div class="eye right"></div>
          <div class="mouth"></div>
        </div>
      </div>
    `;

    this.container.appendChild(this.element);
    this.style();
  }

  startMovement() {
    const animate = () => {
      if (!this.isHovered) {
        this.x += this.dx;
        this.y += this.dy;

        // Bounce off edges
        if (this.x + this.width > window.innerWidth || this.x < 0) {
          this.dx = -this.dx;
        }
        if (this.y + this.height > window.innerHeight || this.y < 0) {
          this.dy = -this.dy;
        }

        // Keep within bounds helper (in case resizing)
        if (this.x < 0) this.x = 0;
        if (this.y < 0) this.y = 0;
        if (this.x + this.width > window.innerWidth) this.x = window.innerWidth - this.width;
        if (this.y + this.height > window.innerHeight) this.y = window.innerHeight - this.height;

        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
      }
      requestAnimationFrame(animate);
    };
    animate();
  }

  style() {
    // Dynamic styles for Bubble's
    const style = document.createElement('style');
    style.textContent = `
      .bubble-guide {
        width: 80px;
        height: 80px;
        pointer-events: auto;
        cursor: pointer;
        z-index: 1001;
        will-change: left, top;
        transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      }
      
      .bubble-body {
        width: 100%;
        height: 100%;
        background-color: var(--accent, #D7CCC8);
        border-radius: 50%;
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        display: flex;
        justify-content: center;
        align-items: center;
        border: 2px solid var(--text-primary, #5D4037);
      }

      .bubble-face {
        position: relative;
        width: 40px;
        height: 30px;
      }

      .eye {
        position: absolute;
        top: 5px;
        width: 8px;
        height: 8px;
        background-color: var(--text-primary, #5D4037);
        border-radius: 50%;
        animation: blink 4s infinite;
      }

      .eye.left { left: 0; }
      .eye.right { right: 0; }

      .mouth {
        position: absolute;
        bottom: 2px;
        left: 50%;
        transform: translateX(-50%);
        width: 16px;
        height: 8px;
        border-bottom: 2px solid var(--text-primary, #5D4037);
        border-radius: 0 0 16px 16px;
      }

      .bubble-speech {
        position: absolute;
        bottom: 100%;
        left: 50%; /* Center horizontally relative to bubble */
        transform: translateX(-50%) translateY(10px); /* Adjust init transform */
        background-color: var(--white, #fff);
        padding: 8px 12px;
        border-radius: 12px;
        box-shadow: 0 3px 10px rgba(0,0,0,0.1);
        margin-bottom: 10px;
        font-family: var(--font-body, sans-serif);
        font-size: 0.9rem;
        color: var(--text-primary, #5D4037);
        white-space: nowrap;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s ease, transform 0.3s ease;
        pointer-events: none;
      }

      .bubble-speech.visible {
        opacity: 1;
        visibility: visible;
        transform: translateX(-50%) translateY(0);
      }

      .bubble-speech::after {
        content: '';
        position: absolute;
        bottom: -5px;
        left: 50%;
        transform: translateX(-50%);
        border-width: 5px 5px 0;
        border-style: solid;
        border-color: var(--white, #fff) transparent transparent transparent;
      }

      @keyframes blink {
        0%, 90%, 100% { transform: scaleY(1); }
        95% { transform: scaleY(0.1); }
      }
    `;
    document.head.appendChild(style);
  }

  say(text, duration = 4000) {
    const speech = this.element.querySelector('.bubble-speech');
    speech.textContent = text;
    speech.classList.add('visible');

    if (this.speechTimeout) clearTimeout(this.speechTimeout);

    this.speechTimeout = setTimeout(() => {
      speech.classList.remove('visible');
    }, duration);
  }

  attachScrollListener() {
    const sections = document.querySelectorAll('section');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.onEnterSection(entry.target.id);
        }
      });
    }, { threshold: 0.5 }); // Trigger when 50% of section is visible

    sections.forEach(section => observer.observe(section));
  }

  onEnterSection(sectionId) {
    const messages = {
      'hero': "Welcome to my world! ✨",
      'about': "Here's a little about me...",
      'education': "My academic journey! 📚",
      'skills': "Things I'm good at! 💻",
      'experience': "My practical skills! 🛠️",
      'contact': "Let's get in touch! 📞"
    };

    if (messages[sectionId]) {
      this.say(messages[sectionId]);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Bubble's
  const guide = new Guide('guide-container');

  // Scroll Reveal Animation (Simple version)
  const revealElements = document.querySelectorAll('.section, .timeline-item, .skill-card, .contact-item');

  // Add initial opacity 0 to items we want to reveal if not already handled by specific classes
  revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.8s ease-out';
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealElements.forEach(el => revealObserver.observe(el));
});
