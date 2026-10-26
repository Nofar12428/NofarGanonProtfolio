(()=>{
 const first=document.querySelector('.sg-mission-transition'),chat=document.querySelector('.sg-story-scene'),second=document.querySelector('.sg-begin-mission'),game=document.querySelector('.sg-gallery-reveal');
 if(!first||!chat||!second||!game)return;
 const reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;
 const groups=[first,second].map((section,i)=>({section,lines:[...section.querySelectorAll(i?'.sg-begin-text':'.sg-type-text')],started:false,done:false}));
 groups.forEach(g=>{g.sentences=g.lines.map(l=>l.textContent);if(!reduced)g.lines.forEach(l=>l.textContent='')});
 let moving=false,typing=false,chatReady=false,lastY=scrollY,touchY=null,skipped=false;
 document.addEventListener('ng-project-skip',()=>{skipped=true;moving=false;typing=false;chatReady=false;groups.forEach(g=>{g.started=true;g.done=true;g.lines.forEach((line,i)=>{line.textContent=g.sentences[i];line.classList.remove('is-typing')});g.section.classList.remove('is-typing');g.section.classList.add('is-complete')});chat.classList.add('is-conversation-visible');});
 function go(el,done){moving=true;const start=scrollY,end=scrollY+el.getBoundingClientRect().top-80,duration=reduced?0:800,t0=performance.now();
  function step(now){if(skipped)return;const t=duration?Math.min(1,(now-t0)/duration):1;const eased=t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;scrollTo({top:start+(end-start)*eased,behavior:'instant'});if(t<1)requestAnimationFrame(step);else{moving=false;lastY=scrollY;done?.()}}
  requestAnimationFrame(step);
 }
 function type(g,next){if(g.started)return;g.started=true;typing=true;go(g.section,()=>{let row=0,n=0;
  function tick(){if(skipped)return;const line=g.lines[row];line.classList.add('is-typing');g.section.classList.add('is-typing');line.textContent=g.sentences[row].slice(0,++n);if(n<g.sentences[row].length)setTimeout(tick,65);else{line.classList.remove('is-typing');if(++row<g.lines.length){n=0;setTimeout(tick,160)}else{g.done=true;g.section.classList.remove('is-typing');g.section.classList.add('is-complete');setTimeout(()=>{if(skipped)return;typing=false;go(next,()=>{if(next===chat){chatReady=true;chat.classList.add('is-conversation-visible')}})},550)}}}tick();});
 }
 function check(){if(skipped)return;const previousY=lastY,down=scrollY>=lastY;lastY=scrollY;if(moving||typing||reduced||!down)return;for(let i=0;i<groups.length;i++){const g=groups[i],r=g.section.getBoundingClientRect(),mid=80+(innerHeight-80)/2;if(!g.started&&r.bottom<=0){g.started=true;g.done=true;g.lines.forEach((line,j)=>line.textContent=g.sentences[j]);g.section.classList.add('is-complete');continue;}if(!g.started&&(Math.abs(r.top+r.height/2-mid)<100||(r.top+r.height/2<mid&&r.top+r.height/2+scrollY-previousY>=mid))){type(g,i?game:chat);break}}}
 addEventListener('scroll',check,{passive:true});
 function advance(e,down){if(skipped||!down)return;if(moving||typing){if(e.cancelable)e.preventDefault();return}if(chatReady&&!groups[1].started){const r=chat.getBoundingClientRect();if(r.top<150&&r.bottom>innerHeight-120){if(e.cancelable)e.preventDefault();chatReady=false;type(groups[1],game)}}}
 addEventListener('wheel',e=>advance(e,e.deltaY>0),{passive:false});
 addEventListener('touchstart',e=>{touchY=e.touches[0]?.clientY},{passive:true});
 addEventListener('touchmove',e=>{if(touchY!=null)advance(e,touchY-e.touches[0].clientY>10)},{passive:false});
 addEventListener('keydown',e=>{if(['ArrowDown','PageDown',' '].includes(e.key)&&!e.target.closest('button,a,input,textarea,video'))advance(e,true)});
 if(reduced){groups.forEach(g=>g.done=true)}
})();
