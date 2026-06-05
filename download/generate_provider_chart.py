#!/usr/bin/env python3
"""Generate the Provider Comparison Matrix chart."""

import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.font_manager as fm
import numpy as np

# Font setup
fm.fontManager.addfont('/usr/share/fonts/truetype/noto-serif-sc/NotoSerifSC-Regular.ttf')
fm.fontManager.addfont('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf')
plt.rcParams['font.sans-serif'] = ['DejaVu Sans', 'Noto Serif SC']
plt.rcParams['axes.unicode_minus'] = False

# Data
providers = [
    'Gemini API',
    'Groq',
    'Together AI',
    'Ollama\n(Local)',
    'OpenAI\n(Trial)',
    'Claude\n(Trial)',
    'LocalAI\n(Self-host)'
]

# Metrics (normalized to 0-10 scale)
free_tokens = [9, 8, 5, 10, 3, 2, 10]       # Free tokens/day
speed = [6, 10, 5, 4, 5, 4, 3]               # Speed (latency inverse)
ease_setup = [9, 8, 6, 7, 9, 8, 4]           # Ease of setup
reliability = [8, 7, 6, 9, 8, 7, 6]          # Reliability
privacy = [3, 3, 3, 10, 2, 2, 10]            # Privacy/offline capability

x = np.arange(len(providers))
width = 0.15

fig, ax = plt.subplots(figsize=(16, 8), facecolor='#F8FAFC')
ax.set_facecolor('#F8FAFC')

colors = ['#3B82F6', '#22C55E', '#F97316', '#8B5CF6', '#64748B']

bars1 = ax.bar(x - 2*width, free_tokens, width, label='Free Tokens Score', color=colors[0], alpha=0.85, edgecolor='white', linewidth=0.5)
bars2 = ax.bar(x - width, speed, width, label='Speed Score', color=colors[1], alpha=0.85, edgecolor='white', linewidth=0.5)
bars3 = ax.bar(x, ease_setup, width, label='Ease of Setup', color=colors[2], alpha=0.85, edgecolor='white', linewidth=0.5)
bars4 = ax.bar(x + width, reliability, width, label='Reliability', color=colors[3], alpha=0.85, edgecolor='white', linewidth=0.5)
bars5 = ax.bar(x + 2*width, privacy, width, label='Privacy / Offline', color=colors[4], alpha=0.85, edgecolor='white', linewidth=0.5)

# Styling
ax.set_xlabel('LLM Provider', fontsize=12, fontweight=600, color='#334155', labelpad=12)
ax.set_ylabel('Score (0-10)', fontsize=12, fontweight=600, color='#334155', labelpad=12)
ax.set_title('Free Tier Provider Comparison Matrix', fontsize=18, fontweight=800, color='#0F172A', pad=20)
ax.set_xticks(x)
ax.set_xticklabels(providers, fontsize=10, fontweight=500, color='#475569')
ax.set_ylim(0, 11.5)
ax.set_yticks(range(0, 11, 2))

# Grid
ax.yaxis.grid(True, alpha=0.15, color='#94A3B8')
ax.set_axisbelow(True)

# Remove top/right borders
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)
ax.spines['left'].set_color('#CBD5E1')
ax.spines['bottom'].set_color('#CBD5E1')

# Legend
ax.legend(loc='upper right', frameon=True, framealpha=0.9, edgecolor='#E2E8F0',
          fontsize=9, ncol=5, bbox_to_anchor=(1.0, 1.0))

# Add value labels on top of bars
for bars in [bars1, bars2, bars3, bars4, bars5]:
    for bar in bars:
        height = bar.get_height()
        if height > 0:
            ax.text(bar.get_x() + bar.get_width()/2., height + 0.15,
                    f'{int(height)}', ha='center', va='bottom',
                    fontsize=7, color='#475569', fontweight=500)

plt.tight_layout()
plt.savefig('/home/z/my-project/download/provider_comparison_matrix.png', dpi=200, bbox_inches='tight',
            facecolor='#F8FAFC', edgecolor='none')
plt.close()
print("Provider comparison chart saved to /home/z/my-project/download/provider_comparison_matrix.png")
