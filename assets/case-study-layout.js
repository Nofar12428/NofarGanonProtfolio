/* Native range inputs support dragging, touch and keyboard without scroll interception. */
document.querySelectorAll('.ng-compare').forEach(function(compare){
  var input=compare.querySelector('.ng-compare-range');
  var before=compare.querySelector('[data-compare-before]');
  var after=compare.querySelector('[data-compare-after]');
  var labels=compare.querySelector('.ng-compare-labels');
  function update(){
    var value=Number(input.value);
    compare.style.setProperty('--split',value+'%');
    input.setAttribute('aria-valuetext',value===0?'After image shown':value===100?'Before image shown':value+' percent before, '+(100-value)+' percent after');
    before.hidden=value<50; after.hidden=value>=50;
    labels.classList.toggle('is-endpoint',value===0||value===100);
    /* version buttons belong to one side: show them only while that side is the image on view */
    compare.querySelectorAll('.ng-compare-versions').forEach(function(group){
      var b=group.querySelector('[data-compare-side]');if(!b)return;
      var side=b.dataset.compareSide;group.classList.toggle('is-off',side==='before'?value<50:value>=50);
    });
  }
  input.value=100; /* open on the Before image */
  input.addEventListener('input',update); update();
  /* leaving a decision tab resets it, so coming back always opens on the first Before image */
  var panel=compare.closest('[role=tabpanel]');
  if(panel)new MutationObserver(function(){
    if(!panel.hidden){compare.querySelectorAll('video').forEach(function(v){v.currentTime=0;});return;}   /* both clips start together */
    compare.querySelectorAll('.ng-compare-versions').forEach(function(group){var first=group.querySelector('[data-compare-side]');if(first&&first.getAttribute('aria-pressed')!=='true')first.click();});
    input.value=100;update();
  }).observe(panel,{attributes:true,attributeFilter:['hidden']});
  compare.querySelectorAll('[data-compare-side]').forEach(function(button){
    button.addEventListener('click',function(){
      var side=button.dataset.compareSide;
      var img=compare.querySelector(side==='before'?'.ng-compare-before img, .ng-compare-before video':'.ng-compare-after');
      img.src=button.dataset.compareSrc;img.alt=button.dataset.compareAlt;
      compare.querySelectorAll('[data-compare-side="'+side+'"]').forEach(function(b){b.setAttribute('aria-pressed',String(b===button));});
      input.value=side==='before'?100:0;update();
    });
  });
  var expand=compare.querySelector('[data-compare-expand]');
  if(expand)expand.addEventListener('click',function(){
    var initialSide=Number(input.value)>50?'before':'after';
    var items=[];
    function add(side,src,alt){if(!src||items.some(x=>x.side===side&&x.src===src))return;items.push({side:side,src:src,alt:alt||''});}
    ['before','after'].forEach(function(side){
      var image=compare.querySelector(side==='before'?'.ng-compare-before img, .ng-compare-before video':'.ng-compare-after');
      add(side,image.getAttribute('src'),image.alt||image.getAttribute('aria-label'));
      compare.querySelectorAll('[data-compare-side="'+side+'"]').forEach(function(b){add(side,b.dataset.compareSrc,b.dataset.compareAlt);});
    });
    var selected=compare.querySelector(initialSide==='before'?'.ng-compare-before img, .ng-compare-before video':'.ng-compare-after');
    var index=Math.max(0,items.findIndex(x=>x.side===initialSide&&x.src===selected.getAttribute('src')));
    var dialog=document.createElement('dialog');dialog.className='ng-compare-modal';dialog.setAttribute('aria-label','Enlarged before and after comparison');
    var close=document.createElement('button');close.type='button';close.className='ng-viewer-close';close.textContent='×';close.setAttribute('aria-label','Close enlarged image');
    var img=document.createElement('img');
    var vid=document.createElement('video');vid.muted=true;vid.loop=true;vid.playsInline=true;vid.autoplay=true;vid.hidden=true;   /* a decision may show a short clip */
    var toolbar=document.createElement('div');toolbar.className='ng-viewer-toolbar';
    var prev=document.createElement('button');prev.type='button';prev.textContent='‹';prev.setAttribute('aria-label','Previous comparison image');
    var next=document.createElement('button');next.type='button';next.textContent='›';next.setAttribute('aria-label','Next comparison image');
    var caption=document.createElement('span');caption.setAttribute('role','status');caption.setAttribute('aria-live','polite');
    function show(i){index=(i+items.length)%items.length;var item=items[index];var clip=/\.mp4$/i.test(item.src);
      img.hidden=clip;vid.hidden=!clip;if(clip){vid.src=item.src;vid.setAttribute('aria-label',item.alt);vid.play().catch(function(){});}else{vid.removeAttribute('src');img.src=item.src;img.alt=item.alt;}caption.textContent=(item.side==='before'?'Before':'After')+' · '+(index+1)+' / '+items.length;}
    prev.addEventListener('click',()=>show(index-1));next.addEventListener('click',()=>show(index+1));
    toolbar.append(prev,caption,next);dialog.append(close,img,vid,toolbar);document.body.append(dialog);show(index);
    close.addEventListener('click',()=>dialog.close());
    dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
    dialog.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();show(index+1);}if(e.key==='ArrowLeft'){e.preventDefault();show(index-1);}});
    dialog.addEventListener('close',()=>{dialog.remove();expand.focus({preventScroll:true});});
    dialog.showModal();
  });
});

/* Images in hidden decision tabs load up front, so switching tabs never shows a half-loaded, collapsing image. */
document.querySelectorAll('.ng-decision-panel img[loading="lazy"]').forEach(function(img){img.loading='eager';});

/* Key decisions: the information rises into place only when switching tabs (pages that already animate their panel keep their own). */
(function(){
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  document.querySelectorAll('.ht-decision-tabs [role=tab], .lc-decision-tabs [role=tab]').forEach(function(tab){
    tab.addEventListener('click',function(){
      requestAnimationFrame(function(){
        var panel=document.getElementById(tab.getAttribute('aria-controls'));
        if(!panel||panel.hidden||panel.getAnimations({subtree:true}).length)return;
        panel.animate([{opacity:0,transform:'translateY(24px)'},{opacity:1,transform:'none'}],{duration:500,easing:'cubic-bezier(.22,1,.36,1)'});
      });
    });
  });
})();

/* Only supporting copy rises with scrolling. Headings and bold takeaways remain still. */
(function(){
 if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 const els=[...document.querySelectorAll('.ng-brief-more .ng-fact-detail, .ng-brief-more .ng-context-copy, .ng-brief-more .ad-note, .ng-contribution-intro > p, .ng-contribution-list > li, .ng-personal-challenge, .ng-ai-intro > p, .ng-ai-detail > p, .sc-next-steps > p, .sc-next-steps li')];
 els.forEach(e=>e.classList.add('cs-scrub'));let queued=false;
 function update(){queued=false;const h=innerHeight;els.forEach(e=>{
  if(!e.getClientRects().length)return;
  /* the band starts as the line enters the screen and ends a little below the middle (nearer the bottom on phones) */
  const small=innerWidth<=900,dist=small?44:84,end=small?.8:.74;
  const rise=Number(e.style.getPropertyValue('--rise')||1),top=e.getBoundingClientRect().top-rise*dist;
  const lin=Math.max(0,Math.min(1,(top-h*end)/(h*(1.02-end))));
  let p=1-(1-lin)*(1-lin);   /* most of the movement happens while the text is in clear view */
  /* at the very end of the page nothing can scroll further, so the copy settles sharp */
  if(scrollY+h>=document.documentElement.scrollHeight-4)p=0;
  e.style.setProperty('--rise',p.toFixed(3));
 });}
 function q(){if(!queued){queued=true;requestAnimationFrame(update);}}
 addEventListener('scroll',q,{passive:true});addEventListener('resize',q);document.fonts?.ready.then(q);update();
 /* a decision tab that was hidden gets its text placed as soon as it opens, never left invisible */
 new MutationObserver(q).observe(document.body,{subtree:true,attributes:true,attributeFilter:['hidden']});
})();

/* How it works: the section stays pinned; scroll (or the dots) moves through the steps. */
(function(){
  var sec=document.querySelector('.ng-how'); if(!sec)return;
  var steps=[].slice.call(sec.querySelectorAll('.ng-how-step')), dots=[].slice.call(sec.querySelectorAll('.ng-how-dots button'));
  var n=steps.length, reduced=matchMedia('(prefers-reduced-motion: reduce)').matches, current=-1, jumping=false, jumpTimer=0;
  sec.style.setProperty('--how-steps',String(n));
  function media(){return [].slice.call(sec.querySelectorAll(sec.dataset.view==='desktop'?'.ng-how-desk .ng-how-media':'.ng-how-phone .ng-how-media'));}
  function show(k,force){
    if(k===current&&!force)return; current=k;
    steps.forEach(function(s,i){s.classList.toggle('is-on',i===k);});
    dots.forEach(function(d,i){if(i===k)d.setAttribute('aria-current','step');else d.removeAttribute('aria-current');});
    [].slice.call(sec.querySelectorAll('.ng-how-media')).forEach(function(m){m.classList.remove('is-on');if(m.tagName==='VIDEO')m.pause();});
    var m=media()[k]; if(!m)return; m.classList.add('is-on');
    if(m.tagName==='VIDEO'&&!reduced){m.currentTime=0;m.play().catch(function(){});}
  }
  function range(){return sec.offsetHeight-innerHeight;}
  function stepAt(){var p=-sec.getBoundingClientRect().top/Math.max(1,range());return Math.max(0,Math.min(n-1,Math.floor(p*n)));}
  /* jumping with a dot or a view switch: the same motion as scrolling — the current text lifts away, the new one rises in */
  function goTo(k){
    var top=sec.getBoundingClientRect().top+scrollY+range()*(k+.5)/n;
    jumping=true; clearTimeout(jumpTimer);
    scrollTo({top:top,behavior:reduced?'auto':'smooth'});
    jumpTimer=setTimeout(function(){jumping=false;},1100);
  }
  function jump(k,force){
    if(k===current&&!force){goTo(k);return;}
    var old=current>=0?steps[current]:null, ease='cubic-bezier(.2,.9,.2,1)';
    goTo(k);
    function enter(){
      show(k,true);
      var el=steps[k]; el.style.setProperty('--y','0px'); el.style.setProperty('--o','1');
      if(!reduced)el.animate([{transform:'translateY(48px)',opacity:0},{transform:'none',opacity:1}],{duration:520,easing:ease});
    }
    if(old&&old!==steps[k]&&!reduced){
      old.animate([{transform:getComputedStyle(old).transform==='none'?'none':getComputedStyle(old).transform,opacity:getComputedStyle(old).opacity},{transform:'translateY(-36px)',opacity:0}],{duration:260,easing:'ease-in',fill:'forwards'})
         .onfinish=function(a){enter();this.cancel();};
    } else enter();
  }
  addEventListener('scrollend',function(){if(jumping){clearTimeout(jumpTimer);jumping=false;}});
  /* scroll-linked motion of the active text inside its own step */
  function follow(){
    if(reduced||current<0)return;
    var p=-sec.getBoundingClientRect().top/Math.max(1,range())*n - current;   /* 0..1 inside the step */
    p=Math.max(0,Math.min(1,p));
    var y=0,o=1;
    if(current>0&&p<.35){var t=p/.35;y=(1-t)*48;o=t;}                       /* rise in from below */
    if(current<n-1&&p>.8){var u=(p-.8)/.2;y=-u*36;o=1-u;}                   /* lift away before the next step */
    var el=steps[current]; el.style.setProperty('--y',y.toFixed(1)+'px'); el.style.setProperty('--o',o.toFixed(3));
  }
  var queued=false;
  addEventListener('scroll',function(){if(!queued){queued=true;requestAnimationFrame(function(){queued=false;if(jumping)return;show(stepAt());follow();});}},{passive:true});
  addEventListener('resize',function(){show(stepAt(),true);});
  dots.forEach(function(d,i){d.addEventListener('click',function(){jump(i);});});
  sec.querySelectorAll('.ng-how-views button').forEach(function(b){
    b.addEventListener('click',function(){
      sec.dataset.view=b.dataset.view;
      sec.querySelectorAll('.ng-how-views button').forEach(function(x){x.setAttribute('aria-pressed',String(x===b));});
      jump(0,true);                                          /* each device view starts from step 1 */
    });
  });
  show(stepAt(),true);
})();

/* Each feature has a full dwell interval, including the first and last. */
(function(){
 const sec=document.querySelector('.lc-product'),pin=sec?.querySelector('.ng-lc-pin');if(!pin)return;
 const tabs=[...sec.querySelectorAll('.lc-tabs [role=tab]')],wide=matchMedia('(min-width:901px)'),reduced=matchMedia('(prefers-reduced-motion:reduce)');
 let queued=false,jumping=false,timer;
 function step(){return Math.max(340,Math.min(520,innerHeight*.55));}
 function update(){queued=false;if(!wide.matches||jumping)return;const index=Math.max(0,Math.min(tabs.length-1,Math.floor(-sec.getBoundingClientRect().top/step())));sec._lcSelectFeature?.(index,false,true);}
 function queue(){if(!queued){queued=true;requestAnimationFrame(update);}}
 function setup(){sec.classList.toggle('ng-lc-scroll',wide.matches);sec.style.setProperty('--lc-scroll-height',(innerHeight+tabs.length*step())+'px');queue();}
 function release(){clearTimeout(timer);jumping=false;queue();}
 sec.addEventListener('lc-feature-request',e=>{if(!wide.matches)return;const top=sec.getBoundingClientRect().top+scrollY+(e.detail.index+.5)*step();jumping=true;clearTimeout(timer);scrollTo({top,behavior:reduced.matches?'instant':'smooth'});timer=setTimeout(release,800);});
 addEventListener('scroll',queue,{passive:true});addEventListener('scrollend',release);addEventListener('wheel',()=>{if(jumping)release();},{passive:true});addEventListener('touchstart',()=>{if(jumping)release();},{passive:true});
 addEventListener('resize',setup);wide.addEventListener('change',setup);setup();
})();

(function(){
 const video=document.querySelector('.ng-website-scroll');if(!video)return;
 video.muted=true;video.playsInline=true;
 let automatic=false,userPaused=false;
 video.addEventListener('pause',()=>{if(automatic){automatic=false;}else userPaused=true;});
 video.addEventListener('play',()=>{userPaused=false;});
 if('IntersectionObserver' in window)new IntersectionObserver(entries=>entries.forEach(e=>{
  if(e.isIntersecting&&e.intersectionRatio>=.35){if(!userPaused)video.play().catch(()=>{});}
  else if(!video.paused){automatic=true;video.pause();}
 }),{threshold:[0,.35]}).observe(video);
})();

/* Mockup videos play only while they are on screen. */
(function(){
  var vids=[].slice.call(document.querySelectorAll('.ng-mock-video, .ng-compare-stage video'));
  if(!vids.length)return;
  var reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  vids.forEach(function(v){v.muted=true;v.playsInline=true;if(reduced){v.removeAttribute('autoplay');v.pause();}});
  if(reduced||!('IntersectionObserver' in window))return;
  var io=new IntersectionObserver(function(es){es.forEach(function(e){var v=e.target;if(e.isIntersecting){v.play().catch(function(){});}else v.pause();});},{threshold:.2});
  vids.forEach(function(v){io.observe(v);});
})();

/* Lumina on phones: the feature dots sit in a column beside the phone, centred on it. */
(function(){
  var sec=document.getElementById('lc-product'); if(!sec)return;
  var narrow=matchMedia('(max-width: 900px)'), queued=false;
  function place(){
    queued=false;
    if(!narrow.matches){sec.style.removeProperty('--lc-dots-top');return;}
    var fan=sec.querySelector('.lc-panel:not([hidden]) .lc-fan'); if(!fan)return;
    var r=fan.getBoundingClientRect(), top=sec.getBoundingClientRect().top;
    var head=sec.querySelector('.lc-product-heading');   /* centre the column itself on the phone */
    sec.style.setProperty('--lc-dots-top',Math.round(r.top-top+r.height/2-(head?head.offsetHeight/2:0))+'px');
  }
  function q(){if(!queued){queued=true;requestAnimationFrame(place);}}
  new MutationObserver(q).observe(sec,{subtree:true,attributes:true,attributeFilter:['hidden']});
  if('ResizeObserver' in window){var ro=new ResizeObserver(q);ro.observe(sec);sec.querySelectorAll('.lc-fan').forEach(function(f){ro.observe(f);});}
  addEventListener('resize',q); narrow.addEventListener('change',q); addEventListener('load',q); document.fonts&&document.fonts.ready.then(q); q();
})();
