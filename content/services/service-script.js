(function(){
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var sections = document.querySelectorAll('.cg-service [data-reveal]');

  function arm(el){
    el.classList.add('in');
    var p = el.querySelector('.panel') || (el.classList.contains('panel') ? el : null);
    if (p) p.classList.add('in');
  }

  if (!('IntersectionObserver' in window) || reduce){
    sections.forEach(arm);
  } else {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if (e.isIntersecting){ arm(e.target); io.unobserve(e.target); }
      });
    }, { threshold: 0.15 });
    sections.forEach(function(el){ io.observe(el); });
  }
  if (reduce) return;

  /* magnetic CTAs, clamped */
  if (matchMedia('(pointer:fine)').matches){
    var MAX = 10, strength = 0.18;
    function clampPull(v){ return Math.max(-MAX, Math.min(MAX, v)); }
    document.querySelectorAll('.cg-service [data-magnetic]').forEach(function(cta){
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
