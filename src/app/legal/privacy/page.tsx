import type { Metadata } from 'next'
import styles from '../content.module.scss'

export const metadata: Metadata = {
  title: 'privacy policy \u2014 xors',
  description: 'xors software privacy policy.',
}

export default function PrivacyPage() {
  return (
    <article>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>privacy policy</h1>
          <p className={styles.updated}>last updated: december 2024</p>
        </div>
        <div className={styles.headerRight}>
          <p className={styles.introText}>
            at xors software (&quot;xors,&quot; &quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), we are committed to protecting
            the privacy of our users. this privacy policy (the &quot;policy&quot;) explains how we collect, use, and
            disclose information when you access or use our products and services (collectively, the &quot;services&quot;).
          </p>
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.section}>
          <div className={styles.sectionLeft}>
            <h2 className={styles.sectionTitle}>information we collect</h2>
          </div>
          <div className={styles.sectionRight}>
            <p className={styles.paragraph}>
              when you create an account or use our services, we may collect personal information such as your
              name, email address, and demographic information.
            </p>
            <ul className={styles.list}>
              <li><strong>usage information:</strong> we may collect information about how you use our services, including your access times, browser type and language, and internet protocol (ip) address.</li>
              <li><strong>cookies and similar technologies:</strong> we may use cookies and similar technologies to collect information about your browsing behavior and preferences.</li>
            </ul>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionLeft}>
            <h2 className={styles.sectionTitle}>how we use your information</h2>
          </div>
          <div className={styles.sectionRight}>
            <p className={styles.paragraph}>
              we may use the information we collect for various purposes, including:
            </p>
            <ul className={styles.list}>
              <li>to provide, analyze, improve and maintain our services.</li>
              <li>to personalize your experience and deliver content and product offerings relevant to your interests.</li>
              <li>to communicate with you about our services and respond to your inquiries.</li>
            </ul>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionLeft}>
            <h2 className={styles.sectionTitle}>information sharing and disclosure</h2>
          </div>
          <div className={styles.sectionRight}>
            <p className={styles.paragraph}>
              we may share your information with third parties in the following circumstances:
            </p>
            <ul className={styles.list}>
              <li>with your consent or at your direction;</li>
              <li>with service providers who perform services on our behalf;</li>
              <li>to comply with legal obligations or to protect our rights and interests. xors will always comply with united states law.</li>
              <li>to determine if you have breached our <a href="/legal/acceptable-use">acceptable use policy</a>.</li>
            </ul>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionLeft}>
            <h2 className={styles.sectionTitle}>data retention and security</h2>
          </div>
          <div className={styles.sectionRight}>
            <p className={styles.paragraph}>
              we take reasonable measures to protect the information we collect from loss, misuse, unauthorized
              access, disclosure, alteration, and destruction. however, no method of transmission over the internet
              or method of electronic storage is 100% secure, and we cannot guarantee the absolute security of
              your information.
            </p>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionLeft}>
            <h2 className={styles.sectionTitle}>your choices and rights</h2>
          </div>
          <div className={styles.sectionRight}>
            <p className={styles.paragraph}>
              you may update, correct, or delete your account information at any time by logging into your
              account. you may also opt-out of receiving promotional communications from us by following the
              instructions in those communications or viewing your settings.
            </p>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionLeft}>
            <h2 className={styles.sectionTitle}>children&apos;s privacy</h2>
          </div>
          <div className={styles.sectionRight}>
            <p className={styles.paragraph}>
              our services are not intended for children under the age of 18, and we do not knowingly collect
              personal information from children under 18. if we become aware that we have collected personal
              information from a child under 18, we will take steps to delete such information.
            </p>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionLeft}>
            <h2 className={styles.sectionTitle}>changes to this policy</h2>
          </div>
          <div className={styles.sectionRight}>
            <p className={styles.paragraph}>
              we may update this policy from time to time to reflect changes in our practices or for other
              operational, legal, or regulatory reasons. we encourage you to review this policy periodically
              for the latest information on our privacy practices.
            </p>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionLeft}>
            <h2 className={styles.sectionTitle}>disclaimer</h2>
          </div>
          <div className={styles.sectionRight}>
            <p className={styles.paragraph}>
              we are not responsible for the behavior of our users and cannot guarantee the security of any
              information transmitted through our services. by using our services, you acknowledge that you
              understand and agree to assume these risks.
            </p>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionLeft}>
            <h2 className={styles.sectionTitle}>contact us</h2>
          </div>
          <div className={styles.sectionRight}>
            <p className={styles.paragraph}>
              if you have any questions or concerns about this policy or our privacy practices, please contact
              us at support@xors.xyz.
            </p>
            <p className={styles.paragraph}>
              please note that this policy is aligned with our <a href="/legal/terms">terms of service</a> and
              our <a href="/legal/acceptable-use">acceptable use policy</a>. by using our services, you agree
              to be bound by this policy, our terms of service, and our acceptable use policy.
            </p>
          </div>
        </div>
      </div>
    </article>
  )
}
