# ✍️ Texto Negrito e Itálico no LinkedIn - Formatar Posts e Comentários

Uma extensão leve e prática para o Google Chrome (Manifest V3) que permite formatar textos com **negrito**, *itálico*, ̲s̲u̲b̲l̲i̲n̲h̲a̲d̲o̲, ~~tachado~~ e `código/mono` diretamente no feed e comentários do LinkedIn com apenas 1 clique.

---

## ✨ Recursos

- ⚡ **Barra Flutuante no LinkedIn:** Selecione qualquer palavra ou frase enquanto escreve seu post ou comentário no LinkedIn e veja uma barra elegante aparecer para formatar na hora.
- 🎯 **Preserva o Editor do LinkedIn:** Usa `insertText` nativo, garantindo que o histórico de desfazer (`Ctrl+Z`), tags de pessoas e emojis não quebrem.
- 🪟 **Popup Independente:** Clicando no ícone da extensão, você pode digitar ou colar qualquer texto e copiar os estilos prontos para usar no LinkedIn, WhatsApp, Twitter/X ou Instagram.
- 🔄 **Desfazer / Limpar Formatação:** Botão dedicado para reverter qualquer texto estilizado de volta ao texto padrão.
- 🔒 **100% Local e Privado:** Sem coleta de dados, sem envio para servidores, sem cadastro.

---

## 🚀 Como testar no seu Google Chrome (Modo Desenvolvedor)

1. Abra o Google Chrome e digite na barra de endereços:  
   `chrome://extensions/`
2. No canto superior direito, ative a chave **"Modo do desenvolvedor"**.
3. No canto superior esquerdo, clique no botão **"Carregar sem compactação"**.
4. Selecione esta pasta (`linkedin-formatador-texto`).
5. Acesse o [LinkedIn](https://www.linkedin.com), clique em "Começar publicação", digite uma frase e selecione o texto com o mouse. A barra de formatação aparecerá automaticamente acima do texto!

---

## 📁 Estrutura do Projeto

```
linkedin-formatador-texto/
├── manifest.json       # Configuração da extensão (Manifest V3)
├── content.js          # Barra flutuante e conversor de caracteres Unicode
├── styles.css          # Estilos elegantes da barra flutuante
├── popup.html          # Interface de digitação e cópia rápida
├── popup.js            # Lógica reativa do popup
├── icons/              # Ícones oficiais (16x16, 48x48, 128x128)
├── PRIVACY_POLICY.md   # Política de privacidade pronta para a Chrome Web Store
└── README.md           # Documentação do projeto
```

---

## 📄 Licença

Distribuído sob a licença MIT.
