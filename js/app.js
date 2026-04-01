// Claude Code Harness Engineering 分析应用
document.addEventListener('DOMContentLoaded', function() {
    // 初始化 Mermaid
    if (typeof mermaid !== 'undefined') {
        mermaid.initialize({ 
            startOnLoad: true,
            theme: 'default',
            securityLevel: 'loose',
            flowchart: { useMaxWidth: true, htmlLabels: true }
        });
    }

    // 12 个 Harness 机制数据
    const mechanisms = [
        {
            id: 1,
            name: "核心循环",
            tagline: "一个循环 + Bash 就是全部",
            description: "query.ts 中的 while-true 循环调用 Claude API，检查 stop_reason，执行工具，追加结果。这是所有 Agent 的基础。",
            files: ["query.ts", "src/query.ts"],
            page: "mechanisms/core-loop.html"
        },
        {
            id: 2,
            name: "工具分发",
            tagline: "添加工具 = 添加一个处理器",
            description: "Tool.ts + tools.ts：每个工具注册到分发映射。循环保持不变。buildTool() 工厂提供安全默认值。",
            files: ["Tool.ts", "tools.ts", "buildTool()"],
            page: "mechanisms/tool-dispatch.html"
        },
        {
            id: 3,
            name: "规划模式",
            tagline: "没有计划的代理会漂移",
            description: "EnterPlanModeTool/ExitPlanModeTool + TodoWriteTool：先列出步骤，再执行。完成率翻倍。",
            files: ["EnterPlanModeTool", "ExitPlanModeTool", "TodoWriteTool"],
            page: "mechanisms/planning-mode.html"
        },
        {
            id: 4,
            name: "子代理",
            tagline: "分解大任务；清理每个子任务的上下文",
            description: "AgentTool + forkSubagent.ts：每个子代理获得新的 messages[]，保持主对话干净。",
            files: ["AgentTool", "forkSubagent.ts"],
            page: "mechanisms/sub-agents.html"
        },
        {
            id: 5,
            name: "知识按需加载",
            tagline: "需要时加载知识",
            description: "SkillTool + memdir/：通过 tool_result 注入，而不是系统提示。CLAUDE.md 文件按目录懒加载。",
            files: ["SkillTool", "memdir/", "CLAUDE.md"],
            page: "mechanisms/knowledge-loading.html"
        },
        {
            id: 6,
            name: "上下文压缩",
            tagline: "上下文满了；腾出空间",
            description: "services/compact/：三层策略：autoCompact（摘要）+ snipCompact（修剪）+ contextCollapse。",
            files: ["services/compact/", "autoCompact", "snipCompact"],
            page: "mechanisms/context-compression.html"
        },
        {
            id: 7,
            name: "持久化任务",
            tagline: "大目标 → 小任务 → 磁盘",
            description: "TaskCreate/Update/Get/List：基于文件的任务图，支持状态跟踪、依赖和持久化。",
            files: ["TaskCreate", "TaskUpdate", "TaskGet", "TaskList"],
            page: "mechanisms/persistent-tasks.html"
        },
        {
            id: 8,
            name: "后台任务",
            tagline: "慢操作在后台；代理保持思考",
            description: "DreamTask + LocalShellTask：守护线程运行命令，完成时注入通知。",
            files: ["DreamTask", "LocalShellTask"],
            page: "mechanisms/background-tasks.html"
        },
        {
            id: 9,
            name: "代理团队",
            tagline: "太大了就委托给队友",
            description: "TeamCreate/Delete + InProcessTeammateTask：持久的队友，带有异步邮箱。",
            files: ["TeamCreate", "InProcessTeammateTask"],
            page: "mechanisms/agent-teams.html"
        },
        {
            id: 10,
            name: "团队协议",
            tagline: "共享通信规则",
            description: "SendMessageTool：一种请求-响应模式驱动所有代理之间的协商。",
            files: ["SendMessageTool"],
            page: "mechanisms/team-protocols.html"
        },
        {
            id: 11,
            name: "自动代理",
            tagline: "队友扫描并认领任务",
            description: "coordinator/coordinatorMode.ts：空闲周期 + 自动认领，使代理能够自主工作。",
            files: ["coordinator/coordinatorMode.ts"],
            page: "mechanisms/auto-agents.html"
        },
        {
            id: 12,
            name: "防护栏杆",
            tagline: "最后一道防线",
            description: "permissions/, services/permissions.ts：权限检查、沙箱隔离、安全边界，确保代理行为安全可控。",
            files: ["permissions/", "services/permissions.ts"],
            page: "mechanisms/guardrails.html"
        }
    ];

    // 渲染机制卡片
    const grid = document.querySelector('.mechanism-grid');
    if (grid) {
        mechanisms.forEach(mech => {
            const card = document.createElement('div');
            card.className = 'mechanism-card';
            card.innerHTML = `
                <a href="${mech.page}" class="card-link">
                    <h3>${mech.id}. ${mech.name}</h3>
                    <p class="tagline">"${mech.tagline}"</p>
                    <p>${mech.description}</p>
                    <div class="files">
                        <strong>关键文件：</strong>
                        <code>${mech.files.join(', ')}</code>
                    </div>
                    <div class="click-hint">点击查看详情 →</div>
                </a>
            `;
            grid.appendChild(card);
        });
    }

    // 初始化代码增强功能
    enhanceCodeBlocks();
    initCodeTabs();

    // 平滑滚动 - 只处理 # 开头的链接
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    console.log('🔍 Claude Code Harness Engineering 分析已加载');
});

// 代码增强功能
function enhanceCodeBlocks() {
    // 为所有代码块添加行号和语法高亮
    document.querySelectorAll('.code-panel code, .code-block code').forEach(codeBlock => {
        const code = codeBlock.textContent;
        const lines = code.split('\n');
        
        // 移除最后的空行
        if (lines[lines.length - 1].trim() === '') {
            lines.pop();
        }
        
        // 创建带行号的代码
        let html = '';
        lines.forEach((line, index) => {
            const lineNumber = index + 1;
            const highlightedLine = highlightSyntax(line);
            html += `<div class="code-line" data-line="${lineNumber}"><span class="line-content">${highlightedLine}</span></div>`;
        });
        
        codeBlock.innerHTML = html;
    });
    
    // 添加复制按钮
    document.querySelectorAll('.code-panel').forEach(panel => {
        const copyBtn = document.createElement('button');
        copyBtn.className = 'code-copy-btn';
        copyBtn.textContent = '📋 复制';
        copyBtn.addEventListener('click', () => copyCode(panel));
        panel.appendChild(copyBtn);
        
        const fullscreenBtn = document.createElement('button');
        fullscreenBtn.className = 'code-fullscreen-btn';
        fullscreenBtn.textContent = '⛶ 全屏';
        fullscreenBtn.addEventListener('click', () => toggleFullscreen(panel));
        panel.appendChild(fullscreenBtn);
    });
}

// 简单的语法高亮
function highlightSyntax(line) {
    // 转义 HTML
    line = line
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    
    // TypeScript/JavaScript 关键字
    const keywords = [
        'async', 'await', 'break', 'case', 'catch', 'class', 'const', 'continue',
        'debugger', 'default', 'delete', 'do', 'else', 'enum', 'export', 'extends',
        'finally', 'for', 'from', 'function', 'if', 'import', 'in', 'instanceof',
        'interface', 'let', 'new', 'of', 'return', 'super', 'switch', 'this',
        'throw', 'try', 'typeof', 'var', 'void', 'while', 'with', 'yield',
        'true', 'false', 'null', 'undefined', 'Promise', 'Map', 'Set', 'Array',
        'Object', 'String', 'Number', 'Boolean', 'Symbol', 'BigInt'
    ];
    
    // Python 关键字
    const pythonKeywords = [
        'False', 'None', 'True', 'and', 'as', 'assert', 'async', 'await',
        'break', 'class', 'continue', 'def', 'del', 'elif', 'else', 'except',
        'finally', 'for', 'from', 'global', 'if', 'import', 'in', 'is',
        'lambda', 'nonlocal', 'not', 'or', 'pass', 'raise', 'return',
        'try', 'while', 'with', 'yield'
    ];
    
    // 合并关键字
    const allKeywords = [...new Set([...keywords, ...pythonKeywords])];
    
    // 高亮关键字
    allKeywords.forEach(keyword => {
        const regex = new RegExp(`\\b(${keyword})\\b`, 'g');
        line = line.replace(regex, '<span class="keyword">$1</span>');
    });
    
    // 高亮字符串
    line = line.replace(/(["'`])(?:(?!\1)[^\\]|\\.)*\1/g, '<span class="string">$&</span>');
    
    // 高亮注释
    if (line.trimStart().startsWith('//') || line.trimStart().startsWith('#')) {
        line = '<span class="comment">' + line + '</span>';
    }
    
    // 高亮数字
    line = line.replace(/\b(\d+\.?\d*)\b/g, '<span class="number">$1</span>');
    
    // 高亮函数调用
    line = line.replace(/\b([a-zA-Z_]\w*)\s*\(/g, '<span class="function">$1</span>(');
    
    return line;
}

// 代码切换功能
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
                
                // 重新增强当前面板的代码
                enhanceCodeBlocks();
            });
        });
    });
}

// 复制代码功能
function copyCode(panel) {
    const code = panel.querySelector('code');
    if (!code) return;
    
    // 获取纯文本
    const text = code.textContent;
    
    navigator.clipboard.writeText(text).then(() => {
        const btn = panel.querySelector('.code-copy-btn');
        if (btn) {
            const originalText = btn.textContent;
            btn.textContent = '✅ 已复制';
            setTimeout(() => {
                btn.textContent = originalText;
            }, 2000);
        }
    }).catch(err => {
        console.error('复制失败:', err);
    });
}

// 全屏切换功能
function toggleFullscreen(panel) {
    panel.classList.toggle('code-fullscreen');
    
    if (panel.classList.contains('code-fullscreen')) {
        // 进入全屏
        document.body.style.overflow = 'hidden';
        
        // 添加退出全屏的按钮
        const exitBtn = document.createElement('button');
        exitBtn.className = 'code-fullscreen-exit';
        exitBtn.textContent = '✕ 退出全屏';
        exitBtn.style.cssText = `
            position: fixed;
            top: 1rem;
            right: 1rem;
            background: #007acc;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 0.5rem 1rem;
            font-size: 1rem;
            cursor: pointer;
            z-index: 1001;
        `;
        exitBtn.addEventListener('click', () => {
            panel.classList.remove('code-fullscreen');
            exitBtn.remove();
            document.body.style.overflow = '';
        });
        document.body.appendChild(exitBtn);
    } else {
        // 退出全屏
        document.body.style.overflow = '';
        const exitBtn = document.querySelector('.code-fullscreen-exit');
        if (exitBtn) exitBtn.remove();
    }
}
