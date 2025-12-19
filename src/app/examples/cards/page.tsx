import styles from './page.module.scss'

export default function CardsExample() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span className={styles.code}>WIP0002</span>
        <h1 className={styles.title}>Card Layouts</h1>
        <p className={styles.description}>
          Content cards with various configurations, hover states, and layouts.
        </p>
      </header>

      {/* Basic Cards */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Basic Cards</h2>
        <p className={styles.sectionDescription}>
          Simple content containers with borders and padding.
        </p>
        <div className={styles.cardGrid}>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Basic Card</h3>
            <p className={styles.cardText}>
              A simple card with title and text content. Cards are versatile containers.
            </p>
          </div>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Another Card</h3>
            <p className={styles.cardText}>
              Cards can contain any content and are great for organizing information.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Cards */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Interactive Cards</h2>
        <p className={styles.sectionDescription}>
          Cards with hover effects for clickable content.
        </p>
        <div className={styles.cardGrid}>
          <a href="#" className={styles.cardInteractive}>
            <h3 className={styles.cardTitle}>Hover Me</h3>
            <p className={styles.cardText}>
              This card has hover effects indicating it&apos;s clickable.
            </p>
            <span className={styles.cardArrow}>→</span>
          </a>
          <a href="#" className={styles.cardInteractive}>
            <h3 className={styles.cardTitle}>Link Card</h3>
            <p className={styles.cardText}>
              Navigate to different sections with card-style links.
            </p>
            <span className={styles.cardArrow}>→</span>
          </a>
        </div>
      </section>

      {/* Cards with Images */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Cards with Media</h2>
        <p className={styles.sectionDescription}>
          Cards featuring images or media content.
        </p>
        <div className={styles.cardGrid}>
          <div className={styles.cardMedia}>
            <div className={styles.cardImage}>
              <span className={styles.imagePlaceholder}>16:9</span>
            </div>
            <div className={styles.cardBody}>
              <h3 className={styles.cardTitle}>Media Card</h3>
              <p className={styles.cardText}>
                Cards with images for visual content.
              </p>
            </div>
          </div>
          <div className={styles.cardMedia}>
            <div className={styles.cardImage}>
              <span className={styles.imagePlaceholder}>16:9</span>
            </div>
            <div className={styles.cardBody}>
              <h3 className={styles.cardTitle}>Featured Content</h3>
              <p className={styles.cardText}>
                Showcase featured items with imagery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Horizontal Cards */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Horizontal Cards</h2>
        <p className={styles.sectionDescription}>
          Cards with horizontal layout for compact displays.
        </p>
        <div className={styles.cardList}>
          <div className={styles.cardHorizontal}>
            <div className={styles.cardImageSmall}>
              <span className={styles.imagePlaceholder}>1:1</span>
            </div>
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>Horizontal Layout</h3>
              <p className={styles.cardText}>Image and content side by side.</p>
            </div>
          </div>
          <div className={styles.cardHorizontal}>
            <div className={styles.cardImageSmall}>
              <span className={styles.imagePlaceholder}>1:1</span>
            </div>
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>Compact Display</h3>
              <p className={styles.cardText}>Efficient use of horizontal space.</p>
            </div>
          </div>
          <div className={styles.cardHorizontal}>
            <div className={styles.cardImageSmall}>
              <span className={styles.imagePlaceholder}>1:1</span>
            </div>
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>List Style</h3>
              <p className={styles.cardText}>Perfect for listing items.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Cards with Actions */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Cards with Actions</h2>
        <p className={styles.sectionDescription}>
          Cards with footer actions for user interaction.
        </p>
        <div className={styles.cardGrid}>
          <div className={styles.cardWithActions}>
            <div className={styles.cardBody}>
              <h3 className={styles.cardTitle}>Project Alpha</h3>
              <p className={styles.cardText}>
                A card with action buttons in the footer.
              </p>
            </div>
            <div className={styles.cardActions}>
              <button className={styles.btnSecondary}>Edit</button>
              <button className={styles.btnPrimary}>View</button>
            </div>
          </div>
          <div className={styles.cardWithActions}>
            <div className={styles.cardBody}>
              <h3 className={styles.cardTitle}>Project Beta</h3>
              <p className={styles.cardText}>
                Multiple actions for different user flows.
              </p>
            </div>
            <div className={styles.cardActions}>
              <button className={styles.btnSecondary}>Edit</button>
              <button className={styles.btnPrimary}>View</button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Cards */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Stats Cards</h2>
        <p className={styles.sectionDescription}>
          Cards optimized for displaying metrics and statistics.
        </p>
        <div className={styles.statsGrid}>
          <div className={styles.cardStats}>
            <span className={styles.statsLabel}>Total Users</span>
            <span className={styles.statsValue}>12,847</span>
            <span className={styles.statsChange}>+12.5%</span>
          </div>
          <div className={styles.cardStats}>
            <span className={styles.statsLabel}>Revenue</span>
            <span className={styles.statsValue}>$48,290</span>
            <span className={styles.statsChange}>+8.2%</span>
          </div>
          <div className={styles.cardStats}>
            <span className={styles.statsLabel}>Orders</span>
            <span className={styles.statsValue}>1,423</span>
            <span className={`${styles.statsChange} ${styles.negative}`}>-2.4%</span>
          </div>
          <div className={styles.cardStats}>
            <span className={styles.statsLabel}>Conversion</span>
            <span className={styles.statsValue}>3.24%</span>
            <span className={styles.statsChange}>+0.8%</span>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Feature Cards</h2>
        <p className={styles.sectionDescription}>
          Cards for showcasing features or benefits.
        </p>
        <div className={styles.featureGrid}>
          <div className={styles.cardFeature}>
            <span className={styles.featureIcon}>⚡</span>
            <h3 className={styles.cardTitle}>Fast</h3>
            <p className={styles.cardText}>
              Optimized for speed with sub-second load times.
            </p>
          </div>
          <div className={styles.cardFeature}>
            <span className={styles.featureIcon}>🔒</span>
            <h3 className={styles.cardTitle}>Secure</h3>
            <p className={styles.cardText}>
              Enterprise-grade security built in from the start.
            </p>
          </div>
          <div className={styles.cardFeature}>
            <span className={styles.featureIcon}>📱</span>
            <h3 className={styles.cardTitle}>Responsive</h3>
            <p className={styles.cardText}>
              Works perfectly on any device or screen size.
            </p>
          </div>
        </div>
      </section>

      {/* Elevated Cards */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Elevated Cards</h2>
        <p className={styles.sectionDescription}>
          Cards with shadow for depth and visual hierarchy.
        </p>
        <div className={styles.cardGrid}>
          <div className={styles.cardElevated}>
            <h3 className={styles.cardTitle}>Elevated Style</h3>
            <p className={styles.cardText}>
              Subtle shadow creates depth and draws attention.
            </p>
          </div>
          <div className={styles.cardElevatedHover}>
            <h3 className={styles.cardTitle}>Hover Elevation</h3>
            <p className={styles.cardText}>
              Shadow increases on hover for interactive feedback.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
