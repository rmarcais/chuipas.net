export function createHelpers() {
  let toastTimer = null;

  function troll(msg, ms = 1200) {
    const el = document.querySelector("#toast");
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), ms);
  }

  function shake(ms = 220) {
    const win = document.querySelector("#window");
    win.animate(
      [
        { transform: "translateX(0px)" },
        { transform: "translateX(-6px)" },
        { transform: "translateX(6px)" },
        { transform: "translateX(-4px)" },
        { transform: "translateX(0px)" },
      ],
      { duration: ms, iterations: 1 }
    );
  }

  function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  return { troll, shake, rand };
}
