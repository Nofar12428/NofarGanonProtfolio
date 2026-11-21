(()=>{
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const rows=[...document.querySelectorAll('.sg-showcase-step-inner,.sg-supplementary-gallery')];
 if('IntersectionObserver' in window&&!reduced){const enter=new IntersectionObserver(entries=>entries.forEach(e=>{if(!e.isIntersecting)return;e.target.animate([{opacity:0,transform:'translateY(40px)'},{opacity:1,transform:'translateY(0)'}],{duration:800,easing:'cubic-bezier(.2,.7,.2,1)'});enter.unobserve(e.target)}),{threshold:.15});rows.forEach(row=>enter.observe(row));}
function observePlayback(video,{target=video,ambient=false,sound=false}={}){
 let wanted=false,automaticPause=false,userPaused=false,attempting=false;
 video.removeAttribute('autoplay');video.playsInline=true;video.loop=!sound;
 if(!sound)video.muted=true;
 function prepare(){const source=video.querySelector('source[data-src]');if(source){source.src=source.dataset.src;source.removeAttribute('data-src');video.preload='auto';video.load();}else video.preload='auto';}
 function play(){if(!wanted||document.hidden||userPaused||(video.ended&&!video.loop)||attempting)return;prepare();if(!video.paused)return;attempting=true;video.play().catch(()=>{if(!ambient)video.controls=true;}).finally(()=>{attempting=false;});}
 function pause(){if(!video.paused){automaticPause=true;video.pause();}}
 video.addEventListener('pause',()=>{if(automaticPause)automaticPause=false;else if(wanted)userPaused=true;});
 video.addEventListener('play',()=>{userPaused=false;});video.addEventListener('canplay',play);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();else play();});
 if('IntersectionObserver'in window){
  const warm=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){prepare();warm.unobserve(target);}}),{rootMargin:'500px 0px'});warm.observe(target);
  const visibility=new IntersectionObserver(entries=>entries.forEach(e=>{if(ambient){wanted=e.isIntersecting;}else if(e.isIntersecting&&e.intersectionRatio>=.12){wanted=true;}else if(!e.isIntersecting){wanted=false;}
   if(wanted)play();else pause();
  }),{threshold:ambient?[0]:[0,.12]});visibility.observe(target);
 }else{wanted=true;play();}
}
document.querySelectorAll('.sg-step-media video').forEach(v=>observePlayback(v));
const brand=document.querySelector('[data-brand-sound]');if(brand){brand.controls=true;brand.muted=false;observePlayback(brand,{sound:true});}
})();
