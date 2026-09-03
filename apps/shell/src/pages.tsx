import { Link } from '@tanstack/react-router';
import { Badge } from '@react-mfe/ui';
import { lazyProvider } from './mf';
import { ProviderBoundary } from './ProviderBoundary';
import styles from './app.module.css';

// Each federated module gets its own page. The shell owns routing/chrome; the
// provider owns the page body, loaded over Module Federation at runtime.
const ShopApp = lazyProvider('shop', 'App');
const CartApp = lazyProvider('cart', 'App');

export function ShopPage() {
  return (
    <ProviderBoundary name="shop">
      <ShopApp />
    </ProviderBoundary>
  );
}

export function CartPage() {
  return (
    <ProviderBoundary name="cart">
      <CartApp />
    </ProviderBoundary>
  );
}

const MODULES = [
  {
    to: '/shop' as const,
    name: 'shop',
    title: 'Shop',
    blurb: 'Product catalog with category filtering, served on port 5101.',
  },
  {
    to: '/cart' as const,
    name: 'cart',
    title: 'Cart',
    blurb:
      'Live order summary with quantities and totals, served on port 5102.',
  },
];

export function HomePage() {
  return (
    <div className={styles.home}>
      <section className={styles.intro}>
        <Badge label="shell · consumer" />
        <h1>One shell, many micro-frontends.</h1>
        <p>
          This host loads each provider at runtime over Module Federation and
          gives it a route. Open a module below, or run it on its own with{' '}
          <code>nx dev shop</code> / <code>nx dev cart</code> - the shell comes
          along automatically.
        </p>
      </section>

      <div className={styles.moduleGrid}>
        {MODULES.map((m) => (
          <Link key={m.name} to={m.to} className={styles.moduleCard}>
            <div className={styles.moduleHead}>
              <h2>{m.title}</h2>
              <Badge label="provider" />
            </div>
            <p>{m.blurb}</p>
            <span className={styles.moduleCta}>Open {m.title} →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
