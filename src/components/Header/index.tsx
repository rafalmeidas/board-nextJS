/* eslint-disable @next/next/link-passhref */
/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Link from 'next/link';

import SignButton from '../SignInButton';

import styles from './styles.module.scss';

import Image from 'next/image';
import logo from '../../../public/images/logo.svg';

export default function Header() {
  return (
    <>
      <header className={styles.headerContainer}>
        <div className={styles.headerContent}>
          <Link href="/">
            <a>
              <Image src={logo} alt="Logo meu board" />
            </a>
          </Link>
          <nav>
            <Link href="/">
              <a>Home</a>
            </Link>
            <Link href="/board">
              <a>Meu Board</a>
            </Link>
          </nav>

          <SignButton />
        </div>
      </header>
    </>
  );
}
