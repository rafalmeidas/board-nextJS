/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { FaGithub } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';
import { signIn, signOut, useSession } from 'next-auth/client';

import styles from './styles.module.scss';

import Image from 'next/image';

export default function SignInButton() {
  const [session] = useSession();

  return session ? (
    <button
      type="button"
      className={styles.signInButton}
      onClick={() => signOut()}
    >
      <div>
        <Image
          objectFit="fill"
          width={35}
          height={35}
          src={session.user.image}
          alt="Foto do usuário"
        />
      </div>
      Olá {session.user.name}
      <FiX color="#737380" className={styles.closeIcon} />
    </button>
  ) : (
    <button
      type="button"
      className={styles.signInButton}
      onClick={() => signIn('github')}
    >
      <FaGithub color="#FFB800" />
      Entrar com github
    </button>
  );
}
