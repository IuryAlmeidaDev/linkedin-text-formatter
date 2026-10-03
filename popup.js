document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('inputText');
  const list = document.getElementById('stylesList');

  // Limpeza de unicode para texto padrão
  function cleanUnicode(str) {
    let result = '';
    const normalized = str.replace(/[\u0332\u0336]/g, '');

    for (const char of normalized) {
      const cp = char.codePointAt(0);
      if (cp >= 0x1D5D4 && cp <= 0x1D5ED) { result += String.fromCharCode(cp - 0x1D5D4 + 65); continue; }
      if (cp >= 0x1D5EE && cp <= 0x1D607) { result += String.fromCharCode(cp - 0x1D5EE + 97); continue; }
      if (cp >= 0x1D7EC && cp <= 0x1D7F5) { result += String.fromCharCode(cp - 0x1D7EC + 48); continue; }
      if (cp >= 0x1D608 && cp <= 0x1D621) { result += String.fromCharCode(cp - 0x1D608 + 65); continue; }
      if (cp >= 0x1D622 && cp <= 0x1D63B) { result += String.fromCharCode(cp - 0x1D622 + 97); continue; }
      if (cp >= 0x1D63C && cp <= 0x1D655) { result += String.fromCharCode(cp - 0x1D63C + 65); continue; }
      if (cp >= 0x1D656 && cp <= 0x1D66F) { result += String.fromCharCode(cp - 0x1D656 + 97); continue; }
      if (cp >= 0x1D670 && cp <= 0x1D689) { result += String.fromCharCode(cp - 0x1D670 + 65); continue; }
      if (cp >= 0x1D68A && cp <= 0x1D6A3) { result += String.fromCharCode(cp - 0x1D68A + 97); continue; }
      if (cp >= 0x1D7F6 && cp <= 0x1D7FF) { result += String.fromCharCode(cp - 0x1D7F6 + 48); continue; }
      result += char;
    }
    return result;
  }

  const Styles = [
    {
      id: 'bold',
      name: 'Negrito',
      fn: (str) => {
        const clean = cleanUnicode(str);
        return Array.from(clean).map(char => {
          const code = char.charCodeAt(0);
          if (code >= 65 && code <= 90) return String.fromCodePoint(0x1D5D4 + (code - 65));
          if (code >= 97 && code <= 122) return String.fromCodePoint(0x1D5EE + (code - 97));
          if (code >= 48 && code <= 57) return String.fromCodePoint(0x1D7EC + (code - 48));
          return char;
        }).join('');
      }
    },
    {
      id: 'italic',
      name: 'Itálico',
      fn: (str) => {
        const clean = cleanUnicode(str);
        return Array.from(clean).map(char => {
          const code = char.charCodeAt(0);
          if (code >= 65 && code <= 90) return String.fromCodePoint(0x1D608 + (code - 65));
          if (code >= 97 && code <= 122) return String.fromCodePoint(0x1D622 + (code - 97));
          return char;
        }).join('');
      }
    },
    {
      id: 'boldItalic',
      name: 'Neg. Itálico',
      fn: (str) => {
        const clean = cleanUnicode(str);
        return Array.from(clean).map(char => {
          const code = char.charCodeAt(0);
          if (code >= 65 && code <= 90) return String.fromCodePoint(0x1D63C + (code - 65));
          if (code >= 97 && code <= 122) return String.fromCodePoint(0x1D656 + (code - 97));
          return char;
        }).join('');
      }
    },
    {
      id: 'underline',
      name: 'Sublinhado',
      fn: (str) => {
        const clean = cleanUnicode(str);
        return Array.from(clean).map(c => c + '\u0332').join('');
      }
    },
    {
      id: 'strikethrough',
      name: 'Tachado',
      fn: (str) => {
        const clean = cleanUnicode(str);
        return Array.from(clean).map(c => c + '\u0336').join('');
      }
    },
    {
      id: 'monospace',
      name: 'Monospace',
      fn: (str) => {
        const clean = cleanUnicode(str);
        return Array.from(clean).map(char => {
          const code = char.charCodeAt(0);
          if (code >= 65 && code <= 90) return String.fromCodePoint(0x1D670 + (code - 65));
          if (code >= 97 && code <= 122) return String.fromCodePoint(0x1D68A + (code - 97));
          if (code >= 48 && code <= 57) return String.fromCodePoint(0x1D7F6 + (code - 48));
          return char;
        }).join('');
      }
    }
  ];

  // Renderiza a lista de opções
  function render(text) {
    const sample = text.trim() || 'Texto de exemplo';
    list.innerHTML = '';

    Styles.forEach(style => {
      const formatted = style.fn(sample);

      const row = document.createElement('div');
      row.className = 'style-row';

      row.innerHTML = `
        <span class="style-label">${style.name}</span>
        <span class="style-preview">${formatted}</span>
        <button class="copy-btn">Copiar</button>
      `;

      const btn = row.querySelector('.copy-btn');
      btn.addEventListener('click', () => {
        navigator.clipboard.writeText(formatted).then(() => {
          btn.textContent = 'Copiado! ✓';
          btn.classList.add('copied');
          setTimeout(() => {
            btn.textContent = 'Copiar';
            btn.classList.remove('copied');
          }, 1500);
        });
      });

      list.appendChild(row);
    });
  }

  input.addEventListener('input', (e) => {
    render(e.target.value);
  });

  // Render inicial
  render('');
});
