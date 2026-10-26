(()=>{
 // A little space below the top edge is intentional for the visual-language and filtering examples.
 if(document.body.classList.contains('hashtag-case')){
  document.querySelectorAll('.ng-decision-panel').forEach((p,i)=>{if(i===1||i===2)p.classList.add('ng-lower-media');});
 }
 // Place feature navigation on the outer side for each language.
 const sec=document.getElementById('lc-product'),pin=sec?.querySelector('.ng-lc-pin');
 if(pin){
  let queued=false;
  const place=()=>{queued=false;const fan=sec.querySelector('.lc-panel:not([hidden]) .lc-fan');if(!fan)return;const phone=fan.querySelector('.lc-screen-card[data-slot="0"]')||fan.querySelector('.lc-screen-card')||fan;const a=phone.getBoundingClientRect(),b=pin.getBoundingClientRect();const group=fan.getBoundingClientRect();const gap=Math.max(20,Math.min(36,innerWidth*.025));const x=document.documentElement.lang==='he'?group.left-b.left-gap-28:Math.min(b.width-28,group.right-b.left+gap);pin.style.setProperty('--review-dots-x',Math.max(0,x)+'px');pin.style.setProperty('--review-dots-y',(a.top-b.top+a.height/2)+'px');};
  const q=()=>{if(!queued){queued=true;requestAnimationFrame(place);}};
  new ResizeObserver(q).observe(pin);new MutationObserver(q).observe(sec,{subtree:true,attributes:true,attributeFilter:['hidden']});addEventListener('resize',q);addEventListener('load',q);document.fonts?.ready.then(q);q();
 }
 document.querySelectorAll('.ng-how').forEach(section=>{
  const stage=section.querySelector('.ng-how-stage');if(!stage)return;let queued=false;
  const place=()=>{queued=false;const media=stage.querySelector(section.dataset.view==='desktop'?'.ng-how-desk':'.ng-how-phone');if(!media)return;const a=media.getBoundingClientRect(),dots=stage.querySelector('.ng-how-dots'),b=(dots?.offsetParent||stage).getBoundingClientRect();stage.style.setProperty('--review-how-x',Math.max(0,document.documentElement.lang==='he'?a.left-b.left-32:Math.min(b.width-20,a.right-b.left+16))+'px');stage.style.setProperty('--review-how-y',(a.top-b.top+a.height/2)+'px');};
  const q=()=>{if(!queued){queued=true;requestAnimationFrame(place);}};new ResizeObserver(q).observe(stage);new MutationObserver(q).observe(section,{attributes:true,attributeFilter:['data-view']});addEventListener('resize',q);addEventListener('load',q);document.fonts?.ready.then(q);q();
 });
 // The bold takeaway fills word by word with the scroll, in the document's reading order.
 const reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;
 const headings=[...document.querySelectorAll('.ng-brief-more :is(.ng-fact-challenge,.ng-fact-audience) .ng-fact-takeaway')];
 headings.forEach(h=>{
  h.classList.remove('ng-review-reveal','cs-scrub');h.classList.add('ng-word-reveal');
  const walker=document.createTreeWalker(h,NodeFilter.SHOW_TEXT),nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
  nodes.forEach(n=>{const fragment=document.createDocumentFragment();n.textContent.split(/(\s+)/).forEach(part=>{if(!part)return;if(/^\s+$/.test(part))fragment.append(document.createTextNode(part));else{const span=document.createElement('span');span.className='ng-reveal-word';span.textContent=part;fragment.append(span);}});n.replaceWith(fragment);});
 });
 let wordQueued=false;
 function lightWords(){wordQueued=false;const vh=innerHeight;headings.forEach(h=>{
  const words=[...h.querySelectorAll('.ng-reveal-word')],rect=h.getBoundingClientRect();
  const progress=reduced?1:Math.max(0,Math.min(1,(vh*.88-rect.top)/(vh*.34)));
  words.forEach((word,i)=>{const lit=Math.max(0,Math.min(1,progress*(words.length+2)-i));word.style.setProperty('--word-light',(0.2+0.8*lit).toFixed(3));});
 });}
 function queueWords(){if(!wordQueued){wordQueued=true;requestAnimationFrame(lightWords);}}
 addEventListener('scroll',queueWords,{passive:true});addEventListener('resize',queueWords);document.fonts?.ready.then(queueWords);lightWords();
 // Let the main thought arrive first and its supporting explanation follow gently.
 const targets=[];
 document.querySelectorAll('.ng-brief-more :is(.ng-fact-challenge,.ng-fact-audience)').forEach(article=>{
  article.querySelectorAll('.ng-fact-label,.ng-fact-detail').forEach((e,i)=>{e.classList.remove('cs-scrub');e.classList.add('ng-review-reveal');e.style.transitionDelay=(i*110)+'ms';targets.push(e);});
 });
 if(matchMedia('(prefers-reduced-motion:reduce)').matches||!('IntersectionObserver'in window)){targets.forEach(e=>e.classList.add('is-visible'));return;}
 const io=new IntersectionObserver(entries=>entries.forEach(e=>{e.target.classList.toggle('is-visible',e.isIntersecting);}),{threshold:0,rootMargin:'0px 0px -12% 0px'});targets.forEach(e=>io.observe(e));
})();
