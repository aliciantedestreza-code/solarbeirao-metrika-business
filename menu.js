/* MÉTRIKA ID · Ementa digital (ecrã inteiro). Gerada sempre a partir do config.js. */
(function () {
  "use strict";
  var C = window.METRIKA_CONFIG, I18N = window.METRIKA_I18N, LANGS = window.METRIKA_LANGS;
  var $ = function (s) { return document.querySelector(s); };
  var IDX = { pt: 0, en: 1, fr: 2, es: 3, de: 4, it: 5, zh: 6, ja: 7 };
  var LOCALE = { pt: "pt-PT", en: "en-GB", fr: "fr-FR", es: "es-ES", de: "de-DE", it: "it-IT", zh: "zh-CN", ja: "ja-JP" };
  var params = new URLSearchParams(location.search);
  var MODE = params.get("rever") === "1" ? "rever" : params.get("demo") === "1" ? "demo" : params.get("normal") === "1" ? "normal" : (C.modo || "normal");
  var pricesOk = MODE !== "normal" || C.ementa.precosConfirmados;
  var waOk = (MODE !== "normal" || (C.whatsapp && C.whatsapp.confirmado)) && C.whatsapp && C.whatsapp.numero;
  var KEY = "mk_lang_" + (C.negocio.nome || "").toLowerCase().replace(/\W+/g, "");
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  try { if (params.get("source")) sessionStorage.setItem("mk_source", params.get("source")); } catch (e) {}
  function detect() {
    var p = (params.get("lang") || "").slice(0, 2); if (I18N[p]) return p;
    var s = store(KEY); if (s && I18N[s]) return s;
    var nav = navigator.languages || [navigator.language || "pt"];
    for (var i = 0; i < nav.length; i++) { var c = (nav[i] || "").slice(0, 2).toLowerCase(); if (I18N[c]) return c; }
    return "en";
  }
  var lang = detect();
  function t(k, v) { var s = (I18N[lang] && I18N[lang][k]) || I18N.pt[k] || ""; v = v || {}; v.nome = v.nome || C.negocio.nome; v.local = v.local || C.negocio.morada.local; return s.replace(/\{(\w+)\}/g, function (_, x) { return v[x] != null ? v[x] : ""; }); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function norm(s) { return String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); }
  function price(p, u) { return esc(new Intl.NumberFormat(LOCALE[lang], { style: "currency", currency: "EUR", minimumFractionDigits: 2 }).format(p)) + (u ? "<small>/" + esc(u) + "</small>" : ""); }
  var ICON = {
    cal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.8l2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2l-5.6 3 1.1-6.3L2.9 9.5l6.3-.9z"/></svg>',
  };
  var cats = C.ementa.categorias.filter(function (c) { return c.pratos.length; });

  function backHref() { var q = new URLSearchParams(); q.set("lang", lang); if (MODE !== (C.modo || "normal")) q.set(MODE, "1"); return "./?" + q.toString(); }

  function alHtml(a, li) {
    var A = window.MK_ALERG;
    if (!A || !Array.isArray(a) || !a.length) return "";
    return '<span class="al" aria-label="' + esc(A.titulo[li] || A.titulo[0]) + '">' + a.map(function (k) { var l = A.lab[k]; return l ? "<i>" + esc(l[li] || l[0]) + "</i>" : ""; }).join("") + "</span>";
  }
  function render() {
    var li = IDX[lang];
    document.documentElement.lang = lang === "zh" ? "zh-CN" : lang;
    document.title = t("menuDigital") + " · " + C.negocio.nomeCompleto;
    $("#langCode").textContent = lang.toUpperCase();
    $("#emName").textContent = C.negocio.nome; $("#emBackTxt").textContent = "← " + t("back");
    $("#emBack").href = backHref();
    $("#emKicker").textContent = t("menuDigital"); $("#emTitle").textContent = t("menuTitle");
    $("#emSearch").placeholder = t("search");
    var tabs = $("#emTabs"), list = $("#emList"); tabs.innerHTML = ""; list.innerHTML = "";
    cats.forEach(function (c) {
      var nm = c.nome[li] || c.nome[0];
      var a = document.createElement("a"); a.href = "#c-" + c.id; a.textContent = nm; a.dataset.cat = c.id;
      a.addEventListener("click", function (e) { e.preventDefault(); document.querySelectorAll("#emTabs a").forEach(function (x) { x.classList.toggle("on", x === a); x._on = x === a; }); lockSpy = Date.now() + 900; var s = document.getElementById("c-" + c.id); scrollTo({ top: s.getBoundingClientRect().top + scrollY - $(".em-head").offsetHeight + 1, behavior: "smooth" }); });
      tabs.appendChild(a);
      var sec = document.createElement("section"); sec.className = "em-cat"; sec.id = "c-" + c.id;
      var html = '<h2>' + esc(nm) + '<small>' + c.pratos.length + " " + esc(t("dishes")) + "</small></h2><ul>";
      c.pratos.forEach(function (p) {
        var tr = p[li] || p[0], orig = li ? p[0] : "";
        var hay = norm(p.slice(0, 8).join(" "));
        html += '<li class="em-dish" data-q="' + esc(hay) + '"><div><b>' + esc(tr) + "</b>" + (orig && orig !== tr ? "<em>" + esc(orig) + "</em>" : "") + alHtml(p[10], li) + "</div>" + (pricesOk && typeof p[8] === "number" ? '<span class="em-price">' + price(p[8], p[9]) + "</span>" : "") + "</li>";
      });
      sec.innerHTML = html + "</ul>";
      list.appendChild(sec);
    });
    var foot = [t("allergens")];
    if (window.MK_ALERG && cats.some(function (c) { return c.pratos.some(function (p) { return Array.isArray(p[10]); }); })) foot.push(window.MK_ALERG.nota[li] || window.MK_ALERG.nota[0]);
    foot.push(pricesOk ? t("priceNote") : t("noPrices"));
    if (C.ementa.atualizadaEm) foot.push(t("updated", { d: new Intl.DateTimeFormat(LOCALE[lang], { dateStyle: "long" }).format(new Date(C.ementa.atualizadaEm + "T12:00:00")) }));
    $("#emFoot").innerHTML = foot.map(esc).join("<br>");
    $("#emEmpty").textContent = t("noResults");
    var D = $("#emDock"); D.innerHTML = "";
    D.insertAdjacentHTML("beforeend", '<a href="tel:' + esc(C.negocio.telefone) + '">' + ICON.phone + "<span>" + esc(t("call")) + "</span></a>");
    if (C.links.avaliar) D.insertAdjacentHTML("beforeend", '<a href="' + esc(C.links.avaliar) + '" target="_blank" rel="noopener">' + ICON.star + "<span>" + esc(t("rate")) + "</span></a>");
    D.insertAdjacentHTML("beforeend", '<a class="main" href="' + esc(backHref()) + '#reservas">' + ICON.cal + "<span>" + esc(t("reserve")) + "</span></a>");
    renderSheet(); filter(); spy();
    var P = $("#reviewPanel");
    if (MODE === "rever") {
      var miss = [];
      if (!C.ementa.precosConfirmados) miss.push("preços da ementa por confirmar");
      if (!C.ementa.atualizadaEm) miss.push("data de atualização da ementa");
      C.ementa.categorias.forEach(function (c) { if (!c.pratos.length) miss.push(c.nome[0] + " em falta"); });
      P.innerHTML = "<details><summary>Modo revisão · " + miss.length + " pontos</summary><ul>" + miss.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul></details>"; P.hidden = false;
    }
  }

  function filter() {
    var q = norm($("#emSearch").value.trim()), any = false;
    document.querySelectorAll(".em-cat").forEach(function (s) {
      var vis = 0;
      s.querySelectorAll(".em-dish").forEach(function (d) { var ok = !q || d.dataset.q.indexOf(q) > -1; d.hidden = !ok; if (ok) vis++; });
      s.hidden = !vis; if (vis) any = true;
    });
    $("#emEmpty").hidden = any;
  }
  $("#emSearch").addEventListener("input", filter);

  var spyT, lockSpy = 0;
  function spy() {
    if (Date.now() < lockSpy) return;
    var top = $(".em-head").offsetHeight + 10, cur = null;
    document.querySelectorAll(".em-cat:not([hidden])").forEach(function (s) { if (s.getBoundingClientRect().top <= top) cur = s.id.slice(2); });
    if (!cur) { var f = document.querySelector(".em-cat:not([hidden])"); cur = f && f.id.slice(2); }
    document.querySelectorAll("#emTabs a").forEach(function (a) {
      var on = a.dataset.cat === cur; a.classList.toggle("on", on);
      if (on && a._on !== true) { var tb = $("#emTabs"); tb.scrollTo({ left: a.offsetLeft - tb.clientWidth / 2 + a.offsetWidth / 2, behavior: "smooth" }); }
      a._on = on;
    });
  }
  addEventListener("scroll", function () { clearTimeout(spyT); spyT = setTimeout(spy, 60); }, { passive: true });

  function renderSheet() {
    $("#langTitle").textContent = t("chooseLang"); $("#langSub").textContent = t("chooseLangSub");
    var G = $("#langGrid"); G.innerHTML = "";
    LANGS.forEach(function (l) {
      var b = document.createElement("button"); b.type = "button"; b.lang = l.code; b.setAttribute("aria-current", l.code === lang ? "true" : "false");
      b.innerHTML = '<span class="f" aria-hidden="true">' + l.flag + "</span>" + esc(l.label);
      b.addEventListener("click", function () { lang = l.code; store(KEY, lang); closeSheet(); render(); });
      G.appendChild(b);
    });
  }
  function openSheet() { $("#langSheet").hidden = false; }
  function closeSheet() { $("#langSheet").hidden = true; store(KEY, lang); }
  $("#langBtn").addEventListener("click", openSheet);
  $("#langSheet").addEventListener("click", function (e) { if (e.target.id === "langSheet") closeSheet(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeSheet(); });

  render();
  if (!params.get("lang") && !store(KEY)) setTimeout(openSheet, 300);
})();
