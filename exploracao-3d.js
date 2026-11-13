// ============================================================
// Projetos 3D — progresso de exploração por mundo
// Arcanum Academy · PSVR Holding Tech
//
// O que faz:
// - Mostra o quanto a pessoa já explorou de cada mundo ("Você
//   explorou X% deste mundo" + barra de progresso).
// - Salva o progresso no banco (Supabase, MESMO projeto e MESMA
//   conta da Biblioteca: e-mail e senha) e neste navegador quando
//   a pessoa está sem login.
// - Ao voltar ao mundo, entra DIRETO onde parou (última sala/área
//   e posição salvas). Botão "Reiniciar exploração" zera o mundo.
// - Na página inicial, o painel "Minha exploração" mostra o
//   progresso de todos os mundos.
//
// Regra de segurança: nada aqui quebra o site. Se o Supabase, a
// tabela ou a rede falharem, tudo segue só no navegador (localStorage).
// ============================================================
(function () {
  "use strict";

  // ---------- utilidades ----------
  function $(id) { return document.getElementById(id); }
  function norm(s) {
    return (s || "").toLowerCase()
      .replace(/[✦★]/g, "").replace(/\s+/g, " ").trim();
  }
  function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }
  function uid() {
    return "anon-" + Date.now().toString(36) + "-" +
      Math.random().toString(36).slice(2, 8);
  }

  // ---------- catálogo dos mundos ----------
  // id = nome do arquivo sem ".html". "inicio" = primeira área do mundo
  // (onde a pessoa começa quando nunca explorou).
  var MUNDOS = [
    { id: "espaco-3d", nome: "Espaço 3D de Exploração", tipo: "salas",
      el: "nomeSala",
      areas: [
        { id: "hall", rotulo: "Hall Central", match: ["hall central"] },
        { id: "cozinha", rotulo: "Ala da Cozinha Mágica", match: ["cozinha"] },
        { id: "pecados", rotulo: "Ala dos Pecados", match: ["pecados"] },
        { id: "daemons", rotulo: "Ala dos Daemons", match: ["ala dos daemons"] },
        { id: "paimon", rotulo: "Ala de Paimon", match: ["paimon"] },
        { id: "stolas", rotulo: "Ala de Stolas", match: ["stolas"] },
        { id: "buer", rotulo: "Ala de Buer", match: ["buer"] },
        { id: "astaroth", rotulo: "Ala de Astaroth", match: ["astaroth"] }
      ] },
    { id: "egito", nome: "Mundo 3D do Egito", tipo: "salas",
      el: "nomeArea", zonas: true,
      areas: [
        { id: "planalto", rotulo: "Planalto de Gizé", match: ["planalto"] },
        { id: "esfinge", rotulo: "A Grande Esfinge", match: ["esfinge"] },
        { id: "queops", rotulo: "Pirâmide de Quéops", match: ["quéops", "queops"] },
        { id: "quefren", rotulo: "Pirâmide de Quéfren", match: ["quéfren", "quefren"] },
        { id: "miquerinos", rotulo: "Pirâmide de Miquerinos", match: ["miquerinos"] },
        { id: "camara", rotulo: "Câmara do Faraó", match: ["câmara do faraó", "camara do farao"] }
      ] },
    { id: "ala-egipcia", nome: "Ala Egípcia — Salas do Museu", tipo: "salas",
      el: "nomeArea",
      areas: [
        { id: "vestibulo", rotulo: "Vestíbulo", match: ["vestíbulo", "vestibulo"] },
        { id: "sala-esfinge", rotulo: "Sala da Esfinge", match: ["sala da esfinge"] },
        { id: "sala-sarcofago", rotulo: "Sala do Sarcófago", match: ["sala do sarcófago", "sala do sarcofago"] }
      ] },
    { id: "ala-paimon", nome: "Ala de Paimon — Salas do Museu", tipo: "salas",
      el: "nomeArea",
      areas: [
        { id: "vestibulo", rotulo: "Vestíbulo", match: ["vestíbulo", "vestibulo"] },
        { id: "sala-paimon", rotulo: "Sala do Paimon", match: ["sala do paimon"] },
        { id: "sala-reservada", rotulo: "Sala Reservada", match: ["sala reservada"] }
      ] },
    { id: "ala-stolas", nome: "Ala de Stolas — Salas do Museu", tipo: "salas",
      el: "nomeArea",
      areas: [
        { id: "vestibulo", rotulo: "Vestíbulo", match: ["vestíbulo", "vestibulo"] },
        { id: "sala-stolas", rotulo: "Sala do Stolas", match: ["sala do stolas"] },
        { id: "sala-reservada", rotulo: "Sala Reservada", match: ["sala reservada"] }
      ] },
    { id: "ala-buer", nome: "Ala de Buer — Salas do Museu", tipo: "salas",
      el: "nomeArea",
      areas: [
        { id: "vestibulo", rotulo: "Vestíbulo", match: ["vestíbulo", "vestibulo"] },
        { id: "sala-buer", rotulo: "Sala do Buer", match: ["sala do buer"] },
        { id: "sala-reservada", rotulo: "Sala Reservada", match: ["sala reservada"] }
      ] },
    { id: "ala-astaroth", nome: "Ala de Astaroth — Salas do Museu", tipo: "salas",
      el: "nomeArea",
      areas: [
        { id: "vestibulo", rotulo: "Vestíbulo", match: ["vestíbulo", "vestibulo"] },
        { id: "sala-astaroth", rotulo: "Sala do Astaroth", match: ["sala do astaroth"] },
        { id: "sala-reservada", rotulo: "Sala Reservada", match: ["sala reservada"] }
      ] },
    { id: "ala-egipcia-parte-2", nome: "Ala Egípcia — Parte 2", tipo: "salas",
      el: "nomeArea",
      areas: [
        { id: "vestibulo", rotulo: "Vestíbulo", match: ["vestíbulo", "vestibulo"] },
        { id: "sala-piramide", rotulo: "Sala da Pirâmide", match: ["sala da pirâmide", "sala da piramide"] }
      ] },
    { id: "galeria-parte-1", nome: "Galeria 3D — Parte 1", tipo: "galeria",
      areas: [
        { id: "esfinge", rotulo: "Grande Esfinge" },
        { id: "sarcofago", rotulo: "Sarcófago do Faraó" },
        { id: "piramide", rotulo: "Pirâmide de Gizé" },
        { id: "paimon", rotulo: "Rei Paimon" },
        { id: "sigilo", rotulo: "Medalhão do Sigilo de Paimon" }
      ] },
    { id: "galeria-parte-2", nome: "Galeria 3D — Parte 2", tipo: "galeria",
      areas: [
        { id: "paimon", rotulo: "Rei Paimon" },
        { id: "stolas", rotulo: "Stolas" },
        { id: "buer", rotulo: "Buer" },
        { id: "astaroth", rotulo: "Astaroth" },
        { id: "asmodeus", rotulo: "Asmodeus" }
      ] },
    { id: "galeria-coxinha", nome: "Galeria do Coxinha", tipo: "unico",
      areas: [ { id: "coxinha", rotulo: "Galeria do Coxinha" } ] }
  ];

  function mundoPorId(id) {
    for (var i = 0; i < MUNDOS.length; i++) if (MUNDOS[i].id === id) return MUNDOS[i];
    return null;
  }
  function mundoAtual() {
    var p = (location.pathname || "").split("/").pop() || "index.html";
    if (p === "" || p === "index.html") return null;
    return mundoPorId(p.replace(/\.html$/, ""));
  }

  // ---------- armazenamento local (sempre funciona) ----------
  var LS_KEY = "arcanum3d:v1";
  function lerLocal() {
    try {
      var d = JSON.parse(localStorage.getItem(LS_KEY) || "{}");
      if (!d || typeof d !== "object") d = {};
      if (!d.mundos || typeof d.mundos !== "object") d.mundos = {};
      if (!d.anon_id) { d.anon_id = uid(); salvarLocal(d); }
      return d;
    } catch (e) { return { mundos: {}, anon_id: uid() }; }
  }
  function salvarLocal(d) {
    try { localStorage.setItem(LS_KEY, JSON.stringify(d)); } catch (e) {}
  }
  function progressoLocal(mundoId) {
    var d = lerLocal();
    var p = d.mundos[mundoId];
    if (!p || !p.areas) p = { areas: [], ultima_area: null, ultima_pos: null, updated_at: null };
    if (!Array.isArray(p.areas)) p.areas = [];
    return p;
  }
  function percentual(mundo, p) {
    if (!mundo || !mundo.areas.length) return 0;
    var vistos = 0;
    for (var i = 0; i < mundo.areas.length; i++) {
      if (p.areas.indexOf(mundo.areas[i].id) !== -1) vistos++;
    }
    return Math.round(vistos / mundo.areas.length * 100);
  }
  function rotuloArea(mundo, areaId) {
    if (!mundo) return areaId || "";
    for (var i = 0; i < mundo.areas.length; i++) {
      if (mundo.areas[i].id === areaId) return mundo.areas[i].rotulo;
    }
    return areaId || "";
  }

  // ---------- Supabase (nuvem; mesma conta da Biblioteca) ----------
  var cfg = window.SUPABASE_CONFIG || {};
  var client = null, user = null, tabelaOK = null; // null = ainda não testado
  var filaNuvem = {}; // mundoId -> timeout de gravação

  function tentarCliente() {
    if (client || !window.supabase) return client;
    if (!cfg.SUPABASE_URL || !cfg.SUPABASE_ANON_KEY) return null;
    try { client = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY); }
    catch (e) { client = null; }
    return client;
  }
  function carregarScriptSupabase(cb) {
    if (window.supabase) { cb(); return; }
    var s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js";
    s.onload = cb; s.onerror = cb; // sem rede, segue só local
    document.head.appendChild(s);
  }

  function marcarVisita(mundoId, areaId, pos) {
    if (!mundoId || !areaId) return;
    var mundo = mundoPorId(mundoId);
    if (!mundo) return;
    var d = lerLocal();
    var p = d.mundos[mundoId] || { areas: [], ultima_area: null, ultima_pos: null, updated_at: null };
    if (!Array.isArray(p.areas)) p.areas = [];
    var mudou = false;
    if (p.areas.indexOf(areaId) === -1) { p.areas.push(areaId); mudou = true; }
    if (p.ultima_area !== areaId) { p.ultima_area = areaId; mudou = true; }
    if (pos) { p.ultima_pos = pos; mudou = true; }
    if (mudou) {
      p.updated_at = new Date().toISOString();
      d.mundos[mundoId] = p;
      salvarLocal(d);
      agendarNuvem(mundoId);
      renderHUD();
    }
  }
  function agendarNuvem(mundoId) {
    if (!user || tabelaOK === false) return;
    if (filaNuvem[mundoId]) clearTimeout(filaNuvem[mundoId]);
    filaNuvem[mundoId] = setTimeout(function () { salvarNuvem(mundoId); }, 4000);
  }
  function salvarNuvem(mundoId) {
    var c = tentarCliente();
    if (!c || !user) return;
    var mundo = mundoPorId(mundoId);
    var p = progressoLocal(mundoId);
    c.from("exploracao_3d").upsert({
      user_id: user.id, mundo: mundoId,
      areas_visitadas: p.areas,
      percentual: percentual(mundo, p),
      ultima_area: p.ultima_area,
      ultima_pos: p.ultima_pos,
      updated_at: new Date().toISOString()
    }).then(function (r) {
      if (r.error) {
        // Tabela ainda não criada no Supabase: segue só local.
        if (r.error.code === "42P01" || r.error.code === "PGRST205" ||
            (r.error.message || "").indexOf("exploracao_3d") !== -1) tabelaOK = false;
      } else { tabelaOK = true; }
    }).catch(function () {});
  }
  function carregarNuvem() {
    var c = tentarCliente();
    if (!c || !user) return;
    c.from("exploracao_3d").select("*").then(function (r) {
      if (r.error) {
        if (r.error.code === "42P01" || r.error.code === "PGRST205") tabelaOK = false;
        return;
      }
      tabelaOK = true;
      var d = lerLocal();
      var mudou = false;
      (r.data || []).forEach(function (row) {
        var mundo = mundoPorId(row.mundo);
        if (!mundo) return;
        var local = d.mundos[row.mundo] || { areas: [], ultima_area: null, ultima_pos: null, updated_at: null };
        var areas = {};
        (local.areas || []).concat(row.areas_visitadas || []).forEach(function (a) { areas[a] = true; });
        var nuvemMaisNova = (row.updated_at || "") > (local.updated_at || "");
        d.mundos[row.mundo] = {
          areas: Object.keys(areas),
          ultima_area: nuvemMaisNova ? (row.ultima_area || local.ultima_area) : local.ultima_area,
          ultima_pos: nuvemMaisNova ? (row.ultima_pos || local.ultima_pos) : local.ultima_pos,
          updated_at: nuvemMaisNova ? row.updated_at : (local.updated_at || row.updated_at)
        };
        mudou = true;
      });
      if (mudou) { salvarLocal(d); renderHUD(); renderPainel(); }
    }).catch(function () {});
  }
  function apagarNuvem(mundoId) {
    var c = tentarCliente();
    if (!c || !user) return;
    c.from("exploracao_3d").delete().eq("user_id", user.id).eq("mundo", mundoId)
      .then(function () {}).catch(function () {});
  }

  // ---------- detecção da área atual ----------
  function areaPorTexto(mundo, texto) {
    var t = norm(texto);
    if (!t) return null;
    // nomes mais específicos primeiro (ex.: "Ala de Paimon" antes de "Ala dos Daemons")
    var ordem = mundo.areas.slice().sort(function (a, b) { return b.rotulo.length - a.rotulo.length; });
    for (var i = 0; i < ordem.length; i++) {
      var ms = ordem[i].match || [];
      for (var j = 0; j < ms.length; j++) {
        if (t.indexOf(norm(ms[j])) !== -1) return ordem[i].id;
      }
    }
    return null;
  }
  function obterJogador() {
    // "var jogador" vira window.jogador; "const jogador" (alas) só existe
    // como binding global — os dois jeitos são tentados.
    try { if (window.jogador && window.jogador.pos) return window.jogador; } catch (e) {}
    try { if (typeof jogador !== "undefined" && jogador && jogador.pos) return jogador; } catch (e) {}
    return null;
  }
  function posJogador() {
    try {
      var j = obterJogador();
      if (!j || !j.pos || typeof j.pos.x !== "number") return null;
      return { x: Math.round(j.pos.x * 100) / 100, z: Math.round(j.pos.z * 100) / 100,
               yaw: Math.round((j.yaw || 0) * 100) / 100 };
    } catch (e) { return null; }
  }
  function dist2(ax, az, bx, bz) { var dx = ax - bx, dz = az - bz; return dx * dx + dz * dz; }
  function detectarArea(mundo) {
    if (!mundo) return null;
    if (mundo.tipo === "unico") return mundo.areas[0].id;
    if (mundo.tipo === "galeria") return detectarPeca(mundo);
    // mundos de caminhada: nome da sala na tela
    var elNome = mundo.el ? $(mundo.el) : null;
    var porTexto = elNome ? areaPorTexto(mundo, elNome.textContent) : null;
    // Egito: zonas por posição (a placa só diz Planalto/Câmara)
    if (mundo.zonas) {
      var z = zonaEgito();
      if (z) return z;
    }
    return porTexto;
  }
  function zonaEgito() {
    try {
      var j = obterJogador(), G = window.GIZE;
      if (!j || !j.pos || !G) return null;
      var x = j.pos.x, z = j.pos.z;
      if (G.camara && G.camara.centro) {
        var C = G.camara.centro;
        if (x > C.x - C.largura / 2 - 0.4 && x < C.x + C.largura / 2 + 0.4 &&
            z > C.z - C.prof / 2 - 0.4 && z < C.z + C.prof / 2 + 0.4) return "camara";
      }
      if (G.esfinge && G.esfinge.centro && dist2(x, z, G.esfinge.centro.x, G.esfinge.centro.z) < 18 * 18) return "esfinge";
      if (G.piramides) {
        for (var i = 0; i < G.piramides.length; i++) {
          var P = G.piramides[i];
          if (P.centro && dist2(x, z, P.centro.x, P.centro.z) < 20 * 20) return P.id;
        }
      }
    } catch (e) {}
    return null;
  }
  function detectarPeca(mundo) {
    // botão da peça ativa (Galeria 1: .peca.ativa[data-id] · Galeria 2: [data-peca].ativo)
    var b = document.querySelector(".peca.ativa") || document.querySelector("[data-peca].ativo");
    if (b) {
      var id = b.getAttribute("data-id") || b.getAttribute("data-peca");
      if (mundo.id === "galeria-parte-2" && id !== null && !isNaN(+id)) {
        var idx = +id;
        if (mundo.areas[idx]) return mundo.areas[idx].id;
      }
      if (id && mundoPorId(mundo.id)) {
        for (var i = 0; i < mundo.areas.length; i++) {
          if (mundo.areas[i].id === id) return id;
        }
      }
    }
    // fallback: título da peça na tela
    var tit = $("placa-titulo");
    if (tit) {
      var t = norm(tit.textContent);
      for (var j = 0; j < mundo.areas.length; j++) {
        var nome = norm(mundo.areas[j].rotulo).split(" ")[0];
        if (t.indexOf(nome) !== -1) return mundo.areas[j].id;
      }
      if (mundo.id === "galeria-parte-2") {
        if (t.indexOf("paimon") !== -1) return "paimon";
        if (t.indexOf("stolas") !== -1) return "stolas";
        if (t.indexOf("buer") !== -1) return "buer";
        if (t.indexOf("astaroth") !== -1) return "astaroth";
        if (t.indexOf("asmodeus") !== -1) return "asmodeus";
      }
    }
    return null;
  }

  // ---------- retomar onde parou ----------
  var retomado = false;
  function tentarRetomar(mundo) {
    if (retomado || !mundo) return;
    var p = progressoLocal(mundo.id);
    var ultima = p.ultima_area;
    if (!ultima || ultima === mundo.areas[0].id) return; // começo: nada a retomar
    retomado = true;
    try {
      if (mundo.id === "espaco-3d" && typeof window.irPara === "function") {
        window.irPara(ultima); // ativa a ala, teleporta e entra
        return;
      }
      if (mundo.tipo === "galeria") {
        var btn = document.querySelector('.peca[data-id="' + ultima + '"]') ||
                  document.querySelector('[data-peca="' + mundo.areas.findIndex(function (a) { return a.id === ultima; }) + '"]');
        if (btn) { btn.click(); return; }
      }
      if (mundo.tipo === "salas") {
        // volta à posição exata salva e entra
        var pos = p.ultima_pos, j = obterJogador();
        if (pos && j && j.pos && typeof j.pos.set === "function") {
          j.pos.set(pos.x, j.pos.y, pos.z);
          if (typeof pos.yaw === "number") j.yaw = pos.yaw;
          try { if (typeof camera !== "undefined" && camera) camera.position.copy(j.pos); } catch (e2) {}
        }
        entrarNoMundo();
      }
    } catch (e) {}
  }
  function entrarNoMundo() {
    try {
      if (typeof window.entrar === "function") { window.entrar(); return; }
    } catch (e) {}
    var b = $("btnEntrar");
    if (b) { try { b.click(); } catch (e) {} }
  }
  function rotularBotaoContinuar(mundo) {
    var p = progressoLocal(mundo.id);
    var b = $("btnEntrar");
    if (!b || !p.ultima_area || p.ultima_area === mundo.areas[0].id) return;
    b.textContent = "Continuar na " + rotuloArea(mundo, p.ultima_area);
  }

  // ---------- reiniciar exploração ----------
  function reiniciarMundo(mundoId) {
    var mundo = mundoPorId(mundoId);
    if (!mundo) return;
    var nome = mundo.nome;
    if (!window.confirm("Reiniciar a exploração de \"" + nome + "\"?\n\nSeu progresso neste mundo volta a 0% e você começa do início.")) return;
    var d = lerLocal();
    delete d.mundos[mundoId];
    salvarLocal(d);
    apagarNuvem(mundoId);
    location.reload(); // sem progresso salvo, o mundo abre do início
  }

  // ---------- estilos ----------
  var CSS = [
    "#a3d-hud{position:fixed;top:12px;right:12px;z-index:35;font-family:Verdana,sans-serif;text-align:right}",
    "#a3d-hud .a3d-pill{display:inline-block;background:rgba(10,10,18,.88);border:1px solid #c9a227;color:#f3e6cf;border-radius:20px;padding:8px 14px;font-size:13px;cursor:pointer;letter-spacing:.03em}",
    "#a3d-hud .a3d-pill b{color:#e8c37a}",
    "#a3d-panel{display:none;margin-top:8px;background:rgba(10,10,18,.96);border:1px solid #2b2b3a;border-radius:8px;padding:14px;width:248px;text-align:left;color:#e8e6df;font-size:13px;line-height:1.5}",
    "#a3d-panel.aberto{display:block}",
    "#a3d-panel h3{font-family:Georgia,serif;font-weight:normal;font-size:15px;color:#e8c37a;margin-bottom:6px}",
    "#a3d-panel .a3d-bar{height:8px;background:#22222e;border-radius:4px;overflow:hidden;margin:8px 0}",
    "#a3d-panel .a3d-bar i{display:block;height:100%;background:linear-gradient(90deg,#8a6d1f,#e8c37a)}",
    "#a3d-panel ul{list-style:none;margin:6px 0;padding:0}",
    "#a3d-panel li{padding:2px 0;color:#a5a2ae}",
    "#a3d-panel li.ok{color:#e8e6df}",
    "#a3d-panel button{display:block;width:100%;margin-top:8px;padding:9px;border-radius:6px;border:1px solid #c9a227;background:transparent;color:#e8c37a;font-size:13px;cursor:pointer}",
    "#a3d-panel button.perigo{border-color:#8a3b3b;color:#e8a0a0}",
    "#a3d-panel .a3d-conta{font-size:12px;color:#9a97a3;margin-top:8px}",
    "#a3d-modal{position:fixed;inset:0;z-index:60;background:rgba(0,0,0,.7);display:none;align-items:center;justify-content:center;padding:20px}",
    "#a3d-modal.aberto{display:flex}",
    "#a3d-modal .caixa{background:#101019;border:1px solid #c9a227;border-radius:10px;padding:24px;width:100%;max-width:340px;color:#e8e6df;font-family:Verdana,sans-serif}",
    "#a3d-modal h3{font-family:Georgia,serif;font-weight:normal;color:#e8c37a;margin-bottom:4px;font-size:18px}",
    "#a3d-modal p{font-size:13px;color:#a5a2ae;line-height:1.5;margin-bottom:12px}",
    "#a3d-modal input{width:100%;padding:11px;margin:6px 0;border:1px solid #2b2b3a;border-radius:6px;background:#0a0a12;color:#e8e6df;font-size:15px}",
    "#a3d-modal button{width:100%;padding:11px;margin-top:8px;border-radius:6px;border:1px solid #c9a227;background:#c9a227;color:#1d1409;font-size:14px;cursor:pointer}",
    "#a3d-modal button.sec{background:transparent;color:#e8c37a}",
    "#a3d-modal .erro{color:#e8a0a0;font-size:13px;min-height:18px;margin-top:6px}",
    "#minha-exploracao{margin:34px auto 0;max-width:880px;text-align:left}",
    "#minha-exploracao h2{font-family:Georgia,serif;font-weight:normal;color:#d9d4c5;letter-spacing:.2em;font-size:1.1rem;text-transform:uppercase;text-align:center}",
    "#minha-exploracao .sub2{text-align:center;color:#9a97a3;font-size:.85rem;margin-top:6px;letter-spacing:.08em}",
    "#minha-exploracao .linha{width:180px;height:1px;margin:16px auto;background:linear-gradient(90deg,transparent,#c9a227,transparent)}",
    "#minha-exploracao .mundo{border:1px solid #2b2b3a;background:linear-gradient(160deg,#101019,#0a0a12);border-radius:6px;padding:16px 18px;margin-top:12px}",
    "#minha-exploracao .mundo .topo{display:flex;justify-content:space-between;gap:10px;align-items:baseline}",
    "#minha-exploracao .mundo h3{font-size:1rem;font-weight:normal;color:#e8e6df}",
    "#minha-exploracao .mundo .pct{color:#e8c37a;font-size:.9rem;white-space:nowrap}",
    "#minha-exploracao .bar{height:8px;background:#22222e;border-radius:4px;overflow:hidden;margin:10px 0 6px}",
    "#minha-exploracao .bar i{display:block;height:100%;background:linear-gradient(90deg,#8a6d1f,#e8c37a)}",
    "#minha-exploracao .detalhe{font-size:.82rem;color:#a5a2ae;font-family:Verdana,sans-serif}",
    "#minha-exploracao .acoes{margin-top:10px;display:flex;gap:10px;flex-wrap:wrap}",
    "#minha-exploracao .acoes a,#minha-exploracao .acoes button{font-size:.82rem;letter-spacing:.1em;color:#c9a227;background:none;border:none;cursor:pointer;text-decoration:none;padding:0;font-family:Verdana,sans-serif}",
    "#minha-exploracao .acoes button.zerar{color:#8a6d78}",
    "#minha-exploracao .conta{text-align:center;margin-top:14px;font-size:.85rem;color:#9a97a3;font-family:Verdana,sans-serif}",
    "#minha-exploracao .conta button{background:none;border:1px solid #c9a227;color:#e8c37a;border-radius:20px;padding:7px 16px;cursor:pointer;font-size:.85rem}"
  ].join("\n");
  function injetarCSS() {
    if ($("a3d-estilo")) return;
    var s = document.createElement("style");
    s.id = "a3d-estilo"; s.textContent = CSS;
    document.head.appendChild(s);
  }

  // ---------- HUD dentro do mundo ----------
  var hudEl = null, hudPanel = null, hudPill = null;
  function criarHUD(mundo) {
    if (hudEl || !mundo) return;
    injetarCSS();
    hudEl = document.createElement("div");
    hudEl.id = "a3d-hud";
    hudEl.innerHTML = '<button type="button" class="a3d-pill" id="a3d-pill">✦ <b>0%</b> explorado</button>' +
      '<div class="a3d-panel" id="a3d-panel"></div>';
    document.body.appendChild(hudEl);
    hudPill = $("a3d-pill"); hudPanel = $("a3d-panel");
    hudPill.addEventListener("click", function () { hudPanel.classList.toggle("aberto"); renderHUD(); });
    renderHUD();
  }
  function renderHUD() {
    var mundo = mundoAtual();
    if (!mundo || !hudPanel) return;
    var p = progressoLocal(mundo.id);
    var pct = percentual(mundo, p);
    if (hudPill) hudPill.innerHTML = "✦ <b>" + pct + "%</b> explorado";
    var lis = mundo.areas.map(function (a) {
      var ok = p.areas.indexOf(a.id) !== -1;
      return '<li class="' + (ok ? "ok" : "") + '">' + (ok ? "✓ " : "· ") + a.rotulo + "</li>";
    }).join("");
    var ultima = p.ultima_area ? rotuloArea(mundo, p.ultima_area) : "—";
    hudPanel.innerHTML =
      "<h3>" + mundo.nome + "</h3>" +
      "<div>Você explorou <b>" + pct + "%</b> deste mundo</div>" +
      '<div class="a3d-bar"><i style="width:' + pct + '%"></i></div>' +
      "<div>" + p.areas.length + " de " + mundo.areas.length + " áreas · última: " + ultima + "</div>" +
      "<ul>" + lis + "</ul>" +
      '<button type="button" id="a3d-reiniciar" class="perigo">↺ Reiniciar exploração</button>' +
      '<button type="button" id="a3d-conta">' + (user ? "Sair (" + (user.email || "").split("@")[0] + ")" : "Entrar / Criar conta") + "</button>" +
      '<div class="a3d-conta">' + (user ? "Progresso salvo na sua conta." : "Sem login, o progresso fica só neste aparelho.") + "</div>";
    var br = $("a3d-reiniciar");
    if (br) br.addEventListener("click", function () { reiniciarMundo(mundo.id); });
    var bc = $("a3d-conta");
    if (bc) bc.addEventListener("click", function () { user ? sair() : abrirModal(); });
  }

  // ---------- painel "Minha exploração" (página inicial) ----------
  function renderPainel() {
    var sec = $("minha-exploracao");
    if (!sec) return;
    injetarCSS();
    var d = lerLocal();
    var html = "<h2>Minha exploração</h2>" +
      '<div class="sub2">O QUANTO VOCÊ JÁ EXPLOROU DE CADA MUNDO</div><div class="linha"></div>';
    MUNDOS.forEach(function (mundo) {
      var p = d.mundos[mundo.id] || { areas: [], ultima_area: null };
      var pct = percentual(mundo, p);
      var ultima = p.ultima_area ? rotuloArea(mundo, p.ultima_area) : null;
      html += '<div class="mundo"><div class="topo"><h3>' + mundo.nome + '</h3>' +
        '<span class="pct">' + pct + "%</span></div>" +
        '<div class="bar"><i style="width:' + pct + '%"></i></div>' +
        '<div class="detalhe">' + p.areas.length + " de " + mundo.areas.length + " áreas exploradas" +
        (ultima ? " · última: " + ultima : "") + "</div>" +
        '<div class="acoes">' +
        '<a href="' + mundo.id + '.html">' + (pct > 0 ? "CONTINUAR →" : "COMEÇAR →") + "</a>" +
        (pct > 0 ? '<button type="button" class="zerar" data-mundo="' + mundo.id + '">ZERAR</button>' : "") +
        "</div></div>";
    });
    html += '<div class="conta">' + (user
      ? "Conta: <b>" + (user.email || "") + "</b> · progresso salvo na nuvem · <button type=\"button\" id=\"a3d-sair\">Sair</button>"
      : "Entre com a sua conta (a mesma da Biblioteca) para o progresso acompanhar você em qualquer aparelho.") +
      (user ? "" : ' <button type="button" id="a3d-entrar">Entrar / Criar conta</button>') + "</div>";
    sec.innerHTML = html;
    Array.prototype.forEach.call(sec.querySelectorAll("button.zerar"), function (b) {
      b.addEventListener("click", function () { reiniciarMundo(b.getAttribute("data-mundo")); });
    });
    var be = $("a3d-entrar");
    if (be) be.addEventListener("click", abrirModal);
    var bs = $("a3d-sair");
    if (bs) bs.addEventListener("click", sair);
  }

  // ---------- login (mesma conta da Biblioteca) ----------
  var modalEl = null;
  function criarModal() {
    if (modalEl) return;
    injetarCSS();
    modalEl = document.createElement("div");
    modalEl.id = "a3d-modal";
    modalEl.innerHTML = '<div class="caixa"><h3>Entrar — Projetos 3D</h3>' +
      "<p>Use a mesma conta da Biblioteca Arcanum Academy (e-mail e senha). O seu progresso passa a ficar salvo na nuvem.</p>" +
      '<input type="email" id="a3d-email" placeholder="Seu e-mail" autocomplete="email">' +
      '<input type="password" id="a3d-senha" placeholder="Sua senha" autocomplete="current-password">' +
      '<div class="erro" id="a3d-erro"></div>' +
      '<button type="button" id="a3d-btn-entrar">Entrar</button>' +
      '<button type="button" class="sec" id="a3d-btn-criar">Criar conta com este e-mail</button>' +
      '<button type="button" class="sec" id="a3d-btn-fechar">Fechar</button></div>';
    document.body.appendChild(modalEl);
    modalEl.addEventListener("click", function (e) { if (e.target === modalEl) fecharModal(); });
    $("a3d-btn-fechar").addEventListener("click", fecharModal);
    $("a3d-btn-entrar").addEventListener("click", function () { enviarAuth(false); });
    $("a3d-btn-criar").addEventListener("click", function () { enviarAuth(true); });
  }
  function abrirModal() { criarModal(); modalEl.classList.add("aberto"); var e = $("a3d-erro"); if (e) e.textContent = ""; }
  function fecharModal() { if (modalEl) modalEl.classList.remove("aberto"); }
  function erroAuth(msg) { var e = $("a3d-erro"); if (e) e.textContent = msg || ""; }
  function enviarAuth(criar) {
    var c = tentarCliente();
    var email = ($("a3d-email").value || "").trim();
    var pass = $("a3d-senha").value || "";
    if (!c) { erroAuth("Sem conexão com o banco agora. Tente de novo."); return; }
    if (!email || !pass) { erroAuth("Digite o e-mail e a senha."); return; }
    if (pass.length < 6) { erroAuth("A senha tem no mínimo 6 caracteres."); return; }
    erroAuth("Aguarde…");
    var p = criar
      ? c.auth.signUp({ email: email, password: pass })
      : c.auth.signInWithPassword({ email: email, password: pass });
    p.then(function (r) {
      if (r.error) { erroAuth("Não entrou: " + (r.error.message || "verifique o e-mail e a senha.")); return; }
      if (criar && r.data && r.data.user && !r.data.session) {
        erroAuth("Conta criada! Confirme o e-mail que chegou e depois entre aqui.");
        return;
      }
      fecharModal();
    }).catch(function (e) { erroAuth("Não entrou: " + (e && e.message ? e.message : "tente de novo.")); });
  }
  function sair() {
    var c = tentarCliente();
    if (c) c.auth.signOut().catch(function () {});
    user = null;
    renderHUD(); renderPainel();
  }
  function aoMudarSessao(session) {
    var novo = session && session.user ? session.user : null;
    var entrouAgora = novo && (!user || user.id !== novo.id);
    user = novo;
    if (entrouAgora) carregarNuvem();
    renderHUD(); renderPainel();
  }

  // ---------- loop de detecção ----------
  var mundo = null, ultimoDetectado = null, tempoNaPagina = 0;
  function tick() {
    if (!mundo) return;
    tempoNaPagina++;
    var area = detectarArea(mundo);
    if (mundo.tipo === "unico") {
      // uma só área: conta a visita depois de 3 s na página
      if (tempoNaPagina >= 3 && area) marcarVisita(mundo.id, area, null);
      return;
    }
    if (area) {
      if (area !== ultimoDetectado) ultimoDetectado = area;
      marcarVisita(mundo.id, area, posJogador());
    } else {
      // sem área na tela (ex.: antes de entrar): só guarda a posição,
      // e só grava se ela mudou de verdade (não a cada segundo)
      var pos = posJogador();
      if (pos) {
        var p = progressoLocal(mundo.id);
        if (p.ultima_area && p.ultima_pos) {
          var dx = Math.abs(pos.x - p.ultima_pos.x), dz = Math.abs(pos.z - p.ultima_pos.z);
          if (dx > 0.05 || dz > 0.05) {
            var d = lerLocal();
            d.mundos[mundo.id].ultima_pos = pos;
            salvarLocal(d);
          }
        }
      }
    }
  }

  // ---------- início ----------
  function iniciar() {
    mundo = mundoAtual();
    if (!mundo) {
      // página inicial: só o painel + login
      renderPainel();
    } else {
      criarHUD(mundo);
      rotularBotaoContinuar(mundo);
      // retoma onde parou (depois da página montar o mundo)
      setTimeout(function () { tentarRetomar(mundo); }, 700);
      setTimeout(function () { tentarRetomar(mundo); }, 2500); // segunda chance, se a 1ª foi cedo
      setInterval(tick, 1000);
      window.addEventListener("pagehide", function () {
        if (mundo) { var a = detectarArea(mundo); if (a) marcarVisita(mundo.id, a, posJogador()); }
      });
    }
    carregarScriptSupabase(function () {
      var c = tentarCliente();
      if (!c) return;
      c.auth.getSession().then(function (r) {
        aoMudarSessao(r.data ? r.data.session : null);
      }).catch(function () {});
      c.auth.onAuthStateChange(function (_ev, session) { aoMudarSessao(session); });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar);
  } else { iniciar(); }
})();
