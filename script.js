const menuButton = document.querySelector('.menu-button');
const navLinks = document.querySelector('.nav-links');
const nav = document.querySelector('.glass-nav');
const cursorGlow = document.querySelector('.cursor-glow');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

function closeMenu() {
  navLinks?.classList.remove('open');
  menuButton?.classList.remove('open');
  menuButton?.setAttribute('aria-expanded', 'false');
}

menuButton?.addEventListener('click', () => {
  const open = !navLinks.classList.contains('open');
  navLinks.classList.toggle('open', open);
  menuButton.classList.toggle('open', open);
  menuButton.setAttribute('aria-expanded', String(open));
});

document.querySelectorAll('.nav-links a').forEach(link => link.addEventListener('click', closeMenu));

window.addEventListener('scroll', () => {
  nav?.classList.toggle('scrolled', window.scrollY > 24);
}, { passive: true });

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -4% 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

if (!reduceMotion && canHover) {
  window.addEventListener('pointermove', (event) => {
    if (cursorGlow) {
      cursorGlow.style.left = event.clientX + 'px';
      cursorGlow.style.top = event.clientY + 'px';
      cursorGlow.style.opacity = '1';
    }

    const x = (event.clientX / window.innerWidth - 0.5) * 18;
    const y = (event.clientY / window.innerHeight - 0.5) * 18;
    document.querySelector('.orb-one')?.style.setProperty('transform', `translate3d(${x}px, ${y}px, 0)`);
    document.querySelector('.orb-two')?.style.setProperty('transform', `translate3d(${-x * .8}px, ${-y * .8}px, 0)`);
    document.querySelector('.orb-three')?.style.setProperty('transform', `translate3d(${x * .45}px, ${-y * .45}px, 0)`);
  }, { passive: true });

  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      const ry = (px - .5) * 5.5;
      const rx = (.5 - py) * 5.5;
      card.style.transform = `perspective(1100px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-2px)`;

      const shine = card.querySelector('.glass-shine');
      if (shine) {
        shine.style.setProperty('--mx', (px * 100) + '%');
        shine.style.setProperty('--my', (py * 100) + '%');
      }
    });
    card.addEventListener('pointerleave', () => {
      card.style.transform = '';
    });
  });

  document.querySelectorAll('.magnetic').forEach(el => {
    el.addEventListener('pointermove', (event) => {
      const rect = el.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * .08}px, ${y * .08}px)`;
    });
    el.addEventListener('pointerleave', () => {
      el.style.transform = '';
    });
  });
}

window.addEventListener('resize', () => {
  if (window.innerWidth > 760) closeMenu();
});

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();