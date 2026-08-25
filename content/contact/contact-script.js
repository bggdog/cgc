(function(){
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var wrap = document.querySelector('.cg-contact [data-reveal]');
  if (!wrap) return;

  if (!('IntersectionObserver' in window) || reduce){
    wrap.classList.add('in');
  } else {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.15 });
    io.observe(wrap);
  }
})();
