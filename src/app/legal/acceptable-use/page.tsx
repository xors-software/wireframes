import type { Metadata } from 'next'
import styles from '../content.module.scss'

export const metadata: Metadata = {
  title: 'acceptable use policy \u2014 xors',
  description: 'xors software acceptable use policy.',
}

export default function AcceptableUsePage() {
  return (
    <article>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>acceptable<br />use policy</h1>
          <p className={styles.updated}>last updated: december 2024</p>
        </div>
        <div className={styles.headerRight}>
          <p className={styles.paragraph}>
            web services offered by xors software (the &quot;services&quot;) can be used by many people over the age
            of 18 on the internet. in exchange, we trust you to use our services responsibly and in compliance
            with local law and united states law.
          </p>
          <p className={styles.paragraph}>
            this acceptable use policy (this &quot;policy&quot;) describes prohibited uses of the web services
            offered by xors software. the examples described in this policy are not exhaustive.
          </p>
          <p className={styles.paragraph}>
            if you use xors services, you are also beholden to our{' '}
            <a href="/legal/terms">terms of service</a> and{' '}
            <a href="/legal/privacy">privacy policy</a>.
          </p>
          <p className={styles.paragraph}>
            we may modify this policy at any time by posting a revised version on the services. by using
            the services, you agree to the latest version of this policy. if you violate the policy or
            authorize or help others to do so, we may suspend or terminate your use of the services without notice.
          </p>
          <p className={styles.paragraph}>
            be respectful of the people and communities that are using the services. we all have different
            perspectives. that&apos;s what is beautiful about the internet and creativity: communities of varying
            types can assemble and flourish. let&apos;s build useful products and applications for all.
          </p>
        </div>
      </div>

      <div className={styles.body}>
        <h2 className={styles.sectionTitle}>enforcement</h2>
        <p className={styles.paragraph}>
          we reserve the right, but do not assume the obligation, to investigate any violation of this
          policy or misuse of the services.
        </p>
        <p className={styles.paragraph}>
          because you may store data through the services, we may be held accountable for what you do
          with your data. therefore, we may look at what you do with your data outside of the api service.
          we are not responsible for what others do with your data on the internet.
        </p>
        <p className={styles.paragraph}>therefore, we may:</p>
        <ul className={styles.list}>
          <li>investigate violations of this policy or misuse of the services</li>
          <li>remove, disable access to, or modify any content or resource that violates this policy</li>
          <li>revoke your access permanently to services and remove any retrievable data from our servers</li>
        </ul>

        <h2 className={styles.sectionTitle}>human rights</h2>
        <p className={styles.paragraph}>
          do not do anything that violates ours or someone else&apos;s rights, including intellectual property
          rights (examples of which are copyright, trademarks, confidential information, and goodwill),
          personality rights, unfair competition, privacy, and data protection rights.
        </p>

        <h2 className={styles.sectionTitle}>no illegal, harmful, or offensive use or content</h2>
        <p className={styles.paragraph}>
          you must use the services lawfully and for a lawful purpose. you may not use, or encourage,
          promote, facilitate, or instruct others to use, the services for any illegal, harmful, fraudulent,
          infringing, or offensive use, or to transmit, store, display, distribute, or otherwise make
          available content that is illegal, harmful, fraudulent, infringing, or offensive.
        </p>
        <p className={styles.paragraph}>
          you will not upload data that violates local or united states law.
        </p>
        <p className={styles.paragraph}><strong>prohibited activities or content include:</strong></p>
        <ul className={styles.list}>
          <li><strong>illegal, harmful, or fraudulent activities.</strong> any activities that are illegal, violate the rights of others, or may be harmful to others, our operations, or reputation.</li>
          <li><strong>hate speech.</strong> content that calls for violence, exclusion, or segregation based on race, ethnicity, national origin, religion, sex, gender identity, sexual orientation, disability, or immigration status.</li>
          <li><strong>infringing content.</strong> content that infringes or misappropriates the intellectual property or proprietary rights of others.</li>
          <li><strong>offensive content.</strong> content that is defamatory, obscene, abusive, invasive of privacy, or otherwise objectionable.</li>
          <li><strong>dangerous content.</strong> content that contains illegal drugs or illegal drug paraphernalia, firearms, weapons, or any goods whose sale, possession, or use is subject to prohibitions or restrictions.</li>
          <li><strong>harmful content.</strong> content or other computer technology that may damage, interfere with, surreptitiously intercept, or expropriate any system, program, or data.</li>
        </ul>

        <h2 className={styles.sectionTitle}>no doxing</h2>
        <p className={styles.paragraph}>
          unless you have clear and documented written consent, you may not share an individual&apos;s private
          information or aggregate their public information for the purpose of intimidating them through harassment.
        </p>
        <p className={styles.paragraph}>
          do not upload content that contains or refers to anyone else&apos;s personal data or private or
          confidential information.
        </p>

        <h2 className={styles.sectionTitle}>no security violations</h2>
        <p className={styles.paragraph}>
          you may not use the services to violate the security or integrity of any network, computer, or
          communications system, software application, or network or computing device.
        </p>
        <p className={styles.paragraph}><strong>prohibited activities include:</strong></p>
        <ul className={styles.list}>
          <li><strong>circumventing limits.</strong> circumventing storage space limits or rate limits.</li>
          <li><strong>unauthorized access.</strong> accessing or using any system without permission.</li>
          <li><strong>interception.</strong> monitoring of data or traffic on a system without permission.</li>
          <li><strong>falsification of origin.</strong> forging tcp-ip packet headers, e-mail headers, or any part of a message describing its origin or route.</li>
          <li><strong>impersonation.</strong> impersonating a network operator, administrator, moderator, or maintainer is strictly forbidden.</li>
        </ul>

        <h2 className={styles.sectionTitle}>no network abuse</h2>
        <p className={styles.paragraph}>
          you may not make network connections to any users, hosts, or networks unless you have permission
          to communicate with them.
        </p>
        <p className={styles.paragraph}><strong>prohibited activities include:</strong></p>
        <ul className={styles.list}>
          <li><strong>monitoring or crawling.</strong> monitoring or crawling of a system that impairs or disrupts the system being monitored or crawled.</li>
          <li><strong>denial of service.</strong> inundating a target with communications requests so the target either cannot respond to legitimate traffic or responds so slowly that it becomes ineffective.</li>
          <li><strong>intentional interference.</strong> interfering with the proper functioning of any system.</li>
          <li><strong>avoiding system restrictions.</strong> using manual or electronic means to avoid any use limitations placed on a system.</li>
        </ul>

        <h2 className={styles.sectionTitle}>no email or other message abuse</h2>
        <p className={styles.paragraph}>
          you will not distribute, publish, send, or facilitate the sending of unsolicited mass e-mail or other
          messages, promotions, advertising, or solicitations (like &quot;spam&quot;), including commercial advertising and
          informational announcements.
        </p>
        <p className={styles.paragraph}>
          you will not alter or obscure mail headers or assume a sender&apos;s identity without the sender&apos;s explicit
          permission.
        </p>

        <h2 className={styles.sectionTitle}>contact</h2>
        <p className={styles.paragraph}>
          if you have any questions about this policy, please contact us at support@xors.xyz.
        </p>
      </div>
    </article>
  )
}
