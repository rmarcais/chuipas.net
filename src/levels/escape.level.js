export default {
  id: "escape",
  title: "Procédure d’évacuation",
  hud: "Recherche d’une issue raisonnable…",

  render() {
    return `
      <h2 style="margin:0 0 8px 0">Sortie de secours</h2>
      <p class="muted" style="margin:0 0 14px 0">
        En cas de panique, cliquez sur la sortie de secours.
      </p>

      <div class="escapeBox" id="escapeBox">
        <button class="escapeBtn" id="escapeBtn">
          🚪 Sortie de secours
        </button>
      </div>

      <div class="spacer"></div>
      <p class="muted" id="escapeLog">
        Astuce : respire. Puis clique.
      </p>
    `;
  },

  mount(ctx) {
    const box = document.querySelector("#escapeBox");
    const btn = document.querySelector("#escapeBtn");
    const log = document.querySelector("#escapeLog");

    let x = 40;
    let y = 40;

    let dx = Math.random() * 2 - 1;
    let dy = Math.random() * 2 - 1;

    const SPEED = 8.8;
    let running = true;
    let rafId = null;

    function normalize() {
      const len = Math.hypot(dx, dy) || 1;
      dx /= len;
      dy /= len;
    }

    normalize();

    function step() {
      if (!running) return;

      const boxW = box.clientWidth;
      const boxH = box.clientHeight;
      const btnW = btn.offsetWidth;
      const btnH = btn.offsetHeight;

      x += dx * SPEED;
      y += dy * SPEED;

      // rebonds sur les bords
      if (x <= 0 || x + btnW >= boxW) {
        dx *= -1;
        x = Math.max(0, Math.min(x, boxW - btnW));
      }

      if (y <= 0 || y + btnH >= boxH) {
        dy *= -1;
        y = Math.max(0, Math.min(y, boxH - btnH));
      }

      btn.style.transform = `translate(${x}px, ${y}px)`;

      rafId = requestAnimationFrame(step);
    }

    const directionInterval = setInterval(() => {
      dx = Math.random() * 2 - 1;
      dy = Math.random() * 2 - 1;
      normalize();
    }, 1200);

    function onMouseEnter() {
      box.classList.add("cursorHidden");
      ctx.troll("Où est passée ta souris ?", 800);
    }

    function onMouseLeave() {
      box.classList.remove("cursorHidden");
    }

    function onClick() {
      running = false;
      box.classList.remove("cursorHidden");

      cancelAnimationFrame(rafId);
      clearInterval(directionInterval);

      ctx.troll("Issue trouvée. Impressionnant.", 1400);
      log.textContent =
        "Tu as réussi à sortir. Plus ou moins dignement.";

      setTimeout(() => ctx.next(), 1200);
    }

    box.addEventListener("mouseenter", onMouseEnter);
    box.addEventListener("mouseleave", onMouseLeave);
    btn.addEventListener("click", onClick);

    step();

    return () => {
      running = false;
      cancelAnimationFrame(rafId);
      clearInterval(directionInterval);

      box.removeEventListener("mouseenter", onMouseEnter);
      box.removeEventListener("mouseleave", onMouseLeave);
      btn.removeEventListener("click", onClick);
    };
  },
};
