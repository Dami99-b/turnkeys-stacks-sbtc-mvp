import '../styles/globals.css';
import ToastRoot from '../components/ToastRoot';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <ToastRoot />
    </>
  );
}
