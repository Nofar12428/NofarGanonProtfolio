(()=>{
 let frame=0;
 window.NGSimulationFlow={cancel(){cancelAnimationFrame(frame);frame=0;},go(target,offset=0,done=()=>{}){
  if(!target)return;cancelAnimationFrame(frame);const from=scrollY,to=Math.max(0,Math.min(target.getBoundingClientRect().top+from-offset,Math.max(0,document.documentElement.scrollHeight-innerHeight)));
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduced){window.scrollTo({top:to,behavior:'instant'});done();return;}
  const started=performance.now(),duration=850;
  function tick(now){const p=Math.max(0,Math.min(1,(now-started)/duration)),ease=p<.5?4*p*p*p:1-Math.pow(-2*p+2,3)/2;window.scrollTo({top:from+(to-from)*ease,behavior:'instant'});if(p<1)frame=requestAnimationFrame(tick);else{frame=0;done();}}
  frame=requestAnimationFrame(tick);
 }};
})();
