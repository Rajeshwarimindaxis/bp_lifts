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

      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=info@bplifts.co.in&su=${subject}&body=${body}`;
      const mailtoUrl = `mailto:info@bplifts.co.in?subject=${subject}&body=${body}`;

      // Attempt to open Gmail web compose first (works everywhere), fallback to mailto
      const win = window.open(gmailUrl, '_blank');
      if (!win) {
        window.location.href = mailtoUrl;
      }
      alert(`Thank you, ${name}! Your elevator enquiry has been prepared and opened in your email to send directly to info@bplifts.co.in.`);
      form.reset();
    });
  });

  // Setup Email Action Modal for Floating Email Button & Mailto Links
  setupEmailActionModal();
});

function setupEmailActionModal() {
  if (!document.getElementById("emailModal")) {
    const modalHtml = `
      <div class="email-modal-overlay" id="emailModal" aria-hidden="true" role="dialog" aria-labelledby="emailModalTitle">
        <div class="email-modal-card">
          <div class="email-modal-header">
            <div>
              <h3 id="emailModalTitle">Contact BP LIFTS via Email</h3>
              <p>info@bplifts.co.in</p>
            </div>
            <button type="button" class="email-modal-close" id="closeEmailModal" aria-label="Close dialog">✕</button>
          </div>
          <div class="email-modal-body">
            <p class="email-modal-desc">Choose how you'd like to send your inquiry to our elevator engineering team:</p>
            <div class="email-options-grid">
              <a href="https://mail.google.com/mail/?view=cm&fs=1&to=info@bplifts.co.in&su=Elevator%20Inquiry%20-%20BP%20LIFTS" target="_blank" rel="noopener noreferrer" class="email-option-card">
                <span class="email-opt-icon">📧</span>
                <div class="email-opt-info">
                  <b>Open in Gmail Web</b>
                  <span>Direct browser compose with pre-filled address</span>
                </div>
                <span class="email-opt-arrow">↗</span>
              </a>

              <a href="mailto:info@bplifts.co.in?subject=Elevator%20Inquiry%20-%20BP%20LIFTS" class="email-option-card">
                <span class="email-opt-icon">💻</span>
                <div class="email-opt-info">
                  <b>Default Mail App</b>
                  <span>Outlook, Windows Mail, or Apple Mail</span>
                </div>
                <span class="email-opt-arrow">↗</span>
              </a>

              <button type="button" class="email-option-card" id="copyEmailModalBtn">
                <span class="email-opt-icon">📋</span>
                <div class="email-opt-info">
                  <b id="copyLabelText">Copy Email Address</b>
                  <span>info@bplifts.co.in</span>
                </div>
                <span class="email-opt-arrow" id="copyIconState">📄</span>
              </button>

              <a href="contact.html#quote" class="email-option-card">
                <span class="email-opt-icon">📝</span>
                <div class="email-opt-info">
                  <b>Online Quote &amp; Site Visit Form</b>
                  <span>Send detailed specs &amp; get a quick call back</span>
                </div>
                <span class="email-opt-arrow">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div class="email-toast" id="emailToast">✓ Copied info@bplifts.co.in to clipboard!</div>
    `;
    document.body.insertAdjacentHTML("beforeend", modalHtml);
  }

  const modal = document.getElementById("emailModal");
  const closeBtn = document.getElementById("closeEmailModal");
  const copyBtn = document.getElementById("copyEmailModalBtn");
  const toast = document.getElementById("emailToast");

  function openModal() {
    if (modal) {
      modal.classList.add("is-active");
      modal.setAttribute("aria-hidden", "false");
    }
  }

  function closeModal() {
    if (modal) {
      modal.classList.remove("is-active");
      modal.setAttribute("aria-hidden", "true");
    }
  }

  function showToast(msg) {
    if (toast) {
      toast.textContent = msg || "✓ Copied info@bplifts.co.in to clipboard!";
      toast.classList.add("is-show");
      setTimeout(() => toast.classList.remove("is-show"), 2800);
    }
  }

  // Bind to floating email buttons
  document.querySelectorAll(".float-email, .btn-email-action").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      openModal();
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", closeModal);
  }

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal && modal.classList.contains("is-active")) {
      closeModal();
    }
  });

  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      const email = "info@bplifts.co.in";
      navigator.clipboard.writeText(email).then(() => {
        const copyLabel = document.getElementById("copyLabelText");
        const copyIcon = document.getElementById("copyIconState");
        if (copyLabel) copyLabel.textContent = "Copied to Clipboard!";
        if (copyIcon) copyIcon.textContent = "✓";
        showToast("✓ Copied info@bplifts.co.in to clipboard!");
        setTimeout(() => {
          if (copyLabel) copyLabel.textContent = "Copy Email Address";
          if (copyIcon) copyIcon.textContent = "📄";
        }, 2200);
      }).catch(() => {
        showToast("info@bplifts.co.in");
      });
    });
  }
}
