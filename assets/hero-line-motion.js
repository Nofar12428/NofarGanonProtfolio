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
  const width=target.getBoundingClientRect().width;target.style.width=width+'px';
  const measure=target.cloneNode(false);measure.removeAttribute('id');measure.removeAttribute('aria-label');measure.classList.add('ng-hero-measure');
  Object.assign(measure.style,{position:'absolute',visibility:'hidden',pointerEvents:'none',width:width+'px',height:'auto',margin:'0',left:'0',top:'0'});
  if(isHeading)measure.textContent=source;else measure.innerHTML=source;
  // Measure words with the existing font, width, italic treatment and balanced wrapping.
  const walker=document.createTreeWalker(measure,NodeFilter.SHOW_TEXT),nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
  nodes.forEach(node=>{const fragment=document.createDocumentFragment();node.textContent.split(/(\s+)/).filter(Boolean).forEach(word=>{
   if(/^\s+$/.test(word))fragment.append(document.createTextNode(word));else{const span=document.createElement('span');span.className='ng-hero-word';span.textContent=word;fragment.append(span);}
  });node.replaceWith(fragment);});
  target.after(measure);
  const lines=[];let top=null;const tolerance=parseFloat(getComputedStyle(target).fontSize)*.5;
  measure.querySelectorAll('.ng-hero-word').forEach(word=>{const y=word.getBoundingClientRect().top;
   if(top===null||Math.abs(y-top)>tolerance){lines.push([]);top=y;}
   lines[lines.length-1].push({text:word.textContent,em:!!word.closest('em')});
  });const fullText=measure.textContent.trim();measure.remove();
  target.replaceChildren();
  if(!isHeading){const reader=document.createElement('span');reader.className='ng-hero-reader';reader.textContent=fullText;target.append(reader);}
  lines.forEach((words,i)=>{
   const mask=document.createElement('span');mask.className='ng-hero-line-mask';mask.setAttribute('aria-hidden','true');
   const line=document.createElement('span');line.className='ng-hero-line';line.style.setProperty('--line-delay',((offset+i)*.18)+'s');
   words.forEach((word,j)=>{if(j)line.append(' ');if(word.em){const em=document.createElement('em');em.textContent=word.text;line.append(em);}else line.append(word.text);});
   mask.append(line);target.append(mask);
  });return lines.length;
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
