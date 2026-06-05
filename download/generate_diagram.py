#!/usr/bin/env python3
"""Generate the AI Agentic Stack Architecture Diagram using Playwright + CSS."""

import asyncio
from playwright.async_api import async_playwright

HTML_CONTENT = """
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    font-family: 'Inter', sans-serif;
    background: #F8FAFC;
    color: #243447;
    padding: 48px;
    width: 1100px;
  }

  .title {
    text-align: center;
    font-size: 28px;
    font-weight: 800;
    color: #1E293B;
    margin-bottom: 8px;
    letter-spacing: -0.5px;
  }
  .subtitle {
    text-align: center;
    font-size: 14px;
    color: #64748B;
    margin-bottom: 40px;
    font-weight: 500;
  }

  /* Phase group styling */
  .phase {
    border-radius: 12px;
    padding: 20px 24px;
    margin-bottom: 16px;
    position: relative;
  }
  .phase-label {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1.2px;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .phase-label .badge {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }

  /* Phase 1 - User & Protocol */
  .phase-1 { background: #EFF6FF; border: 1.5px solid #BFDBFE; }
  .phase-1 .phase-label { color: #1D4ED8; }
  .phase-1 .badge { background: #3B82F6; }

  /* Phase 2 - Routing */
  .phase-2 { background: #F0FDF4; border: 1.5px solid #BBF7D0; }
  .phase-2 .phase-label { color: #15803D; }
  .phase-2 .badge { background: #22C55E; }

  /* Phase 3 - Providers */
  .phase-3 { background: #FFF7ED; border: 1.5px solid #FED7AA; }
  .phase-3 .phase-label { color: #C2410C; }
  .phase-3 .badge { background: #F97316; }

  /* Phase 4 - Orchestration */
  .phase-4 { background: #F5F3FF; border: 1.5px solid #DDD6FE; }
  .phase-4 .phase-label { color: #7C3AED; }
  .phase-4 .badge { background: #8B5CF6; }

  /* Phase 5 - UI/Design */
  .phase-5 { background: #FFF1F2; border: 1.5px solid #FECDD3; }
  .phase-5 .phase-label { color: #BE123C; }
  .phase-5 .badge { background: #F43F5E; }

  /* Phase 6 - Host */
  .phase-6 { background: #F1F5F9; border: 1.5px solid #CBD5E1; }
  .phase-6 .phase-label { color: #475569; }
  .phase-6 .badge { background: #64748B; }

  .node-row {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }
  .node {
    background: #FFFFFF;
    border: 1px solid #E2E8F0;
    border-radius: 8px;
    padding: 10px 14px;
    font-size: 12.5px;
    font-weight: 500;
    color: #334155;
    flex: 1;
    min-width: 140px;
  }
  .node strong {
    color: #0F172A;
    font-weight: 700;
    font-size: 13px;
  }
  .node .desc {
    font-size: 11px;
    color: #64748B;
    margin-top: 4px;
    line-height: 1.4;
  }
  .node-highlight {
    background: #FFFFFF;
    border: 2px solid #3B82F6;
    border-radius: 8px;
    padding: 10px 14px;
    font-size: 12.5px;
    font-weight: 500;
    color: #334155;
    flex: 2;
    min-width: 200px;
    box-shadow: 0 1px 3px rgba(59,130,246,0.15);
  }
  .node-highlight strong {
    color: #1D4ED8;
    font-weight: 700;
    font-size: 13px;
  }
  .node-highlight .desc {
    font-size: 11px;
    color: #64748B;
    margin-top: 4px;
    line-height: 1.4;
  }

  /* Connector arrows */
  .connector {
    display: flex;
    justify-content: center;
    margin: 6px 0;
  }
  .connector .arrow {
    width: 2px;
    height: 20px;
    background: #94A3B8;
    position: relative;
  }
  .connector .arrow::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: -4px;
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 6px solid #94A3B8;
  }

  /* Split connector */
  .split-connector {
    display: flex;
    justify-content: center;
    margin: 6px 0;
    gap: 80px;
  }
  .split-connector .arrow {
    width: 2px;
    height: 20px;
    background: #94A3B8;
    position: relative;
  }
  .split-connector .arrow::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: -4px;
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 6px solid #94A3B8;
  }

  .dual-row {
    display: flex;
    gap: 16px;
  }
  .dual-row > div {
    flex: 1;
  }

  .mono {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    color: #475569;
    background: #F1F5F9;
    padding: 2px 6px;
    border-radius: 4px;
  }
</style>
</head>
<body>

<div class="title">AI Agentic Stack: Full-Stack Architecture Blueprint</div>
<div class="subtitle">Free &amp; Unlimited AI Environment on Ubuntu Linux &mdash; 6-Layer Stack Design</div>

<!-- Phase 1: User & Protocol -->
<div class="phase phase-1">
  <div class="phase-label"><span class="badge"></span> LAYER 1 &mdash; USER &amp; PROTOCOL</div>
  <div class="node-row">
    <div class="node-highlight">
      <strong>User / Developer</strong>
      <div class="desc">Initiates tasks, submits prompts, reviews outputs</div>
    </div>
    <div class="node-highlight">
      <strong>Silent Protocol</strong>
      <div class="desc">Pre-response diagnostic: Diagnose actual need &rarr; Identify blind spots &rarr; Find simplest truth. Routes to Speed or Depth mode.</div>
    </div>
  </div>
</div>

<div class="connector"><div class="arrow"></div></div>

<!-- Phase 2: Unified CLI & Routing -->
<div class="phase phase-2">
  <div class="phase-label"><span class="badge"></span> LAYER 2 &mdash; UNIFIED COMMAND &amp; ROUTING</div>
  <div class="node-row">
    <div class="node-highlight">
      <strong>OpenCode / Claude Code / Codex / Gemini CLI</strong>
      <div class="desc">Unified CLI interface &mdash; one command per agent, centralized credential vault</div>
    </div>
    <div class="node-highlight">
      <strong>9Router / OmniRoute / LiteLLM</strong>
      <div class="desc">Intelligent routing gateway &mdash; free-tier first, auto-fallback, RTK compression, circuit breaker, real-time dashboard</div>
    </div>
  </div>
</div>

<div class="connector"><div class="arrow"></div></div>

<!-- Phase 3: LLM Providers -->
<div class="phase phase-3">
  <div class="phase-label"><span class="badge"></span> LAYER 3 &mdash; LLM PROVIDERS (FREE-TIER FIRST)</div>
  <div class="dual-row">
    <div class="phase phase-3" style="margin-bottom:0; padding:12px 16px;">
      <div style="font-size:11px;font-weight:700;color:#C2410C;margin-bottom:8px;">FREE TIER POOL</div>
      <div class="node-row">
        <div class="node"><strong>Gemini API</strong><div class="desc">60 req/min, 1M tokens/day</div></div>
        <div class="node"><strong>Groq</strong><div class="desc">30 req/min, ultra-low latency</div></div>
        <div class="node"><strong>Together AI</strong><div class="desc">10K tokens/day free</div></div>
        <div class="node"><strong>Ollama (Local)</strong><div class="desc">Unlimited, offline capable</div></div>
      </div>
    </div>
    <div class="phase phase-3" style="margin-bottom:0; padding:12px 16px; background:#FEF3C7; border-color:#FDE68A;">
      <div style="font-size:11px;font-weight:700;color:#92400E;margin-bottom:8px;">PAID FALLBACK</div>
      <div class="node-row">
        <div class="node"><strong>OpenAI API</strong><div class="desc">Fallback when free exhausted</div></div>
        <div class="node"><strong>Claude API</strong><div class="desc">Long context, creative tasks</div></div>
      </div>
    </div>
  </div>
</div>

<div class="connector"><div class="arrow"></div></div>

<!-- Phase 4: Agent Orchestration -->
<div class="phase phase-4">
  <div class="phase-label"><span class="badge"></span> LAYER 4 &mdash; AGENT ORCHESTRATION</div>
  <div class="node-row">
    <div class="node-highlight">
      <strong>Task Decomposition</strong>
      <div class="desc">Work breakdown structures, sequential execution planning, incremental delivery</div>
    </div>
    <div class="node-highlight">
      <strong>Multi-Agent Coordination</strong>
      <div class="desc">Route tasks to specialized agents, parallel execution, result aggregation</div>
    </div>
    <div class="node">
      <strong>OpenCode Agent</strong>
      <div class="desc">Open-source AI coding agent with free model support</div>
    </div>
  </div>
</div>

<div class="connector"><div class="arrow"></div></div>

<!-- Phase 5: UI/Design Layer -->
<div class="phase phase-5">
  <div class="phase-label"><span class="badge"></span> LAYER 5 &mdash; UI / DESIGN LAYER</div>
  <div class="node-row">
    <div class="node"><strong>Next.js + React</strong><div class="desc">Full-stack web framework</div></div>
    <div class="node"><strong>Framer Motion</strong><div class="desc">Production-ready motion primitives</div></div>
    <div class="node"><strong>GSAP</strong><div class="desc">Scroll-triggered &amp; timeline animations</div></div>
    <div class="node"><strong>shadcn/ui</strong><div class="desc">Modern component library</div></div>
    <div class="node"><strong>Tailwind CSS</strong><div class="desc">Utility-first styling</div></div>
  </div>
</div>

<div class="connector"><div class="arrow"></div></div>

<!-- Phase 6: Host -->
<div class="phase phase-6">
  <div class="phase-label"><span class="badge"></span> LAYER 6 &mdash; UBUNTU LINUX HOST</div>
  <div class="node-row">
    <div class="node"><strong>Ubuntu 22.04/24.04</strong><div class="desc">Host OS with apt package manager</div></div>
    <div class="node"><strong>Node.js 20+</strong><div class="desc">Runtime for CLI tools &amp; proxies</div></div>
    <div class="node"><strong>Python 3.10+</strong><div class="desc">Runtime for LiteLLM &amp; agents</div></div>
    <div class="node"><strong>Docker (optional)</strong><div class="desc">Containerized deployment</div></div>
  </div>
</div>

</body>
</html>
"""

async def generate_diagram():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(
            viewport={"width": 1200, "height": 1400},
            device_scale_factor=2
        )
        await page.set_content(HTML_CONTENT)
        await page.wait_for_timeout(1000)

        # Get actual content size
        body = await page.query_selector("body")
        box = await body.bounding_box()
        if box:
            # Resize viewport to fit content
            await page.set_viewport_size({
                "width": 1200,
                "height": int(box["height"]) + 96
            })
            await page.wait_for_timeout(500)

        await page.screenshot(
            path="/home/z/my-project/download/ai_agentic_architecture.png",
            full_page=True
        )
        await browser.close()
        print("Architecture diagram saved to /home/z/my-project/download/ai_agentic_architecture.png")

asyncio.run(generate_diagram())
