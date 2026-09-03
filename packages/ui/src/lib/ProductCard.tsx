import type { Product } from './products';
import { formatPrice } from './products';
import { StarRating } from './StarRating';
import styles from './ProductCard.module.css';

export interface ProductCardProps {
  product: Product;
  // Optional CTA. When provided, a button renders in the card footer.
  actionLabel?: string;
  onAction?: (product: Product) => void;
}

export function ProductCard({
  product,
  actionLabel,
  onAction,
}: ProductCardProps) {
  return (
    <article
      className={`${styles.card} ${!product.inStock ? styles.outOfStock : ''}`}
    >
      <div className={styles.media}>
        <img src={product.imageUrl} alt={product.name} loading="lazy" />
        <span className={styles.category}>{product.category}</span>
        {!product.inStock && (
          <span className={styles.soldOut}>Out of stock</span>
        )}
      </div>

      <div className={styles.body}>
        <h3 className={styles.name}>{product.name}</h3>
        <p className={styles.description}>{product.description}</p>
        <StarRating rating={product.rating} reviewCount={product.reviewCount} />

        <div className={styles.footer}>
          <span className={styles.price}>{formatPrice(product.price)}</span>
          {actionLabel && (
            <button
              type="button"
              className={styles.action}
              disabled={!product.inStock}
              onClick={() => onAction?.(product)}
            >
              {actionLabel}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
