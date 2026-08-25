(function(){
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.querySelector('.cg-zt');
  if (!root) return;

  /* split quote into words */
  var q = root.querySelector('blockquote');
  var words = q.textContent.trim().split(/\s+/);
  q.textContent = '';
  words.forEach(function(w, i){
    var s = document.createElement('span');
    s.className = 'wd';
    s.style.setProperty('--d', Math.min(i * 14, 620) + 'ms');
    s.textContent = w;
    q.appendChild(s); q.appendChild(document.createTextNode(' '));
  });
  root.querySelector('.qcard').style.setProperty('--who-d', Math.min(words.length * 14 + 150, 800) + 'ms');

  /* count animation */
  function runCount(el){
    var from = parseFloat(el.getAttribute('data-from'));
    var to = parseFloat(el.getAttribute('data-to'));
    if (reduce){ el.textContent = to; return; }
    var t0 = null, DUR = 1800;
    function step(t){
      if (!t0) t0 = t;
      var p = Math.min((t - t0) / DUR, 1);
      var e = 1 - Math.pow(1 - p, 3); /* easeOutCubic */
      el.textContent = Math.round(from + (to - from) * e);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* reveals */
  var sections = root.querySelectorAll('[data-reveal]');
  function arm(el){
    el.classList.add('in');
    if (el.classList.contains('proof')){
      el.querySelectorAll('[data-count]').forEach(runCount);
    }
  }
  if (!('IntersectionObserver' in window) || reduce){
    sections.forEach(arm);
  } else {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if (e.isIntersecting){ arm(e.target); io.unobserve(e.target); }
      });
    }, { threshold: 0.2 });
    sections.forEach(function(el){ io.observe(el); });
  }
  if (reduce){
    root.querySelectorAll('[data-count]').forEach(function(el){
      el.textContent = el.getAttribute('data-to');
    });
    return;
  }

  /* hero spotlight */
  var stage = root.querySelector('.stage');
  if (matchMedia('(pointer:fine)').matches){
    stage.addEventListener('pointermove', function(e){
      var r = stage.getBoundingClientRect();
      stage.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
      stage.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
      stage.classList.add('lit');
    });
    stage.addEventListener('pointerleave', function(){ stage.classList.remove('lit'); });
  }

  /* seal rotates with scroll; closing zero drifts */
  var seal = root.querySelector('[data-seal]');
  var layers = root.querySelectorAll('[data-parallax]');
  var ticking = false;
  window.addEventListener('scroll', function(){
    if (ticking) return; ticking = true;
    requestAnimationFrame(function(){
      var y = window.scrollY;
      if (seal) seal.style.transform = 'rotate(' + (y * 0.15) + 'deg)';
      layers.forEach(function(el){
        var host = el.closest('.cpanel') || root;
        var r = host.getBoundingClientRect();
        var prog = window.innerHeight - r.top;
        var s = parseFloat(el.getAttribute('data-parallax')) || 0;
        var rot = parseFloat(el.getAttribute('data-rotate')) || 0;
        el.style.transform = 'translateY(' + (prog * s) + 'px)' + (rot ? ' rotate(' + (prog * rot) + 'deg)' : '');
      });
      ticking = false;
    });
  }, { passive:true });

  /* magnetic CTAs, clamped */
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

  /* smooth-scroll the How It Works ghost link */
  root.querySelectorAll('a[href="#pillars"]').forEach(function(a){
    a.addEventListener('click', function(e){
      var t = document.getElementById('pillars');
      if (t){ e.preventDefault(); t.scrollIntoView({ behavior:'smooth' }); }
    });
  });
})();
