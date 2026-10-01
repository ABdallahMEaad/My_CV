(() => {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const EASE = "cubic-bezier(.22,1,.36,1)", MAIL = "abdallahmead0@gmail.com";
  const watch = (sel, fn, opt) => { const o = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { o.unobserve(e.target); fn(e.target); } }), opt); $$(sel).forEach((e) => o.observe(e)); };
  const sw = (el, onCls, offCls, isOn) => { el.classList.remove(...(isOn ? offCls : onCls)); el.classList.add(...(isOn ? onCls : offCls)); };

  /* ---------- scroll-in / load animations (replaces framer-motion) ---------- */
  const play = (el, s, m) => {
    el.style.transition = ["opacity", "transform", "width", "stroke-dashoffset"].map((p) => `${p} ${m.t}s ${EASE} ${m.d}s`).join(",");
    requestAnimationFrame(() => { for (const k in s) el.style[k] = String(s[k]); });
    setTimeout(() => { el.style.transition = ""; if (s.transform) el.style.transform = ""; }, (m.d + m.t) * 1000 + 80);
  };
  const motion = $$("[data-m]").map((el) => ({ el, m: JSON.parse(el.dataset.m) }));
  requestAnimationFrame(() => requestAnimationFrame(() => motion.forEach(({ el, m }) => m.a && play(el, m.a, m))));
  const mo = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { mo.unobserve(e.target); const m = JSON.parse(e.target.dataset.m); play(e.target, m.w, m); } }), { rootMargin: "0px 0px -60px 0px" });
  motion.forEach(({ el, m }) => m.w && mo.observe(el));

  /* ---------- counters ---------- */
  watch("[data-count]", (el) => {
    const v = +el.dataset.count, s = el.dataset.suffix || "", t0 = performance.now();
    const tick = (n) => { const p = Math.min(1, (n - t0) / 1600); el.textContent = Math.round((1 - (1 - p) ** 3) * v) + s; if (p < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  }, { rootMargin: "-40px" });

  /* ---------- header + scroll progress ---------- */
  const hdr = $("header"), sp = $("#sp");
  const ON = "border-white/[0.07] bg-[#05070d]/80 backdrop-blur-xl".split(" "), OFF = "border-transparent bg-transparent".split(" ");
  const onScroll = () => {
    const h = document.documentElement, max = h.scrollHeight - h.clientHeight;
    sp.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + "%";
    sw(hdr, ON, OFF, scrollY > 24);
  };
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  /* ---------- mobile menu ---------- */
  const btn = $('[aria-label="Toggle menu"]'), burger = btn.innerHTML;
  const X = '<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>';
  const cv = $("header a[download]");
  const menu = document.createElement("div");
  menu.className = "overflow-hidden border-b border-white/[0.07] bg-[#070b16]/95 backdrop-blur-xl lg:hidden"; menu.hidden = true;
  menu.innerHTML = '<div class="space-y-1 px-5 py-4">' + $$("header .lg\\:flex a").map((a) => `<a href="${a.getAttribute("href")}" class="block rounded-xl px-4 py-3 text-[15px] font-medium text-slate-200 hover:bg-white/[0.06]">${a.textContent}</a>`).join("") +
    `<a href="${cv.getAttribute("href")}" download class="mt-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-3 text-sm font-semibold text-[#04121a]">Download CV</a></div>`;
  hdr.appendChild(menu);
  const setMenu = (o) => { menu.hidden = !o; btn.innerHTML = o ? X : burger; };
  btn.addEventListener("click", () => setMenu(menu.hidden));
  menu.addEventListener("click", (e) => e.target.closest("a") && setMenu(false));

  /* ---------- cursor glow + magnetic buttons ---------- */
  const g = $("#cursor-glow");
  if (g) { let x = -400, y = -400, tx = -400, ty = -400; addEventListener("mousemove", (e) => { tx = e.clientX - 260; ty = e.clientY - 260; }, { passive: true }); (function f() { x += (tx - x) * 0.08; y += (ty - y) * 0.08; g.style.transform = `translate(${x}px,${y}px)`; requestAnimationFrame(f); })(); }
  $$("[data-magnetic]").forEach((el) => {
    el.addEventListener("mousemove", (e) => { const r = el.getBoundingClientRect(); el.style.transition = "transform .15s"; el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.12}px,${(e.clientY - r.top - r.height / 2) * 0.12}px)`; });
    el.addEventListener("mouseleave", () => { el.style.transition = "transform .4s " + EASE; el.style.transform = ""; });
  });

  /* ---------- expertise lanes ---------- */
  const D = {
    manual: ["80+ OrangeHRM cases across 10 PIM modules", "RTM + execution summary + QA dashboard", "BVA · Negative · Security · Usability", "Jira defect lifecycle with evidence"],
    automation: ["Swag Labs POM — Java 21 · TestNG · Maven", "Smoke + regression suites, data-driven", "Auto screenshots + Allure history", "GitHub Actions CI on every push"],
    api: ["Postman + Swagger REST validation", "Auth & token extraction chains", "JSON schema + status assertions", "Feeds JMeter performance packs"],
    performance: ["JMeter 5.6.3 — 20 & 100 user packs", "Throughput Controllers + Timers", "JSON correlation & CSV datasets", "Response-time assertions & analysis"],
    database: ["103 BTMS cases over 7 tables", "17 defects with SQL reproduction", "FK · NULL · constraint · rule checks", "Reusable DB regression pack"],
  };
  const items = $("[data-lane-items]"), tpl = items.firstElementChild.cloneNode(true);
  const PA = "border-cyan-300/40 bg-gradient-to-r from-cyan-400/15 to-violet-500/15 text-white shadow-[0_8px_30px_-10px_rgba(34,211,238,0.5)]".split(" ");
  const PO = "border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/20 hover:text-white".split(" ");
  const setLane = (id) => {
    $$("[data-pill]").forEach((p) => { const on = p.dataset.lane === id; sw(p, PA, PO, on); const i = $("svg", p); i && i.classList.toggle("text-cyan-300", on); });
    $$("[data-lane-card]").forEach((c) => {
      const on = c.dataset.lane === id; sw(c, ["ring-1", "ring-cyan-300/40"], ["opacity-90"], on);
      const st = c.lastElementChild; st.firstElementChild.classList.toggle("animate-pulse", on);
      st.lastElementChild.textContent = on ? "● Active lane" : `${c.children[3].children.length} capabilities`;
    });
    const c = $(`[data-lane-card][data-lane="${id}"]`);
    $("[data-lane-idx]").textContent = "Active lane — " + c.querySelector("span.font-display").textContent;
    $("[data-lane-title]").textContent = c.querySelector("h3").textContent + " in practice";
    items.replaceChildren(...D[id].map((t) => { const n = tpl.cloneNode(true); n.lastChild.textContent = " " + t; return n; }));
  };
  $$("[data-lane]").forEach((b) => b.addEventListener("click", () => setLane(b.dataset.lane)));
  setLane("automation");

  /* ---------- projects: filter, tilt, case-study modal ---------- */
  const FA = "border-cyan-300/40 bg-cyan-400/10 text-white".split(" "), FO = "border-white/10 bg-white/[0.03] text-slate-400 hover:text-white".split(" ");
  $$("[data-filter]").forEach((b) => b.addEventListener("click", () => {
    $$("[data-filter]").forEach((x) => sw(x, FA, FO, x === b));
    $$("[data-card]").forEach((c) => { c.parentElement.hidden = !(b.dataset.filter === "All" || c.dataset.type === b.dataset.filter); });
  }));
  let openM = null;
  const close = () => { if (openM) { openM.hidden = true; openM = null; document.body.style.overflow = ""; } };
  $$("[data-card]").forEach((c) => {
    c.addEventListener("mousemove", (e) => { const r = c.getBoundingClientRect(); c.style.transform = `perspective(1100px) rotateX(${((e.clientY - r.top) / r.height - 0.5) * -6}deg) rotateY(${((e.clientX - r.left) / r.width - 0.5) * 8}deg) translateY(-6px)`; });
    c.addEventListener("mouseleave", () => (c.style.transform = ""));
    c.addEventListener("click", (e) => { if (e.target.closest("a")) return; openM = $(`[data-modal="${c.dataset.id}"]`); openM.hidden = false; document.body.style.overflow = "hidden"; });
  });
  $$("[data-modal]").forEach((m) => m.addEventListener("click", (e) => {
    const bd = m.firstElementChild;
    if (e.target === bd || e.target.closest('[aria-label="Close case study"]') || (e.target.closest("button") && /Back to projects/.test(e.target.textContent))) close();
  }));
  addEventListener("keydown", (e) => e.key === "Escape" && close());

  /* ---------- portrait upload (saved in localStorage) ---------- */
  const img = $('img[alt^="Abdallah"]'), fi = $('input[type="file"]');
  try { const s = localStorage.getItem("abdallah-photo"); if (s) img.src = s; } catch {}
  fi.previousElementSibling.addEventListener("click", () => fi.click());
  fi.addEventListener("change", () => { const f = fi.files[0]; if (!f) return; const r = new FileReader(); r.onload = () => { img.src = r.result; try { localStorage.setItem("abdallah-photo", r.result); } catch {} }; r.readAsDataURL(f); });

  /* ---------- copy buttons ---------- */
  const CHECK = '<svg class="h-4 w-4 text-emerald-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>';
  $$('button[aria-label^="Copy "]').forEach((b) => b.addEventListener("click", () => {
    navigator.clipboard?.writeText(b.getAttribute("aria-label").slice(5)).catch(() => {});
    const h = b.innerHTML; b.innerHTML = CHECK; setTimeout(() => (b.innerHTML = h), 1600);
  }));

  /* ---------- contact form (opens mail app) ---------- */
  const err = (id, msg) => { const f = $("#" + id); f.parentElement.querySelector(".err")?.remove(); if (msg) { const p = document.createElement("p"); p.className = "err mt-1.5 text-[12px] text-rose-300"; p.textContent = msg; f.after(p); } return !msg; };
  $("form").addEventListener("submit", (e) => {
    e.preventDefault();
    const n = $("#c-name").value.trim(), m = $("#c-email").value, t = $("#c-msg").value.trim();
    const ok = [err("c-name", n.length < 2 && "Please enter your name."), err("c-email", !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m) && "Please enter a valid email."), err("c-msg", t.length < 10 && "Message should be at least 10 characters.")].every(Boolean);
    if (!ok) return;
    location.href = `mailto:${MAIL}?subject=${encodeURIComponent("QA Opportunity — " + n)}&body=${encodeURIComponent(t + "\n\n— " + n + " (" + m + ")")}`;
    const s = document.createElement("p"); s.className = "mt-3 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-4 py-2 text-[12px] text-emerald-200 sm:ml-4";
    s.textContent = "✓ Opening your mail app — I reply fast."; e.submitter.parentElement.appendChild(s); setTimeout(() => s.remove(), 4000);
  });
})();
