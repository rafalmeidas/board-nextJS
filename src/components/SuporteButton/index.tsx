/* eslint-disable @next/next/link-passhref */
import React from 'react';
import Link from 'next/link';

import styles from './styles.module.scss';
export default function SuporteButton() {
  return (
    <div className={styles.donateContainer}>
      <Link href="/donate">
        <button>Apoiar</button>
      </Link>
    </div>
  );
}
