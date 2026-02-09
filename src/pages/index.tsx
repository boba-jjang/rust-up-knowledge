import type {ReactNode} from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();

  return (
    <header className={clsx('hero', styles.hero)}>
      <div className={styles.heroInner}>
        <img
          className={styles.heroLogo}
          alt={siteConfig.title}
          src={useBaseUrl('img/rust.png')}
        />

        <h1 className={styles.heroTitle}>
          Quick refresher for busy engineers
        </h1>

        <p className={styles.heroSubtitle}>
          A giant, collapsible Rust Cheatsheet for fast recall
        </p>

        <div className={styles.heroCtas}>
          <Link className="button button--primary button--lg" to="/docs/intro">
            Start reading now →
          </Link>
        </div>

        <p className={styles.heroSecondary}>
          Or jump straight to the <Link to="/docs/Cheatsheet">full Cheatsheet</Link>.
        </p>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  return (
    <Layout description="A living Rust Cheatsheet built from the Rust Book (2021).">
      <HomepageHeader />
      <main />
    </Layout>
  );
}