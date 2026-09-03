import { useMemo, useState } from 'react';
import { Badge, formatPrice, getProduct, StarRating } from '@react-mfe/ui';
import styles from './app.module.css';

// Seed line items reference the shared catalog by id, so prices/images stay in
// sync with the shop provider without a backend.
const INITIAL_ITEMS: Array<{ id: string; qty: number }> = [
  { id: '1', qty: 1 },
  { id: '7', qty: 2 },
  { id: '4', qty: 1 },
];

const SHIPPING = 7.5;
const TAX_RATE = 0.08;

// Exposed by the federation plugin as 'cart/App'. Renders at the shell's /cart
// route and standalone via `nx dev cart`.
export function App() {
  const [items, setItems] = useState(INITIAL_ITEMS);

  const lines = useMemo(
    () =>
      items
        .map((item) => ({ product: getProduct(item.id)!, qty: item.qty }))
        .filter((line) => line.product),
    [items],
  );

  const subtotal = lines.reduce((sum, l) => sum + l.product.price * l.qty, 0);
  const itemCount = lines.reduce((sum, l) => sum + l.qty, 0);
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax + (lines.length ? SHIPPING : 0);

  const setQty = (id: string, delta: number) =>
    setItems((prev) =>
      prev
        .map((it) => (it.id === id ? { ...it, qty: it.qty + delta } : it))
        .filter((it) => it.qty > 0),
    );

  return (
    <section className={styles.cart} data-testid="cart">
      <header className={styles.hero}>
        <h1 className={styles.title}>
          Your Cart <Badge label="provider" count={itemCount} />
        </h1>
        <p className={styles.subtitle}>
          Served from the <code>cart</code> micro-frontend on port 5102.
        </p>
      </header>

      <div className={styles.layout}>
        <ul className={styles.lines}>
          {lines.length === 0 && (
            <li className={styles.empty}>Cart is empty.</li>
          )}
          {lines.map(({ product, qty }) => (
            <li key={product.id} className={styles.line}>
              <img
                className={styles.thumb}
                src={product.imageUrl}
                alt={product.name}
                loading="lazy"
              />
              <div className={styles.info}>
                <span className={styles.name}>{product.name}</span>
                <span className={styles.category}>{product.category}</span>
                <StarRating
                  rating={product.rating}
                  reviewCount={product.reviewCount}
                />
              </div>
              <div className={styles.qty}>
                <button
                  type="button"
                  aria-label={`Decrease ${product.name}`}
                  onClick={() => setQty(product.id, -1)}
                >
                  −
                </button>
                <span>{qty}</span>
                <button
                  type="button"
                  aria-label={`Increase ${product.name}`}
                  onClick={() => setQty(product.id, 1)}
                >
                  +
                </button>
              </div>
              <span className={styles.linePrice}>
                {formatPrice(product.price * qty)}
              </span>
            </li>
          ))}
        </ul>

        <aside className={styles.summary}>
          <h2 className={styles.summaryTitle}>Order Summary</h2>
          <dl className={styles.summaryRows}>
            <div>
              <dt>Subtotal ({itemCount} items)</dt>
              <dd>{formatPrice(subtotal)}</dd>
            </div>
            <div>
              <dt>Shipping</dt>
              <dd>{lines.length ? formatPrice(SHIPPING) : '—'}</dd>
            </div>
            <div>
              <dt>Tax (8%)</dt>
              <dd>{formatPrice(tax)}</dd>
            </div>
          </dl>
          <div className={styles.total}>
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
          <button
            type="button"
            className={styles.checkout}
            disabled={lines.length === 0}
          >
            Checkout
          </button>
        </aside>
      </div>
    </section>
  );
}

export default App;
