import type { Product } from './types';

const products: Product[] = [
  {
    id: '1',
    name: 'Mocha Sharara Set',
    description: 'A timeless trench coat made from water-resistant cotton gabardine. Perfect for transitional weather.',
    price: 19700,
    images: ['/category/sharara-set/image1.webp', '/category/sharara-set/image2.webp', '/category/sharara-set/image3.webp'],
    category: 'sharara-set',
  },
  {
    id: '2',
    name: 'Plum Corset Saree',
    description: 'An elegant blouse made from a luxurious silk blend. Features a relaxed fit and buttoned cuffs.',
    price: 13200,
    images: ['/category/saree/image1.webp', '/category/saree/image2.webp'],
    category: 'saree',
  },
  {
    id: '3',
    name: 'Satin Silk Saree',
    description: 'Chic high-waisted trousers with a wide-leg silhouette. Made from a comfortable and durable fabric.',
    price: 16600,
    images: ['/category/saree/image3.webp'],
    category: 'saree',
  },
  {
    id: '4',
    name: 'Embroidered Black Luxe',
    description: 'Versatile ankle boots crafted from genuine leather. Features a stacked heel for all-day comfort.',
    price: 16500,
    images: ['/category/draped-sets/image1.webp', '/category/draped-sets/image2.webp'],
    category: 'draped-sets',
    bestseller: true,
  },
  {
    id: '5',
    name: 'Ruby Red Anarkali',
    description: 'A luxuriously soft V-neck sweater made from 100% pure cashmere. A wardrobe essential.',
    price: 22000,
    images: ['/category/draped-sets/image3.webp'],
    category: 'draped-sets',
  },
  {
    id: '6',
    name: 'Ivory & Gold Lehenga',
    description: 'A sharp, single-breasted blazer in a fine wool blend. Fully lined for a smooth fit.',
    price: 30000,
    images: ['/category/draped-sets/image3.webp', '/category/draped-sets/image5.webp'],
    category: 'draped-sets',
  },
  {
    id: '7',
    name: 'Forest Green Kurta Set',
    description: 'Classic straight-leg jeans in a vintage wash. Made from premium non-stretch denim.',
    price: 13000,
    images: ['/category/sharara-set/image2.webp'],
    category: 'sharara-set',
  },
  {
    id: '8',
    name: 'Pearl White Sharara',
    description: 'A minimalist crossbody bag in supple Italian leather, with an adjustable strap and secure zip closure.',
    price: 19000,
    images: ['/category/sharara-set/image2.webp'],
    category: 'sharara-set',
  },
  {
    id: '9',
    name: 'Sunset Orange Saree',
    description: 'An airy linen midi dress with a square neckline and a comfortable, smocked back. Ideal for warm days.',
    price: 16000,
    images: [ '/category/saree/image5.webp'],
    category: 'saree',
  },
  {
    id: '10',
    name: 'Royal Blue Gown',
    description: 'Elegant and lightweight gold-plated hoop earrings. A subtle statement piece for everyday wear.',
    price: 18500,
    images: ['/category/draped-sets/image2.webp'],
    category: 'draped-sets',
  },
    {
    id: '11',
    name: 'Pastel Pink Kurti Set',
    description: 'A beautiful Mocha Sharara Set for festive occasions.',
    price: 11500,
    images: ['/category/sharara-set/image2.webp'],
    category: 'sharara-set',
  },
  {
    id: '12',
    name: 'Black & Gold Sherwani',
    description: 'A stunning Plum Corset Saree with intricate details.',
    price: 24000,
    images: ['/category/draped-sets/image1.webp'],
    category: 'draped-sets',
  },
  {
    id: '13',
    name: 'Maroon Velvet Blouse',
    description: 'A gorgeous Satin Silk Saree in a vibrant color.',
    price: 9800,
    images: ['/category/saree/image6.webp'],
    category: 'saree',
  }
];

export async function getProducts(): Promise<Product[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return products;
}

export async function getProductById(id: string): Promise<Product | undefined> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return products.find(p => p.id === id);
}

export async function getProductsByIds(ids: string[]): Promise<Product[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return products.filter(p => ids.includes(p.id));
}
