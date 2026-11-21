(()=>{
 const intro=document.getElementById('introText'),hero=document.getElementById('hero');if(!intro||!hero)return;
 const heading=intro.querySelector('h1'),sentence=intro.querySelector('.lede');if(!heading||!sentence)return;
 const sources=new Map([[heading,heading.textContent],[sentence,sentence.innerHTML]]);
 const reduced=matchMedia('(prefers-reduced-motion:reduce)');let lastWidth=0,queued=false,visible=true;
 intro.classList.add('ng-hero-reveal-pending');
 function split(target,source,isHeading,offset){
  if(isHeading){
   target.style.width='max-content';target.style.maxWidth='100%';
   const mask=document.createElement('span');mask.className='ng-hero-line-mask';mask.setAttribute('aria-hidden','true');
   const line=document.createElement('span');line.className='ng-hero-line';line.textContent=source;line.style.setProperty('--line-delay','0s');mask.append(line);target.replaceChildren(mask);return 1;
  }
  target.style.width='';if(isHeading)target.textContent=source;else target.innerHTML=source;
  target.style.width='100%';
  if(document.documentElement.lang==='he'){target.classList.add('ng-hero-he-flow');return 1;}
  const walker=document.createTreeWalker(target,NodeFilter.SHOW_TEXT),nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
  let index=0;nodes.forEach(node=>{const frag=document.createDocumentFragment();node.textContent.split(/(\s+)/).forEach(word=>{if(!word)return;if(/^\s+$/.test(word))frag.append(document.createTextNode(word));else{const span=document.createElement('span');span.className='ng-hero-flow-word';span.textContent=word;span.style.setProperty('--line-delay',Math.min(index++*.035,.7)+'s');frag.append(span);}});node.replaceWith(frag);});return 1;
 }
 function build(){queued=false;const width=intro.getBoundingClientRect().width;if(!width)return;
  lastWidth=width;const count=split(heading,sources.get(heading),true,0);split(sentence,sources.get(sentence),false,count);
  intro.classList.remove('ng-hero-reveal-pending');intro.classList.add('ng-hero-line-motion');sync();
 }
 function sync(){intro.classList.toggle('ng-hero-motion-paused',document.hidden||!visible);}
 function resize(){const width=intro.getBoundingClientRect().width;if(Math.abs(width-lastWidth)<1||queued)return;queued=true;requestAnimationFrame(build);}
 Promise.race([document.fonts?.ready||Promise.resolve(),new Promise(resolve=>setTimeout(resolve,900))]).then(build);
 document.fonts?.ready.then(()=>{if(lastWidth)build();});
 new ResizeObserver(resize).observe(intro);
 if('IntersectionObserver'in window)new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();},{threshold:0}).observe(hero);
 document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',sync);
})();
