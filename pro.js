/* MÉTRIKA ID Pro · Solar Beirão · camada "ao vivo" (prato do dia, preços, esgotados, pratos novos).
   Lê o que o restaurante publica no MÉTRIKA Business e aplica ao config.js antes de arrancar o motor.
   Se a rede falhar, o ID abre na mesma com a última versão conhecida (ou com a ementa base). */
(function () {
  "use strict";
  var PRO = {
    slug: "solarbeirao-cacilhas",
    api: "https://dnwijjgefcxurdffabyq.supabase.co/rest/v1/rpc/",
    key: "sb_publishable_Cb2obpnoRx-4W8DjCXKwkA_psuaaOgt",
    timeout: 3500
  };
  var C = window.METRIKA_CONFIG;
  var me = document.currentScript;
  var engine = me && me.getAttribute("data-engine");
  var CACHE = "mk_pro_" + PRO.slug;
  var IDX = { pt: 0, en: 1, fr: 2, es: 3, de: 4, it: 5, zh: 6, ja: 7 };
  var LOC = { pt: "pt-PT", en: "en-GB", fr: "fr-FR", es: "es-ES", de: "de-DE", it: "it-IT", zh: "zh-CN", ja: "ja-JP" };

  var T = {
    hoje:    ["Hoje no Solar Beirão", "Today at Solar Beirão", "Aujourd’hui au Solar Beirão", "Hoy en Solar Beirão", "Heute im Solar Beirão", "Oggi al Solar Beirão", "Solar Beirão 今日推荐", "本日の Solar Beirão"],
    kicker:  ["Fresco de hoje", "Fresh today", "Frais du jour", "Fresco de hoy", "Heute frisch", "Fresco di oggi", "今日新鲜", "本日のおすすめ"],
    atual:   ["Atualizado hoje às {t}", "Updated today at {t}", "Mis à jour aujourd’hui à {t}", "Actualizado hoy a las {t}", "Heute um {t} aktualisiert", "Aggiornato oggi alle {t}", "今天 {t} 更新", "本日 {t} 更新"],
    esg:     ["Esgotado", "Sold out", "Épuisé", "Agotado", "Ausverkauft", "Esaurito", "已售罄", "売り切れ"],
    reservar:["Reservar mesa", "Book a table", "Réserver", "Reservar mesa", "Tisch reservieren", "Prenota", "预订餐桌", "席を予約"],
    ptNota:  ["", "Dishes of the day are written in Portuguese — ask our team.", "Plats du jour en portugais — demandez à notre équipe.", "Platos del día en portugués — pregunte a nuestro equipo.", "Tagesgerichte auf Portugiesisch – fragen Sie unser Team.", "Piatti del giorno in portoghese — chiedi al nostro staff.", "每日菜品以葡萄牙语标注，欢迎咨询店员。", "本日の料理はポルトガル語表記です。スタッフにお尋ねください。"],
    novoPt:  ["", "Some new dishes are written in Portuguese — ask our team.", "Certains nouveaux plats sont en portugais — demandez à notre équipe.", "Algunos platos nuevos están en portugués — pregunte a nuestro equipo.", "Einige neue Gerichte sind auf Portugiesisch – fragen Sie unser Team.", "Alcuni piatti nuovi sono in portoghese — chiedi al nostro staff.", "部分新菜品以葡萄牙语标注，欢迎咨询店员。", "一部の新メニューはポルトガル語表記です。スタッフにお尋ねください。"]
  };
  var TIPOS = {
    prato:     ["Prato do dia", "Dish of the day", "Plat du jour", "Plato del día", "Tagesgericht", "Piatto del giorno", "今日菜品", "本日の一皿"],
    menu:      ["Menu do dia", "Set menu of the day", "Menu du jour", "Menú del día", "Tagesmenü", "Menù del giorno", "今日套餐", "本日のセット"],
    peixe:     ["Peixe fresco do dia", "Fresh fish of the day", "Poisson frais du jour", "Pescado fresco del día", "Frischer Fisch des Tages", "Pesce fresco del giorno", "今日鲜鱼", "本日の鮮魚"],
    marisco:   ["Marisco do dia", "Seafood of the day", "Fruits de mer du jour", "Marisco del día", "Meeresfrüchte des Tages", "Frutti di mare del giorno", "今日海鲜", "本日の魚介"],
    sopa:      ["Sopa do dia", "Soup of the day", "Soupe du jour", "Sopa del día", "Tagessuppe", "Zuppa del giorno", "今日例汤", "本日のスープ"],
    sobremesa: ["Sobremesa do dia", "Dessert of the day", "Dessert du jour", "Postre del día", "Dessert des Tages", "Dolce del giorno", "今日甜点", "本日のデザート"],
    chef:      ["Sugestão do chef", "Chef’s suggestion", "Suggestion du chef", "Sugerencia del chef", "Empfehlung des Küchenchefs", "Consiglio dello chef", "主厨推荐", "シェフのおすすめ"]
  };
  var SOLD_MARK = "⁣";   // marcador invisível que identifica pratos esgotados no DOM

  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function lang() { var l = (document.documentElement.lang || "pt").slice(0, 2); return IDX[l] != null ? l : "pt"; }
  function tr(row) { var i = IDX[lang()]; return row[i] || row[0]; }
  function today() {
    var p = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Lisbon", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
    return p.slice(0, 10);
  }
  function hhmm(iso) { try { return new Intl.DateTimeFormat("pt-PT", { timeZone: "Europe/Lisbon", hour: "2-digit", minute: "2-digit" }).format(new Date(iso)); } catch (e) { return ""; } }
  function money(v) { return new Intl.NumberFormat(LOC[lang()], { style: "currency", currency: "EUR", minimumFractionDigits: 2 }).format(v); }
  function num(v) { return typeof v === "number" && isFinite(v) && v >= 0 ? v : null; }

  /* ---------- 1. Aplicar alterações à ementa (antes do motor arrancar) ---------- */
  var HAS_NEW = false, NEW_MISS = {};   // NEW_MISS[i] = há pratos novos sem tradução na língua i
  function applyMenu(state, updatedAt, rev) {
    var E = (state && state.ementa) || {}, alt = E.alt || {}, novos = E.novos || [];
    if (!C || !C.ementa || !C.ementa.categorias) return;
    C.ementa.categorias.forEach(function (c) {
      c.pratos = c.pratos.filter(function (p) {
        var a = alt[c.id + "|" + p[0]];
        if (!a) return true;
        if (a.o) return false;
        if (num(a.p) != null) p[8] = a.p;
        if (a.e) {
          for (var i = 0; i < 8; i++) if (p[i]) p[i] = p[i] + SOLD_MARK;
          p[8] = null;
        }
        return true;
      });
    });
    novos.forEach(function (n) {
      if (!n || !n.n) return;
      var c = C.ementa.categorias.filter(function (x) { return x.id === n.c; })[0];
      if (!c) return;
      var t = Array.isArray(n.tr) ? n.tr : [];
      var row = [String(n.n).slice(0, 140), String(t[0] || "").slice(0, 140), String(t[1] || "").slice(0, 140), String(t[2] || "").slice(0, 140), String(t[3] || "").slice(0, 140), "", "", "", num(n.p)];
      for (var i = 1; i < 8; i++) if (!row[i]) NEW_MISS[i] = true;
      if (n.e) { for (var j = 0; j < 8; j++) if (row[j]) row[j] += SOLD_MARK; row[8] = null; }
      c.pratos.push(row); HAS_NEW = true;
    });
    if (updatedAt && rev) C.ementa.atualizadaEm = String(updatedAt).slice(0, 10);
  }

  /* ---------- 2. Etiqueta "Esgotado" no DOM do motor ---------- */
  function decorate() {
    var label = tr(T.esg);
    document.querySelectorAll(".dish-name b, .dish-name em, .em-dish b, .em-dish em").forEach(function (b) {
      if (b.textContent.indexOf(SOLD_MARK) < 0) return;
      var clean = b.textContent.split(SOLD_MARK).join("");
      if (b.tagName === "EM") { b.textContent = clean; return; }
      b.textContent = clean;
      var li = b.closest(".dish, .em-dish"); if (li) li.classList.add("pro-off");
      var s = document.createElement("span"); s.className = "pro-sold"; s.textContent = label;
      b.appendChild(document.createTextNode(" ")); b.appendChild(s);
    });
  }

  /* ---------- 3. Bloco "Hoje" ---------- */
  var STATE = null, UPDATED = null;
  function dayVisible(h) {
    if (!h || !h.itens || !h.itens.length) return false;
    var ok = h.itens.some(function (x) { return x && x.n; });
    return ok && (h.fixo || h.data === today());
  }
  function renderHoje() {
    var box = document.getElementById("hoje");
    if (!box) return;
    var h = STATE && STATE.hoje;
    if (!dayVisible(h)) { box.hidden = true; box.innerHTML = ""; return; }
    var L = lang(), onMenu = document.body.classList.contains("em-body");
    var items = h.itens.filter(function (x) { return x && x.n; }).map(function (x) {
      var tipo = TIPOS[x.t] ? tr(TIPOS[x.t]) : tr(TIPOS.prato);
      var p = num(x.p);
      return '<li class="pro-item' + (x.e ? " pro-off" : "") + '">' +
        '<span class="pro-tipo">' + esc(tipo) + "</span>" +
        '<span class="pro-row"><b>' + esc(x.n) + "</b>" +
        (x.e ? '<span class="pro-sold">' + esc(tr(T.esg)) + "</span>" : p != null ? '<span class="pro-price">' + esc(money(p)) + "</span>" : "") +
        "</span>" + (x.d ? '<span class="pro-desc">' + esc(x.d) + "</span>" : "") + "</li>";
    }).join("");
    var when = h.fixo ? "" : (h.publicadoEm || UPDATED) ? tr(T.atual).replace("{t}", hhmm(h.publicadoEm || UPDATED)) : "";
    var note = h.nota ? '<p class="pro-note">' + esc(h.nota) + "</p>" : "";
    var ptNote = L !== "pt" ? '<p class="pro-pt">' + esc(tr(T.ptNota)) + "</p>" : "";
    var ctas = onMenu ? "" : '<div class="pro-cta"><a class="btn btn-gold" href="#reservas">' + esc(tr(T.reservar)) + "</a></div>";
    box.innerHTML = '<div class="wrap"><div class="pro-card">' +
      '<div class="pro-head"><span class="pro-live" aria-hidden="true"></span><span class="pro-kick">' + esc(tr(T.kicker)) + "</span></div>" +
      '<h2 class="pro-title">' + esc(tr(T.hoje)) + "</h2>" +
      '<ul class="pro-list">' + items + "</ul>" + note + ptNote +
      (when ? '<p class="pro-when">' + esc(when) + "</p>" : "") + ctas + "</div></div>";
    box.hidden = false;
  }
  /* Pratos novos só têm nome em português: avisar quem lê noutra língua (nunca inventar traduções). */
  function newNote() {
    var foot = document.getElementById("menuFoot") || document.getElementById("emFoot");
    if (!foot) return;
    var n = document.getElementById("proNewNote");
    if (!HAS_NEW || lang() === "pt" || !NEW_MISS[IDX[lang()]]) { if (n) n.remove(); return; }
    if (!n) { n = document.createElement("p"); n.id = "proNewNote"; n.className = "pro-pt"; foot.parentNode.insertBefore(n, foot); }
    n.textContent = tr(T.novoPt);
  }

  /* ---------- 4. Estilos (cores do Solar Beirão vêm do styles.css) ---------- */
  var css = "" +
    ".pro-hoje{padding:24px 0 4px}.em-body .pro-hoje{padding:10px 0 4px}" +
    ".pro-hoje .wrap{max-width:640px;margin:0 auto;padding:0 16px}" +
    ".pro-card{position:relative;background:#fff;border-radius:22px;box-shadow:var(--shadow);padding:22px 20px 20px;border:1px solid var(--line);overflow:hidden}" +
    ".pro-card:before{content:'';position:absolute;left:0;top:0;right:0;height:4px;background:linear-gradient(90deg,var(--navy),var(--gold))}" +
    ".pro-head{display:flex;align-items:center;gap:8px;margin:0 0 6px}" +
    ".pro-live{width:9px;height:9px;border-radius:50%;background:#1f9d55;box-shadow:0 0 0 0 rgba(31,157,85,.5);animation:proPulse 2s infinite}" +
    "@keyframes proPulse{0%{box-shadow:0 0 0 0 rgba(31,157,85,.45)}70%{box-shadow:0 0 0 9px rgba(31,157,85,0)}100%{box-shadow:0 0 0 0 rgba(31,157,85,0)}}" +
    "@media (prefers-reduced-motion:reduce){.pro-live{animation:none}}" +
    ".pro-kick{font-size:12px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--gold-d)}" +
    ".pro-title{margin:0 0 12px;font:500 clamp(26px,7vw,34px)/1.12 var(--serif);color:var(--navy)}" +
    ".pro-list{list-style:none;margin:0;padding:0}" +
    ".pro-item{padding:12px 0;border-top:1px solid var(--line)}.pro-item:first-child{border-top:0;padding-top:4px}" +
    ".pro-tipo{display:block;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);margin:0 0 3px}" +
    ".pro-row{display:flex;align-items:baseline;justify-content:space-between;gap:12px}" +
    ".pro-row b{font:500 19px/1.3 var(--serif);color:var(--ink);min-width:0;overflow-wrap:anywhere}" +
    ".pro-price{font-weight:700;color:var(--navy);white-space:nowrap;font-variant-numeric:tabular-nums}" +
    ".pro-desc{display:block;font-size:15px;line-height:1.45;color:var(--muted);margin-top:3px}" +
    ".pro-note{margin:12px 0 0;padding:10px 12px;border-radius:12px;background:rgba(201,162,94,.14);font-size:15px;line-height:1.45;color:var(--ink)}" +
    ".pro-pt{margin:10px 0 0;font-size:13px;color:var(--muted)}" +
    ".pro-when{margin:12px 0 0;font-size:13px;color:var(--muted)}" +
    ".pro-cta{margin-top:16px}.pro-cta .btn{box-sizing:border-box;width:100%;justify-content:center}" +
    ".pro-sold{display:inline-block;margin-left:6px;padding:2px 8px;border-radius:999px;background:#fbe9e7;color:#b3261e;font:700 11px/1.5 var(--sans);letter-spacing:.06em;text-transform:uppercase;vertical-align:middle;white-space:nowrap}" +
    ".pro-off b{color:var(--muted)!important}.pro-off .pro-price{display:none}" +
    ".pro-switch{display:inline-flex;align-items:center;gap:2px;padding:4px;margin:0 0 16px;border-radius:999px;background:rgba(30,8,12,.45);border:1px solid rgba(255,255,255,.28);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px)}" +
    ".pro-switch span,.pro-switch button{display:inline-flex;align-items:center;gap:6px;min-height:44px;padding:0 16px;border-radius:999px;border:0;font:700 12px/1 var(--sans);letter-spacing:.08em;text-transform:uppercase;white-space:nowrap}" +
    ".pro-switch .on{background:#fff;color:var(--navy)}.pro-switch button{background:none;color:#fff;cursor:pointer}.pro-switch svg{width:14px;height:14px}" +
    ".pro-modal{position:fixed;inset:0;z-index:200;display:grid;place-items:center;padding:20px;background:rgba(30,8,12,.62);-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px)}.pro-modal[hidden]{display:none}" +
    ".pro-mcard{position:relative;width:100%;max-width:360px;background:#fff;border-radius:24px;padding:26px 20px 20px;text-align:center;box-shadow:0 24px 60px rgba(0,0,0,.4)}" +
    ".pro-mcard h2{margin:10px 0 2px;font:500 26px/1.15 var(--serif);color:var(--navy)}.pro-mcard p{margin:0 0 16px;color:var(--muted);font-size:14px}" +
    ".pro-in{box-sizing:border-box;width:100%;padding:14px;border:1.5px solid var(--line);border-radius:14px;font-size:16px;outline:none}.pro-in:focus{border-color:var(--navy)}" +
    ".pro-mcard .pro-err{margin:10px 0 0;color:#b3261e;font-weight:600}" +
    ".pro-go{width:100%;min-height:50px;margin-top:12px;border:0;border-radius:999px;background:var(--navy);color:#fff;font:700 16px var(--sans);cursor:pointer}.pro-go[disabled]{opacity:.6}" +
    ".pro-x{position:absolute;right:10px;top:10px;width:44px;height:44px;border:0;border-radius:50%;background:#f3eeea;color:#555;font-size:22px;cursor:pointer}" +
    ".pro-biz{position:fixed;right:14px;top:calc(env(safe-area-inset-top) + 66px);z-index:60;display:inline-flex;align-items:center;gap:7px;min-height:44px;padding:0 16px;border-radius:999px;background:var(--navy);color:#fff;font:700 13px/1 var(--sans);letter-spacing:.04em;text-decoration:none;box-shadow:0 8px 24px rgba(0,0,0,.28);border:1.5px solid rgba(255,255,255,.35)}" +
    ".pro-biz svg{width:16px;height:16px}.em-body .pro-biz{top:auto;bottom:calc(env(safe-area-inset-bottom) + 92px)}";
  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  /* ---------- 5. Arranque ---------- */
  function boot(data) {
    if (data && data.state) { STATE = data.state; UPDATED = data.updated_at; applyMenu(STATE, UPDATED, data.rev); }
    if (!engine) return after();
    var s = document.createElement("script"); s.src = engine;
    s.onload = after; s.onerror = after;
    document.body.appendChild(s);
  }
  /* ---------- 4b. Interruptor MÉTRIKA ID | Business na entrada ---------- */
  function tokenOk() { try { return !!localStorage.getItem("mk_pro_tok_" + PRO.slug); } catch (e) { return false; } }
  function business() {
    var hero = document.querySelector(".hero-in");
    if (hero && !document.querySelector(".pro-switch")) {
      var sw = document.createElement("div"); sw.className = "pro-switch"; sw.setAttribute("role", "group"); sw.setAttribute("aria-label", "MÉTRIKA ID ou Business");
      sw.innerHTML = '<span class="on" aria-current="page">MÉTRIKA ID</span>' +
        '<button type="button" id="proBizBtn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>Business</button>';
      sw.querySelector("button").onclick = openBiz;
      hero.insertBefore(sw, hero.firstChild);
    }
    if (!hero && tokenOk() && !document.querySelector(".pro-biz")) {
      var a = document.createElement("a"); a.className = "pro-biz"; a.href = "painel.html";
      a.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg><span>Business</span>';
      document.body.appendChild(a);
    }
  }
  function openBiz() {
    if (tokenOk()) { location.href = "painel.html"; return; }
    var m = document.getElementById("proBiz");
    if (!m) {
      m = document.createElement("div"); m.id = "proBiz"; m.className = "pro-modal"; m.setAttribute("role", "dialog"); m.setAttribute("aria-modal", "true"); m.setAttribute("aria-labelledby", "proBizT");
      m.innerHTML = '<form class="pro-mcard" novalidate><button type="button" class="pro-x" aria-label="Fechar">×</button>' +
        '<img src="assets/img/logo-200.webp" alt="" width="64" height="64"><h2 id="proBizT">MÉTRIKA Business</h2><p>Área reservada · ' + esc(C && C.negocio ? C.negocio.nome : "") + '</p>' +
        '<label for="proBizPw" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)">Password</label>' +
        '<input class="pro-in" id="proBizPw" type="password" autocomplete="current-password" placeholder="Password">' +
        '<p class="pro-err" role="alert" hidden></p><button class="pro-go" type="submit">Entrar</button></form>';
      document.body.appendChild(m);
      var f = m.querySelector("form"), inp = m.querySelector("input"), err = m.querySelector(".pro-err"), go = m.querySelector(".pro-go");
      m.querySelector(".pro-x").onclick = function () { m.hidden = true; };
      m.addEventListener("click", function (e) { if (e.target === m) m.hidden = true; });
      document.addEventListener("keydown", function (e) { if (e.key === "Escape") m.hidden = true; });
      f.onsubmit = function (e) {
        e.preventDefault();
        if (!inp.value) { inp.focus(); return; }
        go.disabled = true; go.textContent = "A entrar…"; err.hidden = true;
        fetch(PRO.api + "idpro_login", { method: "POST", headers: { "apikey": PRO.key, "Content-Type": "application/json" }, body: JSON.stringify({ p_slug: PRO.slug, p_pass: inp.value }) })
          .then(function (r) { return r.json(); }).then(function (r) {
            if (r && r.token) { try { localStorage.setItem("mk_pro_tok_" + PRO.slug, r.token); } catch (x) {} location.href = "painel.html"; return; }
            err.textContent = r && r.erro === "bloqueado" ? "Demasiadas tentativas. Tente daqui a 15 minutos." : "Password errada.";
            err.hidden = false; go.disabled = false; go.textContent = "Entrar";
          }).catch(function () { err.textContent = "Sem ligação. Tente outra vez."; err.hidden = false; go.disabled = false; go.textContent = "Entrar"; });
      };
    }
    m.hidden = false; setTimeout(function () { m.querySelector("input").focus(); }, 50);
  }
  function after() {
    renderHoje(); decorate(); business(); newNote();
    new MutationObserver(function () { renderHoje(); decorate(); newNote(); }).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
    ["menuCats", "emList"].forEach(function (id) {
      var n = document.getElementById(id); if (n) new MutationObserver(function () { decorate(); }).observe(n, { childList: true });
    });
    /* grupos da ementa (Vinhos → Tintos, Brancos…) */
    var g = document.createElement("script"); g.src = "grupos.js?v=1"; document.body.appendChild(g);
  }

  var cached = null;
  try { cached = JSON.parse(store(CACHE) || "null"); } catch (e) { cached = null; }
  var done = false;
  function finish(d) { if (done) return; done = true; boot(d); }
  var timer = setTimeout(function () { finish(cached); }, PRO.timeout);
  try {
    fetch(PRO.api + "idpro_public", {
      method: "POST",
      headers: { "apikey": PRO.key, "Content-Type": "application/json" },
      body: JSON.stringify({ p_slug: PRO.slug }),
      cache: "no-store"
    }).then(function (r) { return r.ok ? r.json() : null; }).then(function (d) {
      clearTimeout(timer);
      if (d && d.state) store(CACHE, JSON.stringify(d));
      finish(d && d.state ? d : cached);
    }).catch(function () { clearTimeout(timer); finish(cached); });
  } catch (e) { clearTimeout(timer); finish(cached); }
  window.METRIKA_PRO = { slug: PRO.slug, state: function () { return STATE; } };
})();
