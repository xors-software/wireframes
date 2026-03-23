"use client"

import type { BattleStats } from '../lib/types'
import * as C from '../lib/constants'
import styles from '../page.module.scss'

interface Props {
  stats: BattleStats
  onRematch: () => void
  onNewBattle: () => void
}

export function VictoryScreen({ stats, onRematch, onNewBattle }: Props) {
  const secs = Math.floor(stats.battleDurationMs / 1000)
  const mins = Math.floor(secs / 60)
  const timeStr = `${mins}:${String(secs % 60).padStart(2, '0')}`

  const winColor =
    stats.winner === 'red'
      ? C.TEAM_COLORS.red.ring
      : stats.winner === 'blue'
        ? C.TEAM_COLORS.blue.ring
        : '#DAA520'

  const winLabel =
    stats.winner === 'draw'
      ? 'DRAW!'
      : `${stats.winner.toUpperCase()} WINS!`

  return (
    <div className={styles.victory}>
      <div className={styles.victoryContent}>
        <h2 className={styles.victoryTitle} style={{ color: winColor }}>
          {winLabel}
        </h2>
        <div className={styles.victoryStats}>
          <div className={styles.statItem}>
            <span className={styles.statNum}>{stats.totalKnockouts}</span>
            <span className={styles.statDesc}>KNOCKOUTS</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNum}>{timeStr}</span>
            <span className={styles.statDesc}>DURATION</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNum} style={{ color: C.TEAM_COLORS.red.ring }}>
              {stats.redRemaining}
            </span>
            <span className={styles.statDesc}>RED LEFT</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNum} style={{ color: C.TEAM_COLORS.blue.ring }}>
              {stats.blueRemaining}
            </span>
            <span className={styles.statDesc}>BLUE LEFT</span>
          </div>
        </div>
        <div className={styles.victoryActions}>
          <button className={styles.fightBtn} onClick={onRematch}>
            REMATCH
          </button>
          <button className={styles.presetBtn} onClick={onNewBattle}>
            NEW BATTLE
          </button>
        </div>
      </div>
    </div>
  )
}
