import Link from 'next/link'
import styles from './layout.module.scss'

interface ExamplesLayoutProps {
  children: React.ReactNode
}

export default function ExamplesLayout({ children }: ExamplesLayoutProps) {
  return (
    <div className={styles.layout}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.backLink}>
          ← wireframes
        </Link>
        <div className={styles.navLinks}>
          <Link href="/examples/buttons" className={styles.navLink}>buttons</Link>
          <Link href="/examples/forms" className={styles.navLink}>forms</Link>
          <Link href="/examples/cards" className={styles.navLink}>cards</Link>
          <Link href="/examples/navigation" className={styles.navLink}>navigation</Link>
          <Link href="/examples/modals" className={styles.navLink}>modals</Link>
        </div>
      </nav>
      <main className={styles.main}>
        {children}
      </main>
    </div>
  )
}
