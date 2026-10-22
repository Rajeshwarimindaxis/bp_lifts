document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav-links");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.textContent = isOpen ? "×" : "☰";
    });
    // Close mobile nav when clicking a leaf link (excluding the dropdown toggle)
    nav.querySelectorAll("a:not(.nav-dropdown-toggle)").forEach(link => link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.textContent = "☰";
    }));
  }

  // Handle dropdown toggling on mobile / touch
  const dropdowns = document.querySelectorAll(".nav-dropdown");
  dropdowns.forEach(dropdown => {
    const dropdownToggle = dropdown.querySelector(".nav-dropdown-toggle");
    if (dropdownToggle) {
      dropdownToggle.addEventListener("click", (e) => {
        // On mobile viewports, toggle the accordion dropdown instead of direct navigation
        if (window.innerWidth <= 920) {
          e.preventDefault();
          const wasOpen = dropdown.classList.contains("dropdown-open");
          // Close other dropdowns
          dropdowns.forEach(d => {
            d.classList.remove("dropdown-open");
            const btn = d.querySelector(".nav-dropdown-toggle");
            if (btn) btn.setAttribute("aria-expanded", "false");
          });
          if (!wasOpen) {
            dropdown.classList.add("dropdown-open");
            dropdownToggle.setAttribute("aria-expanded", "true");
          }
        }
      });
    }
  });

  // Close open dropdowns if user clicks outside
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".nav-dropdown")) {
      dropdowns.forEach(d => {
        d.classList.remove("dropdown-open");
        const btn = d.querySelector(".nav-dropdown-toggle");
        if (btn) btn.setAttribute("aria-expanded", "false");
      });
    }
  });

  // Close dropdown on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      dropdowns.forEach(d => {
        d.classList.remove("dropdown-open");
        const btn = d.querySelector(".nav-dropdown-toggle");
        if (btn) btn.setAttribute("aria-expanded", "false");
      });
    }
  });

  const backTop = document.querySelector(".back-top");
  if (backTop) {
    const update = () => backTop.classList.toggle("visible", window.scrollY > 350);
    window.addEventListener("scroll", update, { passive: true });
    update();
    backTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  document.querySelectorAll("[data-year]").forEach(el => el.textContent = new Date().getFullYear());

  // Functional quote/inquiry form email handler
  document.querySelectorAll(".quote-form").forEach(form => {
    form.addEventListener("submit", event => {
      event.preventDefault();
      const name = form.querySelector('[name="name"]')?.value || 'Client';
      const phone = form.querySelector('[name="phone"]')?.value || '';
      const email = form.querySelector('[name="email"]')?.value || '';
      const type = form.querySelector('[name="type"]')?.value || 'Elevator Requirement';
      const building = form.querySelector('[name="building"]')?.value || 'Not specified';
      const floors = form.querySelector('[name="floors"]')?.value || 'Not specified';
      const location = form.querySelector('[name="location"]')?.value || 'Pune';
      const message = form.querySelector('[name="message"]')?.value || 'No additional notes';

      const subject = encodeURIComponent(`Elevator Enquiry: ${type} - ${name}`);
      const body = encodeURIComponent(
        `Dear BP LIFTS Team,\n\n` +
        `I would like to request a quotation / consultation for elevator services in Pune:\n\n` +
        `--- CLIENT & PROJECT DETAILS ---\n` +
        `Full Name: ${name}\n` +
        `Phone Number: ${phone}\n` +
        `Email Address: ${email}\n` +
        `Requirement: ${type}\n` +
        `Building Type: ${building}\n` +
        `Number of Floors: ${floors}\n` +
        `Location in Pune: ${location}\n\n` +
        `Notes / Specifics:\n${message}\n\n` +
        `Please contact me at your earliest convenience.\n`
      );

      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=bpliftspune@gmail.com&su=${subject}&body=${body}`;
      const mailtoUrl = `mailto:bpliftspune@gmail.com?subject=${subject}&body=${body}`;

      // Attempt to open Gmail web compose first (works everywhere), fallback to mailto
      const win = window.open(gmailUrl, '_blank');
      if (!win) {
        window.location.href = mailtoUrl;
      }
      alert(`Thank you, ${name}! Your elevator enquiry has been prepared and opened in your email to send directly to bpliftspune@gmail.com.`);
      form.reset();
    });
  });
});
