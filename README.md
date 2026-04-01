# Claude Code Harness Engineering 分析

本项目深入分析了 Claude Code v2.1.88 中的 Harness Engineering 实现。

## 🎯 什么是 Harness Engineering？

Harness Engineering 是构建生产级 AI Agent 的核心工程实践，确保 AI 在执行过程中：

- 🛡️ **安全可控** - 权限管理、沙箱隔离
- 📊 **可监控** - 任务跟踪、性能监控  
- 🔄 **可恢复** - 错误处理、状态持久化
- 📈 **可扩展** - 模块化设计、插件系统
- 👥 **可协作** - 多代理、团队协作

## 🔧 12 个渐进式 Harness 机制

1. **核心循环** - 一个循环 + Bash 就是全部
2. **工具分发** - 添加工具 = 添加一个处理器
3. **规划模式** - 没有计划的代理会漂移
4. **子代理** - 分解大任务；清理每个子任务的上下文
5. **知识按需加载** - 需要时加载知识
6. **上下文压缩** - 上下文满了；腾出空间
7. **持久化任务** - 大目标 → 小任务 → 磁盘
8. **后台任务** - 慢操作在后台；代理保持思考
9. **代理团队** - 太大了就委托给队友
10. **团队协议** - 共享通信规则
11. **自动代理** - 队友扫描并认领任务
12. **防护栏杆** - 最后一道防线

## 🚀 在线访问

访问 GitHub Pages 查看详细分析：[https://masheal2333.github.io/claude-code-analysis](https://masheal2333.github.io/claude-code-analysis)

## 📁 项目结构

```
site/
├── index.html          # 主页面
├── css/
│   └── style.css      # 样式文件
├── js/
│   └── app.js         # 交互逻辑
└── README.md          # 项目说明
```

## 🛠️ 本地运行

```bash
# 克隆项目
git clone git@github.com:masheal2333/claude-code-analysis.git

# 进入项目目录
cd claude-code-analysis

# 启动本地服务器
python3 -m http.server 8000

# 访问 http://localhost:8000
```

## 📊 技术栈

- HTML5 + CSS3
- JavaScript (ES6+)
- Mermaid.js (架构图)
- GitHub Pages (部署)

## 📝 许可证

基于 Claude Code v2.1.88 源码分析 | 创建于 2026-03-31
