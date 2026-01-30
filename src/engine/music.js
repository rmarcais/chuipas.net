const STORAGE_KEY = "chuipas.music.v1";

let audio;
let unlocked = false;

const state = {
  volume: 0.25,
  muted: false,
};

function loadPrefs() {
  try {
    const s = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!s) return;
    state.volume = s.volume ?? state.volume;
    state.muted = s.muted ?? state.muted;
  } catch {}
}

function savePrefs() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function initMusic() {
  if (audio) return;

  loadPrefs();

  audio = new Audio("/music/bg.mp3");
  audio.loop = true;
  audio.volume = state.volume;
  audio.muted = state.muted;
}

export function unlockAndPlay() {
  if (!audio || unlocked) return;
  unlocked = true;
  audio.play().catch(() => {});
}

export function toggleMute() {
  state.muted = !state.muted;
  audio.muted = state.muted;
  savePrefs();
  return state.muted;
}

export function setVolume(v) {
  state.volume = Math.max(0, Math.min(1, v));
  audio.volume = state.volume;
  audio.muted = false;
  state.muted = false;
  savePrefs();
}

export function getState() {
  return { ...state };
}

let wasPlayingBeforeTempPause = false;

export function pauseTemp() {
  if (!audio) return;
  wasPlayingBeforeTempPause = !audio.paused;
  audio.pause();
}

export function resumeTemp() {
  if (!audio) return;
  if (wasPlayingBeforeTempPause && !state.muted) {
    audio.play().catch(() => {});
  }
}