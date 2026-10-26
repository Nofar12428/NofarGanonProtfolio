/* Shared case-study shell: the project opener, the "Up next" turntable and its
   departure, and text reveals. Classes and the Web Animations API only; all styling lives in site-shell.css. */
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const ease = 'cubic-bezier(.22,1,.36,1)';
  const root = document.documentElement;
  const hero = document.querySelector('main > *');

  /* ---------- text reveals: skip anything inside a sticky/fixed scene (the pages' own animations) ---------- */
  const inScene = el => { for (let n = el.parentElement; n && n !== document.body; n = n.parentElement) { const p = getComputedStyle(n).position; if (p === 'sticky' || p === 'fixed') return true; } return false; };
  const items = [...document.querySelectorAll('main :is(h2, h3, blockquote, p)')]
    .filter(el => !(hero && hero.contains(el)) && !el.closest('[data-arrival], .ng-next, dialog, svg, [aria-hidden="true"]'))
    .filter(el => !el.parentElement.closest(':is(h2, h3, blockquote, p)') && !inScene(el));
  if (!reduced && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('ng-in'); io.unobserve(e.target); } }), { threshold: .15, rootMargin: '0px 0px -6% 0px' });
    items.forEach(el => { if (el.getBoundingClientRect().top > innerHeight) { el.classList.add('ng-rise'); io.observe(el); } });
  }

  /* ---------- arrival: always start at the top ---------- */
  let arrive = null;
  try { arrive = sessionStorage.getItem('ng-arrive'); sessionStorage.removeItem('ng-arrive'); } catch (e) {}
  const toTop = () => { window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); root.scrollTop = 0; document.body.scrollTop = 0; };
  const settle = () => root.classList.remove('ng-arriving');
  if (arrive) {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    toTop();
  }
  /* ---------- the opener: the name is typed and stays, the description and action are already there, and half a record
     turns at the edge giving off glowing notes. Scrolling just carries on into the page. ---------- */
  const open = document.querySelector('.ng-open');
  settle();
  if (open) {
    const deck = open.querySelector('.ng-open__deck');
    const nameEl = open.querySelector('.ng-open__name');
    const name = nameEl.dataset.text || '';
    /* the last word of the name is set in the serif, in the project's colour (a lone word keeps only its # for that) */
    let cut = name.lastIndexOf(' ') + 1;
    if (cut === 0) cut = /#$/.test(name) ? name.length - 1 : 0;
    const span = (cls, t) => { const e = document.createElement('span'); if (cls) e.className = cls; e.textContent = t; return e; };
    const showName = (n, c) => { nameEl.textContent = name.slice(0, Math.min(n, cut)); if (n > cut) nameEl.append(span('ng-em', name.slice(cut, n))); if (c) nameEl.append(span('ng-caret', '')); };
    if (name.trim().split(/\s+/).length >= 3) nameEl.classList.add('is-long');
    if (reduced) showName(name.length, false);
    else {
      deck.animate([{ opacity: 0, transform: 'rotate(-50deg) scale(.85)' }, { opacity: 1, transform: 'rotate(0deg) scale(1)' }], { duration: 1300, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards' });
      let n = 0; showName(0, true);
      const typeName = () => { showName(++n, n < name.length); if (n < name.length) setTimeout(typeName, 70); };
      setTimeout(typeName, 400);
      /* notes: born on the visible half of the rim, they drift out and up with a glow, only while it is on screen */
      const notesBox = open.querySelector('.ng-open__notes'), glyphs = ['\u266A', '\u266B', '\u2669', '\u266C'];
      let onScreen = true, last = 0;
      if ('IntersectionObserver' in window) new IntersectionObserver(es => { onScreen = es[0].isIntersecting; }).observe(open);
      const emit = now => {
        if (onScreen && document.visibilityState === 'visible' && now - last > 360) {
          last = now;
          const box = open.getBoundingClientRect(), v = deck.getBoundingClientRect();
          const R = v.width / 2, cx = v.left - box.left + R, cy = v.top - box.top + R;
          const phone = innerWidth <= 800;
          const a = phone ? Math.PI * (1.08 + Math.random() * .84) : Math.PI * (.62 + Math.random() * .9);
          const x = cx + Math.cos(a) * R, y = cy + Math.sin(a) * R;
          const el = span('ng-note', glyphs[Math.floor(Math.random() * glyphs.length)]);
          notesBox.append(el);
          const d = 60 + Math.random() * 110, dx = Math.cos(a) * d, dy = Math.sin(a) * d - 70 - Math.random() * 80;
          const r0 = (Math.random() * 40 - 20).toFixed(0), r1 = (Math.random() * 60 - 30).toFixed(0);
          el.animate([{ transform: `translate(${x.toFixed(0)}px, ${y.toFixed(0)}px) scale(.5) rotate(${r0}deg)`, opacity: 0 },
                      { opacity: 1, offset: .2 },
                      { transform: `translate(${(x + dx).toFixed(0)}px, ${(y + dy).toFixed(0)}px) scale(1.1) rotate(${r1}deg)`, opacity: 0 }],
                     { duration: 2600 + Math.random() * 1400, easing: 'cubic-bezier(.2,.7,.3,1)', fill: 'forwards' }).finished.then(() => el.remove()).catch(() => {});
        }
        requestAnimationFrame(emit);
      };
      requestAnimationFrame(emit);
    }
  }

  /* =====================================================================================================
     CASE STUDIES v2 (body.ng-v2)
     ===================================================================================================== */
  if (document.body.classList.contains('ng-v2')) {
    const glide = 'cubic-bezier(.22,1,.36,1)', spring = 'cubic-bezier(.34,1.56,.64,1)';
    /* the ground: two soft lights and rising dots, fixed behind the whole page */
    const lights = document.createElement('div'); lights.className = 'ng-lights'; lights.setAttribute('aria-hidden', 'true');
    lights.innerHTML = '<i class="a"></i><i class="b"></i>'; document.body.prepend(lights);
    if (!reduced) {
      const field = document.createElement('div'); field.className = 'ng-starfield'; field.setAttribute('aria-hidden', 'true');
      for (let k = 0; k < 60; k++) {
        const st = document.createElement('i'); if (k % 2) st.classList.add('c'); if (k % 3 === 0) st.classList.add('s'); field.append(st);
        const x = Math.random() * innerWidth, drift = Math.random() * 80 - 40, dur = 9000 + Math.random() * 12000;
        st.animate([{ transform: `translate(${x.toFixed(0)}px, 20px)`, opacity: 0 }, { opacity: 1, offset: .15 }, { opacity: .8, offset: .8 },
                    { transform: `translate(${(x + drift).toFixed(0)}px, ${-(innerHeight + 40)}px)`, opacity: 0 }],
                   { duration: dur, delay: -Math.random() * dur, iterations: Infinity, easing: 'linear' });
      }
      document.body.prepend(field);
      /* like the landing page, the dots answer the scroll: they rush with it and drift back to their own pace */
      const anims = [...field.children].flatMap(d => d.getAnimations());
      let lastY = scrollY, rate = 1, target = 1, tick = 0;
      const ease = () => { rate += (target - rate) * .12; target += (1 - target) * .06;
        anims.forEach(an => { an.playbackRate = rate; });
        if (Math.abs(rate - 1) > .02 || Math.abs(target - 1) > .02) tick = requestAnimationFrame(ease); else { tick = 0; anims.forEach(an => { an.playbackRate = 1; }); } };
      addEventListener('scroll', () => { const dy = scrollY - lastY; lastY = scrollY;
        target = Math.max(-6, Math.min(8, 1 + dy * .35)); if (!tick) tick = requestAnimationFrame(ease); }, { passive: true });
    }

    const ambientLights=document.querySelector('.ng-lights'),ambientStars=document.querySelector('.ng-starfield');
    const sceneSelectors='.ng-hd,.ht-overview:not(.sg-overview),.sc-overview,.sg-gallery-reveal,.ad-drink-choice,.ad-pour-section,.ad-driving-question,.ad-game-showcase';
    const scenes=[...document.querySelectorAll(sceneSelectors)];const activeScenes=new Set();
    if('IntersectionObserver'in window){const ambientObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting)activeScenes.add(entry.target);else activeScenes.delete(entry.target)});const active=activeScenes.size>0;document.body.classList.toggle('ng-reading',!active);if(ambientStars)ambientStars.getAnimations({subtree:true}).forEach(animation=>active?animation.play():animation.pause());if(ambientLights)ambientLights.getAnimations({subtree:true}).forEach(animation=>active?animation.play():animation.pause());},{threshold:.08});scenes.forEach(scene=>ambientObserver.observe(scene));}

    /* Original word, description, falling-tag and button entrance animations. */
    const hd = document.querySelector('.ng-hd');
    if (hd && !reduced) {
      const words = [...hd.querySelectorAll('.ng-hd__name .w')], rnd = (a, b) => a + Math.random() * (b - a);
      words.forEach((w, i) => w.animate([{ transform: `translate3d(${rnd(-280, 280).toFixed(0)}px, ${rnd(-120, 120).toFixed(0)}px, -700px) rotateY(${rnd(-30, 30).toFixed(0)}deg)`, opacity: 0, filter: 'blur(10px)' },
        { transform: 'none', opacity: 1, filter: 'blur(0px)' }], { duration: 1100, delay: 200 + i * 110, easing: glide, fill: 'backwards' }));
      const t0 = 700 + words.length * 110;
      hd.querySelector('.ng-hd__d')?.animate([{ transform: 'translateY(18px)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 800, delay: t0, easing: glide, fill: 'backwards' });
      const tags = [...hd.querySelectorAll('.ng-hd__tags li')];
      tags.forEach((li, i) => li.animate([{ transform: `translateY(-38vh) rotate(${(i % 2 ? 1 : -1) * (10 + i * 6)}deg)`, opacity: 0 }, { opacity: 1, offset: .4 }, { transform: 'none', opacity: 1 }],
        { duration: 900, delay: t0 + 350 + i * 160, easing: spring, fill: 'backwards' }));
      const tc = t0 + 350 + tags.length * 160 + 300;
      const btn = hd.querySelector('.ng-try');
      if (btn) btn.animate([{ transform: 'scale(.6)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 600, delay: tc, easing: spring, fill: 'backwards' });
    }

    root.classList.remove('ng-hero-pending');

    /* the game: its sky and falling stars cover only the showcase's stretch of the page (positions fed to CSS) */
    const sky = document.querySelector('.sg-gallery-reveal'), world = document.querySelector('.sg-reading-world');
    if (sky && world) {
      const skyLayer=document.createElement('div');skyLayer.className='sg-showcase-sky';skyLayer.setAttribute('aria-hidden','true');document.body.append(skyLayer);
      const place = () => {
        const w = world.getBoundingClientRect(), r = sky.getBoundingClientRect(), pad = 120;
        const next = document.querySelector('.sg-case-layer'), stop = next ? next.getBoundingClientRect().top : w.bottom;
        const top = r.top - pad, bottom = Math.min(r.bottom + pad, w.bottom, stop);   /* fade out before the write-up begins */
        world.style.setProperty('--sky-y', (top - w.top).toFixed(0) + 'px');
        world.style.setProperty('--sky-h', (bottom - top).toFixed(0) + 'px');
        document.body.style.setProperty('--sky-top', Math.max(0, top).toFixed(0) + 'px');
        document.body.style.setProperty('--sky-bot', Math.max(0, innerHeight - bottom).toFixed(0) + 'px');
      };
      let raf = 0; const q = () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; place(); }); };
      addEventListener('scroll', q, { passive: true }); addEventListener('resize', q); addEventListener('load', place); place();
    }

    /* Announce copying only when the clipboard confirms success. */
    document.querySelectorAll('.ng-end__copy').forEach(button=>button.addEventListener('click',async()=>{
      const status=button.closest('.ng-end__ct')?.querySelector('.ng-copy-status');
      button.disabled=true;
      try{if(!navigator.clipboard?.writeText)throw new Error('Clipboard unavailable');await navigator.clipboard.writeText(button.dataset.mail);if(status)status.textContent='Email copied.';button.textContent='Copied';setTimeout(()=>button.textContent='Copy email',1600);}
      catch{if(status)status.textContent='Could not copy. You can use the email link above.';button.textContent='Copy failed';setTimeout(()=>button.textContent='Copy email',2200);}
      finally{button.disabled=false;}
    }));
  }

  /* ---------- leaving from the turntable: the record comes to the centre, tiles orbit it, the next project's colour washes out ---------- */
  async function depart(fromImg, href){
    const slug = (href.match(/([a-z]+)-case-study/) || [])[1] || '';
    try { sessionStorage.setItem('ng-arrive', slug || '1'); } catch (e) {}
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    if (reduced) { location.href = href; return; }
    const r = fromImg.closest('.ng-disc').getBoundingClientRect();
    const o = document.createElement('div'); o.className = 'ng-depart acc-' + slug; o.setAttribute('aria-hidden', 'true');
    const dim = document.createElement('div'); dim.className = 'ng-depart__dim';
    const rec = document.createElement('div'); rec.className = 'ng-depart__rec';
    const orbit = document.createElement('div'); orbit.className = 'ng-depart__orbit';
    for (let k = 0; k < 4; k++) { const s = document.createElement('span'); s.className = 'ng-depart__sat'; orbit.append(s); }
    const disc = document.createElement('span'); disc.className = 'ng-disc';
    const im = document.createElement('img'); im.alt = ''; im.src = fromImg.currentSrc || fromImg.src; disc.append(im);
    rec.append(orbit, disc);
    const wash = document.createElement('div'); wash.className = 'ng-wash';
    o.append(dim, rec, wash); document.body.append(o);
    const S = Math.min(innerWidth, innerHeight) * .34, X = (innerWidth - S) / 2, Y = (innerHeight - S) / 2;
    await dim.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 450, easing: 'ease', fill: 'forwards' }).finished.catch(() => {});
    await rec.animate([{ left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px' },
                       { left: X + 'px', top: Y + 'px', width: S + 'px', height: S + 'px' }],
                      { duration: 750, easing: 'cubic-bezier(.65,0,.25,1)', fill: 'forwards' }).finished.catch(() => {});
    o.classList.add('is-orbit');
    await wait(850);
    const far = Math.hypot(innerWidth, innerHeight);
    rec.animate([{ transform: 'scale(1)', opacity: 1 }, { transform: 'scale(.6)', opacity: 0 }], { duration: 600, easing: 'cubic-bezier(.6,0,.4,1)', fill: 'forwards' });
    await wash.animate([{ clipPath: `circle(${S / 2}px at 50% 50%)`, opacity: 0 }, { clipPath: `circle(${S / 2}px at 50% 50%)`, opacity: 1, offset: .15 }, { clipPath: `circle(${far}px at 50% 50%)`, opacity: 1 }],
                       { duration: 750, easing: 'cubic-bezier(.65,0,.35,1)', fill: 'forwards' }).finished.catch(() => {});
    location.href = href;
  }
  window.ngDepart = depart;

  /* ---------- up next: cue a record, then play it ---------- */
  const next = document.querySelector('.ng-next');
  if (!next) return;
  const on = next.querySelector('.ng-onplatter'), onImg = on.querySelector('img');
  const cueName = next.querySelector('.ng-cue__name'), cueType = next.querySelector('.ng-cue__type'), playBtn = next.querySelector('.ng-play');
  const crates = [...next.querySelectorAll('.ng-crec')];
  let busy = false;

  function cue(rec){
    crates.forEach(c => c.classList.toggle('is-cued', c === rec));
    onImg.src = rec.dataset.img; cueName.textContent = rec.dataset.name; cueType.textContent = rec.dataset.type;
    playBtn.href = rec.getAttribute('href'); on.dataset.href = rec.getAttribute('href');
    on.setAttribute('aria-label', 'Play ' + rec.dataset.name);
    on.classList.remove('is-swapping'); void on.offsetWidth; on.classList.add('is-swapping');
  }
  function play(href){ if (busy) return; busy = true; depart(onImg, href); }

  crates.forEach(rec => rec.addEventListener('click', async e => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    if (busy) return;
    cue(rec);
    await wait(450);
    play(rec.getAttribute('href'));
  }));
  on.addEventListener('click', () => play(on.dataset.href));
  playBtn.addEventListener('click', e => { if (e.metaKey || e.ctrlKey || e.shiftKey) return; e.preventDefault(); play(playBtn.getAttribute('href')); });
  addEventListener('pageshow', e => { if (e.persisted) { busy = false; document.querySelectorAll('.ng-depart').forEach(z => z.remove()); } });
})();
