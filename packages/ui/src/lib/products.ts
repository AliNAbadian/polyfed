// Shared sample catalog. Lives in the UI lib so every provider renders the same
// data without a backend - the shop grid and the cart line-items both read from
// here. Swap this module for a real data hook/API in a production app.

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  inStock: boolean;
  rating: number;
  reviewCount: number;
}

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Wireless Bluetooth Headphones',
    description:
      'Active noise cancellation, 30-hour battery, and studio-grade sound.',
    price: 199.99,
    category: 'Electronics',
    imageUrl:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    inStock: true,
    rating: 4.5,
    reviewCount: 234,
  },
  {
    id: '2',
    name: 'Smart Watch Pro',
    description: 'Fitness tracking, heart-rate, GPS, and phone integration.',
    price: 349.99,
    category: 'Electronics',
    imageUrl:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
    inStock: true,
    rating: 4.3,
    reviewCount: 189,
  },
  {
    id: '3',
    name: 'Organic Cotton T-Shirt',
    description: 'Soft, breathable, sustainably sourced everyday tee.',
    price: 29.99,
    category: 'Clothing',
    imageUrl:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
    inStock: false,
    rating: 4.7,
    reviewCount: 92,
  },
  {
    id: '4',
    name: 'Stainless Steel Water Bottle',
    description: 'Keeps drinks cold 24h or hot 12h. Leak-proof lid.',
    price: 24.99,
    category: 'Home & Kitchen',
    imageUrl:
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500',
    inStock: true,
    rating: 4.6,
    reviewCount: 412,
  },
  {
    id: '5',
    name: 'Yoga Mat Premium',
    description: 'Non-slip, eco-friendly mat with extra cushioning.',
    price: 45.99,
    category: 'Sports',
    imageUrl:
      'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500',
    inStock: true,
    rating: 4.4,
    reviewCount: 156,
  },
  {
    id: '6',
    name: 'Portable Charger 20000mAh',
    description: 'High-capacity power bank with fast charging, dual USB.',
    price: 59.99,
    category: 'Electronics',
    imageUrl:
      'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500',
    inStock: true,
    rating: 4.2,
    reviewCount: 298,
  },
  {
    id: '7',
    name: 'Running Shoes Elite',
    description: 'Responsive cushioning and a breathable mesh upper.',
    price: 129.99,
    category: 'Sports',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
    inStock: true,
    rating: 4.8,
    reviewCount: 523,
  },
  {
    id: '8',
    name: 'Coffee Maker Deluxe',
    description: 'Programmable brewer with thermal carafe and brew strength.',
    price: 89.99,
    category: 'Home & Kitchen',
    imageUrl:
      'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500',
    inStock: false,
    rating: 4.1,
    reviewCount: 167,
  },
  {
    id: '9',
    name: 'Backpack Urban Explorer',
    description: 'Durable pack with padded laptop sleeve and smart pockets.',
    price: 79.99,
    category: 'Accessories',
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
    inStock: true,
    rating: 4.5,
    reviewCount: 201,
  },
  {
    id: '10',
    name: 'Wireless Keyboard & Mouse',
    description: 'Ergonomic combo with quiet keys and long battery life.',
    price: 69.99,
    category: 'Electronics',
    imageUrl:
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500',
    inStock: true,
    rating: 4.3,
    reviewCount: 145,
  },
  {
    id: '11',
    name: 'Polarized Sunglasses',
    description: 'UV-protection lenses in a lightweight stylish frame.',
    price: 149.99,
    category: 'Accessories',
    imageUrl:
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500',
    inStock: true,
    rating: 4.6,
    reviewCount: 89,
  },
  {
    id: '12',
    name: 'LED Desk Lamp',
    description: 'Touch dimming, adjustable arm, and warm/cool modes.',
    price: 39.99,
    category: 'Home & Kitchen',
    imageUrl:
      'https://images.unsplash.com/photo-1565306257569-4eb0e3c41b24?w=500',
    inStock: true,
    rating: 4.4,
    reviewCount: 276,
  },
];

export const CATEGORIES: string[] = Array.from(
  new Set(PRODUCTS.map((p) => p.category)),
).sort();

export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function formatPrice(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}
