// Claude Code Harness Engineering 分析应用
document.addEventListener('DOMContentLoaded', function() {
    if (typeof mermaid !== 'undefined') {
        mermaid.initialize({ startOnLoad: true, theme: 'default', securityLevel: 'loose', flowchart: { useMaxWidth: true, htmlLabels: true } });
    }
    renderMechanismCards();
    initCodeTabs();
    enhanceAllCodeBlocks();

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
    console.log('Claude Code Harness Engineering loaded');
});

function renderMechanismCards() {
    const mechanisms = [
        { id:1, name:"核心循环", tagline:"一个循环 + Bash 就是全部", desc:"query.ts 中的 while-true 循环", files:["query.ts"], page:"mechanisms/core-loop.html" },
        { id:2, name:"工具分发", tagline:"添加工具 = 添加一个处理器", desc:"Tool.ts + tools.ts：工具注册到分发映射", files:["Tool.ts","tools.ts"], page:"mechanisms/tool-dispatch.html" },
        { id:3, name:"规划模式", tagline:"没有计划的代理会漂移", desc:"EnterPlanModeTool + TodoWriteTool", files:["EnterPlanModeTool"], page:"mechanisms/planning-mode.html" },
        { id:4, name:"子代理", tagline:"分解大任务", desc:"AgentTool + forkSubagent.ts", files:["AgentTool"], page:"mechanisms/sub-agents.html" },
        { id:5, name:"知识按需加载", tagline:"需要时加载知识", desc:"SkillTool + memdir/", files:["SkillTool"], page:"mechanisms/knowledge-loading.html" },
        { id:6, name:"上下文压缩", tagline:"上下文满了；腾出空间", desc:"autoCompact + snipCompact + contextCollapse", files:["services/compact/"], page:"mechanisms/context-compression.html" },
        { id:7, name:"持久化任务", tagline:"大目标 → 小任务 → 磁盘", desc:"TaskCreate/Update/Get/List", files:["TaskCreate"], page:"mechanisms/persistent-tasks.html" },
        { id:8, name:"后台任务", tagline:"慢操作在后台", desc:"DreamTask + LocalShellTask", files:["DreamTask"], page:"mechanisms/background-tasks.html" },
        { id:9, name:"代理团队", tagline:"太大了就委托给队友", desc:"TeamCreate/Delete + InProcessTeammateTask", files:["TeamCreate"], page:"mechanisms/agent-teams.html" },
        { id:10, name:"团队协议", tagline:"共享通信规则", desc:"SendMessageTool", files:["SendMessageTool"], page:"mechanisms/team-protocols.html" },
        { id:11, name:"自动代理", tagline:"队友扫描并认领任务", desc:"coordinator/coordinatorMode.ts", files:["coordinator/coordinatorMode.ts"], page:"mechanisms/auto-agents.html" },
        { id:12, name:"防护栏杆", tagline:"最后一道防线", desc:"permissions/ 安全边界", files:["permissions/"], page:"mechanisms/guardrails.html" }
    ];
    const grid = document.querySelector('.mechanism-grid');
    if (!grid) return;
    mechanisms.forEach(m => {
        const card = document.createElement('div');
        card.className = 'mechanism-card';
        card.innerHTML = '<a href="'+m.page+'" class="card-link"><h3>'+m.id+'. '+m.name+'</h3><p class="tagline">"'+m.tagline+'"</p><p>'+m.desc+'</p><div class="files"><strong>关键文件：</strong><code>'+m.files.join(', ')+'</code></div><div class="click-hint">点击查看详情 \u2192</div></a>';
        grid.appendChild(card);
    });
}

function initCodeTabs() {
    document.querySelectorAll('.code-tabs').forEach(tabContainer => {
        const tabs = tabContainer.querySelectorAll('.code-tab');
        let panels = [];
        let contentEl = tabContainer.nextElementSibling;
        while (contentEl && contentEl.nodeType === 3) contentEl = contentEl.nextElementSibling;
        if (contentEl && contentEl.classList.contains('code-content')) {
            panels = contentEl.querySelectorAll('.code-panel');
        }
        if (panels.length === 0) {
            const parent = tabContainer.parentElement;
            if (parent) panels = parent.querySelectorAll('.code-panel');
        }
        if (panels.length === 0) return;
        tabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const lang = this.dataset.lang;
                tabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                panels.forEach(panel => {
                    panel.classList.toggle('active', panel.dataset.lang === lang);
                });
            });
        });
    });
}

function enhanceAllCodeBlocks() {
    document.querySelectorAll('.code-panel code').forEach(codeEl => {
        enhanceCodeElement(codeEl, detectLanguage(codeEl));
    });
    document.querySelectorAll('.code-block > pre > code, .code-block > code').forEach(codeEl => {
        if (!codeEl.closest('.code-panel')) enhanceCodeElement(codeEl, detectLanguage(codeEl));
    });
    document.querySelectorAll('pre > code').forEach(codeEl => {
        if (!codeEl.closest('.code-panel') && !codeEl.closest('.code-block') && !codeEl.closest('.code-lines')) {
            enhanceCodeElement(codeEl, detectLanguage(codeEl));
        }
    });
}

function enhanceCodeElement(codeEl, language) {
    const rawCode = codeEl.textContent;
    if (!rawCode.trim()) return;
    const lang = language || detectLanguage(codeEl);

    const container = document.createElement('div');
    container.className = 'code-block-enhanced';

    const header = document.createElement('div');
    header.className = 'code-header';
    header.innerHTML = '<span class="code-lang">'+getLangLabel(lang)+'</span><div class="code-actions"><button class="code-action-btn copy-btn" title="复制代码">\ud83d\udccb 复制</button><button class="code-action-btn fullscreen-btn" title="全屏查看">\u26f6 全屏</button></div>';

    const linesContainer = document.createElement('div');
    linesContainer.className = 'code-lines';

    const lines = rawCode.split('\n');
    lines.forEach((line, idx) => {
        const lineEl = document.createElement('div');
        lineEl.className = 'code-line';
        const lineNum = document.createElement('span');
        lineNum.className = 'line-number';
        lineNum.textContent = idx + 1;
        const lineContent = document.createElement('span');
        lineContent.className = 'line-content';
        lineContent.innerHTML = highlightLine(line, lang);
        lineEl.appendChild(lineNum);
        lineEl.appendChild(lineContent);
        linesContainer.appendChild(lineEl);
    });

    container.appendChild(header);
    container.appendChild(linesContainer);
    const parent = codeEl.parentElement;
    parent.insertBefore(container, codeEl);
    codeEl.style.display = 'none';

    header.querySelector('.copy-btn').addEventListener('click', function() {
        const btn = this;
        navigator.clipboard.writeText(rawCode).then(function() {
            btn.textContent = '\u2705 已复制';
            btn.classList.add('copied');
            setTimeout(function() { btn.textContent = '\ud83d\udccb 复制'; btn.classList.remove('copied'); }, 2000);
        }).catch(function() {
            const ta = document.createElement('textarea');
            ta.value = rawCode; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
            btn.textContent = '\u2705 已复制'; btn.classList.add('copied');
            setTimeout(function() { btn.textContent = '\ud83d\udccb 复制'; btn.classList.remove('copied'); }, 2000);
        });
    });

    header.querySelector('.fullscreen-btn').addEventListener('click', function() {
        const codeBlock = container.closest('.code-block') || container;
        const isFs = codeBlock.classList.contains('fullscreen');
        if (isFs) {
            codeBlock.classList.remove('fullscreen');
            const ov = document.querySelector('.fullscreen-overlay');
            if (ov) ov.remove();
            this.textContent = '\u26f6 全屏';
            document.body.style.overflow = '';
        } else {
            const overlay = document.createElement('div');
            overlay.className = 'fullscreen-overlay';
            const btn = this;
            overlay.addEventListener('click', function() {
                codeBlock.classList.remove('fullscreen'); overlay.remove(); btn.textContent = '\u26f6 全屏'; document.body.style.overflow = '';
            });
            document.body.appendChild(overlay);
            codeBlock.classList.add('fullscreen');
            this.textContent = '\u2715 退出';
            document.body.style.overflow = 'hidden';
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const fs = document.querySelector('.code-block.fullscreen, .code-block-enhanced.fullscreen');
            if (fs) {
                fs.classList.remove('fullscreen');
                const ov = document.querySelector('.fullscreen-overlay');
                if (ov) ov.remove();
                document.body.style.overflow = '';
                const btn = fs.querySelector('.fullscreen-btn');
                if (btn) btn.textContent = '\u26f6 全屏';
            }
        }
    });
}

function detectLanguage(codeEl) {
    var text = codeEl.textContent.toLowerCase();
    var parent = codeEl.closest('.code-panel');
    if (parent && parent.dataset.lang) return parent.dataset.lang;
    if (/\b(interface|async\s+function|const\s|let\s|=>\s*\{|Promise<|\.ts\b)/.test(text)) return 'typescript';
    if (/\b(def |class\s+\w+|import\s+\w+|from\s+\w+\s+import|self|__init__|\.py\b)/.test(text)) return 'python';
    if (/\b(function\s|var\s|require\(|module\.exports)/.test(text)) return 'javascript';
    if (/^\s*[{[]/.test(text) && /[}\]]\s*;?\s*$/.test(text)) return 'json';
    if (/^\s*[#$>]/.test(text) || /^(mkdir|cd|cat|pip|npm|git)\b/.test(text)) return 'bash';
    return 'typescript';
}

function getLangLabel(lang) {
    var labels = { typescript:'TypeScript', python:'Python', javascript:'JavaScript', json:'JSON', bash:'Shell', markdown:'Markdown' };
    return labels[lang] || lang.toUpperCase();
}

function highlightLine(line, lang) {
    if (lang === 'python') return highlightPython(line);
    if (lang === 'json') return highlightJSON(line);
    if (lang === 'bash') return highlightBash(line);
    return highlightTS(line);
}

function esc(s) {
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// TypeScript 高亮
function highlightTS(line) {
    var result = esc(line);
    if (/^\s*\/\//.test(line)) return '<span class="hl-comment">'+result+'</span>';

    var tokens = [], i = 0, src = result;
    while (i < src.length) {
        // 注释
        if (src[i]==='/' && src[i+1]==='/') { tokens.push('<span class="hl-comment">'+src.slice(i)+'</span>'); break; }
        if (src[i]==='/' && src[i+1]==='*') {
            var end = src.indexOf('*/',i+2); if (end===-1) end=src.length-2;
            tokens.push('<span class="hl-comment">'+src.slice(i,end+2)+'</span>'); i=end+2; continue;
        }
        // 字符串
        var ch = src[i];
        if (ch==='"' || ch==="'" || ch==='`') {
            var j=i+1;
            while (j<src.length && src[j]!==ch) { if (src[j]==='\\') j++; j++; }
            j=Math.min(j+1,src.length);
            tokens.push('<span class="hl-string">'+src.slice(i,j)+'</span>'); i=j; continue;
        }
        // 数字
        if (/\d/.test(ch) && (i===0 || !/[a-zA-Z_$]/.test(src[i-1]))) {
            var j=i; while (j<src.length && /[\d.eExXa-fA-F_]/.test(src[j])) j++;
            tokens.push('<span class="hl-number">'+src.slice(i,j)+'</span>'); i=j; continue;
        }
        // 标识符
        if (/[a-zA-Z_$]/.test(ch)) {
            var j=i; while (j<src.length && /[a-zA-Z0-9_$]/.test(src[j])) j++;
            var word = src.slice(i,j);
            var kw = ['const','let','var','function','async','await','return','if','else','for','while','class','extends','interface','type','import','export','from','new','this','throw','try','catch','finally','switch','case','break','continue','default','typeof','instanceof','in','of','void','null','undefined','true','false','enum','implements','declare','readonly','private','public','protected','static','abstract','super','yield','as','is','keyof','any','never','unknown'];
            var bi = ['console','Promise','Array','Object','String','Number','Boolean','Map','Set','JSON','Math','Date','Error','RegExp','setTimeout','process'];
            if (kw.indexOf(word)>=0) {
                tokens.push('<span class="hl-keyword">'+word+'</span>');
            } else if (bi.indexOf(word)>=0) {
                tokens.push('<span class="hl-builtin">'+word+'</span>');
            } else if (j<src.length && src[j]==='(') {
                var prev = i>0?src[i-1]:'';
                tokens.push('<span class="hl-function">'+word+'</span>');
            } else if (/^[A-Z]/.test(word) && word.length>1) {
                tokens.push('<span class="hl-class">'+word+'</span>');
            } else {
                tokens.push(word);
            }
            i=j; continue;
        }
        tokens.push(ch); i++;
    }
    return tokens.join('');
}

// Python 高亮
function highlightPython(line) {
    var result = esc(line);
    if (/^\s*#/.test(line)) return '<span class="hl-comment">'+result+'</span>';

    var tokens=[], i=0, src=result;
    while (i<src.length) {
        if (src[i]==='#') { tokens.push('<span class="hl-comment">'+src.slice(i)+'</span>'); break; }
        // 三引号
        if (src.slice(i,i+3)==='"""' || src.slice(i,i+3)==="'''") {
            var q=src.slice(i,i+3), j=i+3, end=src.indexOf(q,j);
            if (end===-1) end=src.length; else end+=3;
            tokens.push('<span class="hl-string">'+src.slice(i,end)+'</span>'); i=end; continue;
        }
        // f/r/b string
        if (/[frb]/i.test(src[i]) && (src[i+1]==='"'||src[i+1]==="'")) {
            var q=src[i+1], j=i+2;
            while (j<src.length && src[j]!==q) { if (src[j]==='\\') j++; j++; }
            j=Math.min(j+1,src.length);
            tokens.push('<span class="hl-string">'+src.slice(i,j)+'</span>'); i=j; continue;
        }
        // 字符串
        var ch=src[i];
        if (ch==='"'||ch==="'") {
            var j=i+1;
            while (j<src.length && src[j]!==ch) { if (src[j]==='\\') j++; j++; }
            j=Math.min(j+1,src.length);
            tokens.push('<span class="hl-string">'+src.slice(i,j)+'</span>'); i=j; continue;
        }
        // 数字
        if (/\d/.test(ch) && (i===0 || !/[a-zA-Z_]/.test(src[i-1]))) {
            var j=i; while (j<src.length && /[\d.eExXoObBa-fA-F_]/.test(src[j])) j++;
            tokens.push('<span class="hl-number">'+src.slice(i,j)+'</span>'); i=j; continue;
        }
        // 标识符
        if (/[a-zA-Z_]/.test(ch)) {
            var j=i; while (j<src.length && /[a-zA-Z0-9_]/.test(src[j])) j++;
            var word=src.slice(i,j);
            var kw=['and','as','assert','async','await','break','class','continue','def','del','elif','else','except','finally','for','from','global','if','import','in','is','lambda','nonlocal','not','or','pass','raise','return','try','while','with','yield','True','False','None'];
            var bi=['print','len','range','int','str','float','list','dict','set','tuple','type','isinstance','super','property','enumerate','zip','map','filter','sorted','any','all','min','max','sum','abs','round','open','input','format','repr','iter','next','callable'];
            if (kw.indexOf(word)>=0) {
                tokens.push('<span class="hl-keyword">'+word+'</span>');
            } else if (bi.indexOf(word)>=0) {
                tokens.push('<span class="hl-builtin">'+word+'</span>');
            } else if (j<src.length && src[j]==='(') {
                tokens.push('<span class="hl-function">'+word+'</span>');
            } else if (i>0 && src[i-1]==='.') {
                tokens.push('<span class="hl-property">'+word+'</span>');
            } else if (/^[A-Z]/.test(word) && word.length>1) {
                tokens.push('<span class="hl-class">'+word+'</span>');
            } else {
                tokens.push(word);
            }
            i=j; continue;
        }
        // 装饰器
        if (ch==='@') {
            var j=i+1; while (j<src.length && /[a-zA-Z0-9_.]/.test(src[j])) j++;
            tokens.push('<span class="hl-decorator">'+src.slice(i,j)+'</span>'); i=j; continue;
        }
        tokens.push(ch); i++;
    }
    return tokens.join('');
}

function highlightJSON(line) {
    var r = esc(line);
    r = r.replace(/(&quot;[^&]*?&quot;)(\s*:)/g, '<span class="hl-property">$1</span>$2');
    r = r.replace(/(:\s*)(&quot;[^&]*?&quot;)/g, '$1<span class="hl-string">$2</span>');
    r = r.replace(/:\s*(\d+\.?\d*)/g, ': <span class="hl-number">$1</span>');
    r = r.replace(/:\s*(true|false|null)/g, ': <span class="hl-keyword">$1</span>');
    return r;
}

function highlightBash(line) {
    var r = esc(line);
    if (/^\s*#/.test(line)) return '<span class="hl-comment">'+r+'</span>';
    r = r.replace(/\b(mkdir|cd|cat|ls|rm|cp|mv|pip|npm|git|npx|clawhub|curl|wget)\b/g, '<span class="hl-builtin">$1</span>');
    r = r.replace(/\s(-[-a-zA-Z]+)/g, ' <span class="hl-keyword">$1</span>');
    return r;
}
