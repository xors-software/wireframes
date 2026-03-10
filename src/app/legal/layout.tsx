import Link from 'next/link'
import styles from './layout.module.scss'

interface LegalLayoutProps {
  children: React.ReactNode
}

function XorsLogo() {
  return (
    <svg className={styles.logo} viewBox="0 0 320 80" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="36" height="36" rx="8" fill="#0A0A0A" />
      <rect x="40" y="0" width="36" height="36" rx="8" fill="#0A0A0A" />
      <rect x="0" y="40" width="36" height="36" rx="8" fill="#0A0A0A" />
      <rect x="40" y="40" width="36" height="36" rx="8" fill="#0A0A0A" />

      <rect x="88" y="0" width="36" height="36" rx="8" fill="#0A0A0A" />
      <rect x="128" y="0" width="36" height="36" rx="8" fill="#0A0A0A" />
      <rect x="88" y="40" width="36" height="36" rx="8" fill="#0A0A0A" />
      <rect x="128" y="40" width="36" height="36" rx="8" fill="#0A0A0A" />

      <rect x="176" y="0" width="36" height="36" rx="8" fill="#0A0A0A" />
      <rect x="216" y="0" width="36" height="36" rx="8" fill="#0A0A0A" />
      <rect x="176" y="40" width="36" height="36" rx="8" fill="#0A0A0A" />
      <rect x="216" y="40" width="36" height="36" rx="8" fill="#0A0A0A" />

      <rect x="264" y="0" width="36" height="36" rx="8" fill="#0A0A0A" />
      <rect x="264" y="40" width="36" height="36" rx="8" fill="#0A0A0A" />
      <rect x="304" y="40" width="16" height="36" rx="8" fill="#0A0A0A" />
    </svg>
  )
}

export default function LegalLayout({ children }: LegalLayoutProps) {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logoContainer}>
          <XorsLogo />
        </div>
        {children}
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
    </div>
  )
}
