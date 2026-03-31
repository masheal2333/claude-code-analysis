// Claude Code Harness Engineering 分析应用
document.addEventListener('DOMContentLoaded', function() {
    // 初始化 Mermaid
    mermaid.initialize({ 
        startOnLoad: true,
        theme: 'default',
        securityLevel: 'loose',
        flowchart: { useMaxWidth: true, htmlLabels: true }
    });

    // 12 个 Harness 机制数据
    const mechanisms = [
        {
            id: 1,
            name: "核心循环",
            tagline: "一个循环 + Bash 就是全部",
            description: "query.ts 中的 while-true 循环调用 Claude API，检查 stop_reason，执行工具，追加结果。这是所有 Agent 的基础。",
            files: ["query.ts", "src/query.ts"]
        },
        {
            id: 2,
            name: "工具分发",
            tagline: "添加工具 = 添加一个处理器",
            description: "Tool.ts + tools.ts：每个工具注册到分发映射。循环保持不变。buildTool() 工厂提供安全默认值。",
            files: ["Tool.ts", "tools.ts", "buildTool()"]
        },
        {
            id: 3,
            name: "规划模式",
            tagline: "没有计划的代理会漂移",
            description: "EnterPlanModeTool/ExitPlanModeTool + TodoWriteTool：先列出步骤，再执行。完成率翻倍。",
            files: ["EnterPlanModeTool", "ExitPlanModeTool", "TodoWriteTool"]
        },
        {
            id: 4,
            name: "子代理",
            tagline: "分解大任务；清理每个子任务的上下文",
            description: "AgentTool + forkSubagent.ts：每个子代理获得新的 messages[]，保持主对话干净。",
            files: ["AgentTool", "forkSubagent.ts"]
        },
        {
            id:5,
            name: "知识按需加载",
            tagline: "需要时加载知识",
            description: "SkillTool + memdir/：通过 tool_result 注入，而不是系统提示。CLAUDE.md 文件按目录懒加载。",
            files: ["SkillTool", "memdir/", "CLAUDE.md"]
        },
        {
            id: 6,
            name: "上下文压缩",
            tagline: "上下文满了；腾出空间",
            description: "services/compact/：三层策略：autoCompact（摘要）+ snipCompact（修剪）+ contextCollapse。",
            files: ["services/compact/", "autoCompact", "snipCompact"]
        },
        {
            id: 7,
            name: "持久化任务",
            tagline: "大目标 → 小任务 → 磁盘",
            description: "TaskCreate/Update/Get/List：基于文件的任务图，支持状态跟踪、依赖和持久化。",
            files: ["TaskCreate", "TaskUpdate", "TaskGet", "TaskList"]
        },
        {
            id: 8,
            name: "后台任务",
            tagline: "慢操作在后台；代理保持思考",
            description: "DreamTask + LocalShellTask：守护线程运行命令，完成时注入通知。",
            files: ["DreamTask", "LocalShellTask"]
        },
        {
            id: 9,
            name: "代理团队",
            tagline: "太大了就委托给队友",
            description: "TeamCreate/Delete + InProcessTeammateTask：持久的队友，带有异步邮箱。",
            files: ["TeamCreate", "InProcessTeammateTask"]
        },
        {
            id: 10,
            name: "团队协议",
            tagline: "共享通信规则",
            description: "SendMessageTool：一种请求-响应模式驱动所有代理之间的协商。",
            files: ["SendMessageTool"]
        },
        {
            id: 11,
            name: "自动代理",
            tagline: "队友扫描并认领任务",
            description: "coordinator/coordinatorMode.ts：空闲周期 + 自动认领，使代理能够自主工作。",
            files: ["coordinator/coordinatorMode.ts"]
        },
        {
            id: 12,
            name: "防护栏杆",
            tagline: "最后一道防线",
            description: "permissions/, services/permissions.ts：权限检查、沙箱隔离、安全边界，确保代理行为安全可控。",
            files: ["permissions/", "services/permissions.ts"]
        }
    ];

    // 渲染机制卡片
    const grid = document.querySelector('.mechanism-grid');
    if (grid) {
        mechanisms.forEach(mech => {
            const card = document.createElement('div');
            card.className = 'mechanism-card';
            card.innerHTML = `
                <h3>${mech.id}. ${mech.name}</h3>
                <p class="tagline">"${mech.tagline}"</p>
                <p>${mech.description}</p>
                <div class="files">
                    <strong>关键文件：</strong>
                    <code>${mech.files.join(', ')}</code>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    // 平滑滚动
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    console.log('🔍 Claude Code Harness Engineering 分析已加载');
});
