"use client"

import { useState } from 'react'
import { motion } from 'motion/react'
import styles from './page.module.scss'
import Link from 'next/link'

interface Item {
  id: number
  label: string
  description: string
  href?: string
  status?: string
}

const products: Item[] = [
  {
    id: 0,
    label: 'xors.xyz',
    description: 'Software studio. Elite devs who think differently.',
    href: 'https://xors.xyz',
    status: 'ONLINE'
  },
  {
    id: 1,
    label: 'dealseeker',
    description: 'AI-powered government RFP discovery and qualification.',
    href: 'https://dealseeker.xors.xyz',
    status: 'BETA'
  },
  {
    id: 2,
    label: 'nameit',
    description: 'Describe your product, get memorable names and cheap domains.',
    href: 'https://nameit.up.railway.app',
    status: 'ONLINE'
  },
  {
    id: 3,
    label: 'slopless.work',
    description: 'Make vibe-coded apps production quality.',
    href: 'https://slopless.work',
    status: 'ONLINE'
  },
  {
    id: 4,
    label: 'www-starter',
    description: 'Production-ready Next.js starter with auth, payments, and deployment.',
    href: 'https://github.com/xors-software/www-starter',
    status: 'V1.0'
  },
  {
    id: 5,
    label: 'me.xors.xyz',
    description: 'Personal link hub. One link for everything.',
    href: 'https://me.xors.xyz',
    status: 'ONLINE'
  },
]

const examples: Item[] = [
  { id: 0, label: 'button variants', description: 'Primary, secondary, ghost, and destructive button styles.', href: '/examples/buttons', status: 'WIP' },
  { id: 1, label: 'form inputs', description: 'Text fields, selects, checkboxes, and validation states.', href: '/examples/forms', status: 'WIP' },
  { id: 2, label: 'card layouts', description: 'Content cards with various configurations and hover states.', href: '/examples/cards', status: 'WIP' },
  { id: 3, label: 'navigation patterns', description: 'Headers, sidebars, and mobile navigation components.', href: '/examples/navigation', status: 'WIP' },
  { id: 4, label: 'modals & dialogs', description: 'Overlay components for confirmations and forms.', href: '/examples/modals', status: 'WIP' },
]

const games: Item[] = [
  { id: 0, label: 'blackjack', description: 'Classic 21. Beat the dealer without going bust.', href: '/games/blackjack', status: 'PLAY' },
  { id: 1, label: 'coinflip', description: 'Heads or tails. Double or nothing.', href: '/games/coinflip', status: 'PLAY' },
  { id: 2, label: 'polymarket', description: 'Prediction markets. Bet on outcomes with XORS credits.', href: '/games/polymarket', status: 'PLAY' },
  { id: 3, label: 'sphere brawl', description: 'Medieval battle simulator. Build armies, press fight, watch the chaos.', href: '/games/sphere-brawl', status: 'PLAY' },
]

function formatId(n: number): string {
  return n.toString().padStart(4, '0')
}

function TableRow({ item }: { item: Item }) {
  return (
    <motion.tr
      className={styles.tr}
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      <td className={styles.td} style={{ width: '50px', color: '#555' }}>{formatId(item.id)}</td>
      <td className={styles.td} style={{ width: '160px' }}>
        <Link href={item.href || '#'}>{item.label}</Link>
      </td>
      <td className={styles.td}>{item.description}</td>
      <td className={styles.td} style={{ width: '70px', fontSize: '9px', letterSpacing: '0.1em', color: '#666' }}>
        {item.status}
      </td>
    </motion.tr>
  )
}

function Section({ title, items }: { title: string; items: Item[] }) {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>ID</th>
            <th className={styles.th}>Name</th>
            <th className={styles.th}>Description</th>
            <th className={styles.th}>Status</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <TableRow key={item.id} item={item} />
          ))}
        </tbody>
      </table>
    </section>
  )
}

export default function Home() {
  return (
    <motion.div
      className={styles.app}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <header className={styles.header}>
        <div className={styles.brand}>
          <div className={styles.logoMark}>X</div>
          <div className={styles.brandText}>
            <h1>THINGS</h1>
            <p className={styles.tagline}>XORS WIREFRAMES</p>
          </div>
        </div>
        <nav className={styles.headerLinks}>
          <a href="https://xors.xyz" target="_blank" rel="noopener noreferrer">xors.xyz</a>
          <a href="https://github.com/xors-software" target="_blank" rel="noopener noreferrer">github</a>
        </nav>
      </header>

      <Section title="Products" items={products} />
      <Section title="Examples" items={examples} />
      <Section title="Games" items={games} />

      <footer className={styles.footer}>
        <span>&copy; 2026 XORS SOFTWARE</span>
        <div className={styles.footerLinks}>
          <a href="https://twitter.com/xBalbinus" target="_blank" rel="noopener noreferrer">twitter</a>
          <a href="https://github.com/xors-software/wireframes" target="_blank" rel="noopener noreferrer">source</a>
        </div>
      </footer>
    </motion.div>
  )
}
