---
name: ingesto-i18n
description: ingesto 汉化维护。当需要查找或修复渲染进程界面漏译、向 zh-CN 词典添加词条、或在 Electron 界面中回归中文翻译时使用。
---

# ingesto 汉化维护技能

维护 ingesto（Electron，单文件 `src/renderer/index.html` 约 553KB）的简体中文翻译。

## 边界（先读）

- **只译渲染进程 UI**：窗口里所有用户可见文字。
- **不译**：`src/main/*.js` 生成的报告文件内容（HTML/CSV/JSON/MHL）、系统通知、模板变量、模式名、算法名、品牌名、路径/URL/文件名。
- **不改功能逻辑**：只动词典 [zh-CN.js](file:///Users/buxiangze/Documents/justedit%20Project/ingesto/src/renderer/lang/zh-CN.js)、引擎 [i18n.js](file:///Users/buxiangze/Documents/justedit%20Project/ingesto/src/renderer/i18n.js) 与本技能文件；`index.html` 原则上只在确有必要时改（引擎已能覆盖绝大多数场景）。

## 架构

- [i18n.js](file:///Users/buxiangze/Documents/justedit%20Project/ingesto/src/renderer/i18n.js)：翻译引擎，在 index.html 末尾之前加载。
  - 可翻译属性 `ATTRS = title / placeholder / aria-label / data-tip / data-ph`。
  - 查词顺序：**texts → attrs → patterns**；属性查词时先查 attrs 再兜底查 texts。
  - MutationObserver 跟进所有动态内容（innerHTML 重建、textContent 赋值、属性变更）。
  - 已包装 `window.confirm/alert`；切回英文时用 touchedText/touchedAttr/touchedHtml 按记录精确还原。
  - 对外 `window.INGESTO_I18N = { setLanguage, getLanguage, languages, t }`。
  - SVG **不**跳过：只改白名单属性和文本节点，所以图标 `<title>`（如 in use）可译、`path d` 等几何属性不受影响。
- **语言持久化是双源结构**（2026-10 修复）：localStorage（`ingesto-language`）只作启动早期的**同步缓存**，让 DOMContentLoaded 时无闪烁应用；`ingesto-prefs.json` 的 `language` 字段才是**权威源**，随 `persistPrefsNow()` 与其他设置一起由主进程同步写盘。boot 在 `loadPrefs()` 后校准：两者不一致时以 prefs 为准调 `setLanguage`（同时回写 localStorage）。下拉 change 时引擎除写 localStorage 外还调 `window.persistPrefs()`（函数可能不存在，必须容错）。排查"语言重启回退"先看 prefs.json 有没有 `language` 字段，不要只看 localStorage 的 leveldb（strings 能看到历史旧值，会误导）。
- **首次启动按系统语言探测**（`detectSystemLang`）：`getSavedLang()` 在 localStorage 无值时读 `navigator.language`，`/^zh/` 开头（简体/繁体都算）→ `zh-CN`，其他 → `en`，并当场 `saveLang` 固化。只在从未选过语言时触发；用户已有 localStorage 或 prefs 值时不参与。验证方法：Electron `--lang=fr-FR` 命令行参数可进程级模拟系统语言（渲染进程 `navigator.language` 随之变化），比 CDP 注入 override 可靠（后者赶不上首次加载前的引擎初始化）。
- [zh-CN.js](file:///Users/buxiangze/Documents/justedit%20Project/ingesto/src/renderer/lang/zh-CN.js)：词典，四个区：
  - `texts`：静态/完整句文本（也兜底属性）。
  - `attrs`：属性专用译文。
  - `patterns`：`[正则字符串, 带 $1 的模板]`，处理含变量的动态文本。
  - `html`：按元素 id 整段覆盖 innerHTML，**仅用于被 `<b>` 等内联标签拆散、碎片翻译会不通顺的长句**（如 mif-size、set-hint-handoff）。

## 添加词条的规则

1. 先在 index.html 里 Grep 英文原文，确认它出现的位置、是文本节点还是属性、是否含动态变量。
2. 按类型放对应区：
   - 固定文案 → `texts`；固定属性文案 → `attrs`（或直接 texts 兜底）。
   - 含变量（数字、卡名、容量、时间）→ `patterns`，变量段用 `(.+)` / `(\d+)` / `([\d.]+ [KMGT]?B)` 等捕获。
   - 长句被内联标签拆碎 → 考虑 `html` 整段覆盖。
3. **短键先验证唯一性**：加 "None"、"Other"、"free." 这种短碎片前，先 Grep 确认没有第二个语境会误伤。
4. **patterns 顺序敏感**：宽泛规则（`^(.+) ...$`）必须排在具体规则之后，否则会先吃掉本该精确匹配的句子。
5. 碎片翻译注意空格：引擎 norm() 折叠空白查词、应用时保留原节点首尾空格。中文碎片后接拉丁变量（如 "500 GB 可用"）空格无害；中文标点前出现空格则不通顺，必要时调整原文节点边界或用 html 覆盖。
6. 改完 `node --check src/renderer/lang/zh-CN.js src/renderer/i18n.js`。

## 保留英文（不得翻译，扫描器白名单同理）

- 变量：`{counter}` `{cardname}` `{pp}` 等花括号占位。
- 模式名：FAST / SIZE CHECK / SECURE / PRO / KIOSK；kiosk 作为模式名也保留。
- 算法/标准：xxHash64、xxHash128、MD5、ASC MHL、MHL、ascmhl（目录/命令名）。
- 品牌/工具：ingesto、Just Edit、just-edit.fr、TeraCopy、Silverstack、YoYotta、OffShoot、ntfy、Finder、各摄影机品牌（Sony、Canon、ARRI、DJI 等）及 Log 配置专名（S-Log3、Rec.709、CLOG3 等）。
- 路径、URL、文件名、报告内容、系统通知、终端命令（xxhsum -c 等）。

## 术语表（新词条必须沿用）

| 英文 | 中文 |
|---|---|
| copy（文件复制） | 拷贝 |
| copy（剪贴板，如 COPY LIST） | 复制 |
| verify | 校验 |
| Double source read / 2nd read / source re-read | 双重读取（禁用"二次读取/重读"） |
| checksum list / manifest | 校验和列表 |
| destination | 目标位置 |
| card | 存储卡 |
| counter | 计数器 |
| picture profile | 图像配置 |
| ETA | 预计剩余 |
| Browse a card | 选择存储卡 |
| reset counter | 重置计数器 |
| preset / template | 模板 |
| free space / N free | 可用空间 / N 可用 |
| None（空值） | 无 |
| empty（空槽） | 空 |
| CONTINUE ANYWAY | 仍然继续 |

## 漏译扫描与回归（标准流程）

脚本：[scan-untranslated.js](file:///Users/buxiangze/Documents/justedit%20Project/ingesto/.trae/skills/ingesto-i18n/scripts/scan-untranslated.js)

```bash
node .trae/skills/ingesto-i18n/scripts/scan-untranslated.js                # 扫主界面
node .trae/skills/ingesto-i18n/scripts/scan-untranslated.js "openSettings()"   # 先打开某界面再扫
PORT=9232 node .trae/skills/ingesto-i18n/scripts/scan-untranslated.js      # 换端口
```

- 自动以独立 profile 启动 Electron、切 zh-CN、CDP 遍历可见文本节点（含拉丁字母、无汉字）和五类属性，经 KEEP 白名单过滤后输出候选。
- 退出码：0 干净；2 有候选（含用户数据噪音）；1 启动/执行失败。
- **只能扫当前已渲染界面**。弹窗、设置、菜单必须多次运行并传打开界面的 PRE_JS。常用 PRE_JS：
  - 设置：`openSettings()`
  - 模式说明：`showModesInfo()`
  - 图像配置菜单：`var m=ppMenuEl();m.classList.add('open');m.style.left='100px';m.style.top='100px'`
  - Kiosk PIN：`kioskOpenPin('enter')`、`kioskOpenPin('set')`（两态副文不同）
  - 模板右键菜单：`slotRightClick({preventDefault(){},stopPropagation(){},clientX:420,clientY:420},0)`
- 候选需人工复核：卡名、磁盘名（div.vc-name）、备注、摄影师姓名等**用户数据**永远在列，不译。
- 扫描器维护：确认某类候选产品上永远保留英文时，把正则加进脚本的 KEEP（整棵子树用 SKIP_SEL，如 `.pp-menu .pp-it`）。**CDP 注入代码是 JS 模板字符串，正则里的斜杠必须双写成 `\\/`**，裸 `/` 会让浏览器正则提前终止（报 Unterminated group）。
- 扫描器有单实例防护：固定 `--user-data-dir=/tmp/ingesto-i18n-scan-profile`，与用户常驻的开发实例共存。不要去掉它。

运行中界面（拷贝进度、校验、toast、PF 拒绝弹窗）无法用扫描器稳定触发：在 index.html 里 Grep 对应文案加词条后，用 `INGESTO_I18N.t('原文')` 在 DevTools 控制台抽查译文，或构造相同 DOM 状态手测。

## 完成前检查

1. `node --check` 两个引擎文件。
2. 扫描器对改动界面清零（用户数据噪音除外）。
3. `npm test` 全部通过（当前 31 项；测试链不含 i18n 专项，勿改 package.json）。
4. 切回 English 抽查改动处能精确还原。

## 提交

- 提交信息用中文 conventional commit（如 `fix(i18n): 补译模板槽位与空间不足弹窗`）。
- **不要 `git add -A`，不要 stage 用户自己改的 README.md/ETAT_PROJET.md**（用户在跟踪 fork 的上游文档）；只显式 add 本次改的文件。
- 不主动提交、不推送；先报告改动，等用户明确同意。
- 版本号不动：bump 只能由用户确认（见仓库 AGENTS.md）。
