export default {
  id: "captcha",
  title: "Vérification anti-humain",
  hud: "Êtes-vous humain ?",

  render(ctx) {
    const tries = ctx.state.tries ?? 0;

    return `
      <h2 style="margin:0 0 8px 0">Prouvez que vous êtes un humain</h2>
      <p class="muted" style="margin:0 0 14px 0">
        Merci de cocher la case. (C’est une formalité. Probablement.)
      </p>

      <div class="row" style="justify-content:space-between; gap:14px">
        <label class="captchaCheck">
          <input id="cb" type="checkbox" />
          <b>Je ne suis pas un robot</b>
        </label>

        <div style="text-align:right">
          <div class="muted" style="font-size:12px">Sécurité</div>
          <div class="kbd">chuipasCAPTCHA™</div>
        </div>
      </div>

      <div class="spacer"></div>
      <p class="muted" id="hint" style="margin:0">
        ${tries === 0
          ? "Petit conseil : coche la case."
          : `Tentatives : ${tries} (on progresse…)`}
      </p>
    `;
  },

  mount(ctx) {
    const cb = document.querySelector("#cb");
    const hint = document.querySelector("#hint");

    const fakeChecks = [
  "Vérification de la pression du clic…",
  "Analyse de la vitesse de réaction…",
  "Mesure de la quantité de doutes…",
  "Détection d’hésitation humaine…",
  "Évaluation du niveau de sincérité…",
  "Calcul du taux de net…",

  "Calibration du doigt principal…",
  "Analyse de la transpiration virtuelle…",
  "Détection d’un soupçon de mauvaise foi…",
  "Scan des pensées parasites…",
  "Mesure de l’envie de tricher…",
  "Évaluation du niveau de confiance injustifiée…",

  "Vérification de la cohérence des clics précédents…",
  "Analyse du micro-soupir intérieur…",
  "Estimation de la patience restante…",
  "Recherche de signes de panique discrète…",
  "Comparaison avec un humain de référence…",
  "Vérification du libre arbitre (rapide)…",

  "Analyse terminée. Enfin presque.",
];


    const onChange = () => {
      ctx.state.tries = (ctx.state.tries ?? 0) + 1;
      cb.disabled = true;
      hint.textContent = "Analyse comportementale en cours…";

      let i = 0;

      const runFakeCheck = () => {
        if (i < fakeChecks.length) {
          ctx.troll(fakeChecks[i], 1400);
          i++;
          setTimeout(runFakeCheck, 700);
        } else {
          ctx.shake();
          ctx.troll("Bon… ça ira. Passe.", 1600);
          setTimeout(() => ctx.next(), 1200);
        }
      };

      ctx.troll("Vérification… suspicion d’humanité.");
      setTimeout(runFakeCheck, 700);
    };

    cb.addEventListener("change", onChange);
    return () => cb.removeEventListener("change", onChange);
  },
};
