"use client";

// Feedback sonoro do app. Os sons são sintetizados na hora (Web Audio), sem
// arquivos. Cada ação tem um som só: sucesso, erro, aviso e clique.

import { useSyncExternalStore } from "react";

export type SoundKind = "success" | "error" | "warning" | "click";
export type CountDirection = "up" | "down";

const STORAGE_KEY = "modernista:sound";
const CHANGE_EVENT = "modernista:sound-change";
const MASTER_VOLUME = 0.29;

let ctx: AudioContext | null = null;
let master: GainNode | null = null;

function audio(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC =
      window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = MASTER_VOLUME;
    master.connect(ctx.destination);
  }
  // iOS/Safari suspende o contexto; qualquer toque do usuário pode retomar.
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

interface Tone {
  type?: OscillatorType;
  f: number;
  f2?: number;
  t?: number;
  d: number;
  g: number;
}

function tone(c: AudioContext, o: Tone) {
  const start = c.currentTime + (o.t ?? 0);
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = o.type ?? "sine";
  osc.frequency.setValueAtTime(o.f, start);
  if (o.f2) osc.frequency.exponentialRampToValueAtTime(o.f2, start + o.d);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(o.g, start + 0.006);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + o.d);
  osc.connect(gain);
  gain.connect(master!);
  osc.start(start);
  osc.stop(start + o.d + 0.03);
}

const SOUNDS: Record<SoundKind, Tone[]> = {
  // "Duas notas": sobe rápido, limpo e discreto
  success: [
    { f: 784, d: 0.1, g: 0.5 },
    { f: 1047, t: 0.1, d: 0.24, g: 0.5 },
  ],
  // "Bip grave": dois bips quadrados
  error: [
    { type: "square", f: 196, d: 0.09, g: 0.2 },
    { type: "square", f: 196, t: 0.13, d: 0.15, g: 0.2 },
  ],
  // "Alternado": dois tons, o segundo mais grave
  warning: [
    { type: "triangle", f: 880, d: 0.12, g: 0.55 },
    { type: "triangle", f: 659, t: 0.12, d: 0.22, g: 0.55 },
  ],
  // "Gota": tic curtinho e arredondado
  click: [{ f: 900, f2: 500, d: 0.05, g: 0.5 }],
};

// Escalas pentatônicas de Sol: a contagem sobe até o Sol agudo (valor
// positivo) ou desce até o Sol grave (valor negativo). Notas coladas
// (legato), com o intervalo aumentando no fim pra "frear" antes de pousar.
const COUNT_NOTES = [196, 220, 247, 294, 330, 392, 440, 494, 587, 659, 784];

/** Som da contagem dos números: escadinha macia subindo (up) ou descendo (down). */
export function playCountSound(direction: CountDirection) {
  if (!isSoundEnabled()) return;
  const c = audio();
  if (!c) return;
  const notes = direction === "up" ? COUNT_NOTES : [...COUNT_NOTES].reverse();
  const n = notes.length;
  let t = 0;
  notes.forEach((f, i) => {
    softNote(c, f, t, 0.22, 0.15);
    t += 0.06 + 0.05 * Math.pow(i / (n - 1), 1.6);
  });
  const end = notes[n - 1];
  softNote(c, end, t - 0.02, 0.35, 0.08, "sine");
  softNote(c, direction === "up" ? end / 2 : end * 2, t - 0.02, 0.42, 0.09, "sine");
}

function softNote(c: AudioContext, f: number, t: number, d: number, g: number, type: OscillatorType = "triangle") {
  const start = c.currentTime + t;
  const osc = c.createOscillator();
  const lp = c.createBiquadFilter();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.value = f;
  lp.type = "lowpass";
  lp.frequency.value = 2400;
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(g, start + 0.025);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + d);
  osc.connect(lp);
  lp.connect(gain);
  gain.connect(master!);
  osc.start(start);
  osc.stop(start + d + 0.03);
}

export function isSoundEnabled(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) !== "0";
  } catch {
    return true;
  }
}

export function setSoundEnabled(on: boolean) {
  try {
    localStorage.setItem(STORAGE_KEY, on ? "1" : "0");
  } catch {
    // sem localStorage (aba anônima etc.): a preferência só vale até recarregar
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
  if (on) playSound("click");
}

export function playSound(kind: SoundKind) {
  if (!isSoundEnabled()) return;
  const c = audio();
  if (!c) return;
  for (const t of SOUNDS[kind]) tone(c, t);
}

function subscribe(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

/** Preferência de som como estado reativo (ligado por padrão). */
export function useSoundEnabled(): boolean {
  return useSyncExternalStore(subscribe, isSoundEnabled, () => true);
}
