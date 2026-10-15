/* ============================================================
 * ingesto 界面多语言引擎
 * ------------------------------------------------------------
 * 原理：不修改 index.html 里的任何英文内容，页面加载后由本脚本
 * 按词典把「可见文本」替换为目标语言。默认 English；词典里查
 * 不到的条目一律保持英文，软件的功能与逻辑完全不受影响。
 *
 * 新增一种语言 = 在 lang/ 目录放一个 xx.js（把词典挂到 window），
 * 在下方 LANGS 里登记，并在设置面板的语言下拉框里加一个 option。
 *
 * 覆盖范围：文本节点、title / placeholder / aria-label / data-tip
 * 属性、按元素 id 的整段 innerHTML 覆盖，以及由 JS 动态插入的
 * 内容（MutationObserver 自动跟进翻译）。
 * 不覆盖：生成的报告文件、系统通知（由主进程产生）。
 * ============================================================ */
(function () {
  'use strict';

  var STORAGE_KEY = 'ingesto-language';

  /* 已安装的语言。dictName 是该语言词典挂在 window 上的变量名。 */
  var LANGS = {
    'en': { label: 'English', dictName: null },
    'zh-CN': { label: '简体中文', dictName: 'INGESTO_LANG_ZH_CN' }
  };

  /* 会被翻译的属性 */
  var ATTRS = ['title', 'placeholder', 'aria-label', 'data-tip'];

  /* 整个子树都不翻译的标签 */
  var SKIP_TAGS = { SCRIPT: 1, STYLE: 1, SVG: 1, NOSCRIPT: 1, IFRAME: 1, OBJECT: 1 };

  var current = 'en';      // 当前语言
  var dict = null;         // 当前词典（英文为 null）
  var patterns = [];       // 预编译的动态文本规则 [RegExp, 模板]
  var observer = null;

  /* 翻译记录：切回英文时按记录还原。只还原「当前值仍等于我们写入的
   * 译文」的条目；若 JS 之后又改过该节点，说明界面已是最新内容，
   * 直接跳过，避免用旧译文覆盖新状态。 */
  var touchedText = new Map();   // TextNode -> {orig, applied}
  var touchedAttr = new Map();   // Element  -> {attr: {orig, applied}}
  var touchedHtml = new Map();   // Element  -> {orig, applied}

  function has(obj, key) { return Object.prototype.hasOwnProperty.call(obj, key); }
  function norm(s) { return String(s).replace(/\s+/g, ' ').trim(); }

  function getSavedLang() {
    try { return localStorage.getItem(STORAGE_KEY) || 'en'; }
    catch (e) { return 'en'; }
  }
  function saveLang(l) {
    try { localStorage.setItem(STORAGE_KEY, l); } catch (e) { /* 忽略 */ }
  }

  function loadDict(lang) {
    var meta = LANGS[lang];
    return (meta && meta.dictName) ? (window[meta.dictName] || null) : null;
  }

  function compilePatterns(d) {
    var out = [];
    if (d && d.patterns) {
      for (var i = 0; i < d.patterns.length; i++) {
        try { out.push([new RegExp(d.patterns[i][0]), d.patterns[i][1]]); }
        catch (e) { /* 跳过坏正则 */ }
      }
    }
    return out;
  }

  /* 查词典：texts → attrs → patterns，都没有则返回 null（保持英文） */
  function translateString(s) {
    if (!s || !dict) return null;
    var key = norm(s);
    if (!key) return null;
    if (dict.texts && has(dict.texts, key)) return dict.texts[key];
    if (dict.attrs && has(dict.attrs, key)) return dict.attrs[key];
    for (var i = 0; i < patterns.length; i++) {
      if (patterns[i][0].test(key)) return key.replace(patterns[i][0], patterns[i][1]);
    }
    return null;
  }

  /* ── 文本节点 ── */
  function translateTextNode(node) {
    var prev = touchedText.get(node);
    if (prev && node.data === prev.applied) return;   // 已是我们写入的译文
    var orig = node.data;
    var hit = translateString(orig);
    if (hit == null || hit === norm(orig)) return;
    var lead = /^\s*/.exec(orig)[0];
    var trail = /\s*$/.exec(orig)[0];
    var applied = lead + hit + trail;                 // 保留首尾空白
    touchedText.set(node, { orig: orig, applied: applied });
    node.data = applied;
  }

  /* ── 元素属性 ── */
  function translateAttrs(el) {
    for (var i = 0; i < ATTRS.length; i++) {
      var a = ATTRS[i];
      if (!el.hasAttribute(a)) continue;
      var orig = el.getAttribute(a);
      var rec = touchedAttr.get(el);
      if (rec && rec[a] && orig === rec[a].applied) continue;
      var hit = translateString(orig);
      if (hit == null || hit === orig) continue;
      if (!rec) { rec = {}; touchedAttr.set(el, rec); }
      rec[a] = { orig: orig, applied: hit };
      el.setAttribute(a, hit);
    }
  }

  /* ── 按元素 id 的整段 innerHTML 覆盖 ── */
  function translateHtmlOverride(el) {
    if (!dict.html || !el.id || !has(dict.html, el.id)) return false;
    var prev = touchedHtml.get(el);
    if (prev && el.innerHTML === prev.applied) return true;
    var orig = el.innerHTML;
    el.innerHTML = dict.html[el.id];
    touchedHtml.set(el, { orig: orig, applied: el.innerHTML });
    return true;   // 整段译文已包含全部内容，不再深入子节点
  }

  function walk(node) {
    if (!node) return;
    if (node.nodeType === 3) { translateTextNode(node); return; }
    if (node.nodeType !== 1) return;
    var el = node;
    if (SKIP_TAGS[el.tagName]) return;
    if (el.hasAttribute('data-i18n-skip')) return;
    if (el.tagName === 'TEXTAREA') { translateAttrs(el); return; }  // 内容属于用户输入
    translateAttrs(el);
    if (translateHtmlOverride(el)) return;
    for (var c = el.firstChild; c; c = c.nextSibling) walk(c);
  }

  function restoreAll() {
    touchedText.forEach(function (r, n) {
      try { if (n.data === r.applied) n.data = r.orig; } catch (e) { /* 节点已移除 */ }
    });
    touchedText.clear();
    touchedAttr.forEach(function (attrs, el) {
      for (var a in attrs) {
        if (!has(attrs, a)) continue;
        try { if (el.getAttribute(a) === attrs[a].applied) el.setAttribute(a, attrs[a].orig); }
        catch (e) { /* 元素已移除 */ }
      }
    });
    touchedAttr.clear();
    touchedHtml.forEach(function (r, el) {
      try { if (el.innerHTML === r.applied) el.innerHTML = r.orig; } catch (e) { /* 元素已移除 */ }
    });
    touchedHtml.clear();
  }

  function startObserver() {
    if (observer || !document.body) return;
    observer = new MutationObserver(function (muts) {
      if (!dict) return;   // 英文模式下不干预
      for (var i = 0; i < muts.length; i++) {
        var m = muts[i];
        try {
          if (m.type === 'characterData') walk(m.target);
          else if (m.type === 'attributes') translateAttrs(m.target);
          else for (var j = 0; j < m.addedNodes.length; j++) walk(m.addedNodes[j]);
        } catch (e) { /* 单个节点失败不影响整体 */ }
      }
    });
    observer.observe(document.body, {
      childList: true, subtree: true, characterData: true,
      attributes: true, attributeFilter: ATTRS
    });
  }

  /* ── 设置面板里的语言下拉框 ── */
  function syncSelect() {
    var sel = document.getElementById('set-language');
    if (sel && sel.value !== current) sel.value = current;
  }
  function bindSelect() {
    var sel = document.getElementById('set-language');
    if (!sel || sel.__i18nBound) return;
    sel.__i18nBound = true;
    sel.addEventListener('change', function () { setLanguage(sel.value); });
  }

  /* ── 原生 confirm / alert ──
   * 原生对话框不属于 DOM，MutationObserver 够不到。中文模式下包装这两个
   * 函数：先把消息过一遍词典再弹出；英文模式恢复原引用。 */
  var nativeConfirm = window.confirm;
  var nativeAlert = window.alert;
  var dialogsWrapped = false;

  function wrapDialogs() {
    if (dialogsWrapped) return;
    dialogsWrapped = true;
    window.confirm = function (msg) {
      var hit = translateString(msg);
      return nativeConfirm.call(window, hit == null ? msg : hit);
    };
    window.alert = function (msg) {
      var hit = translateString(msg);
      nativeAlert.call(window, hit == null ? msg : hit);
    };
  }
  function unwrapDialogs() {
    if (!dialogsWrapped) return;
    dialogsWrapped = false;
    window.confirm = nativeConfirm;
    window.alert = nativeAlert;
  }

  function apply(lang) {
    current = lang;
    restoreAll();                       // 先整体还原为英文
    dict = (lang === 'en') ? null : loadDict(lang);
    patterns = compilePatterns(dict);
    if (dict) wrapDialogs(); else unwrapDialogs();
    if (dict && document.body) walk(document.body);
    syncSelect();
    startObserver();
  }

  function setLanguage(lang) {
    if (!LANGS[lang]) lang = 'en';
    saveLang(lang);
    apply(lang);
  }

  function init() {
    bindSelect();
    apply(getSavedLang());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* 对外接口：批次 3 翻译 JS 动态文案时会用到 t() */
  window.INGESTO_I18N = {
    setLanguage: setLanguage,
    getLanguage: function () { return current; },
    languages: LANGS,
    t: translateString
  };
})();
