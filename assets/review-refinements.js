(()=>{
 // Keep a readable email label on the narrowest screens while exposing the full address to assistive tech.
 document.querySelectorAll('.ng-end__links a[href^="mailto:"]').forEach(a=>{
  const email=a.getAttribute('href').slice(7);a.setAttribute('aria-label','Email '+email);a.title=email;
  [...a.childNodes].filter(n=>n.nodeType===3&&n.textContent.trim()).forEach(n=>{const full=document.createElement('span');full.className='ng-contact-email-full';full.textContent=n.textContent;n.replaceWith(full);});
  const short=document.createElement('span');short.className='ng-contact-email-short';short.textContent='Email';short.setAttribute('aria-hidden','true');a.append(short);
 });
})();
