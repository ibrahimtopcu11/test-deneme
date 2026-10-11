/* ==========================================================
   İSİMLERİ VE YAZILARI BURADAN DEĞİŞTİREBİLİRSİN
   ========================================================== */
const CONFIG = {
  herName: "Sena Nur Ereli",
  loveLine: "seni çok seviyorum.",
  fromLine: "İbrahim seni çok seviyor.",
  letter: [
    { text: "Her şey için özür dilerim.", strong: true },
    { text: "Seni üzdüğüm her an için, söylediğim ve söyleyemediğim her şey için gerçekten çok pişmanım." },
    { text: "Ne olursa olsun, ben her zaman yanındayım. İyi günde de, kötü günde de elini hiç bırakmayacağım." },
    { text: "Gülüşün benim en sevdiğim yer, sesin en güzel şarkım." },
    { text: "Sen benim her şeyimsin.", strong: true },
  ],
  noTexts: [
    "Emin misin? 🥺",
    "Bir daha düşün 💭",
    "Yakalayamazsın 😝",
    "Lütfen prensesim 👑",
    "Kalbim kırılıyor 💔",
    "Evet'e bas hadi 💕",
  ],
};

/* ---------- Sahne geçişleri ---------- */
const scenes = document.querySelectorAll(".scene");
function show(id) {
  scenes.forEach((s) => s.classList.toggle("is-active", s.id === id));
  if (id === "scene-name") playName();
  if (id === "scene-letter") playLetter();
  if (id === "scene-question") resetQuestion();
  if (id === "scene-final") celebrate();
}
document.querySelectorAll("[data-next]").forEach((b) =>
  b.addEventListener("click", () => show(b.dataset.next))
);

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

/* ---------- 1. Zarf ---------- */
const envelope = document.getElementById("open-envelope");
envelope.addEventListener("click", async () => {
  if (envelope.classList.contains("is-open")) return;
  envelope.classList.add("is-open");
  burst(window.innerWidth / 2, window.innerHeight / 2, 30);
  await wait(1500);
  show("scene-name");
});

/* ---------- 2. İsim ---------- */
async function typeInto(el, text, speed = 45) {
  el.textContent = "";
  for (const ch of text) {
    el.textContent += ch;
    await wait(speed);
  }
}
async function playName() {
  const nameEl = document.getElementById("name-line");
  const love = document.getElementById("love-line");
  const from = document.getElementById("from-line");
  const btn = document.querySelector("#scene-name .reveal-late");
  nameEl.innerHTML = ""; love.textContent = ""; from.textContent = ""; btn.classList.remove("shown");

  await wait(600);
  [...CONFIG.herName].forEach((ch, i) => {
    const span = document.createElement("span");
    span.className = "ch";
    span.textContent = ch === " " ? "\u00A0" : ch;
    span.style.animationDelay = `${i * 90}ms`;
    nameEl.appendChild(span);
  });
  await wait(CONFIG.herName.length * 90 + 700);
  await typeInto(love, CONFIG.loveLine, 60);
  await wait(700);
  await typeInto(from, CONFIG.fromLine, 55);
  burst(window.innerWidth / 2, window.innerHeight / 2, 24);
  await wait(800);
  btn.classList.add("shown");
}

/* ---------- 3. Mektup ---------- */
async function playLetter() {
  const box = document.getElementById("letter-lines");
  const sign = document.querySelector(".letter-sign");
  const btn = document.querySelector("#scene-letter .reveal-late");
  box.innerHTML = ""; sign.classList.remove("fade-in"); sign.style.opacity = 0; btn.classList.remove("shown");

  await wait(700);
  for (const line of CONFIG.letter) {
    const p = document.createElement("p");
    if (line.strong) p.classList.add("strong");
    p.textContent = line.text;
    box.appendChild(p);
    p.classList.add("fade-in");
    p.scrollIntoView({ behavior: "smooth", block: "nearest" });
    await wait(1400 + line.text.length * 18);
  }
  sign.classList.add("fade-in");
  await wait(900);
  btn.classList.add("shown");
}

/* ---------- 4. Soru: Hayır kaçar, Evet büyür ---------- */
const btnNo = document.getElementById("btn-no");
const btnYes = document.getElementById("btn-yes");
let tries = 0;

function resetQuestion() {
  tries = 0;
  btnNo.classList.remove("is-running");
  btnNo.style.left = btnNo.style.top = "";
  btnNo.textContent = "Hayır";
  btnYes.style.setProperty("--grow", 1);
}

function runAway(e) {
  if (e) e.preventDefault();
  tries++;
  const rect = btnNo.getBoundingClientRect();
  if (!btnNo.classList.contains("is-running")) {
    btnNo.style.left = rect.left + "px";
    btnNo.style.top = rect.top + "px";
    btnNo.classList.add("is-running");
  }
  const pad = 16;
  const maxX = window.innerWidth - rect.width - pad;
  const maxY = window.innerHeight - rect.height - pad;
  const yesR = btnYes.getBoundingClientRect();
  let x, y, guard = 0;
  do {
    x = pad + Math.random() * (maxX - pad);
    y = pad + Math.random() * (maxY - pad);
    guard++;
  } while (
    guard < 30 &&
    (Math.abs(x - rect.left) < 90 ||
      (x < yesR.right + 20 && x + rect.width > yesR.left - 20 &&
       y < yesR.bottom + 20 && y + rect.height > yesR.top - 20))
  );
  // requestAnimationFrame ile ilk konumdan kayarak gitsin
  requestAnimationFrame(() => {
    btnNo.style.left = x + "px";
    btnNo.style.top = y + "px";
  });
  btnNo.textContent = CONFIG.noTexts[(tries - 1) % CONFIG.noTexts.length];
  btnYes.style.setProperty("--grow", Math.min(1 + tries * 0.12, 2));
}

btnNo.addEventListener("mouseenter", runAway);
btnNo.addEventListener("touchstart", runAway, { passive: false });
btnNo.addEventListener("pointerdown", runAway);
btnNo.addEventListener("click", runAway); // klavyeyle bile basılamaz 😄

btnYes.addEventListener("click", () => {
  const r = btnYes.getBoundingClientRect();
  burst(r.left + r.width / 2, r.top + r.height / 2, 80);
  btnNo.classList.remove("is-running");
  show("scene-final");
});

/* ---------- 5. Final ---------- */
let celebrateTimer;
function celebrate() {
  clearInterval(celebrateTimer);
  let n = 0;
  celebrateTimer = setInterval(() => {
    burst(Math.random() * window.innerWidth, Math.random() * window.innerHeight * 0.7, 26);
    if (++n > 6) clearInterval(celebrateTimer);
  }, 600);
}
document.getElementById("replay").addEventListener("click", () => {
  clearInterval(celebrateTimer);
  envelope.classList.remove("is-open");
  show("scene-intro");
});

/* ==========================================================
   Arka plan: uçuşan kalpler + patlama efekti
   ========================================================== */
const canvas = document.getElementById("hearts");
const ctx = canvas.getContext("2d");
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const colors = ["#e8407a", "#f2649a", "#f7a8c8", "#b8336a", "#ffd1e1", "#d4a24c"];
let W, H, DPR;
const floaters = [];
const sparks = [];

function resize() {
  DPR = Math.min(window.devicePixelRatio || 1, 2);
  W = window.innerWidth; H = window.innerHeight;
  canvas.width = W * DPR; canvas.height = H * DPR;
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
}
window.addEventListener("resize", resize);
resize();

function heartPath(x, y, s) {
  ctx.beginPath();
  ctx.moveTo(x, y + s * 0.3);
  ctx.bezierCurveTo(x, y, x - s / 2, y, x - s / 2, y + s * 0.3);
  ctx.bezierCurveTo(x - s / 2, y + s * 0.6, x, y + s * 0.8, x, y + s);
  ctx.bezierCurveTo(x, y + s * 0.8, x + s / 2, y + s * 0.6, x + s / 2, y + s * 0.3);
  ctx.bezierCurveTo(x + s / 2, y, x, y, x, y + s * 0.3);
  ctx.closePath();
}

function newFloater(initial) {
  return {
    x: Math.random() * W,
    y: initial ? Math.random() * H : H + 30,
    s: 10 + Math.random() * 22,
    v: 0.3 + Math.random() * 0.8,
    sway: Math.random() * Math.PI * 2,
    a: 0.25 + Math.random() * 0.45,
    c: colors[Math.floor(Math.random() * 5)],
  };
}
const count = reduced ? 0 : Math.round(Math.min(40, W / 22));
for (let i = 0; i < count; i++) floaters.push(newFloater(true));

function burst(x, y, n = 40) {
  if (reduced) return;
  for (let i = 0; i < n; i++) {
    const ang = Math.random() * Math.PI * 2;
    const sp = 2 + Math.random() * 6;
    sparks.push({
      x, y,
      vx: Math.cos(ang) * sp,
      vy: Math.sin(ang) * sp - 2,
      s: 8 + Math.random() * 14,
      life: 1,
      c: colors[Math.floor(Math.random() * colors.length)],
    });
  }
}

function loop() {
  ctx.clearRect(0, 0, W, H);
  for (const f of floaters) {
    f.y -= f.v;
    f.sway += 0.02;
    const x = f.x + Math.sin(f.sway) * 18;
    if (f.y < -40) Object.assign(f, newFloater(false));
    ctx.globalAlpha = f.a;
    ctx.fillStyle = f.c;
    heartPath(x, f.y, f.s);
    ctx.fill();
  }
  for (let i = sparks.length - 1; i >= 0; i--) {
    const p = sparks[i];
    p.x += p.vx; p.y += p.vy; p.vy += 0.15; p.vx *= 0.99;
    p.life -= 0.012;
    if (p.life <= 0) { sparks.splice(i, 1); continue; }
    ctx.globalAlpha = p.life;
    ctx.fillStyle = p.c;
    heartPath(p.x, p.y, p.s);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  requestAnimationFrame(loop);
}
loop();
