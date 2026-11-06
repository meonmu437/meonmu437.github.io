// Keep the original paragraphs readable if scripting or animation is unavailable.
async function prepareInkText(){
 if(matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.classList.remove('ink-text-booting');return;}
 try{await document.fonts.ready;}catch{}

 const soak=new IntersectionObserver(entries=>{
  let stagger=0;
  for(const entry of entries.filter(item=>item.isIntersecting).sort((a,b)=>a.boundingClientRect.top-b.boundingClientRect.top)){
   entry.target.style.setProperty('--ink-delay',`${stagger}ms`);
   entry.target.classList.add('ink-arriving');
   soak.unobserve(entry.target);
   stagger+=560;
  }
 },{rootMargin:'0px 0px -10% 0px',threshold:0});
 for(const paragraph of document.querySelectorAll('.intro-prose>p')){
  if(paragraph.getBoundingClientRect().bottom<0)continue;
  paragraph.classList.add('ink-awaiting');
  soak.observe(paragraph);
 }

 document.documentElement.classList.remove('ink-text-booting');
}
if(document.readyState==='complete')prepareInkText();else addEventListener('load',prepareInkText,{once:true});
