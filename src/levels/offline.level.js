import { pauseTemp, resumeTemp } from "../engine/music.js";

export default {
  id: "offline",
  title: "",
  hud: "",

  render() {
    return `<p class="muted">Chargement…</p>`;
  },

  mount(ctx) {

  pauseTemp();

  const overlay = document.createElement("div");
  overlay.className = "offlinePlain";
  overlay.innerHTML = `
    <div class="offlinePlainBox">
      <h1>Impossible d’accéder à ce site</h1>
      <p>La connexion a été interrompue.</p>
      <p>Vérifiez votre connexion Internet ou réessayez plus tard.</p>
    </div>
  `;
  document.body.appendChild(overlay);

  const t1 = setTimeout(() => {
    overlay.innerHTML = `
      <div class="offlineReveal">
        <div class="offlineRevealBig">
          TRANQUIIIIILLE,<br>
          TA CONNEXION VA BIEN !
        </div>
        <div class="offlineRevealSmall">
          Allez, c’est reparti ;)
        </div>
      </div>
    `;
  }, 5000);

  const t2 = setTimeout(() => {
    overlay.remove();

    resumeTemp();

    ctx.next();
  }, 6500);

  return () => {
    clearTimeout(t1);
    clearTimeout(t2);
    overlay.remove();
    resumeTemp();
  };
}

};
