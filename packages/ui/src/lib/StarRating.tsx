import styles from './StarRating.module.css';

export interface StarRatingProps {
  rating: number;
  reviewCount?: number;
}

// Five-star display rounded to the nearest whole star. Read-only.
export function StarRating({ rating, reviewCount }: StarRatingProps) {
  return (
    <span className={styles.rating} aria-label={`${rating} out of 5 stars`}>
      <span className={styles.stars}>
        {Array.from({ length: 5 }, (_, i) => (
          <span key={i} className={i < Math.round(rating) ? styles.filled : ''}>
            ★
          </span>
        ))}
      </span>
      {reviewCount !== undefined && (
        <span className={styles.count}>({reviewCount})</span>
      )}
    </span>
  );
}

export default StarRating;
