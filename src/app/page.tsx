import styles from './page.module.scss'
import Link from 'next/link'

interface Item {
  id: number
  label: string
  description: string
  href?: string
  status?: 'live' | 'wip' | 'experiment'
}

const products: Item[] = [
  {
    id: 0,
    label: 'xors.xyz',
    description: 'software studio. elite devs who think differently.',
    href: 'https://xors.xyz',
    status: 'live',
  },
  {
    id: 1,
    label: 'dealseeker',
    description: 'ai-powered government rfp discovery and qualification.',
    href: 'https://dealseeker.xors.xyz',
    status: 'live',
  },
  {
    id: 2,
    label: 'nameit',
    description: 'describe your product, get memorable names and cheap domains.',
    href: 'https://nameit.up.railway.app',
    status: 'live',
  },
  {
    id: 3,
    label: 'slopless.work',
    description: 'make vibe-coded apps production quality.',
    href: 'https://slopless.work',
    status: 'live',
  },
  {
    id: 4,
    label: 'www-starter',
    description: 'production-ready next.js starter with auth, payments, and deployment.',
    href: 'https://github.com/xors-software/www-starter',
    status: 'live',
  },
  {
    id: 5,
    label: 'me.xors.xyz',
    description: 'personal link hub. one link for everything.',
    href: 'https://me.xors.xyz',
    status: 'live',
  },
]

const examples: Item[] = [
  {
    id: 0,
    label: 'button variants',
    description: 'primary, secondary, ghost, and destructive button styles.',
    href: '/examples/buttons',
    status: 'experiment',
  },
  {
    id: 1,
    label: 'form inputs',
    description: 'text fields, selects, checkboxes, and validation states.',
    href: '/examples/forms',
    status: 'experiment',
  },
  {
    id: 2,
    label: 'card layouts',
    description: 'content cards with various configurations and hover states.',
    href: '/examples/cards',
    status: 'experiment',
  },
  {
    id: 3,
    label: 'navigation patterns',
    description: 'headers, sidebars, and mobile navigation components.',
    href: '/examples/navigation',
    status: 'experiment',
  },
  {
    id: 4,
    label: 'modals & dialogs',
    description: 'overlay components for confirmations and forms.',
    href: '/examples/modals',
    status: 'experiment',
  },
]

const games: Item[] = [
  {
    id: 0,
    label: 'blackjack',
    description: 'classic 21. beat the dealer without going bust.',
    href: '/games/blackjack',
    status: 'wip',
  },
  {
    id: 1,
    label: 'coinflip',
    description: 'heads or tails. double or nothing.',
    href: '/games/coinflip',
    status: 'wip',
  },
  {
    id: 2,
    label: 'polymarket',
    description: 'prediction markets. bet on outcomes with xors credits.',
    href: '/games/polymarket',
    status: 'wip',
  },
]

function ItemCard({ item }: { item: Item }) {
  return (
    <Link href={item.href || '#'} className={styles.card}>
      <div className={styles.cardInner}>
        <div className={styles.cardHeader}>
          <span className={styles.cardLabel}>{item.label}</span>
          {item.status && (
            <span className={`${styles.cardStatus} ${styles[`status_${item.status}`]}`}>
              {item.status}
            </span>
          )}
        </div>
        <p className={styles.cardDescription}>{item.description}</p>
        <span className={styles.cardArrow}>&rarr;</span>
      </div>
    </Link>
  )
}

export default function Home() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>things</h1>
          <p className={styles.heroSubtitle}>
            games, products, and experiments.
          </p>
          <p className={styles.heroTagline}>
            a collection of things we&apos;ve built, are building, or just wanted to see exist.
            some ship. some stay sketches. all of them taught us something.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionMeta}>
            <span className={styles.sectionNumber}>01</span>
            <span className={styles.sectionDivider} />
          </div>
          <h2 className={styles.sectionTitle}>products</h2>
          <p className={styles.sectionDescription}>things we&apos;ve built and shipped to the world.</p>
        </div>
        <div className={styles.grid}>
          {products.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      <section className={`${styles.section} ${styles.sectionDark}`}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionMeta}>
            <span className={styles.sectionNumber}>02</span>
            <span className={styles.sectionDivider} />
          </div>
          <h2 className={styles.sectionTitle}>examples</h2>
          <p className={styles.sectionDescription}>ui patterns and component implementations.</p>
        </div>
        <div className={styles.grid}>
          {examples.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionMeta}>
            <span className={styles.sectionNumber}>03</span>
            <span className={styles.sectionDivider} />
          </div>
          <h2 className={styles.sectionTitle}>games</h2>
          <p className={styles.sectionDescription}>play something.</p>
        </div>
        <div className={styles.grid}>
          {games.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerPill}>
          <span className={styles.footerBrand}>xors</span>
          <span className={styles.footerDot}>&middot;</span>
          <span className={styles.footerLabel}>things</span>
          <span className={styles.footerDot}>&middot;</span>
          <span className={styles.footerYear}>2026</span>
        </div>
        <div className={styles.footerLinks}>
          <a href="https://xors.xyz" className={styles.footerLink}>xors.xyz</a>
          <a href="https://twitter.com/xBalbinus" className={styles.footerLink}>twitter</a>
          <a href="https://github.com/xors-software" className={styles.footerLink}>github</a>
        </div>
      </footer>
    </div>
  )
}
