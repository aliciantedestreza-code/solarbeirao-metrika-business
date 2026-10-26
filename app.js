/* MÉTRIKA ID · motor da página (igual para todos os clientes; os dados vêm do config.js) */
(function () {
  "use strict";
  var C = window.METRIKA_CONFIG, I18N = window.METRIKA_I18N, LANGS = window.METRIKA_LANGS;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var LANG_IDX = { pt: 0, en: 1, fr: 2, es: 3, de: 4, it: 5, zh: 6, ja: 7 };
  var LOCALE = { pt: "pt-PT", en: "en-GB", fr: "fr-FR", es: "es-ES", de: "de-DE", it: "it-IT", zh: "zh-CN", ja: "ja-JP" };
  var params = new URLSearchParams(location.search);

  /* ---------- Modo ---------- */
  var MODE = params.get("rever") === "1" ? "rever" : params.get("demo") === "1" ? "demo" : params.get("normal") === "1" ? "normal" : (C.modo || "normal");
  var pending = [];
  function show(ok) { return MODE !== "normal" || !!ok; }
  function mark(el, ok, label) {
    if (ok) return;
    pending.push(label);
    if (MODE !== "rever" || !el) return;
    el.classList.add("rv-mark");
    var old = el.querySelector(":scope > .rv-tag"); if (old) old.remove();
    var tag = document.createElement("span"); tag.className = "rv-tag"; tag.textContent = "A confirmar: " + label;
    el.insertAdjacentElement("afterbegin", tag);
  }

  /* ---------- Storage seguro ---------- */
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  try { if (params.get("source")) sessionStorage.setItem("mk_source", params.get("source")); } catch (e) {}
  function source() { try { return sessionStorage.getItem("mk_source") || ""; } catch (e) { return ""; } }

  /* ---------- Língua ---------- */
  var KEY = "mk_lang_" + (C.negocio.nome || "").toLowerCase().replace(/\W+/g, "");
  function detect() {
    var p = (params.get("lang") || "").slice(0, 2); if (I18N[p]) return p;
    var s = store(KEY); if (s && I18N[s]) return s;
    var nav = navigator.languages || [navigator.language || "pt"];
    for (var i = 0; i < nav.length; i++) { var c = (nav[i] || "").slice(0, 2).toLowerCase(); if (I18N[c]) return c; }
    return "en";
  }
  var lang = detect();
  function t(k, vars) {
    var s = (I18N[lang] && I18N[lang][k]) || I18N.pt[k] || "";
    vars = vars || {};
    vars.nome = vars.nome || C.negocio.nome; vars.local = vars.local || C.negocio.morada.local;
    return s.replace(/\{(\w+)\}/g, function (_, v) { return vars[v] != null ? vars[v] : ""; });
  }
  function tObj(o) { return o ? (o[lang] || o.pt || "") : ""; }

  /* ---------- Ícones ---------- */
  var ICON = {
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.8l2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2l-5.6 3 1.1-6.3L2.9 9.5l6.3-.9z"/></svg>',
    save: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="10" cy="8" r="4"/><path d="M3 20a7 7 0 0 1 12-4.9M19 14v6M16 17h6"/></svg>',
    share: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12M7 8l5-5 5 5M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"/></svg>',
    cal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 3v8a2 2 0 0 0 2 2v8M10 3v6a2 2 0 0 1-2 2M6 3v6M17 21V3c-2 1-3 4-3 8h3"/></svg>',
    sms: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M4 5h16v11H9l-5 4z"/></svg>',
    wa: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.2a9.7 9.7 0 0 0-8.3 14.8L2.3 21.8l4.9-1.3A9.7 9.7 0 1 0 12 2.2zm0 17.7a8 8 0 0 1-4.1-1.1l-.3-.2-2.9.8.8-2.8-.2-.3A8 8 0 1 1 12 19.9zm4.4-6c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.8 1c-.1.2-.3.2-.5.1a6.6 6.6 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.5-.4h-.5a.9.9 0 0 0-.7.3 2.8 2.8 0 0 0-.9 2.1 4.9 4.9 0 0 0 1 2.6 11.2 11.2 0 0 0 4.3 3.8c1.6.7 2.2.7 3 .6a2.6 2.6 0 0 0 1.7-1.2 2.1 2.1 0 0 0 .1-1.2c0-.1-.2-.2-.5-.3z"/></svg>',
    ig: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none"/></svg>',
    fb: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 21v-8h2.8l.4-3.3H14V7.6c0-1 .3-1.6 1.6-1.6h1.7V3.1A23 23 0 0 0 14.8 3C12.3 3 10.7 4.5 10.7 7.3v2.4H8V13h2.7v8z"/></svg>',
    ta: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="7.3" cy="13" r="3.8"/><circle cx="16.7" cy="13" r="3.8"/><circle cx="7.3" cy="13" r="1.2" fill="currentColor"/><circle cx="16.7" cy="13" r="1.2" fill="currentColor"/><path d="M3 8.5C6 6 18 6 21 8.5M12 15.5l-1-1.6h2z"/></svg>',
    google: '<svg class="gmark" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36a12 12 0 1 1 7.9-21l5.7-5.7A20 20 0 1 0 44 24c0-1.2-.1-2.3-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8A12 12 0 0 1 31.9 15l5.7-5.7A20 20 0 0 0 6.3 14.7z"/><path fill="#4CAF50" d="M24 44a20 20 0 0 0 13.4-5.2l-6.2-5.2A12 12 0 0 1 12.7 28l-6.5 5A20 20 0 0 0 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3a12 12 0 0 1-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.2-.1-2.3-.4-3.5z"/></svg>',
  };
  var BRAND = { instagram: ["Instagram", "ig", "linear-gradient(45deg,#f09433,#dc2743 50%,#bc1888)"], facebook: ["Facebook", "fb", "#1877f2"], tripadvisor: ["Tripadvisor", "ta", "#00aa6c"], uber: ["Uber Eats", null, "#06c167"], glovo: ["Glovo", null, "#ffc244"], bolt: ["Bolt Food", null, "#34d186"] };

  /* ---------- Utilitários ---------- */
  function el(tag, attrs, html) { var e = document.createElement(tag); for (var k in attrs || {}) { if (attrs[k] != null) e.setAttribute(k, attrs[k]); } if (html != null) e.innerHTML = html; return e; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function digits(n) { return String(n).replace(/[^\d]/g, ""); }
  function prettyTel(n) { var d = digits(n).replace(/^351/, ""); return d.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3"); }
  function toast(msg) { var x = $("#toast"); x.textContent = msg; x.classList.add("show"); clearTimeout(toast._t); toast._t = setTimeout(function () { x.classList.remove("show"); }, 2200); }
  function hm(s) { var p = s.split(":"); return (+p[0]) * 60 + (+p[1]); }
  function fmtT(min) { min = min % 1440; return String(Math.floor(min / 60)).padStart(2, "0") + ":" + String(min % 60).padStart(2, "0"); }
  function lisbonNow() {
    var parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Lisbon", weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(new Date());
    var o = {}; parts.forEach(function (p) { o[p.type] = p.value; });
    var wd = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[o.weekday];
    return { wd: wd, min: (+o.hour % 24) * 60 + (+o.minute) };
  }
  function weekdayName(wd, style) { var d = new Date(2024, 0, 7 + wd); return new Intl.DateTimeFormat(LOCALE[lang], { weekday: style || "long" }).format(d); }
  var waOk = show(C.whatsapp && C.whatsapp.confirmado) && C.whatsapp && C.whatsapp.numero;
  var hoursOk = show(C.horario.confirmado);
  var pricesOk = show(C.ementa.precosConfirmados);

  /* ---------- Render ---------- */
  function render() {
    var N = C.negocio, L = C.links;
    document.documentElement.lang = LOCALE[lang].slice(0, 2) === "zh" ? "zh-CN" : lang;
    $("#langCode").textContent = lang.toUpperCase();
    document.querySelectorAll("[data-t]").forEach(function (e) { e.textContent = t(e.dataset.t); });
    document.querySelectorAll("[data-ph]").forEach(function (e) { e.placeholder = t(e.dataset.ph); });
    document.querySelectorAll("[data-t-obj]").forEach(function (e) { e.textContent = tObj(N[e.dataset.tObj]); });
    document.querySelectorAll('[data-bind="nome"]').forEach(function (e) { e.textContent = N.nome; });

    renderStatus();

    /* Ações rápidas */
    var A = $("#actions"); A.innerHTML = "";
    /* 6 ações do modelo V9: Guardar contacto, WhatsApp, Ligar, Como chegar, Avaliar no Google, Ementa */
    var acts = [
      ["contacto.vcf", "save", t("save")],
      [waOk ? "https://wa.me/" + digits(C.whatsapp.numero) : "", "wa", t("whatsapp"), true],
      ["tel:" + N.telefone, "phone", t("call")],
      [L.maps, "pin", t("directions"), true],
      [L.avaliar, "star", t("rate"), true, "gold"],
      [menuHref(), "menu", t("menu")],
    ];
    acts.forEach(function (a) {
      if (!a[0]) return;
      var x = el("a", { class: "action " + (a[4] || ""), href: a[0], target: a[3] ? "_blank" : null, rel: a[3] ? "noopener" : null }, "<i>" + ICON[a[1]] + "</i><span>" + esc(a[2]) + "</span>");
      if (a[1] === "save") x.setAttribute("download", (N.nome || "contacto").replace(/\s+/g, "-") + ".vcf");
      A.appendChild(x);
    });

    /* Redes + partilhar */
    var S = $("#socials"); S.innerHTML = "";
    ["instagram", "facebook", "tripadvisor"].forEach(function (k) {
      if (!L[k]) return; var b = BRAND[k];
      S.appendChild(el("a", { class: "soc", href: L[k], target: "_blank", rel: "noopener" }, '<span class="ico" style="background:' + b[2] + '">' + ICON[b[1]] + "</span>" + b[0]));
    });
    var sh = el("a", { class: "soc", href: "#", role: "button" }, '<span class="ico" style="background:#7a1f2b">' + ICON.share + "</span>" + esc(t("share")));
    sh.addEventListener("click", function (e) { e.preventDefault(); doShare(); });
    S.appendChild(sh);

    renderRail("espaco", C.fotos.espaco, N.nomeCompleto + " — " + t("space"));
    renderRail("comida", C.fotos.comida, N.nomeCompleto + " — " + t("food"));
    renderMenu();
    renderReviews();
    renderBooking();
    renderDelivery();
    renderVisit();
    renderFooter();
    renderDock();
    renderLangSheet();
    syncMenuLinks();
  }

  function renderStatus() {
    var st = $("#status");
    if (!hoursOk) { st.hidden = true; return; }
    var now = lisbonNow(), D = C.horario.dias, open = null;
    (D[now.wd] || []).forEach(function (r) { var a = hm(r[0]), b = hm(r[1]); if (b <= a) b += 1440; if (now.min >= a && now.min < b) open = b; });
    var prev = (now.wd + 6) % 7; // turnos que passam a meia-noite
    (D[prev] || []).forEach(function (r) { var a = hm(r[0]), b = hm(r[1]); if (b > 1440 && now.min < b - 1440) open = b; });
    if (open != null) { st.textContent = t("openNow") + " · " + t("closesAt", { t: fmtT(open) }); st.className = "status open"; }
    else {
      var next = null;
      for (var i = 0; i < 7 && !next; i++) {
        var wd = (now.wd + i) % 7;
        (D[wd] || []).forEach(function (r) { var a = hm(r[0]); if (!next && (i > 0 || a > now.min)) next = { i: i, wd: wd, t: r[0] }; });
      }
      st.textContent = t("closed") + (next ? " · " + (next.i === 0 ? t("opensAt", { t: next.t }) : t("opensDay", { d: next.i === 1 ? t("tomorrow").toLowerCase() : weekdayName(next.wd), t: next.t })) : "");
      st.className = "status";
    }
    st.hidden = false;
    if (MODE === "rever" && !C.horario.confirmado) st.classList.add("rv-mark");
  }

  var railTimers = [];
  function renderRail(id, list, alt) {
    var R = document.querySelector('[data-rail="' + id + '"]'); if (!R) return;
    R.innerHTML = "";
    if (!list || !list.length) { R.closest("section").hidden = true; return; }
    list.forEach(function (f, i) {
      R.appendChild(el("img", { src: "assets/img/" + f + "-640.webp", srcset: "assets/img/" + f + "-640.webp 640w, assets/img/" + f + "-1200.webp 1200w", sizes: "(max-width:760px) 82vw, 420px", alt: alt + " " + (i + 1), loading: i < 2 ? "eager" : "lazy", decoding: "async", width: 420, height: 315 }));
    });
    var dots = R.nextElementSibling && R.nextElementSibling.classList.contains("dots") ? R.nextElementSibling : el("div", { class: "dots", "aria-hidden": "true" });
    dots.innerHTML = list.map(function () { return "<i></i>"; }).join(""); if (!dots.parentNode) R.after(dots);
    R._dots = dots;
    autoRail(R);
  }
  function autoRail(R) {
    if (R._auto) return;
    R._auto = true;
    var pausedUntil = 0, visible = false;
    var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
    function idx() { var kids = R.children, best = 0, d = 1e9; for (var i = 0; i < kids.length; i++) { var x = Math.abs(kids[i].offsetLeft - R.scrollLeft - parseFloat(getComputedStyle(R).scrollPaddingLeft || 0)); if (x < d) { d = x; best = i; } } return best; }
    function updateDots() { var i = idx(); var ds = R._dots ? R._dots.children : []; for (var k = 0; k < ds.length; k++) ds[k].className = k === i ? "on" : ""; }
    R.addEventListener("scroll", function () { clearTimeout(R._st); R._st = setTimeout(updateDots, 80); }, { passive: true });
    ["pointerdown", "touchstart", "wheel"].forEach(function (ev) { R.addEventListener(ev, function () { pausedUntil = Date.now() + 9000; }, { passive: true }); });
    if ("IntersectionObserver" in window) new IntersectionObserver(function (es) { visible = es[0].isIntersecting; }, { threshold: .4 }).observe(R);
    updateDots();
    if (reduce) return;
    railTimers.push(setInterval(function () {
      if (!visible || Date.now() < pausedUntil || document.hidden) return;
      var kids = R.children, i = idx(), n = i + 1 >= kids.length || R.scrollLeft + R.clientWidth >= R.scrollWidth - 4 ? 0 : i + 1;
      var pad = parseFloat(getComputedStyle(R).scrollPaddingLeft || 0);
      R.scrollTo({ left: kids[n].offsetLeft - pad, behavior: "smooth" });
    }, 3600));
  }

  function price(p, unit) {
    var s = new Intl.NumberFormat(LOCALE[lang], { style: "currency", currency: "EUR", minimumFractionDigits: 2 }).format(p);
    return esc(s) + (unit ? "<small>/" + esc(unit) + "</small>" : "");
  }
  /* Alergénios validados pelo restaurante (p[10]); sem validação não mostra nada */
  function alHtml(a, li) {
    var A = window.MK_ALERG;
    if (!A || !Array.isArray(a) || !a.length) return "";
    return '<span class="al" aria-label="' + esc(A.titulo[li] || A.titulo[0]) + '">' + a.map(function (k) { var l = A.lab[k]; return l ? "<i>" + esc(l[li] || l[0]) + "</i>" : ""; }).join("") + "</span>";
  }
  function hasAl(cats) { return cats.some(function (c) { return c.pratos.some(function (p) { return Array.isArray(p[10]); }); }); }
  function renderMenu() {
    var M = C.ementa, li = LANG_IDX[lang];
    $("#menuTitle").textContent = t("menuTitle");
    $("#menuSub").textContent = t("menuSub");
    var chips = $("#menuChips"), cats = $("#menuCats"); chips.innerHTML = ""; cats.innerHTML = "";
    var openIds = Array.prototype.map.call(document.querySelectorAll(".cat[open]"), function (d) { return d.id; });
    var first = true;
    M.categorias.forEach(function (c) {
      var nm = c.nome[li] || c.nome[0];
      if (!c.pratos.length) {
        pending.push(c.nome[0] + " (carta em falta)");
        if (MODE === "rever") cats.appendChild(el("div", { class: "rv-box" }, "<b>" + esc(c.nome[0]) + "</b> — falta a carta real (" + (c.id === "sobremesas" ? "5 sobremesas" : "vinhos") + "). Secção escondida até ser preenchida."));
        return;
      }
      var chip = el("button", { class: "chip", type: "button", role: "tab", "aria-selected": "false", "data-cat": c.id }, esc(nm));
      chip.addEventListener("click", function () { openCat(c.id, true); });
      chips.appendChild(chip);
      var d = el("details", { class: "cat", id: "cat-" + c.id });
      if ((openIds.length ? openIds.indexOf("cat-" + c.id) > -1 : first)) d.open = true;
      first = false;
      d.appendChild(el("summary", null, esc(nm) + "<small>" + c.pratos.length + "</small>"));
      var ul = el("ul", { class: "dishes" });
      c.pratos.forEach(function (p) {
        var tr = p[li] || p[0], orig = li ? p[0] : "";
        var pr = pricesOk && typeof p[8] === "number" ? '<span class="dish-price">' + price(p[8], p[9]) + "</span>" : "";
        ul.appendChild(el("li", { class: "dish" }, '<span class="dish-name"><b>' + esc(tr) + "</b>" + (orig && orig !== tr ? "<em>" + esc(orig) + "</em>" : "") + alHtml(p[10], li) + "</span>" + pr));
      });
      d.appendChild(ul);
      d.addEventListener("toggle", syncChips);
      cats.appendChild(d);
    });
    syncChips();
    var foot = [t("allergens")];
    if (window.MK_ALERG && hasAl(M.categorias)) foot.push(window.MK_ALERG.nota[li] || window.MK_ALERG.nota[0]);
    if (pricesOk) foot.push(t("priceNote")); else foot.push(t("noPrices"));
    if (M.atualizadaEm) foot.push(t("updated", { d: new Intl.DateTimeFormat(LOCALE[lang], { dateStyle: "long" }).format(new Date(M.atualizadaEm + "T12:00:00")) }));
    if (window.MK_LEGAL) foot = foot.concat(window.MK_LEGAL[lang] || window.MK_LEGAL.pt);
    $("#menuFoot").innerHTML = foot.map(esc).join("<br>");
    if (!M.precosConfirmados) mark(MODE === "rever" ? cats : null, false, "preços da ementa (transcritos de fotos públicas)");
    if (!M.atualizadaEm) pending.push("data de atualização da ementa");
  }
  function openCat(id, scroll) {
    document.querySelectorAll(".cat").forEach(function (d) { d.open = d.id === "cat-" + id; });
    syncChips();
    if (scroll) { var d = $("#cat-" + id); var y = d.getBoundingClientRect().top + scrollY - 80; window.scrollTo({ top: y, behavior: "smooth" }); }
  }
  function syncChips() { document.querySelectorAll(".chip").forEach(function (c) { var d = $("#cat-" + c.dataset.cat); c.setAttribute("aria-selected", d && d.open ? "true" : "false"); }); }

  function stars(v) { return '<span class="stars" role="img" aria-label="' + v + '/5"><span style="width:' + (v / 5 * 100) + '%"></span></span>'; }
  function renderReviews() {
    var R = C.avaliacoes, L = C.links;
    if (!R || !R.nota) { $("#avaliacoes").hidden = true; return; }
    var nf = new Intl.NumberFormat(LOCALE[lang], { maximumFractionDigits: 1, minimumFractionDigits: 1 });
    $("#score").innerHTML = ICON.google + "<b>" + nf.format(R.nota) + "</b><div>" + stars(R.nota) + "<small>" + esc(t("reviewsCount", { n: new Intl.NumberFormat(LOCALE[lang]).format(R.total) })) + "</small></div>";
    var box = $("#reviews"); box.innerHTML = "";
    (R.lista || []).forEach(function (r) {
      box.appendChild(el("article", { class: "review" }, '<div class="review-top"><span class="avatar">' + esc(r.nome.charAt(0)) + "</span><div><b>" + esc(r.nome) + "</b><small>" + esc(R.fonte || "Google") + "</small></div></div>" + stars(r.estrelas) + "<p>“" + esc(r.texto) + "”</p>"));
    });
    if (!box.children.length) box.hidden = true; else autoRail(box);
    if ((R.lista || []).length < 4) {
      pending.push("mais avaliações reais (ideal 6–8, só as melhores)");
      if (MODE === "rever") box.appendChild(el("div", { class: "review rv-box" }, "Adicionar mais 4–6 comentários reais do Google (nome + texto)."));
    }
    var B = $("#reviewBtns"); B.innerHTML = "";
    if (L.avaliar) B.appendChild(el("a", { class: "btn btn-gold", href: L.avaliar, target: "_blank", rel: "noopener" }, ICON.star + esc(t("writeReview"))));
    if (L.verAvaliacoes) B.appendChild(el("a", { class: "btn btn-line", href: L.verAvaliacoes, target: "_blank", rel: "noopener" }, esc(t("seeAll"))));
  }

  /* ---------- Reservas ---------- */
  var book = { mode: null, other: "", ppl: 2 };
  function dateKey(d) { return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
  function slotsFor(key) {
    var r = C.horario.reservas, out = [], a = hm(r.inicio), b = hm(r.fim), step = r.passoMin || 30;
    var todayKey = dateKey(new Date()), now = lisbonNow().min;
    for (var m = a; m <= b; m += step) { if (key === todayKey && m < now + 30) continue; out.push(fmtT(m)); }
    return out;
  }
  function bookDay() { var d = new Date(); if (book.mode === "today") return dateKey(d); if (book.mode === "tomorrow") return dateKey(new Date(Date.now() + 864e5)); return book.other || null; }
  function renderBooking() {
    var seg = $("#daySeg"), di = $("#dayInput");
    if (!book.mode) book.mode = slotsFor(dateKey(new Date())).length ? "today" : "tomorrow";
    seg.innerHTML = "";
    [["today", "today"], ["tomorrow", "tomorrow"], ["other", "otherDay"]].forEach(function (o) {
      var b = el("button", { type: "button", "aria-pressed": book.mode === o[0] ? "true" : "false" }, esc(t(o[1])));
      b.addEventListener("click", function () { book.mode = o[0]; renderBooking(); if (o[0] === "other") { di.focus(); try { di.showPicker && di.showPicker(); } catch (e) {} } });
      seg.appendChild(b);
    });
    di.min = dateKey(new Date()); di.hidden = book.mode !== "other"; di.value = book.other;
    di.onchange = function () { book.other = di.value; renderBooking(); };
    var sel = $("#timeSel"), cur = sel.value, day = bookDay(); sel.innerHTML = '<option value="">—</option>';
    if (day) slotsFor(day).forEach(function (s) { sel.appendChild(el("option", { value: s }, s)); });
    if (cur && Array.prototype.some.call(sel.options, function (o) { return o.value === cur; })) sel.value = cur;
    $("#ppl").textContent = book.ppl >= 20 ? "20+" : book.ppl;
    $("#pplMinus").onclick = function () { book.ppl = Math.max(1, book.ppl - 1); $("#ppl").textContent = book.ppl; };
    $("#pplPlus").onclick = function () { book.ppl = Math.min(20, book.ppl + 1); $("#ppl").textContent = book.ppl >= 20 ? "20+" : book.ppl; };
    var btn = $("#bookSend"); btn.innerHTML = (waOk ? ICON.wa + esc(t("sendWA")) : ICON.sms + esc(t("sendSMS")));
    var call = $("#bookCall"); call.href = "tel:" + C.negocio.telefone; call.textContent = prettyTel(C.negocio.telefone);
    $("#book").onsubmit = sendBooking;
    if (C.whatsapp && !C.whatsapp.confirmado) mark(MODE === "rever" ? $("#book") : null, false, "WhatsApp do " + prettyTel(C.whatsapp.numero) + " (sem WhatsApp → SMS)");
  }
  function sendBooking(e) {
    e.preventDefault();
    var time = $("#timeSel").value, name = $("#nameIn").value.trim(), notes = $("#notesIn").value.trim(), miss = [];
    var day = bookDay();
    if (!day) miss.push(t("date")); if (!time) miss.push(t("time")); if (!name) miss.push(t("name"));
    var err = $("#bookErr");
    if (miss.length) { err.textContent = t("missing", { f: miss.join(", ") }); err.hidden = false; return; }
    err.hidden = true;
    var d = new Date(day + "T12:00:00");
    var dPT = new Intl.DateTimeFormat("pt-PT", { weekday: "long", day: "2-digit", month: "2-digit", year: "numeric" }).format(d);
    var langLabel = (LANGS.filter(function (l) { return l.code === lang; })[0] || {}).label;
    var msg = t("waHello") + "\n\n" +
      "📅 Dia: " + dPT + "\n🕗 Hora: " + time + "\n👥 Pessoas: " + (book.ppl >= 20 ? "20+" : book.ppl) + "\n🙋 Nome: " + name +
      (notes ? "\n📝 Notas: " + notes : "") + (lang !== "pt" ? "\n🌍 Idioma: " + langLabel : "") + (source() ? "\n🔗 Origem: " + source() : "");
    var num = digits(waOk ? C.whatsapp.numero : (C.whatsapp && C.whatsapp.numero) || C.negocio.telemovel);
    location.href = waOk ? "https://wa.me/" + num + "?text=" + encodeURIComponent(msg) : "sms:+" + num + "?&body=" + encodeURIComponent(msg);
  }

  function renderDelivery() {
    var E = C.entregas || {}, B = $("#deliveryBtns"), any = false; B.innerHTML = "";
    ["uber", "glovo", "bolt"].forEach(function (k) {
      if (!E[k]) return; any = true; var b = BRAND[k];
      B.appendChild(el("a", { class: "soc", href: E[k], target: "_blank", rel: "noopener" }, '<span class="ico" style="background:' + b[2] + '">' + ICON.menu + "</span>" + b[0]));
    });
    $("#entregas").hidden = !any;
    if (!any) pending.push("plataformas de entrega (Uber Eats / Glovo / Bolt) — confirmar se tem");
  }

  function renderVisit() {
    var N = C.negocio, M = N.morada, L = C.links;
    $("#visitTitle").textContent = t("visitTitle");
    $("#addr").textContent = [M.rua, M.local, M.codigoPostal + " " + M.cidade].filter(Boolean).join(" · ");
    var map = $("#map"); if (L.mapsEmbed && map.getAttribute("src") !== L.mapsEmbed) map.src = L.mapsEmbed;
    if (!L.mapsEmbed) map.parentNode.hidden = true;
    var H = $("#hours"); H.innerHTML = "";
    var D = C.horario.dias, now = lisbonNow();
    var fmt = function (rs) { return (rs || []).map(function (r) { return r[0] + "–" + (r[1] === "24:00" ? "00:00" : r[1]); }).join(", ") || t("closed"); };
    var all = [0, 1, 2, 3, 4, 5, 6].map(function (i) { return fmt(D[i]); });
    if (all.every(function (x) { return x === all[0]; })) H.appendChild(el("li", { class: "today" }, "<span>" + esc(t("everyDay")) + "</span><span>" + esc(all[0]) + "</span>"));
    else [1, 2, 3, 4, 5, 6, 0].forEach(function (i) { H.appendChild(el("li", { class: i === now.wd ? "today" : null }, "<span>" + esc(weekdayName(i)) + "</span><span>" + esc(all[i]) + "</span>")); });
    $("#hoursCard").hidden = !hoursOk;
    if (!C.horario.confirmado) mark(MODE === "rever" ? $("#hoursCard") : null, false, "horário (tirado da ficha Google)");
    var CT = $("#contacts"); CT.innerHTML = "";
    [[N.telefone, "tel:" + N.telefone, prettyTel(N.telefone)], [N.telemovel, "tel:" + N.telemovel, prettyTel(N.telemovel)], [waOk, waOk ? "https://wa.me/" + digits(C.whatsapp.numero) : "", "WhatsApp"], [N.email, "mailto:" + N.email, N.email]]
      .forEach(function (c) { if (c[0]) CT.appendChild(el("li", null, '<a href="' + esc(c[1]) + '"' + (c[2] === "WhatsApp" ? ' target="_blank" rel="noopener"' : "") + ">" + esc(c[2]) + "</a>")); });
  }

  function renderFooter() {
    var L = C.links, N = C.negocio, F = $("#footSocial"); F.innerHTML = "";
    ["instagram", "facebook", "tripadvisor"].forEach(function (k) { if (L[k]) F.appendChild(el("a", { href: L[k], target: "_blank", rel: "noopener", "aria-label": BRAND[k][0] }, ICON[BRAND[k][1]])); });
    $("#lrLink").href = L.livroReclamacoes || "https://www.livroreclamacoes.pt/inicio";
    $("#footLegal").textContent = [N.razaoSocial || N.nomeCompleto, N.nif ? "NIF " + N.nif : "", N.morada.rua + ", " + N.morada.codigoPostal + " " + N.morada.cidade].filter(Boolean).join(" · ");
    if (!N.nif) pending.push("NIF (rodapé e Política de Privacidade)");
    $("#credit").textContent = C.credito || "";
  }

  function renderDock() {
    var D = $("#dock"); D.innerHTML = "";
    D.appendChild(el("a", { href: "tel:" + C.negocio.telefone }, ICON.phone + "<span>" + esc(t("call")) + "</span>"));
    if (waOk) D.appendChild(el("a", { href: "https://wa.me/" + digits(C.whatsapp.numero), target: "_blank", rel: "noopener" }, ICON.wa + "<span>WhatsApp</span>"));
    else D.appendChild(el("a", { href: menuHref() }, ICON.menu + "<span>" + esc(t("menu")) + "</span>"));
    D.appendChild(el("a", { href: "#reservas", class: "main" }, ICON.cal + "<span>" + esc(t("reserve")) + "</span>"));
  }

  function menuHref() { var q = new URLSearchParams(); q.set("lang", lang); if (MODE !== (C.modo || "normal")) q.set(MODE, "1"); return "ementa.html?" + q.toString(); }
  function syncMenuLinks() { document.querySelectorAll("[data-menu-link]").forEach(function (a) { a.href = menuHref(); }); }
  /* ---------- Seletor de língua ---------- */
  function renderLangSheet() {
    $("#langTitle").textContent = t("chooseLang"); $("#langSub").textContent = t("chooseLangSub");
    var G = $("#langGrid"); G.innerHTML = "";
    LANGS.forEach(function (l) {
      var b = el("button", { type: "button", lang: l.code, "aria-current": l.code === lang ? "true" : "false" }, '<span class="f" aria-hidden="true">' + l.flag + "</span>" + esc(l.label));
      b.addEventListener("click", function () { setLang(l.code); closeSheet(); });
      G.appendChild(b);
    });
  }
  function openSheet() { $("#langSheet").hidden = false; var c = $('#langGrid [aria-current="true"]'); if (c) c.focus(); }
  function closeSheet() { $("#langSheet").hidden = true; store(KEY, lang); }
  function setLang(c) { lang = c; store(KEY, c); pending = []; render(); renderPanel(); }
  $("#langBtn").addEventListener("click", openSheet);
  $("#langSheet").addEventListener("click", function (e) { if (e.target.id === "langSheet") closeSheet(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !$("#langSheet").hidden) closeSheet(); });

  function doShare() {
    var url = C.url || location.origin;
    if (navigator.share) { navigator.share({ title: C.negocio.nomeCompleto, text: tObj(C.negocio.slogan), url: url }).catch(function () {}); return; }
    (navigator.clipboard ? navigator.clipboard.writeText(url) : Promise.reject()).then(function () { toast(t("copied")); }, function () { prompt("URL", url); });
  }

  /* ---------- Scroll: barra de topo e dock ---------- */
  function onScroll() {
    var h = $("#hero").offsetHeight, y = scrollY;
    $("#topbar").classList.toggle("solid", y > h - 70);
    $("#dock").classList.toggle("show", y > h * .6);
  }
  addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Painel de revisão ---------- */
  function renderPanel() {
    var P = $("#reviewPanel");
    if (MODE !== "rever") { P.hidden = true; return; }
    var uniq = pending.filter(function (x, i) { return x && pending.indexOf(x) === i; });
    P.innerHTML = "<details><summary>Modo revisão · " + uniq.length + " pontos a confirmar</summary><ul>" + uniq.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul></details>";
    P.hidden = false;
  }

  render(); renderPanel(); onScroll();
  if (!params.get("lang") && !store(KEY)) setTimeout(openSheet, 350);
  setInterval(renderStatus, 60000);
  window.METRIKA_DEBUG = { mode: MODE, pending: function () { return pending.slice(); } };
})();
