// code-blocks.js — adds language label + copy-to-clipboard button to every <pre>.
// Runs after DOM is ready.

(function () {
  function enhanceCodeBlocks() {
    document.querySelectorAll('pre').forEach(function (pre) {
      if (pre.dataset.enhanced) return;
      pre.dataset.enhanced = 'true';

      // Find the language from the code element's class (e.g. "language-prl")
      const code = pre.querySelector('code');
      let lang = '';
      if (code) {
        const m = code.className.match(/(?:language|hljs)-(\w+)/);
        if (m) lang = m[1];
      }

      // Create header bar
      const header = document.createElement('div');
      header.className = 'code-block-header';

      // Language label
      if (lang) {
        const label = document.createElement('span');
        label.className = 'code-block-lang';
        label.textContent = lang;
        header.appendChild(label);
      }

      // Copy button
      const btn = document.createElement('button');
      btn.className = 'code-block-copy';
      btn.type = 'button';
      btn.setAttribute('aria-label', 'Copy code to clipboard');
      btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
      btn.addEventListener('click', function () {
        const text = code ? code.textContent : pre.textContent;
        navigator.clipboard.writeText(text).then(function () {
          btn.classList.add('copied');
          btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
          setTimeout(function () {
            btn.classList.remove('copied');
            btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
          }, 2000);
        });
      });
      header.appendChild(btn);

      // Wrap pre in a container
      const wrapper = document.createElement('div');
      wrapper.className = 'code-block-wrapper';
      pre.parentNode.insertBefore(wrapper, pre);
      wrapper.appendChild(header);
      wrapper.appendChild(pre);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', enhanceCodeBlocks);
  } else {
    enhanceCodeBlocks();
  }

  // Re-run on view transitions (Astro client-side navigation)
  document.addEventListener('astro:page-load', enhanceCodeBlocks);
})();
