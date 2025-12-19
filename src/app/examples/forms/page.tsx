'use client'

import { useState } from 'react'
import styles from './page.module.scss'

export default function FormsExample() {
  const [selectValue, setSelectValue] = useState('')
  const [checkboxes, setCheckboxes] = useState({ option1: false, option2: true, option3: false })
  const [radioValue, setRadioValue] = useState('option2')
  const [switchValue, setSwitchValue] = useState(true)

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span className={styles.code}>WIP0001</span>
        <h1 className={styles.title}>Form Inputs</h1>
        <p className={styles.description}>
          Text fields, selects, checkboxes, radio buttons, and validation states.
        </p>
      </header>

      {/* Text Inputs */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Text Inputs</h2>
        <p className={styles.sectionDescription}>
          Standard text input fields with labels and placeholders.
        </p>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Default</label>
            <input type="text" className={styles.input} placeholder="Enter text..." />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>With value</label>
            <input type="text" className={styles.input} defaultValue="John Doe" />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Disabled</label>
            <input type="text" className={styles.input} disabled placeholder="Disabled input" />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Read-only</label>
            <input type="text" className={styles.input} readOnly defaultValue="Read-only value" />
          </div>
        </div>
      </section>

      {/* Input Types */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Input Types</h2>
        <p className={styles.sectionDescription}>
          Different input types for various data formats.
        </p>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Email</label>
            <input type="email" className={styles.input} placeholder="email@example.com" />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Password</label>
            <input type="password" className={styles.input} placeholder="••••••••" />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Number</label>
            <input type="number" className={styles.input} placeholder="0" />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Date</label>
            <input type="date" className={styles.input} />
          </div>
        </div>
      </section>

      {/* Validation States */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Validation States</h2>
        <p className={styles.sectionDescription}>
          Visual feedback for form validation.
        </p>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Valid</label>
            <input type="text" className={`${styles.input} ${styles.inputValid}`} defaultValue="Valid input" />
            <span className={styles.helpText}>Looks good!</span>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Error</label>
            <input type="text" className={`${styles.input} ${styles.inputError}`} defaultValue="Invalid" />
            <span className={styles.errorText}>This field is required.</span>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              With helper text
              <span className={styles.labelOptional}>(optional)</span>
            </label>
            <input type="text" className={styles.input} placeholder="Enter value..." />
            <span className={styles.helpText}>Helper text provides additional context.</span>
          </div>
        </div>
      </section>

      {/* Textarea */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Textarea</h2>
        <p className={styles.sectionDescription}>
          Multi-line text input for longer content.
        </p>
        <div className={styles.formGroup}>
          <label className={styles.label}>Message</label>
          <textarea 
            className={styles.textarea} 
            rows={4} 
            placeholder="Enter your message here..."
          />
        </div>
      </section>

      {/* Select */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Select</h2>
        <p className={styles.sectionDescription}>
          Dropdown selection for predefined options.
        </p>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Default</label>
            <select 
              className={styles.select}
              value={selectValue}
              onChange={(e) => setSelectValue(e.target.value)}
            >
              <option value="">Select an option...</option>
              <option value="1">Option 1</option>
              <option value="2">Option 2</option>
              <option value="3">Option 3</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Disabled</label>
            <select className={styles.select} disabled>
              <option>Disabled select</option>
            </select>
          </div>
        </div>
      </section>

      {/* Checkboxes */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Checkboxes</h2>
        <p className={styles.sectionDescription}>
          Multiple selection options.
        </p>
        <div className={styles.checkboxGroup}>
          <label className={styles.checkboxLabel}>
            <input 
              type="checkbox" 
              className={styles.checkbox}
              checked={checkboxes.option1}
              onChange={(e) => setCheckboxes({ ...checkboxes, option1: e.target.checked })}
            />
            <span className={styles.checkboxCustom} />
            Option 1
          </label>
          <label className={styles.checkboxLabel}>
            <input 
              type="checkbox" 
              className={styles.checkbox}
              checked={checkboxes.option2}
              onChange={(e) => setCheckboxes({ ...checkboxes, option2: e.target.checked })}
            />
            <span className={styles.checkboxCustom} />
            Option 2 (checked by default)
          </label>
          <label className={`${styles.checkboxLabel} ${styles.disabled}`}>
            <input 
              type="checkbox" 
              className={styles.checkbox}
              disabled
              checked={checkboxes.option3}
            />
            <span className={styles.checkboxCustom} />
            Option 3 (disabled)
          </label>
        </div>
      </section>

      {/* Radio Buttons */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Radio Buttons</h2>
        <p className={styles.sectionDescription}>
          Single selection from multiple options.
        </p>
        <div className={styles.radioGroup}>
          <label className={styles.radioLabel}>
            <input 
              type="radio" 
              name="radio-example"
              className={styles.radio}
              value="option1"
              checked={radioValue === 'option1'}
              onChange={(e) => setRadioValue(e.target.value)}
            />
            <span className={styles.radioCustom} />
            Option 1
          </label>
          <label className={styles.radioLabel}>
            <input 
              type="radio" 
              name="radio-example"
              className={styles.radio}
              value="option2"
              checked={radioValue === 'option2'}
              onChange={(e) => setRadioValue(e.target.value)}
            />
            <span className={styles.radioCustom} />
            Option 2 (selected by default)
          </label>
          <label className={styles.radioLabel}>
            <input 
              type="radio" 
              name="radio-example"
              className={styles.radio}
              value="option3"
              checked={radioValue === 'option3'}
              onChange={(e) => setRadioValue(e.target.value)}
            />
            <span className={styles.radioCustom} />
            Option 3
          </label>
        </div>
      </section>

      {/* Toggle Switch */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Toggle Switch</h2>
        <p className={styles.sectionDescription}>
          Binary on/off controls.
        </p>
        <div className={styles.switchGroup}>
          <label className={styles.switchLabel}>
            <span>Enable notifications</span>
            <button 
              type="button"
              role="switch"
              aria-checked={switchValue}
              className={`${styles.switch} ${switchValue ? styles.switchOn : ''}`}
              onClick={() => setSwitchValue(!switchValue)}
            >
              <span className={styles.switchThumb} />
            </button>
          </label>
          <label className={`${styles.switchLabel} ${styles.disabled}`}>
            <span>Disabled switch</span>
            <button 
              type="button"
              role="switch"
              aria-checked={false}
              className={styles.switch}
              disabled
            >
              <span className={styles.switchThumb} />
            </button>
          </label>
        </div>
      </section>

      {/* Form Example */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Complete Form</h2>
        <p className={styles.sectionDescription}>
          A complete form layout example.
        </p>
        <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>First name</label>
              <input type="text" className={styles.input} placeholder="John" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Last name</label>
              <input type="text" className={styles.input} placeholder="Doe" />
            </div>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Email</label>
            <input type="email" className={styles.input} placeholder="john@example.com" />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Message</label>
            <textarea className={styles.textarea} rows={3} placeholder="Your message..." />
          </div>
          <div className={styles.formActions}>
            <button type="button" className={styles.btnSecondary}>Cancel</button>
            <button type="submit" className={styles.btnPrimary}>Submit</button>
          </div>
        </form>
      </section>
    </div>
  )
}
