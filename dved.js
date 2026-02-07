// =========================
// YEAR (safe)
// =========================
(() => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();

// =========================
// VIDEO MODAL (MP4 + COLOR-CODED SOFTWARE TEXT + LOOP)
// =========================
(() => {
  const tiles = document.querySelectorAll(".tile");
  const modal = document.getElementById("videoModal");
  const container = document.getElementById("videoContainer");
  const closeBtn = document.getElementById("closeModal");

  const madeWithText = document.getElementById("madeWithText");
  const madeWithLogo = document.getElementById("madeWithLogo"); // optional

  if (!tiles.length || !modal || !container || !closeBtn) return;

  const SOFTWARE_COLORS = {
    "After Effects": "#9999ff",
    Blender: "#ea7600",
    "Alight Motion": "#00d985",
    Avu: "#49a9ff",
  };

  function getScrollbarWidth() {
    return window.innerWidth - document.documentElement.clientWidth;
  }

  function lockScroll() {
    const w = getScrollbarWidth();
    document.body.style.paddingRight = w > 0 ? `${w}px` : "";
    document.body.style.overflow = "hidden";
  }

  function unlockScroll() {
    document.body.style.paddingRight = "";
    document.body.style.overflow = "";
  }

  function closeVideoModal() {
    modal.classList.remove("active");
    container.innerHTML = "";
    unlockScroll();

    if (madeWithText) madeWithText.innerHTML = "Made with";
    if (madeWithLogo) {
      madeWithLogo.src = "";
      madeWithLogo.alt = "";
      madeWithLogo.style.display = "none";
    }
  }

  function setMadeWith(text) {
    if (!madeWithText) return;

    if (!text) {
      madeWithText.textContent = "Made with";
      return;
    }

    const names = text
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    let html = `<span style="font-weight:700;">Made with </span>`;

    names.forEach((name, index) => {
      const color = SOFTWARE_COLORS[name] || "#ffffff";
      html += `<span style="color:${color}; font-weight:900;">${name}</span>`;
      if (index < names.length - 1) html += ", ";
    });

    html += ".";
    madeWithText.innerHTML = html;
  }

  tiles.forEach((tile) => {
    tile.addEventListener("click", () => {
      const videoSrc = tile.getAttribute("data-video");
      const softwareName = tile.getAttribute("data-software-name");
      if (!videoSrc) return;

      container.innerHTML = `
        <video controls autoplay loop playsinline>
          <source src="${videoSrc}" type="video/mp4">
          Your browser does not support the video tag.
        </video>
      `;

      setMadeWith(softwareName);

      modal.classList.add("active");
      lockScroll();
    });
  });

  closeBtn.addEventListener("click", closeVideoModal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeVideoModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) {
      closeVideoModal();
    }
  });
})();

// =========================
// CONTACT FORM (Formspree REAL SEND)
// =========================
(() => {
  const form = document.getElementById("contactForm");
  const hint = document.getElementById("formHint");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (hint) hint.textContent = "Sending…";

    try {
      const res = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        form.reset();
        if (hint) hint.textContent = "✅ Message sent! I’ll reply soon.";
      } else {
        if (hint) hint.textContent = "❌ Failed to send. Try again.";
      }
    } catch (err) {
      if (hint) hint.textContent = "❌ Network error. Try again.";
    }
  });
})();

// =========================
// YOUTUBE THUMBNAILS + SCROLL BUTTONS
// =========================
(() => {
  const scroller = document.getElementById("ytScroll");
  if (!scroller) return;

  // thumbnails from data-yt
  scroller.querySelectorAll(".yt-card").forEach((card) => {
    const id = card.getAttribute("data-yt");
    const img = card.querySelector(".yt-thumb");
    if (!id || !img) return;

    img.src = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
    img.loading = "lazy";
  });

  const prev = document.querySelector(".yt-prev");
  const next = document.querySelector(".yt-next");
  if (!prev || !next) return;

  const getStep = () => {
    const firstCard = scroller.querySelector(".yt-card");
    return firstCard ? firstCard.getBoundingClientRect().width + 16 : 380;
  };

  prev.addEventListener("click", () => {
    scroller.scrollBy({ left: -getStep(), behavior: "smooth" });
  });

  next.addEventListener("click", () => {
    scroller.scrollBy({ left: getStep(), behavior: "smooth" });
  });
})();


(() => {
  document.querySelectorAll(".uop-video").forEach((card) => {
    card.addEventListener("click", () => {
      const src = card.getAttribute("data-video");
      if (!src) return;

      // prevent re-loading if already playing
      if (card.querySelector("video")) return;

      card.innerHTML = `
        <video controls autoplay loop playsinline preload="metadata">
          <source src="${src}" type="video/mp4">
          Your browser does not support the video tag.
        </video>
      `;

      const v = card.querySelector("video");
      if (v) v.play().catch(() => {});
    });
  });
})();
