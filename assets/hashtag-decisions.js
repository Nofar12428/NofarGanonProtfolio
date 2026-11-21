(()=>{
const tabs=[...document.querySelectorAll('.ht-decision-tabs [role=tab]')];
const panels=tabs.map(t=>document.getElementById(t.getAttribute('aria-controls')));
let current=tabs.findIndex(t=>t.getAttribute('aria-selected')==='true');
function select(i,focus){
if(i!==current){
 panels.forEach(p=>p.getAnimations().forEach(a=>a.cancel()));
 tabs.forEach((t,j)=>{t.setAttribute('aria-selected',String(i===j));t.tabIndex=i===j?0:-1;panels[j].hidden=i!==j});
 current=i;
 if(!matchMedia('(prefers-reduced-motion: reduce)').matches)panels[i].animate([{opacity:0,transform:'translateY(24px)'},{opacity:1,transform:'translateY(0)'}],{duration:520,easing:'cubic-bezier(.22,1,.36,1)'});
}
if(focus)tabs[i].focus({preventScroll:true});
const rail=tabs[i].parentElement;
if(rail.scrollWidth>rail.clientWidth){
 const tabRect=tabs[i].getBoundingClientRect(),railRect=rail.getBoundingClientRect();
 const delta=tabRect.left<railRect.left?tabRect.left-railRect.left:tabRect.right>railRect.right?tabRect.right-railRect.right:0;
 if(delta)rail.scrollBy({left:delta,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
}
}
tabs.forEach((t,i)=>{t.addEventListener('click',()=>select(i));t.addEventListener('keydown',e=>{let j=i;if(e.key==='ArrowRight')j=(i+1)%tabs.length;else if(e.key==='ArrowLeft')j=(i+tabs.length-1)%tabs.length;else if(e.key==='Home')j=0;else if(e.key==='End')j=tabs.length-1;else return;e.preventDefault();select(j,true)})});
})();
