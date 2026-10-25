/* MÉTRIKA ID · Solar Beirão · Grupos da ementa
   Junta as secções em ≤10 cartões (Vinhos → Sangrias, Verdes, Brancos, Tintos…). Não mexe nos dados nem no motor:
   reorganiza o que o motor desenhou, em todas as línguas, e volta a fazê-lo sempre que ele redesenha. */
(function () {
  "use strict";
  var IDX = { pt: 0, en: 1, fr: 2, es: 3, de: 4, it: 5, zh: 6, ja: 7 };
  /* Um grupo com "n" e mais de uma secção vira um cartão que abre e mostra as secções lá dentro. */
  var G = [
    { id: "especialidades", c: ["especialidades"] },
    { id: "marisco", c: ["marisco"] },
    { id: "peixe", c: ["peixe"] },
    { id: "carne", c: ["carne"] },
    { id: "petiscos", n: ["Petiscos e entradas", "Petiscos & starters", "Petiscos et entrées", "Petiscos y entrantes", "Petiscos & Vorspeisen", "Petiscos e antipasti", "葡式小吃与前菜", "ペティスコスと前菜"], c: ["petiscos", "entradas"] },
    { id: "rapidos", n: ["Omeletes, pregos e acompanhamentos", "Omelettes, steak rolls & sides", "Omelettes, pregos et accompagnements", "Tortillas, pregos y guarniciones", "Omeletts, Pregos & Beilagen", "Omelette, pregos e contorni", "煎蛋卷、牛排包与配菜", "オムレツ・プレゴ・付け合わせ"], c: ["omeletes", "acompanhamentos"] },
    { id: "sobremesas", c: ["sobremesas"] },
    { id: "vinhos", n: ["Carta de vinhos", "Wine list", "Carte des vins", "Carta de vinos", "Weinkarte", "Carta dei vini", "酒单", "ワインリスト"], c: ["verdes", "brancos", "tintos", "roses", "espumantes", "sangrias", "pressao"] },
    { id: "bebidas", n: ["Bebidas e cafetaria", "Drinks & coffee", "Boissons et café", "Bebidas y cafetería", "Getränke & Kaffee", "Bevande e caffetteria", "饮品与咖啡", "ドリンク・カフェ"], c: ["aguas", "cervejas", "cafetaria"] },
    { id: "digestivos", n: ["Aperitivos, licores e digestivos", "Aperitifs, liqueurs & digestifs", "Apéritifs, liqueurs et digestifs", "Aperitivos, licores y digestivos", "Aperitifs, Liköre & Digestifs", "Aperitivi, liquori e digestivi", "开胃酒、利口酒与餐后酒", "食前酒・リキュール・食後酒"], c: ["aperitivos", "licores", "destilados", "aguardentes", "whisky"] }
  ];
  var OWNER = {};
  G.forEach(function (g) { g.c.forEach(function (id) { OWNER[id] = g; }); });
  var TOUCHED = false, SET = {};   // o que o cliente abriu (o motor perde isto quando muda de língua)

  function L() { var l = (document.documentElement.lang || "pt").slice(0, 2).toLowerCase(); return IDX[l] != null ? IDX[l] : 0; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function name(g) { return g.n[L()] || g.n[0]; }
  function kids(box, sel) { return [].filter.call(box.children, function (n) { return n.matches(sel); }); }

  var css = document.createElement("style");
  css.textContent =
    ".grp-body{padding:0 10px 10px}" +
    ".grp .cat{background:var(--sand,#f8f4ee);border-radius:12px;margin:0 0 8px}" +
    ".grp .cat:last-child{margin-bottom:0}" +
    ".grp .cat>summary{font:500 17px var(--serif);padding:13px 14px}" +
    ".grp .dishes{padding:0 14px 8px}" +
    ".grp .dish{border-top-color:var(--line,#e8dfd6)}" +
    ".em-grp{margin:0 0 6px;padding:0 4px;font:700 12px/1 var(--sans);letter-spacing:.14em;text-transform:uppercase;color:var(--gold-d,#9c7434)}" +
    /* áreas de toque de 44 px nos links pequenos do rodapé, sem mexer no desenho */
    ".foot-links a,li a[href^=\"tel:\"]{display:inline-block;padding:13px 8px;margin:-13px -8px}";
  document.head.appendChild(css);

  /* ---------- Página do ID: cartões que abrem ---------- */
  function snap() {
    TOUCHED = true; SET = {};
    document.querySelectorAll("#menuCats details[open]").forEach(function (d) { SET[d.id] = 1; });
  }
  document.addEventListener("click", function (e) {
    var s = e.target.closest && e.target.closest("#menuCats summary");
    if (s) setTimeout(snap, 0);
  }, true);
  function syncChips(box) {
    document.querySelectorAll("#menuChips .chip").forEach(function (c) {
      var d = document.getElementById("cat-" + c.dataset.cat);
      c.setAttribute("aria-selected", d && d.open ? "true" : "false");
    });
  }
  function openTop(box, id) {
    kids(box, "details").forEach(function (d) {
      var on = d.id === "cat-" + id;
      d.open = on;
      if (on && d.classList.contains("grp")) d.querySelectorAll(".cat").forEach(function (s) { s.open = false; });
    });
    syncChips(box); snap();
    var t = document.getElementById("cat-" + id);
    if (t) window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" });
  }
  function regroupId() {
    var box = document.getElementById("menuCats"), chips = document.getElementById("menuChips");
    if (!box) return;
    var flat = kids(box, "details.cat").filter(function (d) { return !d.dataset.gd; });
    if (!flat.length) return;
    var by = {}; flat.forEach(function (d) { by[d.id.slice(4)] = d; });
    var out = [], tabs = [], used = {};
    G.forEach(function (g) {
      var ds = g.c.map(function (id) { return by[id]; }).filter(Boolean);
      if (!ds.length) return;
      ds.forEach(function (d) { used[d.id] = 1; });
      if (!g.n || ds.length < 2) {
        ds[0].dataset.gd = "1"; out.push(ds[0]);
        var nm = ds[0].querySelector("summary"); tabs.push({ id: ds[0].id.slice(4), label: nm ? nm.firstChild.textContent : "" });
        return;
      }
      var w = document.createElement("details"); w.className = "cat grp"; w.id = "cat-g-" + g.id; w.dataset.gd = "1";
      var tot = 0;
      ds.forEach(function (d) { var s = d.querySelector("summary small"); tot += parseInt(s && s.textContent, 10) || 0; });
      var sm = document.createElement("summary"); sm.innerHTML = esc(name(g)) + "<small>" + tot + "</small>";
      var body = document.createElement("div"); body.className = "grp-body";
      ds.forEach(function (d) { body.appendChild(d); d.dataset.gd = "1"; });
      w.appendChild(sm); w.appendChild(body);
      w.addEventListener("toggle", function () { syncChips(box); });
      out.push(w); tabs.push({ id: "g-" + g.id, label: name(g) });
    });
    flat.forEach(function (d) { if (!used[d.id]) { d.dataset.gd = "1"; out.push(d); } });
    out.forEach(function (n) { box.appendChild(n); });
    if (TOUCHED) box.querySelectorAll("details").forEach(function (d) { d.open = !!SET[d.id]; });
    if (chips) {
      chips.innerHTML = "";
      tabs.forEach(function (t) {
        var b = document.createElement("button"); b.type = "button"; b.className = "chip"; b.setAttribute("role", "tab");
        b.setAttribute("aria-selected", "false"); b.dataset.cat = t.id; b.textContent = t.label;
        b.addEventListener("click", function () { openTop(box, t.id); });
        chips.appendChild(b);
      });
    }
    syncChips(box);
  }

  /* ---------- Página da ementa: separadores por grupo ---------- */
  var lockSpy = 0, spyT;
  function regroupEm() {
    var list = document.getElementById("emList"), tabs = document.getElementById("emTabs");
    if (!list || !tabs) return;
    var secs = kids(list, ".em-cat").filter(function (s) { return !s.dataset.gd; });
    if (!secs.length) return;
    var by = {}; secs.forEach(function (s) { by[s.id.slice(2)] = s; });
    var tb = {}; [].forEach.call(tabs.querySelectorAll("a"), function (a) { tb[a.dataset.cat] = a; });
    var outS = [], outT = [], used = {};
    G.forEach(function (g) {
      var ss = g.c.map(function (id) { return by[id]; }).filter(Boolean);
      if (!ss.length) return;
      ss.forEach(function (s) { used[s.id] = 1; s.dataset.gd = "1"; outS.push(s); });
      var first = ss[0].id.slice(2), a = tb[first];
      if (g.n && ss.length > 1) {
        var k = document.createElement("div"); k.className = "em-grp"; k.textContent = name(g);
        ss[0].insertBefore(k, ss[0].firstChild);
        if (a) a.textContent = name(g);
      }
      if (a) { a.dataset.grp = g.id; outT.push(a); }
    });
    secs.forEach(function (s) { if (!used[s.id]) { s.dataset.gd = "1"; outS.push(s); var a = tb[s.id.slice(2)]; if (a) { a.dataset.grp = s.id.slice(2); outT.push(a); } } });
    outS.forEach(function (s) { list.appendChild(s); });
    tabs.innerHTML = "";
    outT.forEach(function (a) { a.addEventListener("click", function () { lockSpy = Date.now() + 1000; }); tabs.appendChild(a); });
  }
  function spyEm() {
    if (Date.now() < lockSpy) return;
    var head = document.querySelector(".em-head"), top = (head ? head.offsetHeight : 0) + 10, cur = null;
    var vis = document.querySelectorAll(".em-cat:not([hidden])");
    [].forEach.call(vis, function (s) { if (s.getBoundingClientRect().top <= top) cur = s.id.slice(2); });
    if (!cur && vis[0]) cur = vis[0].id.slice(2);
    var g = OWNER[cur], key = g ? g.id : cur, bar = document.getElementById("emTabs");
    [].forEach.call(document.querySelectorAll("#emTabs a"), function (a) {
      var on = a.dataset.grp === key; a.classList.toggle("on", on);
      if (on && a._g !== true && bar) bar.scrollTo({ left: a.offsetLeft - bar.clientWidth / 2 + a.offsetWidth / 2, behavior: "smooth" });
      a._g = on;
    });
  }
  addEventListener("scroll", function () { if (!document.getElementById("emTabs")) return; clearTimeout(spyT); spyT = setTimeout(spyEm, 110); }, { passive: true });

  function run() { regroupId(); regroupEm(); }
  run();
  ["menuCats", "emList"].forEach(function (id) {
    var n = document.getElementById(id);
    if (n) new MutationObserver(run).observe(n, { childList: true });
  });
})();
