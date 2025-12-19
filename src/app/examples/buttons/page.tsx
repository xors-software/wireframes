import styles from './page.module.scss'

export default function ButtonsExample() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span className={styles.code}>WIP0000</span>
        <h1 className={styles.title}>Button Variants</h1>
        <p className={styles.description}>
          Primary, secondary, ghost, and destructive button styles with various states.
        </p>
      </header>

      {/* Primary Buttons */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Primary</h2>
        <p className={styles.sectionDescription}>
          Main call-to-action buttons. Use for the most important actions.
        </p>
        <div className={styles.buttonRow}>
          <button className={styles.btnPrimary}>Primary</button>
          <button className={styles.btnPrimary} disabled>Disabled</button>
          <button className={`${styles.btnPrimary} ${styles.btnSmall}`}>Small</button>
          <button className={`${styles.btnPrimary} ${styles.btnLarge}`}>Large</button>
        </div>
      </section>

      {/* Secondary Buttons */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Secondary</h2>
        <p className={styles.sectionDescription}>
          Supporting actions. Use alongside primary buttons.
        </p>
        <div className={styles.buttonRow}>
          <button className={styles.btnSecondary}>Secondary</button>
          <button className={styles.btnSecondary} disabled>Disabled</button>
          <button className={`${styles.btnSecondary} ${styles.btnSmall}`}>Small</button>
          <button className={`${styles.btnSecondary} ${styles.btnLarge}`}>Large</button>
        </div>
      </section>

      {/* Ghost Buttons */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Ghost</h2>
        <p className={styles.sectionDescription}>
          Minimal buttons for tertiary actions or navigation.
        </p>
        <div className={styles.buttonRow}>
          <button className={styles.btnGhost}>Ghost</button>
          <button className={styles.btnGhost} disabled>Disabled</button>
          <button className={`${styles.btnGhost} ${styles.btnSmall}`}>Small</button>
          <button className={`${styles.btnGhost} ${styles.btnLarge}`}>Large</button>
        </div>
      </section>

      {/* Destructive Buttons */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Destructive</h2>
        <p className={styles.sectionDescription}>
          For dangerous or irreversible actions like delete.
        </p>
        <div className={styles.buttonRow}>
          <button className={styles.btnDestructive}>Delete</button>
          <button className={styles.btnDestructive} disabled>Disabled</button>
          <button className={`${styles.btnDestructive} ${styles.btnSmall}`}>Small</button>
          <button className={`${styles.btnDestructive} ${styles.btnLarge}`}>Large</button>
        </div>
      </section>

      {/* Icon Buttons */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>With Icons</h2>
        <p className={styles.sectionDescription}>
          Buttons with leading or trailing icons for added context.
        </p>
        <div className={styles.buttonRow}>
          <button className={styles.btnPrimary}>
            <span className={styles.btnIcon}>+</span>
            Add Item
          </button>
          <button className={styles.btnSecondary}>
            Download
            <span className={styles.btnIcon}>↓</span>
          </button>
          <button className={styles.btnGhost}>
            <span className={styles.btnIcon}>←</span>
            Back
          </button>
          <button className={styles.btnIconOnly} aria-label="Settings">
            ⚙
          </button>
        </div>
      </section>

      {/* Button Group */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Button Groups</h2>
        <p className={styles.sectionDescription}>
          Related actions grouped together.
        </p>
        <div className={styles.buttonGroup}>
          <button className={styles.btnGroupItem}>Left</button>
          <button className={styles.btnGroupItem}>Center</button>
          <button className={styles.btnGroupItem}>Right</button>
        </div>
      </section>

      {/* Loading States */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Loading States</h2>
        <p className={styles.sectionDescription}>
          Indicate in-progress actions with loading indicators.
        </p>
        <div className={styles.buttonRow}>
          <button className={`${styles.btnPrimary} ${styles.btnLoading}`} disabled>
            <span className={styles.spinner} />
            Loading...
          </button>
          <button className={`${styles.btnSecondary} ${styles.btnLoading}`} disabled>
            <span className={styles.spinner} />
            Processing
          </button>
        </div>
      </section>

      {/* Full Width */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Full Width</h2>
        <p className={styles.sectionDescription}>
          Buttons that span the full container width.
        </p>
        <div className={styles.fullWidthContainer}>
          <button className={`${styles.btnPrimary} ${styles.btnFull}`}>
            Continue
          </button>
          <button className={`${styles.btnSecondary} ${styles.btnFull}`}>
            Cancel
          </button>
        </div>
      </section>
    </div>
  )
}
