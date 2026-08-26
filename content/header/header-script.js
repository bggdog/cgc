(function () {
  var header = document.querySelector(".Header_Header__RCJxb");
  if (!header) return;

  var cont = header.querySelector(".Header_Cont__oIO12");
  var menuBtn = header.querySelector(".Header_MenuButton__3xFfC");
  var menu = header.querySelector(".Menu_Menu___Nwdq");
  var bar = header.querySelector(".ProgressBar_Bar__lPLis");
  var progress = header.querySelector(".ProgressBar_Progress__pez_8");

  function setOpen(open) {
    if (!cont || !menu) return;
    cont.classList.toggle("Header_MenuOpen__IS_k9", open);
    menu.classList.toggle("Menu_Open__12jRk", open);
    if (menuBtn) menuBtn.textContent = open ? "Close" : "Menu";
    document.documentElement.classList.toggle("cg-menu-open", open);
  }

  if (menuBtn) {
    menuBtn.addEventListener("click", function () {
      setOpen(!menu.classList.contains("Menu_Open__12jRk"));
    });
  }

  header.querySelectorAll(".Menu_Chevron__vHOgg").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      var li = btn.closest("li");
      if (!li) return;
      var smooth = li.querySelector(".SmoothOpen_SmoothOpen__1J7VQ");
      if (!smooth) return;
      smooth.classList.toggle("SmoothOpen_isOpen__eFutI");
      var svg = btn.querySelector("svg");
      if (svg) {
        svg.style.rotate = smooth.classList.contains("SmoothOpen_isOpen__eFutI")
          ? "90deg"
          : "-90deg";
      }
    });
  });

  menu &&
    menu.addEventListener("click", function (e) {
      var link = e.target.closest("a");
      if (!link) return;
      if (window.matchMedia("(max-width: 1024px)").matches) {
        setOpen(false);
      }
    });

  var linkedIn = "https://www.linkedin.com/in/carrie-grace-28199826b/";
  var instagram = "https://www.instagram.com/carriegracelife/";
  header
    .querySelectorAll(
      ".Header_SocialsMobile__0QYKc a, .Menu_Menu___Nwdq > ul > li.social a"
    )
    .forEach(function (link) {
      var label = (link.getAttribute("aria-label") || "").toLowerCase();
      if (label.indexOf("linkedin") !== -1) link.href = linkedIn;
      else if (label.indexOf("instagram") !== -1) link.href = instagram;
      if (label.indexOf("linkedin") !== -1 || label.indexOf("instagram") !== -1) {
        link.target = "_blank";
        link.rel = "noopener noreferrer";
      }
    });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") setOpen(false);
  });

  function onScroll() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    if (bar) bar.style.width = pct + "%";
    if (progress) {
      progress.classList.toggle("ProgressBar_Visible__1Oewf", window.scrollY > 8);
    }
    header.classList.toggle("Header_HasScrolled__zlgoA", window.scrollY > 8);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();
