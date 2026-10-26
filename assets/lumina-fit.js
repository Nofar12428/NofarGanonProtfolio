(()=>{const section=document.getElementById('lc-product');if(!section)return;
 const panels=[...section.querySelectorAll('.lc-panel')];let pending=false;
 function set(name,value){if(section.style.getPropertyValue(name)!==value)section.style.setProperty(name,value);}
 function fit(){pending=false;const active=panels.find(p=>!p.hidden);if(!active)return;
  const width=active.querySelector('.ng-lc-copy')?.getBoundingClientRect().width||0;
  if(width){let title=0,description=0;
   panels.forEach(panel=>{const copy=panel.querySelector('.ng-lc-copy').cloneNode(true);copy.setAttribute('aria-hidden','true');
    Object.assign(copy.style,{position:'absolute',visibility:'hidden',width:width+'px',height:'auto',minHeight:'0',pointerEvents:'none'});
    copy.classList.add('lc-measure-copy');active.append(copy);
    title=Math.max(title,copy.querySelector('h3').getBoundingClientRect().height);
    description=Math.max(description,copy.querySelector('.lc-description').getBoundingClientRect().height);copy.remove();
   });set('--lc-title-height',Math.ceil(title)+'px');set('--lc-copy-height',Math.ceil(description)+'px');
  }
  const fan=active.querySelector('.lc-fan'),phone=Math.min(Math.max(40,fan.clientHeight-20),fan.clientWidth/.93),step=Math.max(0,Math.min(phone*.37,(fan.clientWidth-phone*.4613-12)/3.8));
  set('--fit-phone',phone+'px');set('--fit-step',step+'px');
 }
 function queue(){if(!pending){pending=true;requestAnimationFrame(fit);}}
 new ResizeObserver(queue).observe(section);new MutationObserver(queue).observe(section,{subtree:true,attributes:true,attributeFilter:['hidden']});
 addEventListener('resize',queue);addEventListener('load',queue);document.fonts?.ready.then(queue);queue();
})();
