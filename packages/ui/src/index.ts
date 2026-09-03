// Side-effect import: ships the global theme to any app that imports the lib
// (shell, shop, cart all do), so design tokens load in one place. See theme.css.
import './lib/theme.css';

export * from './lib/Badge';
export * from './lib/products';
export * from './lib/StarRating';
export * from './lib/ProductCard';
export * from './lib/ProductGrid';
