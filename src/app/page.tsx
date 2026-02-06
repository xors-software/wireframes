import styles from './page.module.scss'
import Link from 'next/link'

interface Item {
  id: number
  label: string
  description: string
  href?: string
}

const products: Item[] = [
  {
    id: 0,
    label: 'xors.xyz',
    description: 'Software studio. Elite devs who think differently.',
    href: 'https://xors.xyz',
  },
  {
    id: 1,
    label: 'dealseeker',
    description: 'AI-powered government RFP discovery and qualification.',
    href: 'https://dealseeker.xors.xyz',
  },
  {
    id: 2,
    label: 'nameit',
    description: 'Describe your product, get memorable names and cheap domains.',
    href: 'https://nameit.up.railway.app',
  },
  {
    id: 3,
    label: 'slopless.work',
    description: 'Make vibe-coded apps production quality.',
    href: 'https://slopless.work',
  },
  {
    id: 4,
    label: 'www-starter',
    description: 'Production-ready Next.js starter with auth, payments, and deployment.',
    href: 'https://github.com/xors-software/www-starter',
  },
  {
    id: 5,
    label: 'me.xors.xyz',
    description: 'Personal link hub. One link for everything.',
    href: 'https://me.xors.xyz',
  },
]

const examples: Item[] = [
  {
    id: 0,
    label: 'button variants',
    description: 'Primary, secondary, ghost, and destructive button styles.',
    href: '/examples/buttons',
  },
  {
    id: 1,
    label: 'form inputs',
    description: 'Text fields, selects, checkboxes, and validation states.',
    href: '/examples/forms',
  },
  {
    id: 2,
    label: 'card layouts',
    description: 'Content cards with various configurations and hover states.',
    href: '/examples/cards',
  },
  {
    id: 3,
    label: 'navigation patterns',
    description: 'Headers, sidebars, and mobile navigation components.',
    href: '/examples/navigation',
  },
  {
    id: 4,
    label: 'modals & dialogs',
    description: 'Overlay components for confirmations and forms.',
    href: '/examples/modals',
  },
]

const games: Item[] = [
  {
    id: 0,
    label: 'blackjack',
    description: 'Classic 21. Beat the dealer without going bust.',
    href: '/games/blackjack',
  },
  {
    id: 1,
    label: 'coinflip',
    description: 'Heads or tails. Double or nothing.',
    href: '/games/coinflip',
  },
  {
    id: 2,
    label: 'polymarket',
    description: 'Prediction markets. Bet on outcomes with XORS credits.',
    href: '/games/polymarket',
  },
]

function formatNumber(n: number): string {
  return n.toString().padStart(4, '0')
}

function ItemRow({ item }: { item: Item }) {
  return (
    <Link href={item.href || '#'} className={styles.item}>
      <div className={styles.itemNumber}>WIP{formatNumber(item.id)}</div>
      <div className={styles.itemContent}>
        <div className={styles.itemName}>{item.label}</div>
        <div className={styles.itemDescription}>{item.description}</div>
      </div>
      <div className={styles.itemArrow}>→</div>
    </Link>
  )
}

export default function Home() {
  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.logo}>wireframes</h1>
        <p className={styles.tagline}>UI examples, components, and experiments.</p>
      </header>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Products</h2>
          <p className={styles.sectionDescription}>Things we've built and shipped to the world.</p>
        </div>
        <div className={styles.itemList}>
          {products.map((item) => (
            <ItemRow key={item.id} item={item} />
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Examples</h2>
          <p className={styles.sectionDescription}>UI patterns and component implementations.</p>
        </div>
        <div className={styles.itemList}>
          {examples.map((item) => (
            <ItemRow key={item.id} item={item} />
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Games</h2>
          <p className={styles.sectionDescription}>Play something.</p>
        </div>
        <div className={styles.itemList}>
          {games.map((item) => (
            <ItemRow key={item.id} item={item} />
          ))}
        </div>
      </section>

      <footer className={styles.footer}>
        <span className={styles.footerText}>© 2025 xors.xyz</span>
        <div className={styles.footerLinks}>
          <a href="https://twitter.com/xBalbinus" className={styles.footerLink}>twitter</a>
          <a href="https://github.com/xors-software/wireframes" className={styles.footerLink}>github</a>
        </div>
      </footer>
    </div>
  )
}
