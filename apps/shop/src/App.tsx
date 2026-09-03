import { useMemo, useState } from 'react';
import {
  Badge,
  CATEGORIES,
  PRODUCTS,
  ProductGrid,
  type Product,
} from '@react-mfe/ui';
import styles from './app.module.css';

// Exposed by the federation plugin as 'shop/App'. The shell renders it lazily
// at the /shop route via `lazyProvider('shop', 'App')`; it also runs standalone
// via `nx dev shop`. Same component, two hosts.
export function App() {
  const [category, setCategory] = useState<string>('All');

  const products = useMemo(
    () =>
      category === 'All'
        ? PRODUCTS
        : PRODUCTS.filter((p) => p.category === category),
    [category],
  );

  const handleAddToCart = (product: Product) => {
    // Template placeholder. Wire this to shared state / an API in a real app.
    console.log('[shop] add to cart:', product.name);
  };

  const filters = ['All', ...CATEGORIES];

  return (
    <section className={styles.shop} data-testid="shop">
      <header className={styles.hero}>
        <h1 className={styles.title}>
          Shop <Badge label="provider" />
        </h1>
        <p className={styles.subtitle}>
          {PRODUCTS.length} products across {CATEGORIES.length} categories,
          served from the <code>shop</code> micro-frontend on port 5101.
        </p>
      </header>

      <div className={styles.filters} role="tablist" aria-label="Categories">
        {filters.map((name) => (
          <button
            key={name}
            type="button"
            role="tab"
            aria-selected={category === name}
            className={`${styles.pill} ${category === name ? styles.pillActive : ''}`}
            onClick={() => setCategory(name)}
          >
            {name}
          </button>
        ))}
      </div>

      <p className={styles.count}>
        Showing {products.length} of {PRODUCTS.length}
      </p>

      <ProductGrid
        products={products}
        actionLabel="Add to cart"
        onAction={handleAddToCart}
      />
    </section>
  );
}

export default App;
