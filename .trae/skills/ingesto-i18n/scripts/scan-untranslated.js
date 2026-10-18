#!/usr/bin/env node
/* ============================================================
 * ingesto 漏译扫描器（配合 ingesto-i18n 技能）
 * ------------------------------------------------------------
 * 以中文模式启动 Electron，遍历当前界面中「不含任何汉字、却含
 * 拉丁字母」的可见文本与可翻译属性，再剔除产品上明确保留英文
 * 的内容（模式名、算法名、品牌、模板变量、路径、文件名、数字
 * 单位等），输出疑似漏译候选清单。
 *
 * 用法：
 *   node scripts/scan-untranslated.js                     扫描主界面
 *   node scripts/scan-untranslated.js "showModesInfo()"   先执行 JS 再扫描
 *   PORT=9231 node scripts/scan-untranslated.js           换调试端口
 *
 * 注意：只能扫到「当前已渲染且可见」的界面。弹窗/设置面板/
 * Kiosk 需要先在参数里给一段打开它们的 JS，或多次运行。
 * 候选需人工复核——用户数据（卡名、磁盘名、备注）也会出现。
 * ============================================================ */
const { spawn } = require('child_process');
const path = require('path');

const PORT = process.env.PORT || '9231';
const CWD = path.resolve(__dirname, '..', '..', '..', '..');   // .trae/skills/ingesto-i18n/scripts → 项目根
const PRE_JS = process.argv[2] || '';
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
// 独立临时 profile：ingesto 是单实例应用，不另开 profile 时，只要用户的
// 开发实例在运行，新实例就会立刻退出、调试端口永远等不到。
const PROFILE = process.env.I18N_PROFILE || '/tmp/ingesto-i18n-scan-profile';

async function main() {
  const child = spawn('npx', ['electron', '.',
    `--remote-debugging-port=${PORT}`, `--user-data-dir=${PROFILE}`],
    { cwd: CWD, stdio: 'ignore', detached: true });
  const cleanup = () => { try { process.kill(-child.pid); } catch (e) {} };
  process.on('exit', cleanup);
  process.on('SIGINT', () => { cleanup(); process.exit(130); });

  let page = null;
  for (let i = 0; i < 40 && !page; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${PORT}/json/list`);
      page = (await r.json()).find(t => t.type === 'page');
    } catch (e) {}
    if (!page) await sleep(500);
  }
  if (!page) { console.error('FAIL: 找不到 Electron 页面目标（端口 ' + PORT + '）'); process.exit(1); }

  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
  let mid = 0;
  const pending = new Map();
  ws.onmessage = (ev) => {
    const m = JSON.parse(ev.data);
    if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
  };
  const evl = (expression) => new Promise((res) => {
    const id = ++mid;
    pending.set(id, (m) => {
      if (m.result && m.result.exceptionDetails) {
        const ed = m.result.exceptionDetails;
        res({ __cdpError: (ed.exception && (ed.exception.description || ed.exception.value)) || ed.text || 'evaluate error' });
      } else res(m.result && m.result.result ? m.result.result.value : undefined);
    });
    ws.send(JSON.stringify({ id, method: 'Runtime.evaluate',
      params: { expression, returnByValue: true, awaitPromise: true } }));
  });

  let ready = false;
  for (let i = 0; i < 20 && !ready; i++) {
    ready = (await evl('!!window.INGESTO_I18N')) === true;
    if (!ready) await sleep(500);
  }
  if (!ready) { console.error('FAIL: i18n 引擎未加载'); cleanup(); process.exit(1); }

  await evl("INGESTO_I18N.setLanguage('zh-CN')");
  await sleep(400);
  if (PRE_JS) { await evl(PRE_JS); await sleep(500); }

  const report = await evl(`(function(){
    try {
    var SKIP = {SCRIPT:1,STYLE:1,NOSCRIPT:1,IFRAME:1,OBJECT:1};
    var ATTRS = ['title','placeholder','aria-label','data-tip','data-ph'];
    var CJK = /[\\u3400-\\u9fff\\uf900-\\ufaff]/;
    var LAT = /[A-Za-z]{2,}/;
    // 产品上明确保留英文的内容
    var KEEP = [
      /^[0-9\\s.,:;+\\-–—→·…%\\/()|]+$/,                              // 纯数字/符号
      /\\{[a-zA-Z_][a-zA-Z0-9_]*\\}/,                                     // 模板变量 {counter}
      /^(FAST|SIZE CHECK|SECURE|PRO|KIOSK)$/i,                            // 模式名
      /\\b(xxHash(64|128)?|MD5|ASC MHL|MHL)\\b/i,                          // 算法/标准名
      /^(ingesto|Just Edit|TeraCopy|Silverstack|YoYotta|OffShoot|ntfy|Finder|ShotPut Pro)$/i, // 品牌/工具
      /^(JSON|PIN|URL|HTML|CSV|MHL|ETA|OK|Aa|MD|HTTP|SMB|NFS|USB|SSD|HDD)$/, // 通用缩写/界面符号
      /^[A-Z0-9_.-]+\\.(xxh|md5|mhl|html?|csv|json|txt|log|md|app)$/i,     // 文件名
      /^INGESTO[_a-zA-Z]*/,                                               // INGESTO_report 等
      /^[~\\/]|[A-Za-z]:\\\\|^https?:\\/\\//,                              // 路径/URL
      /^var\\(--/,                                                        // CSS 变量
      /^[A-Z]{2,}\\d*$/,                                                  // CARD1、CLOG3、SLOG3 等编号/配置缩写
      /^[0-9.,]+\\s?(B|KB|MB|GB|TB|MB\\/s|GB\\/s|ms|s|min|h|fps|%|×|x)$/i,   // 数字单位
      /^#[0-9A-Fa-f]{3,8}$/,                                              // 颜色值
      /^[a-z0-9+.-]+\\.(local|lan|com|net|org)$/i,                        // 主机名
      /(^|\.)just-edit\.fr$/i,                                           // 品牌网址
      /^ascmhl$/i,                                                       // ASC MHL 目录名/命令名
      /^(xxhsum|md5sum|shasum|ascmhl)\b/i,                               // 终端命令
      /^(Sony|Canon|Panasonic|Fujifilm|Blackmagic|DJI|ARRI|RED|Nikon|Leica|Sigma|Insta360|Samsung|Apple|Z CAM)( \\/ (Sony|Canon|Panasonic|Fujifilm|Blackmagic|DJI|ARRI|RED|Nikon))?$/, // 摄影机品牌（PP 菜单分组头）
    ];
    // 整棵子树跳过的选择器：图像配置菜单项全是品牌/Log 配置专名，产品上保留英文
    var SKIP_SEL = ['.pp-menu .pp-it'];
    function kept(s){ return KEEP.some(function(r){ return r.test(s); }); }
    function visible(el){
      if(!el || el.nodeType !== 1) return false;
      var r = el.getBoundingClientRect();
      if(r.width === 0 && r.height === 0) return false;
      var st = getComputedStyle(el);
      return st.visibility !== 'hidden' && st.display !== 'none' && st.opacity !== '0';
    }
    function sel(el){
      if(el.id) return '#' + el.id;
      var c = (el.className && typeof el.className === 'string')
        ? '.' + el.className.trim().split(/\\s+/).slice(0,2).join('.') : '';
      return el.tagName.toLowerCase() + c;
    }
    var texts = [], attrs = [], seenT = {}, seenA = {};
    function consider(s){
      s = String(s).replace(/\\s+/g,' ').trim();
      if(s.length < 2 || s.length > 300) return false;
      if(CJK.test(s)) return false;           // 已译（译文可夹带保留英文）
      if(!LAT.test(s)) return false;
      if(kept(s)) return false;
      return true;
    }
    function walk(n){
      if(n.nodeType === 3){
        var s = n.nodeValue;
        if(consider(s) && visible(n.parentElement)){
          var k = s + ' @ ' + sel(n.parentElement);
          if(!seenT[k]){ seenT[k]=1; texts.push({text:s, at:sel(n.parentElement)}); }
        }
        return;
      }
      if(n.nodeType !== 1) return;
      var el = n;
      if(SKIP[el.tagName]) return;
      if(el.hasAttribute && el.hasAttribute('data-i18n-skip')) return;
      if(el.matches && SKIP_SEL.some(function(s){ return el.matches(s); })) return;
      if(visible(el)){
        ATTRS.forEach(function(a){
          if(!el.hasAttribute || !el.hasAttribute(a)) return;
          var v = el.getAttribute(a);
          if(consider(v)){
            var k = a + ':' + v + ' @ ' + sel(el);
            if(!seenA[k]){ seenA[k]=1; attrs.push({attr:a, text:v, at:sel(el)}); }
          }
        });
      }
      // 隐藏元素的属性也有价值（如未打开面板里的静态 title），照常下钻；
      // 文本只报可见的，避免未渲染状态噪音
      for(var c = el.firstChild; c; c = c.nextSibling) walk(c);
    }
    walk(document.body);
    return {texts:texts, attrs:attrs};
    } catch(e) { return {__err: String(e && e.stack || e)}; }
  })()`);

  if (!report || report.__err || report.__cdpError) {
    console.error('扫描表达式执行失败：\n' + (report && (report.__err || report.__cdpError)));
    cleanup();
    process.exit(1);
  }

  const lines = [];
  if (report.texts.length === 0 && report.attrs.length === 0) {
    console.log('未发现疑似漏译（当前界面）。');
  } else {
    if (report.texts.length) {
      console.log('── 文本节点 ' + report.texts.length + ' 条 ──');
      report.texts.forEach(r => console.log('  ' + JSON.stringify(r.text) + '   @ ' + r.at));
    }
    if (report.attrs.length) {
      console.log('── 属性 ' + report.attrs.length + ' 条 ──');
      report.attrs.forEach(r => console.log('  [' + r.attr + '] ' + JSON.stringify(r.text) + '   @ ' + r.at));
    }
    console.log('\n提示：候选可能含用户数据（卡名、磁盘名、已填备注）；');
    console.log('弹窗/设置/Kiosk 需先打开再扫，例如：node scripts/scan-untranslated.js "openSettings()"');
  }
  cleanup();
  process.exit(report.texts.length || report.attrs.length ? 2 : 0);
}
main().catch(e => { console.error(e); process.exit(1); });
