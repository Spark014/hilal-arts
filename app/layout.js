import { Amiri, Cinzel, Cormorant_Garamond, Reem_Kufi } from 'next/font/google';
import './globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CartProvider from '../lib/CartContext';
import CartDrawer from '../components/CartDrawer';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
});

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cinzel',
});

const amiri = Amiri({
  subsets: ['latin', 'arabic'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-amiri',
});

const reemKufi = Reem_Kufi({
  subsets: ['latin', 'arabic'],
  weight: ['400', '500', '600'],
  variable: '--font-reem',
});

export const metadata = {
  title: 'HILAL Arts — Sacred Calligraphy on Canvas',
  description: 'Hand-composed by master calligraphers across Istanbul, Cairo, and Lahore — finished in our atelier with metallic leaf and archival care.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${cinzel.variable} ${amiri.variable} ${reemKufi.variable}`}>
      <body className={cormorant.className}>
        <CartProvider>
          <div className="grain"></div>
          
          <div className="filigree-top"></div>
          
          <div className="announce">
            Complimentary white-glove delivery <span>◆</span> Limited editions, hand-finished <span>◆</span> Worldwide shipping
          </div>

          <Header />
          <CartDrawer />
          <main>{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
