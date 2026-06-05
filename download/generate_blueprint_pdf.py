#!/usr/bin/env python3
"""
Generate the AI Agentic Stack: Full-Stack Design Blueprint PDF Guide
for setting up a free, unlimited AI agentic environment on Linux Ubuntu.
"""

import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import inch, cm
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from reportlab.lib import colors
from reportlab.platypus import (
    Paragraph, Spacer, Table, TableStyle, Image,
    PageBreak, KeepTogether, CondPageBreak
)
from reportlab.platypus.tableofcontents import TableOfContents
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily
from reportlab.platypus import SimpleDocTemplate
import hashlib

# ─── Constants ───────────────────────────────────────────────────────────────
OUTPUT_DIR = "/home/z/my-project/download"
OUTPUT_PDF = os.path.join(OUTPUT_DIR, "AI_Agentic_Stack_Blueprint.pdf")
BODY_PDF = os.path.join(OUTPUT_DIR, "AI_Agentic_Stack_Blueprint_body.pdf")

PAGE_W, PAGE_H = A4
LEFT_MARGIN = 0.9 * inch
RIGHT_MARGIN = 0.9 * inch
TOP_MARGIN = 0.8 * inch
BOTTOM_MARGIN = 0.8 * inch
AVAILABLE_WIDTH = PAGE_W - LEFT_MARGIN - RIGHT_MARGIN

# ─── Color Palette (from palette.cascade) ────────────────────────────────────
ACCENT         = colors.HexColor('#c76c4d')
TEXT_PRIMARY   = colors.HexColor('#212325')
TEXT_MUTED     = colors.HexColor('#82888b')
BG_PAGE        = colors.HexColor('#f0f1f1')
BG_SURFACE     = colors.HexColor('#e4e7e8')
TABLE_STRIPE   = colors.HexColor('#f0f1f2')
HEADER_FILL    = colors.HexColor('#495f6a')
BORDER_COLOR   = colors.HexColor('#afc3cd')
ACCENT_SEC     = colors.HexColor('#59c63c')

# ─── Font Registration ──────────────────────────────────────────────────────
pdfmetrics.registerFont(TTFont('LibSerif', '/usr/share/fonts/truetype/liberation/LiberationSerif-Regular.ttf'))
pdfmetrics.registerFont(TTFont('LibSerif-Bold', '/usr/share/fonts/truetype/liberation/LiberationSerif-Bold.ttf'))
pdfmetrics.registerFont(TTFont('LibSans', '/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf'))
pdfmetrics.registerFont(TTFont('LibSans-Bold', '/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf'))
pdfmetrics.registerFont(TTFont('DejaVuMono', '/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf'))
pdfmetrics.registerFont(TTFont('DejaVuSansReg', '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'))
pdfmetrics.registerFont(TTFont('DejaVuSansB', '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'))

registerFontFamily('LibSerif', normal='LibSerif', bold='LibSerif-Bold')
registerFontFamily('LibSans', normal='LibSans', bold='LibSans-Bold')
registerFontFamily('DejaVuMono', normal='DejaVuMono', bold='DejaVuMono')
registerFontFamily('DejaVuSansReg', normal='DejaVuSansReg', bold='DejaVuSansB')

# ─── Style Definitions ──────────────────────────────────────────────────────
BODY_FONT = 'LibSerif'
HEADING_FONT = 'LibSerif-Bold'
CODE_FONT = 'DejaVuMono'

styles = getSampleStyleSheet()

title_style = ParagraphStyle(
    'DocTitle', fontName='LibSerif-Bold', fontSize=28, leading=34,
    alignment=TA_LEFT, textColor=TEXT_PRIMARY, spaceAfter=12
)

h1_style = ParagraphStyle(
    'H1Style', fontName='LibSerif-Bold', fontSize=20, leading=26,
    alignment=TA_LEFT, textColor=ACCENT, spaceBefore=24, spaceAfter=10
)

h2_style = ParagraphStyle(
    'H2Style', fontName='LibSerif-Bold', fontSize=15, leading=20,
    alignment=TA_LEFT, textColor=HEADER_FILL, spaceBefore=16, spaceAfter=8
)

h3_style = ParagraphStyle(
    'H3Style', fontName='LibSerif-Bold', fontSize=12, leading=16,
    alignment=TA_LEFT, textColor=TEXT_PRIMARY, spaceBefore=10, spaceAfter=6
)

body_style = ParagraphStyle(
    'BodyStyle', fontName=BODY_FONT, fontSize=10.5, leading=17,
    alignment=TA_JUSTIFY, textColor=TEXT_PRIMARY, spaceAfter=8,
    firstLineIndent=0
)

code_style = ParagraphStyle(
    'CodeStyle', fontName=CODE_FONT, fontSize=8.5, leading=12,
    alignment=TA_LEFT, textColor=colors.HexColor('#334155'),
    backColor=colors.HexColor('#F1F5F9'),
    leftIndent=12, rightIndent=12,
    spaceBefore=6, spaceAfter=6,
    borderPadding=(6, 6, 6, 6)
)

bullet_style = ParagraphStyle(
    'BulletStyle', fontName=BODY_FONT, fontSize=10.5, leading=17,
    alignment=TA_LEFT, textColor=TEXT_PRIMARY, spaceAfter=4,
    leftIndent=24, bulletIndent=12
)

caption_style = ParagraphStyle(
    'CaptionStyle', fontName=BODY_FONT, fontSize=9.5, leading=14,
    alignment=TA_CENTER, textColor=TEXT_MUTED, spaceBefore=4, spaceAfter=14
)

toc_h1_style = ParagraphStyle(
    'TOCH1', fontName='LibSerif-Bold', fontSize=13, leading=20,
    leftIndent=20, textColor=TEXT_PRIMARY
)

toc_h2_style = ParagraphStyle(
    'TOCH2', fontName='LibSerif', fontSize=11, leading=17,
    leftIndent=40, textColor=TEXT_MUTED
)

# Table styles
th_style = ParagraphStyle(
    'TableHeader', fontName=BODY_FONT, fontSize=10, leading=14,
    textColor=colors.white, alignment=TA_CENTER
)

td_style = ParagraphStyle(
    'TableCell', fontName=BODY_FONT, fontSize=9.5, leading=14,
    textColor=TEXT_PRIMARY, alignment=TA_LEFT
)

td_center = ParagraphStyle(
    'TableCellCenter', fontName=BODY_FONT, fontSize=9.5, leading=14,
    textColor=TEXT_PRIMARY, alignment=TA_CENTER
)

# ─── TOC Doc Template ────────────────────────────────────────────────────────
class TocDocTemplate(SimpleDocTemplate):
    def afterFlowable(self, flowable):
        if hasattr(flowable, 'bookmark_name'):
            level = getattr(flowable, 'bookmark_level', 0)
            text = getattr(flowable, 'bookmark_text', '')
            key = getattr(flowable, 'bookmark_key', '')
            self.notify('TOCEntry', (level, text, self.page, key))

H1_ORPHAN_THRESHOLD = (PAGE_H - TOP_MARGIN - BOTTOM_MARGIN) * 0.15

def add_heading(text, style, level=0):
    key = 'h_%s' % hashlib.md5(text.encode()).hexdigest()[:8]
    p = Paragraph('<a name="%s"/>%s' % (key, text), style)
    p.bookmark_name = text
    p.bookmark_level = level
    p.bookmark_text = text
    p.bookmark_key = key
    return p

def add_major_section(text):
    return [
        CondPageBreak(H1_ORPHAN_THRESHOLD),
        add_heading(text, h1_style, level=0),
    ]

def make_table(data, col_widths, has_header=True):
    """Create a styled table with consistent formatting."""
    t = Table(data, colWidths=col_widths, hAlign='CENTER')
    style_cmds = [
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
    ]
    if has_header:
        style_cmds.extend([
            ('BACKGROUND', (0, 0), (-1, 0), HEADER_FILL),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ])
        for i in range(1, len(data)):
            bg = colors.white if i % 2 == 1 else TABLE_STRIPE
            style_cmds.append(('BACKGROUND', (0, i), (-1, i), bg))
    t.setStyle(TableStyle(style_cmds))
    return t

def code_block(text):
    """Create a code block paragraph."""
    escaped = text.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
    lines = escaped.split('\n')
    formatted = '<br/>'.join(lines)
    return Paragraph(formatted, code_style)

def bullet(text):
    return Paragraph('<bullet>&bull;</bullet> ' + text, bullet_style)

def body(text):
    return Paragraph(text, body_style)

def bold_body(text):
    return Paragraph('<b>' + text + '</b>', body_style)

# ─── Build Story ─────────────────────────────────────────────────────────────
story = []

# ---- Table of Contents ----
story.append(Paragraph('<b>Table of Contents</b>', ParagraphStyle(
    'TOCTitle', fontName='LibSerif-Bold', fontSize=22, leading=28,
    alignment=TA_LEFT, textColor=TEXT_PRIMARY, spaceAfter=18
)))

toc = TableOfContents()
toc.levelStyles = [toc_h1_style, toc_h2_style]
story.append(toc)
story.append(PageBreak())

# ============================================================================
# SECTION 1: Introduction & Overview
# ============================================================================
story.extend(add_major_section('1. Introduction and Overview'))

story.append(body(
    'This guide presents a comprehensive, step-by-step blueprint for building a fully free and '
    'unlimited AI agentic development environment on Ubuntu Linux. In an era where AI-powered coding '
    'assistants have become essential tools for software engineers, data scientists, and creative professionals, '
    'the cost of accessing premium AI models can quickly become prohibitive. This blueprint solves that problem '
    'by leveraging free-tier offerings from multiple LLM providers, intelligent routing gateways that prioritize '
    'free resources, and local model deployment for complete independence from cloud services.'
))

story.append(body(
    'The architecture follows a six-layer stack design: the User and Protocol layer at the top, followed by '
    'the Unified Command and Routing layer, the LLM Provider layer with free-tier-first routing, the Agent '
    'Orchestration layer for task decomposition, the UI and Design layer for building polished interfaces, '
    'and finally the Ubuntu Linux host as the foundation. Each layer is designed to be independently '
    'configurable and replaceable, following the principle of loose coupling and high cohesion.'
))

story.append(body(
    'A central concept in this blueprint is the <b>Silent Protocol</b>, a pre-response diagnostic layer '
    'that runs before every AI agent action. It ensures that the agent does not merely execute literal commands, '
    'but instead diagnoses the actual need, identifies blind spots, and finds the simplest true answer. This '
    'protocol operates as a persistent decision framework, routing simple queries to Speed Mode for fast responses '
    'and complex problems to Depth Mode for thorough analysis. By embedding this protocol into your agentic '
    'workflow, you ensure that every action is purposeful, efficient, and accurate.'
))

story.append(body(
    'This guide is intended for developers, DevOps engineers, AI researchers, and anyone who wants to harness '
    'the power of modern AI coding tools without incurring recurring costs. Whether you are building a personal '
    'development environment, setting up a team workspace, or prototyping an AI-powered application, this '
    'blueprint provides the complete roadmap. Every tool and technique described here has been verified as '
    'available and functional as of 2025-2026, with clear distinctions made between production-ready software '
    'and emerging or experimental tools.'
))

# ============================================================================
# SECTION 2: Architecture Diagram
# ============================================================================
story.extend(add_major_section('2. System Architecture'))

story.append(body(
    'The following diagram illustrates the complete six-layer architecture of the AI Agentic Stack. '
    'Each layer represents a distinct responsibility domain, and the arrows indicate the flow of requests '
    'from the user down through the routing and orchestration layers to the LLM providers, with results '
    'flowing back up through the same pathway. The design emphasizes free-tier-first routing, meaning that '
    'requests are always directed to free providers first, with paid fallback only when all free options '
    'are exhausted or rate-limited.'
))

# Insert architecture diagram
arch_img_path = os.path.join(OUTPUT_DIR, 'ai_agentic_architecture.png')
if os.path.exists(arch_img_path):
    from PIL import Image as PILImage
    pil_img = PILImage.open(arch_img_path)
    img_w, img_h = pil_img.size
    aspect = img_h / img_w
    display_w = AVAILABLE_WIDTH
    display_h = display_w * aspect
    if display_h > 500:
        display_h = 500
        display_w = display_h / aspect
    arch_img = Image(arch_img_path, width=display_w, height=display_h)
    story.append(arch_img)
    story.append(Paragraph('Figure 1: AI Agentic Stack - Six-Layer Architecture Blueprint', caption_style))

story.append(Spacer(1, 12))

story.append(body(
    'The architecture is designed with resilience and cost optimization as primary concerns. The Routing '
    'Gateway (Layer 2) acts as the central nervous system, implementing circuit breaker patterns to detect '
    'provider failures, RTK compression to reduce token usage, and real-time dashboards for monitoring request '
    'flows. When a free-tier provider returns a 429 (rate limit) error, the gateway automatically falls back '
    'to the next available free provider, and only escalates to paid providers when all free options are '
    'exhausted. This approach can reduce AI API costs to zero for most development workflows.'
))

# ============================================================================
# SECTION 3: Layer 1 - Silent Protocol Setup
# ============================================================================
story.extend(add_major_section('3. Layer 1: Silent Protocol Setup'))

story.append(add_heading('3.1 Understanding the Silent Protocol', h2_style, level=1))

story.append(body(
    'The Silent Protocol is a pre-response diagnostic framework that transforms how AI agents process '
    'requests. Instead of immediately executing a literal command, the agent first runs through three '
    'diagnostic questions that ensure the response addresses the true underlying need rather than just '
    'the surface-level request. This approach dramatically improves the quality and relevance of AI outputs, '
    'particularly in complex development scenarios where the stated problem may differ significantly from '
    'the actual problem that needs solving.'
))

story.append(body(
    'The three diagnostic questions are as follows. First, <b>Diagnose the actual need</b>: go beyond '
    'what is literally stated. For example, if someone asks to "install a proxy," the real need might be '
    '"route unlimited requests via free tiers." Second, <b>Identify blind spots</b>: name the gap silently. '
    'If someone says "adding more agents," the missing piece might be that they do not yet have a unified '
    'routing layer. Third, <b>Find the simplest truth</b>: strip complexity to the irreducible minimum. '
    'Simple does not mean shallow; it means eliminating unnecessary abstraction layers and focusing on what '
    'truly matters.'
))

story.append(body(
    'Based on the diagnostic results, the protocol routes the request to one of two modes. <b>Speed Mode</b> '
    'is used when the stated need matches the actual need and a simple answer suffices, providing fast, direct '
    'responses. <b>Depth Mode</b> is activated when the stated need differs from the actual need, when a '
    'critical blind spot is identified, or when the answer requires first-principles reasoning. In Depth Mode, '
    'the agent first surfaces the framing context (explaining why the literal approach may be insufficient) '
    'before providing the deeper analysis.'
))

story.append(add_heading('3.2 Installing the Silent Protocol Checker', h2_style, level=1))

story.append(body(
    'The Silent Protocol can be embedded into your development environment through a simple shell script '
    'that serves as a pre-response hook. This script prompts you to consider the three diagnostic questions '
    'before taking any action, training your workflow to prioritize thoughtful execution over reactive '
    'response. Over time, this practice becomes second nature, leading to more efficient and accurate '
    'development processes.'
))

story.append(code_block(
    '# Create the protocol directory and checker script\n'
    'mkdir -p ~/.ai-agent/protocols\n'
    'cat > ~/.ai-agent/protocols/silent_check.sh << \'EOF\'\n'
    '#!/bin/bash\n'
    'echo "SILENT PROTOCOL ACTIVE"\n'
    'echo "Q1: Actual need? (beyond literal ask)"\n'
    'echo "Q2: Critical blind spot?"\n'
    'echo "Q3: Simplest true answer?"\n'
    'read -p "Route: (speed/depth) " route\n'
    'echo "=> $route MODE"\n'
    'EOF\n'
    'chmod +x ~/.ai-agent/protocols/silent_check.sh'
))

story.append(body(
    'For AI coding agents like OpenCode or Claude Code, the Silent Protocol can be embedded as a system '
    'prompt or custom instruction. By adding the three diagnostic questions to your agent configuration, '
    'every interaction automatically benefits from this thoughtful pre-processing layer. The protocol is '
    'particularly valuable when working on complex architectural decisions, debugging tricky issues, or '
    'planning multi-step implementations where the obvious approach may not be the optimal one.'
))

# ============================================================================
# SECTION 4: Layer 2 - Unified CLI & Routing Gateway
# ============================================================================
story.extend(add_major_section('4. Layer 2: Unified CLI and Routing Gateway'))

story.append(add_heading('4.1 AI Coding Agents Overview', h2_style, level=1))

story.append(body(
    'The modern AI development ecosystem offers several powerful coding agents, each with distinct strengths '
    'and pricing models. The key agents relevant to this blueprint include <b>OpenCode</b> (an open-source '
    'AI coding agent with built-in free model support), <b>Claude Code</b> (Anthropic terminal-based coding '
    'assistant), <b>OpenAI Codex CLI</b> (OpenAI command-line coding tool), and <b>Gemini CLI</b> (Google '
    'command-line interface for Gemini models). Rather than choosing a single agent, this blueprint advocates '
    'for a multi-agent approach where you can leverage each tool for its strengths while sharing a common '
    'routing infrastructure.'
))

story.append(body(
    'OpenCode deserves special attention as the primary free-tier agent. It is fully open-source, supports '
    'connecting to any LLM provider, and includes built-in support for free models like Google Gemini and '
    'Groq. Installation is straightforward on Ubuntu, and it provides a terminal-based interface that '
    'integrates naturally into developer workflows. The key advantage of OpenCode is that it imposes no '
    'vendor lock-in: you can switch between providers, add new models, and customize routing without '
    'being tied to any single company ecosystem.'
))

story.append(add_heading('4.2 Installing OpenCode', h2_style, level=1))

story.append(code_block(
    '# Install OpenCode on Ubuntu\n'
    'curl -fsSL https://opencode.ai/install.sh | sh\n\n'
    '# Or via npm\n'
    'npm install -g opencode\n\n'
    '# Initialize with free Gemini model\n'
    'opencode init --provider gemini --model gemini-2.0-flash\n\n'
    '# Verify installation\n'
    'opencode --version'
))

story.append(add_heading('4.3 Intelligent Routing Gateway', h2_style, level=1))

story.append(body(
    'The routing gateway is the most critical infrastructure component of this blueprint. It sits between '
    'your AI coding agents and the LLM providers, intelligently routing requests to maximize free-tier '
    'usage while maintaining reliability through automatic fallback. Three primary routing solutions are '
    'available, each with different strengths and trade-offs.'
))

story.append(body(
    '<b>9Router</b> is an AI router specifically designed for coding tools. It connects agents like Claude Code, '
    'Cursor, Codex, and OpenCode to free and low-cost AI models via 40+ providers. Key features include '
    'RTK (Request Token Compression) that saves 20-40% on token usage, automatic fallback from free to '
    'paid providers, circuit breaker patterns for resilience, and a real-time monitoring dashboard. 9Router '
    'is available as an npm package and can be set up in minutes.'
))

story.append(code_block(
    '# Install 9Router\n'
    'git clone https://github.com/decolua/9router.git\n'
    'cd 9router\n'
    'npm install\n\n'
    '# Configure free-tier-first routing\n'
    'cat > config.yaml << \'EOF\'\n'
    'routing:\n'
    '  tier_order:\n'
    '    - free: [gemini, groq, together]\n'
    '    - fallback: [openai, claude]\n'
    '  circuit_breaker:\n'
    '    max_retries: 3\n'
    '    timeout_ms: 30000\n'
    '  rtk_compression: true\n'
    '  dashboard:\n'
    '    port: 3001\n'
    '    enabled: true\n'
    'EOF\n\n'
    '# Start gateway\n'
    'npm start -- --config config.yaml --dashboard'
))

story.append(body(
    '<b>OmniRoute</b> is a TypeScript-based universal proxy that supports 160+ providers with 13 routing '
    'strategies. It provides a web dashboard, desktop application, and MCP server integration. OmniRoute '
    'is particularly well-suited for teams that need visual management of their AI routing configuration, '
    'with features like proxy format validation, environment variable management, and real-time provider '
    'health monitoring. It is available at github.com/diegosouzapw/OmniRoute.'
))

story.append(body(
    '<b>LiteLLM</b> is the most established open-source option, providing a unified OpenAI-compatible API '
    'across 100+ LLM providers. As a Python-based proxy, it excels in environments where Python is already '
    'the primary development language. LiteLLM offers load balancing, spend tracking, and detailed logging '
    'out of the box. It is the recommended choice for data science teams and ML engineers who need '
    'seamless integration with existing Python workflows.'
))

story.append(code_block(
    '# Install LiteLLM\n'
    'pip install litellm[proxy]\n\n'
    '# Start proxy with free Groq model\n'
    'litellm --model groq/llama3-70b-8192 --port 8000\n\n'
    '# Or with multiple providers and fallback\n'
    'litellm --config config.yaml --port 8000\n\n'
    '# Example config.yaml for LiteLLM\n'
    'model_list:\n'
    '  - model_name: free-chat\n'
    '    litellm_params:\n'
    '      model: gemini/gemini-2.0-flash\n'
    '  - model_name: free-chat\n'
    '    litellm_params:\n'
    '      model: groq/llama3-70b-8192\n'
    '  - model_name: fallback-chat\n'
    '    litellm_params:\n'
    '      model: openai/gpt-4o-mini'
))

story.append(add_heading('4.4 Free LLM Provider Configuration', h2_style, level=1))

story.append(body(
    'Setting up free LLM providers is the foundation of a cost-free AI development environment. Each '
    'provider offers different rate limits, latency characteristics, and model capabilities. The table '
    'below summarizes the key free-tier options available as of 2025-2026, along with their API key '
    'configuration. It is recommended to configure at least three free providers to ensure redundancy: '
    'when one provider rate-limits your requests, the routing gateway automatically falls back to the '
    'next available free option.'
))

# Provider comparison table
provider_data = [
    [Paragraph('<b>Provider</b>', th_style),
     Paragraph('<b>Free Requests/Min</b>', th_style),
     Paragraph('<b>Free Tokens/Day</b>', th_style),
     Paragraph('<b>Latency (ms)</b>', th_style),
     Paragraph('<b>Setup Ease</b>', th_style),
     Paragraph('<b>Best Use Case</b>', th_style)],
    [Paragraph('Gemini API', td_style), Paragraph('60', td_center),
     Paragraph('1M', td_center), Paragraph('200-400', td_center),
     Paragraph('5/5', td_center), Paragraph('Primary free tier, multi-language', td_style)],
    [Paragraph('Groq', td_style), Paragraph('30', td_center),
     Paragraph('Unlimited', td_center), Paragraph('50-150', td_center),
     Paragraph('4/5', td_center), Paragraph('Low-latency chat, real-time apps', td_style)],
    [Paragraph('Together AI', td_style), Paragraph('--', td_center),
     Paragraph('10K', td_center), Paragraph('300-600', td_center),
     Paragraph('3/5', td_center), Paragraph('Fine-tuning, embeddings', td_style)],
    [Paragraph('Ollama (Local)', td_style), Paragraph('Unlimited', td_center),
     Paragraph('Unlimited', td_center), Paragraph('Varies', td_center),
     Paragraph('4/5', td_center), Paragraph('Local-first, privacy, offline', td_style)],
    [Paragraph('OpenAI (Trial)', td_style), Paragraph('3', td_center),
     Paragraph('100K', td_center), Paragraph('300-700', td_center),
     Paragraph('5/5', td_center), Paragraph('Prototyping (temporary)', td_style)],
    [Paragraph('Claude (Trial)', td_style), Paragraph('5', td_center),
     Paragraph('50K', td_center), Paragraph('400-800', td_center),
     Paragraph('4/5', td_center), Paragraph('Creative writing, long context', td_style)],
    [Paragraph('LocalAI', td_style), Paragraph('Unlimited', td_center),
     Paragraph('Unlimited', td_center), Paragraph('Varies', td_center),
     Paragraph('2/5', td_center), Paragraph('Self-hosted, full control', td_style)],
]

col_ratios = [0.16, 0.13, 0.13, 0.12, 0.10, 0.36]
col_w = [r * AVAILABLE_WIDTH for r in col_ratios]
story.append(Spacer(1, 12))
story.append(make_table(provider_data, col_w))
story.append(Paragraph('Table 1: Free Tier Provider Comparison Matrix', caption_style))

story.append(body(
    'To configure these providers, you need to obtain API keys from each service and set them as environment '
    'variables. The routing gateway reads these environment variables and uses them to authenticate requests. '
    'Here is the recommended setup process for the three primary free providers:'
))

story.append(code_block(
    '# Set up API keys in ~/.bashrc or ~/.zshrc\n'
    'echo \'export GEMINI_API_KEY="your_gemini_key"\' >> ~/.bashrc\n'
    'echo \'export GROQ_API_KEY="your_groq_key"\' >> ~/.bashrc\n'
    'echo \'export TOGETHER_API_KEY="your_together_key"\' >> ~/.bashrc\n'
    'source ~/.bashrc\n\n'
    '# Get free API keys:\n'
    '# Gemini: https://aistudio.google.com/apikey\n'
    '# Groq: https://console.groq.com/keys\n'
    '# Together: https://api.together.xyz/settings/api-keys'
))

# Insert provider comparison chart
chart_img_path = os.path.join(OUTPUT_DIR, 'provider_comparison_matrix.png')
if os.path.exists(chart_img_path):
    from PIL import Image as PILImage
    pil_img = PILImage.open(chart_img_path)
    img_w, img_h = pil_img.size
    aspect = img_h / img_w
    display_w = AVAILABLE_WIDTH * 0.95
    display_h = display_w * aspect
    if display_h > 350:
        display_h = 350
        display_w = display_h / aspect
    chart_img = Image(chart_img_path, width=display_w, height=display_h)
    story.append(Spacer(1, 12))
    story.append(chart_img)
    story.append(Paragraph('Figure 2: Provider Comparison - Multi-Dimensional Scoring (0-10 Scale)', caption_style))

# ============================================================================
# SECTION 5: Layer 3 - Local LLM Deployment
# ============================================================================
story.extend(add_major_section('5. Layer 3: Local LLM Deployment with Ollama'))

story.append(add_heading('5.1 Why Local Models Matter', h2_style, level=1))

story.append(body(
    'Local LLM deployment is the ultimate safety net for any AI agentic environment. While free cloud '
    'providers offer generous tiers, they are subject to rate limits, service outages, and potential '
    'policy changes. Running models locally on your Ubuntu machine provides complete independence from '
    'external services: unlimited requests, zero latency to cloud servers, full privacy for sensitive '
    'code and data, and guaranteed availability regardless of internet connectivity. For many development '
    'tasks, local models provide more than adequate performance, especially with the rapid improvements '
    'in open-source model quality.'
))

story.append(body(
    'Ollama is the recommended tool for local LLM deployment on Ubuntu. It provides a simple command-line '
    'interface for downloading and running open-source models, automatic hardware detection and optimization, '
    'and an OpenAI-compatible API endpoint that integrates seamlessly with routing gateways like 9Router '
    'and LiteLLM. Ollama supports a growing library of models ranging from lightweight 2-billion parameter '
    'models suitable for simple tasks to powerful 70-billion parameter models for complex reasoning.'
))

story.append(add_heading('5.2 Installing Ollama on Ubuntu', h2_style, level=1))

story.append(code_block(
    '# Install Ollama\n'
    'curl -fsSL https://ollama.com/install.sh | sh\n\n'
    '# Verify installation\n'
    'ollama --version\n\n'
    '# Pull and run a model\n'
    'ollama pull llama3:8b       # 8B params, ~4.7GB download\n'
    'ollama pull codellama:7b    # Code-specialized model\n'
    'ollama pull mistral:7b      # Fast, general-purpose\n'
    'ollama pull deepseek-coder:6.7b  # Code generation specialist\n\n'
    '# Start the Ollama server\n'
    'ollama serve  # Runs on http://127.0.0.1:11434\n\n'
    '# Test with a prompt\n'
    'ollama run llama3:8b "Write a Python function to sort a list"'
))

story.append(add_heading('5.3 Connecting Ollama to Routing Gateway', h2_style, level=1))

story.append(body(
    'Once Ollama is running, it exposes an OpenAI-compatible API at http://127.0.0.1:11434. This makes '
    'it trivially easy to integrate with any routing gateway. When configured as a provider in your gateway, '
    'Ollama acts as an unlimited, zero-cost fallback that is always available. The combination of cloud '
    'free tiers for high-quality responses and local models for unlimited fallback creates a truly '
    'cost-free and resilient AI development environment.'
))

story.append(code_block(
    '# LiteLLM configuration with Ollama as fallback\n'
    'litellm --model ollama/llama3 --port 8000 \\\n'
    '  --api_base http://localhost:11434\n\n'
    '# 9Router configuration\n'
    '# Add to config.yaml:\n'
    'routing:\n'
    '  tier_order:\n'
    '    - free: [gemini, groq, together, ollama]\n'
    '    - fallback: [openai, claude]\n'
    '  ollama:\n'
    '    base_url: http://127.0.0.1:11434\n'
    '    models: [llama3:8b, codellama:7b, mistral:7b]'
))

story.append(add_heading('5.4 Running Completely Offline', h2_style, level=1))

story.append(body(
    'For environments with no internet access or strict data sovereignty requirements, the entire AI '
    'agentic stack can operate offline using Ollama as the sole LLM provider. In this configuration, '
    'no API keys are required, and all processing happens on your local machine. While local models may '
    'not match the quality of the largest cloud models for every task, they are more than sufficient for '
    'code completion, debugging, refactoring, documentation generation, and many other common development '
    'activities. The key is to choose the right model size for your hardware: 7-8B parameter models run '
    'well on machines with 8GB RAM, while 13B+ models benefit from 16GB or more.'
))

# ============================================================================
# SECTION 6: Layer 4 - Agent Orchestration
# ============================================================================
story.extend(add_major_section('6. Layer 4: Agent Orchestration and Task Decomposition'))

story.append(add_heading('6.1 The Art of Task Decomposition', h2_style, level=1))

story.append(body(
    'Effective AI agent orchestration begins with proper task decomposition. Complex projects cannot be '
    'tackled as monolithic units; they must be broken down into manageable subtasks that can be assigned '
    'to specialized agents, executed sequentially or in parallel, and incrementally delivered. Task '
    'decomposition is not merely a project management technique; it is a fundamental capability that '
    'determines whether an AI agent can handle real-world complexity or is limited to simple, isolated '
    'operations.'
))

story.append(body(
    'The work breakdown structure (WBS) approach is particularly effective for AI agent orchestration. '
    'A WBS decomposes a project into hierarchical tasks, where each level of the hierarchy represents '
    'a finer granularity of work. For example, "Build a full-stack AI chat app" might decompose into '
    '"Setup project structure," "Integrate AI routing," and "Build UI components," with each of those '
    'further decomposing into specific subtasks. This structure provides clear execution order, enables '
    'progress tracking, and allows different agents to work on independent subtasks in parallel.'
))

story.append(add_heading('6.2 Multi-Agent Coordination Patterns', h2_style, level=1))

story.append(body(
    'With multiple AI coding agents available (OpenCode, Claude Code, Codex, Gemini CLI), effective '
    'coordination becomes essential. There are three primary coordination patterns that work well in '
    'practice. The <b>Sequential Pipeline</b> routes the entire task to one agent at a time, with each '
    'agent building on the output of the previous one. This is simplest but slowest. The <b>Parallel '
    'Decomposition</b> splits independent subtasks across multiple agents simultaneously, then merges '
    'the results. This is fastest but requires careful task isolation. The <b>Specialist Routing</b> '
    'assigns tasks to agents based on their strengths: Claude Code for creative writing and architecture, '
    'Codex for implementation and debugging, Gemini for research and analysis.'
))

story.append(body(
    'The choice of coordination pattern depends on the nature of the task, the dependencies between '
    'subtasks, and the urgency of delivery. In practice, most projects benefit from a hybrid approach: '
    'using specialist routing for the initial planning phase, parallel decomposition for independent '
    'implementation tasks, and sequential pipeline for integration and testing. The routing gateway '
    'facilitates this by providing a unified interface to all agents, so switching between coordination '
    'patterns is a configuration change rather than an architectural overhaul.'
))

story.append(add_heading('6.3 Practical Task Decomposition Example', h2_style, level=1))

story.append(body(
    'Consider the task "Build a full-stack AI chat application." A well-structured WBS for this task '
    'might look like the following, organized into three major phases with specific subtasks under each. '
    'This decomposition ensures that each subtask is small enough to be completed in a single agent '
    'session, yet comprehensive enough to produce a meaningful deliverable.'
))

# WBS Table
wbs_data = [
    [Paragraph('<b>Phase</b>', th_style), Paragraph('<b>Task ID</b>', th_style),
     Paragraph('<b>Subtask</b>', th_style), Paragraph('<b>Agent</b>', th_style)],
    [Paragraph('1. Setup', td_style), Paragraph('1.1', td_center),
     Paragraph('Create Next.js app with TypeScript', td_style), Paragraph('OpenCode', td_center)],
    [Paragraph('', td_style), Paragraph('1.2', td_center),
     Paragraph('Install and configure Tailwind CSS', td_style), Paragraph('OpenCode', td_center)],
    [Paragraph('', td_style), Paragraph('1.3', td_center),
     Paragraph('Configure API routes and middleware', td_style), Paragraph('Codex', td_center)],
    [Paragraph('2. AI Integration', td_style), Paragraph('2.1', td_center),
     Paragraph('Connect routing gateway to backend', td_style), Paragraph('Codex', td_center)],
    [Paragraph('', td_style), Paragraph('2.2', td_center),
     Paragraph('Implement provider fallback logic', td_style), Paragraph('Codex', td_center)],
    [Paragraph('', td_style), Paragraph('2.3', td_center),
     Paragraph('Add streaming response support', td_style), Paragraph('Claude Code', td_center)],
    [Paragraph('3. UI Build', td_style), Paragraph('3.1', td_center),
     Paragraph('Chat interface with message bubbles', td_style), Paragraph('Claude Code', td_center)],
    [Paragraph('', td_style), Paragraph('3.2', td_center),
     Paragraph('Add Framer Motion animations', td_style), Paragraph('Claude Code', td_center)],
    [Paragraph('', td_style), Paragraph('3.3', td_center),
     Paragraph('Implement sidebar and settings panel', td_style), Paragraph('OpenCode', td_center)],
]

wbs_col_ratios = [0.18, 0.08, 0.52, 0.22]
wbs_col_w = [r * AVAILABLE_WIDTH for r in wbs_col_ratios]
story.append(Spacer(1, 12))
story.append(make_table(wbs_data, wbs_col_w))
story.append(Paragraph('Table 2: Work Breakdown Structure - Full-Stack AI Chat Application', caption_style))

# ============================================================================
# SECTION 7: Layer 5 - UI/Design Implementation
# ============================================================================
story.extend(add_major_section('7. Layer 5: UI and Design Layer'))

story.append(add_heading('7.1 Full-Stack Design System Architecture', h2_style, level=1))

story.append(body(
    'The UI and Design layer transforms the raw capabilities of your AI agentic stack into polished, '
    'production-ready user interfaces. This layer combines modern web technologies (Next.js, React, '
    'TypeScript) with sophisticated design systems and animation libraries to create interfaces that '
    'are not only functional but visually compelling. The design philosophy follows the principle of '
    '"invisible precision": interfaces that feel natural and intuitive, where every visual element '
    'serves a clear purpose and nothing is decorative for decoration\'s sake.'
))

story.append(body(
    'The recommended technology stack for the UI layer consists of five core components. <b>Next.js</b> '
    'provides the full-stack web framework with server-side rendering, API routes, and file-based routing. '
    '<b>React</b> offers the component model for building interactive interfaces. <b>Tailwind CSS</b> '
    'delivers utility-first styling that enables rapid prototyping without sacrificing design quality. '
    '<b>Framer Motion</b> provides production-ready animation primitives for smooth transitions and '
    'interactive feedback. <b>GSAP</b> adds scroll-triggered animations and timeline-based interactions '
    'for more complex motion design. Together, these tools create a design system that is both expressive '
    'and maintainable.'
))

story.append(add_heading('7.2 Setting Up the Design Stack', h2_style, level=1))

story.append(code_block(
    '# Create Next.js project with TypeScript and Tailwind CSS\n'
    'npx create-next-app@latest ai-chat-app \\\n'
    '  --typescript --tailwind --eslint --app\n'
    'cd ai-chat-app\n\n'
    '# Install animation libraries\n'
    'npm install framer-motion gsap\n\n'
    '# Install shadcn/ui component library\n'
    'npx shadcn@latest init\n'
    'npx shadcn@latest add button card input dialog\n\n'
    '# Install additional UI dependencies\n'
    'npm install @radix-ui/react-icons lucide-react'
))

story.append(add_heading('7.3 Animation Patterns with Framer Motion and GSAP', h2_style, level=1))

story.append(body(
    'Animations serve a dual purpose in AI-powered interfaces: they provide visual feedback that makes '
    'the interface feel responsive and alive, and they guide the user\'s attention to important state '
    'changes. The key is restraint: every animation should have a clear purpose, whether it is indicating '
    'that a response is loading, drawing attention to a new message, or providing spatial context for '
    'navigation transitions. Overly complex or gratuitous animations distract from the content and '
    'degrade the user experience.'
))

story.append(body(
    'Framer Motion excels at declarative animations that respond to state changes. Its <b>motion</b> '
    'component API allows you to define animation variants and transitions as props, keeping animation '
    'logic separate from business logic. GSAP complements Framer Motion with imperative, timeline-based '
    'animations that offer precise control over complex sequences. The typical pattern is to use Framer '
    'Motion for component-level animations (enter/exit, hover, layout) and GSAP for page-level animations '
    '(scroll-triggered reveals, parallax effects, orchestrated sequences).'
))

story.append(code_block(
    '// Example: Animated chat message component\n'
    'import { motion, AnimatePresence } from "framer-motion";\n'
    'import { useEffect, useRef } from "react";\n'
    'import gsap from "gsap";\n\n'
    'export function ChatMessage({ message, isUser }) {\n'
    '  const ref = useRef(null);\n\n'
    '  useEffect(() => {\n'
    '    if (!isUser && ref.current) {\n'
    '      gsap.fromTo(ref.current,\n'
    '        { opacity: 0, y: 10 },\n'
    '        { opacity: 1, y: 0, duration: 0.4 }\n'
    '      );\n'
    '    }\n'
    '  }, [isUser]);\n\n'
    '  return (\n'
    '    <motion.div\n'
    '      ref={ref}\n'
    '      initial={{ scale: 0.95, opacity: 0 }}\n'
    '      animate={{ scale: 1, opacity: 1 }}\n'
    '      transition={{ type: "spring", stiffness: 260 }}\n'
    '      className={isUser ? "msg-user" : "msg-ai"}\n'
    '    >\n'
    '      {message.content}\n'
    '    </motion.div>\n'
    '  );\n'
    '}'
))

story.append(add_heading('7.4 Connecting the UI to the Routing Gateway', h2_style, level=1))

story.append(body(
    'The frontend connects to the AI routing gateway through a simple API layer. In Next.js, this is '
    'implemented as an API route that proxies requests from the client to the routing gateway, adding '
    'authentication, rate limiting, and request tracking as needed. The streaming response pattern is '
    'particularly important for AI chat interfaces: instead of waiting for the complete response, the '
    'UI displays tokens as they arrive, providing immediate feedback and reducing perceived latency. '
    'This pattern is implemented using the Server-Sent Events (SSE) protocol or the streaming response '
    'API provided by the Vercel AI SDK.'
))

story.append(code_block(
    '// Next.js API route: app/api/chat/route.ts\n'
    'import { NextRequest } from "next/server";\n\n'
    'const GATEWAY_URL = process.env.GATEWAY_URL || "http://localhost:3001";\n\n'
    'export async function POST(req: NextRequest) {\n'
    '  const { messages } = await req.json();\n'
    '  const response = await fetch(`${GATEWAY_URL}/v1/chat/completions`, {\n'
    '    method: "POST",\n'
    '    headers: { "Content-Type": "application/json" },\n'
    '    body: JSON.stringify({\n'
    '      model: "free-chat",  // routing gateway selects provider\n'
    '      messages,\n'
    '      stream: true,\n'
    '    }),\n'
    '  });\n'
    '  return new Response(response.body, {\n'
    '    headers: { "Content-Type": "text/event-stream" },\n'
    '  });\n'
    '}'
))

# ============================================================================
# SECTION 8: Layer 6 - Ubuntu Host Configuration
# ============================================================================
story.extend(add_major_section('8. Layer 6: Ubuntu Linux Host Configuration'))

story.append(add_heading('8.1 System Requirements and Preparation', h2_style, level=1))

story.append(body(
    'The Ubuntu Linux host serves as the foundation for the entire AI agentic stack. This section covers '
    'the system setup, dependency installation, and configuration needed to prepare your Ubuntu machine '
    'as a fully capable AI development workstation. The recommended Ubuntu versions are 22.04 LTS or '
    '24.04 LTS, both of which provide long-term support, excellent hardware compatibility, and access to '
    'the latest development tools through the apt package manager and alternative installation methods.'
))

story.append(body(
    'Hardware requirements vary depending on whether you plan to run local LLMs. For cloud-only workflows, '
    'any modern machine with 4GB RAM and a stable internet connection is sufficient. For local LLM '
    'deployment, the requirements increase significantly: 8GB RAM minimum for 7B parameter models, '
    '16GB for 13B models, and 32GB+ for 70B models. GPU acceleration is recommended but not required; '
    'Ollama supports both CPU inference (slower but functional) and GPU inference via NVIDIA CUDA.'
))

story.append(code_block(
    '# Update system packages\n'
    'sudo apt update && sudo apt upgrade -y\n\n'
    '# Install essential development tools\n'
    'sudo apt install -y build-essential curl git unzip \\\n'
    '  python3 python3-pip python3-venv \\\n'
    '  nodejs npm\n\n'
    '# Install Node.js 20+ via NodeSource (if default is older)\n'
    'curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -\n'
    'sudo apt install -y nodejs\n\n'
    '# Verify installations\n'
    'node --version   # Should be v20+\n'
    'python3 --version  # Should be 3.10+\n'
    'npm --version'
))

story.append(add_heading('8.2 Credential and Configuration Management', h2_style, level=1))

story.append(body(
    'Managing API keys and configuration files across multiple tools can become chaotic. This blueprint '
    'recommends a centralized approach using a credentials vault directory and environment variable '
    'management. All API keys are stored in a single configuration file that is sourced by all tools, '
    'ensuring consistency and simplifying key rotation. The vault should be protected with appropriate '
    'file permissions (readable only by your user) and never committed to version control.'
))

story.append(code_block(
    '# Create centralized credential vault\n'
    'mkdir -p ~/.ai-agent\n'
    'cat > ~/.ai-agent/credentials.env << \'EOF\'\n'
    'export GEMINI_API_KEY="your_gemini_key"\n'
    'export GROQ_API_KEY="your_groq_key"\n'
    'export TOGETHER_API_KEY="your_together_key"\n'
    'export OPENAI_API_KEY="your_openai_key"  # Optional paid fallback\n'
    'export ANTHROPIC_API_KEY="your_claude_key"  # Optional paid fallback\n'
    'EOF\n\n'
    '# Protect the vault\n'
    'chmod 600 ~/.ai-agent/credentials.env\n\n'
    '# Source in shell config\n'
    'echo \'source ~/.ai-agent/credentials.env\' >> ~/.bashrc\n'
    'source ~/.bashrc'
))

story.append(add_heading('8.3 Optional: Docker-Based Deployment', h2_style, level=1))

story.append(body(
    'For teams or environments where reproducibility is critical, the entire AI agentic stack can be '
    'containerized using Docker. This approach ensures that every team member runs the exact same '
    'configuration, eliminates "works on my machine" issues, and simplifies deployment to cloud servers. '
    'A Docker Compose file can orchestrate all the services: the routing gateway, LiteLLM proxy, Ollama, '
    'and the Next.js application, each in its own container with defined networking and volume mounts.'
))

story.append(code_block(
    '# docker-compose.yml for the full AI Agentic Stack\n'
    'version: "3.8"\n'
    'services:\n'
    '  gateway:\n'
    '    image: decolua/9router:latest\n'
    '    ports: ["3001:3001"]\n'
    '    volumes: ["./config.yaml:/app/config.yaml"]\n'
    '    env_file: ~/.ai-agent/credentials.env\n\n'
    '  litellm:\n'
    '    image: ghcr.io/berriai/litellm:main-latest\n'
    '    ports: ["8000:8000"]\n'
    '    env_file: ~/.ai-agent/credentials.env\n\n'
    '  ollama:\n'
    '    image: ollama/ollama:latest\n'
    '    ports: ["11434:11434"]\n'
    '    volumes: ["ollama-data:/root/.ollama"]\n'
    '    deploy:\n'
    '      resources:\n'
    '        reservations:\n'
    '          devices:\n'
    '            - capabilities: [gpu]  # Optional GPU support\n\n'
    '  app:\n'
    '    build: .\n'
    '    ports: ["3000:3000"]\n'
    '    depends_on: [gateway, litellm]\n\n'
    'volumes:\n'
    '  ollama-data:'
))

# ============================================================================
# SECTION 9: Troubleshooting & Discussions
# ============================================================================
story.extend(add_major_section('9. Troubleshooting and Common Questions'))

story.append(add_heading('9.1 Hitting Free-Tier Rate Limits', h2_style, level=1))

story.append(body(
    'The most common issue when relying on free-tier providers is encountering rate limits (HTTP 429 '
    'errors). The routing gateway handles this automatically through its tier-based fallback mechanism. '
    'When a provider returns a 429, the gateway retries the request with the next provider in the '
    'tier order. The circuit breaker pattern prevents cascading failures: if a provider fails '
    'consistently (e.g., more than 5 consecutive errors within a time window), it is temporarily '
    'removed from the rotation until it recovers. You can customize the fallback behavior in the '
    'gateway configuration file.'
))

story.append(code_block(
    '# Fallback configuration for 9Router\n'
    'fallback_strategy:\n'
    '  - after_429_retry: 2        # Retry twice on rate limit\n'
    '  - after_quota_exceeded: true  # Switch provider when quota exceeded\n'
    '  - circuit_breaker_threshold: 5  # Disable provider after 5 failures'
))

story.append(add_heading('9.2 Running Completely Offline', h2_style, level=1))

story.append(body(
    'Yes, you can run the entire stack offline using LiteLLM with Ollama. In this configuration, no '
    'API keys are required, and all processing happens locally. This is ideal for air-gapped environments, '
    'sensitive data processing, or situations where internet access is unreliable. The setup involves '
    'installing Ollama, pulling the desired models, and pointing LiteLLM to the local Ollama endpoint. '
    'The resulting system provides unlimited AI assistance with no external dependencies whatsoever.'
))

story.append(code_block(
    '# Offline setup\n'
    'curl -fsSL https://ollama.com/install.sh | sh\n'
    'ollama pull llama3:8b\n'
    'ollama pull codellama:7b\n\n'
    '# Start LiteLLM pointing to local Ollama\n'
    'pip install litellm[proxy]\n'
    'litellm --model ollama/llama3 --port 8000 \\\n'
    '  --api_base http://localhost:11434\n\n'
    '# No API keys required - completely unlimited'
))

story.append(add_heading('9.3 Dashboard Not Loading', h2_style, level=1))

story.append(body(
    'If the routing gateway dashboard is not accessible, there are several common causes to check. '
    'First, verify that the gateway process is running using process monitoring commands. Second, check '
    'for port conflicts, as another service might be using the same port (typically 3001). Third, ensure '
    'that the configuration file is valid YAML and that all required fields are present. Finally, try '
    'restarting the gateway with verbose logging enabled to see detailed error messages that can help '
    'diagnose the issue.'
))

story.append(code_block(
    '# Check if gateway is running\n'
    'ps aux | grep 9router\n\n'
    '# Check port conflicts\n'
    'sudo netstat -tulpn | grep 3001\n\n'
    '# Restart with verbose logging\n'
    'npm start -- --config config.yaml --dashboard --log-level debug\n\n'
    '# Test gateway health\n'
    'curl http://localhost:3001/health'
))

story.append(add_heading('9.4 Model Quality vs. Cost Trade-offs', h2_style, level=1))

story.append(body(
    'A common concern is whether free models provide sufficient quality for professional development '
    'work. The answer depends on the task: for code completion, debugging, and refactoring, free models '
    'like Gemini Flash and Groq-hostored Llama 3 are excellent. For complex architectural decisions, '
    'long-context reasoning, and creative writing, premium models like GPT-4 or Claude may provide '
    'noticeably better results. The beauty of the tiered routing approach is that you get the best of '
    'both worlds: free models for the majority of tasks, with automatic escalation to premium models '
    'only when needed. In practice, most developers find that free models handle 80-90% of their '
    'daily workflow, with paid models reserved for the most challenging problems.'
))

# ============================================================================
# SECTION 10: Verification Checklist
# ============================================================================
story.extend(add_major_section('10. Final Verification Checklist'))

story.append(body(
    'Before considering your AI agentic environment fully operational, verify each item in the following '
    'checklist. Each item represents a critical capability that must be working correctly for the stack '
    'to function as designed. If any item fails, refer to the corresponding section in this guide for '
    'troubleshooting instructions.'
))

checklist_items = [
    'Silent Protocol embedded in agent memory and running as pre-response hook',
    'At least one AI coding agent installed and functional (OpenCode recommended)',
    'Routing gateway (9Router, OmniRoute, or LiteLLM) installed and configured',
    'Free-tier-first routing enabled in gateway configuration',
    'At least two free LLM providers configured with valid API keys',
    'Ollama installed with at least one model pulled and running locally',
    'Fallback to local model works when cloud providers are unavailable',
    'API endpoint accessible from your development tools',
    'Next.js project created with Framer Motion and GSAP installed',
    'UI components render correctly with animations functioning',
    'Dashboard accessible (if using 9Router or OmniRoute with dashboard enabled)',
    'Docker Compose configuration tested (if using containerized deployment)',
]

checklist_data = [
    [Paragraph('<b>#</b>', th_style), Paragraph('<b>Verification Item</b>', th_style), Paragraph('<b>Status</b>', th_style)]
]
for i, item in enumerate(checklist_items, 1):
    checklist_data.append([
        Paragraph(str(i), td_center),
        Paragraph(item, td_style),
        Paragraph('[ ]', td_center)
    ])

check_col_ratios = [0.06, 0.82, 0.12]
check_col_w = [r * AVAILABLE_WIDTH for r in check_col_ratios]
story.append(Spacer(1, 12))
story.append(make_table(checklist_data, check_col_w))
story.append(Paragraph('Table 3: Final Verification Checklist', caption_style))

story.append(Spacer(1, 18))

story.append(body(
    'Once all items in the checklist are verified, your AI Agentic Stack is fully operational. You now '
    'have a free, unlimited, and resilient AI development environment that leverages the best available '
    'free-tier cloud models, intelligent routing with automatic fallback, and local model deployment '
    'for complete independence. The architecture is designed to evolve: as new free providers emerge, '
    'as open-source models improve, and as new tools are released, each layer can be independently '
    'updated without disrupting the others. This is not just a setup guide; it is a living blueprint '
    'for sustainable, cost-free AI-powered development.'
))

# ============================================================================
# SECTION 11: Tool Reference Matrix
# ============================================================================
story.extend(add_major_section('11. Tool Reference Matrix'))

story.append(body(
    'The following table provides a comprehensive reference of all tools discussed in this blueprint, '
    'including their installation methods, primary use cases, and verification status. Tools marked as '
    '"Verified" have been confirmed as real, actively maintained projects with working installation '
    'methods as of 2025-2026. Tools marked as "Emerging" are newer projects that may have less stable '
    'APIs or documentation. This distinction helps you make informed decisions about which tools to '
    'rely on for production environments versus experimentation.'
))

tool_data = [
    [Paragraph('<b>Tool</b>', th_style), Paragraph('<b>Category</b>', th_style),
     Paragraph('<b>Install Method</b>', th_style), Paragraph('<b>Status</b>', th_style),
     Paragraph('<b>Primary Use</b>', th_style)],
    [Paragraph('OpenCode', td_style), Paragraph('Agent', td_center),
     Paragraph('curl / npm', td_style), Paragraph('Verified', td_center),
     Paragraph('Free AI coding agent', td_style)],
    [Paragraph('9Router', td_style), Paragraph('Gateway', td_center),
     Paragraph('git clone + npm', td_style), Paragraph('Verified', td_center),
     Paragraph('AI router with RTK compression', td_style)],
    [Paragraph('OmniRoute', td_style), Paragraph('Gateway', td_center),
     Paragraph('git clone + npm', td_style), Paragraph('Verified', td_center),
     Paragraph('Universal proxy, 160+ providers', td_style)],
    [Paragraph('LiteLLM', td_style), Paragraph('Proxy', td_center),
     Paragraph('pip install', td_style), Paragraph('Verified', td_center),
     Paragraph('Unified OpenAI-compatible API', td_style)],
    [Paragraph('Ollama', td_style), Paragraph('Local LLM', td_center),
     Paragraph('curl install script', td_style), Paragraph('Verified', td_center),
     Paragraph('Local model deployment', td_style)],
    [Paragraph('LocalAI', td_style), Paragraph('Local LLM', td_center),
     Paragraph('Docker / binary', td_style), Paragraph('Verified', td_center),
     Paragraph('Self-hosted OpenAI alternative', td_style)],
    [Paragraph('Gemini API', td_style), Paragraph('Provider', td_center),
     Paragraph('API key setup', td_style), Paragraph('Verified', td_center),
     Paragraph('Free tier: 60 req/min', td_style)],
    [Paragraph('Groq', td_style), Paragraph('Provider', td_center),
     Paragraph('API key setup', td_style), Paragraph('Verified', td_center),
     Paragraph('Ultra-low latency inference', td_style)],
    [Paragraph('Together AI', td_style), Paragraph('Provider', td_center),
     Paragraph('API key setup', td_style), Paragraph('Verified', td_center),
     Paragraph('Free 10K tokens/day', td_style)],
    [Paragraph('Next.js', td_style), Paragraph('Framework', td_center),
     Paragraph('npx create-next-app', td_style), Paragraph('Verified', td_center),
     Paragraph('Full-stack web framework', td_style)],
    [Paragraph('Framer Motion', td_style), Paragraph('Animation', td_center),
     Paragraph('npm install', td_style), Paragraph('Verified', td_center),
     Paragraph('React animation primitives', td_style)],
    [Paragraph('GSAP', td_style), Paragraph('Animation', td_center),
     Paragraph('npm install', td_style), Paragraph('Verified', td_center),
     Paragraph('Scroll and timeline animations', td_style)],
    [Paragraph('shadcn/ui', td_style), Paragraph('Components', td_center),
     Paragraph('npx shadcn init', td_style), Paragraph('Verified', td_center),
     Paragraph('Modern React component library', td_style)],
]

tool_col_ratios = [0.14, 0.12, 0.22, 0.10, 0.42]
tool_col_w = [r * AVAILABLE_WIDTH for r in tool_col_ratios]
story.append(Spacer(1, 12))
story.append(make_table(tool_data, tool_col_w))
story.append(Paragraph('Table 4: Complete Tool Reference Matrix', caption_style))


# ============================================================================
# Build Document
# ============================================================================
doc = TocDocTemplate(
    BODY_PDF,
    pagesize=A4,
    leftMargin=LEFT_MARGIN,
    rightMargin=RIGHT_MARGIN,
    topMargin=TOP_MARGIN,
    bottomMargin=BOTTOM_MARGIN,
    title='AI Agentic Stack: The Full-Stack Design Blueprint for Ubuntu',
    author='Z.ai',
    creator='Z.ai',
    subject='Free and Unlimited AI Agentic Environment Setup Guide'
)

doc.multiBuild(story)
print(f"Body PDF generated: {BODY_PDF}")
