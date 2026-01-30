export default {
  id: "cookies",
  title: "Consentement (totalement optionnel)",
  hud: "Miam !",

  render() {
    return `
      <h2 style="margin:0 0 8px 0">Nous utilisons des cookies</h2>
      <p class="muted" style="margin:0 0 14px 0">
        Pour améliorer votre expérience, mesurer votre désespoir, et stocker votre âme en cache.
      </p>

      <div class="cookieBox">
        <b>Choisissez :</b>
        <div class="spacer"></div>
        <div class="row">
          <button class="btnPrimary" id="accept">Tout accepter</button>
          <button class="btnGhost" id="refuse">Tout refuser</button>
          <button class="btnGhost" id="custom">Personnaliser</button>
        </div>
      </div>

      <div class="spacer"></div>
      <p class="muted" id="log" style="margin:0">
        Astuce : il existe un mauvais choix. (peut-être)
      </p>
    `;
  },

  mount(ctx) {
    const accept = document.querySelector("#accept");
    const refuse = document.querySelector("#refuse");
    const custom = document.querySelector("#custom");
    const log = document.querySelector("#log");
    const titlebar = document.querySelector(".titlebar");

    let refuseScale = 1;
    let acceptScale = 1;
    let customCount = 0;

    // --- Tout accepter
    const onAccept = () => {
      ctx.troll("Merci. Nous avons accepté pour toi.");
      log.textContent = "Consentement enregistré : OUI (par défaut).";
      // change la couleur du bandeau
      titlebar.style.background = `
        repeating-linear-gradient(
          135deg,
          rgba(0,0,0,.08) 0 8px,
          rgba(0,0,0,0) 8px 16px
        ),
        linear-gradient(180deg, #ffe100, #ffe100)
      `;

      // change la couleur du bouton accepter
      accept.style.background = `
        repeating-linear-gradient(
          135deg,
          rgba(0,0,0,.12) 0 6px,
          rgba(0,0,0,0) 6px 12px
        ),
        linear-gradient(180deg, #ffe100, #ffe100)
      `;
      setTimeout(() => ctx.next(), 900);
    };

    // --- Tout refuser → manipulation visuelle
    const onRefuse = () => {
        ctx.troll("Refuser ? Intéressant.");
        ctx.shake();

        accept.style.zIndex = 10;

        refuseScale = Math.max(0.4, refuseScale - 0.18);
        acceptScale = Math.min(2.2, acceptScale + 0.22);

        const rRect = refuse.getBoundingClientRect();
        const aRect = accept.getBoundingClientRect();

        const rCx = rRect.left + rRect.width / 2;
        const rCy = rRect.top + rRect.height / 2;
        const aCx = aRect.left + aRect.width / 2;
        const aCy = aRect.top + aRect.height / 2;

        const dx = rCx - aCx;
        const dy = rCy - aCy;

        accept.style.transform = `
            translate(${dx * 0.25 + 20}px, ${dy * 0.25}px)
            scale(${acceptScale})
        `;

        refuse.style.transform = `
            scale(${refuseScale})
        `;

        log.textContent = "Votre refus est en cours d’absorption.";
};

    const onCustom = () => {
      customCount++;

      const colors = [
        "#ffe100",
        "#ff4fd8",
        "#22c55e",
        "#60a5fa",
        "#f97316",
      ];

      const c = colors[customCount % colors.length];

      titlebar.style.background = `
        repeating-linear-gradient(
          135deg,
          rgba(0,0,0,.08) 0 8px,
          rgba(0,0,0,0) 8px 16px
        ),
        linear-gradient(180deg, ${c}, ${c})
      `;

      accept.style.background = `
        repeating-linear-gradient(
          135deg,
          rgba(0,0,0,.12) 0 6px,
          rgba(0,0,0,0) 6px 12px
        ),
        linear-gradient(180deg, ${c}, ${c})
      `;

      ctx.troll("Préférences avancées appliquées.");
      log.textContent =
        "Vos préférences ont été respectées visuellement.";
    };

    accept.addEventListener("click", onAccept);
    refuse.addEventListener("click", onRefuse);
    custom.addEventListener("click", onCustom);

    return () => {
      accept.removeEventListener("click", onAccept);
      refuse.removeEventListener("click", onRefuse);
      custom.removeEventListener("click", onCustom);
    };
  },
};
