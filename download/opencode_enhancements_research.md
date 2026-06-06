# OpenCode AI Coding Agent: Plugins, MCP Servers & Enhancement Tools
## Comprehensive Research Report — Task 1-b

> **OpenCode** (github.com/anomalyco/opencode, formerly opencode-ai/opencode) is an open-source, terminal-first AI coding agent with 95K+ GitHub stars and 2.5M monthly developers. It supports plugins, skills (SKILL.md), MCP servers, LSP integration, and multi-provider model access.

---

## 1. TOP OPENCODE PLUGINS & EXTENSIONS

### 1.1 Oh-My-OpenCode / Oh-My-OpenAgent ⭐⭐⭐⭐⭐
| Field | Details |
|-------|---------|
| **Name** | Oh-My-OpenAgent (formerly Oh-My-OpenCode) |
| **GitHub** | https://github.com/code-yeongyu/oh-my-openagent |
| **What it does** | Multi-agent orchestration plugin — runs background agents, calls specialized agents (oracle, librarian, frontend engineer), provides LSP/AST tools, curated MCPs, and full Claude Code-compatible skills system. The #1 community plugin. |
| **Stars** | ~5K+ (est.) |
| **YouTube** | "Oh My OpenCode Is Actually Insane" — 7 specialized AI agents orchestrated |
| **Last Updated** | Active (June 2026) |

### 1.2 Superpowers ⭐⭐⭐⭐⭐
| Field | Details |
|-------|---------|
| **Name** | Superpowers |
| **GitHub** | https://github.com/obra/superpowers |
| **Author** | Jesse Vincent (obra) — Prime Radiant |
| **What it does** | Agentic skills framework & software development methodology. Adds mandatory skill checking, TDD discipline, systematic debugging, git worktree management, and a full skills discovery system (find_skills + use_skills tools). Works with OpenCode, Claude Code, and Codex. |
| **Stars** | 140K+ (reported across related repos) |
| **Key Feature** | Claude Code-compatible skills system ported to OpenCode |
| **Last Updated** | v5.1.0 (2026) |

### 1.3 OpenCode Browser ⭐⭐⭐⭐
| Field | Details |
|-------|---------|
| **Name** | OpenCode Browser |
| **GitHub** | https://github.com/different-ai/opencode-browser |
| **What it does** | Browser automation plugin using direct Chrome DevTools Protocol (CDP) connections. Allows the AI agent to navigate, interact with, and extract data from web pages. |
| **Stars** | ~500+ (est.) |
| **Last Updated** | 2025 |

### 1.4 OpenCode Daytona Sandbox ⭐⭐⭐⭐
| Field | Details |
|-------|---------|
| **Name** | @jamesmurdza/opencode-daytona |
| **NPM** | https://www.npmjs.com/package/@jamesmurdza/opencode-daytona |
| **What it does** | Runs OpenCode sessions inside isolated Daytona sandboxes. Each session gets its own remote sandbox, and changes are synced back via Git branches. Enables cloud-based agent execution with live previews. |
| **Stars** | ~200+ |
| **Last Updated** | 2026 |

### 1.5 OpenCode Gemini Auth ⭐⭐⭐⭐
| Field | Details |
|-------|---------|
| **Name** | opencode-gemini-auth |
| **GitHub** | https://github.com/jenslys/opencode-gemini-auth |
| **NPM** | @spmurrayzzz/opencode-gemini-auth |
| **What it does** | Authenticates OpenCode with Google account for Gemini access. Uses your existing Gemini plan quota instead of API billing. Adds Google Search tool integration. |
| **Stars** | ~300+ |
| **Last Updated** | 2026 |

### 1.6 Google Antigravity Auth Plugin ⭐⭐⭐
| Field | Details |
|-------|---------|
| **Name** | opencode-google-antigravity-auth |
| **GitHub** | https://github.com/shekohex/opencode-google-antigravity-auth |
| **What it does** | Exposes a google_search tool that allows models to fetch real-time information from the web using Google Search and URL context extraction. |
| **Stars** | ~100+ |
| **Last Updated** | 2025 |

### 1.7 OpenCode Worktree ⭐⭐⭐
| Field | Details |
|-------|---------|
| **Name** | OpenCode Worktree |
| **What it does** | Zero-friction git worktrees for OpenCode. Auto-spawns terminals, syncs files, cleans up on exit. Supports OpenCode Go, Cursor, GitHub. Enables parallel agent work on different branches. |
| **Source** | Listed in awesome-opencode & opencode.ai/docs/ecosystem |
| **Last Updated** | 2026 |

### 1.8 OpenSpec Plugin ⭐⭐⭐⭐
| Field | Details |
|-------|---------|
| **Name** | opencode-plugin-openspec |
| **GitHub** | https://github.com/Octane0411/opencode-plugin-openspec |
| **Related** | https://github.com/Fission-AI/OpenSpec |
| **What it does** | Integrates OpenSpec for spec-driven development (SDD). Adds a dedicated 'openspec-plan' mode for creating and editing spec files. Enforces "agree before you build" — human and AI align on specs before coding. |
| **Stars** | ~500+ (OpenSpec) |
| **Last Updated** | 2026 |

### 1.9 Context7 Plugin ⭐⭐⭐⭐
| Field | Details |
|-------|---------|
| **Name** | Context7 for OpenCode |
| **What it does** | Gives OpenCode fresh, up-to-date library documentation so it stops guessing outdated APIs. Fetches version-specific docs and code examples for any library, eliminating hallucinated references. |
| **Source** | Listed in Composio best plugins list, also available as MCP server |
| **Last Updated** | 2026 |

### 1.10 OpenCode ntfy.sh / Notification Plugins ⭐⭐⭐
| Field | Details |
|-------|---------|
| **Name** | opencode-ntfy.sh / opencode-notify / opencode-notifier |
| **GitHub** | https://github.com/lannuttia/opencode-ntfy.sh, https://github.com/kdcokenny/opencode-notify, https://github.com/mohak34/opencode-notifier |
| **What it does** | Push notifications via ntfy.sh or native OS notifications when tasks complete, errors occur, AI needs input, or permissions are required. Keeps you informed when you step away from the terminal. |
| **Stars** | 50-200 each |
| **Last Updated** | 2025-2026 |

### 1.11 OpenCode Agent Tmux ⭐⭐⭐
| Field | Details |
|-------|---------|
| **Name** | OpenCode Agent Tmux |
| **What it does** | Real-time tmux panes for OpenCode agents with auto-launch, streaming, and cleanup. Enables parallel agent execution in separate tmux sessions. |
| **Source** | Listed in awesome-opencode |
| **Last Updated** | 2026 |

### 1.12 OpenCode Agent Skills Plugin ⭐⭐⭐
| Field | Details |
|-------|---------|
| **Name** | opencode-agent-skills |
| **GitHub** | https://github.com/joshuadavidthomas/opencode-agent-skills |
| **What it does** | Dynamic skills plugin for OpenCode that provides tools for loading and using reusable AI agent skills. Note: OpenCode now includes first-party support for skills via the native skill tool. |
| **Stars** | ~100+ |
| **Last Updated** | 2025 |

### 1.13 OpenCode Power Pack ⭐⭐⭐
| Field | Details |
|-------|---------|
| **Name** | opencode-power-pack |
| **What it does** | 11 Claude Code skills ported to OpenCode: code-review, security-review, feature-dev, frontend-design, MCP server authoring, AGENTS.md/CLAUDE.md management + 5 more. One config line, one plugin. |
| **Source** | Listed on skillsllm.com (361 installs tracked) |
| **Last Updated** | 2025 |

### 1.14 OpenCode Kit ⭐⭐⭐
| Field | Details |
|-------|---------|
| **Name** | opencode-kit |
| **GitHub** | https://github.com/skeletorflet/opencode-kit |
| **What it does** | Integrates oh-my-opencode with Daytona sandbox MCP and other tools. Complete starter kit for setting up OpenCode with multi-agent orchestration. |
| **Stars** | ~50+ |
| **Last Updated** | 2026 |

---

## 2. SKILLS ECOSYSTEM (SKILL.md)

OpenCode has a native skills system. Skills are markdown instruction files (SKILL.md) placed in `.opencode/skills/` directories that agents discover and use on-demand.

### 2.1 Antigravity Awesome Skills ⭐⭐⭐⭐⭐
| Field | Details |
|-------|---------|
| **Name** | Antigravity Awesome Skills |
| **GitHub** | https://github.com/sickn33/antigravity-awesome-skills |
| **What it does** | 1,500+ installable agentic skills for Claude Code, Cursor, Codex CLI, Gemini CLI, Antigravity, and OpenCode. Covers code review, security, feature development, frontend design, debugging, TDD, git workflows, and more. |
| **Stars** | ~15K+ |
| **Last Updated** | June 2026 |

### 2.2 Anthropic Official Skills
| Field | Details |
|-------|---------|
| **Name** | Anthropic Skills (anthropics/claude-code-skills) |
| **What it does** | Official skills system and reusable patterns from Anthropic. Compatible with OpenCode via the skills format. |
| **Source** | Referenced by multiple community members |

### 2.3 Caveman Skill
| Field | Details |
|-------|---------|
| **Name** | Caveman |
| **What it does** | Context savings skill that reduces token usage by compressing context. Popular for local model users. |
| **Source** | YouTube: "Can You Replace Claude Code/Codex with OpenCode and a Local Model?" |

### 2.4 Custom Skills
Skills are placed in:
- Project: `.opencode/skills/`
- Global: `~/.opencode/skills/`
- Any directory via `config.skills.paths.push()`

The `SKILL.md` format has become a de-facto portable standard across Claude Code, Codex, Cursor, Gemini CLI, and OpenCode.

---

## 3. MCP SERVERS COMPATIBLE WITH OPENCODE

OpenCode supports MCP (Model Context Protocol) servers natively via `opencode.json` configuration. Add both local and remote servers.

### 3.1 Top MCP Servers for Coding Agents

| # | MCP Server | GitHub/URL | What it does | Stars |
|---|-----------|-----------|-------------|-------|
| 1 | **GitHub MCP** | github.com/github/github-mcp-server | Repository management, PRs, issues, code search | 15K+ |
| 2 | **Supabase MCP** | github.com/supabase-community/supabase-mcp | Database queries, auth, storage, edge functions | 2K+ |
| 3 | **PostgreSQL MCP** | github.com/modelcontextprotocol/servers | Direct SQL queries and schema inspection | 5K+ (server repo) |
| 4 | **Playwright MCP** | github.com/anthropics/anthropic-quickstarts | Browser automation, testing, web scraping | 3K+ |
| 5 | **Figma MCP** | github.com/figma/mcp | Design-to-code, component extraction | 1K+ |
| 6 | **Sentry MCP** | github.com/getsentry/sentry-mcp | Error tracking, performance monitoring | 500+ |
| 7 | **Context7 MCP** | github.com/upstash/context7-mcp | Fresh, version-specific library documentation | 3K+ |
| 8 | **Firecrawl MCP** | github.com/mendableai/firecrawl-mcp-server | Web scraping, crawling, and search | 5K+ |
| 9 | **Filesystem MCP** | github.com/modelcontextprotocol/servers | Safe file system operations | 5K+ (server repo) |
| 10 | **Sequential Thinking MCP** | github.com/modelcontextprotocol/servers | Structured reasoning and problem decomposition | 5K+ (server repo) |
| 11 | **Kubernetes MCP** | Red Hat Developer | Kubernetes cluster management and deployment | — |
| 12 | **Fetch MCP** | github.com/modelcontextprotocol/servers | HTTP requests and web content fetching | 5K+ (server repo) |
| 13 | **Composio MCP** | github.com/composiodev/composio-mcp | 250+ app integrations (Gmail, Slack, GitHub, etc.) | 10K+ |

### 3.2 How to Configure MCP in OpenCode

```json
// opencode.json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": { "GITHUB_TOKEN": "..." }
    },
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"]
    }
  }
}
```

### 3.3 MCP Directories
- **MCPMarket**: https://mcpmarket.com — Top 100 MCP Servers leaderboard
- **MCP Servers Org**: https://mcpservers.org — Awesome MCP Servers directory
- **Best-of-MCP**: https://github.com/tolkonepiu/best-of-mcp-servers — 400+ ranked servers, updated weekly

---

## 4. ALTERNATIVE ENHANCEMENT TOOLS

### 4.1 LSP Integration (Built-in)
OpenCode has native LSP support. Configure in `opencode.json`:
```json
{
  "lsp": {
    "enabled": true
  }
}
```
- Provides go-to-definition, diagnostics, hover info, completions
- Supports TypeScript, Go, Python, Rust, and more
- LSP events: `lsp.updated`, `lsp.diagnostics`

### 4.2 AI Model Routers & Proxies

| Tool | URL | What it does | Stars |
|------|-----|-------------|-------|
| **OpenRouter** | https://openrouter.ai | Single API endpoint to 300+ models. Free models available. Built-in OpenCode support. Tracks model usage statistics. | — |
| **LiteLLM** | https://github.com/BerriAI/litellm | Open-source proxy that provides OpenAI-compatible API to 100+ LLM providers. Load balancing, fallbacks, rate limiting. Self-hosted. | 20K+ |
| **Ollama** | https://github.com/ollama/ollama | Run local LLMs (Llama, Mistral, DeepSeek, etc.) with OpenCode. Zero-cost AI coding with local models. | 130K+ |
| **OpenCode Zen** | Built-in | OpenCode's curated model selection — handpicked AI models tested and benchmarked specifically for coding agents. | — |
| **vLLM Studio** | Third-party | High-performance local model serving optimized for coding agents. | — |

### 4.3 Terminal Enhancers
| Tool | What it does |
|------|-------------|
| **Ghostty** | Modern GPU-accelerated terminal. Recommended by oh-my-opencode users for best OpenCode TUI experience. |
| **tmux** | Terminal multiplexer for parallel OpenCode sessions. Integrated via opencode-agent-tmux plugin. |
| **Kitty** | GPU-based terminal with good OpenCode TUI rendering. |

### 4.4 Git Workflow Tools
| Tool | What it does |
|------|-------------|
| **OpenCode GitHub Integration** | Built-in: Mention `/opencode` or `/oc` in GitHub comments, and OpenCode executes tasks within GitHub Actions runner. |
| **OpenCode Worktree** | Git worktree management for parallel agent execution on different branches. |
| **Spec Kit** | github.com/github/spec-kit — GitHub's official spec-driven development toolkit. Works with OpenCode skills. |

### 4.5 Agent Orchestrators
| Tool | GitHub | What it does | Stars |
|------|--------|-------------|-------|
| **Conductor** | Various | Multi-agent orchestration layer. Runs OpenCode sessions with parallel background agents. Community evolved from oh-my-opencode → Conductor pattern. | — |
| **Claw Orchestrator** | github.com/Enderfga/claw-orchestrator | Run Claude Code, Codex, Gemini, Cursor Agent and custom coding CLIs as one unified runtime. | — |
| **OpenCode Orchestrator** | Reddit: r/opencodeCLI | Spins up OpenCode automatically when GitHub issues are posted, reads context, and generates PRs. | — |

---

## 5. COMMUNITY RECOMMENDATIONS

### 5.1 Reddit (r/opencodeCLI, r/LocalLLaMA, r/ClaudeCode)

**Top-voted recommendations:**
1. **"OpenCode + Oh-My-Code is the killer combo"** — Multiple users on r/opencodeCLI
2. **"OpenCode, by reason of plugins alone, is better than all of them"** — Hacker News
3. **"Best is OpenCode with GitHub Opus 4.6"** — HN user
4. **"I tried Claude Code, switched to OpenCode + Oh-My-Code, then finally switched to Conductor + Claude Code + Lots of Plugins and Skills"** — dev.to article by chand1012
5. **Superpowers + Caveman skill** recommended for local model users — YouTube: "Can You Replace Claude Code/Codex with OpenCode and a Local Model?"
6. **Firecrawl MCP + Skills + Oh-My-OpenCode** — Reddit user tested 9 MCP tools
7. **OpenRouter for free model access** — Multiple community members
8. **DeepSeek through their API is better than via OpenRouter** — Reddit r/opencodeCLI

### 5.2 Hacker News (Item #47460525)

Key takeaways from the OpenCode HN thread:
- OpenCode's plugin ecosystem is its key differentiator over Claude Code
- Community values open-source nature and self-hosting capability
- Multi-agent orchestration (oh-my-opencode pattern) is trending
- Free model access via OpenRouter/Ollama is a major draw

### 5.3 Dev.to / Blog Recommendations

**Addy Osmani (Medium):** "My LLM coding workflow going into 2026" — mentions OpenCode as part of the AI coding stack

**Jesse Vincent (blog.fsck.com):** Creator of Superpowers plugin — advocates for skill-driven development with systematic debugging and TDD discipline

**Alex Lavaee (alexlavaee.me):** "How I Shipped 100k LOC in 2 Weeks with Coding Agents" — recommends Superpowers + Anthropic Skills stack

### 5.4 YouTube Creator Consensus

- **The AI Continuum**: "7 OpenCode Plugins That Make AI Coding More Powerful"
- **DevOps Toolbox**: "My OpenCode Workflow As A Senior Engineer" — recommends Oh-My-OpenCode + Ghostty
- **Web Dev Simplified**: "The Best Local Agentic Coding Workflow" — OpenCode + Ollama

---

## 6. CURATED "ABOVE MEDIOCRITY" STACK

Based on all research, here is the recommended enhancement stack to make OpenCode deliver "above mediocrity":

### Tier 1 — Essential (Install First)
| # | Plugin/Tool | Why |
|---|-----------|-----|
| 1 | **Oh-My-OpenAgent** | Multi-agent orchestration, background agents, specialized agents |
| 2 | **Superpowers** | Skills framework, TDD discipline, systematic debugging |
| 3 | **Context7 MCP** | Fresh library docs, stops hallucinated API references |
| 4 | **GitHub MCP** | Repository management, PRs, issues from within agent |

### Tier 2 — High Impact
| # | Plugin/Tool | Why |
|---|-----------|-----|
| 5 | **OpenSpec Plugin** | Spec-driven development, agree before you build |
| 6 | **Antigravity Awesome Skills** | 1,500+ reusable skills for any workflow |
| 7 | **Firecrawl MCP** | Web scraping, real-time data access |
| 8 | **OpenRouter** | Access to 300+ models including free tiers |
| 9 | **OpenCode Gemini Auth** | Free Gemini access via existing Google plan |

### Tier 3 — Quality of Life
| # | Plugin/Tool | Why |
|---|-----------|-----|
| 10 | **OpenCode ntfy/notify** | Push notifications when agent needs input |
| 11 | **OpenCode Worktree** | Parallel work on branches |
| 12 | **OpenCode Daytona Sandbox** | Cloud-based isolated execution |
| 13 | **OpenCode Browser** | Web automation via CDP |
| 14 | **LSP Integration** | Built-in code intelligence (just enable it) |
| 15 | **Ollama** | Local model fallback for zero-cost coding |

### Configuration Example

```json
// opencode.json — "Above Mediocrity" Stack
{
  "lsp": { "enabled": true },
  "plugins": [
    "oh-my-openagent",
    "superpowers",
    "opencode-gemini-auth"
  ],
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": { "GITHUB_TOKEN": "${GITHUB_TOKEN}" }
    },
    "firecrawl": {
      "command": "npx",
      "args": ["-y", "firecrawl-mcp"],
      "env": { "FIRECRAWL_API_KEY": "${FIRECRAWL_API_KEY}" }
    },
    "supabase": {
      "command": "npx",
      "args": ["-y", "@supabase/mcp-server-supabase"],
      "env": { "SUPABASE_ACCESS_TOKEN": "${SUPABASE_ACCESS_TOKEN}" }
    }
  },
  "provider": {
    "openrouter": {
      "apiKey": "${OPENROUTER_API_KEY}"
    }
  }
}
```

---

## 7. PLUGIN DEVELOPMENT ECOSYSTEM

### How to Create OpenCode Plugins

OpenCode plugins are TypeScript modules using the `@opencode-ai/plugin` SDK:

```typescript
import { Plugin, tool } from '@opencode-ai/plugin'

export const MyPlugin: Plugin = async (ctx) => {
  return {
    tool: {
      myTool: tool({
        description: 'Custom tool',
        args: { input: tool.schema.string() },
        execute: async (args) => `Result: ${args.input}`,
      }),
    },
    auth: { provider: 'myservice', methods: [...] },
    event: async ({ event }) => console.log(event.type),
    'chat.message': async ({}, { message }) => { /* intercept messages */ },
    'chat.params': async ({ model }, { temperature, options }) => { /* modify params */ },
    'permission.ask': async (perm, out) => { out.status = 'allow' },
    'tool.execute.before': async ({ tool }, { args }) => { /* preprocess */ },
    'tool.execute.after': async ({ tool }, { output }) => { /* postprocess */ },
  }
}
```

### Plugin Context API
- `ctx.client` — OpenCode SDK client (localhost:4096)
- `ctx.project.id` — Project identifier (git hash or "global")
- `ctx.project.worktree` — Git worktree root
- `ctx.directory` — Current working directory
- `ctx.$\`command\`` — Bun shell for executing commands

### Available Hook Events
- **Session**: session.created, session.updated, session.deleted, session.error, session.idle
- **Message**: message.updated, message.removed, message.part.updated
- **File**: file.edited, file.watcher.updated
- **Permission**: permission.updated, permission.replied
- **LSP**: lsp.updated, lsp.diagnostics
- **TUI**: tui.prompt.append, tui.command.execute, tui.toast.show
- **Other**: server.connected, installation.updated, ide.installed

---

## 8. KEY RESOURCES

| Resource | URL |
|----------|-----|
| OpenCode Official | https://opencode.ai |
| OpenCode GitHub | https://github.com/anomalyco/opencode |
| OpenCode Docs — Plugins | https://opencode.ai/docs/plugins |
| OpenCode Docs — MCP | https://opencode.ai/docs/mcp-servers |
| OpenCode Docs — Skills | https://opencode.ai/docs/skills |
| OpenCode Docs — Ecosystem | https://opencode.ai/docs/ecosystem |
| Awesome OpenCode | https://github.com/awesome-opencode/awesome-opencode |
| Awesome OpenCode Website | https://www.awesome-opencode.com |
| Plugin Dev Guide (Gist) | https://gist.github.com/rstacruz/946d02757525c9a0f49b25e316fbe715 |
| MCPMarket Leaderboard | https://mcpmarket.com/leaderboards |
| Best-of-MCP-Servers | https://github.com/tolkonepiu/best-of-mcp-servers |
| Subreddit r/opencodeCLI | https://www.reddit.com/r/opencodeCLI |

---

*Research conducted using web search, page reading, and community source analysis. Data current as of July 2026.*
