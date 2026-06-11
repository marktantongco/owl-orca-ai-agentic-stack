# Oh-My-OpenCode Variants Research Report

**Research Date**: 2025-07-17 (web data references dates up to June 2026 due to source timestamps)  
**Task ID**: 1-a  
**Purpose**: Comprehensive research on oh-my-opencode and oh-my-opencode-slim for AI Agentic Stack Blueprint

---

## 1. oh-my-opencode (Original — Now Renaming to oh-my-openagent)

### Identity & Sources

| Field | Value |
|-------|-------|
| **GitHub Repo (Original)** | `code-yeongyu/oh-my-opencode` |
| **GitHub Repo (Renamed)** | `code-yeongyu/oh-my-openagent` |
| **Alt GitHub Mirror** | `opensoft/oh-my-opencode` |
| **npm Package** | `oh-my-opencode` (dual-published as `oh-my-openagent`) |
| **Official Website** | https://ohmyopenagent.com/docs |
| **SourceForge Mirror** | https://sourceforge.net/projects/ohmyopencode.mirror |
| **DeepWiki** | https://deepwiki.com/code-yeongyu/oh-my-opencode |

### Metrics

| Metric | Value |
|--------|-------|
| **GitHub Stars** | ~38,000 (Reddit source: "38,000 for this plugin vs 118,000 for opencode itself") |
| **npm Weekly Downloads** | ~57,270–61,700 (Aikido Intel reports 61.7K; npmjs shows 60,956) |
| **Latest npm Version** | 4.7.5 |
| **Latest Release** | ~June 2, 2026 (npm last publish date) |
| **License** | SUL-1.0 (Source Available License) |
| **Platform Binaries** | oh-my-opencode-darwin-arm64 (latest: 4.5.12 at time of search) |

### Author / Maintainer

- **Primary Author**: `code-yeongyu` (GitHub/npm)
- **Maintainer Note**: "The maintainer builds and maintains oh-my-openagent in real-time with Jobdori, an AI assistant running on a heavily customized fork of OpenClaw."
- **Organization**: `opensoft` (GitHub org — hosts the opensoft/oh-my-opencode mirror/fork)
- **Community**: Active Discord server

### Description

> "The Best AI Agent Harness — Batteries-Included OpenCode Plugin with Multi-Model Orchestration, Parallel Background Agents, and Crafted LSP/AST Tools"

oh-my-opencode is a multi-agent orchestration plugin for OpenCode that transforms a single AI coding agent into a coordinated development team. It orchestrates multiple specialized AI agents working in parallel, with each agent assigned to a specific role based on task type. It also provides Claude Code compatibility, allowing CC skills, hooks, commands, and agents to work in OpenCode.

### Agents (11 Built-in)

| Agent | Role | Optimal Model |
|-------|------|---------------|
| **Sisyphus** | Main orchestrator — decides when to delegate, plans, and executes | Claude Opus 4.5 |
| **Prometheus** | Planner — creates detailed implementation plans | Multi-model (auto-detects) |
| **Atlas** | Planner (alternate) — structured planning with model switching | Multi-model (auto-detects) |
| **Oracle** | Architecture decisions, code review, debugging (read-only consultation) | GPT family |
| **Librarian** | Documentation and code search | Claude Sonnet |
| **Explore** | Fast codebase grep and exploration | Lightweight model |
| **Hephaestus** | Implementation agent (delegated by Sisyphus) | — |
| **Metis** | Analysis agent | — |
| **Momus** | Critic/review agent | — |
| **Multimodal** | Vision/multimodal tasks | Vision-capable model |
| + Background agents | Parallel background task execution | — |

### Key Features

1. **11 Specialized Agents** — Mythological naming convention, each designed for a specific task
2. **Ultrawork Mode** — One-click activation of all features; full autonomous mode
3. **Prometheus Planning Mode** — Precise, structured planning before execution
4. **Multi-Model Orchestration** — Each agent routes to its optimal model (Claude, GPT, Gemini, Grok, GLM)
5. **54+ Lifecycle Hooks** — Deep integration with OpenCode events
6. **5 Built-in MCPs** — Model Context Protocol servers included
7. **20+ Tools** — Including LSP, AST-Grep, code search
8. **Parallel Background Agents** — Async sub-agents (similar to Claude Code Agent Teams)
9. **Claude Code Compatibility** — CC skills, hooks, commands, agents work in OpenCode
10. **Auto Model Configuration** — Automatically configures models based on available providers
11. **Slash Commands** — All built-in slash commands
12. **Hashline Edits** — Efficient edit format
13. **Team Mode** — Coordinated multi-agent operation

### Controversies & Criticisms

- **Anthropic cited oh-my-opencode** as justification for blocking OpenCode, noting that "some plugins that spoof Claude Code's oauth request signatures exist in the community"
- **Token Bloat**: Startup overhead of 15,000–25,000 tokens before any work begins (glukhov.org benchmark)
- **3× More Requests**: Benchmarked at 3× more API requests than vanilla OpenCode
- **Pass Rate**: 69% vs 73% for vanilla OpenCode in some benchmarks
- **"Bloated garbage"**: Reddit users criticize it as over-engineered and overly opinionated
- **Token Usage Creep**: Users report token usage climbing while outcomes flatline
- **Rename Confusion**: Package renamed from oh-my-opencode → oh-my-openagent broke existing configs

### Rename Status

- The repo is being renamed from `oh-my-opencode` to `oh-my-openagent`
- npm package still published as `oh-my-opencode` (dual-published as `oh-my-openagent`)
- In `opencode.json`, compatibility layer prefers `oh-my-openagent`, legacy `oh-my-opencode` entries still load with a warning
- Restructuring to support multiple agent harnesses (OpenCode, Codex, Pi, and others)

---

## 2. oh-my-opencode-slim

### Identity & Sources

| Field | Value |
|-------|-------|
| **GitHub Repo** | `alvinunreal/oh-my-opencode-slim` |
| **npm Package** | `oh-my-opencode-slim` |
| **Official Website** | https://ohmyopencodeslim.com |
| **SourceForge** | https://sourceforge.net/projects/oh-my-opencode-slim.mirror |

### Metrics

| Metric | Value |
|--------|-------|
| **GitHub Stars** | ~5,100 (GitHub profile snippet: "TypeScript 5.1k") |
| **GitHub Forks** | 335 |
| **npm Weekly Downloads** | ~7,202 |
| **Latest Version** | 1.1.1 |
| **Last Published** | ~8 days before search (late May/early June 2026) |
| **Total Releases** | 39 |
| **License** | MIT |

### Author / Maintainer

- **Primary Author**: Alvin (`@alvinunreal` on GitHub)
- **Also maintains**: `tmuxai` (another project)
- **Community**: Active on r/opencodeCLI subreddit

### Description

> "Slimmed, cleaned and fine-tuned oh-my-opencode fork, consumes much less tokens"

oh-my-opencode-slim is a lightweight, optimized fork of oh-my-opencode that delivers high-performance multi-agent coding workflows while significantly reducing token consumption and system overhead. It retains the core concept of orchestrating multiple specialized AI agents but with concise system prompts and efficient delegation.

> "Seven divine beings emerged from the dawn of code, each an immortal master of their craft — await your command to forge order from chaos and build what was once thought impossible."

### Agents (7 Core + 2 Optional)

| Agent | Role |
|-------|------|
| **Orchestrator** | Main agent — decides whether to delegate or execute, follows strict delegation efficiency rules |
| **Scout** | Codebase exploration — scouts and maps code structure |
| **Researcher** | Fresh documentation lookup — searches for up-to-date docs |
| **Reviewer** | Architecture review — reviews code structure and decisions |
| **Implementer** | Well-scoped implementation tasks — bounded coding work |
| **Observer** | (Optional, v1.0+) — monitoring/oversight agent |
| **Council** | (Optional, v1.0+) — multi-model consensus; runs several councillors in parallel, then synthesizes into one answer |
| + Custom Dynamic Agents | (v1.0+) — Janitor-inspired custom agents |

### Key Features

1. **7+ Specialized Agents** — Clear, functional naming (Scout, Reviewer, Researcher, Implementer)
2. **Token Efficiency** — Primary selling point; "consumes much less tokens" than original
3. **Council Agent** — Multi-model consensus for higher confidence answers (parallel councillors)
4. **Observer Agent** — Monitoring/oversight capability (optional)
5. **Custom Dynamic Agents** — Janitor-inspired custom agent creation
6. **/interview Feature** — Interactive interview/questioning mode
7. **Preset System** — OpenAI preset (default: gpt-5.5 + gpt-5.4-mini) and OpenCode Go preset
8. **Background Agents** — v2 beta introduces background agent panels
9. **Concise Prompts** — Each agent's system prompt is concise, reducing token waste
10. **Local Entry File** — Plugin points to a local entry file instead of npm package (for manual updates)
11. **MIT License** — Truly open source (vs SUL-1.0)

### v2 Beta (In Progress)

- Background agents with configurable review panels
- Dispatched by orchestrator (not separate top-level agent)
- After implementation, review panel runs automatically

---

## 3. Head-to-Head Comparison

| Dimension | oh-my-opencode | oh-my-opencode-slim |
|-----------|---------------|---------------------|
| **GitHub Stars** | ~38,000 | ~5,100 |
| **npm Weekly Downloads** | ~57,000–62,000 | ~7,200 |
| **Agent Count** | 11 built-in | 7 core + 2 optional + custom |
| **Agent Naming** | Mythological (Sisyphus, Prometheus, Oracle…) | Functional (Scout, Reviewer, Implementer…) |
| **Startup Token Overhead** | 15,000–25,000 tokens | Significantly less (no exact number) |
| **API Requests** | ~3× more than vanilla OpenCode | Closer to vanilla (community reports) |
| **Benchmark Pass Rate** | 69% (glukhov.org) | Not independently benchmarked; community reports better efficiency |
| **License** | SUL-1.0 (Source Available) | MIT (Open Source) |
| **Hooks** | 54+ lifecycle hooks | Minimal hooks |
| **Built-in MCPs** | 5 | Fewer (core MCPs only) |
| **Tools** | 20+ (LSP, AST-Grep, etc.) | Streamlined subset |
| **Claude Code Compatibility** | Full (skills, hooks, agents) | Limited |
| **Multi-Model Routing** | Advanced per-agent model routing | Basic preset-based |
| **Autonomous Mode** | Ultrawork (full auto) | No equivalent |
| **Planning Mode** | Prometheus/Atlas (detailed planning) | Orchestrator-driven |
| **Council/Consensus** | No | Yes (Council agent) |
| **Custom Agents** | No | Yes (dynamic agents) |
| **Active Development** | Very active (4.7.x) | Active (1.1.x, v2 beta) |
| **Maturity** | v3+ stable, v4.x cutting edge | v1.x stable, v2 beta |
| **Fork Relationship** | Original | Fork of oh-my-opencode |
| **Rename Status** | Renaming to oh-my-openagent | Stays as oh-my-opencode-slim |
| **Controversy** | Anthropic block citation, token bloat | None significant |
| **Community Size** | Large (Discord, Reddit) | Smaller but growing |

---

## 4. Advantages of Each

### oh-my-opencode Advantages

1. **Feature Completeness** — Batteries-included with 11 agents, 54+ hooks, 5 MCPs, 20+ tools
2. **Claude Code Ecosystem Compatibility** — Full CC skills, hooks, commands, agents migration
3. **Advanced Orchestration** — Ultrawork mode for fully autonomous operation
4. **Sophisticated Planning** — Prometheus and Atlas planning agents with multi-model auto-detection
5. **Multi-Agent Harness Vision** — Expanding beyond OpenCode to Codex, Pi, and others
6. **Large Community** — 38K stars, 57K+ weekly npm downloads, active Discord
7. **Professional Tooling** — LSP, AST-Grep, and other crafted developer tools
8. **Background Parallel Agents** — True async sub-agent execution
9. **Auto Model Configuration** — Intelligent model routing based on available providers
10. **Documentation** — Extensive docs at ohmyopenagent.com, DeepWiki, Chinese guides

### oh-my-opencode-slim Advantages

1. **Token Efficiency** — Dramatically lower token consumption; primary design goal
2. **Clear Agent Naming** — Functional names (Scout, Reviewer) vs mythological (Oracle, Metis)
3. **MIT License** — Truly open source, no source-available restrictions
4. **Council Agent** — Unique multi-model consensus for higher confidence answers
5. **Custom Dynamic Agents** — Extensible with user-created agents (Janitor-inspired)
6. **Lighter Weight** — Smaller footprint, less overhead, faster startup
7. **Cost Effective** — Lower API costs due to reduced token usage
8. **Simpler Configuration** — Fewer moving parts, less opinionated
9. **No Controversy** — Not cited by Anthropic, no OAuth spoofing concerns
10. **v2 Beta Features** — Background agents with configurable review panels

---

## 5. OpenCode Plugin Ecosystem

### Plugin Infrastructure

| Resource | URL |
|----------|-----|
| **Official Plugin Docs** | https://opencode.ai/docs/plugins |
| **Official Ecosystem Page** | https://opencode.ai/docs/ecosystem |
| **Plugin Marketplace (exp)** | https://opencode.im/plugin/oh-my-opencode |
| **Community Hub** | https://opencode.cafe |
| **Awesome List** | https://github.com/awesome-opencode/awesome-opencode |
| **VS Code Extension** | https://marketplace.visualstudio.com/items?itemName=sst-dev.opencode |
| **JetBrains Plugin** | https://plugins.jetbrains.com/plugin/30681-opencode |

### Notable OpenCode Plugins

| Plugin | Description |
|--------|-------------|
| **oh-my-opencode** | Multi-agent orchestration (38K stars) |
| **oh-my-opencode-slim** | Lightweight fork (5.1K stars) |
| **Superpowers** | Skill-based enhancement plugin by `obra` — registers skills, runs on OpenCode |
| **OpenAgents** | Plugin by darrenhinde — modular AI agents and commands |
| **opencode-plugin-starter** | Starter template for building OpenCode plugins |
| **opencode-agents** | Configs, prompts, agents, and plugins for enhanced workflows |
| **OpenSpec** | Lightweight spec-driven development companion (used alongside OMO-slim) |
| **BMAD** | Another plugin option (heavier than OpenSpec) |

### Community

- **Subreddit**: r/opencodeCLI (active discussion, plugin comparisons)
- **Reddit**: r/ClaudeCode (cross-community discussion about OMO)
- **Discord**: oh-my-opencode has an active Discord
- **YouTube**: Multiple review/tutorial videos
- **Awesome List**: 60+ plugins cataloged

---

## 6. Summary & Recommendations

**For users wanting maximum features and Claude Code compatibility**: oh-my-opencode (oh-my-openagent) is the clear choice. It has the largest community, most features, and deepest integration. However, expect higher token costs and more complexity.

**For users wanting token efficiency and simplicity**: oh-my-opencode-slim is the better choice. It provides the core multi-agent orchestration at a fraction of the token cost, with a cleaner codebase, MIT license, and unique features like Council consensus.

**For the AI Agentic Stack Blueprint**: Both should be documented. oh-my-opencode represents the "full-featured" path while oh-my-opencode-slim represents the "efficient" path. The Council agent feature in slim is particularly noteworthy for the blueprint as it addresses a different paradigm (multi-model consensus vs single-model delegation).

---

*Research completed using 14 web searches across GitHub, npm, Reddit, Medium, YouTube, SourceForge, and documentation sites.*
