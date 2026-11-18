/* Between the Lines: the opening line drawing and the crossed-out options */
(()=>{
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;

 /* The drawing follows the scroll, line after line, with a pencil at the tip. */
 const sec=document.querySelector('.btl-draw');
 if(sec){
  const svg=sec.querySelector('.btl-draw-svg'),pencil=sec.querySelector('.btl-pencil');
  const lines=[...sec.querySelectorAll('.btl-ln')],lens=lines.map(p=>p.getTotalLength()),total=lens.reduce((a,b)=>a+b,0);
  lines.forEach((p,i)=>{p.style.strokeDasharray=lens[i]+' '+lens[i];p.style.strokeDashoffset=String(lens[i]);});
  let queued=false;
  const draw=()=>{
   queued=false;
   const r=sec.getBoundingClientRect(),range=Math.max(1,sec.offsetHeight-innerHeight*.9);
   const p=reduced?1:Math.max(0,Math.min(1,(innerHeight*.35-r.top)/range));
   let left=p*total,tip=null;
   lines.forEach((path,i)=>{
    const d=Math.max(0,Math.min(lens[i],left));left-=lens[i];
    path.style.strokeDashoffset=String(lens[i]-d);
    if(d>0&&d<lens[i])tip=[path,d];
   });
   sec.style.setProperty('--btl-draw',p.toFixed(3));
   if(tip&&pencil){
    const pt=tip[0].getPointAtLength(tip[1]),m=svg.getScreenCTM(),box=sec.querySelector('.btl-draw-art').getBoundingClientRect();
    pencil.style.setProperty('--px',(pt.x*m.a+m.e-box.left)+'px');pencil.style.setProperty('--py',(pt.y*m.d+m.f-box.top)+'px');
    pencil.classList.add('is-on');
   }else pencil&&pencil.classList.remove('is-on');
  };
  const q=()=>{if(!queued){queued=true;requestAnimationFrame(draw);}};
  addEventListener('scroll',q,{passive:true});addEventListener('resize',q);draw();
 }

 /* Each dropped option is crossed out as it comes into view. */
 const rows=[...document.querySelectorAll('.btl-cross-row')];
 if(reduced||!('IntersectionObserver' in window))rows.forEach(r=>r.classList.add('is-crossed'));
 else{
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-crossed');io.unobserve(e.target);}}),{rootMargin:'0px 0px -55% 0px'});
  rows.forEach(r=>io.observe(r));
 }

 /* The smaller supporting lines rise into place with the scroll, like on the other case studies. */
 if(!reduced){
  const els=[...document.querySelectorAll('.btl-cross-intro>p, .btl-cross-now p, .btl-quote figcaption, .btl-stats dt, .btl-eval-changes .ng-contribution-intro h3')];
  els.forEach(e=>e.classList.add('cs-scrub'));let sq=false;
  const rise=()=>{sq=false;const h=innerHeight,small=innerWidth<=900,dist=small?44:84,end=small?.8:.74;
   els.forEach(e=>{if(!e.getClientRects().length)return;const r=Number(e.style.getPropertyValue('--rise')||1),top=e.getBoundingClientRect().top-r*dist;
    const lin=Math.max(0,Math.min(1,(top-h*end)/(h*(1.02-end))));e.style.setProperty('--rise',(1-(1-lin)*(1-lin)).toFixed(3));});};
  const q2=()=>{if(!sq){sq=true;requestAnimationFrame(rise);}};
  addEventListener('scroll',q2,{passive:true});addEventListener('resize',q2);rise();
 }
 /* Key decisions: each picture is as tall as its explanation */
 const panels=[...document.querySelectorAll('.btl-case .ht-key-panel')];
 if(panels.length){
  const fit=()=>panels.forEach(pn=>{const c=pn.querySelector('.ng-decision-copy'),f=pn.querySelector('figure');
   if(!c||!f||pn.hidden)return;const wide=innerWidth>900;f.style.setProperty('--btl-fig-h',wide?Math.max(320,Math.round(c.offsetHeight))+'px':'');});
  addEventListener('resize',fit);new MutationObserver(fit).observe(document.querySelector('.ht-key-decisions')||document.body,{subtree:true,attributes:true,attributeFilter:['hidden']});
  document.fonts&&document.fonts.ready.then(fit);fit();
 }
 /* Market review: each finding is exactly as wide as its longest line, so the gaps between them are equal */
 const finds=[...document.querySelectorAll('.btl-survey .ng-contribution-list li')];
 if(finds.length){
  const snug=()=>{finds.forEach(li=>li.style.removeProperty('--btl-snug'));if(innerWidth<=900)return;
   finds.forEach(li=>{const lines={},tw=document.createTreeWalker(li,NodeFilter.SHOW_TEXT);while(tw.nextNode()){const r=document.createRange();r.selectNodeContents(tw.currentNode);[...r.getClientRects()].forEach(x=>{if(!x.width)return;const k=Math.round(x.top/4);const l=lines[k]||(lines[k]=[x.left,x.right]);l[0]=Math.min(l[0],x.left);l[1]=Math.max(l[1],x.right);});}const w=Math.max(0,...Object.values(lines).map(l=>l[1]-l[0]));if(w>0)li.style.setProperty('--btl-snug',Math.ceil(w+2)+'px');});};
  addEventListener('resize',snug);document.fonts&&document.fonts.ready.then(snug);snug();
 }
 /* Evaluation, phones: the quotes sit in one sideways track; each quote's words fill as it slides in */
 const qs=document.querySelector('.btl-quotes');
 if(qs){
  const figs=[...qs.querySelectorAll(':scope>.btl-quote')],track=document.createElement('div');track.className='btl-quotes-track';
  figs[0].before(track);figs.forEach(f=>track.append(f));
  const he=document.documentElement.lang==='he',dots=document.createElement('div');dots.className='btl-quotes-dots';
  dots.setAttribute('role','group');dots.setAttribute('aria-label',he?'ציטוטים':'Quotes');
  figs.forEach((f,i)=>{const b=document.createElement('button');b.type='button';b.setAttribute('aria-label',(he?'ציטוט ':'Quote ')+(i+1));b.addEventListener('click',()=>f.scrollIntoView({behavior:reduced?'auto':'smooth',block:'nearest',inline:'start'}));dots.append(b);});
  track.after(dots);
  const small=()=>innerWidth<=900;let tq=false;
  const light=()=>{tq=false;if(!small()){qs.classList.remove('is-carousel');return;}qs.classList.add('is-carousel');
   const box=track.getBoundingClientRect(),vh=innerHeight,v=reduced?1:Math.max(0,Math.min(1,(vh*.9-box.top)/(vh*.3)));let cur=0,best=1e9;
   figs.forEach((f,i)=>{const r=f.getBoundingClientRect();const h=reduced?1:Math.max(0,Math.min(1,he?(r.right-box.left)/r.width:(box.right-r.left)/r.width));
    const p=Math.min(v,h),words=[...f.querySelectorAll('.ng-reveal-word')];
    words.forEach((w,k)=>{const lit=Math.max(0,Math.min(1,p*(words.length+2)-k));w.style.setProperty('--word-light',(0.2+0.8*lit).toFixed(3));});
    const d=Math.abs((he?box.right-r.right:r.left-box.left));if(d<best){best=d;cur=i;}});
   [...dots.children].forEach((b,i)=>b.setAttribute('aria-current',String(i===cur)));};
  const q=()=>{if(!tq){tq=true;requestAnimationFrame(light);}};
  track.addEventListener('scroll',q,{passive:true});addEventListener('scroll',q,{passive:true});addEventListener('resize',q);
  setTimeout(light,60);light();
 }
 /* How it works: the phone frame's own corners and bezel follow its width (its inner parts use container units) */
 const ph=document.querySelector('.btl-case .ng-how-phone');
 if(ph&&'ResizeObserver' in window){new ResizeObserver(([e])=>ph.style.setProperty('--btl-pw',Math.round(e.borderBoxSize?.[0]?.inlineSize||ph.offsetWidth)+'px')).observe(ph);}
})();
// Short mobile viewports: reserve room for the entire device, not just its top.
(()=>{
 const pin=document.querySelector('.btl-case .ng-how-pin'),phone=pin?.querySelector('.ng-how-phone');if(!phone)return;
 let queued=false;
 function fit(){queued=false;if(innerWidth>900){phone.style.removeProperty('--btl-fit-width');return;}
 const steps=pin.querySelector('.ng-how-steps'),stage=pin.querySelector('.ng-how-stage'),s=getComputedStyle(pin),t=getComputedStyle(stage);
 const available=pin.clientHeight-parseFloat(s.paddingTop)-parseFloat(s.paddingBottom)-steps.offsetHeight-parseFloat(s.rowGap||0)-parseFloat(t.paddingTop||0);
 phone.style.setProperty('--btl-fit-width',Math.max(70,Math.floor(available*250/555))+'px');}
 function q(){if(!queued){queued=true;requestAnimationFrame(fit)}}
 new ResizeObserver(q).observe(pin.querySelector('.ng-how-steps'));addEventListener('resize',q);document.fonts?.ready.then(q);q();
})();
