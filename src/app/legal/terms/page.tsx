import type { Metadata } from 'next'
import styles from '../content.module.scss'

export const metadata: Metadata = {
  title: 'terms of service \u2014 xors',
  description: 'xors software terms of service.',
}

export default function TermsPage() {
  return (
    <article>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>terms of service</h1>
          <p className={styles.updated}>last updated: december 2024</p>
        </div>
        <div className={styles.headerRight}>
          <p className={styles.introText}>
            welcome to xors software (&quot;xors,&quot; &quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). these terms of service
            (the &quot;terms&quot;) govern your access to and use of our products and services (collectively,
            the &quot;services&quot;). by accessing or using our services, you agree to be bound by these terms.
            if you do not agree to these terms, you may not access or use our services.
          </p>
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.section}>
          <div className={styles.sectionLeft}>
            <h2 className={styles.sectionTitle}>use of services</h2>
          </div>
          <div className={styles.sectionRight}>
            <p className={styles.paragraph}>
              you must be at least 18 years of age to use our services. by using our services, you represent
              and warrant that you are at least 18 years old.
            </p>
            <ul className={styles.list}>
              <li><strong>account creation:</strong> in order to access certain features of our services, you may be required to create an account. you agree to provide accurate, current, and complete information during the registration process and to update such information as necessary.</li>
              <li><strong>responsibility:</strong> you are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer or device. you agree to accept responsibility for all activities that occur under your account or password.</li>
            </ul>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionLeft}>
            <h2 className={styles.sectionTitle}>credits</h2>
          </div>
          <div className={styles.sectionRight}>
            <p className={styles.paragraph}>
              xors credits are usable only within our api ecosystem and are not fiat currency, legal tender, or
              any form of real currency. they cannot be exchanged, transferred outside the platform, or redeemed
              for cash. credits are distributed monthly to subscribers and may be used to access premium features
              within our services.
            </p>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionLeft}>
            <h2 className={styles.sectionTitle}>subscriptions</h2>
          </div>
          <div className={styles.sectionRight}>
            <p className={styles.paragraph}>
              paid subscriptions renew automatically on a monthly basis until canceled. you may cancel your
              subscription at any time through your account settings. upon cancellation, you will retain access
              to paid features until the end of your current billing period.
            </p>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionLeft}>
            <h2 className={styles.sectionTitle}>intellectual property</h2>
          </div>
          <div className={styles.sectionRight}>
            <p className={styles.paragraph}>
              the services and their entire contents, features, and functionality are owned by xors software,
              its licensors, or other providers of such material and are protected by united states and
              international copyright, trademark, patent, trade secret, and other intellectual property or
              proprietary rights laws.
            </p>
            <p className={styles.paragraph}>
              <strong>limited license:</strong> xors grants you a limited, non-exclusive, non-transferable,
              and revocable license to access and use the services for your personal or commercial use in
              accordance with these terms.
            </p>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionLeft}>
            <h2 className={styles.sectionTitle}>user conduct</h2>
          </div>
          <div className={styles.sectionRight}>
            <p className={styles.paragraph}>
              you agree not to use the services for any unlawful or prohibited purpose. you agree not to use
              the services in any way that could damage, disable, overburden, or impair the services or
              interfere with any other party&apos;s use of the services.
            </p>
            <p className={styles.paragraph}>
              <strong>user content:</strong> you are solely responsible for any content that you upload, post,
              or transmit through the services. you agree not to post, upload, or transmit any content that
              is unlawful, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or otherwise
              objectionable.
            </p>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionLeft}>
            <h2 className={styles.sectionTitle}>api usage</h2>
          </div>
          <div className={styles.sectionRight}>
            <p className={styles.paragraph}>
              use of the xors api is subject to rate limits based on your subscription tier. you agree not to
              circumvent these limits or use the api in ways that negatively impact other users or the stability
              of our services.
            </p>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionLeft}>
            <h2 className={styles.sectionTitle}>termination</h2>
          </div>
          <div className={styles.sectionRight}>
            <p className={styles.paragraph}>
              we may terminate or suspend your access to the services at any time, without prior notice or
              liability, for any reason whatsoever, including without limitation if you breach these terms.
            </p>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionLeft}>
            <h2 className={styles.sectionTitle}>disclaimers</h2>
          </div>
          <div className={styles.sectionRight}>
            <p className={styles.paragraph}>
              the services are provided on an &quot;as is&quot; and &quot;as available&quot; basis. xors makes no representations
              or warranties of any kind, express or implied, as to the operation of the services or the
              information, content, materials, or products included in the services. xors is not responsible
              for the behavior of its users.
            </p>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionLeft}>
            <h2 className={styles.sectionTitle}>limitation of liability</h2>
          </div>
          <div className={styles.sectionRight}>
            <p className={styles.paragraph}>
              in no event shall xors software be liable for any indirect, incidental, special, consequential,
              or punitive damages arising out of or in connection with your use of the services.
            </p>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionLeft}>
            <h2 className={styles.sectionTitle}>governing law</h2>
          </div>
          <div className={styles.sectionRight}>
            <p className={styles.paragraph}>
              these terms shall be governed by and construed in accordance with the laws of the state of
              washington, without giving effect to any principles of conflicts of law.
            </p>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionLeft}>
            <h2 className={styles.sectionTitle}>contact</h2>
          </div>
          <div className={styles.sectionRight}>
            <p className={styles.paragraph}>
              if you have any questions about these terms, please contact us at support@xors.xyz.
            </p>
          </div>
        </div>
      </div>
    </article>
  )
}
