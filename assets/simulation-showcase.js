(()=>{
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const items=[...document.querySelectorAll('.ad-showcase-reveal')];
 if('IntersectionObserver' in window&&!reduced){const obs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.remove('ad-showcase-pending');obs.unobserve(e.target)}}),{threshold:.12});items.forEach(e=>{e.classList.add('ad-showcase-pending');obs.observe(e)});}
function observePlayback(video,{target=video,ambient=false,sound=false}={}){
 let wanted=false,automaticPause=false,userPaused=false,attempting=false;
 video.removeAttribute('autoplay');video.playsInline=true;video.loop=!sound;
 if(!sound)video.muted=true;
 function prepare(){const source=video.querySelector('source[data-src]');if(source){source.src=source.dataset.src;source.removeAttribute('data-src');video.preload='auto';video.load();}else video.preload='auto';}
 function play(){if(!wanted||document.hidden||userPaused||(video.ended&&!video.loop)||attempting)return;prepare();if(!video.paused)return;attempting=true;video.play().catch(()=>{if(!ambient)video.controls=true;}).finally(()=>{attempting=false;});}
 function pause(){if(!video.paused){automaticPause=true;video.pause();}}
 video.addEventListener('pause',()=>{if(automaticPause)automaticPause=false;else if(wanted&&!ambient)userPaused=true;else if(wanted&&ambient)queueMicrotask(play);});
 video.addEventListener('play',()=>{userPaused=false;});video.addEventListener('canplay',play);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();else play();});
 if('IntersectionObserver'in window){
  const warm=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){prepare();warm.unobserve(target);}}),{rootMargin:'500px 0px'});warm.observe(target);
  const visibility=new IntersectionObserver(entries=>entries.forEach(e=>{if(ambient){wanted=e.isIntersecting;}else if(e.isIntersecting&&e.intersectionRatio>=.12){wanted=true;}else if(!e.isIntersecting){wanted=false;}
   if(wanted)play();else pause();
  }),{threshold:ambient?[0]:[0,.12]});visibility.observe(target);
 }else{wanted=true;play();}
}
const showcase=document.querySelector('.ad-game-showcase');
const background=showcase?.querySelector('.ad-backdrop-video');
if(background&&!reduced)observePlayback(background,{target:showcase,ambient:true});
showcase?.querySelectorAll('.ad-step-video,.ad-trailer-autoplay').forEach(v=>{v.controls=v.classList.contains('ad-trailer-autoplay');observePlayback(v);   /* the trailer starts muted as soon as it is on screen; its controls let people unmute */});
})();
