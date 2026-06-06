// Wiki Data for AI Agentic Development Tools Knowledge Base

export interface ADETool {
  id: number;
  name: string;
  type: "CLI" | "IDE" | "Both";
  stars: string;
  description: string;
  pricing: string;
  pricingType: "Free" | "Free tier" | "Paid";
  url: string;
}

export interface ProxyStack {
  id: number;
  name: string;
  language: string;
  providers: string;
  keyFeatures: string;
  pricing: string;
  url: string;
}

export interface CombinationStack {
  name: string;
  components: string[];
  useCase: string;
}

export interface OpenCodePlugin {
  id: number;
  name: string;
  type: string;
  rating: number; // 1-5
  description: string;
  source: string;
  installCommand: string;
}

export interface FreeAITool {
  id: number;
  name: string;
  provides: string;
  freeLimits: string;
  url: string;
}

export interface FreeTierProvider {
  provider: string;
  freeModel: string;
  dailyMonthlyLimit: string;
  contextWindow: string;
}

export interface AgentOrchestrationTool {
  id: number;
  name: string;
  description: string;
  language: string;
  stars: string;
  url: string;
}

export interface FrameworkSelection {
  useCase: string;
  framework: string;
  why: string;
}

export interface PrimaryAgent {
  name: string;
  icon: string;
  color: string;
  subagents: string[];
}

export interface Workflow {
  name: string;
  steps: string[];
  description: string;
}

export interface Playbook {
  name: string;
  steps: string[];
  description: string;
}

export interface Pipeline {
  name: string;
  steps: string[];
  description: string;
}

export interface Blueprint {
  name: string;
  components: string[];
  description: string;
}

export interface MonetizationStrategy {
  name: string;
  revenuePotential: string;
  description: string;
  approach: string[];
}

export interface StackRecommendation {
  name: string;
  cost: string;
  components: string[];
  description: string;
  bestFor: string;
}

export interface SetupStep {
  step: number;
  title: string;
  command: string;
  description: string;
}

// ==================== DATA ====================

export const adeTools: ADETool[] = [
  { id: 1, name: "Cursor", type: "IDE", stars: "~50k+", description: "AI-first code editor built on VS Code fork with multi-file edits, codebase indexing, agent mode (Cascade), and tab completion", pricing: "Free tier / $20/mo Pro", pricingType: "Free tier", url: "https://cursor.com" },
  { id: 2, name: "GitHub Copilot", type: "Both", stars: "~70k+", description: "Real-time AI pair programmer with completions, chat, CLI, and agent mode across VS Code, JetBrains, Neovim", pricing: "Free tier (2K completions/mo) / $10/mo Pro", pricingType: "Free tier", url: "https://github.com/features/copilot" },
  { id: 3, name: "Claude Code", type: "CLI", stars: "N/A (closed)", description: "Anthropic's terminal-based agentic coding tool with deep repo understanding, multi-file editing, and tool calling", pricing: "$20/mo (with Max subscription)", pricingType: "Paid", url: "https://www.anthropic.com" },
  { id: 4, name: "Aider", type: "CLI", stars: "~30k+", description: "AI pair programming in terminal, Git-native workflow, multi-file awareness, 75+ LLM providers supported", pricing: "Free (BYOK)", pricingType: "Free", url: "https://aider.chat" },
  { id: 5, name: "OpenCode", type: "CLI", stars: "~30k+", description: "Open-source terminal AI coding agent with multi-provider support, plugins/skills system, LSP integration", pricing: "Free (BYOK)", pricingType: "Free", url: "https://opencode.ai" },
  { id: 6, name: "Codex CLI", type: "CLI", stars: "~25k+", description: "OpenAI's open-source terminal agent with suggest/edit/run modes, sandboxed execution", pricing: "Free (BYOK)", pricingType: "Free", url: "https://github.com/openai/codex" },
  { id: 7, name: "Gemini CLI", type: "CLI", stars: "~15k+", description: "Google's open-source terminal coding agent with 1M context window, Gemini models", pricing: "Free (with Google account)", pricingType: "Free", url: "https://github.com/google-gemini/gemini-cli" },
  { id: 8, name: "Cline", type: "IDE", stars: "~25k+", description: "Autonomous AI coding agent as VS Code extension, can create/edit files, run terminal commands, use browser", pricing: "Free (BYOK)", pricingType: "Free", url: "https://cline.bot" },
  { id: 9, name: "Continue", type: "IDE", stars: "~27k+", description: "Open-source AI code assistant for VS Code and JetBrains, tab completion, chat, inline edits", pricing: "Free (BYOK)", pricingType: "Free", url: "https://continue.dev" },
  { id: 10, name: "Windsurf", type: "IDE", stars: "N/A", description: "AI-powered code editor by Codeium with multi-line autocomplete, jump prediction, Cascade agent mode", pricing: "Free tier / $15/mo Pro", pricingType: "Free tier", url: "https://codeium.com/windsurf" },
  { id: 11, name: "Augment Code", type: "IDE", stars: "N/A", description: "Enterprise-grade AI coding assistant with deep codebase context, outperforms on large repos", pricing: "Free tier / $15/mo Pro", pricingType: "Free tier", url: "https://www.augmentcode.com" },
  { id: 12, name: "Amazon Q Developer", type: "Both", stars: "N/A", description: "AWS AI coding assistant with security scanning, code generation, inline suggestions", pricing: "Free tier / $19/mo Pro", pricingType: "Free tier", url: "https://aws.amazon.com/q/developer" },
  { id: 13, name: "Devin", type: "Both", stars: "N/A", description: "Full autonomous AI software engineer — runs in cloud sandbox, writes/debugs/deploy code", pricing: "Free tier / $500/mo", pricingType: "Free tier", url: "https://devin.ai" },
  { id: 14, name: "Sourcegraph Cody", type: "IDE", stars: "~2k+", description: "AI coding assistant with deep code search across repos, inline chat and edits", pricing: "Free tier / $9/mo Pro", pricingType: "Free tier", url: "https://sourcegraph.com/cody" },
  { id: 15, name: "Tabby", type: "Both", stars: "~24k+", description: "Self-hosted AI coding assistant, privacy-first, runs on your own infrastructure", pricing: "Free (OSS)", pricingType: "Free", url: "https://github.com/TabbyML/tabby" },
  { id: 16, name: "Codeium", type: "IDE", stars: "N/A", description: "Free AI code completion supporting 70+ languages, fast autocomplete", pricing: "Free", pricingType: "Free", url: "https://codeium.com" },
  { id: 17, name: "Roo Code", type: "IDE", stars: "~15k+", description: "VS Code extension (Cline fork) for autonomous AI coding with multi-provider support", pricing: "Free (BYOK)", pricingType: "Free", url: "https://github.com/RooVetGit/Roo-Code" },
  { id: 18, name: "Warp", type: "CLI", stars: "~22k+", description: "AI-powered modern terminal with natural language commands, agent mode", pricing: "Free tier / $15/mo Pro", pricingType: "Free tier", url: "https://warp.dev" },
  { id: 19, name: "Goose", type: "CLI", stars: "~10k+", description: "Open-source AI developer agent by Block (Square), extensible with custom skills", pricing: "Free (BYOK)", pricingType: "Free", url: "https://github.com/block/goose" },
  { id: 20, name: "CodeRabbit", type: "Both", stars: "~2k+", description: "AI-powered code review tool with inline suggestions, PR summaries", pricing: "Free for OSS / $12/mo", pricingType: "Free tier", url: "https://coderabbit.ai" },
];

export const proxyStacks: ProxyStack[] = [
  { id: 1, name: "LiteLLM", language: "Python", providers: "100+ LLM providers (OpenAI, Anthropic, Bedrock, Gemini, etc.)", keyFeatures: "OpenAI-compatible API, fallbacks, budget controls, load balancing, usage tracking, key management", pricing: "Free (OSS)", url: "https://github.com/BerriAI/litellm" },
  { id: 2, name: "OpenRouter", language: "Cloud (API)", providers: "All major models (OpenAI, Anthropic, Google, Meta, Mistral, etc.)", keyFeatures: "Single unified API, free models available, automatic routing, streaming support", pricing: "Free tier + paid", url: "https://openrouter.ai" },
  { id: 3, name: "One-API / New-API", language: "Go", providers: "20+ providers (OpenAI, Anthropic, Google, Azure, local models)", keyFeatures: "Unified AI model hub, cross-converting LLMs to OpenAI-compatible & Claude-compatible APIs, key pooling", pricing: "Free (OSS)", url: "https://github.com/QuantumNous/new-api" },
  { id: 4, name: "FreeLLMAPI", language: "Python", providers: "16 free-tier LLM providers (~1.7B tokens/month)", keyFeatures: "Stacks free tiers behind one /v1 endpoint, automatic failover, OpenAI-compatible", pricing: "Free (OSS)", url: "https://github.com/tashfeenahmed/freellmapi" },
  { id: 5, name: "GPT4Free (g4f)", language: "Python", providers: "50+ free AI providers", keyFeatures: "Aggregates multiple accessible providers for free LLM access, API + Web UI", pricing: "Free (OSS)", url: "https://github.com/xtekky/gpt4free" },
  { id: 6, name: "ChatGPT Reverse Proxy", language: "Node.js", providers: "OpenAI (GPT-3.5/4)", keyFeatures: "Free self-hosted API access to ChatGPT with OpenAI's familiar structure", pricing: "Free (OSS)", url: "https://github.com/PawanOsman/ChatGPT" },
  { id: 7, name: "LLM-API-Key-Proxy", language: "Go", providers: "All major LLM providers", keyFeatures: "Universal gateway, OpenAI + Anthropic compatible endpoints, quota visibility, OAuth credential mgmt", pricing: "Free (OSS)", url: "https://github.com/Mirrowel/LLM-API-Key-Proxy" },
  { id: 8, name: "OpenAI-API-Proxy", language: "TypeScript", providers: "OpenAI-compatible endpoints", keyFeatures: "Edge Runtime deployment (Cloudflare Workers — 100k free req/day), same proxy API", pricing: "Free (OSS)", url: "https://github.com/rxliuli/openai-api-proxy" },
  { id: 9, name: "Portkey AI", language: "TypeScript", providers: "250+ providers", keyFeatures: "LLM gateway with observability, automatic retries, fallbacks, caching, virtual keys", pricing: "Free tier + paid", url: "https://portkey.ai" },
  { id: 10, name: "Helicone", language: "TypeScript", providers: "All major providers", keyFeatures: "LLM observability gateway with logging, caching, rate limiting, cost tracking", pricing: "Free tier + paid", url: "https://www.helicone.ai" },
];

export const combinationStacks: CombinationStack[] = [
  { name: "Free Max Stack", components: ["FreeLLMAPI", "LiteLLM", "OpenCode/Aider"], useCase: "Maximum free tokens (~1.7B/mo) for coding" },
  { name: "Self-Hosted Stack", components: ["New-API", "LiteLLM", "Ollama"], useCase: "Private, self-hosted with local + cloud models" },
  { name: "Enterprise Stack", components: ["Portkey", "LiteLLM", "OpenRouter"], useCase: "Production observability + routing + all models" },
  { name: "Developer Stack", components: ["OpenRouter", "g4f", "LiteLLM"], useCase: "BYOK with free fallbacks and paid primary" },
  { name: "Edge Stack", components: ["OpenAI-API-Proxy", "Cloudflare Workers"], useCase: "Zero-cost serverless proxy deployment" },
];

export const openCodePlugins: OpenCodePlugin[] = [
  { id: 1, name: "Oh-My-OpenCode", type: "Plugin", rating: 5, description: "Background agents, pre-built LSP/AST/MCP tools, curated agents, Claude Code compatible", source: "npm", installCommand: "npm install -g @reinamaccredy/oh-my-opencode" },
  { id: 2, name: "Superpowers", type: "Plugin", rating: 5, description: "Disciplined engineering skills, find_skills tool, \"1% rule\" injection, Edit/Bash skills", source: "blog.fsck.com", installCommand: "opencode skill add superpowers" },
  { id: 3, name: "Dynamic Context Pruning", type: "Plugin", rating: 5, description: "Reduces token usage by pruning stale context, duplicate tool calls, and old outputs during long sessions", source: "opencode.ai/docs/ecosystem", installCommand: "opencode plugin add context-pruning" },
  { id: 4, name: "OpenCode Notificator", type: "Plugin", rating: 4, description: "Desktop notifications and sound alerts when OpenCode completes tasks", source: "opencode.ai/docs/ecosystem", installCommand: "opencode plugin add notificator" },
  { id: 5, name: "Antigravity Auth Plugin", type: "Plugin", rating: 4, description: "Google OAuth integration, robust API handling, Google Search support", source: "opencode.ai/docs/ecosystem", installCommand: "opencode plugin add antigravity-auth" },
  { id: 6, name: "Oh-My-Antigravity", type: "Plugin", rating: 4, description: "Enhanced Antigravity integration, runs on Claude Code/Codex/Cursor", source: "geminicli.com/extensions", installCommand: "opencode plugin add oh-my-antigravity" },
  { id: 7, name: "Daytona Sandbox Plugin", type: "Plugin", rating: 3, description: "Runs OpenCode in sandboxed Daytona development environments for safe execution", source: "composio.dev", installCommand: "opencode plugin add daytona-sandbox" },
  { id: 8, name: "Conductor", type: "Plugin", rating: 4, description: "Multi-agent orchestration layer for OpenCode — coordinates multiple AI agents", source: "dev.to/chand1012", installCommand: "opencode plugin add conductor" },
  { id: 9, name: "Awesome OpenCode Skills", type: "Skills Collection", rating: 5, description: "Free, open-source collection of 1,300+ expert-level skill files for coding tasks", source: "github.com/awesome-opencode", installCommand: "git clone https://github.com/awesome-opencode/awesome-opencode" },
  { id: 10, name: "OpenCode Extension Developer", type: "Skill", rating: 4, description: "Build custom plugins, agents, and hooks with architecture guidance", source: "mcpmarket.com", installCommand: "opencode skill add extension-developer" },
  { id: 11, name: "CLI Continues", type: "Plugin", rating: 4, description: "Resume any AI coding session across 16+ tools (Claude Code, Codex, Cline, etc.)", source: "github.com/yigitkonur/cli-continues", installCommand: "npm install -g cli-continues" },
  { id: 12, name: "Oh-My-OpenAgent", type: "Plugin", rating: 3, description: "Optional plugin collection for flexible model/workflow agnostic use", source: "github.com/code-yeongyu/oh-my-openagent", installCommand: "opencode plugin add oh-my-openagent" },
  { id: 13, name: "OpenSpec", type: "Plugin", rating: 4, description: "Specification-Driven Development (SDD) workflow integration", source: "dataleadsfuture.com", installCommand: "opencode plugin add openspec" },
  { id: 14, name: "Antigravity Google Search", type: "Plugin", rating: 3, description: "Google Search integration for web-augmented coding", source: "geminicli.com/extensions", installCommand: "opencode plugin add antigravity-search" },
  { id: 15, name: "Oh-My-OpenCode-Slim", type: "Plugin", rating: 3, description: "Lightweight version of oh-my-opencode — essential features only, lower overhead", source: "npm", installCommand: "npm install -g @reinamaccredy/oh-my-opencode-slim" },
];

export const freeAITools: FreeAITool[] = [
  { id: 1, name: "GPT4Free (g4f)", provides: "Free access to GPT-4, Claude, Gemini and 50+ models via aggregated providers", freeLimits: "Limited by provider availability; may fluctuate", url: "https://github.com/xtekky/gpt4free" },
  { id: 2, name: "FreeLLMAPI", provides: "~1.7 billion tokens/month from 16 free-tier LLM providers behind single API", freeLimits: "Rate limited per provider; ~1.7B tokens/mo total", url: "https://github.com/tashfeenahmed/freellmapi" },
  { id: 3, name: "Google AI Studio", provides: "Free Gemini 2.5 Pro access, 1M context window, $300 credit trial", freeLimits: "Rate limited; generous free tier", url: "https://aistudio.google.com" },
  { id: 4, name: "OpenRouter Free Models", provides: "Access to 30+ free AI models at zero cost via unified API", freeLimits: "Varies by model; some unlimited", url: "https://openrouter.ai/collections/free-models" },
  { id: 5, name: "Ollama", provides: "Run LLMs locally (Llama 3, Qwen2.5-Coder, DeepSeek, Mistral, etc.)", freeLimits: "Limited only by local hardware", url: "https://ollama.com" },
  { id: 6, name: "LM Studio", provides: "Local AI model management, inference, and chat UI with vision support", freeLimits: "Limited by local hardware", url: "https://lmstudio.ai" },
  { id: 7, name: "HuggingFace Inference API", provides: "Free tier for thousands of open-source models", freeLimits: "Rate limited; good for testing", url: "https://huggingface.co" },
  { id: 8, name: "Groq", provides: "Ultra-fast free inference for Llama, Mixtral, Gemma models", freeLimits: "Rate limited; fastest inference available", url: "https://groq.com" },
  { id: 9, name: "ChatGPT Free", provides: "GPT-4o mini unlimited, GPT-4o limited access", freeLimits: "GPT-4o mini: unlimited; GPT-4o: message limits", url: "https://chat.openai.com" },
  { id: 10, name: "Poe", provides: "Aggregates GPT-4, Claude, Gemini, and more in one interface", freeLimits: "Free daily access to various models", url: "https://poe.com" },
];

export const freeTierProviders: FreeTierProvider[] = [
  { provider: "OpenAI", freeModel: "GPT-4o mini", dailyMonthlyLimit: "Unlimited messages", contextWindow: "128K" },
  { provider: "Google", freeModel: "Gemini 2.5 Flash", dailyMonthlyLimit: "Generous free tier", contextWindow: "1M" },
  { provider: "Anthropic", freeModel: "Claude Sonnet", dailyMonthlyLimit: "~15 messages/day", contextWindow: "200K" },
  { provider: "xAI", freeModel: "Grok 2", dailyMonthlyLimit: "Free with X account", contextWindow: "128K" },
  { provider: "Microsoft", freeModel: "Copilot (GPT-4o)", dailyMonthlyLimit: "No hard limits", contextWindow: "128K" },
  { provider: "Meta", freeModel: "Llama (via HF/Groq)", dailyMonthlyLimit: "Rate limited", contextWindow: "128K" },
];

export const agentOrchestrationTools: AgentOrchestrationTool[] = [
  { id: 1, name: "LangGraph", description: "Graph-based agent workflows with stateful execution, cycle support, and production-grade control. Built on LangChain but independent.", language: "Python", stars: "~10k+", url: "https://github.com/langchain-ai/langgraph" },
  { id: 2, name: "CrewAI", description: "Role-based multi-agent framework — define agents with roles, goals, and tools. Lean, fast, LangChain-independent. 150+ enterprise customers.", language: "Python", stars: "~30k+", url: "https://github.com/crewaiinc/crewAI" },
  { id: 3, name: "Microsoft AutoGen", description: "Multi-agent conversation framework with Azure integration, code execution, and human-in-the-loop. Rewritten as AutoGen 0.4.", language: "Python", stars: "~45k+", url: "https://github.com/microsoft/autogen" },
  { id: 4, name: "Google ADK", description: "Agent Development Kit — open-source, Python-first, graph-based orchestration with guardrails and blueprints. Tight Vertex AI integration.", language: "Python", stars: "~5k+", url: "https://adk.dev" },
  { id: 5, name: "Mastra", description: "TypeScript-native backend framework for agents, workflows, tools, memory, RAG, and evals. Flexible deployment options.", language: "TypeScript", stars: "~15k+", url: "https://mastra.ai" },
  { id: 6, name: "CopilotKit", description: "AI copilot framework with AG-UI Protocol — wire any agent in 5 steps, works with any agent framework.", language: "TypeScript", stars: "~18k+", url: "https://www.copilotkit.ai" },
  { id: 7, name: "LlamaIndex", description: "RAG-focused agent framework with tools, workflows, and data connectors. Strong document/QA agent support.", language: "Python", stars: "~40k+", url: "https://llamaindex.ai" },
  { id: 8, name: "Semantic Kernel", description: "Microsoft's enterprise agent framework supporting C#, Python, and Java. AI orchestration with planners and skills.", language: "C#/Python/Java", stars: "~22k+", url: "https://github.com/microsoft/semantic-kernel" },
  { id: 9, name: "OpenAI Agents SDK", description: "Official OpenAI agent orchestration SDK — handoffs, guardrails, tracing, tool use.", language: "Python", stars: "~10k+", url: "https://github.com/openai/openai-agents-python" },
  { id: 10, name: "DeerFlow", description: "ByteDance's multi-agent framework with workflow orchestration and research automation.", language: "Python", stars: "~8k+", url: "https://github.com/bytedance/DeerFlow" },
];

export const frameworkSelections: FrameworkSelection[] = [
  { useCase: "Production control", framework: "LangGraph", why: "Graph-based state management, cycle support, testable" },
  { useCase: "Fast prototyping", framework: "CrewAI", why: "Simple role-based setup, 60% of Fortune 500 use it" },
  { useCase: "Azure/Enterprise", framework: "AutoGen", why: "Native Azure integration, Microsoft support" },
  { useCase: "TypeScript stack", framework: "Mastra", why: "TS-native, full-stack agent backend" },
  { useCase: "AI copilot UI", framework: "CopilotKit", why: "AG-UI Protocol, any-agent compatibility" },
  { useCase: "RAG-heavy apps", framework: "LlamaIndex", why: "Best data connectors, document QA" },
  { useCase: "Google Cloud", framework: "Google ADK", why: "Vertex AI integration, guardrails" },
  { useCase: "C#/.NET shop", framework: "Semantic Kernel", why: "Native C# support, enterprise-grade" },
  { useCase: "OpenAI-first", framework: "OpenAI Agents SDK", why: "Official SDK, handoffs, guardrails" },
];

export const primaryAgents: PrimaryAgent[] = [
  {
    name: "Code Architect",
    icon: "🏗️",
    color: "amber",
    subagents: ["Code Reviewer", "Pattern Analyzer", "Refactoring Specialist"],
  },
  {
    name: "Research Analyst",
    icon: "🔍",
    color: "emerald",
    subagents: ["Web Researcher", "Data Analyst", "Documentation Scout"],
  },
  {
    name: "DevOps Engineer",
    icon: "⚙️",
    color: "rose",
    subagents: ["CI/CD Manager", "Security Scanner", "Infrastructure Planner"],
  },
  {
    name: "QA Tester",
    icon: "🧪",
    color: "violet",
    subagents: ["Unit Test Writer", "Integration Tester", "Performance Benchmark"],
  },
  {
    name: "UI Designer",
    icon: "🎨",
    color: "sky",
    subagents: ["Component Builder", "Animation Engineer", "Accessibility Auditor"],
  },
];

export const workflows: Workflow[] = [
  { name: "Code Review Flow", steps: ["AI scans PR for issues", "Pattern detection runs", "Security flags raised", "Style guide check", "Auto-suggest fixes", "Human review gate"], description: "Automated code review pipeline that catches issues before human review, reducing review time by 60%." },
  { name: "Bug Triage Pipeline", steps: ["Bug report received", "AI categorizes severity", "Duplicate detection", "Auto-assign to owner", "Suggest fix approach", "Track resolution"], description: "Intelligent bug triage that categorizes, deduplicates, and routes bugs automatically." },
  { name: "Feature Development Cycle", steps: ["Spec creation with AI", "Architecture design", "Code generation", "Test writing", "Review & iterate", "Merge & deploy"], description: "End-to-end feature development with AI assistance at every stage." },
  { name: "API Integration Flow", steps: ["API spec analysis", "Schema mapping", "Client code generation", "Integration test creation", "Documentation generation", "Deployment"], description: "Streamlined API integration with auto-generated clients and tests." },
  { name: "Database Migration", steps: ["Schema diff analysis", "Migration script generation", "Rollback script creation", "Data transformation", "Validation checks", "Zero-downtime deploy"], description: "Safe database migrations with automatic rollback and zero-downtime deployment." },
  { name: "Testing Automation", steps: ["Code change detected", "Impact analysis", "Test selection", "Parallel execution", "Flaky test detection", "Report generation"], description: "Smart test automation that runs only relevant tests and detects flakiness." },
  { name: "Deployment Pipeline", steps: ["Build & compile", "Unit test gate", "Integration tests", "Security scan", "Staging deploy", "Production rollout"], description: "Multi-stage deployment with automated gates and safety checks." },
  { name: "Security Audit Flow", steps: ["Dependency scan", "SAST analysis", "DAST analysis", "Secret detection", "Compliance check", "Remediation guide"], description: "Comprehensive security auditing with automated vulnerability detection and remediation." },
  { name: "Documentation Generation", steps: ["Code analysis", "API extraction", "Markdown generation", "Example creation", "Diagram generation", "Publish docs"], description: "Auto-generated documentation that stays in sync with your codebase." },
  { name: "Performance Optimization", steps: ["Profile application", "Identify bottlenecks", "Suggest optimizations", "A/B test changes", "Validate improvements", "Deploy optimized"], description: "Data-driven performance optimization with AI-powered bottleneck detection." },
];

export const playbooks: Playbook[] = [
  { name: "New Project Bootstrap", steps: ["Initialize project structure", "Configure linting & formatting", "Set up CI/CD pipeline", "Create README & docs", "Configure AI tools", "Add pre-commit hooks"], description: "Complete playbook for bootstrapping a new project with all best practices from day one." },
  { name: "Legacy Code Modernization", steps: ["Assess codebase health", "Identify technical debt", "Create modernization plan", "Incremental refactoring", "Add test coverage", "Validate functionality"], description: "Step-by-step guide to modernizing legacy codebases safely and incrementally." },
  { name: "Microservice Extraction", steps: ["Identify bounded contexts", "Map dependencies", "Create service boundary", "Extract database layer", "Implement API gateway", "Deploy independently"], description: "Guide for extracting microservices from a monolithic application." },
  { name: "API-First Development", steps: ["Design OpenAPI spec", "Generate server stubs", "Write contract tests", "Implement endpoints", "Generate client SDKs", "Publish documentation"], description: "API-first approach ensuring consistency between spec, implementation, and documentation." },
  { name: "Test-Driven Development", steps: ["Write failing test", "Implement minimum code", "Refactor with confidence", "Integration test layer", "E2E test critical paths", "Monitor coverage"], description: "TDD workflow enhanced with AI-generated test suggestions and coverage tracking." },
  { name: "Security-First Architecture", steps: ["Threat model analysis", "Implement auth layer", "Add rate limiting", "Encrypt data at rest", "Set up monitoring", "Regular audit schedule"], description: "Building security into every layer of your application from the start." },
  { name: "Performance Budget Enforcement", steps: ["Define performance budgets", "Set up Lighthouse CI", "Monitor Core Web Vitals", "Bundle size tracking", "Runtime performance alerts", "Automated regression detection"], description: "Enforce and maintain performance budgets throughout the development lifecycle." },
  { name: "Accessibility Compliance", steps: ["Audit current a11y", "Fix critical issues", "Implement ARIA labels", "Keyboard navigation", "Screen reader testing", "Continuous monitoring"], description: "Ensure WCAG 2.1 AA compliance with automated and manual accessibility checks." },
  { name: "Multi-Language Support", steps: ["Extract strings", "Set up i18n framework", "Generate translation files", "RTL layout support", "Locale-specific formatting", "Translation QA"], description: "Internationalization playbook for making your application globally accessible." },
  { name: "Production Readiness Checklist", steps: ["Load testing", "Disaster recovery plan", "Monitoring & alerting", "Documentation review", "Security audit pass", "Runbook creation"], description: "Comprehensive checklist to ensure your application is production-ready." },
];

export const pipelines: Pipeline[] = [
  { name: "CI/CD Pipeline", steps: ["Code push", "Lint & format", "Build", "Unit tests", "Integration tests", "Deploy staging", "Deploy production"], description: "Standard continuous integration and deployment pipeline." },
  { name: "Code Quality Gate", steps: ["ESLint scan", "TypeScript check", "Complexity analysis", "Dead code detection", "Duplicate code check", "Quality score"], description: "Enforce code quality standards before merging." },
  { name: "Security Scan Pipeline", steps: ["Dependency audit", "SAST scan", "Secret detection", "License compliance", "Vulnerability triage", "Report generation"], description: "Automated security scanning at every code change." },
  { name: "API Testing Pipeline", steps: ["Schema validation", "Contract testing", "Load testing", "Edge case testing", "Response validation", "Performance benchmark"], description: "Comprehensive API testing from contracts to performance." },
  { name: "Performance Regression Pipeline", steps: ["Baseline capture", "Load test execution", "Metrics comparison", "Regression detection", "Alert if degraded", "Root cause analysis"], description: "Catch performance regressions before they reach production." },
  { name: "Lint & Format Pipeline", steps: ["ESLint check", "Prettier format", "Sort imports", "Check types", "Validate configs", "Report violations"], description: "Automated code formatting and linting enforcement." },
  { name: "Dependency Audit Pipeline", steps: ["Lock file analysis", "Outdated check", "Vulnerability scan", "License check", "Bundle size impact", "Update recommendations"], description: "Keep dependencies secure, up-to-date, and lean." },
  { name: "E2E Testing Pipeline", steps: ["Environment setup", "Seed test data", "Run E2E suite", "Visual regression", "Accessibility checks", "Generate reports"], description: "End-to-end testing with visual and accessibility validation." },
  { name: "Documentation Build Pipeline", steps: ["Extract JSDoc/TSDoc", "Generate API docs", "Build storybook", "Create changelog", "Validate links", "Publish docs"], description: "Automated documentation generation and publishing." },
  { name: "Release Automation Pipeline", steps: ["Version bump", "Generate changelog", "Build artifacts", "Run final tests", "Create release", "Publish packages"], description: "Fully automated release process from version bump to publish." },
];

export const blueprints: Blueprint[] = [
  { name: "Full-Stack SaaS Blueprint", components: ["Next.js 16 Frontend", "API Routes Backend", "Prisma ORM", "NextAuth.js Auth", "Stripe Payments", "Resend Email"], description: "Complete SaaS application template with auth, payments, and email." },
  { name: "AI Chat Application", components: ["Chat UI Component", "Streaming API", "Vector Database", "RAG Pipeline", "Multi-model Support", "Conversation Memory"], description: "Production AI chat application with RAG and multi-model support." },
  { name: "E-Commerce Platform", components: ["Product Catalog", "Shopping Cart", "Checkout Flow", "Payment Processing", "Order Management", "Inventory Tracking"], description: "Full e-commerce platform with payment processing and inventory management." },
  { name: "Developer Portfolio", components: ["Project Showcase", "Blog System", "Contact Form", "Analytics Dashboard", "Resume Builder", "Dark Mode"], description: "Professional developer portfolio with blog and analytics." },
  { name: "API Gateway Service", components: ["Rate Limiting", "Auth Middleware", "Request Routing", "Response Caching", "Load Balancing", "API Versioning"], description: "Scalable API gateway with rate limiting and load balancing." },
  { name: "Real-Time Dashboard", components: ["WebSocket Server", "Live Charts", "Alert System", "Data Aggregation", "Filter & Search", "Export Reports"], description: "Real-time monitoring dashboard with live data and alerts." },
  { name: "Content Management System", components: ["Rich Text Editor", "Media Library", "Content Scheduling", "SEO Tools", "Role-based Access", "API-first Design"], description: "Headless CMS with rich editing and scheduled publishing." },
  { name: "Authentication Service", components: ["OAuth 2.0 Providers", "JWT Management", "MFA Support", "Session Handling", "RBAC System", "Audit Logging"], description: "Complete auth service with OAuth, MFA, and role-based access." },
  { name: "Data Pipeline Architecture", components: ["Ingestion Layer", "Processing Queue", "Transformation Engine", "Storage Layer", "Analytics Engine", "Visualization API"], description: "Scalable data pipeline from ingestion to visualization." },
  { name: "Mobile-First PWA", components: ["Service Worker", "Offline Support", "Push Notifications", "App Shell", "Responsive Layout", "Install Prompt"], description: "Progressive web app with offline support and native-like experience." },
];

export const monetizationStrategies: MonetizationStrategy[] = [
  { name: "AI-Powered Code Review SaaS", revenuePotential: "$5K-50K/mo", description: "Build a SaaS platform offering AI-powered automated code reviews, integrating with GitHub/GitLab PRs.", approach: ["Build on open-source ADE tools", "Add proprietary analysis engine", "Integrate with CI/CD platforms", "Freemium model: free for OSS, paid for private repos"] },
  { name: "Custom Agent Marketplace", revenuePotential: "$2K-30K/mo", description: "Create a marketplace for custom AI agents, skills, and plugins similar to VS Code extensions.", approach: ["Build plugin/skill submission system", "Implement quality scoring", "Revenue share model (70/30)", "Featured placement for premium agents"] },
  { name: "Enterprise AI Consulting", revenuePotential: "$10K-100K/mo", description: "Offer consulting services to help enterprises adopt AI agentic development tools and workflows.", approach: ["Develop assessment framework", "Create implementation playbooks", "Offer training workshops", "Provide ongoing support contracts"] },
  { name: "Plugin/Extension Store", revenuePotential: "$3K-25K/mo", description: "Build and sell specialized plugins for OpenCode, Cursor, and other ADE platforms.", approach: ["Identify gap in plugin ecosystem", "Build premium plugins", "Offer free tier with paid upgrades", "Bundle related plugins"] },
  { name: "Training & Certification Platform", revenuePotential: "$5K-40K/mo", description: "Create courses and certifications for AI-assisted development methodologies and tools.", approach: ["Develop curriculum", "Create video content", "Build hands-on labs", "Issue industry-recognized certifications"] },
  { name: "API Gateway Service", revenuePotential: "$2K-20K/mo", description: "Offer managed LLM proxy/gateway service with observability, caching, and cost optimization.", approach: ["Build on LiteLLM/Portkey", "Add managed hosting", "Implement usage-based pricing", "Provide SLA guarantees"] },
  { name: "White-Label Solutions", revenuePotential: "$5K-50K/mo", description: "White-label AI coding assistants for enterprises, universities, and coding bootcamps.", approach: ["Build customizable platform", "Add branding system", "Create deployment templates", "License per-seat pricing"] },
  { name: "Performance Optimization Service", revenuePotential: "$3K-30K/mo", description: "Offer AI-driven performance optimization as a service for web applications and APIs.", approach: ["Build profiling tool", "Create optimization engine", "Offer free audit", "Charge per optimization"] },
  { name: "Security Audit Automation", revenuePotential: "$5K-40K/mo", description: "Automated security auditing service powered by AI agents for continuous compliance.", approach: ["Build on SAST/DAST tools", "Add AI analysis layer", "Create compliance reports", "Subscription pricing"] },
  { name: "AI Workflow Templates", revenuePotential: "$1K-15K/mo", description: "Sell pre-built AI workflow templates for common development tasks and industries.", approach: ["Create template library", "Validate with beta users", "Offer free samples", "Sell premium bundles"] },
];

export const stackRecommendations: StackRecommendation[] = [
  {
    name: "Free Max Stack",
    cost: "$0/mo",
    components: ["OpenCode + Oh-My-OpenCode", "FreeLLMAPI (1.7B tokens/mo)", "LiteLLM (fallback routing)", "Ollama (local backup)"],
    description: "Maximum free tokens with intelligent routing. Best for students, hobbyists, and learning.",
    bestFor: "Students, hobbyists, and budget-conscious developers",
  },
  {
    name: "Budget Stack",
    cost: "<$20/mo",
    components: ["Aider/Cline", "Google AI Studio ($300 free credit)", "OpenRouter free models", "Ollama local"],
    description: "Low-cost stack with generous free credits. Best for freelancers and small teams.",
    bestFor: "Freelancers and small teams getting started",
  },
  {
    name: "Professional Stack",
    cost: "$30-50/mo",
    components: ["Cursor Pro ($20)", "Claude Code (Max $20)", "LiteLLM proxy", "OpenRouter (paid fallback)"],
    description: "Professional setup with premium IDE and CLI tools. Best for full-time developers.",
    bestFor: "Professional developers and growing teams",
  },
  {
    name: "Enterprise Stack",
    cost: "$100+/mo",
    components: ["Augment Code + Devin", "Portkey (observability)", "LiteLLM (routing)", "Multi-provider setup"],
    description: "Enterprise-grade with full observability and all models. Best for large teams and orgs.",
    bestFor: "Enterprise teams requiring observability and scale",
  },
];

export const setupSteps: SetupStep[] = [
  { step: 1, title: "Install OpenCode CLI", command: "curl -fsSL https://opencode.ai/install | bash", description: "Install the OpenCode terminal AI coding agent" },
  { step: 2, title: "Install Oh-My-OpenCode", command: "npm install -g @reinamaccredy/oh-my-opencode", description: "Add the essential OpenCode plugin with background agents" },
  { step: 3, title: "Install FreeLLMAPI", command: "pip install freellmapi && freellmapi start", description: "Set up free LLM API with 1.7B tokens/month" },
  { step: 4, title: "Install LiteLLM", command: "pip install litellm && litellm --config config.yaml", description: "Configure LiteLLM as your unified proxy with fallback routing" },
  { step: 5, title: "Install Ollama (local backup)", command: "curl -fsSL https://ollama.com/install.sh | sh && ollama pull llama3", description: "Set up local LLM as fallback when API limits are reached" },
  { step: 6, title: "Configure environment", command: "export OPENAI_API_KEY=your_key && export LITELLM_PROXY=http://localhost:4000", description: "Set up environment variables for API keys and proxy" },
  { step: 7, title: "Launch OpenCode", command: "opencode --provider litellm --model gpt-4o-mini", description: "Start coding with your free AI-powered development environment" },
];

export const navItems = [
  { id: "dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { id: "ade-tools", label: "ADE Tools (Top 20)", icon: "Wrench" },
  { id: "proxy-stacks", label: "Proxy Stacks (Top 10)", icon: "Network" },
  { id: "opencode-plugins", label: "OpenCode Plugins (Top 15)", icon: "Puzzle" },
  { id: "free-ai-tools", label: "Free AI Tools (Top 10)", icon: "Gift" },
  { id: "agent-orchestration", label: "Agent Orchestration (Top 10)", icon: "Orchestration" },
  { id: "agent-subagent", label: "Agent-Subagent Dynamics", icon: "GitBranch" },
  { id: "workflows", label: "Workflows & Playbooks", icon: "Workflow" },
  { id: "pipelines", label: "Pipelines & Blueprints", icon: "Pipeline" },
  { id: "monetization", label: "Monetization Strategies", icon: "DollarSign" },
  { id: "recommended-stacks", label: "Recommended Stacks", icon: "Layers" },
  { id: "quick-setup", label: "Quick Setup Guide", icon: "Rocket" },
];
