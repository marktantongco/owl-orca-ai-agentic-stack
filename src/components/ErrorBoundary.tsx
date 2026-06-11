'use client'

import { Component, ReactNode } from 'react'
import { motion } from 'framer-motion'

interface Props {
  children: ReactNode
  sectionName: string
}

interface State {
  hasError: boolean
  error: Error | null
  showDetails: boolean
}

export class SectionErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null, showDetails: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-xl border-2 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10 text-center"
        >
          <span className="text-4xl">🦉</span>
          <h3 className="text-lg font-bold text-red-800 dark:text-red-300 mt-2">Owl caught an error in {this.props.sectionName}</h3>
          <p className="text-sm text-red-600 dark:text-red-400 mt-1">Something went wrong. The owl is investigating.</p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="mt-4 px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
          >
            Retry Section
          </button>
          <button
            onClick={() => this.setState(s => ({ showDetails: !s.showDetails }))}
            className="mt-2 ml-2 px-3 py-1 rounded text-xs text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
          >
            {this.state.showDetails ? 'Hide' : 'Show'} Details
          </button>
          {this.state.showDetails && this.state.error && (
            <pre className="mt-3 p-3 rounded-lg bg-red-100 dark:bg-red-900/20 text-left text-xs font-mono text-red-700 dark:text-red-300 overflow-auto max-h-40">
              {this.state.error.message}
              {this.state.error.stack}
            </pre>
          )}
        </motion.div>
      )
    }
    return this.props.children
  }
}
