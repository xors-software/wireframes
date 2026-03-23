"use client"

import { useState } from 'react'
import type { BattleConfig } from '../lib/types'
import { UNIT_CLASSES, PRESETS } from '../lib/classes'
import * as C from '../lib/constants'
import styles from '../page.module.scss'

interface Props {
  onStart: (config: BattleConfig) => void
}

function teamTotal(team: Record<string, number>) {
  return Object.values(team).reduce((a, b) => a + b, 0)
}

export function BattleSetup({ onStart }: Props) {
  const [red, setRed] = useState<Record<string, number>>({ knight: 1 })
  const [blue, setBlue] = useState<Record<string, number>>({ knight: 1 })

  const adjust = (team: 'red' | 'blue', classId: string, delta: number) => {
    const setter = team === 'red' ? setRed : setBlue
    const current = team === 'red' ? red : blue
    const val = Math.max(0, Math.min(C.MAX_PER_CLASS, (current[classId] || 0) + delta))
    const newTeam = { ...current, [classId]: val }
    if (teamTotal(newTeam) <= C.MAX_TOTAL) setter(newTeam)
  }

  const applyPreset = (idx: number) => {
    const p = PRESETS[idx]
    setRed({ ...Object.fromEntries(UNIT_CLASSES.map(c => [c.id, 0])), ...p.red })
    setBlue({ ...Object.fromEntries(UNIT_CLASSES.map(c => [c.id, 0])), ...p.blue })
  }

  const canFight = teamTotal(red) > 0 && teamTotal(blue) > 0

  return (
    <div className={styles.setup}>
      <h2 className={styles.setupTitle}>BATTLE SETUP</h2>

      <div className={styles.presets}>
        {PRESETS.map((p, i) => (
          <button key={p.name} className={styles.presetBtn} onClick={() => applyPreset(i)}>
            {p.name}
          </button>
        ))}
      </div>

      <div className={styles.teams}>
        {(['red', 'blue'] as const).map(team => (
          <div key={team} className={styles.teamCol}>
            <h3
              className={styles.teamLabel}
              style={{ color: team === 'red' ? '#E74C3C' : '#3498DB' }}
            >
              {team.toUpperCase()} ARMY
            </h3>
            {UNIT_CLASSES.map(cls => {
              const count = (team === 'red' ? red : blue)[cls.id] || 0
              return (
                <div key={cls.id} className={styles.unitRow}>
                  <span className={styles.unitIcon}>{cls.icon}</span>
                  <span className={styles.unitName}>{cls.name}</span>
                  <div className={styles.counter}>
                    <button
                      className={styles.counterBtn}
                      onClick={() => adjust(team, cls.id, -1)}
                      disabled={count === 0}
                    >
                      -
                    </button>
                    <span className={styles.counterVal}>{count}</span>
                    <button
                      className={styles.counterBtn}
                      onClick={() => adjust(team, cls.id, 1)}
                      disabled={count >= C.MAX_PER_CLASS}
                    >
                      +
                    </button>
                  </div>
                </div>
              )
            })}
            <div className={styles.teamTotal}>
              Total: {teamTotal(team === 'red' ? red : blue)}
            </div>
          </div>
        ))}
      </div>

      <button
        className={styles.fightBtn}
        onClick={() => canFight && onStart({ red, blue })}
        disabled={!canFight}
      >
        {'\u2694'} FIGHT! {'\u2694'}
      </button>
    </div>
  )
}
