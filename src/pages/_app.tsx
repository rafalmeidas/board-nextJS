import { AppProps } from 'next/app';
import { Provider as NextAuthProvider } from 'next-auth/client';

import '../styles/global.scss';
import Header from '../components/Header';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
// AXCowrA_3_uANK6bbRwJLyRUhyFfpQqET6To0gSYHcPI1Tw9vbVnB0kGjTizAaQdy5ntiE4P4a34qip0
const initialOptions = {
  'client-id':
    'AXCowrA_3_uANK6bbRwJLyRUhyFfpQqET6To0gSYHcPI1Tw9vbVnB0kGjTizAaQdy5ntiE4P4a34qip0',
  currency: 'BRL',
  intent: 'capture',
};

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <NextAuthProvider session={pageProps.session}>
      <PayPalScriptProvider options={initialOptions}>
        <Header />
        <Component {...pageProps} />
      </PayPalScriptProvider>
    </NextAuthProvider>
  );
}

export default MyApp;
