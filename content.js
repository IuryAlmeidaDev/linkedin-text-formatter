// Content Script para Extensão: Texto Negrito e Itálico no LinkedIn

(function () {
  'use strict';

  // Dicionário de normalização (reverter Unicode para texto normal)
  function cleanUnicode(str) {
    let result = '';
    // Remove caracteres combinados (underline e strike)
    const normalized = str.replace(/[\u0332\u0336]/g, '');

    for (const char of normalized) {
      const cp = char.codePointAt(0);

      // Sans Bold A-Z, a-z, 0-9
      if (cp >= 0x1D5D4 && cp <= 0x1D5ED) { result += String.fromCharCode(cp - 0x1D5D4 + 65); continue; }
      if (cp >= 0x1D5EE && cp <= 0x1D607) { result += String.fromCharCode(cp - 0x1D5EE + 97); continue; }
      if (cp >= 0x1D7EC && cp <= 0x1D7F5) { result += String.fromCharCode(cp - 0x1D7EC + 48); continue; }

      // Sans Italic A-Z, a-z
      if (cp >= 0x1D608 && cp <= 0x1D621) { result += String.fromCharCode(cp - 0x1D608 + 65); continue; }
      if (cp >= 0x1D622 && cp <= 0x1D63B) { result += String.fromCharCode(cp - 0x1D622 + 97); continue; }

      // Sans Bold Italic A-Z, a-z
      if (cp >= 0x1D63C && cp <= 0x1D655) { result += String.fromCharCode(cp - 0x1D63C + 65); continue; }
      if (cp >= 0x1D656 && cp <= 0x1D66F) { result += String.fromCharCode(cp - 0x1D656 + 97); continue; }

      // Monospace A-Z, a-z, 0-9
      if (cp >= 0x1D670 && cp <= 0x1D689) { result += String.fromCharCode(cp - 0x1D670 + 65); continue; }
      if (cp >= 0x1D68A && cp <= 0x1D6A3) { result += String.fromCharCode(cp - 0x1D68A + 97); continue; }
      if (cp >= 0x1D7F6 && cp <= 0x1D7FF) { result += String.fromCharCode(cp - 0x1D7F6 + 48); continue; }

      result += char;
    }
    return result;
  }

  // Transformadores de estilo
  const Formatters = {
    bold: (str) => {
      const clean = cleanUnicode(str);
      return Array.from(clean).map(char => {
        const code = char.charCodeAt(0);
        if (code >= 65 && code <= 90) return String.fromCodePoint(0x1D5D4 + (code - 65));
        if (code >= 97 && code <= 122) return String.fromCodePoint(0x1D5EE + (code - 97));
        if (code >= 48 && code <= 57) return String.fromCodePoint(0x1D7EC + (code - 48));
        return char;
      }).join('');
    },
    italic: (str) => {
      const clean = cleanUnicode(str);
      return Array.from(clean).map(char => {
        const code = char.charCodeAt(0);
        if (code >= 65 && code <= 90) return String.fromCodePoint(0x1D608 + (code - 65));
        if (code >= 97 && code <= 122) return String.fromCodePoint(0x1D622 + (code - 97));
        return char;
      }).join('');
    },
    boldItalic: (str) => {
      const clean = cleanUnicode(str);
      return Array.from(clean).map(char => {
        const code = char.charCodeAt(0);
        if (code >= 65 && code <= 90) return String.fromCodePoint(0x1D63C + (code - 65));
        if (code >= 97 && code <= 122) return String.fromCodePoint(0x1D656 + (code - 97));
        return char;
      }).join('');
    },
    underline: (str) => {
      const clean = cleanUnicode(str);
      return Array.from(clean).map(c => c + '\u0332').join('');
    },
    strikethrough: (str) => {
      const clean = cleanUnicode(str);
      return Array.from(clean).map(c => c + '\u0336').join('');
    },
    monospace: (str) => {
      const clean = cleanUnicode(str);
      return Array.from(clean).map(char => {
        const code = char.charCodeAt(0);
        if (code >= 65 && code <= 90) return String.fromCodePoint(0x1D670 + (code - 65));
        if (code >= 97 && code <= 122) return String.fromCodePoint(0x1D68A + (code - 97));
        if (code >= 48 && code <= 57) return String.fromCodePoint(0x1D7F6 + (code - 48));
        return char;
      }).join('');
    },
    clean: (str) => cleanUnicode(str)
  };

  let floatingBar = null;

  // Cria a barra flutuante
  function createFloatingBar() {
    if (floatingBar) return floatingBar;

    floatingBar = document.createElement('div');
    floatingBar.className = 'li-formatter-floating-bar';
    floatingBar.style.display = 'none';

    const buttons = [
      { id: 'bold', label: '𝗕', title: 'Negrito' },
      { id: 'italic', label: '𝘐', title: 'Itálico' },
      { id: 'boldItalic', label: '𝘽𝙄', title: 'Negrito Itálico' },
      { id: 'underline', label: '̲U', title: 'Sublinhado' },
      { id: 'strikethrough', label: '<s>S</s>', title: 'Tachado' },
      { id: 'monospace', label: '𝙼', title: 'Código/Mono' },
      { type: 'divider' },
      { id: 'clean', label: 'Limpar', title: 'Remover formatação' }
    ];

    buttons.forEach(btn => {
      if (btn.type === 'divider') {
        const div = document.createElement('div');
        div.className = 'li-formatter-divider';
        floatingBar.appendChild(div);
        return;
      }

      const button = document.createElement('button');
      button.className = 'li-formatter-btn';
      button.innerHTML = btn.label;
      button.title = btn.title;

      button.addEventListener('mousedown', (e) => {
        e.preventDefault(); // Impede a perda da seleção do texto
        applyFormatting(btn.id);
      });

      floatingBar.appendChild(button);
    });

    document.body.appendChild(floatingBar);
    return floatingBar;
  }

  // Aplica o formato ao texto selecionado
  function applyFormatting(formatType) {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const selectedText = selection.toString();
    if (!selectedText.trim()) return;

    const formatter = Formatters[formatType];
    if (!formatter) return;

    const newText = formatter(selectedText);

    // Executa a substituição via comando do navegador (mantém histórico do LinkedIn)
    document.execCommand('insertText', false, newText);

    hideFloatingBar();
  }

  function hideFloatingBar() {
    if (floatingBar) {
      floatingBar.style.display = 'none';
    }
  }

  // Posiciona a barra flutuante exatamente acima do texto selecionado
  function handleSelection() {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !selection.rangeCount) {
      hideFloatingBar();
      return;
    }

    const selectedText = selection.toString();
    if (!selectedText.trim()) {
      hideFloatingBar();
      return;
    }

    // Verifica se está dentro de uma área editável (post, comentário ou textarea)
    const anchorNode = selection.anchorNode;
    const editableParent = anchorNode && (anchorNode.nodeType === 1 ? anchorNode : anchorNode.parentElement)
      ?.closest('[contenteditable="true"], textarea, input');

    if (!editableParent) {
      hideFloatingBar();
      return;
    }

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    if (rect.width === 0 || rect.height === 0) {
      hideFloatingBar();
      return;
    }

    const bar = createFloatingBar();
    bar.style.display = 'flex';

    const barWidth = bar.offsetWidth || 280;
    const barHeight = bar.offsetHeight || 38;

    let top = rect.top + window.scrollY - barHeight - 8;
    let left = rect.left + window.scrollX + (rect.width / 2) - (barWidth / 2);

    // Evita sair para fora da tela
    if (left < 10) left = 10;
    if (left + barWidth > window.innerWidth - 10) left = window.innerWidth - barWidth - 10;
    if (top < window.scrollY + 10) top = rect.bottom + window.scrollY + 8; // mostra abaixo se não couber em cima

    bar.style.top = `${top}px`;
    bar.style.left = `${left}px`;
  }

  // Escuta os eventos de seleção do usuário
  document.addEventListener('mouseup', () => {
    setTimeout(handleSelection, 50);
  });

  document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      setTimeout(handleSelection, 50);
    }
  });

  // Esconde a barra ao clicar fora
  document.addEventListener('mousedown', (e) => {
    if (floatingBar && !floatingBar.contains(e.target)) {
      hideFloatingBar();
    }
  });
})();
