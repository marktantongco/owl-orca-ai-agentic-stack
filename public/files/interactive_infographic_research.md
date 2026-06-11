# Interactive Animated Infographic Research Report
## For: AI Agentic Architecture Diagram (6 Layers: User → Ubuntu Host)
## Project: Next.js 16 + React 19 + Tailwind CSS 4 + shadcn/ui

---

## 1. Animation Library Comparison

### 1.1 Framer Motion (now "Motion") — RECOMMENDED PRIMARY

**Already installed** in project (`framer-motion: ^12.23.2`)

| Aspect | Detail |
|--------|--------|
| Bundle Size | ~59KB gzipped (smallest of major options) |
| Weekly Downloads | ~6M (most popular React animation lib) |
| React Integration | Native — declarative `<motion.div>` components |
| SVG Support | Excellent — `pathLength`, SVG morphing, line drawing |
| Scroll Animation | Built-in `useScroll`, `useInView`, `whileInView` |
| Learning Curve | Low — declarative API |
| TypeScript | First-class support |
| License | MIT (free) |

**Pros:**
- Already in our package.json — zero additional cost
- Declarative API fits React paradigm perfectly
- Built-in `AnimatePresence` for exit animations
- `useScroll()` + `useTransform()` for scroll-linked effects
- SVG `pathLength` animation for drawing lines
- `whileHover`, `whileTap` for interactive states
- Layout animations with `layoutId`
- Hardware-accelerated transforms

**Cons:**
- No timeline-based sequencing (unlike GSAP)
- Complex orchestrated animations require manual coordination
- No built-in ScrollTrigger pinning (need GSAP or custom)

**Code Snippet — SVG Path Drawing (data flow lines):**
```tsx
'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

function AnimatedFlowLine({ path, delay = 0 }: { path: string; delay?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <svg ref={ref} className="absolute inset-0 w-full h-full">
      <motion.path
        d={path}
        fill="none"
        stroke="url(#flowGradient)"
        strokeWidth={2}
        initial={{ pathLength: 0 }}
        animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
        transition={{ duration: 1.5, delay, ease: 'easeInOut' }}
      />
    </svg>
  )
}
```

**Code Snippet — Layer-by-Layer Scroll Reveal:**
```tsx
'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

function ArchitectureLayer({ layer, index }: { layer: LayerData; index: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        duration: 0.7,
        delay: index * 0.15,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className="layer-card"
    >
      {/* Layer content */}
    </motion.div>
  )
}
```

**Code Snippet — Node Pulse/Glow Effect:**
```tsx
function PulsingNode({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <motion.div
      className="relative"
      animate={{
        boxShadow: [
          `0 0 0 0 ${color}40`,
          `0 0 0 12px ${color}00`,
        ]
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeOut'
      }}
    >
      {children}
    </motion.div>
  )
}
```

---

### 1.2 GSAP + ScrollTrigger — RECOMMENDED FOR SCROLL PINNING

| Aspect | Detail |
|--------|--------|
| Bundle Size | ~69KB minified (core + ScrollTrigger) |
| Weekly Downloads | ~3M |
| React Integration | Imperative — requires `useEffect` + `useRef` |
| SVG Support | Excellent — DrawSVG plugin, MorphSVG |
| Scroll Animation | Best-in-class ScrollTrigger with pinning |
| Learning Curve | Medium — imperative API |
| License | Free for standard use; some plugins require Club GreenSock membership |

**Pros:**
- **ScrollTrigger is unmatched** — pin sections, scrub animations to scroll position
- Timeline-based sequencing for complex orchestrated reveals
- DrawSVG plugin for SVG path drawing (premium)
- MorphSVG for shape morphing (premium)
- Battle-tested, used on award-winning sites
- Framework-agnostic skills transfer

**Cons:**
- Imperative approach doesn't fit React's declarative paradigm
- Requires careful cleanup in `useEffect` (memory leaks if not disposed)
- Premium plugins cost money (DrawSVG, MorphSVG: $99+/yr)
- More boilerplate than Framer Motion
- Can conflict with React's rendering cycle

**Code Snippet — GSAP ScrollTrigger Layer Pinning:**
```tsx
'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

function PinnedArchitectureDiagram() {
  const containerRef = useRef<HTMLDivElement>(null)
  const layersRef = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Pin the diagram while layers reveal
      ScrollTrigger.create({
        trigger: containerRef.current!,
        start: 'top top',
        end: '+=300%',  // 3x scroll height for all layers
        pin: true,
        scrub: 1,
      })

      // Animate each layer
      layersRef.current.forEach((layer, i) => {
        gsap.fromTo(layer,
          { opacity: 0, y: 80, scale: 0.9 },
          {
            opacity: 1, y: 0, scale: 1,
            scrollTrigger: {
              trigger: layer,
              start: `top+=${i * 200} center`,
              end: `top+=${i * 200 + 200} center`,
              scrub: 1,
            }
          }
        )
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className="relative h-screen">
      {/* Layers */}
    </div>
  )
}
```

---

### 1.3 React Spring — FOR PHYSICS-BASED ANIMATIONS

| Aspect | Detail |
|--------|--------|
| Bundle Size | ~35KB gzipped |
| Weekly Downloads | ~500K |
| React Integration | Native — hooks-based API |
| SVG Support | Good — `useSpring`, `animated` components |
| Scroll Animation | `useIntersectionObserver` (limited) |
| Learning Curve | Medium — spring physics concepts |
| License | MIT (free) |

**Pros:**
- Smallest bundle of the major animation libraries
- Physics-based animations feel natural and organic
- `useSpring` for individual spring animations
- `useTrail` for staggered spring animations
- `useTransition` for mount/unmount transitions
- Best for UI elements that need "realistic" feel

**Cons:**
- No built-in scroll animation primitives
- No timeline-based sequencing
- Imperative spring configuration can be tricky
- Less community support/examples than Framer Motion
- No built-in layout animations

**Code Snippet — Spring-Based Node Expansion:**
```tsx
import { useSpring, animated } from '@react-spring/web'

function ExpandableNode({ isExpanded, children }: { isExpanded: boolean; children: React.ReactNode }) {
  const styles = useSpring({
    from: { height: 0, opacity: 0 },
    to: { height: isExpanded ? 300 : 0, opacity: isExpanded ? 1 : 0 },
    config: { mass: 1, tension: 200, friction: 26 },
  })

  return (
    <animated.div style={styles} className="overflow-hidden">
      {children}
    </animated.div>
  )
}
```

---

### 1.4 D3.js — FOR DATA-DRIVEN DIAGRAMS

| Aspect | Detail |
|--------|--------|
| Bundle Size | ~80KB gzipped (full), tree-shakeable to ~20KB |
| Weekly Downloads | ~8M (most popular data viz) |
| React Integration | Requires wrapper — conflict with React DOM management |
| SVG Support | Best-in-class — purpose-built for SVG |
| Scroll Animation | Not built-in — combine with GSAP/Framer Motion |
| Learning Curve | High — functional/chaining API |
| License | BSD (free) |

**Pros:**
- Unmatched for data-driven visualizations
- Force-directed layouts for node graphs
- `d3-hierarchy` for tree layouts
- `d3-zoom` for pan/zoom on SVG
- Battle-tested, 10+ years of development
- Massive ecosystem

**Cons:**
- **Reacts poorly with React** — both try to control the DOM
- Requires "React wrapper" pattern (use D3 for calculations, React for rendering)
- High learning curve
- Imperative API conflicts with React's declarative paradigm
- Overkill for a static architecture diagram (use React Flow instead)

**Code Snippet — D3 Force Layout with React:**
```tsx
import { useEffect, useState } from 'react'
import { forceSimulation, forceLink, forceManyBody, forceCenter } from 'd3-force'

// Use D3 for calculations, React for rendering
function ForceDiagram({ nodes, links }) {
  const [simulatedNodes, setSimulatedNodes] = useState(nodes)

  useEffect(() => {
    const simulation = forceSimulation(nodes)
      .force('link', forceLink(links).id(d => d.id))
      .force('charge', forceManyBody().strength(-300))
      .force('center', forceCenter(400, 300))

    simulation.on('tick', () => {
      setSimulatedNodes([...nodes])
    })

    return () => simulation.stop()
  }, [nodes, links])

  return (
    <svg>
      {simulatedNodes.map(node => (
        <circle key={node.id} cx={node.x} cy={node.y} r={20} />
      ))}
    </svg>
  )
}
```

---

### 1.5 Lottie — FOR COMPLEX PRE-BUILT ANIMATIONS

| Aspect | Detail |
|--------|--------|
| Bundle Size | **7.3MB** (lottie-web — extremely large!) |
| Weekly Downloads | ~2M |
| React Integration | `lottie-react` wrapper available |
| SVG Support | Renders from After Effects JSON |
| Scroll Animation | Not built-in |
| Learning Curve | Low for playback, high for creation |
| License | MIT (player), After Effects required for creation |

**Pros:**
- Highest visual fidelity — anything a designer can create in After Effects
- `lottie-react` makes playback simple
- Small JSON files for complex animations
- Cross-platform consistency

**Cons:**
- **7.3MB bundle** — dealbreaker for mobile-first web
- Requires After Effects + Bodymovin for creation
- Not interactive — just playback
- Can't dynamically change animation based on state
- Performance issues on low-end mobile devices
- Not suitable for data-driven or interactive elements

**Verdict: NOT RECOMMENDED** — too heavy, not interactive enough.

---

### 1.6 React Flow — FOR INTERACTIVE NODE DIAGRAMS (BONUS DISCOVERY)

| Aspect | Detail |
|--------|--------|
| Bundle Size | ~90KB gzipped |
| Weekly Downloads | ~800K |
| React Integration | Native — purpose-built for React |
| SVG Support | Custom nodes with full SVG support |
| Zoom/Pan | Built-in with touch support |
| License | MIT (free), paid pro features |

**Pros:**
- **Built exactly for this use case** — interactive node-based diagrams
- Built-in zoom, pan, and touch support (mobile!)
- Custom nodes can be any React component
- Built-in edge rendering with animation support
- Mini-map and controls built-in
- Handles layout automatically with dagre/elkjs
- `animateMotion` support on edges for data flow
- Active community, well-maintained

**Cons:**
- Larger bundle than Framer Motion alone
- Requires learning React Flow API
- Default styles need significant customization
- Pro features (collaboration) are paid

**Code Snippet — React Flow Animated Architecture:**
```tsx
'use client'
import ReactFlow, {
  Node, Edge, Background, Controls, MiniMap,
  useNodesState, useEdgesState
} from 'reactflow'
import 'reactflow/dist/style.css'

// Custom animated edge for data flow
function AnimatedDataFlowEdge({
  id, sourceX, sourceY, targetX, targetY
}: EdgeProps) {
  const [edgePath] = getBezierPath({
    sourceX, sourceY, targetX, targetY,
  })

  return (
    <>
      <path d={edgePath} stroke="#f59e0b" strokeWidth={2} fill="none" />
      {/* Animated particle along path */}
      <circle r={4} fill="#f59e0b">
        <animateMotion
          dur="2s"
          repeatCount="indefinite"
          path={edgePath}
        />
      </circle>
    </>
  )
}

// Custom node with hover details
function ArchitectureNode({ data }: NodeProps) {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <motion.div
      onMouseEnter={() => setShowDetails(true)}
      onMouseLeave={() => setShowDetails(false)}
      whileHover={{ scale: 1.05 }}
      className="px-4 py-2 rounded-lg bg-white dark:bg-gray-900 shadow-lg border"
    >
      <div className="font-semibold">{data.label}</div>
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="text-xs text-muted-foreground mt-1"
          >
            {data.description}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
```

---

## 2. Recommended Tech Stack

### PRIMARY: Framer Motion (already installed) + React Flow

**Why this combo is optimal for our 6-layer architecture infographic:**

| Feature | Implementation |
|---------|---------------|
| Layer-by-layer scroll reveal | Framer Motion `useInView` + `whileInView` |
| Click-to-expand node details | Framer Motion `AnimatePresence` + `layoutId` |
| Hover tooltips | shadcn/ui Tooltip + Framer Motion `whileHover` |
| Animated data flow lines | React Flow custom edges with `animateMotion` |
| Node pulse/glow | Framer Motion `animate` keyframes |
| Zoom & pan (mobile) | React Flow built-in (touch support!) |
| Collapsible sections | Framer Motion `AnimatePresence` |
| Responsive layout | React Flow + Tailwind CSS breakpoints |

### OPTIONAL: GSAP for scroll pinning (if we want pinned-scroll storytelling)

Only add if we want the "scroll-pinned narrative" pattern where the entire architecture diagram stays fixed while the user scrolls through layers revealing one at a time. Framer Motion can do basic scroll-linked animations, but GSAP ScrollTrigger's pinning is superior.

---

## 3. Interactive Infographic Patterns

### 3.1 Layer-by-Layer Scroll Reveal

**Best for:** Mobile-first progressive disclosure of the 6 layers

```
User Layer → ADE Tools → Proxy Stack → Agent Framework → Local Models → Ubuntu Host
```

**Pattern A: Framer Motion whileInView (RECOMMENDED for mobile)**
```tsx
const LAYERS = [
  { id: 'user', label: 'User Layer', components: ['Cursor', 'OpenCode', 'Aider'] },
  { id: 'proxy', label: 'Proxy Stack', components: ['LiteLLM', 'FreeLLMAPI', 'OpenRouter'] },
  { id: 'agent', label: 'Agent Framework', components: ['LangGraph', 'CrewAI', 'AutoGen'] },
  { id: 'local', label: 'Local Models', components: ['Ollama', 'LM Studio'] },
  { id: 'host', label: 'Ubuntu Host', components: ['Docker', 'Systemd'] },
]

function ScrollRevealArchitecture() {
  return (
    <div className="space-y-8">
      {LAYERS.map((layer, index) => (
        <motion.div
          key={layer.id}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <LayerCard layer={layer} index={index} />
        </motion.div>
      ))}
    </div>
  )
}
```

**Pattern B: GSAP ScrollTrigger Pinning (for desktop storytelling)**
- Pin the entire diagram viewport
- Scrub through layers as user scrolls
- Each layer fades in sequentially
- Best for landing pages, not content-heavy wiki pages

### 3.2 Click-to-Expand Node Details

```tsx
function ExpandableNode({ node }: { node: ArchitectureNode }) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <motion.div layout layoutId={node.id} onClick={() => setIsExpanded(!isExpanded)}>
      <motion.div layout="position" className="flex items-center gap-2">
        <span className="text-xl">{node.icon}</span>
        <span className="font-semibold">{node.label}</span>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-3 p-3 rounded-lg bg-muted">
              <p className="text-sm">{node.description}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {node.tags.map(tag => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
```

### 3.3 Hover Tooltips on Architecture Components

Uses shadcn/ui Tooltip (already installed) + Framer Motion:

```tsx
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

function HoverableNode({ node }: { node: ArchitectureNode }) {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            whileHover={{ scale: 1.08, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="cursor-pointer px-3 py-2 rounded-lg border bg-card hover:border-amber-500/50 transition-colors"
          >
            <span className="text-lg">{node.icon}</span>
            <span className="text-sm font-medium">{node.label}</span>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <p className="font-semibold">{node.label}</p>
          <p className="text-xs text-muted-foreground mt-1">{node.description}</p>
          <div className="flex gap-1 mt-2">
            {node.tags.map(t => <Badge key={t} variant="outline" className="text-xs">{t}</Badge>)}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
```

### 3.4 Animated Data Flow Lines Between Layers

**Option A: SVG `<animateMotion>` (simplest, pure SVG)**
```tsx
function DataFlowParticle({ path }: { path: string }) {
  return (
    <>
      {/* Base line */}
      <path d={path} stroke="rgba(245,158,11,0.3)" strokeWidth={2} fill="none" />
      {/* Animated particle */}
      <circle r={3} fill="#f59e0b" opacity={0.8}>
        <animateMotion dur="2s" repeatCount="indefinite" path={path} />
      </circle>
      {/* Glow trail */}
      <circle r={6} fill="#f59e0b" opacity={0.2}>
        <animateMotion dur="2s" repeatCount="indefinite" path={path} />
      </circle>
    </>
  )
}
```

**Option B: Framer Motion pathLength animation (more control)**
```tsx
function AnimatedFlowLine({ d, delay = 0 }: { d: string; delay?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <svg ref={ref} className="absolute inset-0 overflow-visible">
      <defs>
        <linearGradient id={`grad-${delay}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity={0} />
          <stop offset="50%" stopColor="#f59e0b" stopOpacity={1} />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
        </linearGradient>
      </defs>
      <motion.path
        d={d}
        fill="none"
        stroke={`url(#grad-${delay})`}
        strokeWidth={2}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ duration: 2, delay, ease: 'easeInOut' }}
      />
    </svg>
  )
}
```

### 3.5 Responsive Mobile-First Layout

```tsx
function ResponsiveArchitecture() {
  const isMobile = useMediaQuery('(max-width: 768px)')

  if (isMobile) {
    // Vertical stack layout — layers stack top to bottom
    // Single column, tap to expand
    return (
      <div className="space-y-4 p-4">
        {LAYERS.map((layer, i) => (
          <MobileLayerCard key={layer.id} layer={layer} index={i} />
        ))}
      </div>
    )
  }

  // Desktop: Interactive node diagram with React Flow
  return (
    <div className="h-[80vh]">
      <ReactFlow nodes={nodes} edges={edges}>
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  )
}

// Custom hook for media query
function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false)
  useEffect(() => {
    const mql = window.matchMedia(query)
    setMatches(mql.matches)
    mql.addEventListener('change', (e) => setMatches(e.matches))
    return () => mql.removeEventListener('change', () => {})
  }, [query])
  return matches
}
```

---

## 4. Architecture Diagram-Specific Techniques

### 4.1 SVG Path Animation (Drawing Lines)

The core technique uses `stroke-dasharray` + `stroke-dashoffset` or Framer Motion's `pathLength`:

```tsx
function DrawLine({ path, duration = 2, delay = 0 }: Props) {
  return (
    <motion.path
      d={path}
      fill="none"
      stroke="#f59e0b"
      strokeWidth={2}
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration, delay, ease: 'easeInOut' }}
    />
  )
}
```

**How it works:** Framer Motion's `pathLength` internally sets `stroke-dasharray` and `stroke-dashoffset` based on the total path length, animating from 0 (invisible) to 1 (fully drawn).

### 4.2 Node Pulse/Glow Effects

```tsx
function GlowingNode({ color = '#f59e0b', children }: Props) {
  return (
    <motion.div
      className="relative"
      animate={{
        boxShadow: [
          `0 0 0px 0px ${color}00`,
          `0 0 20px 5px ${color}30`,
          `0 0 0px 0px ${color}00`,
        ],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {/* Inner ring pulse */}
      <motion.div
        className="absolute inset-0 rounded-lg border-2"
        style={{ borderColor: color }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      {children}
    </motion.div>
  )
}
```

### 4.3 Particle Effects for Data Flow

Pure CSS + SVG approach (no library needed):

```tsx
function ParticleFlow({ path }: { path: string }) {
  const particles = Array.from({ length: 5 }, (_, i) => ({
    delay: i * 0.4,
    size: 3 - i * 0.3,
    opacity: 1 - i * 0.15,
  }))

  return (
    <g>
      {/* Base path */}
      <path d={path} stroke="rgba(245,158,11,0.2)" strokeWidth={1} fill="none" />
      {/* Particles */}
      {particles.map((p, i) => (
        <circle key={i} r={p.size} fill="#f59e0b" opacity={p.opacity}>
          <animateMotion
            dur="3s"
            begin={`${p.delay}s`}
            repeatCount="indefinite"
            path={path}
          />
        </circle>
      ))}
    </g>
  )
}
```

### 4.4 Zoom and Pan on Mobile

**Option A: React Flow (best for node diagrams)**
```tsx
<ReactFlow
  nodes={nodes}
  edges={edges}
  fitView
  minZoom={0.3}
  maxZoom={2}
  // Touch support built-in!
  proOptions={{ hideAttribution: true }}
>
  <Controls showInteractive={false} />
</ReactFlow>
```

**Option B: react-zoom-pan-pinch (lighter alternative)**
```tsx
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'

function ZoomableDiagram() {
  return (
    <TransformWrapper
      initialScale={1}
      minScale={0.5}
      maxScale={3}
      centerOnInit
    >
      <TransformComponent>
        <svg viewBox="0 0 1200 800" className="w-full h-full">
          {/* Architecture diagram SVG */}
        </svg>
      </TransformComponent>
    </TransformWrapper>
  )
}
```

### 4.5 Collapsible Sections

```tsx
function CollapsibleLayer({ layer }: { layer: LayerData }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <motion.div layout className="border rounded-lg overflow-hidden">
      <motion.button
        layout
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between bg-card hover:bg-muted/50 transition-colors"
      >
        <motion.span layout="position" className="flex items-center gap-3">
          <span className="text-xl">{layer.icon}</span>
          <span className="font-semibold">{layer.label}</span>
          <Badge variant="outline">{layer.components.length} components</Badge>
        </motion.span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="p-4 space-y-2">
              {layer.components.map(comp => (
                <div key={comp.name} className="p-2 rounded-md bg-muted/50">
                  {comp.name}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
```

---

## 5. Complete Architecture Diagram Implementation Pattern

### Recommended Component Structure

```
src/
├── components/
│   └── architecture/
│       ├── ArchitectureDiagram.tsx      # Main container
│       ├── DiagramLayer.tsx             # Single layer card
│       ├── DiagramNode.tsx              # Individual node with hover/click
│       ├── FlowLine.tsx                 # Animated data flow SVG line
│       ├── ParticleFlow.tsx             # Particle animation along paths
│       ├── NodeTooltip.tsx              # Tooltip overlay
│       ├── NodeDetails.tsx              # Expanded detail panel
│       ├── MobileStackView.tsx          # Mobile vertical stack layout
│       └── DesktopFlowView.tsx          # Desktop React Flow layout
```

### Main Component Pattern

```tsx
'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ReactFlow from 'reactflow'
import { useMediaQuery } from '@/hooks/use-mobile'
import { LAYERS, type LayerData } from '@/lib/architecture-data'

// 6-Layer Architecture Data
const ARCHITECTURE_LAYERS: LayerData[] = [
  {
    id: 'user',
    label: 'User Layer',
    icon: '👤',
    color: '#f59e0b',
    description: 'Developer interfaces — CLI and IDE tools',
    components: [
      { id: 'opencode', label: 'OpenCode', icon: '⌨️', tags: ['CLI', 'Free'], description: 'Terminal AI coding agent' },
      { id: 'cursor', label: 'Cursor', icon: '🖥️', tags: ['IDE', 'Freemium'], description: 'AI-first code editor' },
      { id: 'aider', label: 'Aider', icon: '💬', tags: ['CLI', 'Free'], description: 'Git-native AI pair programmer' },
    ],
  },
  {
    id: 'proxy',
    label: 'Proxy Stack',
    icon: '🔀',
    color: '#10b981',
    description: 'LLM routing and free-tier aggregation',
    components: [
      { id: 'litellm', label: 'LiteLLM', icon: '⚡', tags: ['Proxy', 'Free'], description: '100+ provider unified API' },
      { id: 'freellmapi', label: 'FreeLLMAPI', icon: '🎁', tags: ['Proxy', 'Free'], description: '1.7B tokens/month free' },
      { id: 'openrouter', label: 'OpenRouter', icon: '🌐', tags: ['Proxy', 'Freemium'], description: 'Unified model API' },
    ],
  },
  {
    id: 'agent',
    label: 'Agent Framework',
    icon: '🤖',
    color: '#8b5cf6',
    description: 'Multi-agent orchestration',
    components: [
      { id: 'langgraph', label: 'LangGraph', icon: '📊', tags: ['Framework', 'Free'], description: 'Graph-based agent workflows' },
      { id: 'crewai', label: 'CrewAI', icon: '👥', tags: ['Framework', 'Free'], description: 'Role-based multi-agent' },
    ],
  },
  {
    id: 'local',
    label: 'Local Models',
    icon: '🧠',
    color: '#ec4899',
    description: 'Self-hosted LLM inference',
    components: [
      { id: 'ollama', label: 'Ollama', icon: '🦙', tags: ['Local', 'Free'], description: 'Run LLMs locally' },
    ],
  },
  {
    id: 'host',
    label: 'Ubuntu Host',
    icon: '🐧',
    color: '#f97316',
    description: 'Infrastructure layer',
    components: [
      { id: 'docker', label: 'Docker', icon: '🐳', tags: ['Infra', 'Free'], description: 'Container runtime' },
      { id: 'systemd', label: 'Systemd', icon: '⚙️', tags: ['Infra', 'Free'], description: 'Service management' },
    ],
  },
]

export default function ArchitectureDiagram() {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null)
  const [selectedNode, setSelectedNode] = useState<string | null>(null)

  if (isMobile) {
    return <MobileStackView layers={ARCHITECTURE_LAYERS} />
  }

  return <DesktopFlowView layers={ARCHITECTURE_LAYERS} />
}
```

---

## 6. Decision Matrix

| Requirement | Framer Motion | GSAP | React Spring | React Flow | D3.js | Lottie |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| Already installed | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| SVG path drawing | ✅ | ✅✅ | ✅ | ❌ | ✅✅ | ❌ |
| Scroll reveal | ✅ | ✅✅ | ⚠️ | ❌ | ❌ | ❌ |
| Scroll pinning | ⚠️ | ✅✅ | ❌ | ❌ | ❌ | ❌ |
| Hover/tap interactions | ✅✅ | ⚠️ | ✅ | ✅ | ❌ | ❌ |
| Zoom/pan (mobile) | ❌ | ❌ | ❌ | ✅✅ | ✅ | ❌ |
| Node diagrams | ⚠️ | ⚠️ | ⚠️ | ✅✅ | ✅ | ❌ |
| Layout animations | ✅✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Physics-based | ❌ | ❌ | ✅✅ | ❌ | ❌ | ❌ |
| Bundle size (small) | ✅ | ✅ | ✅✅ | ⚠️ | ⚠️ | ❌❌ |
| React integration | ✅✅ | ⚠️ | ✅✅ | ✅✅ | ⚠️ | ✅ |
| Mobile performance | ✅✅ | ✅ | ✅✅ | ✅ | ⚠️ | ❌ |

## 7. Final Recommendation

### Primary Stack (START HERE)
1. **Framer Motion** — already installed, handles 80% of needs
   - Scroll reveal with `whileInView`
   - Hover/click interactions with `whileHover`/`whileTap`
   - Node pulse/glow with `animate` keyframes
   - Expand/collapse with `AnimatePresence`
   - SVG path drawing with `pathLength`

2. **React Flow** — install only for desktop interactive view
   - Interactive node diagram with zoom/pan
   - Custom animated edges for data flow
   - Touch support for mobile
   - Mini-map for navigation

### Optional Enhancement
3. **GSAP + ScrollTrigger** — only if we want pinned-scroll storytelling
   - Install `gsap` package (~69KB)
   - Use exclusively for ScrollTrigger pinning
   - Combine with Framer Motion for other animations

### Not Recommended
- **Lottie** — 7.3MB bundle, not interactive, dealbreaker for mobile
- **D3.js** — overkill, React Flow handles node diagrams better
- **React Spring** — Framer Motion covers same use cases with better scroll support

### Implementation Priority
1. ✅ Mobile vertical stack with Framer Motion scroll reveal
2. ✅ Click-to-expand layer details
3. ✅ Hover tooltips with shadcn/ui
4. ✅ Animated flow lines with SVG `animateMotion`
5. ✅ Node pulse/glow effects
6. 🔲 React Flow desktop view (Phase 2)
7. 🔲 GSAP scroll pinning (Phase 2, optional)
8. 🔲 Particle flow effects (Phase 2)
