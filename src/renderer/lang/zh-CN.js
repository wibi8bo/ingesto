/* ============================================================
 * ingesto 简体中文词典
 * ------------------------------------------------------------
 * 键 = 软件界面的原始英文文本（精确匹配，首尾空白不计）。
 * 值 = 中文译文。词典里查不到的条目保持英文显示。
 *
 * 分区说明：
 *   texts    界面上的文本（标题、按钮、说明、菜单项……）
 *   attrs    只出现在 title / placeholder / aria-label / data-tip
 *            属性里的文本（与 texts 重复的条目不必再写，引擎会
 *            自动到 texts 里查找）
 *   patterns 动态文本：[正则, 模板]，模板里 $1..$9 为捕获组
 *   html     按元素 id 整段替换 innerHTML（译文需自带与原结构
 *            等价的标签；花括号 {xxx} 模板变量一律保留原文）
 * ============================================================ */
window.INGESTO_LANG_ZH_CN = {

  texts: {
    /* ── 左栏：来源 ── */
    "Sources": "来源",
    "Drop your card here": "将存储卡拖到这里",
    "+ Browse": "+ 浏览",
    "Loaded Cards": "已加载的卡",
    "Copy Info": "拍摄信息",
    "Operator": "摄影师",
    "Camera": "摄影机",
    "Profile": "图像配置",
    "Picture profile": "图像配置",
    "Notes": "备注",
    "Shooting notes, lens info, location…": "拍摄备注、镜头信息、地点……",
    "Counter": "计数器",
    "Auto": "自动",

    /* ── 中栏：磁盘与传输 ── */
    "Mounted Volumes": "已挂载的磁盘",
    "HIDE SYSTEM": "隐藏系统盘",
    "HIDE NETWORK": "隐藏网络盘",
    "Loading volumes…": "正在加载磁盘……",
    "INGEST QUEUE": "导入队列",
    "Copying": "正在拷贝",
    "Files Remaining": "剩余文件数",
    "Data Remaining": "剩余数据量",
    "Speed": "速度",
    "Errors": "错误",
    "INGEST HISTORY": "导入历史",
    "Open the report": "打开报告",
    "Read back from the reports written on the destinations, so it survives a restart.": "从目标位置上写入的报告中读回，因此重启后仍然保留。",

    /* ── 拷贝模式（模式名 FAST / SIZE CHECK / SECURE / PRO 保留英文） ── */
    "Copy Mode": "拷贝模式",
    "Copy mode": "拷贝模式",
    "Selected": "已选择",
    "Copy only, no checks": "仅拷贝，不做任何校验",
    "Detects incomplete copies, not corruption": "可检测拷贝不完整，无法检测数据损坏",
    "Detects any data corruption (xxHash)": "可检测任何数据损坏（xxHash）",
    "Secure + checksum lists": "安全拷贝 + 校验和列表",
    "Double source read": "源卡双重读取",

    /* ── 右栏：目标位置与命名模板 ── */
    "Destinations": "目标位置",
    "Drop your destinations here": "将目标位置拖到这里",
    "Folder Structure": "文件夹结构",
    "Insert": "插入",
    "THE CARD": "存储卡",
    "Card name": "卡名",
    "TYPED BY YOU": "手动输入",
    "Custom text…": "自定义文本……",
    "SEPARATORS": "分隔符",
    "Underscore": "下划线",
    "Hyphen": "连字符",
    "THE DATE": "日期",
    "Year, 2 digits": "年份（2 位）",
    "Year, 4 digits": "年份（4 位）",
    "Month": "月",
    "Day": "日",
    "Hour": "时",
    "Minute": "分",
    "Templates": "模板",
    "Starts a subfolder : everything after / is the card's own folder.": "开始一个子文件夹：/ 之后的部分属于卡自身的文件夹。",

    /* ── 底部操作 ── */
    "Pause": "暂停",
    "Start Ingest": "开始导入",
    "↻ Re-copy failed files": "↻ 重新拷贝失败的文件",
    "DONE": "完成",
    "Done": "完成",

    /* ── 设置面板 ── */
    "Settings": "设置",
    "Language": "语言",
    "Choose the interface language.": "选择界面语言。",
    "Card Tracking": "存储卡追踪",
    "Card tracking": "存储卡追踪",
    "Writes a small tag on the source card to detect it wasn't reformatted between two ingests.": "在源卡上写入一个小标记，用于检测两次导入之间卡是否被格式化过。",
    "Write Checksum": "写入校验和",
    "Writes the checksum list to the destination (SECURE and PRO mode only)": "将校验和列表写入目标位置（仅 SECURE 和 PRO 模式）",
    "Checksum list": "校验和列表",
    "· .xxh/.md5, re-checkable in TeraCopy": "· .xxh/.md5，可在 TeraCopy 中重新校验",
    "MHL manifest": "MHL 清单",
    "· Silverstack, YoYotta, OffShoot (PRO, MD5 or xxHash64 only)": "· Silverstack、YoYotta、OffShoot（仅 PRO，且 MD5 或 xxHash64）",
    "· the newer standard, in an": "· 较新的标准，保存在",
    "folder. Works with every algorithm": "文件夹中。适用于所有校验算法",
    "Ingest Report": "导入报告",
    "Ingest report": "导入报告",
    "Writes an ingest report to the destination": "将导入报告写入目标位置",
    "Full report": "完整报告",
    "· list every ingested file": "· 列出每个已导入的文件",
    "· to read and print": "· 便于阅读和打印",
    "· for spreadsheets": "· 用于电子表格",
    "· for tools and scripts": "· 用于工具和脚本",
    "File Filter": "文件过滤",
    "File filter": "文件过滤",
    "Filter which source file types get ingested. Resets to off at every launch, format choices are saved": "过滤要导入的源文件类型。每次启动时重置为关闭，格式选择会被保存",
    "Copy empty folders": "拷贝空文件夹",
    "Reorganize files on destination: /VIDEO, /AUDIO, /PICTURES. Others never copied": "在目标位置按 /VIDEO、/AUDIO、/PICTURES 重组文件，其他类型不拷贝",
    "Phone Notifications (ntfy)": "手机通知（ntfy）",
    "Send a notification to your phone after ingest.": "导入完成后向你的手机发送通知。",
    "Server": "服务器",
    "Topic": "主题",
    "Scan to install the ntfy app": "扫码安装 ntfy 应用",
    "Point your phone camera at the code: it opens": "用手机摄像头对准二维码：它会打开",
    ", where the free app is available for iPhone and Android.": "，可在那里免费下载 iPhone 和 Android 版应用。",
    "Then open the app and subscribe to the topic above. Pick a long, hard-to-guess topic name: on the public server it is the only thing protecting your notifications.": "然后在应用中订阅上面填写的主题。主题名要取长且难猜的：在公共服务器上，它是保护你通知的唯一屏障。",
    "Send test notification": "发送测试通知",
    "Post-Ingest Command": "导入后命令",
    "Runs a shell command after ingest": "导入完成后运行一条 shell 命令",
    "Command": "命令",
    "(command to run)": "（要运行的命令）",
    "Card Handoff": "存储卡交接",
    "Hands each card, one at a time, to a script of yours": "将每张卡依次交给你的脚本处理",
    "Dry run": "试运行",
    "Settings File": "设置文件",
    "Share ingesto settings with another machine / user.": "与其他机器 / 用户共享 ingesto 设置。",
    "Included in export / applied on import:": "导出时包含 / 导入时应用：",
    "Current naming template": "当前命名模板",
    "Saved templates": "已保存的模板",
    "Write checksum (incl. settings)": "写入校验和（含设置）",
    "Ingest report (incl. settings)": "导入报告（含设置）",
    "File filter (incl. settings)": "文件过滤（含设置）",
    "Export settings…": "导出设置……",
    "Import settings…": "导入设置……",
    "Give this template a name (optional)": "给这个模板起个名字（可选）",
    "VIEW": "查看",

    /* ── 保存模板弹窗 / 模板右键菜单 ── */
    "Template name…": "模板名称……",
    "Cancel": "取消",
    "Save": "保存",
    "Load template": "加载模板",
    "Save template": "保存模板",
    "Delete template": "删除模板",

    /* ── 模式说明弹窗（模式名与算法名保留英文） ── */
    "Copy verification modes": "拷贝校验模式",
    "How INGESTO checks your footage after copying each card.": "INGESTO 在拷贝完每张卡之后，如何校验你的素材。",
    "Copy only, no verification.": "仅拷贝，不校验。",
    "Files are written to the destination and nothing is checked afterwards. Fastest, but a silent transfer error or a truncated file would go unnoticed. Use only for throwaway or non-critical material, or a second redundant copy you'll verify elsewhere.": "文件写入目标位置后不做任何检查。速度最快，但静默的传输错误或文件截断会被忽略。仅用于一次性或不重要的素材，或你会在别处校验的第二份冗余拷贝。",
    "Copy + size check.": "拷贝 + 大小检查。",
    "Copy + xxHash content check.": "拷贝 + xxHash 内容校验。",
    "INGESTO computes a 64-bit xxHash fingerprint of the source and of the written copy and compares them. Detects any data corruption down to a single flipped bit. This is the broadcast/archive-grade mode (same family of checks as Silverstack / YoYotta). Slower, because it reads every file back, and noticeably so on cards with thousands of tiny files.": "INGESTO 为源文件和写入的拷贝分别计算 64 位 xxHash 指纹并进行比较。可检测任何数据损坏，精确到单个比特翻转。这是广播/存档级别的模式（与 Silverstack / YoYotta 同一类校验）。速度较慢，因为它要回读每个文件，在包含数千个小文件的卡上尤为明显。",
    "Copy + checksum content check + checksum list.": "拷贝 + 校验和内容校验 + 校验和列表。",
    "Does everything SECURE does, using the algorithm you pick (": "完成 SECURE 的所有工作，使用你选择的算法（",
    "), and additionally writes a checksum list in each destination folder (": "），并额外在每个目标文件夹写入校验和列表（",
    ", TeraCopy-style) so the copy can be re-verified later with INGESTO, TeraCopy,": "，TeraCopy 风格），以便之后用 INGESTO、TeraCopy、",
    ", or your own tool. For advanced archival/hand-off workflows. SECURE already guarantees copy integrity for almost everyone; MD5 is notably slower.": "，或你自己的工具重新校验。面向进阶的存档/交接工作流。对几乎所有人来说，SECURE 已经能保证拷贝完整性；MD5 明显更慢。",
    "Got it": "知道了",

    /* ── 双读说明弹窗 ── */
    "An extra safety check for the card itself (PRO mode).": "针对存储卡本身的额外安全检查（PRO 模式）。",
    "What it does.": "作用。",
    "Once the copy is finished and verified, ingesto reads the whole card a second time and compares it with what was read during the copy. If the card gives different answers the second time, the card itself is unreliable, something a single read can never reveal.": "拷贝完成并通过校验后，ingesto 会再次读取整张卡，并与拷贝时读到的数据进行比较。如果卡第二次给出不同的答案，说明卡本身不可靠——这是单次读取永远无法发现的。",
    "When to use it.": "何时使用。",
    "Whenever the card is about to be formatted, or the footage can't be reshot: it's your last chance to catch a failing card while the footage still exists. It adds roughly one extra full read of the card to the ingest time.": "当卡即将被格式化，或素材无法重拍时：这是在素材还存在时抓住故障卡的最后机会。导入时间会大致增加一次完整读卡的时间。",

    /* ── 计数器说明弹窗 ── */
    "How the ingest number for each card is chosen.": "每张卡的导入编号是如何确定的。",
    "Auto (default).": "自动（默认）。",
    "INGESTO scans your destinations and picks the next free number, so cards get consecutive numbers even across sessions. It rescans automatically whenever a destination is added or a copy finishes.": "INGESTO 扫描你的目标位置并选取下一个可用编号，即使跨会话，存储卡也能获得连续编号。每当添加目标位置或拷贝完成时，它都会自动重新扫描。",
    "Manual override.": "手动覆盖。",
    "How it is written.": "如何书写。",

    /* ── PRO 警告弹窗 ── */
    "PRO mode, advanced use": "PRO 模式，进阶用法",
    "Not recommended for most users.": "不建议大多数用户使用。",
    "Don't show this again": "不再显示",
    "Back to SECURE": "返回 SECURE",
    "Use PRO": "使用 PRO",

    /* ── Kiosk 模式 ── */
    "SOURCE": "来源",
    "Name": "姓名",
    "Shot description…": "拍摄描述……",
    "Auto-ejects the card when verified · resets for the next shooter": "校验完成后自动弹出存储卡 · 并为下一位拍摄者重置",
    "Enter admin PIN": "输入管理员 PIN",
    "Next card": "下一张卡",
    "Copying…": "正在拷贝……",
    "ETA": "预计",

    /* ── 校验文件夹弹窗 ── */
    "Verifying folder…": "正在校验文件夹……",

    /* ── 设置面板长说明（{xxx} 模板变量保留英文） ── */
    "Runs after each ingest (not when canceled). Variables:": "每次导入完成后运行（取消时不运行）。变量：",
    "(quote them, e.g.": "（请给它们加引号，例如",
    "). ⚠ This executes exactly what you type. Only enter commands you trust.": "）。⚠ 这里会原样执行你输入的内容，只输入你信任的命令。",
    "means the run finished without errors, not that anything was verified: a FAST copy also says ok. To act on a card, use the handoff below.": "表示本次运行没有出错，并不代表任何东西经过了校验：FAST 拷贝也会说 ok。要针对整张卡执行操作，请使用下方的交接功能。"
  },

  attrs: {
    /* 只出现在提示/占位/无障碍属性里的文本 */
    "Verify a previously ingested folder": "校验之前导入过的文件夹",
    "Switch to kiosk mode": "切换到 kiosk 模式",
    "Minimize": "最小化",
    "Maximize": "最大化",
    "Close": "关闭",
    "Show/hide volumes you've manually hidden": "显示/隐藏你手动隐藏的磁盘",
    "Show or hide the volumes you have hidden": "显示或隐藏你已隐藏的磁盘",
    "Refresh mounted volumes": "刷新已挂载的磁盘",
    "Refresh the mounted volumes": "刷新已挂载的磁盘",
    "What do these modes do?": "这些模式分别有什么作用？",
    "What does this do?": "这是什么作用？",
    "Clear operator, camera, picture profile and notes": "清除摄影师、摄影机、图像配置和备注",
    "Rescans the destination and picks the next free number": "重新扫描目标位置并选取下一个可用编号",
    "Save the current template": "保存当前模板",
    "Export": "导出",
    "Import": "导入",
    "Export the templates": "导出模板",
    "Import templates": "导入模板",
    "Insert a subfolder separator": "插入子文件夹分隔符",
    "Double-click to type the template by hand": "双击以手动输入模板",
    "Type the folder template by hand": "手动输入文件夹模板",
    "Clear the ingest history": "清除导入历史",
    "Clear the history (the reports on the drives are kept)": "清除历史（磁盘上的报告会保留）",
    "Back to standard mode (PIN)": "返回标准模式（PIN）"
  },

  patterns: [
    /* 动态文本：[正则, 模板]，模板里 $1..$9 为捕获组 */
    ["^Save template (\\d+)$", "保存模板 $1"],
    ["^CARD (\\d+)$", "卡 $1"]
  ],

  html: {
    /* 句中被 <b> 等内联标签拆散的长句：按元素 id 整段替换，
     * 避免标签两侧原文空格在中文里留下多余空隙。
     * counter-pad 按钮在 mif-ci3 译文里原样保留（JS 每次现查 #counter-pad） */
    "mif-size": "<b>拷贝 + 大小检查。</b>拷贝后，INGESTO 比较每个源文件与目标文件的字节大小。几乎不耗时即可发现不完整或被截断的拷贝（磁盘断开、磁盘已满、写入中断）。但它<b>不</b>能检测静默的比特级损坏，因为内容本身不会被读回。",
    "mif-prodr": "<b>PRO 可选项，可检测即将损坏的卡。</b>校验拷贝之后，INGESTO 会<b>第二次读取源卡</b>，并检查它返回的数据是否仍然相同。重新读取时给出不同字节的卡正在损坏，这些文件会被标记为可疑（并从校验和列表中排除）。<b>限制：</b>只有当数据不再位于操作系统内存缓存中时，第二次读取才会真正到达存储卡。真实的导入（素材大于内存）属于这种情况，但<b>在大内存机器上做小规模测试拷贝时不保证如此</b>。校验时间大约翻倍。无论是否有缓存，硬读取错误总是会被捕获。",
    "mif-ci2": "<b>手动覆盖。</b>输入数字或使用 +/−，会将计数器锁定为该值。它保持锁定，直到你再次点击 <b>自动</b>，它会重新扫描目标位置并返回自动模式。",
    "mif-ci3": "<b>如何书写。</b>选择书写的位数。位数是<b>最小</b>值，不是最大值：99 之后是 100，永远不会是 00。修改它不会影响磁盘上已有的文件夹，也不会重启计数器。<div class=\"counter-pad\" id=\"counter-pad\"><button type=\"button\" class=\"cpad\" data-w=\"2\" onclick=\"setCounterWidth(2)\"></button><button type=\"button\" class=\"cpad\" data-w=\"3\" onclick=\"setCounterWidth(3)\"></button><button type=\"button\" class=\"cpad\" data-w=\"4\" onclick=\"setCounterWidth(4)\"></button></div>",
    "mif-prowarn": "PRO 完成 <b>SECURE</b> 的所有工作，并额外在每个目标文件夹写入<b>校验和列表</b>，供以后重新校验。它面向特定的存档/交接工作流——你需要把这些列表带到另一个工具中使用。<br><br>对于日常导入，<b>SECURE 已经逐比特保证你的拷贝</b>，因此你不需要 PRO。PRO 更慢（尤其是 MD5），会在文件夹中添加额外文件，并且假定你清楚自己为什么需要校验和列表。",
    "set-hint-handoff": "每张卡<b>在导入完成后运行一次</b>，一个 JSON 文档的路径会作为<b>最后一个参数</b>传入。文档说明了卡的位置、什么被拷到了哪里、校验了什么，并给出 <b>safeToErase</b> 的回答。它位于临时文件夹中，在你的命令返回后删除。卡上和目标位置都不会写入任何内容。<br>⚠ 这里会原样执行你输入的内容，而该文档是供可能擦除存储卡的脚本读取的。只输入你信任的命令。"
  }
};
