import Link from 'next/link'
import Image from 'next/image'
import styles from './layout.module.scss'

interface LegalLayoutProps {
  children: React.ReactNode
}

export default function LegalLayout({ children }: LegalLayoutProps) {
  return (
    <div className={styles.page}>
      <div className={styles.logoContainer}>
        <Image
          src="/xors-wordmark.png"
          alt="xors"
          width={1028}
          height={310}
          className={styles.logo}
          priority
        />
      </div>
      <div className={styles.content}>
        {children}
      </div>
      <footer className={styles.footer}>
        <div className={styles.footerLinks}>
          <Link href="/legal/privacy" className={styles.footerLink}>privacy policy</Link>
          <Link href="/legal/terms" className={styles.footerLink}>terms of service</Link>
          <Link href="/legal/acceptable-use" className={styles.footerLink}>acceptable use</Link>
        </div>
        <div className={styles.footerMeta}>
          <Link href="/" className={styles.footerLink}>things.xors.xyz</Link>
          <span className={styles.footerDot}>&middot;</span>
          <a href="mailto:support@xors.xyz" className={styles.footerLink}>support@xors.xyz</a>
        </div>
      </footer>
    </div>
  )
}
