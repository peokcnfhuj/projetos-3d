(function () {
  "use strict";

  var MASTER_NUMBERS = { 11: true, 22: true, 33: true };

  var LIFE_PATH_DATA = {
    1: {
      title: "O Líder",
      interpretation:
        "Você carrega a energia da iniciativa, da coragem e dos novos começos. Sua jornada convida à autonomia e à confiança na própria visão, abrindo caminhos onde antes havia hesitação. Ao equilibrar determinação com escuta, sua liderança inspira outros a darem o primeiro passo."
    },
    2: {
      title: "O Diplomata",
      interpretation:
        "Sua essência valoriza a harmonia, a empatia e a construção de pontes entre pessoas e ideias. Você percebe sutilezas emocionais com facilidade e sabe transformar conflitos em diálogo sereno. Quando honra seus próprios limites sem perder a gentileza, sua presença traz equilíbrio duradouro."
    },
    3: {
      title: "O Comunicador",
      interpretation:
        "A criatividade, a expressão e o entusiasmo iluminam o seu percurso de vida. Você tem facilidade para dar forma às ideias por meio da palavra, da arte ou da troca espontânea com o mundo. Ao canalizar seu brilho com foco e constância, sua voz inspira leveza e renovação."
    },
    4: {
      title: "O Construtor",
      interpretation:
        "Disciplina, método e senso prático são os pilares que sustentam suas maiores realizações. Você transforma planos abstratos em estruturas sólidas, passo a passo, com paciência e comprometimento. Quando une organização à flexibilidade, constrói legados que resistem ao tempo."
    },
    5: {
      title: "O Aventureiro",
      interpretation:
        "Liberdade, curiosidade e movimento contínuo impulsionam sua evolução pessoal. Você aprende melhor na experiência direta, adaptando-se com agilidade às mudanças e descobrindo oportunidades no inesperado. Ao direcionar sua versatilidade com propósito, cada mudança amplia seus horizontes."
    },
    6: {
      title: "O Guardião",
      interpretation:
        "Responsabilidade afetiva, acolhimento e senso de justiça orientam suas escolhas diárias. Você tem vocação natural para cuidar, proteger e criar ambientes onde as pessoas se sintam seguras e valorizadas. Lembre-se de nutrir a si mesmo com a mesma dedicação que oferece aos outros."
    },
    7: {
      title: "O Buscador",
      interpretation:
        "Introspecção, pensamento analítico e sede de verdade definem sua caminhada. Você prefere ir além das aparências, investigando sentidos profundos por meio do estudo, do silêncio e da intuição. Ao compartilhar o que descobre sem se isolar demais, sua sabedoria se torna farol."
    },
    8: {
      title: "O Executivo",
      interpretation:
        "Visão estratégica, ambição ética e capacidade de realização marcam o seu destino. Você compreende o valor do esforço coordenado e sabe transformar recursos e talentos em resultados concretos. Quando o sucesso material caminha junto com a integridade, sua autoridade gera prosperidade coletiva."
    },
    9: {
      title: "O Humanitário",
      interpretation:
        "Compaixão, generosidade e visão abrangente conectam você a causas maiores que o interesse individual. Sua trajetória pede desapego do supérfluo e entrega consciente àquilo que eleva a vida em comunidade. Quanto mais você compartilha seus dons com sabedoria, mais pleno se torna o seu caminho."
    },
    11: {
      title: "O Iluminado",
      interpretation:
        "Como número mestre, você traz sensibilidade elevada, intuição aguçada e forte poder de inspiração. Sua mente capta conexões sutis e ideias visionárias que despertam consciência nas pessoas ao redor. O desafio é manter os pés no chão para transformar sua luz interior em ação serena e prática."
    },
    22: {
      title: "O Mestre Construtor",
      interpretation:
        "Você combina uma visão grandiosa com a capacidade rara de executá-la no mundo real. Este número mestre convoca você a erguer projetos de amplo alcance, unindo idealismo, estratégia e trabalho consistente. Ao confiar na própria escala sem se paralisar pela perfeição, você materializa o extraordinário."
    },
    33: {
      title: "O Mestre Curador",
      interpretation:
        "Este número mestre simboliza compaixão elevada, ensino pelo exemplo e serviço amoroso à coletividade. Sua presença tende a restaurar esperança e clareza em momentos de dúvida, guiando com ternura e firmeza. Ao cuidar do próprio equilíbrio emocional, sua capacidade de acolher e transformar se multiplica."
    }
  };

  var ORACLE_CARDS = [
    {
      name: "O Mago",
      arcana: "Arcano I",
      symbolLabel: "Símbolo: Lemniscata e Bastão Estelar",
      meaning:
        "O Mago anuncia que você já reúne os recursos, a clareza mental e a habilidade necessários para agir hoje. É um dia favorável para transformar ideias em iniciativas concretas com confiança e foco. Confie na sua capacidade de dar forma ao que deseja realizar.",
      svg:
        '<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">' +
        '<circle cx="60" cy="60" r="48" stroke="#c89d3c" stroke-width="1" stroke-opacity="0.45"/>' +
        '<path d="M36 33c0-7.5 8.5-11 15.5-6.5L60 33l8.5-6.5C75.5 22 84 25.5 84 33s-8.5 11-15.5 6.5L60 33l-8.5 6.5C44.5 44 36 40.5 36 33Z" stroke="#f5dc8e" stroke-width="2" stroke-linejoin="round"/>' +
        '<line x1="60" y1="48" x2="60" y2="96" stroke="#e5c158" stroke-width="2.2" stroke-linecap="round"/>' +
        '<path d="M60 44l2.8 5.2L68 52l-5.2 2.8L60 60l-2.8-5.2L52 52l5.2-2.8L60 44Z" fill="#fbf1d4"/>' +
        '<circle cx="34" cy="74" r="2.2" fill="#c89d3c"/>' +
        '<circle cx="86" cy="74" r="2.2" fill="#c89d3c"/>' +
        '<path d="M48 96h24" stroke="#c89d3c" stroke-width="1.6" stroke-linecap="round"/>' +
        "</svg>"
    },
    {
      name: "A Sacerdotisa",
      arcana: "Arcano II",
      symbolLabel: "Símbolo: Lua Crescente entre Pilares",
      meaning:
        "A Sacerdotisa convida ao silêncio atento, à escuta da intuição e à observação antes de qualquer passo apressado. Nem tudo precisa ser revelado agora; há respostas amadurecendo nos bastidores. Observe os sinais sutis do dia e confie na sua sabedoria interior.",
      svg:
        '<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">' +
        '<circle cx="60" cy="60" r="48" stroke="#c89d3c" stroke-width="1" stroke-opacity="0.45"/>' +
        '<rect x="28" y="30" width="9" height="60" rx="2" stroke="#c89d3c" stroke-width="1.7"/>' +
        '<rect x="83" y="30" width="9" height="60" rx="2" stroke="#c89d3c" stroke-width="1.7"/>' +
        '<path d="M65 37a19 19 0 1 0 13 32.8A15.5 15.5 0 0 1 65 37Z" stroke="#f5dc8e" stroke-width="2.1" stroke-linejoin="round"/>' +
        '<circle cx="60" cy="78" r="10" stroke="#e5c158" stroke-width="1.6"/>' +
        '<circle cx="60" cy="78" r="2.5" fill="#fbf1d4"/>' +
        "</svg>"
    },
    {
      name: "A Imperatriz",
      arcana: "Arcano III",
      symbolLabel: "Símbolo: Vênus e Coroa de Estrelas",
      meaning:
        "A Imperatriz traz uma atmosfera fértil para a criatividade, o prazer de criar e o cuidado genuíno com seus projetos e vínculos. Tudo o que recebe atenção paciente hoje tende a florescer com naturalidade e beleza. Permita-se nutrir suas ideias e desfrutar do presente sem pressa excessiva.",
      svg:
        '<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">' +
        '<circle cx="60" cy="60" r="48" stroke="#c89d3c" stroke-width="1" stroke-opacity="0.45"/>' +
        '<circle cx="60" cy="54" r="17" stroke="#f5dc8e" stroke-width="2.1"/>' +
        '<line x1="60" y1="71" x2="60" y2="95" stroke="#f5dc8e" stroke-width="2.1" stroke-linecap="round"/>' +
        '<line x1="48" y1="83" x2="72" y2="83" stroke="#f5dc8e" stroke-width="2.1" stroke-linecap="round"/>' +
        '<path d="M60 22l2 4.5 4.5 2-4.5 2-2 4.5-2-4.5-4.5-2 4.5-2 2-4.5Z" fill="#fbf1d4"/>' +
        '<path d="M40 28l1.6 3.4 3.4 1.6-3.4 1.6-1.6 3.4-1.6-3.4-3.4-1.6 3.4-1.6 1.6-3.4Z" fill="#e5c158"/>' +
        '<path d="M80 28l1.6 3.4 3.4 1.6-3.4 1.6-1.6 3.4-1.6-3.4-3.4-1.6 3.4-1.6 1.6-3.4Z" fill="#e5c158"/>' +
        "</svg>"
    },
    {
      name: "O Imperador",
      arcana: "Arcano IV",
      symbolLabel: "Símbolo: Coroa e Cetro Solar",
      meaning:
        "O Imperador pede organização, limites claros e postura firme diante das decisões do dia. Ao colocar ordem nas prioridades e assumir o comando da própria rotina, você ganha segurança para avançar. A força verdadeira hoje nasce da disciplina tranquila e da coerência.",
      svg:
        '<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">' +
        '<circle cx="60" cy="60" r="48" stroke="#c89d3c" stroke-width="1" stroke-opacity="0.45"/>' +
        '<path d="M32 50l10-16 18 12 18-12 10 16v12H32V50Z" stroke="#f5dc8e" stroke-width="2" stroke-linejoin="round"/>' +
        '<circle cx="60" cy="76" r="10" stroke="#e5c158" stroke-width="2"/>' +
        '<line x1="60" y1="62" x2="60" y2="96" stroke="#e5c158" stroke-width="2" stroke-linecap="round"/>' +
        '<line x1="48" y1="76" x2="72" y2="76" stroke="#e5c158" stroke-width="2" stroke-linecap="round"/>' +
        "</svg>"
    },
    {
      name: "O Hierofante",
      arcana: "Arcano V",
      symbolLabel: "Símbolo: Chaves Cruzadas da Sabedoria",
      meaning:
        "O Hierofante aponta para o valor do conhecimento sólido, dos princípios éticos e do aprendizado compartilhado. Buscar orientação confiável, revisar fundamentos ou ensinar algo que você domina trará clareza. Honre seus valores essenciais ao fazer escolhas importantes hoje.",
      svg:
        '<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">' +
        '<circle cx="60" cy="60" r="48" stroke="#c89d3c" stroke-width="1" stroke-opacity="0.45"/>' +
        '<circle cx="42" cy="80" r="9" stroke="#f5dc8e" stroke-width="2"/>' +
        '<line x1="48" y1="74" x2="82" y2="40" stroke="#f5dc8e" stroke-width="2.1" stroke-linecap="round"/>' +
        '<path d="M74 48l6 6M79 43l5 5" stroke="#f5dc8e" stroke-width="2" stroke-linecap="round"/>' +
        '<circle cx="78" cy="80" r="9" stroke="#e5c158" stroke-width="2"/>' +
        '<line x1="72" y1="74" x2="38" y2="40" stroke="#e5c158" stroke-width="2.1" stroke-linecap="round"/>' +
        '<path d="M46 48l-6 6M41 43l-5 5" stroke="#e5c158" stroke-width="2" stroke-linecap="round"/>' +
        '<path d="M60 22l2.4 5 5.1 2.4-5.1 2.4-2.4 5-2.4-5-5.1-2.4 5.1-2.4L60 22Z" fill="#fbf1d4"/>' +
        "</svg>"
    },
    {
      name: "Os Enamorados",
      arcana: "Arcano VI",
      symbolLabel: "Símbolo: Anéis Entrelaçados e Estrela Guia",
      meaning:
        "Os Enamorados falam de sintonia, parcerias verdadeiras e decisões tomadas em alinhamento com o coração. O dia convida você a escolher com sinceridade aquilo que reflete quem você realmente é, em vez de agir apenas por impulso ou hábito. Quando razão e afeto caminham juntos, o caminho se abre com harmonia.",
      svg:
        '<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">' +
        '<circle cx="60" cy="60" r="48" stroke="#c89d3c" stroke-width="1" stroke-opacity="0.45"/>' +
        '<circle cx="48" cy="68" r="18" stroke="#f5dc8e" stroke-width="2"/>' +
        '<circle cx="72" cy="68" r="18" stroke="#e5c158" stroke-width="2"/>' +
        '<path d="M60 25l3.2 7.8L71 36l-7.8 3.2L60 47l-3.2-7.8L49 36l7.8-3.2L60 25Z" fill="#fbf1d4"/>' +
        '<circle cx="60" cy="68" r="2.8" fill="#fbf1d4"/>' +
        "</svg>"
    },
    {
      name: "O Sol",
      arcana: "Arcano XIX",
      symbolLabel: "Símbolo: Sol Radiante de Dezesseis Raios",
      meaning:
        "O Sol irradia vitalidade, lucidez e alegria genuína para iluminar suas dúvidas e esforços. Situações antes nebulosas ganham clareza, favorecendo encontros sinceros, reconhecimento e otimismo realista. Acolha a energia positiva do dia e compartilhe seu entusiasmo com generosidade.",
      svg:
        '<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">' +
        '<circle cx="60" cy="60" r="48" stroke="#c89d3c" stroke-width="1" stroke-opacity="0.45"/>' +
        '<circle cx="60" cy="60" r="18" stroke="#fbf1d4" stroke-width="2.2"/>' +
        '<circle cx="60" cy="60" r="9" stroke="#e5c158" stroke-width="1.4"/>' +
        '<g stroke="#f5dc8e" stroke-width="2" stroke-linecap="round">' +
        '<line x1="60" y1="22" x2="60" y2="34"/>' +
        '<line x1="60" y1="86" x2="60" y2="98"/>' +
        '<line x1="22" y1="60" x2="34" y2="60"/>' +
        '<line x1="86" y1="60" x2="98" y2="60"/>' +
        '<line x1="33" y1="33" x2="42" y2="42"/>' +
        '<line x1="78" y1="78" x2="87" y2="87"/>' +
        '<line x1="87" y1="33" x2="78" y2="42"/>' +
        '<line x1="42" y1="78" x2="33" y2="87"/>' +
        "</g>" +
        '<g stroke="#c89d3c" stroke-width="1.5" stroke-linecap="round">' +
        '<line x1="45" y1="25" x2="49" y2="35"/>' +
        '<line x1="75" y1="25" x2="71" y2="35"/>' +
        '<line x1="45" y1="95" x2="49" y2="85"/>' +
        '<line x1="75" y1="95" x2="71" y2="85"/>' +
        '<line x1="25" y1="45" x2="35" y2="49"/>' +
        '<line x1="95" y1="45" x2="85" y2="49"/>' +
        '<line x1="25" y1="75" x2="35" y2="71"/>' +
        '<line x1="95" y1="75" x2="85" y2="71"/>' +
        "</g>" +
        "</svg>"
    }
  ];

  function parseBirthDate(isoDate) {
    if (typeof isoDate !== "string") {
      return null;
    }

    var match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate.trim());
    if (!match) {
      return null;
    }

    var year = Number(match[1]);
    var month = Number(match[2]);
    var day = Number(match[3]);

    if (year < 1000 || year > 9999 || month < 1 || month > 12 || day < 1 || day > 31) {
      return null;
    }

    var check = new Date(year, month - 1, day);
    check.setFullYear(year);

    if (
      check.getFullYear() !== year ||
      check.getMonth() !== month - 1 ||
      check.getDate() !== day
    ) {
      return null;
    }

    return {
      dayStr: match[3],
      monthStr: match[2],
      yearStr: match[1]
    };
  }

  function calculateLifePath(isoDate) {
    var parsed = parseBirthDate(isoDate);
    if (!parsed) {
      return null;
    }

    var formattedDate = parsed.dayStr + "/" + parsed.monthStr + "/" + parsed.yearStr;
    var digits = (parsed.dayStr + parsed.monthStr + parsed.yearStr).split("").map(Number);

    var steps = [];
    var sum = digits.reduce(function (acc, digit) {
      return acc + digit;
    }, 0);
    steps.push({ digits: digits, sum: sum });

    while (sum > 9 && !MASTER_NUMBERS[sum]) {
      digits = String(sum).split("").map(Number);
      sum = digits.reduce(function (acc, digit) {
        return acc + digit;
      }, 0);
      steps.push({ digits: digits, sum: sum });
    }

    return {
      number: sum,
      isMaster: Boolean(MASTER_NUMBERS[sum]),
      formattedDate: formattedDate,
      steps: steps
    };
  }

  function formatBreakdown(calculation) {
    var parts = calculation.steps.map(function (step) {
      return step.digits.join(" + ") + " = " + step.sum;
    });

    var text = calculation.formattedDate + " → " + parts.join(" → ");
    if (calculation.isMaster) {
      text += " (número mestre preservado)";
    }
    return text;
  }

  function drawRandomCardIndex(previousIndex) {
    var total = ORACLE_CARDS.length;
    if (previousIndex === null || previousIndex < 0 || previousIndex >= total) {
      return Math.floor(Math.random() * total);
    }
    var offset = Math.floor(Math.random() * (total - 1));
    return (previousIndex + 1 + offset) % total;
  }

  function initTabs(tabButtons, tabPanels) {
    function activateTab(targetBtn, moveFocus) {
      var targetPanelId = targetBtn.getAttribute("aria-controls");

      tabButtons.forEach(function (btn) {
        var isSelected = btn === targetBtn;
        btn.classList.toggle("is-active", isSelected);
        btn.setAttribute("aria-selected", isSelected ? "true" : "false");
        btn.setAttribute("tabindex", isSelected ? "0" : "-1");
      });

      tabPanels.forEach(function (panel) {
        var isTarget = panel.id === targetPanelId;
        panel.classList.toggle("is-active", isTarget);
        panel.hidden = !isTarget;
      });

      if (moveFocus) {
        targetBtn.focus();
      }
    }

    tabButtons.forEach(function (btn, index) {
      btn.addEventListener("click", function () {
        activateTab(btn, false);
      });

      btn.addEventListener("keydown", function (event) {
        var nextIndex = null;
        if (event.key === "ArrowRight") {
          nextIndex = (index + 1) % tabButtons.length;
        } else if (event.key === "ArrowLeft") {
          nextIndex = (index - 1 + tabButtons.length) % tabButtons.length;
        } else if (event.key === "Home") {
          nextIndex = 0;
        } else if (event.key === "End") {
          nextIndex = tabButtons.length - 1;
        }

        if (nextIndex !== null) {
          event.preventDefault();
          activateTab(tabButtons[nextIndex], true);
        }
      });
    });
  }

  function initLifePath() {
    var form = document.getElementById("lifepath-form");
    var dateInput = document.getElementById("birth-date");
    var errorEl = document.getElementById("birth-date-error");
    var resultBox = document.getElementById("lifepath-result");
    var numberEl = document.getElementById("result-number");
    var masterBadgeEl = document.getElementById("result-master-badge");
    var titleEl = document.getElementById("result-title");
    var interpretationEl = document.getElementById("result-interpretation");
    var breakdownEl = document.getElementById("result-breakdown");

    function showError(message) {
      errorEl.textContent = message;
      errorEl.hidden = false;
      dateInput.setAttribute("aria-invalid", "true");
    }

    function clearError() {
      errorEl.textContent = "";
      errorEl.hidden = true;
      dateInput.removeAttribute("aria-invalid");
    }

    dateInput.addEventListener("input", clearError);

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var rawValue = dateInput.value;
      if (!rawValue) {
        showError("Selecione sua data de nascimento para calcular.");
        dateInput.focus();
        return;
      }

      var calculation = calculateLifePath(rawValue);
      if (!calculation || !LIFE_PATH_DATA[calculation.number]) {
        showError("Informe uma data de nascimento válida.");
        dateInput.focus();
        return;
      }

      clearError();

      var profile = LIFE_PATH_DATA[calculation.number];
      numberEl.textContent = String(calculation.number);
      masterBadgeEl.hidden = !calculation.isMaster;
      titleEl.textContent = profile.title;
      interpretationEl.textContent = profile.interpretation;
      breakdownEl.textContent = formatBreakdown(calculation);

      // Re-dispara animação suave ao recalcular
      resultBox.hidden = false;
      resultBox.style.animation = "none";
      void resultBox.offsetWidth;
      resultBox.style.animation = "";
    });
  }

  function initOracle() {
    var initialBox = document.getElementById("oracle-initial");
    var revealedBox = document.getElementById("oracle-revealed");
    var cardBackBtn = document.getElementById("card-back-trigger");
    var drawBtn = document.getElementById("btn-sortear");
    var redrawBtn = document.getElementById("btn-sortear-outra");

    var cardFace = document.getElementById("tarot-card-face");
    var arcanaEl = document.getElementById("card-arcana");
    var symbolEl = document.getElementById("card-symbol");
    var symbolLabelEl = document.getElementById("card-symbol-label");
    var nameEl = document.getElementById("card-name");
    var meaningEl = document.getElementById("card-meaning");

    var currentCardIndex = null;

    function revealCard() {
      var nextIndex = drawRandomCardIndex(currentCardIndex);
      currentCardIndex = nextIndex;
      var card = ORACLE_CARDS[nextIndex];

      arcanaEl.textContent = card.arcana;
      symbolEl.innerHTML = card.svg;
      symbolLabelEl.textContent = card.symbolLabel;
      nameEl.textContent = card.name;
      meaningEl.textContent = card.meaning;

      initialBox.hidden = true;
      revealedBox.hidden = false;

      cardFace.classList.remove("is-animating");
      void cardFace.offsetWidth;
      cardFace.classList.add("is-animating");
    }

    drawBtn.addEventListener("click", revealCard);
    cardBackBtn.addEventListener("click", revealCard);
    redrawBtn.addEventListener("click", revealCard);
  }

  document.addEventListener("DOMContentLoaded", function () {
    var tabButtons = Array.prototype.slice.call(document.querySelectorAll(".tab-btn"));
    var tabPanels = Array.prototype.slice.call(document.querySelectorAll(".tab-panel"));

    initTabs(tabButtons, tabPanels);
    initLifePath();
    initOracle();
  });
})();
