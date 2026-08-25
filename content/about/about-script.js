(function(){
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.querySelector('.cg-about');
  if (!root) return;

  /* split statement for scroll illumination */
  var st = root.querySelector('[data-illuminate]');
  var words = st.textContent.trim().split(/\s+/);
  st.textContent = '';
  var spans = words.map(function(w){
    var s = document.createElement('span');
    s.className = 'wd'; s.textContent = w;
    st.appendChild(s); st.appendChild(document.createTextNode(' '));
    return s;
  });

  /* reveals */
  var sections = root.querySelectorAll('[data-reveal]');
  if (!('IntersectionObserver' in window) || reduce){
    sections.forEach(function(el){ el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    sections.forEach(function(el){ io.observe(el); });
  }
  if (reduce){
    spans.forEach(function(s){ s.classList.add('lit'); });
    return;
  }

  /* scroll: illuminate statement */
  var ticking = false;
  function frame(){
    var vh = window.innerHeight;
    var r = st.getBoundingClientRect();
    var prog = (vh * 0.9 - r.top) / (vh * 0.26);
    prog = Math.min(Math.max(prog, 0), 1);
    var maxScroll = document.documentElement.scrollHeight - vh;
    if (maxScroll > 0 && window.scrollY >= maxScroll - 4) prog = 1;
    var lit = prog > 0.94 ? spans.length : Math.round(prog * spans.length);
    spans.forEach(function(s, i){ s.classList.toggle('lit', i < lit); });
    ticking = false;
  }
  window.addEventListener('scroll', function(){
    if (!ticking){ ticking = true; requestAnimationFrame(frame); }
  }, { passive:true });
  window.addEventListener('resize', frame);
  frame();

  /* magnetic CTA, clamped */
  if (matchMedia('(pointer:fine)').matches){
    var MAX = 10, strength = 0.18;
    function clampPull(v){ return Math.max(-MAX, Math.min(MAX, v)); }
    root.querySelectorAll('[data-magnetic]').forEach(function(cta){
      cta.addEventListener('mousemove', function(e){
        var r = cta.getBoundingClientRect();
        cta.style.transform = 'translate(' +
          clampPull((e.clientX - (r.left + r.width/2)) * strength) + 'px,' +
          clampPull((e.clientY - (r.top + r.height/2)) * strength) + 'px)';
      });
      cta.addEventListener('mouseleave', function(){
        cta.style.transition = 'transform .6s cubic-bezier(.22,1,.36,1)';
        cta.style.transform = 'translate(0,0)';
        setTimeout(function(){ cta.style.transition = ''; }, 600);
      });
    });
  }
})();
