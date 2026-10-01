const menuButton=document.querySelector('.menu-button');
const navLinks=document.querySelector('.nav-links');
const nav=document.querySelector('.glass-nav');
const cursorGlow=document.querySelector('.cursor-glow');
const progress=document.querySelector('.scroll-progress i');
const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
const canHover=matchMedia('(hover: hover) and (pointer: fine)').matches;

function closeMenu(){navLinks?.classList.remove('open');menuButton?.classList.remove('open');menuButton?.setAttribute('aria-expanded','false')}
menuButton?.addEventListener('click',()=>{const open=!navLinks.classList.contains('open');navLinks.classList.toggle('open',open);menuButton.classList.toggle('open',open);menuButton.setAttribute('aria-expanded',String(open))});
document.querySelectorAll('.nav-links a').forEach(a=>a.addEventListener('click',closeMenu));

function onScroll(){
  const y=scrollY;
  nav?.classList.toggle('scrolled',y>24);
  const max=document.documentElement.scrollHeight-innerHeight;
  if(progress)progress.style.width=(max>0?Math.min(100,y/max*100):0)+'%';
}
addEventListener('scroll',onScroll,{passive:true});onScroll();

const ro=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(entry.isIntersecting){entry.target.classList.add('visible');ro.unobserve(entry.target)}
}),{threshold:.12,rootMargin:'0px 0px -4% 0px'});
document.querySelectorAll('.reveal').forEach(el=>ro.observe(el));

if(!reduceMotion&&canHover){
  addEventListener('pointermove',e=>{
    if(cursorGlow){cursorGlow.style.left=e.clientX+'px';cursorGlow.style.top=e.clientY+'px';cursorGlow.style.opacity='1'}
    const x=(e.clientX/innerWidth-.5)*18,y=(e.clientY/innerHeight-.5)*18;
    document.querySelector('.orb-a')?.style.setProperty('transform',`translate3d(${x}px,${y}px,0)`);
    document.querySelector('.orb-b')?.style.setProperty('transform',`translate3d(${-x*.8}px,${-y*.8}px,0)`);
    document.querySelector('.orb-c')?.style.setProperty('transform',`translate3d(${x*.45}px,${-y*.45}px,0)`);
  },{passive:true});

  document.querySelectorAll('.tilt-card').forEach(card=>{
    card.addEventListener('pointermove',e=>{
      const r=card.getBoundingClientRect(),px=(e.clientX-r.left)/r.width,py=(e.clientY-r.top)/r.height;
      card.style.transform=`perspective(1100px) rotateX(${(.5-py)*5.5}deg) rotateY(${(px-.5)*5.5}deg) translateY(-2px)`;
      const shine=card.querySelector('.glass-shine');
      if(shine){shine.style.setProperty('--mx',px*100+'%');shine.style.setProperty('--my',py*100+'%')}
    });
    card.addEventListener('pointerleave',()=>card.style.transform='')
  });

  document.querySelectorAll('.magnetic').forEach(el=>{
    el.addEventListener('pointermove',e=>{
      const r=el.getBoundingClientRect(),x=e.clientX-r.left-r.width/2,y=e.clientY-r.top-r.height/2;
      el.style.transform=`translate(${x*.08}px,${y*.08}px)`
    });
    el.addEventListener('pointerleave',()=>el.style.transform='')
  });
}

document.querySelectorAll('a,button').forEach(el=>{
  el.addEventListener('pointerdown',()=>el.style.opacity='.9');
  el.addEventListener('pointerup',()=>el.style.opacity='');
  el.addEventListener('pointercancel',()=>el.style.opacity='')
});

addEventListener('resize',()=>{if(innerWidth>760)closeMenu()});
document.getElementById('year').textContent=new Date().getFullYear();
window.addEventListener('pageshow',()=>onScroll());
