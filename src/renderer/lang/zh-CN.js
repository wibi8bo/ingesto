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
    "VIEW": "查看"
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
    "Clear the history (the reports on the drives are kept)": "清除历史（磁盘上的报告会保留）"
  },

  patterns: [
    /* 动态文本示例（批次 3 补充）：
     * ["^Copied (\\d+) files$", "已拷贝 $1 个文件"]
     */
  ],

  html: {
    /* 按元素 id 整段替换示例（批次 2/3 补充）：
     * "hook-details-hint": "运行……<b>{destPath}</b>……"
     */
  }
};
