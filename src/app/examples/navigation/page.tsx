'use client'

import { useState } from 'react'
import styles from './page.module.scss'

export default function NavigationExample() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span className={styles.code}>WIP0003</span>
        <h1 className={styles.title}>Navigation Patterns</h1>
        <p className={styles.description}>
          Headers, sidebars, breadcrumbs, and mobile navigation components.
        </p>
      </header>

      {/* Simple Header */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Simple Header</h2>
        <p className={styles.sectionDescription}>
          Minimal header with logo and navigation links.
        </p>
        <div className={styles.preview}>
          <nav className={styles.navSimple}>
            <span className={styles.navLogo}>Brand</span>
            <div className={styles.navLinks}>
              <a href="#" className={styles.navLink}>Home</a>
              <a href="#" className={styles.navLink}>About</a>
              <a href="#" className={styles.navLink}>Services</a>
              <a href="#" className={styles.navLink}>Contact</a>
            </div>
          </nav>
        </div>
      </section>

      {/* Header with CTA */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Header with CTA</h2>
        <p className={styles.sectionDescription}>
          Header with primary call-to-action button.
        </p>
        <div className={styles.preview}>
          <nav className={styles.navWithCta}>
            <span className={styles.navLogo}>Brand</span>
            <div className={styles.navCenter}>
              <a href="#" className={styles.navLink}>Products</a>
              <a href="#" className={styles.navLink}>Pricing</a>
              <a href="#" className={styles.navLink}>Docs</a>
            </div>
            <div className={styles.navActions}>
              <a href="#" className={styles.navLinkSecondary}>Sign in</a>
              <button className={styles.btnPrimary}>Get Started</button>
            </div>
          </nav>
        </div>
      </section>

      {/* Header with Dropdown */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Header with Dropdown</h2>
        <p className={styles.sectionDescription}>
          Navigation with dropdown menu for nested items.
        </p>
        <div className={styles.preview}>
          <nav className={styles.navWithDropdown}>
            <span className={styles.navLogo}>Brand</span>
            <div className={styles.navLinks}>
              <a href="#" className={styles.navLink}>Home</a>
              <div className={styles.dropdown}>
                <button 
                  className={styles.dropdownTrigger}
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  Products
                  <span className={styles.dropdownIcon}>▾</span>
                </button>
                {dropdownOpen && (
                  <div className={styles.dropdownMenu}>
                    <a href="#" className={styles.dropdownItem}>Analytics</a>
                    <a href="#" className={styles.dropdownItem}>Automation</a>
                    <a href="#" className={styles.dropdownItem}>Reports</a>
                    <div className={styles.dropdownDivider} />
                    <a href="#" className={styles.dropdownItem}>All Products</a>
                  </div>
                )}
              </div>
              <a href="#" className={styles.navLink}>Pricing</a>
              <a href="#" className={styles.navLink}>About</a>
            </div>
          </nav>
        </div>
      </section>

      {/* Mobile Header */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Mobile Navigation</h2>
        <p className={styles.sectionDescription}>
          Hamburger menu for mobile devices.
        </p>
        <div className={styles.previewMobile}>
          <nav className={styles.navMobile}>
            <span className={styles.navLogo}>Brand</span>
            <button 
              className={styles.hamburger}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <span className={`${styles.hamburgerLine} ${mobileMenuOpen ? styles.open : ''}`} />
              <span className={`${styles.hamburgerLine} ${mobileMenuOpen ? styles.open : ''}`} />
              <span className={`${styles.hamburgerLine} ${mobileMenuOpen ? styles.open : ''}`} />
            </button>
          </nav>
          {mobileMenuOpen && (
            <div className={styles.mobileMenu}>
              <a href="#" className={styles.mobileLink}>Home</a>
              <a href="#" className={styles.mobileLink}>Products</a>
              <a href="#" className={styles.mobileLink}>Pricing</a>
              <a href="#" className={styles.mobileLink}>About</a>
              <a href="#" className={styles.mobileLink}>Contact</a>
            </div>
          )}
        </div>
      </section>

      {/* Breadcrumbs */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Breadcrumbs</h2>
        <p className={styles.sectionDescription}>
          Show the current location within a hierarchy.
        </p>
        <div className={styles.preview}>
          <nav className={styles.breadcrumbs}>
            <a href="#" className={styles.breadcrumbLink}>Home</a>
            <span className={styles.breadcrumbSep}>/</span>
            <a href="#" className={styles.breadcrumbLink}>Products</a>
            <span className={styles.breadcrumbSep}>/</span>
            <a href="#" className={styles.breadcrumbLink}>Electronics</a>
            <span className={styles.breadcrumbSep}>/</span>
            <span className={styles.breadcrumbCurrent}>Headphones</span>
          </nav>
        </div>
      </section>

      {/* Tabs Navigation */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Tabs Navigation</h2>
        <p className={styles.sectionDescription}>
          Horizontal tabs for switching between views.
        </p>
        <div className={styles.preview}>
          <nav className={styles.tabs}>
            <button className={`${styles.tab} ${styles.tabActive}`}>Overview</button>
            <button className={styles.tab}>Analytics</button>
            <button className={styles.tab}>Reports</button>
            <button className={styles.tab}>Settings</button>
          </nav>
        </div>
      </section>

      {/* Sidebar Navigation */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Sidebar Navigation</h2>
        <p className={styles.sectionDescription}>
          Vertical navigation for dashboards and applications.
        </p>
        <div className={styles.previewSidebar}>
          <aside className={styles.sidebar}>
            <div className={styles.sidebarHeader}>
              <span className={styles.sidebarLogo}>Dashboard</span>
            </div>
            <nav className={styles.sidebarNav}>
              <a href="#" className={`${styles.sidebarLink} ${styles.sidebarLinkActive}`}>
                <span className={styles.sidebarIcon}>◉</span>
                Overview
              </a>
              <a href="#" className={styles.sidebarLink}>
                <span className={styles.sidebarIcon}>◎</span>
                Analytics
              </a>
              <a href="#" className={styles.sidebarLink}>
                <span className={styles.sidebarIcon}>◉</span>
                Projects
              </a>
              <a href="#" className={styles.sidebarLink}>
                <span className={styles.sidebarIcon}>◎</span>
                Team
              </a>
              <div className={styles.sidebarDivider} />
              <a href="#" className={styles.sidebarLink}>
                <span className={styles.sidebarIcon}>⚙</span>
                Settings
              </a>
            </nav>
          </aside>
          <div className={styles.sidebarContent}>
            <p>Main content area</p>
          </div>
        </div>
      </section>

      {/* Pagination */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Pagination</h2>
        <p className={styles.sectionDescription}>
          Navigate through paginated content.
        </p>
        <div className={styles.preview}>
          <nav className={styles.pagination}>
            <button className={`${styles.pageBtn} ${styles.pageBtnDisabled}`} disabled>
              ←
            </button>
            <button className={`${styles.pageBtn} ${styles.pageBtnActive}`}>1</button>
            <button className={styles.pageBtn}>2</button>
            <button className={styles.pageBtn}>3</button>
            <span className={styles.pageEllipsis}>...</span>
            <button className={styles.pageBtn}>12</button>
            <button className={styles.pageBtn}>→</button>
          </nav>
        </div>
      </section>

      {/* Footer Navigation */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Footer Navigation</h2>
        <p className={styles.sectionDescription}>
          Multi-column footer with links and information.
        </p>
        <div className={styles.previewFooter}>
          <footer className={styles.footer}>
            <div className={styles.footerColumn}>
              <h4 className={styles.footerHeading}>Product</h4>
              <a href="#" className={styles.footerLink}>Features</a>
              <a href="#" className={styles.footerLink}>Pricing</a>
              <a href="#" className={styles.footerLink}>Changelog</a>
              <a href="#" className={styles.footerLink}>Roadmap</a>
            </div>
            <div className={styles.footerColumn}>
              <h4 className={styles.footerHeading}>Company</h4>
              <a href="#" className={styles.footerLink}>About</a>
              <a href="#" className={styles.footerLink}>Blog</a>
              <a href="#" className={styles.footerLink}>Careers</a>
              <a href="#" className={styles.footerLink}>Press</a>
            </div>
            <div className={styles.footerColumn}>
              <h4 className={styles.footerHeading}>Resources</h4>
              <a href="#" className={styles.footerLink}>Documentation</a>
              <a href="#" className={styles.footerLink}>Help Center</a>
              <a href="#" className={styles.footerLink}>Community</a>
              <a href="#" className={styles.footerLink}>Contact</a>
            </div>
            <div className={styles.footerColumn}>
              <h4 className={styles.footerHeading}>Legal</h4>
              <a href="#" className={styles.footerLink}>Privacy</a>
              <a href="#" className={styles.footerLink}>Terms</a>
              <a href="#" className={styles.footerLink}>Cookies</a>
            </div>
          </footer>
        </div>
      </section>
    </div>
  )
}
