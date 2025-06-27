const Product = require('../models/Product');

const generateImagePaths = (category, start, count = 5) => 
    Array.from({ length: count }, (_, i) => `/category/${category}/image${start + i}.webp`);

const allSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', 'CUSTOM SIZE'];

const products = [
  // Sharara Sets (2 products)
  {
    productId: '1',
    name: 'Mocha Sharara Set',
    description: 'Elegant Mocha Sharara Set, perfect for festive occasions and celebrations. Features intricate embroidery.',
    price: 19700,
    strikeoutPrice: 22000,
    images: generateImagePaths('sharara-set', 1),
    category: 'sharara-set',
    bestseller: true,
    sizes: allSizes,
    specifications: 'Fabric: Georgette; Work: Intricate Embroidery, Sequin Work; Occasion: Festive, Wedding; Fit: Regular Fit; Includes: Kurta, Sharara, Dupatta.'
  },
  {
    productId: '2',
    name: 'Black Sharara Set',
    description: 'A stunning Black Sharara Set that combines traditional design with a modern silhouette.',
    price: 21500,
    images: generateImagePaths('sharara-set', 6),
    category: 'sharara-set',
    sizes: allSizes,
    specifications: 'Fabric: Velvet; Work: Zari and Thread Work; Occasion: Evening, Party; Fit: Flared; Includes: Kurta, Sharara, Dupatta.'
  },
  // Draped Sets (3 products)
  {
    productId: '3',
    name: 'Black Draped Set',
    description: 'Sophisticated Black Draped Set, designed to offer a graceful and flattering look.',
    price: 18500,
    images: generateImagePaths('draped-sets', 1),
    category: 'draped-sets',
    sizes: allSizes,
    specifications: 'Fabric: Crepe Silk; Work: Hand Embellishment; Occasion: Cocktail, Reception; Fit: Asymmetric; Includes: Draped Tunic, Trousers.'
  },
  {
    productId: '4',
    name: 'Brunette Brown Draped Set',
    description: 'Rich Brunette Brown Draped Set, a unique and stylish choice for any special event.',
    price: 19200,
    strikeoutPrice: 21000,
    images: generateImagePaths('draped-sets', 6),
    category: 'draped-sets',
    sizes: allSizes,
    specifications: 'Fabric: Satin Georgette; Work: Crystal and Bead Work; Occasion: Formal, Party; Fit: Draped Silhouette; Includes: Draped Top, Skirt.'
  },
  {
    productId: '5',
    name: 'Aurora Draped Set',
    description: 'The Aurora Draped Set features a celestial design, perfect for making a statement.',
    price: 23000,
    images: generateImagePaths('draped-sets', 11),
    category: 'draped-sets',
    bestseller: true,
    sizes: allSizes,
    specifications: 'Fabric: Chiffon; Work: Abstract Print, Sequin Highlights; Occasion: Special Occasion, Modern Events; Fit: Flowy; Includes: Draped Gown.'
  },
  // Sarees (6 products)
  {
    productId: '6',
    name: 'Plum Corset Saree',
    description: 'A modern take on the classic saree, this Plum Corset Saree is both bold and beautiful.',
    price: 13200,
    images: generateImagePaths('saree', 1),
    category: 'saree',
    sizes: allSizes,
    specifications: 'Fabric: Satin; Work: Corset Bodice with Pleating; Occasion: Cocktail, Sangeet; Fit: Structured; Includes: Saree with Stitched Corset Blouse.'
  },
  {
    productId: '7',
    name: 'Velvet Royale Saree',
    description: 'Experience luxury with the Velvet Royale Saree, crafted from the finest velvet fabric.',
    price: 25500,
    images: generateImagePaths('saree', 6),
    category: 'saree',
    sizes: allSizes,
    specifications: 'Fabric: Micro Velvet; Work: Plain with Zari Border; Occasion: Royal Gatherings, Winter Weddings; Fit: Traditional Drape; Includes: Saree, Unstitched Blouse Piece.'
  },
  {
    productId: '8',
    name: 'Midnight Velvet Saree',
    description: 'Deep and mysterious, the Midnight Velvet Saree is perfect for evening events.',
    price: 26000,
    strikeoutPrice: 28500,
    images: generateImagePaths('saree', 11),
    category: 'saree',
    sizes: allSizes,
    specifications: 'Fabric: Premium Velvet; Work: Sequin and Zari Border; Occasion: Receptions, Grand Events; Fit: Slim Drape; Includes: Saree, Unstitched Blouse Piece.'
  },
  {
    productId: '9',
    name: 'Gilded Corset Saree',
    description: 'This Gilded Corset Saree features exquisite gold detailing for a truly opulent look.',
    price: 17800,
    images: generateImagePaths('saree', 16),
    category: 'saree',
    sizes: allSizes,
    specifications: 'Fabric: Organza Silk; Work: Gilded Embroidery, Corset Blouse; Occasion: Parties, Engagements; Fit: Modern Silhouette; Includes: Saree with Stitched Corset.'
  },
  {
    productId: '10',
    name: 'Embroidered Black Luxe Saree',
    description: 'A masterpiece of craftsmanship, the Embroidered Black Luxe Saree showcases detailed embroidery.',
    price: 16600,
    images: generateImagePaths('saree', 21),
    category: 'saree',
    bestseller: true,
    sizes: allSizes,
    specifications: 'Fabric: Georgette; Work: Heavy Thread and Sequin Embroidery; Occasion: Weddings, Festive; Fit: Classic; Includes: Saree, Unstitched Blouse Piece.'
  },
  {
    productId: '11',
    name: 'Satin Silk Saree',
    description: 'Smooth and lustrous, this Satin Silk Saree drapes beautifully for an elegant finish.',
    price: 14500,
    images: generateImagePaths('saree', 26),
    category: 'saree',
    sizes: allSizes,
    specifications: 'Fabric: Pure Satin Silk; Work: Minimalist, Solid Color; Occasion: Casual, Formal; Fit: Fluid Drape; Includes: Saree, Unstitched Blouse Piece.'
  }
];


const seedProducts = async () => {
    try {
        await Product.deleteMany({});
        console.log('Existing products cleared.');
        
        await Product.insertMany(products);
        console.log('Products seeded successfully!');
    } catch (err) {
        console.error('Error seeding products:', err.message);
    }
};

module.exports = seedProducts;
