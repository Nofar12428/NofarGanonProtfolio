(()=>{
 const tabs=[...document.querySelectorAll('.ad-decisions [role=tab]')],panels=[...document.querySelectorAll('.ad-decisions [role=tabpanel]')];
 const select=i=>{tabs.forEach((t,j)=>{t.setAttribute('aria-selected',String(i===j));t.tabIndex=i===j?0:-1;panels[j].hidden=i!==j});if(!matchMedia('(prefers-reduced-motion:reduce)').matches)panels[i].animate([{opacity:0,transform:'translateY(22px)'},{opacity:1,transform:'translateY(0)'}],{duration:450,easing:'ease-out'})};
 tabs.forEach((t,i)=>{t.addEventListener('click',()=>select(i));t.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const j=e.key==='Home'?0:e.key==='End'?tabs.length-1:(i+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;select(j);tabs[j].focus()})});
 const details=document.querySelector('#ad-full'),content=details?.querySelector('.ht-full-content'),toc=document.querySelector('.unified-toc');
 if(!details||!content)return;
 const update=()=>{const r=content.getBoundingClientRect();document.body.classList.toggle('ad-process-toc',details.open&&r.top<innerHeight&&r.bottom>150);if(toc){const h=toc.querySelector('.toc-inner').scrollHeight;toc.style.setProperty('--unified-toc-top',Math.min(106,r.bottom-h-24)+'px')}};
 details.addEventListener('toggle',update);addEventListener('scroll',update,{passive:true});addEventListener('resize',update);update();
})();

(()=>{const demo=document.querySelector('.ad-wheel-demo'),wheel=demo?.querySelector('.ad-wheel-image'),input=demo?.querySelector('input'),modes=[...document.querySelectorAll('[data-response]')];if(!demo)return;
 const steer=()=>{wheel.style.transform='rotateY(-12deg) rotateZ('+input.value+'deg)';input.setAttribute('aria-valuetext',input.value+' degrees')};input.addEventListener('input',steer);
 modes.forEach(button=>button.addEventListener('click',()=>{modes.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));demo.classList.toggle('is-delayed',button.dataset.response==='delayed');steer()}));
 if(!matchMedia('(prefers-reduced-motion:reduce)').matches&&'IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){wheel.animate([{opacity:0,transform:'rotateY(-12deg) rotateZ(-10deg) translateY(18px)'},{opacity:1,transform:'rotateY(-12deg) rotateZ(0deg) translateY(0)'}],{duration:650,easing:'cubic-bezier(.23,1,.32,1)'});observer.disconnect()}},{threshold:.3});observer.observe(wheel)}
})();

