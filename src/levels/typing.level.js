export default {
  id: "typing",
  title: "Test de dactylographie",
  hud: "Analyse de la fluidité neuronale…",

  render(ctx) {
    return `
      <h2 style="margin:0 0 8px 0">Recopie humaine</h2>
      <p class="muted" style="margin:0 0 14px 0">
        Tape les <b>10 mots</b> affichés.<br>
        Temps total autorisé : <b>25 secondes</b>.
      </p>

      <div class="typingBox">
        <div id="typingTimer" class="typingTimer">25.0 s</div>

        <div class="typingWord" id="typingWord">—</div>

        <input
          id="typingInput"
          type="text"
          class="typingInput"
          autocomplete="off"
          placeholder="Tape ici…"
          disabled
        />

        <button class="btnPrimary" id="typingStart">
          Démarrer
        </button>
      </div>

      <div class="spacer"></div>
      <p class="muted" id="typingLog">
        Prends une grande inspiration.
      </p>
    `;
  },

  mount(ctx) {
    const WORDS = [
      "banane", "nuage", "clavier", "robot", "absurde",
      "fromage", "patience", "clic", "fenêtre", "chaos",
      "internet", "sincérité", "doute", "humain", "erreur",
      "illusion", "attente", "captcha", "cookie", "système",
      "clignoter", "pression", "réalité", "secret", "temps",
      "mémoire", "hasard", "interface", "bizarre", "échec",
      "réessayer", "valider", "réflexe", "stress", "tromper",
      "logique", "absorption", "désordre", "retard", "avance",
      "contrôle", "invisible", "presque", "jamais", "toujours",
      "maintenant", "ensuite", "finalement", "peut-être"
    ];

    const TOTAL_WORDS = 10;
    const TOTAL_TIME = 20.0;

    const timerEl = document.querySelector("#typingTimer");
    const wordEl = document.querySelector("#typingWord");
    const input = document.querySelector("#typingInput");
    const startBtn = document.querySelector("#typingStart");
    const log = document.querySelector("#typingLog");

    let words = [];
    let index = 0;
    let startTime = 0;
    let rafId = null;
    let running = false;

    function shuffle(arr) {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    }

    function updateTimer() {
      if (!running) return;

      const elapsed = (performance.now() - startTime) / 1000;
      const remaining = Math.max(0, TOTAL_TIME - elapsed);
      timerEl.textContent = `${remaining.toFixed(1)} s`;

      if (remaining <= 0) {
        fail("Trop lent. Tes doigts ont hésité.");
        return;
      }

      rafId = requestAnimationFrame(updateTimer);
    }

    function start() {
      words = shuffle([...WORDS]).slice(0, TOTAL_WORDS);
      index = 0;

      input.value = "";
      input.disabled = false;
      input.focus();

      wordEl.textContent = words[index];
      log.textContent = "Go. Ne réfléchis pas trop.";
      startBtn.disabled = true;

      running = true;
      startTime = performance.now();

      ctx.troll("Début du test.", 900);
      rafId = requestAnimationFrame(updateTimer);
    }

    function success() {
      running = false;
      cancelAnimationFrame(rafId);

      ctx.troll("Rapide. Propre. Humain.", 1600);
      log.innerHTML = `<b>Validé.</b> Tes doigts savent encore travailler.`;
      input.disabled = true;

      setTimeout(() => ctx.next(), 1200);
    }

    function fail(msg) {
      running = false;
      cancelAnimationFrame(rafId);

      ctx.shake();
      ctx.troll(msg, 1400);

      log.textContent = "Réessaie. Le clavier ne mord pas.";
      input.disabled = true;
      startBtn.disabled = false;
    }

    function onInput() {
      if (!running) return;

      if (input.value === words[index]) {
        index++;
        input.value = "";

        if (index >= TOTAL_WORDS) {
          success();
          return;
        }

        wordEl.textContent = words[index];
      }
    }

    startBtn.addEventListener("click", start);
    input.addEventListener("input", onInput);

    return () => {
      cancelAnimationFrame(rafId);
      startBtn.replaceWith(startBtn.cloneNode(true));
      input.replaceWith(input.cloneNode(true));
    };
  },
};
