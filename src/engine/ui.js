import { toggleMute, getState } from "./music.js";

export function createShell(root) {
  root.innerHTML = `
    <div class="scene">
      <header class="topbar">
  <div class="topbarLeft">
    <img src="./logo.png" alt="chuipas.net" class="logo" />
  </div>

  <div class="topbarRight">
  <small id="hudText" class="hudText">Initialisation du secret…</small>

  <button id="soundToggle" class="soundBtn" title="Son">🔊Hello</button>

  <div class="progress progressClickable" id="progressFake">
    <i id="progressBar"></i>
  </div>
</div>

</header>

      <!-- Centre -->
      <main class="centerStage">
        <div class="windowWrap">
          <div class="window popIn" id="window">
            <div class="titlebar">
              <div class="dots" aria-hidden="true">
                <span class="dot"></span><span class="dot"></span><span class="dot"></span>
              </div>
              <div class="title" id="windowTitle">Connexion au savoir interdit</div>
              <div style="width:52px"></div>
            </div>
            <div class="content" id="windowContent"></div>
          </div>

          <div class="toast" id="toast"></div>
        </div>
      </main>

      <!-- Footer -->
      <footer class="footer">
        <div class="footerInner">
          <span><b>chuipas.net</b> — site expérimental (et pas net).</span>
          <span class="sep">•</span>
          <a href="#" id="resetRun">Recommencer</a>
          <span class="sep">•</span>
          <a href="#" id="aboutLink">À propos</a>
          <span class="sep">•</span>
          <span class="muted">© ${new Date().getFullYear()}</span>
        </div>
      </footer>
    </div>
  `;

  const reset = root.querySelector("#resetRun");
  reset?.addEventListener("click", (e) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent("chuipas:restart"));
  });

  const about = root.querySelector("#aboutLink");
  about?.addEventListener("click", (e) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent("chuipas:about"));
  });



    const soundBtn = root.querySelector("#soundToggle");
    if (soundBtn) {
    const refresh = () => {
        const { muted } = getState();
        soundBtn.textContent = muted ? "🔇" : "🔊";
    };

    soundBtn.addEventListener("click", () => {
        toggleMute();
        refresh();
    });

    const fakeProgress = root.querySelector("#progressFake");

    if (fakeProgress) {
    fakeProgress.addEventListener("click", () => {
        window.dispatchEvent(
        new CustomEvent("chuipas:fakeProgress")
        );
    });
    }


  refresh();
}

}


export function setWindowTitle(text) {
  document.querySelector("#windowTitle").textContent = text;
}

export function setWindowHtml(html) {
  document.querySelector("#windowContent").innerHTML = html;
}

export function animateSwap() {
  const win = document.querySelector("#window");
  win.classList.remove("popIn");
  win.classList.add("fadeOut");
  return new Promise((resolve) => {
    win.addEventListener("animationend", () => {
      win.classList.remove("fadeOut");
      win.classList.add("popIn");
      resolve();
    }, { once: true });
  });
}

export function setHud(text, progress01) {
  const hud = document.querySelector("#hudText");
  const bar = document.querySelector("#progressBar");
  hud.textContent = text;

  const pct = Math.max(0, Math.min(1, progress01));
  bar.style.width = `${Math.round(pct * 100)}%`;
}
