'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'

if (typeof window !== 'undefined' && !(gsap as any).__configured) {
  gsap.registerPlugin(ScrollTrigger, MotionPathPlugin)
  gsap.config({ autoSleep: 60, nullTargetWarn: false })
  // Golden ratio duration (~0.618s) — the "golden duration"
  const GOLDEN_RATIO = (1 + Math.sqrt(5)) / 2
  gsap.defaults({ duration: 1 / GOLDEN_RATIO, ease: 'power2.out' })
  ;(gsap as any).__configured = true
}

export { gsap, ScrollTrigger, MotionPathPlugin }
