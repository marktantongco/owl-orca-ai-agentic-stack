'use client'

import { useState, useRef, useCallback, useEffect, type ElementType } from 'react'
import { motion, AnimatePresence, useInView, type Variants } from 'framer-motion'
import {
  LayoutDashboard, GitCompare, Network, Puzzle, Gift, Layers,
  Menu, X, Search, Star, Copy, Check, ExternalLink,
  ChevronRight, ChevronDown, Zap, Shield, Cpu, Globe,
  Code, Terminal, ArrowRight, BookOpen, Sparkles,
  TrendingUp, Activity, Trophy, FolderTree,
  FileText, FileCode, Settings, Database, Server, Download, Eye, Filter,
  Users, Info, FileSearch, BookMarked, Microscope, FlaskConical, BarChart3, Waypoints
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { toast } from 'sonner'
import ReactMarkdown from 'react-markdown'
import { SectionErrorBoundary } from '@/components/ErrorBoundary'
import { useGSAP } from '@gsap/react'
import { gsap, ScrollTrigger } from '@/lib/gsapConfig'
import {
  ARCHITECTURE_LAYERS, TOP_PLUGINS, COMPARISON_DATA, CATEGORY_GROUPS,
  ADE_COMPATIBILITY, ULTIMATE_BLUEPRINT_STEPS, PROXY_ENDPOINTS,
  FILE_INVENTORY, STANDING_OUT_CAPABILITIES,
  CROSS_FIELD_CONNECTIONS, CROSS_FIELD_DIMENSIONS,
  RESEARCH_DOCUMENTS,
  type ArchLayer, type ArchComponent, type PluginEntry, type CompareItem,
  type ADECompatEntry, type FileEntry, type ResearchDocument, type ResearchSection
} from '@/lib/architecture-data'

// ==================== ANIMATION VARIANTS ====================

const customEase = [0.25, 0.46, 0.45, 0.94] as const

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const fadeUpItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } },
}

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 25 } },
}

const slideFromLeft: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
}

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
}

// ==================== SECURITY HELPERS ====================

/** Masks sensitive key values for display: 'orca-racer' becomes 'or•••••cer' */
function maskKey(key: string): string {
  if (key === '(internal)') return key
  if (key.length <= 4) return key.charAt(0) + '••' + key.charAt(key.length - 1)
  return key.slice(0, 2) + '•'.repeat(key.length - 4) + key.slice(-2)
}

/** Safely checks clipboard API availability */
function isClipboardAvailable(): boolean {
  return typeof navigator !== 'undefined' && typeof navigator.clipboard !== 'undefined' && typeof navigator.clipboard.writeText === 'function'
}

/** Sanitize search input — strip potential XSS vectors */
function sanitizeSearch(input: string): string {
  return input.replace(/[<>"'&]/g, '').slice(0, 200)
}

// ==================== HELPERS ====================

function CopyButton({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    if (!isClipboardAvailable()) {
      toast.error('Clipboard not available in this environment')
      return
    }
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      toast.success(label ? `${label} copied!` : 'Copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    }).catch(() => {
      toast.error('Failed to copy')
    })
  }
  return (
    <motion.button
      onClick={handleCopy}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      aria-label={copied ? 'Copied' : `Copy: ${text.slice(0, 30)}...`}
      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-lg bg-amber-100 text-amber-800 hover:bg-amber-200 transition-colors dark:bg-amber-900/30 dark:text-amber-400 dark:hover:bg-amber-900/50 min-h-[44px] focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 cursor-pointer"
    >
      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
      {copied ? 'Copied!' : 'Copy'}
    </motion.button>
  )
}

/** Key reveal button for masked sensitive values */
function KeyReveal({ value }: { value: string }) {
  const [revealed, setRevealed] = useState(false)
  if (value === '(internal)') return <span className="text-gray-700 dark:text-gray-300">{value}</span>
  return (
    <motion.button
      onClick={() => setRevealed(!revealed)}
      whileTap={{ scale: 0.97 }}
      className="font-mono cursor-pointer hover:underline focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 rounded"
      aria-label={revealed ? 'Hide API key' : 'Reveal API key'}
      title={revealed ? 'Click to hide' : 'Click to reveal'}
    >
      <span className={revealed ? 'text-gray-700 dark:text-gray-300' : 'text-gray-500 dark:text-gray-400'}>
        {revealed ? value : maskKey(value)}
      </span>
    </motion.button>
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
  { id: 'research', label: 'Research Hub', icon: FileSearch },
  { id: 'topics', label: 'Proxy Topics', icon: BookOpen },
] as const

const VALID_SECTIONS = NAV_ITEMS.map(n => n.id)

// ==================== SECTION HEADER COMPONENT ====================

function SectionHeader({ icon: Icon, title, description }: { icon: ElementType; title: string; description: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <div ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: customEase }}
      >
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
          <Icon className="w-6 h-6 text-amber-500" />
          {title}
        </h2>
        <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400 mt-1">
          {description}
        </p>
      </motion.div>
    </div>
  )
}

// ==================== ANIMATED ARCHITECTURE INFOGRAPHIC ====================

function LayerCard({ layer, index }: { layer: ArchLayer; index: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -60 : 60, scale: 0.95 }}
      animate={isInView ? { opacity: 1, x: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: customEase }}
      layout
      className="relative"
    >
      {/* Pulsing glow effect */}
      <motion.div
        className="absolute -inset-1 rounded-2xl opacity-0"
        animate={isInView ? { opacity: [0, 0.3, 0] } : {}}
        transition={{ duration: 2, delay: index * 0.1 + 0.5, repeat: Infinity, repeatDelay: 3 }}
        style={{ background: `linear-gradient(135deg, ${layer.color}20, transparent, ${layer.color}10)`, borderRadius: '1rem' }}
      />

      <Card
        className="relative overflow-hidden cursor-pointer hover:shadow-md transition-shadow rounded-xl transform-gpu"
        onClick={() => setIsExpanded(!isExpanded)}
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        aria-label={`${layer.label} — click to ${isExpanded ? 'collapse' : 'expand'}`}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setIsExpanded(!isExpanded) } }}
      >
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
                <CardTitle className="text-base font-bold tracking-tight" style={{ color: layer.color }}>{layer.label}</CardTitle>
                <CardDescription className="text-xs leading-relaxed mt-0.5">{layer.description}</CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs" style={{ borderColor: layer.color, color: layer.color }}>
                {layer.components.length} components
              </Badge>
              <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
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
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2"
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                >
                  {layer.components.map((comp, cIdx) => (
                    <motion.div
                      key={comp.id}
                      variants={fadeUpItem}
                      custom={cIdx}
                      whileHover={{ x: 4, backgroundColor: `${layer.color}10` }}
                      whileTap={{ scale: 0.98 }}
                      className="p-3 rounded-lg border hover:shadow-sm transition-shadow cursor-default"
                      style={{ borderColor: `${layer.color}30`, backgroundColor: `${layer.color}05` }}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">{comp.icon}</span>
                        <span className="font-semibold text-sm text-gray-900 dark:text-white">{comp.label}</span>
                      </div>
                      <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{comp.description}</p>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {comp.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs px-1.5 py-0.5">{tag}</Badge>
                        ))}
                      </div>
                      {(comp.stars || comp.downloads) && (
                        <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-600 dark:text-gray-400">
                          {comp.stars && <span className="flex items-center gap-0.5"><Star className="w-3 h-3 fill-amber-400 text-amber-400" />{comp.stars}</span>}
                          {comp.downloads && <span className="flex items-center gap-0.5"><TrendingUp className="w-3 h-3" />{comp.downloads}</span>}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </motion.div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* Animated connector line to next layer */}
      {index < ARCHITECTURE_LAYERS.length - 1 && (
        <div className="flex justify-center py-2 relative">
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={isInView ? { height: 24, opacity: 1 } : {}}
            transition={{ duration: 0.4, delay: index * 0.1 + 0.2 }}
            className="w-0.5 rounded-full"
            style={{ backgroundColor: layer.color }}
          />
          {/* Data flow particle animation */}
          <motion.div
            className="absolute w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: layer.color }}
            animate={isInView ? {
              y: [0, 24],
              opacity: [0, 1, 0],
            } : {}}
            transition={{
              duration: 1.5,
              delay: index * 0.1 + 0.5,
              repeat: Infinity,
              repeatDelay: 2,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ duration: 0.3, delay: index * 0.1 + 0.5, repeat: Infinity, repeatDelay: 2 }}
            className="absolute -bottom-1"
          >
            <ArrowRight className="w-3 h-3 rotate-90 text-gray-500 dark:text-gray-400" />
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}

function DataFlowSVG() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }} aria-hidden="true">
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

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={Network}
        title="AI Agentic Architecture — Interactive Infographic"
        description="Deep-dive brainstorm translation of the agentic stack — 7 layers with OWL-ORCA proxy integration. Click any layer to expand."
      />

      {/* View mode toggle */}
      <div className="flex items-center gap-2 flex-wrap" role="tablist" aria-label="Architecture view mode">
        {[
          { mode: 'stack' as const, icon: Layers, label: 'Stack View' },
          { mode: 'flow' as const, icon: Activity, label: 'Flow View' },
          { mode: 'routing' as const, icon: Globe, label: 'Routing Map' },
        ].map(({ mode, icon: ModeIcon, label }) => (
          <Button
            key={mode}
            variant={viewMode === mode ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode(mode)}
            role="tab"
            aria-selected={viewMode === mode}
            aria-label={label}
            className="min-h-[44px]"
          >
            <ModeIcon className="w-4 h-4 mr-1" /> {label}
          </Button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={viewMode}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25, ease: customEase }}
        >
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
        </motion.div>
      </AnimatePresence>

      {/* Architecture Legend */}
      <Card className="rounded-xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-bold tracking-tight flex items-center gap-2">
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
          <div className="mt-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/10 text-xs leading-relaxed text-amber-800 dark:text-amber-300">
            <strong>Data Flow:</strong> User Input → Silent Protocol (diagnose) → Route (speed/depth) → Orca Router (:60001) / Kiro Gateway (:8333) → Agent Orchestration (5 parallel) → Local Models (Ollama fallback) → Ubuntu Host (infra)
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function FlowDiagramView() {
  return (
    <Card className="overflow-hidden rounded-xl">
      <CardContent className="p-6">
        <div className="flex flex-col items-center gap-4">
          {ARCHITECTURE_LAYERS.map((layer, idx) => (
            <motion.div
              key={layer.id}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: idx * 0.1, ease: customEase }}
              className="w-full max-w-lg"
            >
              <motion.div
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="p-4 rounded-xl border-2 text-center transform-gpu"
                style={{ borderColor: layer.color, backgroundColor: `${layer.color}08` }}
              >
                <span className="text-3xl">{layer.icon}</span>
                <h3 className="font-bold tracking-tight mt-1" style={{ color: layer.color }}>{layer.label}</h3>
                <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-400 mt-1">{layer.description}</p>
                <div className="flex justify-center gap-1.5 mt-2 flex-wrap">
                  {layer.components.slice(0, 3).map(c => (
                    <Badge key={c.id} variant="outline" className="text-xs">{c.icon} {c.label}</Badge>
                  ))}
                  {layer.components.length > 3 && (
                    <Badge variant="secondary" className="text-xs">+{layer.components.length - 3}</Badge>
                  )}
                </div>
              </motion.div>
              {idx < ARCHITECTURE_LAYERS.length - 1 && (
                <div className="flex justify-center py-1 relative">
                  <motion.div
                    initial={{ height: 0 }}
                    whileInView={{ height: 20 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 + 0.2 }}
                    className="w-0.5 rounded-full"
                    style={{ backgroundColor: layer.color }}
                  />
                  {/* Data flow particle */}
                  <motion.div
                    className="absolute w-1 h-1 rounded-full"
                    style={{ backgroundColor: layer.color }}
                    animate={{
                      y: [0, 20],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 1.2,
                      delay: idx * 0.1 + 0.3,
                      repeat: Infinity,
                      repeatDelay: 1.5,
                      ease: 'easeInOut',
                    }}
                  />
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 + 0.4 }}
                    className="ml-0.5"
                  >
                    <svg width="8" height="8" viewBox="0 0 8 8" className="mt-1" aria-hidden="true">
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
    <Card className="overflow-hidden rounded-xl">
      <CardContent className="p-6">
        <div className="space-y-8">
          {/* ADEs Layer */}
          <div>
            <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5" /> Developer Interfaces (ADEs)
            </h4>
            <motion.div
              className="flex flex-wrap justify-center gap-2"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
            >
              {['OpenCode/Kilo', 'Orca', 'Goose', 'Zed', 'Warp', 'Cursor', 'Cline', 'Aider'].map((ade) => (
                <motion.div
                  key={ade}
                  variants={scaleIn}
                  whileHover={{ scale: 1.08, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-3 py-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/20 border border-amber-300 dark:border-amber-700 text-xs font-medium text-amber-800 dark:text-amber-300 min-h-[36px] flex items-center cursor-default"
                >
                  {ade}
                </motion.div>
              ))}
            </motion.div>
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
            <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Globe className="w-3.5 h-3.5" /> OWL-ORCA Proxy Stack (Local Endpoints)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {PROXY_ENDPOINTS.map((ep, i) => (
                <motion.div
                  key={ep.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ delay: i * 0.1, ease: customEase }}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="p-4 rounded-xl border-2 text-center transform-gpu"
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
                  <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-400 mb-2">{ep.role}</p>
                  <div className="text-xs font-mono space-y-1">
                    <div className="px-2 py-1.5 rounded bg-gray-100 dark:bg-gray-800">
                      <span className="text-gray-600 dark:text-gray-400">Port:</span> <span className="text-gray-700 dark:text-gray-300">:{ep.port}</span>
                    </div>
                    <div className="px-2 py-1.5 rounded bg-gray-100 dark:bg-gray-800">
                      <span className="text-gray-600 dark:text-gray-400">Key:</span> <KeyReveal value={ep.apiKey} />
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
            <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
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
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ delay: i * 0.1, ease: customEase }}
                  whileHover={{ y: -2 }}
                  className="p-3 rounded-lg border text-center"
                  style={{ borderColor: `${provider.color}40`, backgroundColor: `${provider.color}05` }}
                >
                  <p className="font-semibold text-sm text-gray-900 dark:text-white">{provider.name}</p>
                  <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-400 mt-1">{provider.models}</p>
                  <code className="text-xs mt-2 inline-block bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded font-mono">{provider.auth}</code>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Routing Summary */}
          <div className="p-4 rounded-lg bg-gradient-to-r from-emerald-50 via-purple-50 to-amber-50 dark:from-emerald-900/10 dark:via-purple-900/10 dark:to-amber-900/10 border">
            <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Routing Paths
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs leading-relaxed">
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

  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={GitCompare}
        title="A/B Comparison: oh-my-opencode vs oh-my-opencode-slim"
        description="Side-by-side analysis of the two leading OpenCode multi-agent orchestration plugins — features, metrics, and trade-offs."
      />

      {/* Score Cards */}
      <motion.div
        ref={sectionRef}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        <motion.div variants={fadeUpItem} whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }} className="transform-gpu">
          <Card className="border-2 border-amber-400 dark:border-amber-600 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-amber-800 dark:text-amber-300 flex items-center gap-2 font-bold tracking-tight">
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
                  <span className="text-sm leading-relaxed">GitHub Stars</span>
                  <span className="font-bold text-amber-700 dark:text-amber-300">~38,000</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm leading-relaxed">Weekly Downloads</span>
                  <span className="font-bold text-amber-700 dark:text-amber-300">~60K</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm leading-relaxed">Agents</span>
                  <span className="font-bold text-amber-700 dark:text-amber-300">11 built-in</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm leading-relaxed">License</span>
                  <span className="text-sm text-amber-600 dark:text-amber-400">SUL-1.0</span>
                </div>
                <Separator className="bg-amber-200 dark:bg-amber-800" />
                <div className="text-xs leading-relaxed text-amber-700 dark:text-amber-400 space-y-1">
                  <p><strong>Best for:</strong> Maximum features, Claude Code compat, autonomous mode</p>
                  <p><strong>Watch out:</strong> High token overhead (15-25K startup), 3x more API requests</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeUpItem} whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }} className="transform-gpu">
          <Card className="border-2 border-emerald-400 dark:border-emerald-600 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-emerald-800 dark:text-emerald-300 flex items-center gap-2 font-bold tracking-tight">
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
                  <span className="text-sm leading-relaxed">GitHub Stars</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-300">~5,100</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm leading-relaxed">Weekly Downloads</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-300">~7.2K</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm leading-relaxed">Agents</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-300">7+2+custom</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm leading-relaxed">License</span>
                  <span className="text-sm text-emerald-600 dark:text-emerald-400">MIT</span>
                </div>
                <Separator className="bg-emerald-200 dark:bg-emerald-800" />
                <div className="text-xs leading-relaxed text-emerald-700 dark:text-emerald-400 space-y-1">
                  <p><strong>Best for:</strong> Token efficiency, simplicity, Council consensus, custom agents</p>
                  <p><strong>Watch out:</strong> Fewer features, limited Claude Code compat, smaller community</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Winner Toggle */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm text-gray-600 dark:text-gray-400">Highlight:</span>
        {[
          { key: 'all' as const, label: 'All', activeClass: 'bg-gray-800 text-white dark:bg-gray-200 dark:text-gray-800' },
          { key: 'full' as const, label: `Full (${fullWins})`, activeClass: 'bg-amber-500 text-white' },
          { key: 'slim' as const, label: `Slim (${slimWins})`, activeClass: 'bg-emerald-500 text-white' },
        ].map(({ key, label, activeClass }) => (
          <motion.button
            key={key}
            onClick={() => setHighlightWinner(key)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className={`px-3 py-1.5 text-xs rounded-full transition-colors flex items-center gap-1.5 min-h-[36px] cursor-pointer focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 ${
              highlightWinner === key ? activeClass : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400'
            }`}
            aria-label={`Highlight ${label}`}
            aria-pressed={highlightWinner === key}
          >
            {label}
          </motion.button>
        ))}
      </div>

      {/* Detailed Comparison Table */}
      <Card className="rounded-xl">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm" role="table">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 font-medium w-40" scope="col">Dimension</th>
                  <th className="text-left p-3 font-medium" scope="col">
                    <span className="flex items-center gap-1"><Trophy className="w-3.5 h-3.5 text-amber-500" /> Full</span>
                  </th>
                  <th className="text-left p-3 font-medium" scope="col">
                    <span className="flex items-center gap-1"><Zap className="w-3.5 h-3.5 text-emerald-500" /> Slim</span>
                  </th>
                  <th className="text-center p-3 font-medium w-16" scope="col">Edge</th>
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
                      transition={{ delay: idx * 0.02, ease: customEase }}
                      className={`border-b last:border-b-0 hover:bg-muted/30 transition-colors ${dimmed ? 'opacity-40' : ''}`}
                    >
                      <td className="p-3 font-medium text-gray-900 dark:text-white text-xs">{row.dimension}</td>
                      <td className={`p-3 text-xs leading-relaxed ${row.winner === 'full' ? 'font-semibold text-amber-700 dark:text-amber-300' : 'text-gray-600 dark:text-gray-400'}`}>
                        {row.ohMyOpencode}
                      </td>
                      <td className={`p-3 text-xs leading-relaxed ${row.winner === 'slim' ? 'font-semibold text-emerald-700 dark:text-emerald-300' : 'text-gray-600 dark:text-gray-400'}`}>
                        {row.ohMyOpencodeSlim}
                      </td>
                      <td className="p-3 text-center">
                        {row.winner === 'full' && <Trophy className="w-4 h-4 text-amber-500 mx-auto" />}
                        {row.winner === 'slim' && <Zap className="w-4 h-4 text-emerald-500 mx-auto" />}
                        {row.winner === 'tie' && <span className="text-gray-500 dark:text-gray-400 text-xs">Tie</span>}
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
      <Card className="bg-gradient-to-r from-amber-50 to-emerald-50 dark:from-amber-900/10 dark:to-emerald-900/10 rounded-xl">
        <CardContent className="p-5">
          <h3 className="font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-amber-500" /> The Verdict
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 rounded-lg bg-amber-100/50 dark:bg-amber-900/20">
              <p className="font-semibold text-amber-800 dark:text-amber-300 text-sm">Choose Full When:</p>
              <ul className="text-xs leading-relaxed text-amber-700 dark:text-amber-400 mt-2 space-y-1" role="list">
                <li>- You need Claude Code ecosystem compatibility</li>
                <li>- Feature completeness matters more than token cost</li>
                <li>- You want autonomous Ultrawork mode</li>
                <li>- You need advanced per-agent model routing</li>
                <li>- Large community and documentation are priorities</li>
              </ul>
            </div>
            <div className="p-3 rounded-lg bg-emerald-100/50 dark:bg-emerald-900/20">
              <p className="font-semibold text-emerald-800 dark:text-emerald-300 text-sm">Choose Slim When:</p>
              <ul className="text-xs leading-relaxed text-emerald-700 dark:text-emerald-400 mt-2 space-y-1" role="list">
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
      <SectionHeader
        icon={Shield}
        title="ADE Compatibility — OWL-ORCA v7.1.0"
        description="Deep-dive compatibility analysis: which ADEs work with the OWL-ORCA Master Installer proxy stack. The Golden Rule: any ADE with custom OpenAI-compatible base URL support passes."
      />

      {/* Proxy Endpoints Summary */}
      <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/10 dark:to-teal-900/10 border-emerald-200 dark:border-emerald-800 rounded-xl">
        <CardHeader>
          <CardTitle className="text-emerald-800 dark:text-emerald-300 flex items-center gap-2 text-base font-bold tracking-tight">
            <Globe className="w-5 h-5" /> 3 Local Proxy Endpoints (install.sh creates these)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {PROXY_ENDPOINTS.map((ep, i) => (
              <motion.div
                key={ep.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ delay: i * 0.08, ease: customEase }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="p-3 rounded-lg border-2 bg-white dark:bg-gray-900"
                style={{ borderColor: ep.color }}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ep.color }} />
                  <span className="font-semibold text-sm text-gray-900 dark:text-white">{ep.name}</span>
                </div>
                <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-400 mb-2">{ep.role}</p>
                <div className="space-y-1 text-xs font-mono">
                  <div className="p-1.5 rounded bg-gray-100 dark:bg-gray-800">
                    <span className="text-gray-600 dark:text-gray-400">URL:</span> <span className="text-gray-700 dark:text-gray-300">{ep.url}</span>
                  </div>
                  <div className="p-1.5 rounded bg-gray-100 dark:bg-gray-800">
                    <span className="text-gray-600 dark:text-gray-400">Key:</span> <KeyReveal value={ep.apiKey} />
                  </div>
                </div>
                <div className="mt-2">
                  <CopyButton text={`export OPENAI_BASE_URL="${ep.url}" && export OPENAI_API_KEY="${ep.apiKey}"`} label="Environment variables" />
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tier Legend & Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm text-gray-600 dark:text-gray-400">Filter:</span>
        <div className="flex gap-1.5" role="radiogroup" aria-label="Filter by tier">
          {[
            { tier: 0, label: 'All', activeClass: 'bg-gray-800 text-white dark:bg-gray-200 dark:text-gray-800' },
            { tier: 1, label: 'Tier 1', activeClass: 'bg-emerald-500 text-white' },
            { tier: 2, label: 'Tier 2', activeClass: 'bg-blue-500 text-white' },
            { tier: 3, label: 'Tier 3', activeClass: 'bg-amber-500 text-white' },
            { tier: 4, label: 'Tier 4', activeClass: 'bg-red-500 text-white' },
          ].map(t => (
            <motion.button
              key={t.tier}
              onClick={() => setTierFilter(t.tier)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              role="radio"
              aria-checked={tierFilter === t.tier}
              className={`px-3 py-1.5 text-xs rounded-full transition-colors min-h-[36px] cursor-pointer focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 ${
                tierFilter === t.tier
                  ? t.activeClass
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400'
              }`}
            >
              {t.label}
            </motion.button>
          ))}
        </div>
        <div className="flex-1 min-w-0 max-w-xs">
          <Input
            placeholder="Search ADEs..."
            value={search}
            onChange={e => setSearch(sanitizeSearch(e.target.value))}
            maxLength={200}
            className="h-9 text-xs"
            aria-label="Search ADEs by name or verdict"
          />
        </div>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400">{filtered.length} ADEs found</p>

      {/* ADE Cards */}
      <div className="space-y-3">
        {filtered.map((ade, idx) => {
          const cfg = tierConfig[ade.tier]
          return (
            <motion.div
              key={ade.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: idx * 0.03, ease: customEase }}
            >
              <Card className={`border-l-4 ${cfg.border} ${cfg.bg} hover:shadow-md transition-shadow rounded-xl`}>
                <CardContent className="p-4">
                  <div className="flex flex-col gap-3">
                    {/* Header */}
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        {cfg.icon}
                        <h4 className="font-semibold text-gray-900 dark:text-white">{ade.name}</h4>
                        <Badge
                          className="text-xs border-0 text-white"
                          style={{ backgroundColor: cfg.color }}
                        >
                          {ade.tierLabel}
                        </Badge>
                      </div>
                      <Badge
                        variant="outline"
                        className="text-xs font-bold"
                        style={{ borderColor: cfg.color, color: cfg.color }}
                      >
                        {ade.verdict}
                      </Badge>
                    </div>

                    {/* How to connect */}
                    <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">{ade.howToConnect}</p>

                    {/* Endpoint info */}
                    {ade.endpoint !== '—' && (
                      <div className="flex flex-wrap gap-3 text-xs font-mono">
                        <div className="px-2 py-1 rounded bg-white/60 dark:bg-black/20">
                          <span className="text-gray-600 dark:text-gray-400">Endpoint:</span>{' '}
                          <span className="text-gray-700 dark:text-gray-300">{ade.endpoint}</span>
                        </div>
                        <div className="px-2 py-1 rounded bg-white/60 dark:bg-black/20">
                          <span className="text-gray-600 dark:text-gray-400">Key:</span>{' '}
                          <KeyReveal value={ade.apiKey} />
                        </div>
                        {ade.models && (
                          <div className="px-2 py-1 rounded bg-white/60 dark:bg-black/20">
                            <span className="text-gray-600 dark:text-gray-400">Models:</span>{' '}
                            <span className="text-gray-700 dark:text-gray-300">{ade.models}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Copy env vars */}
                    {ade.endpoint !== '—' && (
                      <CopyButton text={`export OPENAI_BASE_URL="${ade.endpoint}"\nexport OPENAI_API_KEY="${ade.apiKey}"`} label="Environment variables" />
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Golden Rule */}
      <Card className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-xl">
        <CardContent className="p-5">
          <h3 className="font-bold tracking-tight text-amber-800 dark:text-amber-300 flex items-center gap-2 text-sm mb-2">
            <Sparkles className="w-4 h-4" /> The Golden Rule of Compatibility
          </h3>
          <p className="text-xs leading-relaxed text-amber-700 dark:text-amber-400">
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
      <SectionHeader
        icon={Zap}
        title='Ultimate "Free Unlimited" Orchestration Blueprint'
        description="The exact 5-step setup to achieve a 5-agent parallel coding fleet with zero rate-limiting, zero cost, and kernel-level isolation — using the OWL-ORCA Master Installer v7.1.0."
      />

      {/* Steps */}
      <div className="space-y-4">
        {ULTIMATE_BLUEPRINT_STEPS.map((step, idx) => (
          <motion.div
            key={step.step}
            initial={{ opacity: 0, x: idx % 2 === 0 ? -40 : 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ delay: idx * 0.1, ease: customEase }}
          >
            <Card className="overflow-hidden border-l-4 border-l-amber-500 hover:shadow-lg transition-shadow rounded-xl">
              <div className="flex items-start gap-4 p-5">
                {/* Step Number */}
                <motion.div
                  className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-lg shadow-md"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {step.step}
                </motion.div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold tracking-tight text-gray-900 dark:text-white text-base">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400 mt-1">{step.description}</p>

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
                        <CopyButton text={step.command} label="Command" />
                      </div>
                    </div>
                  )}

                  {/* Details */}
                  <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400 mt-2 italic">{step.details}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Result Card */}
      <Card className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-900/10 dark:via-teal-900/10 dark:to-cyan-900/10 border-2 border-emerald-300 dark:border-emerald-700 rounded-xl">
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
            <h3 className="text-xl font-bold tracking-tight text-emerald-800 dark:text-emerald-300 mb-2">The Result</h3>
            <p className="text-sm leading-relaxed text-emerald-700 dark:text-emerald-400 max-w-lg mx-auto">
              A <strong>5-agent parallel coding fleet</strong>, drawing from <strong>GitHub Copilot Free</strong>,{' '}
              <strong>Antigravity Free</strong>, and <strong>AWS Builder ID Free</strong> (Claude Sonnet 4.5, DeepSeek 3.2),
              with <strong>zero rate-limiting</strong>, <strong>zero cost</strong>, and <strong>kernel-level isolation</strong>.
            </p>
          </div>

          <motion.div
            className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              { label: 'Cost', value: '$0', sub: 'Free tiers pooled' },
              { label: 'Agents', value: '5', sub: 'Parallel in worktrees' },
              { label: 'Rate Limits', value: 'None', sub: 'Circuit-breaking proxy' },
            ].map(stat => (
              <motion.div key={stat.label} variants={scaleIn} className="p-3 rounded-lg bg-white/60 dark:bg-black/20 text-center">
                <p className="text-2xl font-black text-emerald-700 dark:text-emerald-300">{stat.value}</p>
                <p className="text-xs font-medium text-gray-900 dark:text-white">{stat.label}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{stat.sub}</p>
              </motion.div>
            ))}
          </motion.div>
        </CardContent>
      </Card>

      {/* Pooled Free Tiers */}
      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle className="text-sm font-bold tracking-tight flex items-center gap-2">
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
                <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-400 mt-1">{src.models}</p>
                <div className="mt-2">
                  <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded font-mono">{src.auth}</code>
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
      <SectionHeader
        icon={Puzzle}
        title="Plugins, Skills & MCP Servers — Above Mediocrity Stack"
        description="Curated enhancement tools to make OpenCode deliver above mediocrity. Tiered by impact."
      />

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
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400" />
          <Input
            placeholder="Search plugins, skills, MCP servers..."
            value={search}
            onChange={e => setSearch(sanitizeSearch(e.target.value))}
            maxLength={200}
            className="pl-9 h-10"
            aria-label="Search plugins"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={tierFilter}
            onChange={e => setTierFilter(Number(e.target.value))}
            className="px-3 py-2 text-sm rounded-md border bg-white dark:bg-gray-900 dark:border-gray-700 min-h-[44px] focus:ring-2 focus:ring-amber-500"
            aria-label="Filter by tier"
          >
            <option value={0}>All Tiers</option>
            <option value={1}>Tier 1 Essential</option>
            <option value={2}>Tier 2 High Impact</option>
            <option value={3}>Tier 3 QoL</option>
          </select>
          <select
            value={catFilter}
            onChange={e => setCatFilter(e.target.value)}
            className="px-3 py-2 text-sm rounded-md border bg-white dark:bg-gray-900 dark:border-gray-700 min-h-[44px] focus:ring-2 focus:ring-amber-500"
            aria-label="Filter by type"
          >
            <option value="all">All Types</option>
            <option value="plugin">Plugins</option>
            <option value="skill">Skills</option>
            <option value="mcp">MCP Servers</option>
            <option value="proxy">Proxies</option>
          </select>
        </div>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400">{filtered.length} items found</p>

      {/* Plugin Cards */}
      <div className="space-y-3">
        {filtered.map((plugin, idx) => (
          <motion.div
            key={plugin.id}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ delay: idx * 0.03, ease: customEase }}
          >
            <Card className={`border-l-4 ${tierColors[plugin.tier]} hover:shadow-md transition-shadow rounded-xl`}>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-semibold text-gray-900 dark:text-white">{plugin.name}</h4>
                      <Badge variant="outline" className="text-xs flex items-center gap-1">
                        {catIcons[plugin.category]} {plugin.category.toUpperCase()}
                      </Badge>
                      <Badge className={`text-xs border-0 ${plugin.tier === 1 ? 'bg-amber-500' : plugin.tier === 2 ? 'bg-emerald-500' : 'bg-gray-400'} text-white`}>
                        {tierLabels[plugin.tier]}
                      </Badge>
                    </div>
                    <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{plugin.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-600 dark:text-gray-400">
                      <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {plugin.stars}</span>
                      <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3" /> {plugin.downloads}</span>
                    </div>
                  </div>
                  {plugin.url && (
                    <a
                      href={plugin.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-500 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 rounded"
                      aria-label={`Visit ${plugin.name} external page`}
                    >
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
      <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 border-amber-200 dark:border-amber-800 rounded-xl">
        <CardHeader>
          <CardTitle className="text-amber-800 dark:text-amber-300 flex items-center gap-2 font-bold tracking-tight">
            <Code className="w-5 h-5" /> opencode.json — Above Mediocrity Config
          </CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-xs bg-black/5 dark:bg-white/5 p-4 rounded-lg overflow-x-auto font-mono" aria-label="opencode.json configuration">
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
            <CopyButton text={`curl -fsSL https://opencode.ai/install | bash && npx oh-my-openagent init && npx superpowers init`} label="Install command" />
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
      <SectionHeader
        icon={FolderTree}
        title="Independent Category Subrepos"
        description="Every PDF, script, JSON, markdown gets its own independent category with a dedicated subrepo structure. Each group is self-contained."
      />

      {/* Architecture Overview */}
      <Card className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/10 dark:to-purple-900/10 border-violet-200 dark:border-violet-800 rounded-xl">
        <CardContent className="p-5">
          <h3 className="font-bold tracking-tight text-violet-800 dark:text-violet-300 flex items-center gap-2 mb-3">
            <Layers className="w-5 h-5" /> Subrepo Architecture Pattern
          </h3>
          <pre className="text-xs bg-black/5 dark:bg-white/5 p-4 rounded-lg font-mono overflow-x-auto" aria-label="Subrepo directory structure">
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
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        {CATEGORY_GROUPS.map((cat) => (
          <motion.div key={cat.id} variants={fadeUpItem}>
            <Card
              className={`border-l-4 hover:shadow-md transition-shadow cursor-pointer rounded-xl ${catColors[cat.id]}`}
              onClick={() => setExpandedCat(expandedCat === cat.id ? null : cat.id)}
              role="button"
              tabIndex={0}
              aria-expanded={expandedCat === cat.id}
              aria-label={`${cat.label} — click to ${expandedCat === cat.id ? 'collapse' : 'expand'}`}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setExpandedCat(expandedCat === cat.id ? null : cat.id) } }}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{cat.icon}</span>
                    <div>
                      <CardTitle className="text-base font-bold tracking-tight">{cat.label}</CardTitle>
                      <CardDescription className="text-xs leading-relaxed">{cat.description}</CardDescription>
                    </div>
                  </div>
                  <motion.div animate={{ rotate: expandedCat === cat.id ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
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
                      <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">Example files in this subrepo:</p>
                      <div className="space-y-1.5">
                        {(subrepoExamples[cat.id] || []).map(file => (
                          <div key={file} className="flex items-center gap-2 text-xs p-1.5 rounded bg-white/50 dark:bg-black/20">
                            <FileText className="w-3 h-3 text-gray-500 dark:text-gray-400" />
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
      </motion.div>
    </div>
  )
}

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
      <SectionHeader
        icon={FileText}
        title="File Browser"
        description="Browse and preview the complete inventory of documents, images, research reports, and data files in the AI Agentic Stack knowledge base."
      />

      {/* Filters */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <span className="text-sm text-gray-600 dark:text-gray-400">Category:</span>
          {['all', 'document', 'image', 'research', 'data', 'script'].map(cat => (
            <motion.button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className={`px-3 py-1.5 text-xs rounded-full transition-colors min-h-[36px] cursor-pointer focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 ${
                categoryFilter === cat
                  ? 'bg-amber-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400'
              }`}
              aria-label={`Filter by ${cat === 'all' ? 'all categories' : cat}`}
              aria-pressed={categoryFilter === cat}
            >
              {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </motion.button>
          ))}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-600 dark:text-gray-400">Type:</span>
          {['all', 'pdf', 'png', 'md', 'json'].map(t => (
            <motion.button
              key={t}
              onClick={() => setTypeFilter(t)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className={`px-3 py-1.5 text-xs rounded-full transition-colors min-h-[36px] cursor-pointer focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 ${
                typeFilter === t
                  ? 'bg-violet-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400'
              }`}
              aria-label={`Filter by ${t === 'all' ? 'all types' : t.toUpperCase()}`}
              aria-pressed={typeFilter === t}
            >
              {t === 'all' ? 'All' : t.toUpperCase()}
            </motion.button>
          ))}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400" />
          <Input
            placeholder="Search files by name or description..."
            value={search}
            onChange={e => setSearch(sanitizeSearch(e.target.value))}
            maxLength={200}
            className="pl-10 h-10"
            aria-label="Search files"
          />
        </div>
      </div>

      {/* File Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {filtered.map((file) => (
          <motion.div
            key={file.id}
            variants={fadeUpItem}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="cursor-pointer transform-gpu"
            onClick={() => handleFileClick(file)}
            role="button"
            tabIndex={0}
            aria-label={`Open ${file.name}`}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleFileClick(file) } }}
          >
            <Card className="h-full border-l-4 hover:shadow-lg transition-shadow rounded-xl" style={{ borderLeftColor: categoryColor[file.category] || '#6b7280' }}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{fileTypeIcon(file.type)}</span>
                    <CardTitle className="text-sm line-clamp-1 font-bold tracking-tight">{file.name}</CardTitle>
                  </div>
                  <Badge variant="outline" className="text-xs">{file.type.toUpperCase()}</Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">{file.description}</p>
                {file.preview && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 italic mb-2">{file.preview}</p>
                )}
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>{file.size}</span>
                  <span>{file.date}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
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
                    loading="lazy"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                  />
                </div>
              )}

              {selectedFile.type === 'pdf' && (
                <div className="space-y-3">
                  <div className="p-6 rounded-lg border bg-muted/20 text-center">
                    <span className="text-4xl">📄</span>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">PDF preview requires the file in the public directory.</p>
                  </div>
                  <Button variant="outline" size="sm" asChild className="w-full min-h-[44px]">
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
                      <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Loading markdown...</span>
                    </div>
                  ) : mdContent ? (
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown
                        allowedElements={['p', 'br', 'strong', 'em', 'h1', 'h2', 'h3', 'h4', 'ul', 'ol', 'li', 'code', 'pre', 'a', 'blockquote', 'table', 'thead', 'tbody', 'tr', 'th', 'td']}
                      >
                        {mdContent}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600 dark:text-gray-400 text-center py-4">Click to load preview</p>
                  )}
                </div>
              )}

              {selectedFile.type === 'json' && (
                <pre className="p-4 rounded-lg border bg-gray-50 dark:bg-gray-900 text-xs font-mono overflow-auto max-h-96" aria-label="JSON preview">
                  {'{ "message": "JSON preview — file not yet available in public directory" }'}
                </pre>
              )}

              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" asChild className="min-h-[44px]">
                  <a href={selectedFile.path} target="_blank" rel="noopener noreferrer" download>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild className="min-h-[44px]">
                  <a href={selectedFile.path} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open in New Tab
                  </a>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="min-h-[44px]"
                  onClick={() => {
                    if (!isClipboardAvailable()) {
                      toast.error('Clipboard not available')
                      return
                    }
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
  const [arenaMode, setArenaMode] = useState<'grid' | 'vs'>('grid')
  const [vsLeft, setVsLeft] = useState<string>('owl-orca')
  const [vsRight, setVsRight] = useState<string>('litellm')
  const [disciplineFilter, setDisciplineFilter] = useState<string>('all')
  const [synthesisMode, setSynthesisMode] = useState(false)
  const arenaRef = useRef<HTMLDivElement>(null)
  const counterRef = useRef<HTMLDivElement>(null)

  // GSAP animated counters and stat bars
  useGSAP(() => {
    if (!arenaRef.current) return
    const statBars = arenaRef.current.querySelectorAll('.stat-bar-fill')
    statBars.forEach((bar) => {
      const target = bar.getAttribute('data-width') || '0'
      gsap.fromTo(bar, { width: '0%' }, {
        width: `${target}%`,
        duration: 1.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: arenaRef.current,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      })
    })
  }, { scope: arenaRef })

  // GSAP counter animation
  useGSAP(() => {
    if (!counterRef.current) return
    const counter = counterRef.current.querySelector('.counter-value')
    if (counter) {
      gsap.fromTo(counter, { textContent: '0' }, {
        textContent: '5',
        duration: 2,
        ease: 'power2.out',
        snap: { textContent: 1 },
        scrollTrigger: {
          trigger: counterRef.current,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      })
    }
  }, { scope: counterRef })

  // Stat data for each proxy for the arena
  const proxyStats: Record<string, { label: string; value: number; color: string }[]> = {
    'owl-orca': [
      { label: 'Stream Racing', value: 95, color: '#10b981' },
      { label: 'Protocol Translation', value: 90, color: '#10b981' },
      { label: 'Free Tokens', value: 85, color: '#10b981' },
      { label: 'Setup Ease', value: 95, color: '#10b981' },
      { label: 'Premium Models Free', value: 90, color: '#10b981' },
      { label: 'Circuit Breaking', value: 85, color: '#10b981' },
    ],
    'litellm': [
      { label: 'Stream Racing', value: 30, color: '#3b82f6' },
      { label: 'Protocol Translation', value: 40, color: '#3b82f6' },
      { label: 'Free Tokens', value: 20, color: '#3b82f6' },
      { label: 'Setup Ease', value: 60, color: '#3b82f6' },
      { label: 'Premium Models Free', value: 15, color: '#3b82f6' },
      { label: 'Circuit Breaking', value: 70, color: '#3b82f6' },
    ],
    'openrouter': [
      { label: 'Stream Racing', value: 25, color: '#8b5cf6' },
      { label: 'Protocol Translation', value: 20, color: '#8b5cf6' },
      { label: 'Free Tokens', value: 55, color: '#8b5cf6' },
      { label: 'Setup Ease', value: 90, color: '#8b5cf6' },
      { label: 'Premium Models Free', value: 35, color: '#8b5cf6' },
      { label: 'Circuit Breaking', value: 40, color: '#8b5cf6' },
    ],
    'freellmapi': [
      { label: 'Stream Racing', value: 20, color: '#f59e0b' },
      { label: 'Protocol Translation', value: 15, color: '#f59e0b' },
      { label: 'Free Tokens', value: 90, color: '#f59e0b' },
      { label: 'Setup Ease', value: 50, color: '#f59e0b' },
      { label: 'Premium Models Free', value: 5, color: '#f59e0b' },
      { label: 'Circuit Breaking', value: 35, color: '#f59e0b' },
    ],
  }

  // Radar chart data for SVG
  const radarCapabilities = ['Speed', 'Translation', 'Free Tokens', 'Zero Config', 'Circuit Breaking']
  const radarData: Record<string, number[]> = {
    'owl-orca': [95, 90, 85, 95, 85],
    'litellm': [30, 40, 20, 40, 70],
    'openrouter': [25, 20, 55, 90, 40],
    'freellmapi': [20, 15, 90, 35, 35],
  }

  // Get VS mode comparison data
  const getVsComparison = () => {
    const left = PROXY_COMPARISONS.find(p => p.id === vsLeft)
    const right = PROXY_COMPARISONS.find(p => p.id === vsRight)
    return { left, right }
  }

  const { left: vsLeftData, right: vsRightData } = getVsComparison()

  // Cross-field data with discipline filtering
  const filteredConnections = disciplineFilter === 'all'
    ? CROSS_FIELD_CONNECTIONS
    : CROSS_FIELD_CONNECTIONS

  return (
    <div className="space-y-6">
      <SectionHeader
        icon={BookOpen}
        title="Proxy Stacks — The Deep Comparison"
        description="How OWL-ORCA stands out against LiteLLM, OpenRouter, FreeLLMAPI, and the rest. Analyzed through economics, psychology, and network science."
      />

      {/* Arena Mode Toggle */}
      <div className="flex items-center gap-2">
        <Button
          variant={arenaMode === 'grid' ? 'default' : 'outline'}
          size="sm"
          className="text-xs min-h-[44px] cursor-pointer"
          onClick={() => setArenaMode('grid')}
          aria-label="Grid view"
        >
          <Trophy className="w-3.5 h-3.5 mr-1" /> Arena Grid
        </Button>
        <Button
          variant={arenaMode === 'vs' ? 'default' : 'outline'}
          size="sm"
          className="text-xs min-h-[44px] cursor-pointer"
          onClick={() => setArenaMode('vs')}
          aria-label="VS mode"
        >
          <GitCompare className="w-3.5 h-3.5 mr-1" /> VS Mode
        </Button>
      </div>

      {/* Arena Grid Mode */}
      {arenaMode === 'grid' && (
        <div ref={arenaRef}>
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-4"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            {PROXY_COMPARISONS.map((proxy) => (
              <motion.div key={proxy.id} variants={fadeUpItem}>
                <Card
                  className="border-2 cursor-pointer hover:shadow-lg transition-all h-full rounded-xl"
                  style={{ borderColor: expandedId === proxy.id ? proxy.color : `${proxy.color}40` }}
                  onClick={() => setExpandedId(expandedId === proxy.id ? null : proxy.id)}
                  role="button"
                  tabIndex={0}
                  aria-expanded={expandedId === proxy.id}
                  aria-label={`${proxy.name} — click to ${expandedId === proxy.id ? 'collapse' : 'expand'}`}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setExpandedId(expandedId === proxy.id ? null : proxy.id) } }}
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
                          <CardTitle className="text-base font-bold tracking-tight" style={{ color: proxy.color }}>{proxy.name}</CardTitle>
                          <CardDescription className="text-xs leading-relaxed">{proxy.tagline}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {proxy.openSource && (
                          <Badge variant="outline" className="text-xs border-emerald-400 text-emerald-600 dark:text-emerald-400">OSS</Badge>
                        )}
                        <motion.div animate={{ rotate: expandedId === proxy.id ? 180 : 0 }} transition={{ duration: 0.2 }}>
                          <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        </motion.div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {/* GSAP Animated Stat Bars */}
                    <div className="space-y-2 mb-3">
                      {(proxyStats[proxy.id] || []).map((stat) => (
                        <div key={stat.label}>
                          <div className="flex justify-between text-xs mb-0.5">
                            <span className="text-gray-600 dark:text-gray-400">{stat.label}</span>
                            <span className="font-medium" style={{ color: stat.color }}>{stat.value}%</span>
                          </div>
                          <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                            <div
                              className="stat-bar-fill h-full rounded-full"
                              data-width={stat.value}
                              style={{ backgroundColor: stat.color, width: '0%' }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-1.5 mb-3">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600 dark:text-gray-400">Approach</span>
                        <span className="font-medium text-gray-700 dark:text-gray-300">{proxy.approach}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600 dark:text-gray-400">Free Tokens</span>
                        <span className="font-medium text-gray-700 dark:text-gray-300">{proxy.freeTokens}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600 dark:text-gray-400">Setup</span>
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
                            <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-400">{proxy.architecture}</p>
                          </div>

                          <div className="mb-3">
                            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1.5">Strengths</p>
                            <div className="flex flex-wrap gap-1">
                              {proxy.strengths.map(s => (
                                <Badge key={s} variant="outline" className="text-xs border-emerald-300 text-emerald-700 dark:border-emerald-700 dark:text-emerald-400">{s}</Badge>
                              ))}
                            </div>
                          </div>

                          <div className="mb-4">
                            <p className="text-xs font-semibold text-red-600 dark:text-red-400 mb-1.5">Weaknesses</p>
                            <div className="flex flex-wrap gap-1">
                              {proxy.weaknesses.map(w => (
                                <Badge key={w} variant="outline" className="text-xs border-red-300 text-red-700 dark:border-red-700 dark:text-red-400">{w}</Badge>
                              ))}
                            </div>
                          </div>

                          <Accordion type="multiple" className="w-full">
                            <AccordionItem value="economics">
                              <AccordionTrigger className="text-xs py-2">
                                <span className="flex items-center gap-2">Economics Lens</span>
                              </AccordionTrigger>
                              <AccordionContent>
                                <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-400">{proxy.economics}</p>
                              </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="psychology">
                              <AccordionTrigger className="text-xs py-2">
                                <span className="flex items-center gap-2">Psychology Lens</span>
                              </AccordionTrigger>
                              <AccordionContent>
                                <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-400">{proxy.psychology}</p>
                              </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="network">
                              <AccordionTrigger className="text-xs py-2">
                                <span className="flex items-center gap-2">Network Science Lens</span>
                              </AccordionTrigger>
                              <AccordionContent>
                                <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-400">{proxy.networkScience}</p>
                              </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="history">
                              <AccordionTrigger className="text-xs py-2">
                                <span className="flex items-center gap-2">Historical Parallels</span>
                              </AccordionTrigger>
                              <AccordionContent>
                                <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-400">{proxy.history}</p>
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
          </motion.div>
        </div>
      )}

      {/* VS Mode */}
      {arenaMode === 'vs' && (
        <div className="space-y-4">
          {/* Proxy Selectors */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-3 items-center">
            <div>
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-1" htmlFor="vs-left">Champion A</label>
              <select
                id="vs-left"
                value={vsLeft}
                onChange={(e) => setVsLeft(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 min-h-[44px]"
                aria-label="Select champion A"
              >
                {PROXY_COMPARISONS.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-black text-sm shadow-lg">
                VS
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-1" htmlFor="vs-right">Champion B</label>
              <select
                id="vs-right"
                value={vsRight}
                onChange={(e) => setVsRight(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 min-h-[44px]"
                aria-label="Select champion B"
              >
                {PROXY_COMPARISONS.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* VS Comparison Cards */}
          {vsLeftData && vsRightData && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-2 rounded-xl h-full" style={{ borderColor: vsLeftData.color }}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: vsLeftData.color }} />
                    <CardTitle className="text-base font-bold tracking-tight" style={{ color: vsLeftData.color }}>{vsLeftData.name}</CardTitle>
                    {vsLeftData.openSource && <Badge variant="outline" className="text-xs border-emerald-400 text-emerald-600 dark:text-emerald-400">OSS</Badge>}
                  </div>
                  <CardDescription className="text-xs">{vsLeftData.tagline}</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Stat bars comparison */}
                  <div className="space-y-2 mb-3">
                    {(proxyStats[vsLeft] || []).map((stat) => {
                      const rightStat = proxyStats[vsRight]?.find(s => s.label === stat.label)
                      const isWinning = rightStat ? stat.value >= rightStat.value : true
                      return (
                        <div key={stat.label}>
                          <div className="flex justify-between text-xs mb-0.5">
                            <span className="text-gray-600 dark:text-gray-400">{stat.label}</span>
                            <span className={`font-bold ${isWinning ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400'}`}>
                              {stat.value}{isWinning ? ' ✓' : ''}
                            </span>
                          </div>
                          <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                            <div className="h-full rounded-full transition-all duration-700" style={{ backgroundColor: stat.color, width: `${stat.value}%` }} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {vsLeftData.strengths.slice(0, 3).map(s => (
                      <Badge key={s} variant="outline" className="text-xs border-emerald-300 text-emerald-700 dark:border-emerald-700 dark:text-emerald-400">{s}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card className="border-2 rounded-xl h-full" style={{ borderColor: vsRightData.color }}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: vsRightData.color }} />
                    <CardTitle className="text-base font-bold tracking-tight" style={{ color: vsRightData.color }}>{vsRightData.name}</CardTitle>
                    {vsRightData.openSource && <Badge variant="outline" className="text-xs border-emerald-400 text-emerald-600 dark:text-emerald-400">OSS</Badge>}
                  </div>
                  <CardDescription className="text-xs">{vsRightData.tagline}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-3">
                    {(proxyStats[vsRight] || []).map((stat) => {
                      const leftStat = proxyStats[vsLeft]?.find(s => s.label === stat.label)
                      const isWinning = leftStat ? stat.value >= leftStat.value : true
                      return (
                        <div key={stat.label}>
                          <div className="flex justify-between text-xs mb-0.5">
                            <span className="text-gray-600 dark:text-gray-400">{stat.label}</span>
                            <span className={`font-bold ${isWinning ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400'}`}>
                              {stat.value}{isWinning ? ' ✓' : ''}
                            </span>
                          </div>
                          <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                            <div className="h-full rounded-full transition-all duration-700" style={{ backgroundColor: stat.color, width: `${stat.value}%` }} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {vsRightData.strengths.slice(0, 3).map(s => (
                      <Badge key={s} variant="outline" className="text-xs border-emerald-300 text-emerald-700 dark:border-emerald-700 dark:text-emerald-400">{s}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}

      {/* Standing Out Analysis — Why OWL-ORCA Wins */}
      <div ref={counterRef}>
        <Card className="border-2 border-emerald-300 dark:border-emerald-700 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/10 dark:to-teal-900/10 rounded-xl">
          <CardHeader>
            <CardTitle className="text-emerald-800 dark:text-emerald-300 flex items-center gap-2 font-bold tracking-tight">
              <Sparkles className="w-5 h-5" />
              Standing Out — Why OWL-ORCA Wins the Combination Game
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm leading-relaxed text-emerald-700 dark:text-emerald-400">
                No single proxy wins every category. But <strong className="text-emerald-800 dark:text-emerald-300">OWL-ORCA</strong> is the ONLY proxy that combines all five critical capabilities in one install:
              </p>

              {/* Interactive Radar Chart (SVG) */}
              <div className="flex justify-center">
                <svg viewBox="0 0 300 280" className="w-full max-w-sm h-auto" role="img" aria-label="Radar chart comparing proxy capabilities">
                  {/* Background pentagon rings */}
                  {[20, 40, 60, 80, 100].map((pct) => {
                    const r = (pct / 100) * 100
                    const points = radarCapabilities.map((_, i) => {
                      const angle = (Math.PI * 2 * i) / radarCapabilities.length - Math.PI / 2
                      return `${150 + r * Math.cos(angle)},${120 + r * Math.sin(angle)}`
                    }).join(' ')
                    return <polygon key={pct} points={points} fill="none" stroke="#d1d5db" strokeWidth="0.5" opacity="0.5" />
                  })}

                  {/* Axis lines */}
                  {radarCapabilities.map((cap, i) => {
                    const angle = (Math.PI * 2 * i) / radarCapabilities.length - Math.PI / 2
                    return (
                      <g key={cap}>
                        <line x1="150" y1="120" x2={150 + 100 * Math.cos(angle)} y2={120 + 100 * Math.sin(angle)} stroke="#d1d5db" strokeWidth="0.5" />
                        <text
                          x={150 + 115 * Math.cos(angle)}
                          y={120 + 115 * Math.sin(angle)}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fill="#6b7280"
                          fontSize="9"
                          fontWeight="500"
                        >
                          {cap}
                        </text>
                      </g>
                    )
                  })}

                  {/* OWL-ORCA radar shape */}
                  <polygon
                    points={radarCapabilities.map((_, i) => {
                      const angle = (Math.PI * 2 * i) / radarCapabilities.length - Math.PI / 2
                      const v = radarData['owl-orca'][i] / 100
                      return `${150 + 100 * v * Math.cos(angle)},${120 + 100 * v * Math.sin(angle)}`
                    }).join(' ')}
                    fill="#10b98120"
                    stroke="#10b981"
                    strokeWidth="2"
                  />

                  {/* Other proxy radar shapes */}
                  {['litellm', 'openrouter', 'freellmapi'].map((id) => {
                    const proxy = PROXY_COMPARISONS.find(p => p.id === id)
                    return (
                      <polygon
                        key={id}
                        points={radarCapabilities.map((_, i) => {
                          const angle = (Math.PI * 2 * i) / radarCapabilities.length - Math.PI / 2
                          const v = radarData[id][i] / 100
                          return `${150 + 100 * v * Math.cos(angle)},${120 + 100 * v * Math.sin(angle)}`
                        }).join(' ')}
                        fill="none"
                        stroke={proxy?.color || '#999'}
                        strokeWidth="1"
                        strokeDasharray="4 2"
                        opacity="0.6"
                      />
                    )
                  })}

                  {/* Legend */}
                  <g transform="translate(30, 245)">
                    {PROXY_COMPARISONS.map((p, i) => (
                      <g key={p.id} transform={`translate(0, ${i * 14})`}>
                        <rect x="0" y="0" width="10" height="10" rx="2" fill={p.color} opacity={p.id === 'owl-orca' ? 0.8 : 0.5} />
                        <text x="15" y="8" fontSize="8" fill="#6b7280">{p.name}</text>
                      </g>
                    ))}
                  </g>
                </svg>
              </div>

              {/* GSAP animated counter */}
              <div className="p-4 rounded-lg bg-emerald-100/50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-center">
                <div className="flex items-center justify-center gap-2">
                  <span className="counter-value text-3xl font-black text-emerald-600 dark:text-emerald-400">0</span>
                  <span className="text-lg font-bold text-emerald-700 dark:text-emerald-300">capabilities</span>
                </div>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                  <strong>0 competitors with all 5.</strong> Stream Racing + Protocol Translation + Premium Free + Zero-Config + Circuit Breaking
                </p>
              </div>

              {/* Capability grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { label: 'Stream Racing', desc: 'Parallel requests across providers — fastest wins' },
                  { label: 'Protocol Translation', desc: 'Copilot/Antigravity → OpenAI format on-the-fly' },
                  { label: 'Premium Models Free', desc: 'AWS Builder ID gives Claude Sonnet 4.5 at $0' },
                  { label: 'Zero-Config for OpenCode', desc: 'Auto-injected by install.sh — no manual setup' },
                  { label: 'Circuit Breaking', desc: 'Prevents cascading failures across providers' },
                ].map(item => (
                  <motion.div
                    key={item.label}
                    whileHover={{ x: 4, backgroundColor: 'rgba(16, 185, 129, 0.08)' }}
                    whileTap={{ scale: 0.98 }}
                    className="p-2.5 rounded-lg bg-emerald-100/50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 cursor-default"
                  >
                    <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">{item.label}</span>
                    <p className="text-xs leading-relaxed text-emerald-600 dark:text-emerald-400 mt-0.5">{item.desc}</p>
                  </motion.div>
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
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Wins: {item.win}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cross-Field Deep Dive */}
      <Card className="relative overflow-hidden rounded-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-violet-500/5 pointer-events-none" />
        <CardHeader className="relative">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg font-bold tracking-tight">
              <Cpu className="w-5 h-5 text-emerald-500" />
              Elephant Memory — Cross-Field Deep Dive
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300">
                Cross-Field Connections
              </Badge>
              <Button
                variant={synthesisMode ? 'default' : 'outline'}
                size="sm"
                className="text-xs min-h-[44px] cursor-pointer"
                onClick={() => setSynthesisMode(!synthesisMode)}
                aria-label={synthesisMode ? 'Exit synthesis mode' : 'Enter synthesis mode'}
              >
                <Cpu className="w-3 h-3 mr-1" />
                {synthesisMode ? 'Exit Synthesis' : 'Synthesis Mode'}
              </Button>
            </div>
          </div>
          <CardDescription className="text-sm leading-relaxed">
            4 proxy stacks analyzed across 4 disciplines — knowledge synthesis, interdisciplinary bridging, and pattern transfer
          </CardDescription>
        </CardHeader>
        <CardContent className="relative">
          {/* Discipline filter tabs */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Button
              variant={disciplineFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              className="text-xs min-h-[44px] cursor-pointer"
              onClick={() => setDisciplineFilter('all')}
              aria-label="Show all disciplines"
            >
              All
            </Button>
            {CROSS_FIELD_DIMENSIONS.map((dim) => {
              const DimIconMap: Record<string, ElementType> = {
                TrendingUp, Users, Globe, BookOpen,
              }
              const DimIcon = DimIconMap[dim.icon]
              return (
                <Button
                  key={dim.id}
                  variant={disciplineFilter === dim.id ? 'default' : 'outline'}
                  size="sm"
                  className="text-xs min-h-[44px] cursor-pointer"
                  onClick={() => setDisciplineFilter(dim.id)}
                  aria-label={`Filter by ${dim.label}`}
                  style={disciplineFilter === dim.id ? { backgroundColor: dim.color, borderColor: dim.color } : undefined}
                >
                  {DimIcon && <DimIcon className="w-3 h-3 mr-1" />}
                  {dim.label}
                </Button>
              )
            })}
          </div>

          {/* Cross-field matrix */}
          <div className="overflow-x-auto -mx-1">
            <table className="w-full text-xs border-collapse min-w-[540px]" role="table">
              <thead>
                <tr>
                  <th className="text-left p-2 font-semibold text-gray-600 dark:text-gray-400 w-24" scope="col">Proxy</th>
                  {CROSS_FIELD_DIMENSIONS
                    .filter(dim => disciplineFilter === 'all' || dim.id === disciplineFilter)
                    .map(dim => (
                      <th key={dim.id} className="text-left p-2 font-semibold" style={{ color: dim.color }} scope="col">
                        {dim.label}
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {filteredConnections.map((entry, idx) => (
                  <motion.tr
                    key={entry.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.08, duration: 0.3, ease: customEase }}
                    className={`group border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${synthesisMode && entry.id !== 'owl-orca' ? 'opacity-40' : ''}`}
                  >
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: entry.proxyColor }}
                        />
                        <span className="font-semibold text-gray-900 dark:text-white whitespace-nowrap">{entry.proxy}</span>
                      </div>
                    </td>
                    {disciplineFilter === 'all' && (
                      <>
                        <td className="p-2">
                          <span className="font-medium text-emerald-700 dark:text-emerald-300">{entry.economicsShort}</span>
                        </td>
                        <td className="p-2">
                          <span className="font-medium text-violet-700 dark:text-violet-300">{entry.psychologyShort}</span>
                        </td>
                        <td className="p-2">
                          <span className="font-medium text-cyan-700 dark:text-cyan-300">{entry.networkScienceShort}</span>
                        </td>
                        <td className="p-2">
                          <span className="font-medium text-amber-700 dark:text-amber-300">{entry.historyShort}</span>
                        </td>
                      </>
                    )}
                    {disciplineFilter !== 'all' && CROSS_FIELD_DIMENSIONS
                      .filter(dim => dim.id === disciplineFilter)
                      .map(dim => (
                        <td key={dim.id} className="p-2">
                          <span className="font-medium" style={{ color: dim.color }}>
                            {(entry as unknown as Record<string, string>)[`${dim.id}Short`]}
                          </span>
                        </td>
                      ))}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Synthesis Mode Highlight */}
          {synthesisMode && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 rounded-lg bg-gradient-to-r from-emerald-50 via-violet-50 to-amber-50 dark:from-emerald-900/20 dark:via-violet-900/20 dark:to-amber-900/20 border border-emerald-300 dark:border-emerald-700"
            >
              <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300 mb-2 flex items-center gap-2">
                <Cpu className="w-4 h-4" /> Synthesis Pattern Detected
              </p>
              <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-400">
                <strong className="text-emerald-700 dark:text-emerald-400">OWL-ORCA</strong> maps to the <strong>arbitrage-BGP-exchange</strong> convergence — the only proxy occupying the intersection of speed racing (HFT), protocol translation (BGP), and market making (exchange). All other proxies occupy single archetypes: <strong className="text-violet-600 dark:text-violet-400">LiteLLM</strong> = translator, <strong className="text-purple-600 dark:text-purple-400">OpenRouter</strong> = marketplace, <strong className="text-amber-600 dark:text-amber-400">FreeLLMAPI</strong> = commons.
              </p>
            </motion.div>
          )}

          {/* Expandable detail rows */}
          <div className="mt-3 space-y-2">
            {CROSS_FIELD_CONNECTIONS.map((entry) => (
              <details key={entry.id} className="group/details">
                <summary className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer text-xs font-medium text-gray-700 dark:text-gray-300 transition-colors list-none min-h-[44px] focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 rounded-lg">
                  <ChevronRight className="w-3 h-3 transition-transform group-open/details:rotate-90" style={{ color: entry.proxyColor }} />
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.proxyColor }} />
                  <span style={{ color: entry.proxyColor }}>{entry.proxy}</span>
                  <span className="text-gray-500 dark:text-gray-400">— expand cross-field analysis</span>
                </summary>
                <div className="ml-5 mt-1 space-y-2 pb-2">
                  {CROSS_FIELD_DIMENSIONS
                    .filter(dim => disciplineFilter === 'all' || dim.id === disciplineFilter)
                    .map(dim => (
                      <div key={dim.id} className="flex items-start gap-2 p-2 rounded-lg border" style={{ borderColor: `${dim.color}20`, backgroundColor: `${dim.color}05` }}>
                        <div className="shrink-0 mt-0.5">
                          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: dim.color }} />
                        </div>
                        <div>
                          <p className="font-semibold text-xs" style={{ color: dim.color }}>{dim.label}</p>
                          <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-400 mt-0.5">{(entry as unknown as Record<string, string>)[dim.id]}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </details>
            ))}
          </div>

          {/* Bottom interconnection summary */}
          <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-emerald-50 via-violet-50 to-amber-50 dark:from-emerald-900/10 dark:via-violet-900/10 dark:to-amber-900/10 border border-emerald-200 dark:border-emerald-800/30">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
              <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-400 text-center sm:text-left">
                <strong className="text-gray-900 dark:text-white">Cross-field pattern:</strong> Each proxy maps to a distinct archetype across all 4 disciplines — OWL-ORCA is the <span className="text-emerald-600 dark:text-emerald-400 font-medium">arbitrage-BGP-exchange</span> convergence, while others occupy <span className="text-violet-600 dark:text-violet-400 font-medium">translator</span>, <span className="text-purple-600 dark:text-purple-400 font-medium">marketplace</span>, or <span className="text-amber-600 dark:text-amber-400 font-medium">commons</span> archetypes.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ==================== DATA FLOW SCHEMATIC (GSAP) ====================

function DataFlowSchematic() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeNode, setActiveNode] = useState<string | null>(null)

  useGSAP(() => {
    if (!containerRef.current) return

    // Animate SVG paths drawing themselves
    const paths = containerRef.current.querySelectorAll('.schematic-path')
    paths.forEach((path) => {
      const svgPath = path as SVGPathElement
      const length = svgPath.getTotalLength()
      gsap.set(svgPath, { strokeDasharray: length, strokeDashoffset: length })
      gsap.to(svgPath, {
        strokeDashoffset: 0,
        duration: 1.8,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
        },
      })
    })

    // Animate data particles along paths
    const particles = containerRef.current.querySelectorAll('.data-particle')
    particles.forEach((particle, i) => {
      gsap.to(particle, {
        motionPath: {
          path: `#flow-path-${i % 3}`,
          align: `#flow-path-${i % 3}`,
          alignOrigin: [0.5, 0.5],
        },
        duration: 3 + i * 0.5,
        repeat: -1,
        ease: 'none',
        delay: i * 0.8,
      })
    })

    // Staggered reveal for nodes
    const nodes = containerRef.current.querySelectorAll('.schematic-node')
    gsap.fromTo(
      nodes,
      { scale: 0, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        stagger: 0.15,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      }
    )
  }, { scope: containerRef })

  const nodes = [
    { id: 'user', label: 'User / ADE', x: 50, y: 30, color: '#f59e0b', icon: '👤' },
    { id: 'silent', label: 'Silent Protocol', x: 250, y: 30, color: '#8b5cf6', icon: '🔒' },
    { id: 'orca', label: 'OWL-ORCA Proxy', x: 450, y: 30, color: '#10b981', icon: '🐋' },
    { id: 'copilot', label: 'Copilot Free', x: 350, y: 110, color: '#06b6d4', icon: '🆓' },
    { id: 'antigravity', label: 'Antigravity Free', x: 550, y: 110, color: '#3b82f6', icon: '🆓' },
    { id: 'aws', label: 'AWS Builder ID', x: 450, y: 110, color: '#f59e0b', icon: '⭐' },
  ]

  return (
    <div ref={containerRef} className="w-full">
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-4 sm:p-6 overflow-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 opacity-10" aria-hidden="true">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-gray-400" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <svg viewBox="0 0 600 150" className="w-full h-auto relative z-10" role="img" aria-label="Data flow schematic showing the path from User through OWL-ORCA to cloud providers">
          {/* Flow paths */}
          <path id="flow-path-0" className="schematic-path" d="M 90 45 L 210 45" fill="none" stroke="#f59e0b" strokeWidth="2" opacity="0.7" />
          <path id="flow-path-1" className="schematic-path" d="M 290 45 L 410 45" fill="none" stroke="#8b5cf6" strokeWidth="2" opacity="0.7" />
          <path id="flow-path-2" className="schematic-path" d="M 490 55 Q 490 80 490 95" fill="none" stroke="#10b981" strokeWidth="2" opacity="0.7" />
          <path id="flow-path-2b" className="schematic-path" d="M 450 55 Q 390 80 350 95" fill="none" stroke="#10b981" strokeWidth="2" opacity="0.5" />
          <path id="flow-path-2c" className="schematic-path" d="M 530 55 Q 550 80 550 95" fill="none" stroke="#10b981" strokeWidth="2" opacity="0.5" />

          {/* Data particles */}
          {[0, 1, 2, 3, 4].map((i) => (
            <circle key={i} className="data-particle" r="3" fill="#10b981" opacity="0.8">
              <animate attributeName="opacity" values="0.4;1;0.4" dur="1.5s" repeatCount="indefinite" begin={`${i * 0.3}s`} />
            </circle>
          ))}

          {/* Nodes */}
          {nodes.map((node) => (
            <g
              key={node.id}
              className="schematic-node cursor-pointer"
              onClick={() => setActiveNode(activeNode === node.id ? null : node.id)}
              role="button"
              tabIndex={0}
              aria-label={`${node.label} node`}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActiveNode(activeNode === node.id ? null : node.id) } }}
            >
              {/* Node glow on hover/active */}
              <circle
                cx={node.x}
                cy={node.y}
                r={activeNode === node.id ? 32 : 28}
                fill={activeNode === node.id ? `${node.color}20` : `${node.color}10`}
                stroke={node.color}
                strokeWidth={activeNode === node.id ? 2 : 1}
                className="transition-all duration-300"
              />
              <text
                x={node.x}
                y={node.y - 2}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="16"
              >
                {node.icon}
              </text>
              <text
                x={node.x}
                y={node.y + 16}
                textAnchor="middle"
                fill={node.color}
                fontSize="7"
                fontWeight="bold"
              >
                {node.label}
              </text>
            </g>
          ))}
        </svg>

        {/* Active node detail */}
        <AnimatePresence>
          {activeNode && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mt-3 p-3 rounded-lg border border-gray-700 bg-gray-800/80 backdrop-blur"
            >
              {(() => {
                const nodeData: Record<string, { label: string; desc: string; color: string }> = {
                  user: { label: 'User / ADE', desc: 'Any OpenAI-compatible AI Development Environment (OpenCode, Goose, Aider, etc.) sends requests to the proxy.', color: '#f59e0b' },
                  silent: { label: 'Silent Protocol', desc: 'Protocol translation layer — converts Copilot/Antigravity formats to standard OpenAI API on-the-fly.', color: '#8b5cf6' },
                  orca: { label: 'OWL-ORCA Proxy', desc: '3 local endpoints: Orca Router (:60001) for stream racing, Kiro Gateway (:8333) for premium models, Forward Proxy (:60000) for domain bypass.', color: '#10b981' },
                  copilot: { label: 'GitHub Copilot Free', desc: 'Free-tier access to GPT-4o and Claude 3.5 Sonnet via owl-token auth.', color: '#06b6d4' },
                  antigravity: { label: 'Antigravity Free', desc: 'Free-tier access to GPT-4o-mini and Gemini Flash models.', color: '#3b82f6' },
                  aws: { label: 'AWS Builder ID (Kiro)', desc: 'Premium models free — Claude Sonnet 4.5 and DeepSeek 3.2 via AWS Builder ID.', color: '#f59e0b' },
                }
                const n = nodeData[activeNode]
                return n ? (
                  <div>
                    <p className="font-bold text-sm" style={{ color: n.color }}>{n.label}</p>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">{n.desc}</p>
                  </div>
                ) : null
              })()}
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-xs text-gray-500 text-center mt-3 relative z-10">Click any node for details • Paths animate on scroll</p>
      </div>
    </div>
  )
}

// ==================== RESEARCH HUB SECTION ====================

function ResearchHubSection({ onNavigate }: { onNavigate: (section: string) => void }) {
  const [selectedDoc, setSelectedDoc] = useState<ResearchDocument | null>(null)
  const [expandedFinding, setExpandedFinding] = useState<string | null>(null)
  const [expandedTier, setExpandedTier] = useState<number | null>(null)
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)
  const heroRef = useRef<HTMLDivElement>(null)

  const safeNavigate = useCallback((target: string) => {
    if (VALID_SECTIONS.includes(target as typeof VALID_SECTIONS[number])) {
      onNavigate(target)
    }
  }, [onNavigate])

  // GSAP parallax for hero
  useGSAP(() => {
    if (!heroRef.current) return
    gsap.to(heroRef.current.querySelector('.hero-bg'), {
      y: -40,
      ease: 'none',
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      },
    })
  }, { scope: heroRef })

  // Category color map
  const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
    research: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-300', border: 'border-amber-300 dark:border-amber-700' },
    tools: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-300 dark:border-emerald-700' },
    comparison: { bg: 'bg-violet-100 dark:bg-violet-900/30', text: 'text-violet-700 dark:text-violet-300', border: 'border-violet-300 dark:border-violet-700' },
    architecture: { bg: 'bg-cyan-100 dark:bg-cyan-900/30', text: 'text-cyan-700 dark:text-cyan-300', border: 'border-cyan-300 dark:border-cyan-700' },
  }

  const tierColors: Record<number, { bg: string; text: string; badge: string; border: string }> = {
    1: { bg: 'bg-amber-50 dark:bg-amber-900/10', text: 'text-amber-800 dark:text-amber-300', badge: 'bg-amber-500 text-white', border: 'border-amber-200 dark:border-amber-800' },
    2: { bg: 'bg-emerald-50 dark:bg-emerald-900/10', text: 'text-emerald-800 dark:text-emerald-300', badge: 'bg-emerald-500 text-white', border: 'border-emerald-200 dark:border-emerald-800' },
    3: { bg: 'bg-gray-50 dark:bg-gray-900/10', text: 'text-gray-700 dark:text-gray-300', badge: 'bg-gray-500 text-white', border: 'border-gray-200 dark:border-gray-800' },
  }

  // File gallery images
  const galleryImages = FILE_INVENTORY.filter(f => f.type === 'png').map(f => ({ id: f.id, name: f.name, path: f.path }))
  const pdfFile = FILE_INVENTORY.find(f => f.type === 'pdf')

  return (
    <div className="space-y-6">
      {/* Hero with GSAP parallax */}
      <div ref={heroRef} className="relative overflow-hidden rounded-2xl">
        <div className="hero-bg absolute inset-0 bg-gradient-to-br from-emerald-900 via-teal-800 to-cyan-900 opacity-90" />
        <div className="hero-bg absolute inset-0 opacity-20" aria-hidden="true">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="hero-dots" width="30" height="30" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="white" opacity="0.3" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hero-dots)" />
          </svg>
        </div>
        <div className="relative z-10 p-6 sm:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-xl bg-white/10 backdrop-blur">
                <Microscope className="w-6 h-6 text-emerald-300" />
              </div>
              <Badge className="bg-emerald-500/20 text-emerald-200 border-emerald-400/30 backdrop-blur">4 Research Documents</Badge>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Research Hub</h2>
            <p className="text-emerald-200/80 mt-2 max-w-2xl leading-relaxed">
              Deep-dive reports covering enhancement tools, agentic development, variant comparisons, and animation architecture — all with interactive analysis.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Document Cards */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-4"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
      >
        {RESEARCH_DOCUMENTS.map((doc) => {
          const catStyle = categoryColors[doc.category]
          return (
            <motion.div key={doc.id} variants={fadeUpItem}>
              <Card className="h-full hover:shadow-lg transition-shadow rounded-xl">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <Badge className={`${catStyle.bg} ${catStyle.text} ${catStyle.border} border text-xs`}>
                      {doc.category}
                    </Badge>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{doc.size} • {doc.date}</span>
                  </div>
                  <CardTitle className="text-base font-bold tracking-tight mt-2 text-gray-900 dark:text-white">
                    {doc.title}
                  </CardTitle>
                  <CardDescription className="text-xs leading-relaxed">{doc.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  {/* Section breakdown */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {doc.sections.map((sec) => (
                      <div
                        key={sec.id}
                        className="flex items-center gap-1 px-2 py-1 rounded-md bg-muted/50 text-xs"
                        title={sec.summary}
                      >
                        <span>{sec.icon}</span>
                        <span className="text-gray-700 dark:text-gray-300 font-medium">{sec.title}</span>
                        {sec.itemCount && (
                          <span className="text-gray-500 dark:text-gray-400">({sec.itemCount})</span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Key findings - expandable */}
                  <div className="space-y-1.5 mb-3">
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Key Findings</p>
                    {doc.keyFindings.slice(0, expandedFinding === doc.id ? undefined : 3).map((finding, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="flex items-start gap-2 text-xs leading-relaxed"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                        <span className="text-gray-600 dark:text-gray-400">{finding}</span>
                      </motion.div>
                    ))}
                    {doc.keyFindings.length > 3 && (
                      <button
                        onClick={() => setExpandedFinding(expandedFinding === doc.id ? null : doc.id)}
                        className="text-xs font-medium text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 min-h-[44px] flex items-center cursor-pointer focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 rounded"
                        aria-label={expandedFinding === doc.id ? 'Show fewer findings' : `Show all ${doc.keyFindings.length} findings`}
                      >
                        {expandedFinding === doc.id ? '← Show less' : `+${doc.keyFindings.length - 3} more findings`}
                      </button>
                    )}
                  </div>

                  {/* Image previews */}
                  {doc.imagePreviews.length > 0 && (
                    <div className="flex gap-2 mb-3">
                      {doc.imagePreviews.map((imgPath, idx) => (
                        <button
                          key={idx}
                          onClick={() => setLightboxImage(imgPath)}
                          className="relative w-16 h-12 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-amber-400 dark:hover:border-amber-500 transition-colors cursor-pointer focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 min-h-[44px]"
                          aria-label={`Preview image ${idx + 1}`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={imgPath} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Read Full Report */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs min-h-[44px] cursor-pointer"
                    onClick={() => setSelectedDoc(doc)}
                    aria-label={`Read full report: ${doc.title}`}
                  >
                    <BookMarked className="w-3.5 h-3.5 mr-1.5" />
                    Read Full Report
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Above Mediocrity Stack Visualization */}
      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-bold tracking-tight">
            <FlaskConical className="w-5 h-5 text-amber-500" />
            Above Mediocrity Stack — Tiered Enhancement Diagram
          </CardTitle>
          <CardDescription className="text-sm leading-relaxed">
            The curated 3-tier enhancement stack — click a tier to expand
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {RESEARCH_DOCUMENTS[0].tierHighlights?.map(({ tier, items }) => {
              const style = tierColors[tier]
              const isExpanded = expandedTier === tier
              return (
                <motion.div
                  key={tier}
                  layout
                  className={`rounded-xl border-2 ${style.border} ${style.bg} overflow-hidden`}
                >
                  <button
                    onClick={() => setExpandedTier(isExpanded ? null : tier)}
                    className="w-full p-4 flex items-center justify-between cursor-pointer min-h-[44px] focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 rounded-xl"
                    aria-expanded={isExpanded}
                    aria-label={`Tier ${tier} — click to ${isExpanded ? 'collapse' : 'expand'}`}
                  >
                    <div className="flex items-center gap-3">
                      <Badge className={`${style.badge} text-xs border-0`}>Tier {tier}</Badge>
                      <span className={`text-sm font-bold ${style.text}`}>
                        {tier === 1 ? 'Essential — Install First' : tier === 2 ? 'High Impact' : 'Quality of Life'}
                      </span>
                    </div>
                    <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 flex flex-wrap gap-2">
                          {items.map((item, i) => (
                            <motion.div
                              key={item}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: i * 0.06, type: 'spring', stiffness: 300, damping: 25 }}
                            >
                              <Badge variant="secondary" className="text-xs py-1 px-3">{item}</Badge>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Schematic Diagram */}
      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-bold tracking-tight">
            <Waypoints className="w-5 h-5 text-emerald-500" />
            Data Flow Schematic
          </CardTitle>
          <CardDescription className="text-sm leading-relaxed">
            Interactive SVG showing the complete data flow from User → Silent Protocol → OWL-ORCA Proxy → Cloud Providers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataFlowSchematic />
        </CardContent>
      </Card>

      {/* File Gallery */}
      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-bold tracking-tight">
            <BarChart3 className="w-5 h-5 text-violet-500" />
            File Gallery — Images & Documents
          </CardTitle>
          <CardDescription className="text-sm leading-relaxed">
            {galleryImages.length} images and {pdfFile ? '1 PDF document' : '0 PDFs'} — click to preview
          </CardDescription>
        </CardHeader>
        <CardContent>
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {galleryImages.map((img) => (
              <motion.div
                key={img.id}
                variants={scaleIn}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setLightboxImage(img.path)}
                className="p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 cursor-pointer hover:border-amber-400 dark:hover:border-amber-500 transition-colors min-h-[44px] focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                role="button"
                tabIndex={0}
                aria-label={`Preview ${img.name}`}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setLightboxImage(img.path) } }}
              >
                <div className="w-full aspect-video rounded-lg bg-muted/30 flex items-center justify-center mb-2">
                  <Eye className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-xs font-medium text-gray-900 dark:text-white truncate">{img.name}</p>
              </motion.div>
            ))}
            {pdfFile && (
              <motion.div
                variants={scaleIn}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="p-3 rounded-xl border-2 border-dashed border-amber-300 dark:border-amber-700 bg-amber-50/50 dark:bg-amber-900/10 cursor-pointer hover:border-amber-500 dark:hover:border-amber-500 transition-colors min-h-[44px] focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                role="button"
                tabIndex={0}
                aria-label={`Download ${pdfFile.name}`}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); window.open(pdfFile.path, '_blank') } }}
                onClick={() => window.open(pdfFile.path, '_blank')}
              >
                <div className="w-full aspect-video rounded-lg bg-amber-100/50 dark:bg-amber-900/20 flex items-center justify-center mb-2">
                  <Download className="w-5 h-5 text-amber-500" />
                </div>
                <p className="text-xs font-medium text-amber-800 dark:text-amber-300 truncate">{pdfFile.name}</p>
                <p className="text-xs text-amber-600 dark:text-amber-400">PDF • {pdfFile.size}</p>
              </motion.div>
            )}
          </motion.div>
        </CardContent>
      </Card>

      {/* Document Dialog */}
      <Dialog open={!!selectedDoc} onOpenChange={(open) => { if (!open) setSelectedDoc(null) }}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookMarked className="w-5 h-5 text-amber-500" />
              {selectedDoc?.title}
            </DialogTitle>
            <DialogDescription className="text-sm leading-relaxed">
              {selectedDoc?.longDescription}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            {/* Stats row */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-xs">{selectedDoc?.category}</Badge>
              <Badge variant="outline" className="text-xs">{selectedDoc?.size}</Badge>
              <Badge variant="outline" className="text-xs">{selectedDoc?.date}</Badge>
              <Badge variant="outline" className="text-xs">{selectedDoc?.sections.length} sections</Badge>
            </div>

            {/* Sections list */}
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Sections</p>
              {selectedDoc?.sections.map((sec) => (
                <div key={sec.id} className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
                  <span className="text-base">{sec.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-900 dark:text-white">{sec.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{sec.summary}</p>
                  </div>
                  {sec.itemCount && (
                    <Badge variant="secondary" className="text-xs">{sec.itemCount}</Badge>
                  )}
                </div>
              ))}
            </div>

            {/* Key findings */}
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Key Findings</p>
              {selectedDoc?.keyFindings.map((finding, idx) => (
                <div key={idx} className="flex items-start gap-2 p-2 rounded-lg border border-gray-100 dark:border-gray-800">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0">
                    {idx + 1}
                  </div>
                  <span className="text-xs leading-relaxed text-gray-600 dark:text-gray-400">{finding}</span>
                </div>
              ))}
            </div>

            {/* Tier highlights if present */}
            {selectedDoc?.tierHighlights && (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Tier Highlights</p>
                {selectedDoc.tierHighlights.map(({ tier, items }) => (
                  <div key={tier} className="p-3 rounded-lg border">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={`text-xs border-0 ${tier === 1 ? 'bg-amber-500' : tier === 2 ? 'bg-emerald-500' : 'bg-gray-400'} text-white`}>
                        Tier {tier}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {items.map(item => (
                        <Badge key={item} variant="secondary" className="text-xs">{item}</Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-2 pt-2">
              <Button
                variant="default"
                size="sm"
                className="min-h-[44px] cursor-pointer"
                onClick={() => { if (selectedDoc) window.open(selectedDoc.path, '_blank') }}
                aria-label={`Open ${selectedDoc?.filename}`}
              >
                <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                Open {selectedDoc?.filename}
              </Button>
              <Button variant="outline" size="sm" className="min-h-[44px] cursor-pointer" onClick={() => setSelectedDoc(null)}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Lightbox Dialog */}
      <Dialog open={!!lightboxImage} onOpenChange={(open) => { if (!open) setLightboxImage(null) }}>
        <DialogContent className="max-w-3xl p-2">
          <DialogHeader>
            <DialogTitle className="text-sm">Image Preview</DialogTitle>
            <DialogDescription className="text-xs text-gray-500 dark:text-gray-400">Click Open in New Tab to view the full-size image</DialogDescription>
          </DialogHeader>
          <div className="relative w-full rounded-lg bg-muted/30 flex items-center justify-center overflow-hidden" style={{ minHeight: '300px' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lightboxImage ?? undefined}
              alt="Image preview"
              className="max-w-full max-h-[60vh] object-contain rounded"
            />
          </div>
          <div className="flex justify-end gap-2 mt-2">
            <Button
              variant="outline"
              size="sm"
              className="min-h-[44px] cursor-pointer"
              onClick={() => { if (lightboxImage) window.open(lightboxImage, '_blank') }}
            >
              <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
              Open in New Tab
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ==================== DASHBOARD SECTION ====================

function DashboardSection({ onNavigate }: { onNavigate: (section: string) => void }) {
  const dashRef = useRef(null)
  const dashInView = useInView(dashRef, { once: true, margin: '-80px' })

  // Safe navigation that validates the target section
  const safeNavigate = useCallback((target: string) => {
    if (VALID_SECTIONS.includes(target as typeof VALID_SECTIONS[number])) {
      onNavigate(target)
    }
  }, [onNavigate])

  return (
    <div className="space-y-6">
      {/* Hero Stats */}
      <motion.div
        ref={dashRef}
        variants={staggerContainer}
        initial="hidden"
        animate={dashInView ? 'visible' : 'hidden'}
        className="grid grid-cols-2 sm:grid-cols-4 gap-4"
      >
        {[
          { label: 'Architecture Layers', value: '7', sub: 'Full-stack proxy', icon: Layers, color: 'text-amber-500' },
          { label: 'ADE Tools', value: '20+', sub: 'OpenAI-compatible', icon: Terminal, color: 'text-emerald-500' },
          { label: 'Plugins', value: '15', sub: 'Tiered by impact', icon: Puzzle, color: 'text-violet-500' },
          { label: 'Free Tokens', value: '~2B/mo', sub: 'Pooled free tiers', icon: Gift, color: 'text-cyan-500' },
        ].map(stat => (
          <motion.div key={stat.label} variants={fadeUpItem}>
            <Card className="hover:shadow-md transition-shadow rounded-xl h-full">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{stat.label}</span>
                </div>
                <p className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">{stat.value}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{stat.sub}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Access */}
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-4 gap-3"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
      >
        {[
          { title: 'Research Hub', desc: 'Reports & documentation', gradient: 'from-emerald-400 to-cyan-500', emoji: '📚', target: 'research' },
          { title: 'Architecture', desc: '7-layer stack view', gradient: 'from-amber-400 to-orange-500', emoji: '🏗️', target: 'architecture' },
          { title: 'Proxy Arena', desc: 'Compare proxy stacks', gradient: 'from-violet-400 to-purple-500', emoji: '⚔️', target: 'topics' },
          { title: 'Blueprint', desc: 'Setup guide', gradient: 'from-cyan-400 to-blue-500', emoji: '📋', target: 'blueprint' },
        ].map(item => (
          <motion.div key={item.title} variants={fadeUpItem}>
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => safeNavigate(item.target)}
              className="w-full p-4 rounded-xl bg-gradient-to-br text-white text-left shadow-sm hover:shadow-md transition-shadow cursor-pointer min-h-[44px] focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
              style={{ backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }}
              aria-label={`Navigate to ${item.title}`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} rounded-xl`} />
              <div className="relative">
                <span className="text-2xl">{item.emoji}</span>
                <p className="text-sm font-bold mt-1">{item.title}</p>
                <p className="text-xs opacity-80">{item.desc}</p>
              </div>
            </motion.button>
          </motion.div>
        ))}
      </motion.div>

      {/* Standing Out Card */}
      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-bold tracking-tight">
            <Sparkles className="w-5 h-5 text-amber-500" />
            Standing Out — 5 Unique Capabilities
          </CardTitle>
          <CardDescription className="text-sm leading-relaxed">
            Capabilities no competitor offers all five in one install
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {STANDING_OUT_CAPABILITIES.map((cap) => {
              const IconMap: Record<string, ElementType> = {
                Zap, ArrowRight, Shield, Terminal, Globe,
              }
              const IconComponent = IconMap[cap.icon]
              return (
                <motion.div
                  key={cap.id}
                  whileHover={{ x: 4, backgroundColor: 'rgba(0, 0, 0, 0.02)' }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-start gap-3 p-3 rounded-lg border hover:shadow-sm transition-shadow cursor-default"
                  style={{ borderLeftWidth: '3px', borderLeftColor: cap.color }}
                >
                  {/* Icon badge */}
                  <div
                    className="shrink-0 p-2 rounded-lg"
                    style={{ backgroundColor: `${cap.color}15` }}
                  >
                    {IconComponent && (
                      <IconComponent className="w-4 h-4" style={{ color: cap.color }} />
                    )}
                  </div>

                  {/* Text content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-sm text-gray-900 dark:text-white">{cap.title}</p>
                      <span className="text-xs font-medium px-1.5 py-0.5 rounded-full" style={{ backgroundColor: `${cap.color}15`, color: cap.color }}>
                        {cap.headline}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-400 mt-0.5">{cap.description}</p>
                  </div>

                  {/* Interconnected navigation link */}
                  <motion.button
                    whileHover={{ x: 3 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => safeNavigate(cap.linkTo)}
                    className="shrink-0 flex items-center gap-1 text-xs font-medium text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors mt-1 whitespace-nowrap min-h-[44px] min-w-[44px] justify-end cursor-pointer focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 rounded"
                    aria-label={`${cap.linkLabel} — navigate to ${cap.linkTo} section`}
                  >
                    {cap.linkLabel}
                    <ChevronRight className="w-3 h-3" />
                  </motion.button>
                </motion.div>
              )
            })}
          </div>

          {/* Bottom convergence summary */}
          <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-amber-50 via-emerald-50 to-violet-50 dark:from-amber-900/10 dark:via-emerald-900/10 dark:to-violet-900/10 border border-amber-200 dark:border-amber-800/30">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
              <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-400 text-center sm:text-left">
                <strong className="text-gray-900 dark:text-white">5 capabilities. 0 competitors with all 5.</strong> Stream Racing + Protocol Translation + Circuit Breaking + Zero-Config Injection + Multi-Gateway Fleet — converged in one <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono">install.sh</code>
              </p>
              <div className="flex items-center gap-2 shrink-0">
                <Button variant="outline" size="sm" className="text-xs min-h-[44px]" onClick={() => safeNavigate('topics')}>
                  <BookOpen className="w-3 h-3 mr-1" /> Deep Comparison
                </Button>
                <Button variant="outline" size="sm" className="text-xs min-h-[44px]" onClick={() => safeNavigate('blueprint')}>
                  <Zap className="w-3 h-3 mr-1" /> Blueprint
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* A/B Quick Preview */}
      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-bold tracking-tight">
            <GitCompare className="w-5 h-5 text-amber-500" />
            oh-my-opencode vs oh-my-opencode-slim — Quick Snapshot
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="p-4 rounded-lg border-2 border-amber-300 dark:border-amber-700 bg-amber-50/50 dark:bg-amber-900/10 transform-gpu">
              <p className="font-bold text-amber-800 dark:text-amber-300 text-sm">oh-my-opencode</p>
              <div className="mt-2 space-y-1.5 text-xs">
                <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">Stars</span><span className="font-bold text-amber-700 dark:text-amber-300">~38K</span></div>
                <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">Downloads/wk</span><span className="font-bold text-amber-700 dark:text-amber-300">~60K</span></div>
                <Progress value={76} className="h-1.5 mt-1" />
                <p className="text-amber-600 dark:text-amber-400 font-medium">10 dimension wins (features)</p>
              </div>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="p-4 rounded-lg border-2 border-emerald-300 dark:border-emerald-700 bg-emerald-50/50 dark:bg-emerald-900/10 transform-gpu">
              <p className="font-bold text-emerald-800 dark:text-emerald-300 text-sm">oh-my-opencode-slim</p>
              <div className="mt-2 space-y-1.5 text-xs">
                <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">Stars</span><span className="font-bold text-emerald-700 dark:text-emerald-300">~5.1K</span></div>
                <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">Downloads/wk</span><span className="font-bold text-emerald-700 dark:text-emerald-300">~7.2K</span></div>
                <Progress value={48} className="h-1.5 mt-1" />
                <p className="text-emerald-600 dark:text-emerald-400 font-medium">10 dimension wins (efficiency)</p>
              </div>
            </motion.div>
          </div>
          <div className="mt-4 p-3 rounded-lg bg-muted/50 text-xs text-gray-600 dark:text-gray-400 text-center leading-relaxed">
            It&apos;s a 10-10 tie across 20 dimensions — <strong>Full wins on features</strong>, <strong>Slim wins on efficiency</strong>. See A/B Compare tab for details.
          </div>
        </CardContent>
      </Card>

      {/* Elephant Memory — Cross-Field Connections */}
      <Card className="relative overflow-hidden rounded-xl">
        {/* Decorative diagonal gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-violet-500/5 pointer-events-none" />
        <CardHeader className="relative">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg font-bold tracking-tight">
              <Cpu className="w-5 h-5 text-emerald-500" />
              Elephant Memory
            </CardTitle>
            <Badge variant="outline" className="text-xs border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300">
              Cross-Field Connections
            </Badge>
          </div>
          <CardDescription className="text-sm leading-relaxed">
            4 proxy stacks analyzed across 4 disciplines — knowledge synthesis, interdisciplinary bridging, and pattern transfer
          </CardDescription>
        </CardHeader>
        <CardContent className="relative">
          {/* Dimension pills */}
          <motion.div
            className="flex flex-wrap gap-2 mb-4"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            {CROSS_FIELD_DIMENSIONS.map((dim) => {
              const DimIconMap: Record<string, ElementType> = {
                TrendingUp, Users, Globe, BookOpen,
              }
              const DimIcon = DimIconMap[dim.icon]
              return (
                <motion.div
                  key={dim.id}
                  variants={scaleIn}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium border"
                  style={{
                    borderColor: `${dim.color}40`,
                    backgroundColor: `${dim.color}10`,
                    color: dim.color,
                  }}
                >
                  {DimIcon && <DimIcon className="w-3 h-3" />}
                  {dim.label}
                </motion.div>
              )
            })}
          </motion.div>

          {/* Cross-field matrix */}
          <div className="overflow-x-auto -mx-1">
            <table className="w-full text-xs border-collapse min-w-[540px]" role="table">
              <thead>
                <tr>
                  <th className="text-left p-2 font-semibold text-gray-600 dark:text-gray-400 w-24" scope="col">Proxy</th>
                  {CROSS_FIELD_DIMENSIONS.map(dim => (
                    <th key={dim.id} className="text-left p-2 font-semibold" style={{ color: dim.color }} scope="col">
                      {dim.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CROSS_FIELD_CONNECTIONS.map((entry, idx) => (
                  <motion.tr
                    key={entry.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.08, duration: 0.3, ease: customEase }}
                    className="group border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: entry.proxyColor }}
                        />
                        <span className="font-semibold text-gray-900 dark:text-white whitespace-nowrap">{entry.proxy}</span>
                      </div>
                    </td>
                    <td className="p-2">
                      <span className="font-medium text-emerald-700 dark:text-emerald-300">{entry.economicsShort}</span>
                    </td>
                    <td className="p-2">
                      <span className="font-medium text-violet-700 dark:text-violet-300">{entry.psychologyShort}</span>
                    </td>
                    <td className="p-2">
                      <span className="font-medium text-cyan-700 dark:text-cyan-300">{entry.networkScienceShort}</span>
                    </td>
                    <td className="p-2">
                      <span className="font-medium text-amber-700 dark:text-amber-300">{entry.historyShort}</span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Expandable detail rows */}
          <div className="mt-3 space-y-2">
            {CROSS_FIELD_CONNECTIONS.map((entry) => (
              <details key={entry.id} className="group/details">
                <summary className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer text-xs font-medium text-gray-700 dark:text-gray-300 transition-colors list-none min-h-[44px] focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 rounded-lg">
                  <ChevronRight className="w-3 h-3 transition-transform group-open/details:rotate-90" style={{ color: entry.proxyColor }} />
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.proxyColor }} />
                  <span style={{ color: entry.proxyColor }}>{entry.proxy}</span>
                  <span className="text-gray-500 dark:text-gray-400">— expand cross-field analysis</span>
                </summary>
                <div className="ml-5 mt-1 space-y-2 pb-2">
                  {CROSS_FIELD_DIMENSIONS.map(dim => (
                    <div key={dim.id} className="flex items-start gap-2 p-2 rounded-lg border" style={{ borderColor: `${dim.color}20`, backgroundColor: `${dim.color}05` }}>
                      <div className="shrink-0 mt-0.5">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: dim.color }} />
                      </div>
                      <div>
                        <p className="font-semibold text-xs" style={{ color: dim.color }}>{dim.label}</p>
                        <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-400 mt-0.5">{(entry as unknown as Record<string, string>)[dim.id]}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </details>
            ))}
          </div>

          {/* Bottom interconnection summary */}
          <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-emerald-50 via-violet-50 to-amber-50 dark:from-emerald-900/10 dark:via-violet-900/10 dark:to-amber-900/10 border border-emerald-200 dark:border-emerald-800/30">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
              <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-400 text-center sm:text-left">
                <strong className="text-gray-900 dark:text-white">Cross-field pattern:</strong> Each proxy maps to a distinct archetype across all 4 disciplines — OWL-ORCA is the <span className="text-emerald-600 dark:text-emerald-400 font-medium">arbitrage-BGP-exchange</span> convergence, while others occupy <span className="text-violet-600 dark:text-violet-400 font-medium">translator</span>, <span className="text-purple-600 dark:text-purple-400 font-medium">marketplace</span>, or <span className="text-amber-600 dark:text-amber-400 font-medium">commons</span> archetypes.
              </p>
              <Button variant="outline" size="sm" className="text-xs min-h-[44px] shrink-0" onClick={() => safeNavigate('topics')}>
                <BookOpen className="w-3 h-3 mr-1" /> Deep Analysis
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhancement Stack Summary */}
      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-bold tracking-tight">
            <Sparkles className="w-5 h-5 text-amber-500" />
            Above Mediocrity Enhancement Stack
          </CardTitle>
          <CardDescription className="text-sm leading-relaxed">The essential plugins to make OpenCode deliver above mediocrity</CardDescription>
        </CardHeader>
        <CardContent>
          <motion.div
            className="space-y-3"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            {[
              { tier: 1, items: ['Oh-My-OpenAgent (38K stars)', 'Superpowers (140K+ stars)', 'Context7 MCP (3K+ stars)', 'GitHub MCP (15K+ stars)'] },
              { tier: 2, items: ['OpenSpec Plugin (SDD)', 'Antigravity Awesome Skills (1.5K+)', 'Firecrawl MCP', 'OpenRouter (300+ models)', 'Gemini Auth Plugin'] },
              { tier: 3, items: ['ntfy.sh Notifications', 'OpenCode Worktree', 'Daytona Sandbox', 'OpenCode Browser', 'Ollama Local Models'] },
            ].map(({ tier, items }) => (
              <motion.div key={tier} variants={fadeUpItem} layout className="p-3 rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={`text-xs border-0 ${tier === 1 ? 'bg-amber-500' : tier === 2 ? 'bg-emerald-500' : 'bg-gray-400'} text-white`}>
                    Tier {tier}
                  </Badge>
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    {tier === 1 ? 'Essential — Install First' : tier === 2 ? 'High Impact' : 'Quality of Life'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {items.map(item => (
                    <Badge key={item} variant="secondary" className="text-xs">{item}</Badge>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </CardContent>
      </Card>
    </div>
  )
}

// ==================== MAIN PAGE ====================

export default function HomePage() {
  const [activeSection, setActiveSection] = useState('dashboard')
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const mainRef = useRef<HTMLElement>(null)

  // Enhanced section setter that scrolls to content after switching
  const handleSectionChange = useCallback((section: string) => {
    setActiveSection(section)
    setMobileNavOpen(false)
    // Scroll to main content area after a brief delay for animation
    setTimeout(() => {
      mainRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }, [])

  const sections: Record<string, React.ReactNode> = {
    dashboard: <SectionErrorBoundary sectionName="Dashboard"><DashboardSection onNavigate={handleSectionChange} /></SectionErrorBoundary>,
    compare: <SectionErrorBoundary sectionName="A/B Compare"><ABCompareSection /></SectionErrorBoundary>,
    architecture: <SectionErrorBoundary sectionName="Architecture"><ArchitectureInfographicSection /></SectionErrorBoundary>,
    compatibility: <SectionErrorBoundary sectionName="ADE Compat"><ADECompatibilitySection /></SectionErrorBoundary>,
    plugins: <SectionErrorBoundary sectionName="Plugins"><PluginsSection /></SectionErrorBoundary>,
    blueprint: <SectionErrorBoundary sectionName="Blueprint"><UltimateBlueprintSection /></SectionErrorBoundary>,
    categories: <SectionErrorBoundary sectionName="Categories"><CategoriesSection /></SectionErrorBoundary>,
    files: <SectionErrorBoundary sectionName="Files"><FileBrowserSection /></SectionErrorBoundary>,
    research: <SectionErrorBoundary sectionName="Research Hub"><ResearchHubSection onNavigate={handleSectionChange} /></SectionErrorBoundary>,
    topics: <SectionErrorBoundary sectionName="Proxy Topics"><ProxyComparisonTopicsSection /></SectionErrorBoundary>,
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      {/* Grain texture overlay for visual depth */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.015] z-50" aria-hidden="true">
        <svg width="100%" height="100%">
          <filter id="grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#grain)" />
        </svg>
      </div>

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b" role="navigation" aria-label="Main navigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                AI
              </div>
              <div>
                <h1 className="text-sm font-bold tracking-tight text-gray-900 dark:text-white">AI Agentic Stack</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">Knowledge Base & Interactive Wiki</p>
              </div>
            </div>

            {/* Desktop Nav — horizontally scrollable for many items */}
            <nav className="hidden md:flex items-center gap-1 overflow-x-auto scrollbar-none" aria-label="Section navigation" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {NAV_ITEMS.map(item => {
                const isActive = activeSection === item.id
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => handleSectionChange(item.id)}
                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(245, 158, 11, 0.1)' }}
                    whileTap={{ scale: 0.97 }}
                    className={`relative shrink-0 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 min-h-[36px] cursor-pointer focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 ${
                      isActive
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                    aria-label={item.label}
                  >
                    <item.icon className="w-3.5 h-3.5" />
                    {item.label}
                    {isActive && (
                      <motion.div
                        layoutId="navActiveIndicator"
                        className="absolute bottom-0 left-1 right-1 h-0.5 bg-amber-500 rounded-full"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                  </motion.button>
                )
              })}
            </nav>

            {/* Mobile Menu Toggle */}
            <motion.button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              whileTap={{ scale: 0.95 }}
              className="md:hidden p-2 rounded-lg hover:bg-muted/50 min-h-[44px] min-w-[44px] flex items-center justify-center focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
              aria-label={mobileNavOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileNavOpen}
            >
              {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>
          </div>

          {/* Mobile Nav Dropdown */}
          <AnimatePresence>
            {mobileNavOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="md:hidden overflow-hidden border-t"
              >
                <div className="py-2 space-y-1">
                  {NAV_ITEMS.map((item, idx) => {
                    const isActive = activeSection === item.id
                    return (
                      <motion.button
                        key={item.id}
                        onClick={() => { handleSectionChange(item.id) }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.04, type: 'spring', stiffness: 300, damping: 30 }}
                        whileTap={{ scale: 0.97 }}
                        className={`w-full px-4 py-2 text-sm font-medium text-left rounded-lg transition-colors flex items-center gap-2 min-h-[44px] cursor-pointer focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 ${
                          isActive
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-muted/50'
                        }`}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        <item.icon className="w-4 h-4" />
                        {item.label}
                      </motion.button>
                    )
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Hero Landing Section — only visible on Dashboard */}
      <AnimatePresence>
        {activeSection === 'dashboard' && (
          <motion.section
            key="hero"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative overflow-hidden"
            aria-label="Hero"
          >
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-emerald-950 to-gray-900">
          {/* Animated radial glow */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.12) 0%, rgba(16,185,129,0.08) 40%, transparent 70%)' }}
            animate={{ scale: [1, 1.15, 1], rotate: [0, 5, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          />
          {/* Dot grid pattern */}
          <div className="absolute inset-0 opacity-[0.06]" aria-hidden="true">
            <svg width="100%" height="100%">
              <defs>
                <pattern id="hero-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <circle cx="1.5" cy="1.5" r="1" fill="white" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#hero-grid)" />
            </svg>
          </div>
          {/* Floating orbs */}
          <motion.div
            className="absolute top-[15%] left-[10%] w-64 h-64 rounded-full bg-amber-500/10 blur-3xl"
            animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-[20%] right-[15%] w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl"
            animate={{ x: [0, -25, 0], y: [0, 30, 0] }}
            transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute top-[40%] right-[30%] w-48 h-48 rounded-full bg-cyan-500/8 blur-3xl"
            animate={{ x: [0, 15, 0], y: [0, -25, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 md:py-28">
          <div className="flex flex-col items-center text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: customEase }}
            >
              <Badge className="mb-6 px-4 py-1.5 text-sm font-medium bg-amber-500/15 text-amber-300 border-amber-500/25 backdrop-blur-sm rounded-full">
                <Sparkles className="w-4 h-4 mr-1.5" />
                Free &amp; Unlimited AI — Ubuntu Native
              </Badge>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.1]"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: customEase }}
            >
              AI Agentic Stack
              <br />
              <span className="bg-gradient-to-r from-amber-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Knowledge Base
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="mt-5 sm:mt-6 text-base sm:text-lg md:text-xl text-gray-300/90 max-w-2xl leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25, ease: customEase }}
            >
              Interactive wiki covering the full-stack proxy architecture, 20+ ADE tools, tiered plugins,
              and deep cross-field analysis — powered by OWL-ORCA v7.1.0.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center gap-3 sm:gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: customEase }}
            >
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleSectionChange('architecture')}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold text-sm shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-shadow cursor-pointer min-h-[44px] focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-gray-900"
                aria-label="Explore the architecture"
              >
                <span className="flex items-center gap-2">
                  <Network className="w-4 h-4" />
                  Explore Architecture
                </span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleSectionChange('topics')}
                className="px-6 py-3 rounded-xl bg-white/10 backdrop-blur-sm text-white font-semibold text-sm border border-white/20 hover:bg-white/15 transition-colors cursor-pointer min-h-[44px] focus:ring-2 focus:ring-white/40 focus:ring-offset-2 focus:ring-offset-gray-900"
                aria-label="Compare proxy stacks"
              >
                <span className="flex items-center gap-2">
                  <GitCompare className="w-4 h-4" />
                  Compare Proxies
                </span>
              </motion.button>
            </motion.div>

            {/* Stats Row */}
            <motion.div
              className="mt-12 sm:mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 w-full max-w-3xl"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {[
                { icon: Layers, value: '7', label: 'Architecture Layers', color: 'text-amber-400' },
                { icon: Terminal, value: '20+', label: 'ADE Tools', color: 'text-emerald-400' },
                { icon: Puzzle, value: '15', label: 'Curated Plugins', color: 'text-violet-400' },
                { icon: Gift, value: '~2B/mo', label: 'Free Tokens', color: 'text-cyan-400' },
              ].map(stat => (
                <motion.div
                  key={stat.label}
                  variants={fadeUpItem}
                  className="flex flex-col items-center p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/8 transition-colors"
                >
                  <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
                  <p className="text-2xl sm:text-3xl font-black text-white tracking-tight">{stat.value}</p>
                  <p className="text-xs text-gray-400 mt-1 text-center">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
              className="mt-10 sm:mt-14"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="flex flex-col items-center gap-1 text-gray-500"
              >
                <span className="text-xs tracking-wider uppercase">Scroll to explore</span>
                <ChevronDown className="w-4 h-4" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main ref={mainRef} className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6" role="main">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: customEase }}
          >
            {sections[activeSection]}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white dark:bg-gray-900 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500 dark:text-gray-400">
            <p>AI Agentic Stack — Interactive Knowledge Base & Wiki</p>
            <p>Ubuntu Free & Unlimited | 7 Layers | 20+ ADE Tools | 15 Plugins</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
