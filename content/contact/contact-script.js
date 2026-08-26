(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var wrap = document.querySelector(".cg-contact [data-reveal]");
  if (wrap) {
    if (!("IntersectionObserver" in window) || reduce) {
      wrap.classList.add("in");
    } else {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (e) {
            if (e.isIntersecting) {
              e.target.classList.add("in");
              io.unobserve(e.target);
            }
          });
        },
        { threshold: 0.15 }
      );
      io.observe(wrap);
    }
  }

  var form = document.getElementById("cg-contact-form");
  var status = document.getElementById("cg-contact-status");
  if (!form || !status) return;

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var submitBtn = form.querySelector(".submit");
    var name = form.querySelector("#cg-name");
    var email = form.querySelector("#cg-email");
    var organization = form.querySelector("#cg-org");
    var message = form.querySelector("#cg-msg");

    if (!name || !email || !message) return;

    status.textContent = "";
    status.className = "status";

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.setAttribute("aria-busy", "true");
    }

    fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.value.trim(),
        email: email.value.trim(),
        organization: organization ? organization.value.trim() : "",
        message: message.value.trim(),
      }),
    })
      .then(function (response) {
        return response.json().then(function (data) {
          return { ok: response.ok, data: data };
        });
      })
      .then(function (result) {
        if (result.ok) {
          status.textContent =
            "Thank you — your message has been sent. We'll be in touch soon.";
          status.classList.add("is-success");
          form.reset();
          return;
        }

        if (result.data && result.data.error === "Email delivery is not configured yet.") {
          var subject = encodeURIComponent("Contact form message from " + name.value.trim());
          var body = encodeURIComponent(
            "Name: " + name.value.trim() +
              "\nEmail: " + email.value.trim() +
              (organization && organization.value.trim()
                ? "\nOrganization: " + organization.value.trim()
                : "") +
              "\n\n" +
              message.value.trim()
          );
          window.location.href =
            "mailto:carrie@carriegraceconsulting.com?subject=" + subject + "&body=" + body;
          return;
        }

        status.textContent =
          result.data && result.data.error
            ? result.data.error
            : "Something went wrong. Please try again or email us directly.";
        status.classList.add("is-error");
      })
      .catch(function () {
        status.textContent =
          "Something went wrong. Please try again or email us directly.";
        status.classList.add("is-error");
      })
      .finally(function () {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.removeAttribute("aria-busy");
        }
      });
  });
})();
