(()=>{
 const section=document.querySelector('.ht-key-decisions,.lc-key-decisions');
 const carousel=document.querySelector('.unified-projects');
 if(!section||!carousel)return;
 const align=()=>carousel.style.setProperty('--project-heading-inset',getComputedStyle(section).paddingLeft);
 new ResizeObserver(align).observe(section);
 addEventListener('resize',align);
 document.fonts.ready.then(align);
 align();
})();
