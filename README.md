<p align="center">
  <img src="public/logo.svg" alt="OWL-ORCA Logo" width="80" height="80" />
</p>

<h1 align="center">OWL-ORCA — Free Unlimited AI Agentic Stack</h1>

<p align="center">
  <strong>The definitive open-source knowledge base & interactive wiki for building a zero-cost AI agentic development stack on Ubuntu</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#live-demo">Live Demo</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#research">Research</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#contributing">Contributing</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?logo=tailwind-css" alt="Tailwind" />
  <img src="https://img.shields.io/badge/GSAP-3.15-green?logo=greensock" alt="GSAP" />
  <img src="https://img.shields.io/badge/Framer_Motion-11-FF0055?logo=framer" alt="Framer Motion" />
  <img src="https://img.shields.io/badge/License-MIT-yellow" alt="License" />
</p>

---

## Overview

**OWL-ORCA** is a comprehensive interactive web application that serves as the knowledge base, research hub, and visual documentation for building a **free, unlimited AI agentic development stack**. It covers everything from proxy architecture to plugin ecosystems, with 10 interactive sections featuring GSAP-powered schematic diagrams, Framer Motion animations, and real-time data visualizations.

> **TL;DR**: One `install.sh` creates 3 local proxy endpoints that give you free unlimited access to premium AI models (Claude Sonnet 4.5, DeepSeek, GPT-4o) for coding agents — with stream racing, protocol translation, circuit breaking, zero-config injection, and multi-gateway fleet routing. This repo documents how it all works.

### Why This Exists

The AI coding agent ecosystem is exploding — OpenCode (95K+ stars), Cursor, Cline, Aider, Goose, and 20+ more tools. But getting them connected to **free, unlimited** AI models requires navigating a maze of proxy stacks, MCP servers, and configuration files. OWL-ORCA is the bridge: one install that connects any OpenAI-compatible ADE to free-tier and premium models through local proxy endpoints.

---

## Features

### 10 Interactive Sections

| Section | Description | Key Features |
|---------|-------------|--------------|
| **Dashboard** | Command center with stats, quick access, and key insights | Stat cards, Standing Out analysis, Cross-field connections |
| **A/B Compare** | 20-dimension head-to-head comparison | oh-my-opencode vs slim, winner highlighting, toggle filters |
| **Architecture** | 7-layer interactive infographic | Stack/Flow/Routing views, expandable layers, animated connectors |
| **ADE Compat** | 20+ agentic IDE tool compatibility | Search, filter by tier/type, verdict badges |
| **Plugins & MCP** | 15 curated enhancement tools | Tier system, search, category filters, config preview |
| **Blueprint** | 5-phase implementation guide | Step-by-step setup, code snippets, progress tracking |
| **Categories** | 6 subrepo groups with file structure | Tree view, file type icons, expandable folders |
| **Files** | Document & image browser with preview | Lightbox, inline markdown, download, search |
| **Research Hub** | 4 research reports with interactive analysis | Document cards, tier diagrams, schematic diagrams, image gallery |
| **Proxy Topics** | Deep proxy comparison & cross-field analysis | Arena mode, VS comparison, radar chart, discipline filters |

### Animation & Interaction

- **GSAP ScrollTrigger** — SVG path drawing, data particles, parallax effects
- **Framer Motion** — Layout animations, enter/exit transitions, hover/tap micro-interactions
- **Hybrid system** — GSAP handles scroll/SVG/timeline, Framer handles layout/enter/exit (never both on same element)
- **Custom easing** — Golden ratio duration (0.618s), `back.out(1.7)` spring physics
- **Accessible** — 44px touch targets, WCAG AA contrast, ARIA labels, keyboard navigation

### Security

- **API key masking** — Keys display as `or••••••er` with click-to-reveal
- **Input sanitization** — XSS vector stripping on all search fields
- **Clipboard validation** — API availability check before `navigator.clipboard`
- **ReactMarkdown whitelist** — Allowed elements only, no dangerous HTML

---

## Live Demo

| Platform | URL | Notes |
|----------|-----|-------|
| **Vercel** | [my-project-beta-one-80.vercel.app](https://my-project-beta-one-80.vercel.app/) | Primary deployment with SSR |
| **GitHub Pages** | [marktantongco.github.io](https://marktantongco.github.io/owl-orca-ai-agentic-stack/) | Static export deployment |

---

## Quick Start

### Prerequisites

- **Node.js** 18+ (recommended: 20+)
- **npm** or **bun** package manager
- **Git** for version control

### Installation

```bash
# Clone the repository
git clone https://github.com/marktantongco/owl-orca-ai-agentic-stack.git
cd owl-orca-ai-agentic-stack

# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser
open http://localhost:3000
```

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm run start
```

### Static Export (GitHub Pages)

```bash
# Build static export
npm run build:static

# The exported site will be in the `out/` directory
```

---

## Architecture

### 7-Layer Stack

```
┌─────────────────────────────────────────────────┐
│  Layer 7 — User / ADE & IDE                     │
│  OpenCode, Cursor, Cline, Aider, Goose, Zed...  │
├─────────────────────────────────────────────────┤
│  Layer 6 — Silent Protocol (Pre-Response)       │
│  Diagnose → Blind Spot Scan → Simplest Truth    │
├─────────────────────────────────────────────────┤
│  Layer 5 — OWL-ORCA Proxy Stack                 │
│  Orca Router :60001 │ Kiro Gateway :8333        │
│  Forward Proxy :60000 │ LiteLLM │ 9Router       │
├─────────────────────────────────────────────────┤
│  Layer 4 — Agent Orchestration (5 Parallel)     │
│  Orchestrator → Scout → Builder → Reviewer      │
├─────────────────────────────────────────────────┤
│  Layer 3 — Sandbox / Isolated Execution         │
│  Daytona Sandbox │ NVIDIA OpenShell              │
├─────────────────────────────────────────────────┤
│  Layer 2 — Local Models (Self-Hosted Fallback)  │
│  Ollama │ LM Studio │ vLLM                      │
├─────────────────────────────────────────────────┤
│  Layer 1 — Ubuntu Host (Infrastructure)          │
│  Systemd │ Docker │ Network Manager │ Firewall   │
└─────────────────────────────────────────────────┘
```

### 5 Unique Capabilities (No Other Proxy Has All 5)

| # | Capability | What It Does | Competitor Gap |
|---|-----------|-------------|----------------|
| 1 | **Stream Racing** | Races multiple free-tier providers simultaneously, returns fastest | LiteLLM/OpenRouter: sequential fallback only |
| 2 | **Protocol Translation** | Translates Copilot/Gemini → OpenAI format on-the-fly | No competitor bridges proprietary protocols |
| 3 | **Circuit Breaking** | Transparent failover: cloud → premium → local Ollama | Only 9Router has circuit breaking |
| 4 | **Zero-Config Injection** | Auto-injects providers into OpenCode/Kilo config | All competitors require manual config |
| 5 | **Multi-Gateway Fleet** | 3 role-specific endpoints from 1 install | No competitor provides 3 dedicated ports |

### Proxy Endpoints

| Endpoint | Port | Role | API Key |
|----------|------|------|---------|
| **Orca Router** | 60001 | Brain — Stream Racer | `orca-racer` |
| **Kiro Gateway** | 8333 | Heavy Lifter — Premium (AWS Builder ID) | `kiro-gateway-8333` |
| **Forward Proxy** | 60000 | Tunnel — HTTPS CONNECT | `(internal)` |

---

## Research

This project includes 4 comprehensive research reports:

| Report | Topics | Key Insight |
|--------|--------|-------------|
| **OpenCode Enhancement Tools** | 15 plugins, 13 MCP servers, skills ecosystem | Oh-My-OpenAgent is #1 community plugin |
| **AI Agentic Development Tools** | Top 20 ADEs, Top 10 proxies, Top 15 plugins | OpenCode leads with 95K+ stars |
| **Oh-My-OpenCode Variants** | 20-dimension comparison, agent breakdowns | Full wins features (10), Slim wins efficiency (10) |
| **Interactive Infographic Research** | 6 animation libraries, integration patterns | Framer + GSAP hybrid is the optimal stack |

All reports are available interactively in the **Research Hub** section and as downloadable markdown files in `/public/files/`.

---

## Tech Stack

### Frontend

| Technology | Version | Purpose |
|-----------|---------|---------|
| [Next.js](https://nextjs.org) | 16.1 | React framework with App Router |
| [React](https://react.dev) | 19 | UI library |
| [TypeScript](https://typescriptlang.org) | 5 | Type safety |
| [Tailwind CSS](https://tailwindcss.com) | 4 | Utility-first styling |
| [shadcn/ui](https://ui.shadcn.com) | latest | Accessible component library |
| [Framer Motion](https://motion.dev) | 11 | Layout, enter/exit, gesture animations |
| [GSAP](https://gsap.com) | 3.15 | Scroll-driven, SVG, timeline animations |
| [React Flow](https://reactflow.dev) | latest | Interactive node-based diagrams |
| [Lucide](https://lucide.dev) | latest | Icon library |

### Animation Architecture

```
┌──────────────────────────────────┐
│        Animation System          │
├──────────────────────────────────┤
│  Framer Motion (Declarative)     │
│  ├─ Page transitions             │
│  ├─ Layout animations            │
│  ├─ Enter/exit (AnimatePresence) │
│  ├─ Hover/tap micro-interactions │
│  └─ Shared layout animations     │
├──────────────────────────────────┤
│  GSAP (Imperative)              │
│  ├─ ScrollTrigger (scroll-linked)│
│  ├─ SVG path drawing (strokeDash)│
│  ├─ MotionPath (particles)       │
│  ├─ Complex timeline sequences   │
│  └─ Data-driven counter bars     │
├──────────────────────────────────┤
│  Rule: Never both on same DOM    │
│  Config: gsapConfig.ts (central) │
│  Duration: ~0.618s (golden ratio)│
└──────────────────────────────────┘
```

### Deployment

| Platform | Config | Output |
|----------|--------|--------|
| **Vercel** | `vercel.json` | SSR with edge functions |
| **GitHub Pages** | `next.config.ts` (static export) | Static HTML/CSS/JS |

---

## Project Structure

```
owl-orca-ai-agentic-stack/
├── public/
│   ├── files/                    # Downloadable documents & images
│   │   ├── AI_Agentic_Stack_Blueprint.pdf
│   │   ├── ai_agentic_architecture.png
│   │   ├── ai_agentic_tools_research.md
│   │   ├── interactive_infographic_research.md
│   │   ├── oh-my-opencode_research_report.md
│   │   ├── opencode_enhancements_research.md
│   │   ├── provider_comparison_matrix.png
│   │   └── wiki-*.png (5 screenshots)
│   └── logo.svg
├── src/
│   ├── app/
│   │   ├── layout.tsx            # Root layout with Toaster
│   │   ├── page.tsx              # Main SPA (10 sections)
│   │   └── globals.css           # Tailwind + custom styles
│   ├── components/
│   │   ├── ErrorBoundary.tsx     # Section error boundaries
│   │   └── ui/                   # shadcn/ui components
│   └── lib/
│       ├── architecture-data.ts  # All typed data constants
│       ├── gsapConfig.ts         # GSAP centralized config
│       └── utils.ts              # Utility functions
├── next.config.ts                # Next.js configuration
├── tailwind.config.ts            # Tailwind configuration
├── tsconfig.json                 # TypeScript configuration
├── README.md                     # This file
└── package.json                  # Dependencies & scripts
```

---

## Cross-Field Connections

The Elephant Memory analysis maps each proxy to archetypes across 4 disciplines:

| Proxy | Economics | Psychology | Network Science | History |
|-------|-----------|------------|-----------------|---------|
| **OWL-ORCA** | Free-tier arbitrage | Eliminates choice overload | BGP for AI models | Automatic telephone exchange |
| **LiteLLM** | Market maker / currency exchange | One mental model, 100 providers | CDN for LLM APIs | Rosetta Stone |
| **OpenRouter** | Two-sided marketplace (Amazon) | Paradox of abundance | DNS for AI models | Central telegraph station |
| **FreeLLMAPI** | Digital commons (Ostrom) | Scarcity vs abundance tension | Mesh networking | ARPANET |

---

## Contributing

Contributions are welcome! This project thrives on community knowledge about the evolving AI agentic ecosystem.

### How to Contribute

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Areas We Need Help With

- **New proxy comparisons** — Add more proxy stacks to the comparison
- **Research updates** — Keep plugin/MCP data current as the ecosystem evolves
- **Accessibility improvements** — WCAG AAA compliance, screen reader testing
- **Animation optimizations** — Performance profiling, GPU compositing
- **Internationalization** — Multi-language support for global developers

---

## License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- **OpenCode** community — 95K+ stars, 2.5M monthly developers
- **Oh-My-OpenAgent** — Multi-agent orchestration plugin
- **Superpowers** — Skills framework (140K+ stars)
- **Antigravity Awesome Skills** — 1,500+ installable skills
- **GSAP** — Free and open-source animation platform
- **shadcn/ui** — Beautifully accessible component library
- **Vercel** — Edge-first deployment platform

---

<p align="center">
  <strong>Built with curiosity, shipped with confidence.</strong><br/>
  <em>Think like an owl. Build like a beaver. Create like a dolphin.</em>
</p>
