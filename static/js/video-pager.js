(function () {
  // 支持页面上多个 video-pager 组件
  const pagers = document.querySelectorAll("[data-video-pager]");
  if (!pagers.length) return;

  pagers.forEach((root) => {
    const track = root.querySelector(".vp-track");
    const pages = Array.from(root.querySelectorAll(".vp-page"));
    const videos = Array.from(root.querySelectorAll(".vp-video"));
    const prevBtn = root.querySelector(".vp-prev");
    const nextBtn = root.querySelector(".vp-next");
    const dotsWrap = root.querySelector("[data-vp-dots]");

    let idx = 0;
    const total = pages.length;

    // Build dots
    const dots = [];
    dotsWrap.innerHTML = "";
    for (let i = 0; i < total; i++) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "vp-dot";
      b.setAttribute("aria-label", `Go to page ${i + 1}`);
      b.addEventListener("click", () => {
        idx = i;
        update();
      });
      dotsWrap.appendChild(b);
      dots.push(b);
    }

    function mod(n, m) {
      return ((n % m) + m) % m;
    }

    function stopAllExcept(i) {
      videos.forEach((v, k) => {
        if (k !== i) {
          v.pause();
          try { v.currentTime = 0; } catch (e) {}
        }
      });
    }

    function update() {
      idx = mod(idx, total);

      track.style.transform = `translateX(${-idx * 100}%)`;

      // Update dots
      dots.forEach((d, k) => {
        if (k === idx) d.setAttribute("aria-current", "true");
        else d.removeAttribute("aria-current");
      });

      // Optional: keep only current video playing
      stopAllExcept(idx);
      const v = videos[idx];
      if (v) {
        v.play().catch(() => {});
      }
    }

    prevBtn.addEventListener("click", () => {
      idx -= 1;
      update();
    });

    nextBtn.addEventListener("click", () => {
      idx += 1;
      update();
    });

    update();
  });
})();
