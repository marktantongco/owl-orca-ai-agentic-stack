'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import {
  LayoutDashboard, GitCompare, Network, Puzzle, Gift, Layers,
  Menu, X, Search, Star, Copy, Check, ExternalLink,
  ChevronRight, ChevronDown, Zap, Shield, Cpu, Globe,
  Code, Terminal, Monitor, ArrowRight, BookOpen, Sparkles,
  TrendingUp, Users, Activity, Trophy, FolderTree,
  FileText, FileCode, Settings, Database, Server, Download, Eye, Filter
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { toast } from 'sonner'
import ReactMarkdown from 'react-markdown'
import { SectionErrorBoundary } from '@/components/ErrorBoundary'
import {
  ARCHITECTURE_LAYERS, TOP_PLUGINS, COMPARISON_DATA, CATEGORY_GROUPS,
  ADE_COMPATIBILITY, ULTIMATE_BLUEPRINT_STEPS, PROXY_ENDPOINTS,
  FILE_INVENTORY,
  type ArchLayer, type ArchComponent, type PluginEntry, type CompareItem,
  type ADECompatEntry, type FileEntry
} from '@/lib/architecture-data'

// ==================== HELPERS ====================

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-md bg-amber-100 text-amber-800 hover:bg-amber-200 transition-colors dark:bg-amber-900/30 dark:text-amber-400 dark:hover:bg-amber-900/50"
    >
      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
      {copied ? 'Copied!' : 'Copy'}
    </button>
  )
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={`w-3.5 h-3.5 ${i <= rating ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200 dark:fill-gray-600 dark:text-gray-600'}`} />
      ))}
    </div>
  )
}

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'compare', label: 'A/B Compare', icon: GitCompare },
  { id: 'architecture', label: 'Architecture', icon: Network },
  { id: 'compatibility', label: 'ADE Compat', icon: Shield },
  { id: 'plugins', label: 'Plugins & MCP', icon: Puzzle },
  { id: 'blueprint', label: 'Blueprint', icon: Zap },
  { id: 'categories', label: 'Categories', icon: FolderTree },
  { id: 'files', label: 'Files', icon: FileText },
  { id: 'topics', label: 'Proxy Topics', icon: BookOpen },
]

// ==================== ANIMATED ARCHITECTURE INFOGRAPHIC ====================

function LayerCard({ layer, index }: { layer: ArchLayer; index: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -60 : 60, scale: 0.95 }}
      animate={isInView ? { opacity: 1, x: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative"
    >
      {/* Pulsing glow effect */}
      <motion.div
        className="absolute -inset-1 rounded-2xl opacity-0"
        animate={isInView ? { opacity: [0, 0.3, 0] } : {}}
        transition={{ duration: 2, delay: index * 0.1 + 0.5, repeat: Infinity, repeatDelay: 3 }}
        style={{ background: `linear-gradient(135deg, ${layer.color}20, transparent, ${layer.color}10)`, borderRadius: '1rem' }}
      />

      <Card className="relative overflow-hidden cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setIsExpanded(!isExpanded)}>
        {/* Left color accent */}
        <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{ backgroundColor: layer.color }} />

        <CardHeader className="pb-2 pl-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.span
                className="text-2xl"
                animate={isInView ? { scale: [0, 1.2, 1], rotate: [0, 10, 0] } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
              >
                {layer.icon}
              </motion.span>
              <div>
                <CardTitle className="text-base" style={{ color: layer.color }}>{layer.label}</CardTitle>
                <CardDescription className="text-xs mt-0.5">{layer.description}</CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs" style={{ borderColor: layer.color, color: layer.color }}>
                {layer.components.length} components
              </Badge>
              <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </motion.div>
            </div>
          </div>
        </CardHeader>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <CardContent className="pt-0 pl-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {layer.components.map((comp, cIdx) => (
                    <motion.div
                      key={comp.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: cIdx * 0.05 }}
                      className="p-2.5 rounded-lg border hover:shadow-sm transition-shadow"
                      style={{ borderColor: `${layer.color}30`, backgroundColor: `${layer.color}05` }}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">{comp.icon}</span>
                        <span className="font-medium text-sm text-gray-900 dark:text-white">{comp.label}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{comp.description}</p>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {comp.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0">{tag}</Badge>
                        ))}
                      </div>
                      {(comp.stars || comp.downloads) && (
                        <div className="flex items-center gap-3 mt-1.5 text-[10px] text-muted-foreground">
                          {comp.stars && <span className="flex items-center gap-0.5"><Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />{comp.stars}</span>}
                          {comp.downloads && <span className="flex items-center gap-0.5"><TrendingUp className="w-2.5 h-2.5" />{comp.downloads}</span>}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* Animated connector line to next layer */}
      {index < ARCHITECTURE_LAYERS.length - 1 && (
        <div className="flex justify-center py-2">
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={isInView ? { height: 24, opacity: 1 } : {}}
            transition={{ duration: 0.4, delay: index * 0.1 + 0.2 }}
            className="w-0.5 rounded-full"
            style={{ backgroundColor: layer.color }}
          />
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ duration: 0.3, delay: index * 0.1 + 0.5, repeat: Infinity, repeatDelay: 2 }}
            className="absolute -bottom-1"
          >
            <ArrowRight className="w-3 h-3 rotate-90 text-muted-foreground" />
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}

function DataFlowSVG() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
      <defs>
        <linearGradient id="flowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.6} />
          <stop offset="50%" stopColor="#8b5cf6" stopOpacity={0.4} />
          <stop offset="100%" stopColor="#10b981" stopOpacity={0.6} />
        </linearGradient>
      </defs>
    </svg>
  )
}

function ArchitectureInfographicSection() {
  const [viewMode, setViewMode] = useState<'stack' | 'flow' | 'routing'>('stack')
  const heroRef = useRef(null)
  const heroInView = useInView(heroRef, { once: true })

  return (
    <div className="space-y-6">
      <div ref={heroRef}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={heroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Network className="w-6 h-6 text-amber-500" />
            AI Agentic Architecture — Interactive Infographic
          </h2>
          <p className="text-muted-foreground mt-1">
            Deep-dive brainstorm translation of the agentic stack — 7 layers with OWL-ORCA proxy integration. Click any layer to expand.
          </p>
        </motion.div>
      </div>

      {/* View mode toggle */}
      <div className="flex items-center gap-2 flex-wrap">
        <Button variant={viewMode === 'stack' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('stack')}>
          <Layers className="w-4 h-4 mr-1" /> Stack View
        </Button>
        <Button variant={viewMode === 'flow' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('flow')}>
          <Activity className="w-4 h-4 mr-1" /> Flow View
        </Button>
        <Button variant={viewMode === 'routing' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('routing')}>
          <Globe className="w-4 h-4 mr-1" /> Routing Map
        </Button>
      </div>

      {viewMode === 'routing' ? (
        <ProxyRoutingMap />
      ) : viewMode === 'stack' ? (
        <div className="relative">
          <DataFlowSVG />
          <div className="space-y-2">
            {ARCHITECTURE_LAYERS.map((layer, index) => (
              <LayerCard key={layer.id} layer={layer} index={index} />
            ))}
          </div>
        </div>
      ) : (
        <FlowDiagramView />
      )}

      {/* Architecture Legend */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" /> Layer Legend & Data Flow
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {ARCHITECTURE_LAYERS.map(layer => (
              <div key={layer.id} className="flex items-center gap-2 px-3 py-1.5 rounded-lg border" style={{ borderColor: `${layer.color}40` }}>
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: layer.color }} />
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{layer.label.split('—')[0].trim()}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/10 text-xs text-amber-800 dark:text-amber-300">
            <strong>Data Flow:</strong> User Input → Silent Protocol (diagnose) → Route (speed/depth) → Orca Router (:60001) / Kiro Gateway (:8333) → Agent Orchestration (5 parallel) → Local Models (Ollama fallback) → Ubuntu Host (infra)
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function FlowDiagramView() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col items-center gap-4">
          {ARCHITECTURE_LAYERS.map((layer, idx) => (
            <motion.div
              key={layer.id}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="w-full max-w-lg"
            >
              <motion.div
                whileHover={{ scale: 1.03, y: -2 }}
                className="p-4 rounded-xl border-2 text-center"
                style={{ borderColor: layer.color, backgroundColor: `${layer.color}08` }}
              >
                <span className="text-3xl">{layer.icon}</span>
                <h3 className="font-bold mt-1" style={{ color: layer.color }}>{layer.label}</h3>
                <p className="text-xs text-muted-foreground mt-1">{layer.description}</p>
                <div className="flex justify-center gap-1.5 mt-2 flex-wrap">
                  {layer.components.slice(0, 3).map(c => (
                    <Badge key={c.id} variant="outline" className="text-[10px]">{c.icon} {c.label}</Badge>
                  ))}
                  {layer.components.length > 3 && (
                    <Badge variant="secondary" className="text-[10px]">+{layer.components.length - 3}</Badge>
                  )}
                </div>
              </motion.div>
              {idx < ARCHITECTURE_LAYERS.length - 1 && (
                <div className="flex justify-center py-1">
                  <motion.div
                    initial={{ height: 0 }}
                    whileInView={{ height: 20 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 + 0.2 }}
                    className="w-0.5 rounded-full"
                    style={{ backgroundColor: layer.color }}
                  />
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 + 0.4 }}
                    className="ml-0.5"
                  >
                    <svg width="8" height="8" viewBox="0 0 8 8" className="mt-1">
                      <circle cx="4" cy="4" r="3" fill={layer.color}>
                        <animate attributeName="r" values="3;4;3" dur="2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
                      </circle>
                    </svg>
                  </motion.div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ==================== PROXY ROUTING MAP ====================

function ProxyRoutingMap() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="space-y-8">
          {/* ADEs Layer */}
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5" /> Developer Interfaces (ADEs)
            </h4>
            <div className="flex flex-wrap justify-center gap-2">
              {['OpenCode/Kilo', 'Orca', 'Goose', 'Zed', 'Warp', 'Cursor', 'Cline', 'Aider'].map((ade, i) => (
                <motion.div
                  key={ade}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="px-3 py-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/20 border border-amber-300 dark:border-amber-700 text-xs font-medium text-amber-800 dark:text-amber-300"
                >
                  {ade}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Animated Connection Lines Down */}
          <div className="flex justify-center">
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              whileInView={{ height: 40, opacity: 1 }}
              viewport={{ once: true }}
              className="w-0.5 bg-gradient-to-b from-amber-400 to-emerald-400 rounded-full"
            />
          </div>

          {/* Proxy Endpoints Layer */}
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
              <Globe className="w-3.5 h-3.5" /> OWL-ORCA Proxy Stack (Local Endpoints)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { name: 'Orca Router', port: '60001', role: 'Brain — Stream Racer', color: '#10b981', url: 'http://127.0.0.1:60001/v1', key: 'orca-racer' },
                { name: 'Kiro Gateway', port: '8333', role: 'Heavy Lifter — Premium', color: '#8b5cf6', url: 'http://127.0.0.1:8333/v1', key: 'kiro-gateway-8333' },
                { name: 'Forward Proxy', port: '60000', role: 'Tunnel — HTTPS CONNECT', color: '#f59e0b', url: 'http://127.0.0.1:60000', key: '(internal)' },
              ].map((ep, i) => (
                <motion.div
                  key={ep.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.03, y: -2 }}
                  className="p-4 rounded-xl border-2 text-center"
                  style={{ borderColor: ep.color, backgroundColor: `${ep.color}08` }}
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <motion.div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: ep.color }}
                      animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                    />
                    <span className="font-bold text-sm" style={{ color: ep.color }}>{ep.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{ep.role}</p>
                  <div className="text-[10px] font-mono space-y-1">
                    <div className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800">
                      <span className="text-muted-foreground">Port:</span> <span className="text-gray-700 dark:text-gray-300">:{ep.port}</span>
                    </div>
                    <div className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800">
                      <span className="text-muted-foreground">Key:</span> <span className="text-gray-700 dark:text-gray-300">{ep.key}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Animated Connection Lines Down */}
          <div className="flex justify-center gap-4">
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              whileInView={{ height: 40, opacity: 1 }}
              viewport={{ once: true }}
              className="w-0.5 bg-gradient-to-b from-emerald-400 to-blue-400 rounded-full"
            />
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              whileInView={{ height: 40, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="w-0.5 bg-gradient-to-b from-purple-400 to-violet-500 rounded-full"
            />
          </div>

          {/* Cloud Providers Layer */}
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
              <Server className="w-3.5 h-3.5" /> Cloud Free-Tier Providers
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { name: 'GitHub Copilot Free', models: 'GPT-4o, Claude 3.5 Sonnet', auth: 'owl-token auth -p copilot', color: '#10b981' },
                { name: 'Antigravity Free', models: 'GPT-4o-mini, Gemini Flash', auth: 'owl-token auth -p antigravity', color: '#06b6d4' },
                { name: 'AWS Builder ID (Kiro)', models: 'Claude Sonnet 4.5, DeepSeek 3.2', auth: 'kiro-cli login', color: '#8b5cf6' },
              ].map((provider, i) => (
                <motion.div
                  key={provider.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-3 rounded-lg border text-center"
                  style={{ borderColor: `${provider.color}40`, backgroundColor: `${provider.color}05` }}
                >
                  <p className="font-semibold text-sm text-gray-900 dark:text-white">{provider.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{provider.models}</p>
                  <code className="text-[10px] mt-2 inline-block bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded font-mono">{provider.auth}</code>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Routing Summary */}
          <div className="p-4 rounded-lg bg-gradient-to-r from-emerald-50 via-purple-50 to-amber-50 dark:from-emerald-900/10 dark:via-purple-900/10 dark:to-amber-900/10 border">
            <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Routing Paths
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-gray-600 dark:text-gray-400">ADE → Orca Router → Copilot Free / Antigravity</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500" />
                <span className="text-gray-600 dark:text-gray-400">ADE → Kiro Gateway → AWS Builder ID (Premium)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-gray-600 dark:text-gray-400">Forward Proxy → HTTPS CONNECT Tunnel (Domain Bypass)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-pink-500" />
                <span className="text-gray-600 dark:text-gray-400">OpenCode/Kilo → Zero-Config (Auto-injected by install.sh)</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ==================== A/B COMPARISON SECTION ====================

function ABCompareSection() {
  const [highlightWinner, setHighlightWinner] = useState<'all' | 'full' | 'slim'>('all')

  const fullWins = COMPARISON_DATA.filter(d => d.winner === 'full').length
  const slimWins = COMPARISON_DATA.filter(d => d.winner === 'slim').length
  const ties = COMPARISON_DATA.filter(d => d.winner === 'tie').length

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <GitCompare className="w-6 h-6 text-amber-500" />
          A/B Comparison: oh-my-opencode vs oh-my-opencode-slim
        </h2>
        <p className="text-muted-foreground mt-1">
          Side-by-side analysis of the two leading OpenCode multi-agent orchestration plugins — features, metrics, and trade-offs.
        </p>
      </div>

      {/* Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
          <Card className="border-2 border-amber-400 dark:border-amber-600 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-amber-800 dark:text-amber-300 flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  oh-my-opencode
                </CardTitle>
                <Badge className="bg-amber-500 text-white border-0">{fullWins} wins</Badge>
              </div>
              <CardDescription className="text-amber-700 dark:text-amber-400">
                Now renaming to oh-my-openagent — The full-featured powerhouse
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">GitHub Stars</span>
                  <span className="font-bold text-amber-700 dark:text-amber-300">~38,000</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Weekly Downloads</span>
                  <span className="font-bold text-amber-700 dark:text-amber-300">~60K</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Agents</span>
                  <span className="font-bold text-amber-700 dark:text-amber-300">11 built-in</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">License</span>
                  <span className="text-sm text-amber-600 dark:text-amber-400">SUL-1.0</span>
                </div>
                <Separator className="bg-amber-200 dark:bg-amber-800" />
                <div className="text-xs text-amber-700 dark:text-amber-400 space-y-1">
                  <p><strong>Best for:</strong> Maximum features, Claude Code compat, autonomous mode</p>
                  <p><strong>Watch out:</strong> High token overhead (15-25K startup), 3x more API requests</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
          <Card className="border-2 border-emerald-400 dark:border-emerald-600 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  oh-my-opencode-slim
                </CardTitle>
                <Badge className="bg-emerald-500 text-white border-0">{slimWins} wins</Badge>
              </div>
              <CardDescription className="text-emerald-700 dark:text-emerald-400">
                Lightweight fork — Token efficiency champion
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">GitHub Stars</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-300">~5,100</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Weekly Downloads</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-300">~7.2K</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Agents</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-300">7+2+custom</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">License</span>
                  <span className="text-sm text-emerald-600 dark:text-emerald-400">MIT</span>
                </div>
                <Separator className="bg-emerald-200 dark:bg-emerald-800" />
                <div className="text-xs text-emerald-700 dark:text-emerald-400 space-y-1">
                  <p><strong>Best for:</strong> Token efficiency, simplicity, Council consensus, custom agents</p>
                  <p><strong>Watch out:</strong> Fewer features, limited Claude Code compat, smaller community</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Winner Toggle */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm text-muted-foreground">Highlight:</span>
        {[
          { key: 'all', label: 'All', color: 'bg-gray-500' },
          { key: 'full', label: `Full (${fullWins})`, color: 'bg-amber-500' },
          { key: 'slim', label: `Slim (${slimWins})`, color: 'bg-emerald-500' },
        ].map(({ key, label, color }) => (
          <button
            key={key}
            onClick={() => setHighlightWinner(key as any)}
            className={`px-3 py-1.5 text-xs rounded-full transition-colors flex items-center gap-1.5 ${
              highlightWinner === key ? `${color} text-white` : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${highlightWinner === key ? 'bg-white' : color}`} />
            {label}
          </button>
        ))}
      </div>

      {/* Detailed Comparison Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 font-medium w-40">Dimension</th>
                  <th className="text-left p-3 font-medium">
                    <span className="flex items-center gap-1"><Trophy className="w-3.5 h-3.5 text-amber-500" /> Full</span>
                  </th>
                  <th className="text-left p-3 font-medium">
                    <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5 text-emerald-500" /> Slim</span>
                  </th>
                  <th className="text-center p-3 font-medium w-16">Edge</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_DATA.map((row, idx) => {
                  const dimmed = highlightWinner !== 'all' && row.winner !== highlightWinner && row.winner !== 'tie'
                  return (
                    <motion.tr
                      key={row.id}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.02 }}
                      className={`border-b last:border-b-0 hover:bg-muted/30 transition-colors ${dimmed ? 'opacity-40' : ''}`}
                    >
                      <td className="p-3 font-medium text-gray-900 dark:text-white text-xs">{row.dimension}</td>
                      <td className={`p-3 text-xs ${row.winner === 'full' ? 'font-semibold text-amber-700 dark:text-amber-300' : 'text-muted-foreground'}`}>
                        {row.ohMyOpencode}
                      </td>
                      <td className={`p-3 text-xs ${row.winner === 'slim' ? 'font-semibold text-emerald-700 dark:text-emerald-300' : 'text-muted-foreground'}`}>
                        {row.ohMyOpencodeSlim}
                      </td>
                      <td className="p-3 text-center">
                        {row.winner === 'full' && <Trophy className="w-4 h-4 text-amber-500 mx-auto" />}
                        {row.winner === 'slim' && <Zap className="w-4 h-4 text-emerald-500 mx-auto" />}
                        {row.winner === 'tie' && <span className="text-muted-foreground text-xs">Tie</span>}
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Verdict */}
      <Card className="bg-gradient-to-r from-amber-50 to-emerald-50 dark:from-amber-900/10 dark:to-emerald-900/10">
        <CardContent className="p-5">
          <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-amber-500" /> The Verdict
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 rounded-lg bg-amber-100/50 dark:bg-amber-900/20">
              <p className="font-semibold text-amber-800 dark:text-amber-300 text-sm">Choose Full When:</p>
              <ul className="text-xs text-amber-700 dark:text-amber-400 mt-2 space-y-1">
                <li>- You need Claude Code ecosystem compatibility</li>
                <li>- Feature completeness matters more than token cost</li>
                <li>- You want autonomous Ultrawork mode</li>
                <li>- You need advanced per-agent model routing</li>
                <li>- Large community and documentation are priorities</li>
              </ul>
            </div>
            <div className="p-3 rounded-lg bg-emerald-100/50 dark:bg-emerald-900/20">
              <p className="font-semibold text-emerald-800 dark:text-emerald-300 text-sm">Choose Slim When:</p>
              <ul className="text-xs text-emerald-700 dark:text-emerald-400 mt-2 space-y-1">
                <li>- Token efficiency and lower API costs are critical</li>
                <li>- You prefer MIT-licensed open source</li>
                <li>- Council consensus (multi-model) is valuable</li>
                <li>- You want custom dynamic agents</li>
                <li>- Simplicity and fewer moving parts are preferred</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ==================== ADE COMPATIBILITY SECTION ====================

function ADECompatibilitySection() {
  const [tierFilter, setTierFilter] = useState<number>(0)
  const [search, setSearch] = useState('')

  const filtered = ADE_COMPATIBILITY.filter(a => {
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) || a.verdict.toLowerCase().includes(search.toLowerCase())
    const matchTier = tierFilter === 0 || a.tier === tierFilter
    return matchSearch && matchTier
  })

  const tierConfig: Record<number, { label: string; color: string; bg: string; border: string; icon: React.ReactNode }> = {
    1: { label: 'Tier 1 — Perfect Match', color: '#10b981', bg: 'bg-emerald-50 dark:bg-emerald-900/10', border: 'border-emerald-400 dark:border-emerald-600', icon: <Trophy className="w-4 h-4 text-emerald-500" /> },
    2: { label: 'Tier 2 — Plug & Play', color: '#3b82f6', bg: 'bg-blue-50 dark:bg-blue-900/10', border: 'border-blue-400 dark:border-blue-600', icon: <Zap className="w-4 h-4 text-blue-500" /> },
    3: { label: 'Tier 3 — Sandbox Host', color: '#f59e0b', bg: 'bg-amber-50 dark:bg-amber-900/10', border: 'border-amber-400 dark:border-amber-600', icon: <Shield className="w-4 h-4 text-amber-500" /> },
    4: { label: 'Tier 4 — Redundant / N/A', color: '#ef4444', bg: 'bg-red-50 dark:bg-red-900/10', border: 'border-red-400 dark:border-red-600', icon: <X className="w-4 h-4 text-red-500" /> },
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Shield className="w-6 h-6 text-amber-500" />
          ADE Compatibility — OWL-ORCA v7.1.0
        </h2>
        <p className="text-muted-foreground mt-1">
          Deep-dive compatibility analysis: which ADEs work with the OWL-ORCA Master Installer proxy stack. The Golden Rule: any ADE with custom OpenAI-compatible base URL support passes.
        </p>
      </div>

      {/* Proxy Endpoints Summary */}
      <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/10 dark:to-teal-900/10 border-emerald-200 dark:border-emerald-800">
        <CardHeader>
          <CardTitle className="text-emerald-800 dark:text-emerald-300 flex items-center gap-2 text-base">
            <Globe className="w-5 h-5" /> 3 Local Proxy Endpoints (install.sh creates these)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {PROXY_ENDPOINTS.map(ep => (
              <motion.div
                key={ep.name}
                whileHover={{ y: -2 }}
                className="p-3 rounded-lg border-2 bg-white dark:bg-gray-900"
                style={{ borderColor: ep.color }}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ep.color }} />
                  <span className="font-semibold text-sm text-gray-900 dark:text-white">{ep.name}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{ep.role}</p>
                <div className="space-y-1 text-xs font-mono">
                  <div className="p-1.5 rounded bg-gray-100 dark:bg-gray-800">
                    <span className="text-muted-foreground">URL:</span> <span className="text-gray-700 dark:text-gray-300">{ep.url}</span>
                  </div>
                  <div className="p-1.5 rounded bg-gray-100 dark:bg-gray-800">
                    <span className="text-muted-foreground">Key:</span> <span className="text-gray-700 dark:text-gray-300">{ep.apiKey}</span>
                  </div>
                </div>
                <div className="mt-2">
                  <CopyButton text={`export OPENAI_BASE_URL="${ep.url}" && export OPENAI_API_KEY="${ep.apiKey}"`} />
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tier Legend & Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm text-muted-foreground">Filter:</span>
        <div className="flex gap-1.5">
          {[
            { tier: 0, label: 'All' },
            { tier: 1, label: 'Tier 1' },
            { tier: 2, label: 'Tier 2' },
            { tier: 3, label: 'Tier 3' },
            { tier: 4, label: 'Tier 4' },
          ].map(t => (
            <button
              key={t.tier}
              onClick={() => setTierFilter(t.tier)}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                tierFilter === t.tier
                  ? t.tier === 0 ? 'bg-gray-800 text-white dark:bg-gray-200 dark:text-gray-800'
                    : t.tier === 1 ? 'bg-emerald-500 text-white'
                    : t.tier === 2 ? 'bg-blue-500 text-white'
                    : t.tier === 3 ? 'bg-amber-500 text-white'
                    : 'bg-red-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex-1 min-w-0 max-w-xs">
          <Input placeholder="Search ADEs..." value={search} onChange={e => setSearch(e.target.value)} className="h-7 text-xs" />
        </div>
      </div>

      <p className="text-sm text-muted-foreground">{filtered.length} ADEs found</p>

      {/* ADE Cards */}
      <div className="space-y-3">
        {filtered.map((ade, idx) => {
          const cfg = tierConfig[ade.tier]
          return (
            <motion.div
              key={ade.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.03 }}
            >
              <Card className={`border-l-4 ${cfg.border} ${cfg.bg} hover:shadow-md transition-shadow`}>
                <CardContent className="p-4">
                  <div className="flex flex-col gap-3">
                    {/* Header */}
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        {cfg.icon}
                        <h4 className="font-semibold text-gray-900 dark:text-white">{ade.name}</h4>
                        <Badge
                          className="text-[10px] border-0 text-white"
                          style={{ backgroundColor: cfg.color }}
                        >
                          {ade.tierLabel}
                        </Badge>
                      </div>
                      <Badge
                        variant="outline"
                        className="text-[10px] font-bold"
                        style={{ borderColor: cfg.color, color: cfg.color }}
                      >
                        {ade.verdict}
                      </Badge>
                    </div>

                    {/* How to connect */}
                    <p className="text-sm text-muted-foreground">{ade.howToConnect}</p>

                    {/* Endpoint info */}
                    {ade.endpoint !== '—' && (
                      <div className="flex flex-wrap gap-3 text-xs font-mono">
                        <div className="px-2 py-1 rounded bg-white/60 dark:bg-black/20">
                          <span className="text-muted-foreground">Endpoint:</span>{' '}
                          <span className="text-gray-700 dark:text-gray-300">{ade.endpoint}</span>
                        </div>
                        <div className="px-2 py-1 rounded bg-white/60 dark:bg-black/20">
                          <span className="text-muted-foreground">Key:</span>{' '}
                          <span className="text-gray-700 dark:text-gray-300">{ade.apiKey}</span>
                        </div>
                        {ade.models && (
                          <div className="px-2 py-1 rounded bg-white/60 dark:bg-black/20">
                            <span className="text-muted-foreground">Models:</span>{' '}
                            <span className="text-gray-700 dark:text-gray-300">{ade.models}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Copy env vars */}
                    {ade.endpoint !== '—' && (
                      <CopyButton text={`export OPENAI_BASE_URL="${ade.endpoint}"\nexport OPENAI_API_KEY="${ade.apiKey}"`} />
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Golden Rule */}
      <Card className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10">
        <CardContent className="p-5">
          <h3 className="font-bold text-amber-800 dark:text-amber-300 flex items-center gap-2 text-sm mb-2">
            <Sparkles className="w-4 h-4" /> The Golden Rule of Compatibility
          </h3>
          <p className="text-xs text-amber-700 dark:text-amber-400">
            Because the Orca Router and Kiro Gateway expose <strong>standard OpenAI-compatible API endpoints</strong>,
            <strong> ANY ADE that allows you to set a Custom Base URL and a Custom API Key will pass the objective.</strong>
            This means the OWL-ORCA proxy stack works with virtually every modern AI coding tool — not just the ones listed above.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

// ==================== ULTIMATE FREE UNLIMITED BLUEPRINT ====================

function UltimateBlueprintSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Zap className="w-6 h-6 text-amber-500" />
          Ultimate &quot;Free Unlimited&quot; Orchestration Blueprint
        </h2>
        <p className="text-muted-foreground mt-1">
          The exact 5-step setup to achieve a 5-agent parallel coding fleet with zero rate-limiting, zero cost, and kernel-level isolation — using the OWL-ORCA Master Installer v7.1.0.
        </p>
      </div>

      {/* Steps */}
      <div className="space-y-4">
        {ULTIMATE_BLUEPRINT_STEPS.map((step, idx) => (
          <motion.div
            key={step.step}
            initial={{ opacity: 0, x: idx % 2 === 0 ? -40 : 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="overflow-hidden border-l-4 border-l-amber-500 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4 p-5">
                {/* Step Number */}
                <motion.div
                  className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-lg shadow-md"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  {step.step}
                </motion.div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 dark:text-white text-base">{step.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{step.description}</p>

                  {/* Command */}
                  {step.command && (
                    <div className="mt-3 p-3 rounded-lg bg-gray-900 dark:bg-gray-800 text-xs font-mono text-emerald-400 overflow-x-auto">
                      {step.command.split('\n').map((line, lIdx) => (
                        <div key={lIdx} className="flex">
                          {line.startsWith('#') ? (
                            <span className="text-gray-500">{line}</span>
                          ) : line.startsWith('export') ? (
                            <span><span className="text-amber-400">export</span> {line.slice(7)}</span>
                          ) : line.startsWith('curl') ? (
                            <span><span className="text-amber-400">curl</span> {line.slice(4)}</span>
                          ) : (
                            <span>{line}</span>
                          )}
                        </div>
                      ))}
                      <div className="mt-2">
                        <CopyButton text={step.command} />
                      </div>
                    </div>
                  )}

                  {/* Details */}
                  <p className="text-xs text-muted-foreground mt-2 italic">{step.details}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Result Card */}
      <Card className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-900/10 dark:via-teal-900/10 dark:to-cyan-900/10 border-2 border-emerald-300 dark:border-emerald-700">
        <CardContent className="p-6">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500 text-white mb-4"
            >
              <Sparkles className="w-8 h-8" />
            </motion.div>
            <h3 className="text-xl font-bold text-emerald-800 dark:text-emerald-300 mb-2">The Result</h3>
            <p className="text-sm text-emerald-700 dark:text-emerald-400 max-w-lg mx-auto">
              A <strong>5-agent parallel coding fleet</strong>, drawing from <strong>GitHub Copilot Free</strong>,{' '}
              <strong>Antigravity Free</strong>, and <strong>AWS Builder ID Free</strong> (Claude Sonnet 4.5, DeepSeek 3.2),
              with <strong>zero rate-limiting</strong>, <strong>zero cost</strong>, and <strong>kernel-level isolation</strong>.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: 'Cost', value: '$0', sub: 'Free tiers pooled' },
              { label: 'Agents', value: '5', sub: 'Parallel in worktrees' },
              { label: 'Rate Limits', value: 'None', sub: 'Circuit-breaking proxy' },
            ].map(stat => (
              <div key={stat.label} className="p-3 rounded-lg bg-white/60 dark:bg-black/20 text-center">
                <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{stat.value}</p>
                <p className="text-xs font-medium text-gray-900 dark:text-white">{stat.label}</p>
                <p className="text-[10px] text-muted-foreground">{stat.sub}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pooled Free Tiers */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Gift className="w-4 h-4 text-amber-500" /> Pooled Free-Tier Sources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { name: 'GitHub Copilot Free', models: 'GPT-4o, Claude 3.5 Sonnet', auth: 'owl-token auth -p copilot' },
              { name: 'Antigravity Free', models: 'GPT-4o-mini, Gemini Flash', auth: 'owl-token auth -p antigravity' },
              { name: 'AWS Builder ID (Kiro)', models: 'Claude Sonnet 4.5, DeepSeek 3.2', auth: 'kiro-cli login' },
            ].map(src => (
              <div key={src.name} className="p-3 rounded-lg border bg-muted/30">
                <p className="font-semibold text-sm text-gray-900 dark:text-white">{src.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{src.models}</p>
                <div className="mt-2">
                  <code className="text-[10px] bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded font-mono">{src.auth}</code>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ==================== PLUGINS & MCP SECTION ====================

function PluginsSection() {
  const [search, setSearch] = useState('')
  const [tierFilter, setTierFilter] = useState<number>(0)
  const [catFilter, setCatFilter] = useState<string>('all')

  const filtered = TOP_PLUGINS.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase())
    const matchTier = tierFilter === 0 || p.tier === tierFilter
    const matchCat = catFilter === 'all' || p.category === catFilter
    return matchSearch && matchTier && matchCat
  })

  const tierColors: Record<number, string> = {
    1: 'border-amber-400 bg-amber-50 dark:bg-amber-900/10',
    2: 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/10',
    3: 'border-gray-300 bg-gray-50 dark:bg-gray-900/10',
  }

  const tierLabels: Record<number, string> = {
    1: 'Essential',
    2: 'High Impact',
    3: 'Quality of Life',
  }

  const catIcons: Record<string, React.ReactNode> = {
    plugin: <Puzzle className="w-3.5 h-3.5" />,
    skill: <Code className="w-3.5 h-3.5" />,
    mcp: <Network className="w-3.5 h-3.5" />,
    proxy: <Globe className="w-3.5 h-3.5" />,
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Puzzle className="w-6 h-6 text-amber-500" />
          Plugins, Skills & MCP Servers — Above Mediocrity Stack
        </h2>
        <p className="text-muted-foreground mt-1">
          Curated enhancement tools to make OpenCode deliver above mediocrity. Tiered by impact.
        </p>
      </div>

      {/* Tier Legend */}
      <div className="flex flex-wrap gap-3">
        {[
          { tier: 1, label: 'Tier 1 — Essential', color: 'bg-amber-500' },
          { tier: 2, label: 'Tier 2 — High Impact', color: 'bg-emerald-500' },
          { tier: 3, label: 'Tier 3 — Quality of Life', color: 'bg-gray-400' },
        ].map(t => (
          <div key={t.tier} className="flex items-center gap-2 px-3 py-1.5 rounded-full border bg-white dark:bg-gray-900">
            <div className={`w-2.5 h-2.5 rounded-full ${t.color}`} />
            <span className="text-xs font-medium">{t.label}</span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search plugins, skills, MCP servers..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <div className="flex gap-2">
          <select value={tierFilter} onChange={e => setTierFilter(Number(e.target.value))} className="px-3 py-2 text-sm rounded-md border bg-white dark:bg-gray-900 dark:border-gray-700">
            <option value={0}>All Tiers</option>
            <option value={1}>Tier 1 Essential</option>
            <option value={2}>Tier 2 High Impact</option>
            <option value={3}>Tier 3 QoL</option>
          </select>
          <select value={catFilter} onChange={e => setCatFilter(e.target.value)} className="px-3 py-2 text-sm rounded-md border bg-white dark:bg-gray-900 dark:border-gray-700">
            <option value="all">All Types</option>
            <option value="plugin">Plugins</option>
            <option value="skill">Skills</option>
            <option value="mcp">MCP Servers</option>
            <option value="proxy">Proxies</option>
          </select>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">{filtered.length} items found</p>

      {/* Plugin Cards */}
      <div className="space-y-3">
        {filtered.map((plugin, idx) => (
          <motion.div
            key={plugin.id}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.03 }}
          >
            <Card className={`border-l-4 ${tierColors[plugin.tier]} hover:shadow-md transition-shadow`}>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-semibold text-gray-900 dark:text-white">{plugin.name}</h4>
                      <Badge variant="outline" className="text-xs flex items-center gap-1">
                        {catIcons[plugin.category]} {plugin.category.toUpperCase()}
                      </Badge>
                      <Badge className={`text-[10px] border-0 ${plugin.tier === 1 ? 'bg-amber-500' : plugin.tier === 2 ? 'bg-emerald-500' : 'bg-gray-400'} text-white`}>
                        {tierLabels[plugin.tier]}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{plugin.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {plugin.stars}</span>
                      <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3" /> {plugin.downloads}</span>
                    </div>
                  </div>
                  {plugin.url && (
                    <a href={plugin.url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-amber-600 transition-colors shrink-0">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recommended Config */}
      <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 border-amber-200 dark:border-amber-800">
        <CardHeader>
          <CardTitle className="text-amber-800 dark:text-amber-300 flex items-center gap-2">
            <Code className="w-5 h-5" /> opencode.json — Above Mediocrity Config
          </CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-xs bg-black/5 dark:bg-white/5 p-4 rounded-lg overflow-x-auto font-mono">
{`{
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
      "env": { "GITHUB_TOKEN": "\${GITHUB_TOKEN}" }
    },
    "firecrawl": {
      "command": "npx",
      "args": ["-y", "firecrawl-mcp"],
      "env": { "FIRECRAWL_API_KEY": "\${FIRECRAWL_API_KEY}" }
    },
    "supabase": {
      "command": "npx",
      "args": ["-y", "@supabase/mcp-server-supabase"],
      "env": { "SUPABASE_ACCESS_TOKEN": "\${SUPABASE_ACCESS_TOKEN}" }
    }
  },
  "provider": {
    "openrouter": { "apiKey": "\${OPENROUTER_API_KEY}" }
  }
}`}
          </pre>
          <div className="mt-3">
            <CopyButton text={`curl -fsSL https://opencode.ai/install | bash && npx oh-my-openagent init && npx superpowers init`} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ==================== CATEGORIES / SUBREPO SECTION ====================

function CategoriesSection() {
  const [expandedCat, setExpandedCat] = useState<string | null>(null)

  const catIcons: Record<string, React.ReactNode> = {
    documents: <FileText className="w-5 h-5" />,
    scripts: <FileCode className="w-5 h-5" />,
    configs: <Settings className="w-5 h-5" />,
    knowledge: <BookOpen className="w-5 h-5" />,
    data: <Database className="w-5 h-5" />,
    infrastructure: <Server className="w-5 h-5" />,
  }

  const catColors: Record<string, string> = {
    documents: 'border-amber-400 bg-amber-50 dark:bg-amber-900/10',
    scripts: 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/10',
    configs: 'border-cyan-400 bg-cyan-50 dark:bg-cyan-900/10',
    knowledge: 'border-violet-400 bg-violet-50 dark:bg-violet-900/10',
    data: 'border-rose-400 bg-rose-50 dark:bg-rose-900/10',
    infrastructure: 'border-orange-400 bg-orange-50 dark:bg-orange-900/10',
  }

  const subrepoExamples: Record<string, string[]> = {
    documents: ['AI_Agentic_Stack_Blueprint.pdf', 'provider_comparison_matrix.png', 'setup-guide.docx'],
    scripts: ['install-stack.sh', 'configure-proxies.py', 'health-check.ts'],
    configs: ['opencode.json', 'litellm-config.yaml', '.env.template', '9router.toml'],
    knowledge: ['SKILL.md', 'AGENTS.md', 'troubleshooting.md', 'architecture-decisions.mdx'],
    data: ['providers.csv', 'schema.prisma', 'embeddings.db'],
    infrastructure: ['Dockerfile.proxy', 'docker-compose.yml', 'Caddyfile', 'opencode.service'],
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <FolderTree className="w-6 h-6 text-amber-500" />
          Independent Category Subrepos
        </h2>
        <p className="text-muted-foreground mt-1">
          Every PDF, script, JSON, markdown gets its own independent category with a dedicated subrepo structure. Each group is self-contained.
        </p>
      </div>

      {/* Architecture Overview */}
      <Card className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/10 dark:to-purple-900/10 border-violet-200 dark:border-violet-800">
        <CardContent className="p-5">
          <h3 className="font-bold text-violet-800 dark:text-violet-300 flex items-center gap-2 mb-3">
            <Layers className="w-5 h-5" /> Subrepo Architecture Pattern
          </h3>
          <pre className="text-xs bg-black/5 dark:bg-white/5 p-4 rounded-lg font-mono overflow-x-auto">
{`ai-agentic-stack/
├── documents/          # Independent subrepo
│   ├── .git/
│   ├── blueprints/
│   ├── guides/
│   └── diagrams/
├── scripts/            # Independent subrepo
│   ├── .git/
│   ├── installers/
│   ├── automation/
│   └── health-checks/
├── configs/            # Independent subrepo
│   ├── .git/
│   ├── opencode/
│   ├── proxies/
│   └── mcp-servers/
├── knowledge/          # Independent subrepo
│   ├── .git/
│   ├── skills/
│   ├── agents/
│   └── wiki/
├── data/               # Independent subrepo
│   ├── .git/
│   ├── schemas/
│   └── datasets/
└── infrastructure/     # Independent subrepo
    ├── .git/
    ├── docker/
    ├── systemd/
    └── networking/`}
          </pre>
        </CardContent>
      </Card>

      {/* Category Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CATEGORY_GROUPS.map((cat, idx) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.08 }}
          >
            <Card className={`border-l-4 hover:shadow-md transition-shadow cursor-pointer ${catColors[cat.id]}`}
              onClick={() => setExpandedCat(expandedCat === cat.id ? null : cat.id)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{cat.icon}</span>
                    <div>
                      <CardTitle className="text-base">{cat.label}</CardTitle>
                      <CardDescription className="text-xs">{cat.description}</CardDescription>
                    </div>
                  </div>
                  <motion.div animate={{ rotate: expandedCat === cat.id ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </motion.div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1.5">
                  {cat.types.map(type => (
                    <Badge key={type} variant="outline" className="text-xs">{type}</Badge>
                  ))}
                </div>

                <AnimatePresence>
                  {expandedCat === cat.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <Separator className="my-3" />
                      <p className="text-xs font-semibold text-muted-foreground mb-2">Example files in this subrepo:</p>
                      <div className="space-y-1.5">
                        {(subrepoExamples[cat.id] || []).map(file => (
                          <div key={file} className="flex items-center gap-2 text-xs p-1.5 rounded bg-white/50 dark:bg-black/20">
                            <FileText className="w-3 h-3 text-muted-foreground" />
                            <span className="font-mono text-gray-700 dark:text-gray-300">{file}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ==================== DASHBOARD SECTION ====================

// ==================== FILE BROWSER SECTION ====================

function FileBrowserSection() {
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [search, setSearch] = useState('')
  const [selectedFile, setSelectedFile] = useState<FileEntry | null>(null)
  const [mdContent, setMdContent] = useState<string | null>(null)
  const [mdLoading, setMdLoading] = useState(false)

  const filtered = FILE_INVENTORY.filter(f => {
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase()) || f.description.toLowerCase().includes(search.toLowerCase())
    const matchCategory = categoryFilter === 'all' || f.category === categoryFilter
    const matchType = typeFilter === 'all' || f.type === typeFilter
    return matchSearch && matchCategory && matchType
  })

  const handleFileClick = useCallback((file: FileEntry) => {
    setSelectedFile(file)
    if (file.type === 'md') {
      setMdLoading(true)
      setMdContent(null)
      fetch(file.path)
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch')
          return res.text()
        })
        .then(text => {
          setMdContent(text)
          setMdLoading(false)
        })
        .catch(() => {
          setMdContent('Unable to load markdown content. The file may not exist in the public directory yet.')
          setMdLoading(false)
        })
    }
  }, [])

  const fileTypeIcon = (type: string) => {
    switch (type) {
      case 'pdf': return '📄'
      case 'png': return '🖼️'
      case 'md': return '📝'
      case 'json': return '📊'
      case 'py': return '🐍'
      case 'html': return '🌐'
      default: return '📎'
    }
  }

  const categoryColor: Record<string, string> = {
    document: '#f59e0b',
    image: '#8b5cf6',
    research: '#10b981',
    data: '#3b82f6',
    script: '#ef4444',
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <FileText className="w-6 h-6 text-amber-500" />
          File Browser
        </h2>
        <p className="text-muted-foreground mt-1">
          Browse and preview the complete inventory of documents, images, research reports, and data files in the AI Agentic Stack knowledge base.
        </p>
      </div>

      {/* Filters */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Category:</span>
          {['all', 'document', 'image', 'research', 'data', 'script'].map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                categoryFilter === cat
                  ? 'bg-amber-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400'
              }`}
            >
              {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Type:</span>
          {['all', 'pdf', 'png', 'md', 'json'].map(t => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                typeFilter === t
                  ? 'bg-violet-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400'
              }`}
            >
              {t === 'all' ? 'All' : t.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search files by name or description..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* File Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((file, idx) => (
          <motion.div
            key={file.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            whileHover={{ scale: 1.02, y: -2 }}
            className="cursor-pointer"
            onClick={() => handleFileClick(file)}
          >
            <Card className="h-full border-l-4 hover:shadow-lg transition-shadow" style={{ borderLeftColor: categoryColor[file.category] || '#6b7280' }}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{fileTypeIcon(file.type)}</span>
                    <CardTitle className="text-sm line-clamp-1">{file.name}</CardTitle>
                  </div>
                  <Badge variant="outline" className="text-[10px]">{file.type.toUpperCase()}</Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{file.description}</p>
                {file.preview && (
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 line-clamp-2 italic mb-2">{file.preview}</p>
                )}
                <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                  <span>{file.size}</span>
                  <span>{file.date}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No files match your filters.</p>
        </div>
      )}

      {/* File Preview Dialog */}
      <Dialog open={!!selectedFile} onOpenChange={(open) => { if (!open) setSelectedFile(null) }}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedFile && <span className="text-xl">{fileTypeIcon(selectedFile.type)}</span>}
              {selectedFile?.name}
            </DialogTitle>
            <DialogDescription>{selectedFile?.description}</DialogDescription>
          </DialogHeader>
          {selectedFile && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{selectedFile.type.toUpperCase()}</Badge>
                <Badge variant="secondary">{selectedFile.category}</Badge>
                <Badge variant="secondary">{selectedFile.size}</Badge>
                <Badge variant="secondary">{selectedFile.date}</Badge>
              </div>

              {selectedFile.type === 'png' && (
                <div className="rounded-lg border overflow-hidden bg-muted/30 flex items-center justify-center p-4">
                  <img
                    src={selectedFile.path}
                    alt={selectedFile.name}
                    className="max-w-full max-h-96 object-contain rounded"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                  />
                </div>
              )}

              {selectedFile.type === 'pdf' && (
                <div className="space-y-3">
                  <div className="p-6 rounded-lg border bg-muted/20 text-center">
                    <span className="text-4xl">📄</span>
                    <p className="text-sm text-muted-foreground mt-2">PDF preview requires the file in the public directory.</p>
                  </div>
                  <Button variant="outline" size="sm" asChild className="w-full">
                    <a href={selectedFile.path} target="_blank" rel="noopener noreferrer">
                      <Download className="w-4 h-4 mr-2" />
                      Open / Download PDF
                    </a>
                  </Button>
                </div>
              )}

              {selectedFile.type === 'md' && (
                <div className="rounded-lg border p-4 bg-muted/10 max-h-96 overflow-y-auto">
                  {mdLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                      <span className="ml-2 text-sm text-muted-foreground">Loading markdown...</span>
                    </div>
                  ) : mdContent ? (
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown>{mdContent}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">Click to load preview</p>
                  )}
                </div>
              )}

              {selectedFile.type === 'json' && (
                <pre className="p-4 rounded-lg border bg-gray-50 dark:bg-gray-900 text-xs font-mono overflow-auto max-h-96">
                  {'{ "message": "JSON preview — file not yet available in public directory" }'}
                </pre>
              )}

              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" asChild>
                  <a href={selectedFile.path} target="_blank" rel="noopener noreferrer" download>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href={selectedFile.path} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open in New Tab
                  </a>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(selectedFile.path)
                    toast.success('Path copied to clipboard!')
                  }}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Path
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ==================== PROXY COMPARISON TOPICS SECTION ====================

const PROXY_COMPARISONS = [
  {
    id: 'owl-orca',
    name: 'OWL-ORCA v7.1.0',
    approach: 'Local Install + Protocol Translation',
    tagline: 'The Kitchen Sink — install once, race forever',
    color: '#10b981',
    architecture: '3 local endpoints (Orca Router :60001, Kiro Gateway :8333, Forward Proxy :60000). Stream racing across GitHub Copilot Free + Antigravity Free. Protocol translation on-the-fly. Circuit breaking built-in.',
    freeTokens: '~2B+/mo (pooled Copilot + Antigravity + AWS Builder ID)',
    setupComplexity: 'One command (install.sh)',
    openSource: true,
    strengths: ['Zero config for OpenCode/Kilo CLI (auto-injection)', '3 distinct proxy roles in one install', 'Premium models free via AWS Builder ID', 'Circuit breaking prevents cascading failures', 'Protocol translation (Copilot/Antigravity → OpenAI format)', 'Works with ANY ADE via custom base URL'],
    weaknesses: ['Ubuntu-only (Linux dependency)', 'Newer project — less battle-tested', 'Requires GitHub Copilot Free + Antigravity accounts', 'Forward proxy can be a security concern if misconfigured'],
    economics: 'Race theory: like high-frequency trading, speed wins. OWL-ORCA races multiple free tiers simultaneously and returns the fastest response. This is "arbitrage of free tiers" — the economic value comes from the delta between what you pay ($0) and what you receive (premium model outputs).',
    psychology: 'Reduces choice overload. Instead of picking one provider, you get "auto-racer" that picks for you. Paradox of choice (Schwartz, 2004): more options = more anxiety. OWL-ORCA eliminates the decision by racing all options.',
    networkScience: 'Like BGP (Border Gateway Protocol) for AI models. Circuit breaking = failover routing. Stream racing = anycast. The Forward Proxy = a VPN tunnel. This is essentially internet routing applied to LLM API calls.',
    history: 'Reminiscent of early telephone exchanges (1880s): human operators manually connected calls. OWL-ORCA automates the "connection" between ADEs and providers, just as automatic exchanges replaced human operators.',
  },
  {
    id: 'litellm',
    name: 'LiteLLM',
    approach: 'Unified OpenAI-Compatible Proxy',
    tagline: 'The Universal Translator — 100+ providers, one API',
    color: '#3b82f6',
    architecture: 'Python proxy server. Translates OpenAI-format requests to 100+ provider APIs. Load balancing, fallbacks, budget controls, key management. Self-hosted or cloud.',
    freeTokens: 'Depends on your own provider keys (0 without BYOK)',
    setupComplexity: 'pip install litellm[proxy] + config YAML',
    openSource: true,
    strengths: ['Largest provider support (100+ LLMs)', 'Mature project with enterprise features', 'Budget controls and spend tracking', 'Load balancing and fallback chains', 'Key management and rotation', 'Both self-hosted and cloud options'],
    weaknesses: ['No free-tier aggregation — BYOK only', 'Python dependency (heavier than Go/Rust alternatives)', 'No stream racing (sequential fallback, not parallel)', 'Configuration complexity for 100+ providers', 'No protocol translation for Copilot/Antigravity'],
    economics: 'Translation theory: LiteLLM is a market maker, not a provider. Like a currency exchange, it doesn\'t create value — it facilitates access. The economic value is in reducing integration cost (one API vs 100), but you still pay per-token to providers.',
    psychology: 'Reduced cognitive load via standardization. One API format for 100 providers = one mental model. However, the paradox: 100 options creates choice overload for model selection. LiteLLM solves the "how to connect" but not "which model to use."',
    networkScience: 'Like a CDN (Content Delivery Network) for LLM APIs. LiteLLM is the edge node that caches, routes, and load-balances. Fallback chains = redundant paths. But unlike OWL-ORCA, there\'s no "racing" — it\'s sequential failover.',
    history: 'Like the Rosetta Stone (196 BC): a universal translation layer. LiteLLM does for LLM APIs what the Rosetta Stone did for languages — makes every provider understandable through one common format.',
  },
  {
    id: 'openrouter',
    name: 'OpenRouter',
    approach: 'Cloud API Aggregator',
    tagline: 'The Marketplace — 300+ models, one endpoint',
    color: '#8b5cf6',
    architecture: 'Cloud-hosted API gateway. Single endpoint routes to 300+ models. Free models available. Automatic provider failover. Streaming support. Usage tracking.',
    freeTokens: 'Free tier models available (~30+ free models)',
    setupComplexity: 'API key + base URL change',
    openSource: false,
    strengths: ['Largest model selection (300+ models)', 'Free models available at zero cost', 'Zero infrastructure — fully cloud-hosted', 'Simple setup (just change base URL)', 'Built-in OpenCode support', 'Usage statistics and cost tracking'],
    weaknesses: ['Not self-hosted — dependency on OpenRouter cloud', 'Rate limits on free models', 'No local proxy for Copilot/Antigravity', 'Privacy concerns (all traffic routes through OpenRouter)', 'No stream racing across providers'],
    economics: 'Marketplace theory: OpenRouter is like Amazon for LLMs. It aggregates supply (providers) and demand (developers), taking a small margin. Free models are the "loss leaders" that attract users to paid models. Classic two-sided market (Rochet & Tirole, 2003).',
    psychology: 'The IKEA effect in reverse: less setup effort = less perceived value. OpenRouter is "too easy" — developers may not appreciate the complexity it abstracts. However, the 300+ model count creates a "paradox of abundance" where having more choices can lead to decision paralysis.',
    networkScience: 'Like DNS (Domain Name System) for AI models. You give it a model name, it resolves to the correct provider. But unlike DNS, there\'s a middleman tax (latency, cost, dependency).',
    history: 'Like the early telegraph networks (1840s): centralized relay stations. OpenRouter is the "central station" that all messages pass through. This was efficient but created a single point of failure — just as the telegraph monopolies did.',
  },
  {
    id: 'freellmapi',
    name: 'FreeLLMAPI',
    approach: 'Free-Tier Aggregation',
    tagline: 'The Free Pool — 1.7B tokens/month from 16 providers',
    color: '#f59e0b',
    architecture: 'Python proxy that aggregates 16 free-tier LLM providers behind one /v1 endpoint. Automatic failover. OpenAI-compatible. Pure free-tier pooling.',
    freeTokens: '~1.7 billion tokens/month',
    setupComplexity: 'pip install + configure free-tier keys',
    openSource: true,
    strengths: ['Maximum free tokens (~1.7B/mo)', 'Pure free-tier aggregation — no paid providers needed', 'OpenAI-compatible API', 'Automatic failover between providers', 'Lightweight Python proxy', 'Community-maintained free provider list'],
    weaknesses: ['No premium models (free-tier only)', 'Rate limits vary per provider', 'Quality varies (free models = lower capability)', 'No stream racing (sequential, not parallel)', 'Maintenance burden: free providers change frequently', 'No Copilot/Antigravity/AWS integration'],
    economics: 'Commons theory: FreeLLMAPI is a digital commons (Ostrom, 1990). Multiple free providers are pooled like shared grazing land. The tragedy: when one provider becomes popular, its free tier gets exhausted faster. FreeLLMAPI manages this through failover, but the underlying scarcity remains.',
    psychology: 'Scarcity mindset vs abundance mindset. FreeLLMAPI creates an illusion of abundance (1.7B tokens!) but the reality is scarcity (rate limits, model quality). The psychological tension between "free" and "limited" creates anxiety about running out.',
    networkScience: 'Like mesh networking: multiple redundant paths, no central authority. If one provider fails, traffic routes to another. But mesh networks have higher latency than star topologies (like OWL-ORCA\'s centralized proxy).',
    history: 'Like the early internet (ARPANET, 1969): built on the principle of redundancy and free access. ARPANET connected universities for free, just as FreeLLMAPI connects free-tier providers. The lesson: free infrastructure eventually gets commercialized.',
  },
]

function ProxyComparisonTopicsSection() {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-amber-500" />
          Proxy Stacks — The Deep Comparison
        </h2>
        <p className="text-muted-foreground mt-1">
          How OWL-ORCA stands out against LiteLLM, OpenRouter, FreeLLMAPI, and the rest. Analyzed through economics, psychology, and network science.
        </p>
      </div>

      {/* 2x2 Comparison Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {PROXY_COMPARISONS.map((proxy, idx) => (
          <motion.div
            key={proxy.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card
              className="border-2 cursor-pointer hover:shadow-lg transition-all h-full"
              style={{ borderColor: expandedId === proxy.id ? proxy.color : `${proxy.color}40` }}
              onClick={() => setExpandedId(expandedId === proxy.id ? null : proxy.id)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <motion.div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: proxy.color }}
                      animate={{ scale: expandedId === proxy.id ? [1, 1.3, 1] : 1 }}
                      transition={{ duration: 0.5 }}
                    />
                    <div>
                      <CardTitle className="text-base" style={{ color: proxy.color }}>{proxy.name}</CardTitle>
                      <CardDescription className="text-xs">{proxy.tagline}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {proxy.openSource && (
                      <Badge variant="outline" className="text-[10px] border-emerald-400 text-emerald-600 dark:text-emerald-400">OSS</Badge>
                    )}
                    <motion.div animate={{ rotate: expandedId === proxy.id ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    </motion.div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-1.5 mb-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Approach</span>
                    <span className="font-medium text-gray-700 dark:text-gray-300">{proxy.approach}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Free Tokens</span>
                    <span className="font-medium text-gray-700 dark:text-gray-300">{proxy.freeTokens}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Setup</span>
                    <span className="font-medium text-gray-700 dark:text-gray-300">{proxy.setupComplexity}</span>
                  </div>
                </div>

                <AnimatePresence>
                  {expandedId === proxy.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="mb-3 p-3 rounded-lg border" style={{ borderColor: `${proxy.color}30`, backgroundColor: `${proxy.color}05` }}>
                        <p className="text-xs font-semibold mb-1" style={{ color: proxy.color }}>Architecture</p>
                        <p className="text-xs text-muted-foreground">{proxy.architecture}</p>
                      </div>

                      <div className="mb-3">
                        <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1.5">Strengths</p>
                        <div className="flex flex-wrap gap-1">
                          {proxy.strengths.map(s => (
                            <Badge key={s} variant="outline" className="text-[10px] border-emerald-300 text-emerald-700 dark:border-emerald-700 dark:text-emerald-400">✓ {s}</Badge>
                          ))}
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-xs font-semibold text-red-600 dark:text-red-400 mb-1.5">Weaknesses</p>
                        <div className="flex flex-wrap gap-1">
                          {proxy.weaknesses.map(w => (
                            <Badge key={w} variant="outline" className="text-[10px] border-red-300 text-red-700 dark:border-red-700 dark:text-red-400">✗ {w}</Badge>
                          ))}
                        </div>
                      </div>

                      <Accordion type="multiple" className="w-full">
                        <AccordionItem value="economics">
                          <AccordionTrigger className="text-xs py-2">
                            <span className="flex items-center gap-2">💰 Economics Lens</span>
                          </AccordionTrigger>
                          <AccordionContent>
                            <p className="text-xs text-muted-foreground leading-relaxed">{proxy.economics}</p>
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="psychology">
                          <AccordionTrigger className="text-xs py-2">
                            <span className="flex items-center gap-2">🧠 Psychology Lens</span>
                          </AccordionTrigger>
                          <AccordionContent>
                            <p className="text-xs text-muted-foreground leading-relaxed">{proxy.psychology}</p>
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="network">
                          <AccordionTrigger className="text-xs py-2">
                            <span className="flex items-center gap-2">🌐 Network Science Lens</span>
                          </AccordionTrigger>
                          <AccordionContent>
                            <p className="text-xs text-muted-foreground leading-relaxed">{proxy.networkScience}</p>
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="history">
                          <AccordionTrigger className="text-xs py-2">
                            <span className="flex items-center gap-2">📜 Historical Parallels</span>
                          </AccordionTrigger>
                          <AccordionContent>
                            <p className="text-xs text-muted-foreground leading-relaxed">{proxy.history}</p>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Standing Out Summary */}
      <Card className="border-2 border-emerald-300 dark:border-emerald-700 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/10 dark:to-teal-900/10">
        <CardHeader>
          <CardTitle className="text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Standing Out — Why OWL-ORCA Wins the Combination Game
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-sm text-emerald-700 dark:text-emerald-400">
              No single proxy wins every category. But <strong className="text-emerald-800 dark:text-emerald-300">OWL-ORCA</strong> is the ONLY proxy that combines all five critical capabilities in one install:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { label: 'Stream Racing', desc: 'Parallel requests across providers — fastest wins', icon: '⚡' },
                { label: 'Protocol Translation', desc: 'Copilot/Antigravity → OpenAI format on-the-fly', icon: '🔄' },
                { label: 'Premium Models Free', desc: 'AWS Builder ID gives Claude Sonnet 4.5 at $0', icon: '🎁' },
                { label: 'Zero-Config for OpenCode', desc: 'Auto-injected by install.sh — no manual setup', icon: '🚀' },
                { label: 'Circuit Breaking', desc: 'Prevents cascading failures across providers', icon: '🛡️' },
              ].map(item => (
                <div key={item.label} className="p-2.5 rounded-lg bg-emerald-100/50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{item.icon}</span>
                    <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">{item.label}</span>
                  </div>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5">{item.desc}</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
              {[
                { name: 'LiteLLM', win: 'Provider Count (100+)' },
                { name: 'OpenRouter', win: 'Convenience (cloud)' },
                { name: 'FreeLLMAPI', win: 'Free Volume (1.7B/mo)' },
                { name: 'OWL-ORCA', win: 'Free + Premium + Racing + Zero-Config' },
              ].map(item => (
                <div key={item.name} className={`p-2 rounded-lg text-center border ${item.name === 'OWL-ORCA' ? 'border-emerald-400 bg-emerald-200/50 dark:bg-emerald-800/30' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900'}`}>
                  <p className={`text-xs font-bold ${item.name === 'OWL-ORCA' ? 'text-emerald-800 dark:text-emerald-300' : 'text-gray-600 dark:text-gray-400'}`}>{item.name}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Wins: {item.win}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ==================== DASHBOARD SECTION ====================

function DashboardSection({ onNavigate }: { onNavigate: (section: string) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
        <p className="text-muted-foreground mt-1">AI Agentic Development Stack — Overview</p>
      </div>

      {/* Quick Access - Key Images */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
          <Eye className="w-3.5 h-3.5" /> Quick Access
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { title: 'Architecture Diagram', desc: '7-layer stack with OWL-ORCA', gradient: 'from-emerald-400 to-teal-500', emoji: '🖼️' },
            { title: 'Provider Matrix', desc: 'Free-tier LLM comparison', gradient: 'from-violet-400 to-purple-500', emoji: '📊' },
            { title: 'Wiki Dashboard', desc: 'Interactive app preview', gradient: 'from-amber-400 to-orange-500', emoji: '🖥️' },
          ].map((item, idx) => (
            <motion.button
              key={item.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.03, y: -2 }}
              onClick={() => onNavigate('files')}
              className="relative overflow-hidden rounded-xl border-2 border-transparent hover:border-amber-400 dark:hover:border-amber-600 transition-colors text-left"
            >
              <div className={`bg-gradient-to-br ${item.gradient} p-4 text-white relative`}>
                <motion.div
                  className="absolute inset-0 bg-black/10"
                  animate={{ opacity: [0, 0.15, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: idx * 0.3 }}
                />
                <span className="text-2xl">{item.emoji}</span>
                <p className="font-bold text-sm mt-2">{item.title}</p>
                <p className="text-xs opacity-80">{item.desc}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'ADE Tools', value: '20+', icon: Terminal, color: 'amber', stat: '9 CLI-first' },
          { label: 'Proxy Stacks', value: '10+', icon: Globe, color: 'emerald', stat: '~1.7B free tokens/mo' },
          { label: 'Plugins & MCP', value: '15+', icon: Puzzle, color: 'violet', stat: 'Above Mediocrity' },
          { label: 'Architecture Layers', value: '7', icon: Layers, color: 'rose', stat: 'With OWL-ORCA Proxy' },
          { label: 'Proxy Endpoints', value: '3', icon: Globe, color: 'cyan', stat: 'OWL-ORCA v7.1.0' },
        ].map((stat) => (
          <motion.div key={stat.label} whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
            <Card className={`border-l-4 border-l-${stat.color}-500`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900/30`}>
                    <stat.icon className={`w-5 h-5 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.stat}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* A/B Quick Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitCompare className="w-5 h-5 text-amber-500" />
            oh-my-opencode vs oh-my-opencode-slim — Quick Snapshot
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border-2 border-amber-300 dark:border-amber-700 bg-amber-50/50 dark:bg-amber-900/10">
              <p className="font-bold text-amber-800 dark:text-amber-300 text-sm">oh-my-opencode</p>
              <div className="mt-2 space-y-1.5 text-xs">
                <div className="flex justify-between"><span className="text-muted-foreground">Stars</span><span className="font-bold text-amber-700 dark:text-amber-300">~38K</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Downloads/wk</span><span className="font-bold text-amber-700 dark:text-amber-300">~60K</span></div>
                <Progress value={76} className="h-1.5 mt-1" />
                <p className="text-amber-600 dark:text-amber-400 font-medium">10 dimension wins (features)</p>
              </div>
            </div>
            <div className="p-4 rounded-lg border-2 border-emerald-300 dark:border-emerald-700 bg-emerald-50/50 dark:bg-emerald-900/10">
              <p className="font-bold text-emerald-800 dark:text-emerald-300 text-sm">oh-my-opencode-slim</p>
              <div className="mt-2 space-y-1.5 text-xs">
                <div className="flex justify-between"><span className="text-muted-foreground">Stars</span><span className="font-bold text-emerald-700 dark:text-emerald-300">~5.1K</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Downloads/wk</span><span className="font-bold text-emerald-700 dark:text-emerald-300">~7.2K</span></div>
                <Progress value={48} className="h-1.5 mt-1" />
                <p className="text-emerald-600 dark:text-emerald-400 font-medium">10 dimension wins (efficiency)</p>
              </div>
            </div>
          </div>
          <div className="mt-4 p-3 rounded-lg bg-muted/50 text-xs text-muted-foreground text-center">
            It&apos;s a 10-10 tie across 20 dimensions — <strong>Full wins on features</strong>, <strong>Slim wins on efficiency</strong>. See A/B Compare tab for details.
          </div>
        </CardContent>
      </Card>

      {/* Enhancement Stack Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            Above Mediocrity Enhancement Stack
          </CardTitle>
          <CardDescription>The essential plugins to make OpenCode deliver above mediocrity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { tier: 1, items: ['Oh-My-OpenAgent (38K stars)', 'Superpowers (140K+ stars)', 'Context7 MCP (3K+ stars)', 'GitHub MCP (15K+ stars)'] },
              { tier: 2, items: ['OpenSpec Plugin (SDD)', 'Antigravity Awesome Skills (1.5K+)', 'Firecrawl MCP', 'OpenRouter (300+ models)', 'Gemini Auth Plugin'] },
              { tier: 3, items: ['ntfy.sh Notifications', 'OpenCode Worktree', 'Daytona Sandbox', 'OpenCode Browser', 'Ollama Local Models'] },
            ].map(({ tier, items }) => (
              <div key={tier} className="p-3 rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={`text-[10px] border-0 ${tier === 1 ? 'bg-amber-500' : tier === 2 ? 'bg-emerald-500' : 'bg-gray-400'} text-white`}>
                    Tier {tier}
                  </Badge>
                  <span className="text-xs font-medium text-muted-foreground">
                    {tier === 1 ? 'Essential — Install First' : tier === 2 ? 'High Impact' : 'Quality of Life'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {items.map(item => (
                    <Badge key={item} variant="secondary" className="text-xs">{item}</Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ==================== MAIN PAGE ====================

export default function HomePage() {
  const [activeSection, setActiveSection] = useState('dashboard')
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  const sections: Record<string, React.ReactNode> = {
    dashboard: <SectionErrorBoundary sectionName="Dashboard"><DashboardSection onNavigate={setActiveSection} /></SectionErrorBoundary>,
    compare: <SectionErrorBoundary sectionName="A/B Compare"><ABCompareSection /></SectionErrorBoundary>,
    architecture: <SectionErrorBoundary sectionName="Architecture"><ArchitectureInfographicSection /></SectionErrorBoundary>,
    compatibility: <SectionErrorBoundary sectionName="ADE Compat"><ADECompatibilitySection /></SectionErrorBoundary>,
    plugins: <SectionErrorBoundary sectionName="Plugins"><PluginsSection /></SectionErrorBoundary>,
    blueprint: <SectionErrorBoundary sectionName="Blueprint"><UltimateBlueprintSection /></SectionErrorBoundary>,
    categories: <SectionErrorBoundary sectionName="Categories"><CategoriesSection /></SectionErrorBoundary>,
    files: <SectionErrorBoundary sectionName="Files"><FileBrowserSection /></SectionErrorBoundary>,
    topics: <SectionErrorBoundary sectionName="Proxy Topics"><ProxyComparisonTopicsSection /></SectionErrorBoundary>,
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
                AI
              </div>
              <div>
                <h1 className="text-sm font-bold text-gray-900 dark:text-white">AI Agentic Stack</h1>
                <p className="text-[10px] text-muted-foreground hidden sm:block">Knowledge Base & Interactive Wiki</p>
              </div>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                    activeSection === item.id
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                      : 'text-muted-foreground hover:bg-muted/50 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <item.icon className="w-3.5 h-3.5" />
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-muted/50"
            >
              {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile Nav Dropdown */}
          <AnimatePresence>
            {mobileNavOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="md:hidden overflow-hidden border-t"
              >
                <div className="py-2 space-y-1">
                  {NAV_ITEMS.map(item => (
                    <button
                      key={item.id}
                      onClick={() => { setActiveSection(item.id); setMobileNavOpen(false) }}
                      className={`w-full px-4 py-2 text-sm font-medium text-left rounded-lg transition-colors flex items-center gap-2 ${
                        activeSection === item.id
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                          : 'text-muted-foreground hover:bg-muted/50'
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {sections[activeSection]}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white dark:bg-gray-900 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
            <p>AI Agentic Stack — Interactive Knowledge Base & Wiki</p>
            <p>Ubuntu Free & Unlimited | 6 Layers | 20+ ADE Tools | 15 Plugins</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
