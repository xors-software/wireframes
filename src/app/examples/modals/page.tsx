'use client'

import { useState } from 'react'
import styles from './page.module.scss'

export default function ModalsExample() {
  const [basicModal, setBasicModal] = useState(false)
  const [confirmModal, setConfirmModal] = useState(false)
  const [formModal, setFormModal] = useState(false)
  const [alertModal, setAlertModal] = useState(false)
  const [sheetModal, setSheetModal] = useState(false)
  const [fullModal, setFullModal] = useState(false)

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span className={styles.code}>WIP0004</span>
        <h1 className={styles.title}>Modals & Dialogs</h1>
        <p className={styles.description}>
          Overlay components for confirmations, forms, and important information.
        </p>
      </header>

      {/* Basic Modal */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Basic Modal</h2>
        <p className={styles.sectionDescription}>
          Simple modal dialog with title, content, and close button.
        </p>
        <button className={styles.btn} onClick={() => setBasicModal(true)}>
          Open Basic Modal
        </button>
      </section>

      {/* Confirmation Modal */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Confirmation Dialog</h2>
        <p className={styles.sectionDescription}>
          Ask users to confirm important or destructive actions.
        </p>
        <button className={styles.btn} onClick={() => setConfirmModal(true)}>
          Open Confirmation
        </button>
      </section>

      {/* Form Modal */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Form Modal</h2>
        <p className={styles.sectionDescription}>
          Modal containing a form for user input.
        </p>
        <button className={styles.btn} onClick={() => setFormModal(true)}>
          Open Form Modal
        </button>
      </section>

      {/* Alert Modal */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Alert Dialog</h2>
        <p className={styles.sectionDescription}>
          Display important messages or warnings.
        </p>
        <button className={styles.btn} onClick={() => setAlertModal(true)}>
          Open Alert
        </button>
      </section>

      {/* Side Sheet */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Side Sheet</h2>
        <p className={styles.sectionDescription}>
          Slide-in panel from the side of the screen.
        </p>
        <button className={styles.btn} onClick={() => setSheetModal(true)}>
          Open Side Sheet
        </button>
      </section>

      {/* Full Screen Modal */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Full Screen Modal</h2>
        <p className={styles.sectionDescription}>
          Modal that takes up the entire viewport.
        </p>
        <button className={styles.btn} onClick={() => setFullModal(true)}>
          Open Full Screen
        </button>
      </section>

      {/* ====================================================================
          MODALS
      ==================================================================== */}

      {/* Basic Modal */}
      {basicModal && (
        <div className={styles.overlay} onClick={() => setBasicModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Basic Modal</h3>
              <button 
                className={styles.closeBtn} 
                onClick={() => setBasicModal(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className={styles.modalBody}>
              <p>
                This is a basic modal dialog. It can contain any content you need to 
                display to the user. Click outside or press the X button to close.
              </p>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.btnSecondary} onClick={() => setBasicModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmModal && (
        <div className={styles.overlay} onClick={() => setConfirmModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Delete Item?</h3>
              <button 
                className={styles.closeBtn} 
                onClick={() => setConfirmModal(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className={styles.modalBody}>
              <p>
                Are you sure you want to delete this item? This action cannot be undone 
                and all associated data will be permanently removed.
              </p>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.btnSecondary} onClick={() => setConfirmModal(false)}>
                Cancel
              </button>
              <button className={styles.btnDestructive} onClick={() => setConfirmModal(false)}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {formModal && (
        <div className={styles.overlay} onClick={() => setFormModal(false)}>
          <div className={styles.modalLarge} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Create New Project</h3>
              <button 
                className={styles.closeBtn} 
                onClick={() => setFormModal(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className={styles.modalBody}>
              <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Project Name</label>
                  <input type="text" className={styles.input} placeholder="My Project" />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Description</label>
                  <textarea 
                    className={styles.textarea} 
                    rows={3} 
                    placeholder="Enter project description..."
                  />
                </div>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Category</label>
                    <select className={styles.select}>
                      <option>Select category...</option>
                      <option>Design</option>
                      <option>Development</option>
                      <option>Marketing</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Priority</label>
                    <select className={styles.select}>
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                    </select>
                  </div>
                </div>
              </form>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.btnSecondary} onClick={() => setFormModal(false)}>
                Cancel
              </button>
              <button className={styles.btnPrimary} onClick={() => setFormModal(false)}>
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alert Modal */}
      {alertModal && (
        <div className={styles.overlay} onClick={() => setAlertModal(false)}>
          <div className={styles.modalSmall} onClick={(e) => e.stopPropagation()}>
            <div className={styles.alertIcon}>⚠</div>
            <h3 className={styles.alertTitle}>Session Expired</h3>
            <p className={styles.alertText}>
              Your session has expired. Please log in again to continue.
            </p>
            <button className={styles.btnPrimary} onClick={() => setAlertModal(false)}>
              Log In
            </button>
          </div>
        </div>
      )}

      {/* Side Sheet */}
      {sheetModal && (
        <div className={styles.overlay} onClick={() => setSheetModal(false)}>
          <div className={styles.sheet} onClick={(e) => e.stopPropagation()}>
            <div className={styles.sheetHeader}>
              <h3 className={styles.modalTitle}>Filter Options</h3>
              <button 
                className={styles.closeBtn} 
                onClick={() => setSheetModal(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className={styles.sheetBody}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Status</label>
                <div className={styles.checkboxGroup}>
                  <label className={styles.checkboxLabel}>
                    <input type="checkbox" className={styles.checkbox} defaultChecked />
                    Active
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input type="checkbox" className={styles.checkbox} defaultChecked />
                    Pending
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input type="checkbox" className={styles.checkbox} />
                    Archived
                  </label>
                </div>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Date Range</label>
                <select className={styles.select}>
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>Last 90 days</option>
                  <option>All time</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Sort By</label>
                <select className={styles.select}>
                  <option>Newest first</option>
                  <option>Oldest first</option>
                  <option>Name A-Z</option>
                  <option>Name Z-A</option>
                </select>
              </div>
            </div>
            <div className={styles.sheetFooter}>
              <button className={styles.btnSecondary} onClick={() => setSheetModal(false)}>
                Reset
              </button>
              <button className={styles.btnPrimary} onClick={() => setSheetModal(false)}>
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Screen Modal */}
      {fullModal && (
        <div className={styles.fullScreen}>
          <div className={styles.fullScreenHeader}>
            <button 
              className={styles.closeBtn} 
              onClick={() => setFullModal(false)}
              aria-label="Close"
            >
              ×
            </button>
            <h3 className={styles.modalTitle}>Full Screen View</h3>
            <button className={styles.btnPrimary} onClick={() => setFullModal(false)}>
              Done
            </button>
          </div>
          <div className={styles.fullScreenBody}>
            <div className={styles.fullScreenContent}>
              <h2>Full Screen Modal</h2>
              <p>
                This modal takes up the entire viewport. It&apos;s useful for complex 
                workflows, media viewing, or when you need maximum screen real estate.
              </p>
              <p>
                The header stays fixed at the top with close and action buttons.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
