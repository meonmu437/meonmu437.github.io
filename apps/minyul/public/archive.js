const toggle=document.getElementById('theme-toggle');
function applyTheme(dark){document.documentElement.dataset.theme=dark?'dark':'light';toggle.setAttribute('aria-pressed',String(dark));toggle.textContent=dark?'낮의 기록':'밤의 기록';toggle.setAttribute('aria-label',dark?'밝은 테마로 전환':'어두운 테마로 전환');}
let saved;try{saved=localStorage.getItem('minyul-theme');}catch{}
applyTheme(saved==='dark');
toggle.addEventListener('click',()=>{const dark=document.documentElement.dataset.theme!=='dark';applyTheme(dark);try{localStorage.setItem('minyul-theme',dark?'dark':'light');}catch{}});
const dialog=document.getElementById('image-dialog'),image=document.getElementById('large-image');
document.querySelectorAll('[data-image]').forEach(button=>button.addEventListener('click',()=>{image.src=button.dataset.image;image.alt=button.dataset.alt;dialog.showModal();}));
document.getElementById('close-image').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
dialog.addEventListener('close',()=>{if(!dialog.open)image.removeAttribute('src');});
document.addEventListener('click',event=>document.querySelectorAll('.site-switch[open]').forEach(menu=>{if(!menu.contains(event.target))menu.open=false;}));
document.addEventListener('keydown',event=>{if(event.key==='Escape')document.querySelectorAll('.site-switch[open]').forEach(menu=>menu.open=false);});
// 헤더 목차와 펼친 목록이 같은 현재 위치를 표시하도록 동기화한다.
const sections=[...document.querySelectorAll('.cover[id],.chapter[id],#sec-ghosts')];
const sectionIds=new Set(sections.map(section=>section.id));
const links=[...document.querySelectorAll('nav a[href*="#"],#starlight__sidebar a[href*="#"]')].filter(link=>sectionIds.has(link.hash.slice(1)));
let activeSection='';
function syncCurrentSection(){
 if(!sections.length)return;
 const header=document.querySelector('header.header');
 const marker=Math.max(200,(header?.getBoundingClientRect().bottom||74)+Math.min(100,innerHeight*.12));
 let current=sections[0];
 for(const section of sections){if(section.getBoundingClientRect().top<=marker)current=section;}
 if(window.scrollY>0&&window.scrollY+innerHeight>=document.documentElement.scrollHeight-3)current=sections.at(-1);
 if(activeSection===current.id)return;
 activeSection=current.id;
 links.forEach(link=>{
  const active=link.hash==='#'+current.id;
  link.classList.toggle('my-sidebar-active',active);
  link.classList.toggle('jl-sidebar-active',active);
  if(active)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');
 });
 const label=document.getElementById('jl-toggle-current');
 const heading=current.querySelector('.book-chapter-title small, #field-briefing-title');
 if(label)label.textContent=links.find(link=>link.hash==='#'+current.id)?.textContent.trim()||heading?.textContent.trim()||'도성야화';
}
let scrollTick=false;
function queueSectionSync(){if(scrollTick)return;scrollTick=true;requestAnimationFrame(()=>{scrollTick=false;syncCurrentSection();});}
window.addEventListener('scroll',queueSectionSync,{passive:true});
window.addEventListener('resize',queueSectionSync);
window.addEventListener('load',queueSectionSync);
window.addEventListener('hashchange',queueSectionSync);
new ResizeObserver(queueSectionSync).observe(document.querySelector('.my-content')||document.body);
syncCurrentSection();

async function revealOnScroll(){
 if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 try{await document.fonts.ready;}catch{}
 if(location.hash){const target=document.getElementById(decodeURIComponent(location.hash.slice(1)));target?.scrollIntoView({behavior:'instant'});}
 const reveals=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add('is-visible');reveals.unobserve(entry.target);}},{rootMargin:'0px 0px -15% 0px',threshold:0});
 const elements=document.querySelectorAll('.chapter-heading,.fox-tale,.fox-frontispiece,.dialogue,.personal-effects,.handling-cautions,.field-notes>article,.sealed-note,.world-note,.office-copy,.office-map,.room-list>article,.company-memo,.ghost-intro,.ghost-verse,.ghost-footnote,.chronicle-entry,.coworker,.brother,.request>h2,.request>.request-line,.request-slips,.last-note');
 for(const element of elements){
  if(element.getBoundingClientRect().top<window.innerHeight*.85)continue;
  element.classList.add('my-reveal');reveals.observe(element);
 }
}
if(document.readyState==='complete')revealOnScroll();else window.addEventListener('load',revealOnScroll,{once:true});
