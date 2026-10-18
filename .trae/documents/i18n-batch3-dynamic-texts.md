# 批次 3：JS 动态文案汉化计划

## Context

ingesto 界面汉化分 4 批。批次 1（i18n 引擎 + 设置语言切换 + 主界面静态文案）与批次 2（全部静态弹窗 + Kiosk）已提交。本批（3/4）处理 `src/renderer/index.html` 内联脚本在**运行时动态写入 DOM** 的英文文案（约 200 条）：状态栏、总结窗口、校验结果、Toast、引擎拒绝弹窗、Kiosk 结果屏等。目标：切到简体中文时这些动态内容同样显示中文；English 模式零影响；不改任何功能逻辑。

机制不变：i18n.js 的 MutationObserver 会捕获动态插入的节点并走词典翻译，所以绝大多数动态文案**只需往 zh-CN.js 加词条**，不用动 index.html。

## 修改文件

1. **src/renderer/lang/zh-CN.js** — 新增约 200 词条（主体工作）
2. **src/renderer/i18n.js** — 唯一一处增强：包装 `window.confirm` / `window.alert`（L6135「清空历史」用的是原生确认框，DOM 捕获不到；中文模式下先把消息翻译再弹出，切回英文时恢复原函数）
3. **index.html 不修改**

## 词条清单（按区域，键 = 逐字英文原文）

### A. 状态栏 / 按钮动态文本 → texts + 少量 patterns
- 刷新按钮：`Scanning…` / `Refresh`
- h-title：`Verifying` / `Double source read` / `Canceling` / `Re-copying failed files`；`Checks Remaining`
- 按钮：`COPIED` / `COPY FAILED` / `EJECTED` / `Load a card` / `Choose a destination` / `Resume`（`Pause`/`Cancel`/`Start Ingest` 已有）
- Kiosk 阶段：`Copying…` / `Verifying…` / `Double source read…` / `Canceling…`；pattern `^Card (\d+) of (\d+) · (.+)$`
- PIN：`Confirm PIN` / `Set a 4-digit PIN` / `PIN mismatch. Start again` / `Too many attempts. Wait a moment` / `Too many attempts. Locked for 30s` / `Wrong PIN`
- `Browse a card…` / `selected` / `Dismiss`

### B. 总结窗口 sum-ov（最大的一块）
- 标题行（含可选后缀 ` & SIZE-CHECKED` / ` & VERIFIED`，NBSP 已被引擎规范化）：patterns `^(\d+) FILES? RE-COPIED( & (SIZE-CHECKED|VERIFIED))?$`、`^(\d+) NEW FILES? COPIED…`、`^(\d+) OF (\d+) FILES COPIED…`、`^ALL FILES COPIED…`；`NO MANIFEST WRITTEN`
- failureVerdict 全部静态标题/lead（约 25 条）+ patterns：`^(\d+) FILES? DID NOT SURVIVE$`、`^THE COPY TO (\d+) DRIVES$`、`^THE COPY TO (.+)$`、`^(.+) WAS NOT STARTED$`、`^(\d+) CARDS WERE NOT STARTED$`、`^ALL (\d+) FILES$`
- 网格标签：`Mode`/`Files`/`Total size`/`Copy`/`Verify`/`2nd read`/`Total`/`Avg speed`/`Not copied`；`+ DOUBLE READ`；caveat `not verified`/`content not verified`
- patterns：`^(\d+) files? already verified on this destination, left out on purpose$`、`^(\d+) cards$`、`^(\d+) files?$`、`^(\d+) drives$`、`^(\d+) cards · (.+)$`、`^(\d+) hidden, show again$`
- 按钮：`REVEAL` / `EJECT` / `EJECT ALL`
- 备注 s-notes：CV-11/12/13、SIDECAR、NTFY（renderer）+ CV-8/9/10（main.js 引擎备注，经 renderSummaryNotes 进 DOM）——静态 texts + 含名 patterns（`^(.+) did not report back\.$`、`^This card already held a file called (.+)\.$` 等）
- 冷校验提示（#s-coldverify）：两段主体静态长键；footnote 两变体，含动态 ms 的用 pattern `^Test: an 8 MB read … took ([\d.]+) ms, against ([\d.]+) ms …$`
- 失败分组 buildFailureGroups：9 组 what/why 全静态 texts + humanErrno 10 条 + `On the card.`/`On the destination.`/`The files below were copied but could not be read back and checked.`/`The files below were not copied.` + `(the card could not be listed completely)`；计数 pattern `^(\d+) (file|card|folder)s?$`
- redoDoubleRead：`⟳ Unmounting and re-reading…` / `⟳ Check the card for real` + 三种结果 patterns（含数字/速度/文件名）；失败原因段片段键（注意原文 `do not format it. and check` 小写 and 照抄）

### C. 引擎拒绝弹窗 #pf-ov（PF-E1..E9 + PF-R11b + fallback）
- 标题逐行 texts/patterns：`^(.+) disappeared$`、`^(\w+) levels of folders$` 等
- cause/action 含 `<span class="m">{counter}</span>` 内联标签 → 拆片段键（标签内模板变量不动）；片段逐一抄准（如 `The template gives card` / `no folder of its own. Every card would land side by side in` / `, each one overwriting the last.`）
- 按钮：`CANCEL`/`EDIT TEMPLATE`/`RECHECK DRIVES`/`REMOVE DESTINATION`/`OPEN FILE FILTER`/`CHANGE COUNTER`/`REVEAL FOLDER`
- lead `Nothing has been written.`（多处分支复用同一键）
- `<span class="g">green</span>` 中可见词 `green` → `绿色`（纯文本节点，不影响样式）

### D. 校验文件夹结果 verify-result-ov
- 标题：`NOTHING TO VERIFY HERE`/`THIS MANIFEST LISTS NOTHING`/`VERIFICATION STOPPED`/`ALL FILES VERIFIED`/`ALL LISTED FILES VERIFIED`/`VERIFICATION FAILED`
- 网格：`Checked`/`Matched`/`Corrupted`/`Missing`/`No good copy`
- 列表头与标签：`Files this folder is missing a good copy of`/`Corrupted / missing files`；`copy interrupted`/`failed verification`/`hash mismatch`/`missing`（vf-tag 小写键，与 Missing 大写区分）
- pattern `^(\d+) files? in this folder (are|is) not in the manifest$`；说明段按 `<b>` 拆片段键；vf-skip 段；`Copy these from the card again.`

### E. 导入历史 session log
- `Nothing has been ingested on these destinations yet.`；`Show it again`；pattern `^History cleared(.+)\. The reports on the drives are untouched\.$`（日期段原样保留）
- 徽章：`FAILED`/`SUSPECT`/`VERIFIED`
- attrs patterns：`^Details of (.+)$`、`^Reveal (.+) on the destination$`、`Reveal on the destination`
- sessDetails 标签：`DATE`/`FILES`/`SIZE`/`DURATION`/`COPY SPEED`/`MODE`/`PHASES`/`DESTINATIONS`/`OPERATOR · CAMERA · PROFILE`/`NOTE`/`RESULT`
- phases 行三种组合 patterns：`^copy (.+) · verify (.+) · source re-read (.+)$` 等

### F. Toast（#ingesto-toast 文本节点，Observer 可捕获）
约 20 条静态 texts（`Settings exported.`/`Templates imported.`/`No report on these destinations yet.` 等）+ patterns：`^Ejecting (.+)…$`、`^(.+) ejected\. Safe to remove\.(.*)$`、`^Could not eject (.+)(.*)\. A file may still be open\. Eject it from the Finder\.$`、`^⚠ "(.+)" is already used as (a DESTINATION|a SOURCE)\..*$`、`^Card "(.+)" has a tracking log.*$`、`^Will copy all (\d+) files? on "(.+)"\.$`、`^Files already verified … for "(.+)", …$`、`^(.+) could not be ejected\. Eject it from the Finder\.$`、`^The ingest report could not be written to "(.+)" \((.+)\)\..*$`、`^The ingest could not be completed: (.*)$`（异常 message 保留英文）、L2548/L3068/L3198/L8344 全句（执行时逐字抄准）

### G. 设置面板动态
- 命令输出：`Enter a command first.`/`That command cannot be read.`/`Running...`/`Ran, and the document was kept for you.`/pattern `^Did not run: (.*)$`
- ntfy：`Enter a topic first.`/`Sending…`/`✓ Sent. Check your phone.`/pattern `^✗ Failed(.*)$`
- rf-full-note 两分支（L7420，执行时抄准）
- 文件过滤器：类别名 `VIDEO`/`AUDIO`/`PICTURES`/`OTHERS` → `视频`/`音频`/`图片`/`其他`；attrs patterns `^Copy every (.+) file$`、`^Copy ([A-Z0-9]+) files$`
- 更新提示：`New version available`、pattern `^INGESTO v(.+) is available\. You're on v(.+)\.$`、`Later`/`Get it`

### H. 原生 confirm/alert（i18n.js 增强，约 15 行）
- apply() 中：中文模式包装 window.confirm/alert —— 先 `translateString(message)`（norm 会折叠 `\n`，词典键用空格版）再调原函数并记录原引用；英文模式恢复
- 词典键：`Clear the ingest history? The lines are only hidden in ingesto. The reports on the drives are kept, untouched.`

### I. 杂项
- `CAMERA`（L3701 markForced 拼接的大写标签；svg 在 SKIP_TAGS 内安全）

## 明确不翻译
- console.* / throw 的 Error message；报告文件内容（HTML/CSV/JSON/MHL）；发给手机的 ntfy 通知正文（main.js）
- `{counter}` 等模板变量、模式名（FAST/SIZE CHECK/SECURE/PRO）、算法名、路径、驱动器名、扩展名大写（MOV/MP4…）
- 纯数字与 fmtSize/fmtSpd/fmtEta 输出（`1.2 GB`、`3m25s` 原样）

## 验证
1. `node --check src/renderer/lang/zh-CN.js && node --check src/renderer/i18n.js`
2. `npm test`（现有 29 项全绿）
3. 扩展 `/tmp/i18n-verify.js` 加批次 3 检查（CDP 驱动）：updateBtn 无卡态按钮、showVerifyResult 两分支、showToast、kioskShowResult、showUpdateNotice、confirm 包装与消息翻译、双语切换还原
4. 词典键冲突人工过一遍：短键 `Copy`/`Verify`/`Total`/`Mode`/`Files` 与静态界面同义，全局翻译可接受；`green`、`selected` 确认无误伤
5. patterns 排序：具体在前，宽泛（`^(\d+) files?$`）在后
6. `git add` 仅 zh-CN.js、i18n.js（**不 stage README.md**），commit：`feat(i18n): 汉化 JS 动态文案（批次 3/4）`

## 风险与对策
- 片段键误匹配 → 片段键保持 ≥4 个词，执行时 grep 查重
- 动态文本含 NBSP/换行 → 引擎 norm 已折叠，键用普通空格
- Kiosk `kr-sub` 多行由 `<br>` 分隔 → 每行独立文本节点，逐行翻译即可
