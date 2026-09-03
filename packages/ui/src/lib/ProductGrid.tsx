import type { Product } from './products';
import { ProductCard } from './ProductCard';
import styles from './ProductGrid.module.css';

export interface ProductGridProps {
  products: Product[];
  actionLabel?: string;
  onAction?: (product: Product) => void;
}

export function ProductGrid({
  products,
  actionLabel,
  onAction,
}: ProductGridProps) {
  if (products.length === 0) {
    return <p className={styles.empty}>No products match your filter.</p>;
  }

  return (
    <div className={styles.grid}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          actionLabel={actionLabel}
          onAction={onAction}
        />
      ))}
    </div>
  );
}

export default ProductGrid;
