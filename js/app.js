// Claude Code Harness Engineering 分析应用
document.addEventListener('DOMContentLoaded', function() {
    if (typeof mermaid !== 'undefined') {
        mermaid.initialize({ 
            startOnLoad: true,
            theme: 'default',
            securityLevel: 'loose',
            flowchart: { useMaxWidth: true, htmlLabels: true }
        });
    }

    renderMechanismCards();
    initCodeTabs();

    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    console.log('🔍 Claude Code Harness Engineering 分析已加载');
});

function renderMechanismCards() {
    const mechanisms = [
        { id: 1, name: "核心循环", tagline: "一个循环 + Bash 就是全部", desc: "query.ts 中的 while-true 循环", files: ["query.ts"], page: "mechanisms/core-loop.html" },
        { id: 2, name: "工具分发", tagline: "添加工具 = 添加一个处理器", desc: "Tool.ts + tools.ts：工具注册到分发映射", files: ["Tool.ts", "tools.ts"], page: "mechanisms/tool-dispatch.html" },
        { id: 3, name: "规划模式", tagline: "没有计划的代理会漂移", desc: "EnterPlanModeTool + TodoWriteTool", files: ["EnterPlanModeTool"], page: "mechanisms/planning-mode.html" },
        { id: 4, name: "子代理", tagline: "分解大任务", desc: "AgentTool + forkSubagent.ts", files: ["AgentTool"], page: "mechanisms/sub-agents.html" },
        { id: 5, name: "知识按需加载", tagline: "需要时加载知识", desc: "SkillTool + memdir/", files: ["SkillTool"], page: "mechanisms/knowledge-loading.html" },
        { id: 6, name: "上下文压缩", tagline: "上下文满了；腾出空间", desc: "autoCompact + snipCompact + contextCollapse", files: ["services/compact/"], page: "mechanisms/context-compression.html" },
        { id: 7, name: "持久化任务", tagline: "大目标 → 小任务 → 磁盘", desc: "TaskCreate/Update/Get/List", files: ["TaskCreate"], page: "mechanisms/persistent-tasks.html" },
        { id: 8, name: "后台任务", tagline: "慢操作在后台", desc: "DreamTask + LocalShellTask", files: ["DreamTask"], page: "mechanisms/background-tasks.html" },
        { id: 9, name: "代理团队", tagline: "太大了就委托给队友", desc: "TeamCreate/Delete + InProcessTeammateTask", files: ["TeamCreate"], page: "mechanisms/agent-teams.html" },
        { id: 10, name: "团队协议", tagline: "共享通信规则", desc: "SendMessageTool", files: ["SendMessageTool"], page: "mechanisms/team-protocols.html" },
        { id: 11, name: "自动代理", tagline: "队友扫描并认领任务", desc: "coordinator/coordinatorMode.ts", files: ["coordinator/coordinatorMode.ts"], page: "mechanisms/auto-agents.html" },
        { id: 12, name: "防护栏杆", tagline: "最后一道防线", desc: "permissions/ 安全边界", files: ["permissions/"], page: "mechanisms/guardrails.html" }
    ];

    const grid = document.querySelector('.mechanism-grid');
    if (!grid) return;

    mechanisms.forEach(m => {
        const card = document.createElement('div');
        card.className = 'mechanism-card';
        card.innerHTML = `
            <a href="${m.page}" class="card-link">
                <h3>${m.id}. ${m.name}</h3>
                <p class="tagline">"${m.tagline}"</p>
                <p>${m.desc}</p>
                <div class="files">
                    <strong>关键文件：</strong>
                    <code>${m.files.join(', ')}</code>
                </div>
                <div class="click-hint">点击查看详情 →</div>
            </a>
        `;
        grid.appendChild(card);
    });
}

function initCodeTabs() {
    document.querySelectorAll('.code-tabs').forEach(tabContainer => {
        const tabs = tabContainer.querySelectorAll('.code-tab');
        
        // 找到相邻的 .code-content
        let panels = [];
        let contentEl = tabContainer.nextElementSibling;
        while (contentEl && contentEl.nodeType === 3) {
            contentEl = contentEl.nextElementSibling;
        }
        if (contentEl && contentEl.classList.contains('code-content')) {
            panels = contentEl.querySelectorAll('.code-panel');
        }
        if (panels.length === 0) {
            const parent = tabContainer.parentElement;
            if (parent) {
                panels = parent.querySelectorAll('.code-panel');
            }
        }
        if (panels.length === 0) return;
        
        tabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const lang = this.dataset.lang;
                
                // 更新 tab 状态
                tabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                // 更新 panel 状态
                panels.forEach(panel => {
                    if (panel.dataset.lang === lang) {
                        panel.classList.add('active');
                    } else {
                        panel.classList.remove('active');
                    }
                });
            });
        });
    });
}
