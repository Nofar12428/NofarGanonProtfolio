(()=>{
 const mobile=matchMedia('(max-width:800px)'),reduced=matchMedia('(prefers-reduced-motion:reduce)');
 document.querySelectorAll('#sc-mobile .sc-screen-rail,#sc-desktop .sc-desktop-grid').forEach((rail,railIndex)=>{
  const slides=[...rail.children].filter(el=>el.tagName==='FIGURE');if(!slides.length)return;
  rail.id=rail.id||`sc-mobile-rail-${railIndex}`;rail.setAttribute('role','region');rail.setAttribute('aria-label',railIndex?'Desktop product screens':'Mobile product screens');
  const controls=document.createElement('div');controls.className='sc-mobile-controls';controls.setAttribute('role','group');controls.setAttribute('aria-label','Browse product screens');
  const prev=document.createElement('button'),next=document.createElement('button'),counter=document.createElement('span');
  prev.type=next.type='button';prev.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14 6-6 6 6 6"/></svg>';next.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m10 6 6 6-6 6"/></svg>';prev.setAttribute('aria-label','Previous screen');next.setAttribute('aria-label','Next screen');prev.setAttribute('aria-controls',rail.id);next.setAttribute('aria-controls',rail.id);counter.className='sc-mobile-counter';counter.setAttribute('role','status');counter.setAttribute('aria-live','polite');controls.append(prev,counter,next);rail.after(controls);
  let current=0,ticking=false;
  function update(){ticking=false;if(!mobile.matches)return;const r=rail.getBoundingClientRect(),center=r.left+r.width/2;let nearest=0,distance=Infinity;slides.forEach((slide,i)=>{const box=slide.getBoundingClientRect(),diff=Math.abs(box.left+box.width/2-center);if(diff<distance){distance=diff;nearest=i}});if(current!==nearest){slides[current]?.querySelectorAll('video').forEach(video=>video.pause());current=nearest}counter.textContent=`${current+1} / ${slides.length}`;prev.disabled=current===0;next.disabled=current===slides.length-1;}
  function move(index){if(!mobile.matches)return;index=Math.max(0,Math.min(slides.length-1,index));const target=slides[index],left=rail.scrollLeft+target.getBoundingClientRect().left-rail.getBoundingClientRect().left-(rail.clientWidth-target.clientWidth)/2;rail.scrollTo({left,behavior:reduced.matches?'auto':'smooth'});}
  prev.addEventListener('click',()=>move(current-1));next.addEventListener('click',()=>move(current+1));
  rail.addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(update)}},{passive:true});
  rail.addEventListener('keydown',event=>{if(!mobile.matches||event.target.closest('video,button,a'))return;if(event.key==='ArrowRight'){event.preventDefault();move(current+1)}else if(event.key==='ArrowLeft'){event.preventDefault();move(current-1)}});
  function adapt(){if(mobile.matches)rail.tabIndex=0;else rail.removeAttribute('tabindex');requestAnimationFrame(update)}
  new ResizeObserver(adapt).observe(rail);mobile.addEventListener('change',adapt);adapt();
 });
})();
