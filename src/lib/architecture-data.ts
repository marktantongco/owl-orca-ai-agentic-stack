export interface ArchComponent {
  id: string
  label: string
  icon: string
  tags: string[]
  description: string
  stars?: string
  downloads?: string
}

export interface ArchLayer {
  id: string
  label: string
  icon: string
  color: string
  description: string
  components: ArchComponent[]
}

export const ARCHITECTURE_LAYERS: ArchLayer[] = [
  {
    id: 'user',
    label: 'User Layer — ADE & IDE',
    icon: '👤',
    color: '#f59e0b',
    description: 'Developer interfaces — CLI agents, IDE integrations, and coding environments. All OpenAI-compatible ADEs connect to the proxy stack via custom base URL.',
    components: [
      { id: 'opencode', label: 'OpenCode / Kilo CLI', icon: '⌨️', tags: ['CLI', 'Free', 'Zero-Config'], description: 'Terminal-first AI coding agent. OWL-ORCA natively injects owl-orca-virtual and kiro providers into opencode.jsonc — zero manual config needed.', stars: '95K', downloads: '2.5M/mo' },
      { id: 'orca-ade', label: 'Orca (stablyai)', icon: '🐋', tags: ['CLI', 'Free', 'Orchestrator'], description: 'The orchestrator ADE. Spawn 5 parallel agents in git worktrees, all routing through OWL-ORCA. Set OPENAI_BASE_URL=http://127.0.0.1:60001/v1 for fleet routing.', stars: '—', downloads: '—' },
      { id: 'goose', label: 'Goose (Block)', icon: '🪿', tags: ['CLI', 'Free', 'BYOK'], description: 'Autonomous coding agent. Add custom OpenAI provider pointing to Kiro Gateway (8333) for premium models or Orca Router (60001) for speed racing.', stars: '10K+', downloads: '200K+' },
      { id: 'zed', label: 'Zed Industries', icon: '📝', tags: ['IDE', 'Free', 'BYOK'], description: 'High-performance code editor. Add Custom Provider (OpenAI Compatible): Base URL = http://127.0.0.1:60001/v1, API Key = orca-racer.', stars: '55K+', downloads: '1M+' },
      { id: 'cursor', label: 'Cursor', icon: '🖥️', tags: ['IDE', 'Freemium'], description: 'AI-first code editor with agent mode. Set custom OpenAI base URL to Orca Router for free-tier pooled access.', stars: '50K+', downloads: '4M+' },
      { id: 'warp', label: 'Warp', icon: '🌀', tags: ['Terminal', 'Free', 'BYOK'], description: 'AI-powered terminal. Point custom OpenAI endpoint to http://127.0.0.1:60001/v1 for terminal completions via local stream racer.', stars: '20K+', downloads: '500K+' },
      { id: 'jetbrains-junie', label: 'JetBrains Junie / Air', icon: '☕', tags: ['IDE', 'BYOK'], description: 'JetBrains AI agent. Register Orca Router as custom OpenAI provider. Junie agents route through local proxy automatically.', stars: '—', downloads: '—' },
      { id: 'letta', label: 'Letta ADE', icon: '🧠', tags: ['CLI', 'Free', 'BYOK'], description: 'Stateful agent framework. Choose "Custom OpenAI" in LLM backend config and input Orca Router URL for free pooled reasoning.', stars: '15K+', downloads: '200K+' },
      { id: 'cline', label: 'Cline', icon: '🤖', tags: ['VS Code', 'Free'], description: 'Autonomous coding agent for VS Code. Set OPENAI_BASE_URL env var to route through OWL-ORCA proxy.', stars: '25K+', downloads: '1M+' },
      { id: 'aider', label: 'Aider', icon: '💬', tags: ['CLI', 'Free', 'OSS'], description: 'Git-native AI pair programmer. Set OPENAI_API_BASE=http://127.0.0.1:60001/v1 for free-tier racing.', stars: '30K+', downloads: '500K+' },
    ],
  },
  {
    id: 'silent-protocol',
    label: 'Silent Protocol — Pre-Response',
    icon: '🧭',
    color: '#06b6d4',
    description: 'Pre-response diagnostic layer that routes intelligence before action: diagnose need, identify blind spots, find simplest truth, route speed vs depth.',
    components: [
      { id: 'diagnose', label: 'Diagnose Need', icon: '🔍', tags: ['Core', 'Protocol'], description: 'Classify the task: speed (quick lookup) vs depth (deep analysis). Routes to optimal processing mode.' },
      { id: 'blindspots', label: 'Blind Spot Scan', icon: '👁️', tags: ['Core', 'Protocol'], description: 'Identify knowledge gaps, missing context, and potential hallucination triggers before generating.' },
      { id: 'simplest-truth', label: 'Simplest Truth', icon: '✨', tags: ['Core', 'Protocol'], description: 'Apply Occam\'s razor: find the most direct solution path, avoid over-engineering.' },
      { id: 'route-mode', label: 'Route Mode', icon: '🔀', tags: ['Core', 'Protocol'], description: 'Binary routing: Speed Mode (fast, cheap) or Depth Mode (thorough, multi-step) based on diagnosed need.' },
    ],
  },
  {
    id: 'proxy',
    label: 'OWL-ORCA Proxy Stack — Local Endpoints',
    icon: '🔀',
    color: '#10b981',
    description: 'The OWL-ORCA Master Installer v7.1.0 creates 3 local endpoints that replace third-party middleware. Standard OpenAI-compatible API on every port — any ADE with custom base URL support connects instantly.',
    components: [
      { id: 'orca-router', label: 'Orca Router (Port 60001)', icon: '🧠', tags: ['Brain', 'Racer', 'Circuit-Break'], description: 'The "Brain." Races GitHub Copilot Free and Antigravity Free. Translates protocols on the fly. Handles circuit breaking. Auto-injected into OpenCode/Kilo CLI. Endpoint: http://127.0.0.1:60001/v1 | Key: orca-racer' },
      { id: 'kiro-gateway', label: 'Kiro Gateway (Port 8333)', icon: '💪', tags: ['Heavy-Lifter', 'Premium', 'AWS'], description: 'The "Heavy Lifter." Uses AWS Builder ID (via kiro-cli) to access premium models: Claude Sonnet 4.5, DeepSeek 3.2, etc. — all free. Endpoint: http://127.0.0.1:8333/v1 | Key: kiro-gateway-8333' },
      { id: 'forward-proxy', label: 'Forward Proxy (Port 60000)', icon: '🚇', tags: ['Tunnel', 'HTTPS', 'Bypass'], description: 'The "Tunnel." asyncio HTTPS CONNECT tunnel handling outbound traffic and domain bypasses. Runs under the hood — ADEs never connect here directly.' },
      { id: 'litellm', label: 'LiteLLM', icon: '⚡', tags: ['Proxy', 'Free', 'OSS'], description: 'Python-based unified OpenAI-compatible proxy, 100+ providers, load balancing, fallbacks. Can be layered behind Orca Router for additional provider coverage.', stars: '20K+', downloads: '1M+' },
      { id: '9router', label: '9Router', icon: '🛤️', tags: ['Gateway', 'Free', 'RTK'], description: 'RTK compression, tier-based provider fallback, circuit breaker. Can complement OWL-ORCA for additional routing logic.', stars: '2K+', downloads: '50K+' },
    ],
  },
  {
    id: 'agent',
    label: 'Agent Orchestration — Multi-Agent Fleet',
    icon: '🤖',
    color: '#8b5cf6',
    description: 'Multi-agent orchestration with 5 primary agents and subagent series. Orca ADE spawns parallel agents in worktrees, all routing through the local proxy stack for zero-cost, zero-rate-limit fleet execution.',
    components: [
      { id: 'orchestrator', label: 'Orchestrator Agent', icon: '🎼', tags: ['Primary', 'Core'], description: 'Main agent: decides when to delegate vs execute, plans task decomposition, manages subagent lifecycle. Routes through Orca Router.' },
      { id: 'scout', label: 'Scout Agent', icon: '🔭', tags: ['Primary', 'Search'], description: 'Codebase exploration: maps structure, finds relevant files, identifies dependencies and patterns.' },
      { id: 'builder', label: 'Builder Agent', icon: '🔨', tags: ['Primary', 'Code'], description: 'Implementation specialist: writes, refactors, and tests code. Uses Kiro Gateway for premium model access.' },
      { id: 'reviewer', label: 'Reviewer Agent', icon: '🔍', tags: ['Primary', 'Quality'], description: 'Architecture review: evaluates code quality, security, performance. Routes through Orca Router for speed.' },
      { id: 'council', label: 'Council Agent', icon: '🏛️', tags: ['Primary', 'Consensus'], description: 'Multi-model consensus: runs parallel councillors across Orca Router and Kiro Gateway, synthesizes into one high-confidence answer.' },
    ],
  },
  {
    id: 'sandbox',
    label: 'Sandbox — Isolated Execution',
    icon: '🔒',
    color: '#e11d48',
    description: 'Run the OWL-ORCA install.sh inside sandboxed environments. Agents get free unlimited API access while file system access is kernel-isolated.',
    components: [
      { id: 'daytona-sandbox', label: 'Daytona Sandbox', icon: '🏖️', tags: ['Host', 'Sandbox', 'Cloud'], description: 'Spin up a Daytona workspace, run install.sh inside it, then run ADEs (Orca, Zed) in the same workspace. ADEs connect to localhost:60001 inside the sandbox.' },
      { id: 'nvidia-openshell', label: 'NVIDIA OpenShell', icon: '🛡️', tags: ['Host', 'Sandbox', 'Kernel'], description: 'Run install.sh inside an OpenShell container. Autonomous agents (like Goose) get free unlimited API, but file system is kernel-isolated. Maximum security.' },
    ],
  },
  {
    id: 'local',
    label: 'Local Models — Self-Hosted Fallback',
    icon: '🧠',
    color: '#ec4899',
    description: 'Self-hosted LLM inference for privacy, offline capability, and zero-cost fallback when cloud tiers are exhausted.',
    components: [
      { id: 'ollama', label: 'Ollama', icon: '🦙', tags: ['Local', 'Free', 'OSS'], description: 'Run LLMs locally with one command. Supports Llama 3, Mistral, DeepSeek, Qwen, and 100+ models. Fallback behind Orca Router.', stars: '130K+', downloads: '10M+' },
      { id: 'lmstudio', label: 'LM Studio', icon: '🏠', tags: ['Local', 'Free'], description: 'Desktop app for running local LLMs with GUI. Model discovery, chat interface, and API server.' },
      { id: 'vllm', label: 'vLLM', icon: '🚀', tags: ['Local', 'Free', 'OSS'], description: 'High-throughput local model serving with PagedAttention. Optimized for coding agent workloads.', stars: '35K+', downloads: '2M+' },
    ],
  },
  {
    id: 'host',
    label: 'Ubuntu Host — Infrastructure',
    icon: '🐧',
    color: '#f97316',
    description: 'Infrastructure layer: the OWL-ORCA install.sh runs here. Container runtime, service management, networking, and auto-start for all proxy services.',
    components: [
      { id: 'docker', label: 'Docker', icon: '🐳', tags: ['Infra', 'Free'], description: 'Container runtime for isolated agent execution, MCP servers, and proxy services.' },
      { id: 'systemd', label: 'Systemd', icon: '⚙️', tags: ['Infra', 'Free'], description: 'Service management: auto-start Orca Router, Kiro Gateway, and Forward Proxy on boot.' },
      { id: 'tmux', label: 'tmux', icon: '📋', tags: ['Infra', 'Free'], description: 'Terminal multiplexer for parallel Orca/OpenCode sessions and agent worktrees.' },
    ],
  },
]

// ==================== OWL-ORCA ADE COMPATIBILITY TIERS ====================

export interface ADECompatEntry {
  id: string
  name: string
  tier: 1 | 2 | 3 | 4
  tierLabel: string
  tierColor: string
  verdict: string
  howToConnect: string
  endpoint: string
  apiKey: string
  models?: string
}

export const ADE_COMPATIBILITY: ADECompatEntry[] = [
  {
    id: 'opencode-kilo', name: 'OpenCode / Kilo CLI', tier: 1, tierLabel: 'Perfect Match', tierColor: '#10b981',
    verdict: 'PERFECT PASS — Zero Config',
    howToConnect: 'The install.sh atomically injects owl-orca-virtual and kiro providers into ~/.config/opencode/opencode.jsonc. Just open OpenCode — the "Auto (Races GPT-4o & Claude 3.5)" model is already there.',
    endpoint: 'http://127.0.0.1:60001/v1', apiKey: 'orca-racer',
    models: 'auto-racer, gpt-4o-copilot, claude-3.5-sonnet-copilot',
  },
  {
    id: 'orca', name: 'Orca (stablyai/orca)', tier: 1, tierLabel: 'Perfect Match', tierColor: '#10b981',
    verdict: 'PERFECT PASS — The Orchestrator',
    howToConnect: 'The script IS named OWL-ORCA. Set env vars for underlying agents: OPENAI_BASE_URL=http://127.0.0.1:60001/v1 and OPENAI_API_KEY=orca-racer. Run 5 parallel agents drawing from pooled free tiers.',
    endpoint: 'http://127.0.0.1:60001/v1', apiKey: 'orca-racer',
    models: 'All Orca Router models',
  },
  {
    id: 'goose', name: 'Goose (Block)', tier: 2, tierLabel: 'Plug & Play', tierColor: '#3b82f6',
    verdict: 'PASS — Direct OpenAI-Compatible',
    howToConnect: 'Add custom OpenAI provider in Goose config. Point to Kiro Gateway (8333) for premium models, or Orca Router (60001) for speed racing.',
    endpoint: 'http://127.0.0.1:8333/v1', apiKey: 'kiro-gateway-8333',
    models: 'claude-sonnet-4.5, deepseek-3.2 (via Kiro)',
  },
  {
    id: 'zed', name: 'Zed Industries', tier: 2, tierLabel: 'Plug & Play', tierColor: '#3b82f6',
    verdict: 'PASS — Direct OpenAI-Compatible',
    howToConnect: 'Go to Zed Settings → AI → Add Custom Provider (OpenAI Compatible). Set Name=OWL Orca, Base URL=http://127.0.0.1:60001/v1, API Key=orca-racer.',
    endpoint: 'http://127.0.0.1:60001/v1', apiKey: 'orca-racer',
    models: 'auto-racer, gpt-4o-copilot, claude-3.5-sonnet-copilot',
  },
  {
    id: 'warp', name: 'Warp', tier: 2, tierLabel: 'Plug & Play', tierColor: '#3b82f6',
    verdict: 'PASS — Direct OpenAI-Compatible',
    howToConnect: 'Warp AI supports BYOK with custom endpoints. Point custom OpenAI endpoint to http://127.0.0.1:60001/v1. Terminal completions route through local stream racer.',
    endpoint: 'http://127.0.0.1:60001/v1', apiKey: 'orca-racer',
  },
  {
    id: 'jetbrains', name: 'JetBrains Air / Junie', tier: 2, tierLabel: 'Plug & Play', tierColor: '#3b82f6',
    verdict: 'PASS — Direct OpenAI-Compatible',
    howToConnect: 'JetBrains AI allows custom OpenAI-compatible models. Register Orca Router as custom provider. Junie agents running inside Air route through local proxy.',
    endpoint: 'http://127.0.0.1:60001/v1', apiKey: 'orca-racer',
  },
  {
    id: 'letta', name: 'Letta ADE', tier: 2, tierLabel: 'Plug & Play', tierColor: '#3b82f6',
    verdict: 'PASS — Direct OpenAI-Compatible',
    howToConnect: 'In Letta Agent Configuration, select "Custom OpenAI" for LLM backend and input http://127.0.0.1:60001/v1. Agents use free pooled tiers for reasoning.',
    endpoint: 'http://127.0.0.1:60001/v1', apiKey: 'orca-racer',
  },
  {
    id: 'cline', name: 'Cline', tier: 2, tierLabel: 'Plug & Play', tierColor: '#3b82f6',
    verdict: 'PASS — Via Environment Variables',
    howToConnect: 'Set OPENAI_BASE_URL=http://127.0.0.1:60001/v1 and OPENAI_API_KEY=orca-racer before launching VS Code with Cline.',
    endpoint: 'http://127.0.0.1:60001/v1', apiKey: 'orca-racer',
  },
  {
    id: 'aider', name: 'Aider', tier: 2, tierLabel: 'Plug & Play', tierColor: '#3b82f6',
    verdict: 'PASS — Via Environment Variables',
    howToConnect: 'Set OPENAI_API_BASE=http://127.0.0.1:60001/v1 and OPENAI_API_KEY=orca-racer. Aider routes through Orca Router for free-tier racing.',
    endpoint: 'http://127.0.0.1:60001/v1', apiKey: 'orca-racer',
  },
  {
    id: 'cursor', name: 'Cursor', tier: 2, tierLabel: 'Plug & Play', tierColor: '#3b82f6',
    verdict: 'PASS — Custom Base URL',
    howToConnect: 'In Cursor Settings → Models → OpenAI API Key, set custom base URL to http://127.0.0.1:60001/v1 with key orca-racer.',
    endpoint: 'http://127.0.0.1:60001/v1', apiKey: 'orca-racer',
  },
  {
    id: 'daytona', name: 'Daytona', tier: 3, tierLabel: 'Sandbox Host', tierColor: '#f59e0b',
    verdict: 'PASS — As a Sandbox Host',
    howToConnect: 'Spin up a Daytona workspace, run install.sh inside it, then run ADEs in the same workspace. ADEs connect to localhost:60001 inside the sandbox. Changes synced via Git branches.',
    endpoint: 'http://127.0.0.1:60001/v1', apiKey: 'orca-racer',
  },
  {
    id: 'nvidia-openshell', name: 'NVIDIA OpenShell', tier: 3, tierLabel: 'Sandbox Host', tierColor: '#f59e0b',
    verdict: 'PASS — As a Secure Host',
    howToConnect: 'Run install.sh inside an OpenShell container. Agents get free unlimited API access but file system is kernel-isolated. Ideal for autonomous agents executing terminal commands.',
    endpoint: 'http://127.0.0.1:60001/v1', apiKey: 'orca-racer',
  },
  {
    id: 'cockpit-redundant', name: 'Cockpit Tools / rtk-ai', tier: 4, tierLabel: 'Redundant', tierColor: '#ef4444',
    verdict: 'REDUNDANT — Replaced by install.sh',
    howToConnect: 'The OWL-ORCA install.sh replaces these entirely. orca_router.py handles stream racing/translation, token_manager.py handles auth pooling. No need for Cockpit Tools or rtk-ai.',
    endpoint: '—', apiKey: '—',
  },
  {
    id: 'caddy-optional', name: 'Caddy', tier: 4, tierLabel: 'Optional', tierColor: '#ef4444',
    verdict: 'OPTIONAL — Not Required',
    howToConnect: 'The script uses Python aiohttp. You COULD put Caddy in front of Port 60001 for TLS/SSL or rate limiting, but it is not required for the proxy stack to function.',
    endpoint: '—', apiKey: '—',
  },
  {
    id: 'better-agentic', name: 'Better Agentic IDE', tier: 2, tierLabel: 'Plug & Play', tierColor: '#3b82f6',
    verdict: 'PASS — Direct OpenAI-Compatible',
    howToConnect: 'Better Agentic IDE supports custom OpenAI-compatible endpoints. Point it to the Orca Router (60001) for free-tier speed racing or Kiro Gateway (8333) for premium model access.',
    endpoint: 'http://127.0.0.1:60001/v1', apiKey: 'orca-racer',
    models: 'auto-racer, gpt-4o-copilot, claude-3.5-sonnet-copilot',
  },
]

// ==================== ULTIMATE FREE UNLIMITED BLUEPRINT ====================

export const ULTIMATE_BLUEPRINT_STEPS = [
  {
    step: 1,
    title: 'The Engine — Run install.sh',
    description: 'Run the OWL-ORCA Master Installer v7.1.0 script. This creates all 3 local proxy endpoints (Orca Router, Kiro Gateway, Forward Proxy) natively.',
    command: 'curl -fsSL https://owl-orca.dev/install.sh | bash',
    details: 'Authenticate Copilot (owl-token auth -p copilot), Antigravity, and Kiro (kiro-cli login). This establishes the free-tier pool.',
  },
  {
    step: 2,
    title: 'The Sandbox — Isolate Your Workspace',
    description: 'Run NVIDIA OpenShell or Daytona to create an isolated workspace. This keeps your host Linux clean while agents run inside.',
    command: 'daytona create my-agent-workspace',
    details: 'Run install.sh inside the sandbox. All ADEs inside will connect to localhost:60001 within the sandbox boundaries.',
  },
  {
    step: 3,
    title: 'The Orchestrator — Install Orca ADE',
    description: 'Install Orca (stablyai/orca) inside the workspace. Configure env vars to point to the Orca Router for all underlying agents.',
    command: 'export OPENAI_BASE_URL="http://127.0.0.1:60001/v1"\nexport OPENAI_API_KEY="orca-racer"',
    details: 'Orca will spawn parallel agents in git worktrees, all routing through the local proxy. Zero rate-limiting, zero cost.',
  },
  {
    step: 4,
    title: 'The Agents — Spawn the Fleet',
    description: 'Inside Orca, spawn 5 parallel instances: Kilo CLI (natively configured) + Goose (pointed to Kiro Gateway 8333).',
    command: '# Kilo CLI — zero config (injected by install.sh)\n# Goose — custom provider to 8333\norca spawn --agents 5 --cli kilo,goose',
    details: '5-agent parallel coding fleet. Drawing from GitHub Copilot Free, Antigravity Free, and AWS Builder ID Free. Zero rate-limiting, zero cost.',
  },
  {
    step: 5,
    title: 'The Result — Free Unlimited AI Fleet',
    description: 'You now have a 5-agent parallel coding fleet with kernel-level isolation, pulling from multiple free tiers through a unified racing proxy.',
    command: '# Verify all endpoints are live\ncurl http://127.0.0.1:60001/v1/models\ncurl http://127.0.0.1:8333/v1/models',
    details: 'Pooled free access: GitHub Copilot Free + Antigravity Free + AWS Builder ID (Claude Sonnet 4.5, DeepSeek 3.2). Circuit breaking, protocol translation, and stream racing — all native.',
  },
]

export const PROXY_ENDPOINTS = [
  { name: 'Orca Router', port: 60001, role: 'Brain — Stream Racer', url: 'http://127.0.0.1:60001/v1', apiKey: 'orca-racer', color: '#10b981' },
  { name: 'Kiro Gateway', port: 8333, role: 'Heavy Lifter — Premium Models', url: 'http://127.0.0.1:8333/v1', apiKey: 'kiro-gateway-8333', color: '#8b5cf6' },
  { name: 'Forward Proxy', port: 60000, role: 'Tunnel — HTTPS CONNECT', url: 'http://127.0.0.1:60000', apiKey: '(internal)', color: '#f59e0b' },
]

// ==================== PLUGINS ====================

export interface PluginEntry {
  id: string
  name: string
  description: string
  stars: string
  downloads: string
  tier: 1 | 2 | 3
  category: 'plugin' | 'skill' | 'mcp' | 'proxy'
  url?: string
}

export const TOP_PLUGINS: PluginEntry[] = [
  { id: 'oh-my-openagent', name: 'Oh-My-OpenAgent', description: 'Multi-agent orchestration plugin — 11 specialized agents, 54+ hooks, 5 MCPs, LSP/AST tools, Claude Code compatibility.', stars: '38K', downloads: '62K/wk', tier: 1, category: 'plugin', url: 'https://github.com/code-yeongyu/oh-my-openagent' },
  { id: 'superpowers', name: 'Superpowers', description: 'Skills framework with TDD discipline, systematic debugging, git worktree mgmt. Works with OpenCode, Claude Code, Codex.', stars: '140K+', downloads: '5M+', tier: 1, category: 'plugin', url: 'https://github.com/obra/superpowers' },
  { id: 'context7', name: 'Context7 MCP', description: 'Fresh, version-specific library documentation. Eliminates hallucinated API references.', stars: '3K+', downloads: '200K+', tier: 1, category: 'mcp', url: 'https://github.com/upstash/context7-mcp' },
  { id: 'github-mcp', name: 'GitHub MCP', description: 'Repository management, PRs, issues, code search from within the agent.', stars: '15K+', downloads: '1M+', tier: 1, category: 'mcp', url: 'https://github.com/github/github-mcp-server' },
  { id: 'openspec', name: 'OpenSpec Plugin', description: 'Spec-driven development (SDD). Agree before you build — human and AI align on specs before coding.', stars: '500+', downloads: '10K+', tier: 2, category: 'plugin', url: 'https://github.com/Octane0411/opencode-plugin-openspec' },
  { id: 'antigravity-skills', name: 'Antigravity Awesome Skills', description: '1,500+ installable agentic skills for code review, security, frontend design, debugging, TDD, git workflows.', stars: '15K+', downloads: '500K+', tier: 2, category: 'skill', url: 'https://github.com/sickn33/antigravity-awesome-skills' },
  { id: 'firecrawl-mcp', name: 'Firecrawl MCP', description: 'Web scraping, crawling, and search. Real-time data access for agents.', stars: '5K+', downloads: '300K+', tier: 2, category: 'mcp', url: 'https://github.com/mendableai/firecrawl-mcp-server' },
  { id: 'openrouter', name: 'OpenRouter', description: 'Single API endpoint to 300+ models including free tiers. Built-in OpenCode support.', stars: '—', downloads: '—', tier: 2, category: 'proxy', url: 'https://openrouter.ai' },
  { id: 'gemini-auth', name: 'Gemini Auth Plugin', description: 'Authenticates with Google account for free Gemini access using existing plan quota.', stars: '300+', downloads: '15K+', tier: 2, category: 'plugin', url: 'https://github.com/jenslys/opencode-gemini-auth' },
  { id: 'opencode-browser', name: 'OpenCode Browser', description: 'Browser automation via Chrome DevTools Protocol. Navigate, interact, extract web data.', stars: '500+', downloads: '20K+', tier: 2, category: 'plugin', url: 'https://github.com/different-ai/opencode-browser' },
  { id: 'ntfy', name: 'OpenCode ntfy.sh', description: 'Push notifications when agent completes tasks, errors, or needs input.', stars: '200+', downloads: '8K+', tier: 3, category: 'plugin', url: 'https://github.com/lannuttia/opencode-ntfy.sh' },
  { id: 'worktree', name: 'OpenCode Worktree', description: 'Zero-friction git worktrees for parallel agent work on different branches.', stars: '—', downloads: '—', tier: 3, category: 'plugin' },
  { id: 'daytona', name: 'Daytona Sandbox', description: 'Isolated cloud sandboxes for agent execution. Changes synced via Git branches.', stars: '200+', downloads: '5K+', tier: 3, category: 'plugin', url: 'https://www.npmjs.com/package/@jamesmurdza/opencode-daytona' },
  { id: 'composio-mcp', name: 'Composio MCP', description: '250+ app integrations (Gmail, Slack, GitHub, etc.) through standardized MCP protocol.', stars: '10K+', downloads: '500K+', tier: 2, category: 'mcp', url: 'https://github.com/composiodev/composio-mcp' },
  { id: 'supabase-mcp', name: 'Supabase MCP', description: 'Database queries, auth, storage, edge functions directly from agent.', stars: '2K+', downloads: '100K+', tier: 2, category: 'mcp', url: 'https://github.com/supabase-community/supabase-mcp' },
]

// ==================== COMPARISON ====================

export interface CompareItem {
  id: string
  dimension: string
  ohMyOpencode: string
  ohMyOpencodeSlim: string
  winner: 'full' | 'slim' | 'tie'
}

export const COMPARISON_DATA: CompareItem[] = [
  { id: '1', dimension: 'GitHub Stars', ohMyOpencode: '~38,000', ohMyOpencodeSlim: '~5,100', winner: 'full' },
  { id: '2', dimension: 'npm Weekly Downloads', ohMyOpencode: '~60,000', ohMyOpencodeSlim: '~7,200', winner: 'full' },
  { id: '3', dimension: 'Agent Count', ohMyOpencode: '11 built-in', ohMyOpencodeSlim: '7 core + 2 optional + custom', winner: 'full' },
  { id: '4', dimension: 'Agent Naming Convention', ohMyOpencode: 'Mythological (Sisyphus, Prometheus)', ohMyOpencodeSlim: 'Functional (Scout, Reviewer)', winner: 'slim' },
  { id: '5', dimension: 'Startup Token Overhead', ohMyOpencode: '15,000–25,000 tokens', ohMyOpencodeSlim: 'Significantly less', winner: 'slim' },
  { id: '6', dimension: 'API Requests vs Vanilla', ohMyOpencode: '~3× more', ohMyOpencodeSlim: 'Closer to vanilla', winner: 'slim' },
  { id: '7', dimension: 'Benchmark Pass Rate', ohMyOpencode: '69%', ohMyOpencodeSlim: 'Higher (community)', winner: 'slim' },
  { id: '8', dimension: 'License', ohMyOpencode: 'SUL-1.0 (Source Available)', ohMyOpencodeSlim: 'MIT (Open Source)', winner: 'slim' },
  { id: '9', dimension: 'Hooks', ohMyOpencode: '54+ lifecycle hooks', ohMyOpencodeSlim: 'Minimal hooks', winner: 'full' },
  { id: '10', dimension: 'Built-in MCPs', ohMyOpencode: '5', ohMyOpencodeSlim: 'Core subset', winner: 'full' },
  { id: '11', dimension: 'Tools', ohMyOpencode: '20+ (LSP, AST-Grep)', ohMyOpencodeSlim: 'Streamlined subset', winner: 'full' },
  { id: '12', dimension: 'Claude Code Compatibility', ohMyOpencode: 'Full (skills, hooks, agents)', ohMyOpencodeSlim: 'Limited', winner: 'full' },
  { id: '13', dimension: 'Multi-Model Routing', ohMyOpencode: 'Advanced per-agent', ohMyOpencodeSlim: 'Basic preset-based', winner: 'full' },
  { id: '14', dimension: 'Autonomous Mode', ohMyOpencode: 'Ultrawork (full auto)', ohMyOpencodeSlim: 'No equivalent', winner: 'full' },
  { id: '15', dimension: 'Planning Mode', ohMyOpencode: 'Prometheus/Atlas (detailed)', ohMyOpencodeSlim: 'Orchestrator-driven', winner: 'full' },
  { id: '16', dimension: 'Council/Consensus', ohMyOpencode: 'No', ohMyOpencodeSlim: 'Yes (Council agent)', winner: 'slim' },
  { id: '17', dimension: 'Custom Dynamic Agents', ohMyOpencode: 'No', ohMyOpencodeSlim: 'Yes (Janitor-inspired)', winner: 'slim' },
  { id: '18', dimension: 'Token Cost Efficiency', ohMyOpencode: 'High cost', ohMyOpencodeSlim: 'Low cost (design goal)', winner: 'slim' },
  { id: '19', dimension: 'Configuration Complexity', ohMyOpencode: 'High (many options)', ohMyOpencodeSlim: 'Simple (fewer moving parts)', winner: 'slim' },
  { id: '20', dimension: 'Community Size', ohMyOpencode: 'Large (Discord, Reddit)', ohMyOpencodeSlim: 'Smaller but growing', winner: 'full' },
]

// ==================== CATEGORIES ====================

export const CATEGORY_GROUPS = [
  {
    id: 'documents',
    label: 'Documents',
    icon: '📄',
    types: ['PDF', 'DOCX', 'PPTX', 'ODT'],
    description: 'Reports, guides, blueprints, and formatted documents.',
  },
  {
    id: 'scripts',
    label: 'Scripts',
    icon: '📜',
    types: ['Python', 'Bash', 'TypeScript', 'Go'],
    description: 'Executable automation scripts and tooling.',
  },
  {
    id: 'configs',
    label: 'Configurations',
    icon: '⚙️',
    types: ['JSON', 'YAML', 'TOML', 'ENV'],
    description: 'Plugin configs, MCP server configs, model routing, environment setup.',
  },
  {
    id: 'knowledge',
    label: 'Knowledge Base',
    icon: '📚',
    types: ['Markdown', 'SKILL.md', 'AGENTS.md', 'MDX'],
    description: 'Wiki entries, skill definitions, agent instructions, documentation.',
  },
  {
    id: 'data',
    label: 'Data & Models',
    icon: '🗄️',
    types: ['CSV', 'SQLite', 'Prisma Schema', 'Vector DB'],
    description: 'Datasets, embeddings, model weights, database schemas.',
  },
  {
    id: 'infrastructure',
    label: 'Infrastructure',
    icon: '🏗️',
    types: ['Dockerfile', 'Caddyfile', 'systemd unit', 'CI/CD'],
    description: 'Container configs, reverse proxy, service management, deployment.',
  },
]
