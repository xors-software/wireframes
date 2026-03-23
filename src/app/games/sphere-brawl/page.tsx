"use client"

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import type { BattleConfig, BattleStats, GamePhase } from './lib/types'
import { BattleSetup } from './components/BattleSetup'
import { BattleArena } from './components/BattleArena'
import { VictoryScreen } from './components/VictoryScreen'
import styles from './page.module.scss'

export default function SphereBrawl() {
  const [phase, setPhase] = useState<GamePhase>('setup')
  const [config, setConfig] = useState<BattleConfig | null>(null)
  const [stats, setStats] = useState<BattleStats | null>(null)
  const [arenaKey, setArenaKey] = useState(0)

  const handleStart = useCallback((cfg: BattleConfig) => {
    setConfig(cfg)
    setPhase('battle')
    setArenaKey(k => k + 1)
  }, [])

  const handleVictory = useCallback((s: BattleStats) => {
    setStats(s)
    setPhase('victory')
  }, [])

  const handleRematch = () => {
    if (!config) return
    setPhase('battle')
    setArenaKey(k => k + 1)
  }

  const handleNewBattle = () => {
    setPhase('setup')
    setConfig(null)
    setStats(null)
  }

  return (
    <div className={styles.container}>
      <div className={styles.gridOverlay} />

      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.logo}>{'\u2694'}</div>
          <div>
            <h1>SPHERE BRAWL</h1>
            <p className={styles.subtitle}>MEDIEVAL BATTLE SIMULATOR</p>
          </div>
        </div>
        {phase === 'battle' && (
          <button className={styles.backBtn} onClick={handleNewBattle}>
            {'\u2190'} BACK
          </button>
        )}
      </header>

      <div className={styles.content}>
        <AnimatePresence mode="wait">
          {phase === 'setup' && (
            <motion.div
              key="setup"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <BattleSetup onStart={handleStart} />
            </motion.div>
          )}

          {phase === 'battle' && config && (
            <motion.div
              key={`arena-${arenaKey}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={styles.arenaWrapper}
            >
              <BattleArena config={config} onVictory={handleVictory} />
            </motion.div>
          )}

          {phase === 'victory' && stats && (
            <motion.div
              key="victory"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <VictoryScreen
                stats={stats}
                onRematch={handleRematch}
                onNewBattle={handleNewBattle}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
