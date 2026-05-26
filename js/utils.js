/**
 * DevUtils - Developer Toolbox
 * 100% frontend, no backend needed
 */

// =================== Toast ===================

function showToast(msg) {
  document.querySelectorAll('.toast').forEach(t => t.remove());
  const d = document.createElement('div');
  d.className = 'toast';
  d.textContent = msg;
  document.body.appendChild(d);
  setTimeout(() => d.remove(), 2200);
}

// =================== Theme ===================

function toggleTheme() {
  const cur = document.documentElement.getAttribute('data-theme');
  const next = cur === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('devutils-theme', next);
  showToast(next === 'dark' ? '🌙 深色模式' : '☀️ 浅色模式');
}
(function initTheme() {
  const saved = localStorage.getItem('devutils-theme');
  if (saved) document.documentElement.setAttribute('data-theme', saved);
})();

// =================== Search ===================

function filterTools(q) {
  q = q.toLowerCase().trim();
  const cards = document.querySelectorAll('.tool-card');
  let visible = 0;
  cards.forEach(c => {
    const name = c.dataset.name || '';
    const tags = c.dataset.tags || '';
    const match = !q || name.toLowerCase().includes(q) || tags.includes(q);
    c.style.display = match ? '' : 'none';
    if (match) visible++;
  });
  document.getElementById('toolCount').textContent = `${visible} 个工具`;
}

// =================== Clipboard ===================

function copyText(text) {
  navigator.clipboard.writeText(text).then(() => showToast('✅ 已复制'));
}

// =================== Base64 ===================

function b64Encode() {
  try {
    const input = document.getElementById('b64Input').value;
    document.getElementById('b64Output').value = btoa(unescape(encodeURIComponent(input)));
  } catch (e) {
    document.getElementById('b64Output').value = '❌ ' + e.message;
  }
}
function b64Decode() {
  try {
    const input = document.getElementById('b64Input').value.trim();
    document.getElementById('b64Output').value = decodeURIComponent(escape(atob(input)));
  } catch (e) {
    document.getElementById('b64Output').value = '❌ 无效的 Base64: ' + e.message;
  }
}
function b64Clear() {
  document.getElementById('b64Input').value = '';
  document.getElementById('b64Output').value = '';
}

// =================== JSON ===================

function jsonFormat() {
  try {
    const input = document.getElementById('jsonInput').value;
    const parsed = JSON.parse(input);
    document.getElementById('jsonOutput').value = JSON.stringify(parsed, null, 2);
  } catch (e) {
    document.getElementById('jsonOutput').value = '❌ JSON 解析错误: ' + e.message;
  }
}
function jsonMinify() {
  try {
    const input = document.getElementById('jsonInput').value;
    const parsed = JSON.parse(input);
    document.getElementById('jsonOutput').value = JSON.stringify(parsed);
  } catch (e) {
    document.getElementById('jsonOutput').value = '❌ JSON 解析错误: ' + e.message;
  }
}
function jsonClear() {
  document.getElementById('jsonInput').value = '';
  document.getElementById('jsonOutput').value = '';
}

// =================== URL Parser ===================

function parseUrl() {
  const url = document.getElementById('urlInput').value.trim();
  const out = document.getElementById('urlOutput');
  if (!url) { out.innerHTML = '<p style="color:var(--text-secondary);padding:8px">请输入 URL</p>'; return; }
  try {
    let u = url;
    if (!u.startsWith('http')) u = 'https://' + u;
    const parsed = new URL(u);
    const params = parsed.searchParams;
    if (!params.size) {
      out.innerHTML = `<div class="url-param"><span class="key">origin</span><span class="value">${parsed.origin}</span></div>
        <div class="url-param"><span class="key">pathname</span><span class="value">${parsed.pathname}</span></div>
        <p style="color:var(--text-secondary);font-size:12px;margin-top:6px">无查询参数</p>`;
      return;
    }
    out.innerHTML = Array.from(params.entries()).map(([k, v]) =>
      `<div class="url-param"><span class="key">${escHtml(k)}</span><span class="value">${escHtml(v)}</span></div>`
    ).join('');
  } catch (e) {
    out.innerHTML = `<div class="regex-error">❌ 无效的 URL: ${escHtml(e.message)}</div>`;
  }
}

// =================== Timestamp ===================

function tsToDate() {
  const v = document.getElementById('tsInput').value.trim();
  if (!v) return;
  const ts = parseInt(v, 10);
  const d = new Date(ts * 1000);
  if (isNaN(d.getTime())) {
    document.getElementById('tsOutput').textContent = '❌ 无效时间戳';
    return;
  }
  document.getElementById('tsOutput').textContent = d.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
}
function nowStamp() {
  document.getElementById('tsInput').value = Math.floor(Date.now() / 1000);
  tsToDate();
}
function dateToTs() {
  const v = document.getElementById('dateInput').value.trim();
  if (!v) return;
  const d = new Date(v);
  if (isNaN(d.getTime())) {
    document.getElementById('dateOutput').textContent = '❌ 无效日期格式';
    return;
  }
  document.getElementById('dateOutput').textContent = Math.floor(d.getTime() / 1000);
}

// =================== Color ===================

function colorFromPicker(hex) { colorFromHex(hex); }
function colorFromHex(hex) {
  hex = hex.trim();
  if (!hex.startsWith('#')) hex = '#' + hex;
  document.getElementById('colorHex').value = hex;
  document.getElementById('colorPicker').value = hex;
  const rgb = hexToRgb(hex);
  if (!rgb) {
    document.getElementById('outRgb').textContent = '无效颜色';
    document.getElementById('outHsl').textContent = '无效颜色';
    return;
  }
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const rgbStr = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  const hslStr = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
  document.getElementById('outHex').textContent = hex.toLowerCase();
  document.getElementById('outRgb').textContent = rgbStr;
  document.getElementById('outHsl').textContent = hslStr;
  document.getElementById('colorPreview').style.background = hex;
  // update copy buttons
  const items = document.querySelectorAll('.color-item');
  items[0].querySelector('.copy-btn').onclick = () => copyText(hex.toLowerCase());
  items[1].querySelector('.copy-btn').onclick = () => copyText(rgbStr);
  items[2].querySelector('.copy-btn').onclick = () => copyText(hslStr);
}
function hexToRgb(hex) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return m ? { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) } : null;
}
function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) { h = s = 0; }
  else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

// =================== Regex ===================

function testRegex() {
  const pattern = document.getElementById('regexPattern').value;
  const flags = document.getElementById('regexFlags').value;
  const text = document.getElementById('regexText').value;
  const out = document.getElementById('regexOutput');
  if (!pattern) { out.innerHTML = ''; return; }
  try {
    const re = new RegExp(pattern, flags);
    const matches = [...text.matchAll(new RegExp(pattern, flags.includes('g') ? flags : flags + 'g'))];
    if (!matches.length) {
      out.innerHTML = '<div class="regex-result"><p style="color:var(--text-secondary);padding:8px">无匹配</p></div>';
      return;
    }
    let highlighted = '';
    let lastIdx = 0;
    for (const m of matches) {
      highlighted += escHtml(text.slice(lastIdx, m.index));
      highlighted += `<span class="regex-match">${escHtml(m[0])}</span>`;
      lastIdx = m.index + m[0].length;
    }
    highlighted += escHtml(text.slice(lastIdx));
    out.innerHTML = `<div class="regex-result"><p style="margin-bottom:6px;font-size:13px;color:var(--text-secondary)">${matches.length} 次匹配</p><div style="padding:8px;background:var(--bg);border-radius:6px;font-family:monospace;font-size:13px;white-space:pre-wrap">${highlighted}</div></div>`;
  } catch (e) {
    out.innerHTML = `<div class="regex-error">❌ ${escHtml(e.message)}</div>`;
  }
}

// =================== Diff ===================

function computeDiff() {
  const left = document.getElementById('diffLeft').value.split('\n');
  const right = document.getElementById('diffRight').value.split('\n');
  const out = document.getElementById('diffOutput');
  const lcs = buildLcs(left, right);
  let result = '';
  let li = 0, ri = 0;
  const lo = left.length, ro = right.length;
  while (li < lo || ri < ro) {
    if (li < lo && ri < ro && left[li] === right[ri]) {
      result += `<span class="diff-same">  ${escHtml(left[li])}</span>\n`;
      li++; ri++;
    } else if (ri < ro && (li >= lo || (li < lo && lcs[li][ri] !== lcs[li + 1]?.[ri] && lcs[li][ri] === lcs[li][ri - 1] + 1 ? false : true)))) {
      // simplified: prefer additions when both missing
      result += `<span class="diff-add">+ ${escHtml(right[ri])}</span>\n`;
      ri++;
    } else if (li < lo) {
      result += `<span class="diff-del">- ${escHtml(left[li])}</span>\n`;
      li++;
    }
  }
  // Fallback: simple line-by-line for edge cases
  if (!result.trim()) {
    const maxLen = Math.max(left.length, right.length);
    for (let i = 0; i < maxLen; i++) {
      const l = left[i] ?? null;
      const r = right[i] ?? null;
      if (l === r) {
        result += `<span class="diff-same">  ${escHtml(l)}</span>\n`;
      } else {
        if (l !== null) result += `<span class="diff-del">- ${escHtml(l)}</span>\n`;
        if (r !== null) result += `<span class="diff-add">+ ${escHtml(r)}</span>\n`;
      }
    }
  }
  out.innerHTML = result;
}
function buildLcs(a, b) {
  // returns length table only, not full backtrace (keep it simple)
  const m = a.length, n = b.length;
  const table = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      table[i][j] = a[i - 1] === b[j - 1] ? table[i - 1][j - 1] + 1 : Math.max(table[i - 1][j], table[i][j - 1]);
  return table;
}

// =================== Hash ===================

async function generateHash() {
  const input = document.getElementById('hashInput').value;
  const out = document.getElementById('hashOutput');
  if (!input) { out.innerHTML = '<p style="color:var(--text-secondary);padding:8px">请输入文本</p>'; return; }
  const buf = new TextEncoder().encode(input);
  const algos = ['SHA-1', 'SHA-256', 'SHA-512'];
  out.innerHTML = '';
  for (const algo of algos) {
    const hash = await crypto.subtle.digest(algo, buf);
    const hex = Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
    out.innerHTML += `<div class="hash-item"><span class="algo">${algo}</span><span class="val">${hex}</span><button class="copy-btn" onclick="copyText('${hex}')">复制</button></div>`;
  }
}

// =================== Markdown Preview ===================

function renderMd() {
  const src = document.getElementById('mdInput').value;
  document.getElementById('mdOutput').innerHTML = mdToHtml(src);
}
function mdToHtml(src) {
  let h = escHtml(src);
  // code blocks
  h = h.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>');
  // inline code
  h = h.replace(/`([^`]+)`/g, '<code>$1</code>');
  // headers
  h = h.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  h = h.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  h = h.replace(/^# (.+)$/gm, '<h1>$1</h1>');
  // bold & italic
  h = h.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  h = h.replace(/\*(.+?)\*/g, '<em>$1</em>');
  // blockquote
  h = h.replace(/^&gt; (.+)$/gm, '<blockquote>$1</blockquote>');
  // unordered list
  h = h.replace(/^- (.+)$/gm, '<li>$1</li>');
  h = h.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');
  // ordered list
  h = h.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');
  // links
  h = h.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
  // line breaks → paragraphs
  h = h.replace(/\n\n/g, '</p><p>');
  h = h.replace(/\n/g, '<br>');
  h = '<p>' + h + '</p>';
  h = h.replace(/<p><(h[1-3]|ul|ol|pre|blockquote)/g, '<$1');
  h = h.replace(/<\/(h[1-3]|ul|ol|pre|blockquote)><\/p>/g, '</$1>');
  return h;
}

// =================== Util ===================

function escHtml(s) {
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

// =================== Init ===================

// Initialize default markdown preview
(function() {
  const mdSample = `# Hello DevUtils!\n\nThis is a **Markdown** preview.\n\n- Item one\n- Item two\n\n> A blockquote\n\nInline \`code\` example.`;
  document.getElementById('mdInput').value = mdSample;
  renderMd();
})();
