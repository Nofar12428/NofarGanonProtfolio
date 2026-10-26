(()=>{
 const section=document.querySelector('.ad-pour-section');if(!section)return;const choice=document.querySelector('.ad-drink-choice');
 const q=c=>section.querySelector(c),liquid=q('.ad-photo-liquid'),base=q('.ad-photo-refraction'),label=q('.ad-pour-name'),layout=q('.ad-pour-layout');
 const presets=[['WINE',0,1,'#681b2c'],['BEER',8,.88,'#c28112'],['VODKA',0,0,'#ffffff'],['WHISKEY',0,1,'#995008'],['COCKTAIL',55,.9,'#7baf26']];
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 let chosen=false,index=2,frame=0,selectionScroll=0,advanced=false,advanceTimer=null,prepareTimer=null,phase='idle',travelStart=0,fillStart=0;
 document.addEventListener('ng-project-skip',()=>{clearTimeout(prepareTimer);clearTimeout(advanceTimer);prepareTimer=null;advanceTimer=null;advanced=true;phase=chosen?'complete':'idle';cancelAnimationFrame(frame);frame=0;window.NGSimulationFlow?.cancel();});
 const qAllVariants=[...section.querySelectorAll('.ad-glass-variant')];
 const clamp=v=>Math.max(0,Math.min(1,v));
 function draw(now=performance.now()){frame=0;const box=section.getBoundingClientRect(),entry=clamp((innerHeight-box.top)/innerHeight);
 
 const elapsed=phase==='filling'?clamp((now-fillStart)/3000):phase==='complete'?1:0;
 const progress=elapsed*elapsed*(3-2*elapsed);
 if(elapsed>=1)phase='complete';
 if(phase==='travelling'||phase==='filling')wake();
 if(progress>=1&&!advanced&&!advanceTimer){advanceTimer=setTimeout(()=>{advanceTimer=null;if(!chosen)return;advanced=true;const question=document.querySelector('.ad-driving-question');if(!question)return;if(!reduced)layout.animate([{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(-150px)'}],{duration:650,easing:'cubic-bezier(.4,0,.2,1)'});window.NGSimulationFlow.go(question,innerHeight*.12);},220);}else if(progress<.99&&advanceTimer){clearTimeout(advanceTimer);advanceTimer=null;}
 // Reveal the stationary liquid texture. Only its meniscus travels vertically.
 // Neither the glass nor the body of liquid is scaled or stretched.
 liquid.removeAttribute('transform');
 const level=905-520*progress,reveal=q('.ad-photo-reveal'),surface=q('.ad-photo-surface'),surfaceWindow=q('.ad-photo-surface-window');
 reveal.setAttribute('y',level+22);reveal.setAttribute('height',progress?975-level:0);
 surfaceWindow.setAttribute('y',level-6);surfaceWindow.setAttribute('height',0);
 surface.setAttribute('transform','translate(0 '+(520*(1-progress))+')');
 const opacity=progress?(index===2?'.22':'1'):'0';liquid.setAttribute('opacity',opacity);surface.setAttribute('opacity',opacity);base.setAttribute('opacity',String(progress*(index===2?.2:1)));
 const finished=index===0?clamp((progress-.82)/.18):0,blend=finished*finished*(3-2*finished);
 q('.ad-wine-finished').setAttribute('opacity',String(blend));
 q('.ad-real-glass').style.opacity=String(1-blend);
 if(index===0){liquid.setAttribute('opacity',String((progress?1:0)*(1-blend)));surface.setAttribute('opacity',String((progress?1:0)*(1-blend)));base.setAttribute('opacity',String(progress*(1-blend)));}
 q('.ad-beer-extras').setAttribute('opacity',index===1&&progress>.015?'1':'0');q('.ad-beer-foam').setAttribute('transform','translate(0 '+(level+9)+')');q('.ad-glass-umbrella').setAttribute('opacity',index===4&&chosen?'1':'0');
 const original=q('.ad-original-glass');original.style.display=index===3?'':'none';
 qAllVariants.forEach(v=>{const active=Number(v.dataset.glass)===index;v.style.display=active?'':'none';if(!active)return;
 const bottom=Number(v.dataset.bottom),top=Number(v.dataset.top),fraction=index===0?.526:index===1?1:index===4?.96:.75,y=bottom-(bottom-(index===1?250:top))*fraction*progress;
 const w=Number(v.getAttribute('viewBox').split(' ')[2]),reveal=v.querySelector('.ad-variant-reveal');
 reveal.setAttribute('d',progress?`M0 ${y+15} Q${w/2} ${y-35} ${w} ${y+15} V${bottom+75} H0Z`:'M0 1600H1200V1600Z');
 const surface=v.querySelector('.ad-variant-meniscus');surface.setAttribute('cy',y+15);surface.setAttribute('opacity',index===0?(progress>0&&progress<.98?.2:0):index===1?0:progress?.25:0);
 if(index===1){
 // One stationary liquid-only photograph and one stationary glass shell.
 // Both liquid and foam use the same meniscus curve, with a 2px overlap.
 // There is no finished-state photograph or end-of-fill crossfade.
 const bodyLevel=1185-(1185-300)*progress;
 const depth=38*clamp(progress/.12);
 const slosh=reduced?0:Math.sin((now-fillStart)/230)*3*Math.sin(Math.PI*elapsed);
 const left=bodyLevel+slosh,right=bodyLevel-slosh;
 reveal.setAttribute('d',progress?`M0 ${left-2} H108 Q418 ${bodyLevel+2*depth-2} 728 ${right-2} H1024V1500H0Z`:'M0 1600H1200V1600Z');
 const headHeight=3+89*progress*progress,cy=bodyLevel-headHeight;
 const head=v.querySelector('.ad-beer-foam-top');head.setAttribute('cy',cy);head.setAttribute('ry',depth);
 v.querySelector('.ad-beer-head-travel').setAttribute('opacity',String(clamp(progress/.08)));
 head.setAttribute('transform',`rotate(${-Math.atan2(2*slosh,620)*180/Math.PI} 418 ${cy})`);
 v.querySelector('.ad-beer-foam-front').setAttribute('d',`M108 ${cy+slosh} Q418 ${cy+2*depth} 728 ${cy-slosh} L728 ${right} Q418 ${bodyLevel+2*depth} 108 ${left}Z`);
 v.querySelector('.ad-beer-growing').setAttribute('opacity',progress>0?'1':'0');
 v.querySelector('.ad-beer-rim').setAttribute('opacity','1');
 }
 const foam=v.querySelector('.ad-variant-foam');if(foam){foam.setAttribute('transform',`translate(0 ${y+14})`);foam.setAttribute('opacity',progress?1:0);}
 });
 if(!reduced){layout.style.transform='translateY('+(1-entry)*140+'px) scale('+(0.94+entry*.06)+')';layout.style.opacity=String(.15+entry*.85);if(choice){const exit=chosen?clamp((scrollY-selectionScroll)/(innerHeight*.9)):0;choice.style.transform='translateY('+(-exit*260)+'px) scale('+(1-exit*.06)+')';choice.style.opacity=String(1-exit*.85);}}
 }
 function wake(){if(!frame)frame=requestAnimationFrame(draw);}
 function configure(detail){if(detail.selected&&!chosen){selectionScroll=scrollY;advanced=false;phase='preparing';clearTimeout(prepareTimer);prepareTimer=setTimeout(()=>{if(!chosen)return;phase='travelling';travelStart=performance.now();if(choice&&!reduced)choice.animate([{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(-200px)'}],{duration:700,easing:'cubic-bezier(.4,0,.2,1)'});window.NGSimulationFlow.go(section,0,()=>{phase='filling';fillStart=performance.now();wake();});wake();},1100);}index=detail.index;chosen=detail.selected;const p=presets[index];label.textContent=chosen?p[0]:'YOUR CHOICE';const asset=index===0?'assets/simulation/wine-glass-r187.png':'assets/simulation/filled-glass-r184.png';[liquid,base,q('.ad-photo-surface')].forEach(image=>image.setAttribute('href',asset));q('.ad-photo-hue').setAttribute('values',p[1]);q('.ad-photo-saturation').setAttribute('values',p[2]);['red','green','blue'].forEach((channel,i)=>q('.ad-photo-'+channel).setAttribute('slope',1));wake();}
 document.addEventListener('ad-drink-change',e=>configure(e.detail));addEventListener('scroll',wake,{passive:true});addEventListener('resize',wake);
 const card=document.querySelector('.ad-choice-card.is-selected');configure({index:card?Number(card.dataset.choice):2,selected:!!card});
})();
