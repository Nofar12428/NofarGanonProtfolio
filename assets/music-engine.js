window.NGMusic = (() => {
  let ctx, master, timer, stopTimer, analyser, duckGain, ducked=false, step = 0, next = 0;
  const S16 = 60/78/4, CH = [[53,57,60,64],[52,55,59,62],[50,53,57,60],[48,52,55,59]], hz = n => 440*Math.pow(2, (n - 69)/12);
  function keys(t, notes, dur){ for (const n of notes) { const o = ctx.createOscillator(), o2 = ctx.createOscillator(), g = ctx.createGain(), f = ctx.createBiquadFilter();
    o.type = 'sine'; o2.type = 'triangle'; o.frequency.value = hz(n); o2.frequency.value = hz(n)*1.002; f.type = 'lowpass'; f.frequency.value = 1400;
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.05, t + .02); g.gain.exponentialRampToValueAtTime(.012, t + dur*.7); g.gain.linearRampToValueAtTime(0, t + dur);
    o.connect(f); o2.connect(f); f.connect(g); g.connect(master); o.start(t); o2.start(t); o.stop(t + dur + .05); o2.stop(t + dur + .05); } }
  function bass(t, n, dur){ const o = ctx.createOscillator(), g = ctx.createGain(); o.frequency.value = hz(n - 24); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.16, t + .02); g.gain.exponentialRampToValueAtTime(.001, t + dur); o.connect(g); g.connect(master); o.start(t); o.stop(t + dur); }
  function kick(t){ const o = ctx.createOscillator(), g = ctx.createGain(); o.frequency.setValueAtTime(110, t); o.frequency.exponentialRampToValueAtTime(42, t + .18); g.gain.setValueAtTime(.38, t); g.gain.exponentialRampToValueAtTime(.001, t + .35); o.connect(g); g.connect(master); o.start(t); o.stop(t + .4); }
  function noise(t, dur, freq, gain, type){ const b = ctx.createBuffer(1, ctx.sampleRate*dur, ctx.sampleRate), d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = (Math.random()*2 - 1)*Math.pow(1 - i/d.length, 3);
    const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain(); s.buffer = b; f.type = type; f.frequency.value = freq; g.gain.value = gain; s.connect(f); f.connect(g); g.connect(master); s.start(t); }
  function schedule(){ while (next < ctx.currentTime + .15) { const bar = Math.floor(step/16) % 4, s = step % 16, ch = CH[bar];
    if (s === 0) { keys(next, ch, S16*14); bass(next, ch[0], S16*6); } if (s === 10) { keys(next, [ch[1] + 12, ch[3]], S16*5); bass(next, ch[2], S16*4); }
    if (s === 0 || s === 7 || s === 10) kick(next); if (s === 4 || s === 12) noise(next + .012, .22, 1800, .22, 'bandpass'); if (s % 2 === 0) noise(next, .05, 7000, s % 4 ? .05 : .08, 'highpass');
    next += S16; step++; } }
  return { on:false,
    unlock(){if(this.on&&ctx&&ctx.state==='suspended')ctx.resume().catch(()=>{});},
    setDucked(value){ducked=Boolean(value);if(duckGain&&ctx){duckGain.gain.cancelScheduledValues(ctx.currentTime);duckGain.gain.setTargetAtTime(ducked?.04:1,ctx.currentTime,.12);}}, get analyser(){return analyser},
    start(){ clearTimeout(stopTimer);if(this.on){this.unlock();return;}if (!ctx) { ctx = new (window.AudioContext || window.webkitAudioContext)(); master = ctx.createGain(); master.gain.value = 0; const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 5200; duckGain=ctx.createGain();duckGain.gain.value=ducked?.04:1;master.connect(duckGain);duckGain.connect(lp); analyser=ctx.createAnalyser();analyser.fftSize=256;lp.connect(analyser);analyser.connect(ctx.destination); }
      ctx.resume().catch(()=>{}); master.gain.cancelScheduledValues(ctx.currentTime); master.gain.linearRampToValueAtTime(.8, ctx.currentTime + 1.2); next = ctx.currentTime + .4; step = 0; clearInterval(timer); timer = setInterval(schedule, 40); this.on = true; },
    stop(){ if (!ctx) return; master.gain.cancelScheduledValues(ctx.currentTime); master.gain.linearRampToValueAtTime(0, ctx.currentTime + .6); stopTimer=setTimeout(() => clearInterval(timer), 650); this.on = false; } };
})();