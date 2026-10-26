/* Language links remain independent of the existing header and project artwork. */
(()=>{
 const he=document.documentElement.lang==='he',base=(location.pathname.split('/').pop()||'index.html').replace('-he.html','.html');
 const switcher=document.querySelector('.ng-language-switch');
 if(switcher){
  switcher.setAttribute('aria-label',he?'שפת האתר':'Website language');
  switcher.querySelectorAll('[data-language]').forEach(a=>{
   const active=a.dataset.language===(he?'he':'en');
   a.toggleAttribute('data-active',active);if(active)a.setAttribute('aria-current','page');
   a.href=(a.dataset.language==='he'?base.replace('.html','-he.html'):base)+location.hash;
   a.addEventListener('click',e=>{if(active){e.preventDefault();return;}try{localStorage.setItem('ng-language',a.dataset.language)}catch(_){}});
  });
 }
 if(!he)return;
 const dictionary=window.NGHebrew||{},normalize=s=>s.replace(/\s+/g,' ').trim();
 const translate=s=>dictionary[normalize(s)]||s;
 const ignored='script,style,svg,code,pre,.ng-language-switch,.ng-hero-line-mask,.ng-hero-measure,.ng-hd__name,h1,.ng-project-navigation b,.slide h3';
 function text(node){if(!node.parentElement||node.parentElement.closest(ignored))return;const current=node.nodeValue,key=normalize(current),next=dictionary[key];if(next&&next!==key)node.nodeValue=current.replace(current.trim(),next);}
 function attributes(el){
  if(el.closest?.('.ng-language-switch'))return;
  for(const key of ['aria-label','title','alt']){const value=el.getAttribute(key);if(!value)continue;let next=translate(value);if(next===value){for(const prefix of ['Select ','Show '])if(value.startsWith(prefix))next=(prefix==='Select '?'בחירת ':'הצגת ')+translate(value.slice(prefix.length));}if(next!==value)el.setAttribute(key,next);}
  if(el.tagName==='A'){
   const href=el.getAttribute('href');if(href&&!/^(?:[a-z]+:|\/|#)/i.test(href)&&/^(?:index|home|lumina-case-study|hashtag-case-study|stratasys-case-study|spaceship-case-study|alcohol-case-study)\.html(?:[?#]|$)/.test(href))el.setAttribute('href',href.replace('.html','-he.html'));
  }
 }
 function arrowLink(el){
  if(el.tagName!=='A'||el.children.length||!/[\u0590-\u05ff]/.test(el.textContent))return;
  const m=el.textContent.trim().match(/^(.*?)\s*([↓↗])$/);if(!m)return;
  el.classList.add('ng-he-arrow-link');const label=document.createElement('span'),arrow=document.createElement('span');label.textContent=m[1];arrow.className='ng-he-link-arrow';arrow.setAttribute('aria-hidden','true');arrow.textContent=m[2];el.replaceChildren(label,arrow);
 }
 function scan(root){
  if(root.nodeType===3){text(root);arrowLink(root.parentElement);return;}if(root.nodeType!==1||root.closest(ignored))return;
  attributes(root);root.querySelectorAll('[aria-label],[title],[alt],a[href]').forEach(attributes);
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);while(walker.nextNode())text(walker.currentNode);root.querySelectorAll('a').forEach(arrowLink);arrowLink(root);
 }
 scan(document.body);
 const queue=new Set();let pending=false;
 function flush(){pending=false;const items=[...queue];queue.clear();items.forEach(scan);}
 new MutationObserver(records=>{records.forEach(r=>{if(r.type==='childList')r.addedNodes.forEach(n=>queue.add(n));else queue.add(r.target);});if(!pending){pending=true;requestAnimationFrame(flush)}}).observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['aria-label','title','alt','href']});
})();
