const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Product = require('../models/Product');
// const Banner = require('../models/Banner');
const Category = require('../models/Category');
const User = require('../models/User');
const Order = require('../models/Order');
const connectDB = require('../config/db');


const allSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', 'CUSTOM SIZE', 'ONE SIZE'];
const accessorySizes = ['One Size'];

const products = [
  // Sharara Sets (2 products)
  {
    productId: '1',
    name: 'Mocha Sharara Set',
    description: 'Elegant Mocha Sharara Set, perfect for festive occasions and celebrations. Features intricate embroidery.',
    price: 19700,
    strikeoutPrice: 22000,
    images: [
      '/category/sharara-set/image1.webp',
      '/category/sharara-set/image2.webp',
      '/category/sharara-set/image1.webp',
      '/category/sharara-set/image2.webp',
    ],
    category: 'sharara-set',
    bestseller: true,
    sizes: allSizes,
    specifications: 'Fabric: Georgette; Work: Intricate Embroidery, Sequin Work; Occasion: Festive, Wedding; Fit: Regular Fit; Includes: Kurta, Sharara, Dupatta.',
    quantity: 5,
  },
  {
    productId: '2',
    name: 'Black Sharara Set',
    description: 'A stunning Black Sharara Set that combines traditional design with a modern silhouette.',
    price: 21500,
    images: [
      '/category/sharara-set/image3.webp',
      '/category/sharara-set/image4.webp',
      '/category/sharara-set/image3.webp',
      '/category/sharara-set/image4.webp',
    ],
    category: 'sharara-set',
    sizes: allSizes,
    specifications: 'Fabric: Velvet; Work: Zari and Thread Work; Occasion: Evening, Party; Fit: Flared; Includes: Kurta, Sharara, Dupatta.',
    quantity: 5,
  },
  // Draped Sets (3 products)
  {
    productId: '3',
    name: 'Black Draped Set',
    description: 'Sophisticated Black Draped Set, designed to offer a graceful and flattering look.',
    price: 18500,
    images: [
       '/category/draped-sets/image1.webp',
       '/category/draped-sets/image2.webp', 
       '/category/draped-sets/image1.webp', 
       '/category/draped-sets/image2.webp', 
      ],
    category: 'draped-sets',
    sizes: allSizes,
    specifications: 'Fabric: Crepe Silk; Work: Hand Embellishment; Occasion: Cocktail, Reception; Fit: Asymmetric; Includes: Draped Tunic, Trousers.',
    quantity: 5,
    bestseller: true,
  },
  {
    productId: '4',
    name: 'Brunette Brown Draped Set',
    description: 'Rich Brunette Brown Draped Set, a unique and stylish choice for any special event.',
    price: 19200,
    strikeoutPrice: 21000,
    images: [
        '/category/draped-sets/image3.webp',
        '/category/draped-sets/image4.webp',
        '/category/draped-sets/image3.webp',
        '/category/draped-sets/image4.webp',
    ],
    category: 'draped-sets',
    sizes: allSizes,
    specifications: 'Fabric: Satin Georgette; Work: Crystal and Bead Work; Occasion: Formal, Party; Fit: Draped Silhouette; Includes: Draped Top, Skirt.',
    quantity: 5,
  },
  {
    productId: '5',
    name: 'Aurora Draped Set',
    description: 'The Aurora Draped Set features a celestial design, perfect for making a statement.',
    price: 23000,
    images: [
        '/category/draped-sets/image5.webp',
        '/category/draped-sets/image6.webp',
        '/category/draped-sets/image5.webp',
        '/category/draped-sets/image6.webp',
    ],
    category: 'draped-sets',
    bestseller: true,
    sizes: allSizes,
    specifications: 'Fabric: Chiffon; Work: Abstract Print, Sequin Highlights; Occasion: Special Occasion, Modern Events; Fit: Flowy; Includes: Draped Gown.',
    quantity: 5,
  },
  // Sarees (6 products)
  {
    productId: '6',
    name: 'Plum Corset Saree',
    description: 'A modern take on the classic saree, this Plum Corset Saree is both bold and beautiful.',
    price: 13200,
    images: [
        '/category/saree/image1.webp',
        '/category/saree/image2.webp',
        '/category/saree/image1.webp',
        '/category/saree/image2.webp',
    ],
    category: 'saree',
    sizes: allSizes,
    specifications: 'Fabric: Satin; Work: Corset Bodice with Pleating; Occasion: Cocktail, Sangeet; Fit: Structured; Includes: Saree with Stitched Corset Blouse.',
    quantity: 5,
    bestseller: true,
  },
  {
    productId: '7',
    name: 'Velvet Royale Saree',
    description: 'Experience luxury with the Velvet Royale Saree, crafted from the finest velvet fabric.',
    price: 25500,
    images: [
        '/category/saree/image3.webp',
        '/category/saree/image4.webp',
        '/category/saree/image3.webp',
        '/category/saree/image4.webp',
    ],
    category: 'saree',
    sizes: allSizes,
    specifications: 'Fabric: Micro Velvet; Work: Plain with Zari Border; Occasion: Royal Gatherings, Winter Weddings; Fit: Traditional Drape; Includes: Saree, Unstitched Blouse Piece.',
    quantity: 5,
  },
  {
    productId: '8',
    name: 'Midnight Velvet Saree',
    description: 'Deep and mysterious, the Midnight Velvet Saree is perfect for evening events.',
    price: 26000,
    strikeoutPrice: 28500,
    images: [
        '/category/saree/image5.webp',
        '/category/saree/image6.webp',
        '/category/saree/image5.webp',
        '/category/saree/image6.webp',
    ],
    category: 'saree',
    sizes: allSizes,
    specifications: 'Fabric: Premium Velvet; Work: Sequin and Zari Border; Occasion: Receptions, Grand Events; Fit: Slim Drape; Includes: Saree, Unstitched Blouse Piece.',
    quantity: 5,
  },
  {
    productId: '9',
    name: 'Gilded Corset Saree',
    description: 'This Gilded Corset Saree features exquisite gold detailing for a truly opulent look.',
    price: 17800,
    images: [
        '/category/saree/image7.webp',
        '/category/saree/image8.webp',
        '/category/saree/image7.webp',
        '/category/saree/image8.webp',
    ],
    category: 'saree',
    sizes: allSizes,
    specifications: 'Fabric: Organza Silk; Work: Gilded Embroidery, Corset Blouse; Occasion: Parties, Engagements; Fit: Modern Silhouette; Includes: Saree with Stitched Corset.',
    quantity: 5,
  },
  {
    productId: '10',
    name: 'Embroidered Black Luxe Saree',
    description: 'A masterpiece of craftsmanship, the Embroidered Black Luxe Saree showcases detailed embroidery.',
    price: 16600,
    images: [
        '/category/saree/image9.webp',
        '/category/saree/image10.webp',
        '/category/saree/image9.webp',
        '/category/saree/image10.webp',
    ],
    category: 'saree',
    bestseller: true,
    sizes: allSizes,
    specifications: 'Fabric: Georgette; Work: Heavy Thread and Sequin Embroidery; Occasion: Weddings, Festive; Fit: Classic; Includes: Saree, Unstitched Blouse Piece.',
    quantity: 5,
  },
  {
    productId: '11',
    name: 'Satin Silk Saree',
    description: 'Smooth and lustrous, this Satin Silk Saree drapes beautifully for an elegant finish.',
    price: 14500,
    images: [
        '/category/saree/image11.webp',
        '/category/saree/image12.webp',
        '/category/saree/image11.webp',
        '/category/saree/image12.webp',
    ],
    category: 'saree',
    sizes: allSizes,
    specifications: 'Fabric: Pure Satin Silk; Work: Minimalist, Solid Color; Occasion: Casual, Formal; Fit: Fluid Drape; Includes: Saree, Unstitched Blouse Piece.',
    quantity: 5,
     },
  // Ethnic Sets (3 products)
  {
    productId: '12',
    name: 'Rose Gold Anarkali Set',
    description: 'A beautiful Anarkali set in rose gold, perfect for weddings.',
    price: 28000,
    images: [
      '/category/ethnic-sets/image1.jpg',
      '/category/ethnic-sets/image2.jpg',
      '/category/ethnic-sets/image3.jpg',
      '/category/ethnic-sets/image4.jpg',
    ],
    category: 'ethnic-sets',
    sizes: allSizes,
    specifications: 'Fabric: Silk; Includes: Anarkali, Churidar, Dupatta.',
    quantity: 5,
  },
  {
    productId: '13',
    name: 'Indigo Palazzo Set',
    description: 'Comfortable and stylish palazzo set in a deep indigo hue.',
    price: 15500,
    images: [
      '/category/ethnic-sets/image5.webp',
      '/category/ethnic-sets/image6.webp',
      '/category/ethnic-sets/image7.webp',
      '/category/ethnic-sets/image8.webp',
    ],
    category: 'ethnic-sets',
    sizes: allSizes,
    specifications: 'Fabric: Cotton; Includes: Kurta, Palazzo, Dupatta.',
    quantity: 5,
  },
  {
    productId: '14',
    name: 'Mustard Yellow Kurta Set',
    description: 'A vibrant mustard yellow kurta set for a cheerful look.',
    price: 12300,
    images: [
      '/category/ethnic-sets/image9.webp',
      '/category/ethnic-sets/image10.webp',
      '/category/ethnic-sets/image11.webp',
      '/category/ethnic-sets/image12.webp',
    ],
    category: 'ethnic-sets',
    sizes: allSizes,
    specifications: 'Fabric: Rayon; Includes: Kurta, Trousers.',
    quantity: 5,
  },
  // Dresses (3 products)
  {
    productId: '15',
    name: 'Crimson Red Maxi Dress',
    description: 'A flowing maxi dress in a bold crimson red.',
    price: 19800,
    images: [
      '/category/dresses/image1.webp',
      '/category/dresses/image2.webp',
      '/category/dresses/image3.webp',
      '/category/dresses/image4.webp',
    ],
    category: 'dresses',
    sizes: allSizes,
    specifications: 'Fabric: Georgette; Fit: Maxi.',
    quantity: 5,
  },
  {
    productId: '16',
    name: 'Emerald Green Cocktail Dress',
    description: 'A chic cocktail dress in a stunning emerald green.',
    price: 21000,
    images: [
      '/category/dresses/image5.webp',
      '/category/dresses/image6.webp',
      '/category/dresses/image5.webp',
      '/category/dresses/image6.webp',
    ],
    category: 'dresses',
    sizes: allSizes,
    specifications: 'Fabric: Satin; Fit: Sheath.',
    quantity: 5,
  },
  {
    productId: '17',
    name: 'Lavender Midi Dress',
    description: 'A sweet and simple lavender midi dress.',
    price: 14000,
    images: [
      '/category/dresses/image7.jpg',
      '/category/dresses/image8.jpg',
      '/category/dresses/image9.jpg',
      '/category/dresses/image10.jpg',
    ],
    category: 'dresses',
    sizes: allSizes,
    specifications: 'Fabric: Linen; Fit: A-Line.',
    quantity: 5,
  },
  // Pre-drape Sarees (3 products)
  {
    productId: '18',
    name: 'Sequined Pre-draped Saree',
    description: 'Dazzle in this easy-to-wear sequined pre-draped saree.',
    price: 25000,
    images: [
      '/category/pre-drape-sarees/image1.webp',
      '/category/pre-drape-sarees/image2.webp',
      '/category/pre-drape-sarees/image3.jpg',
      '/category/pre-drape-sarees/image4.jpg',
    ],
    category: 'pre-drape-sarees',
    sizes: allSizes,
    specifications: 'Fabric: Georgette with Sequins; Includes: Saree, Blouse.',
    quantity: 5,
  },
  {
    productId: '19',
    name: 'Ruffled Pre-draped Saree',
    description: 'A modern and trendy ruffled pre-draped saree.',
    price: 23500,
    images: [
      '/category/pre-drape-sarees/image5.webp',
      '/category/pre-drape-sarees/image6.jpg',
      '/category/pre-drape-sarees/image7.jpg',
      '/category/pre-drape-sarees/image5.webp',
    ],
    category: 'pre-drape-sarees',
    sizes: allSizes,
    specifications: 'Fabric: Chiffon; Includes: Saree, Blouse.',
    quantity: 5,
  },
  {
    productId: '20',
    name: 'Pastel Blue Pre-draped Saree',
    description: 'An elegant pastel blue saree, pre-draped for convenience.',
    price: 22000,
    images: [
      '/category/pre-drape-sarees/image8.jpg',
      '/category/pre-drape-sarees/image9.webp',
      '/category/pre-drape-sarees/image10.jpg',
      '/category/pre-drape-sarees/image9.webp',
    ],
    category: 'pre-drape-sarees',
    sizes: allSizes,
    specifications: 'Fabric: Crepe; Includes: Saree, Blouse.',
    quantity: 5,
  },
  // Chains (3 products)
  {
    productId: '21',
    name: 'Gold Plated Link Chain',
    description: 'A classic gold plated link chain for everyday wear.',
    price: 3500,
    images: [
      '/category/chains/image1.webp',
      '/category/chains/image1.webp',
      '/category/chains/image1.webp',
      '/category/chains/image1.webp',
    ],
    category: 'chains',
    sizes: accessorySizes,
    specifications: 'Material: Brass; Plating: Gold.',
    quantity: 5,
  },
  {
    productId: '22',
    name: 'Silver Delicate Chain',
    description: 'A delicate silver chain with a minimalist pendant.',
    price: 2800,
    images: [
      '/category/chains/image2.jpeg',
      '/category/chains/image2.jpeg',
      '/category/chains/image2.jpeg',
      '/category/chains/image2.jpeg',
    ],
    category: 'chains',
    sizes: accessorySizes,
    specifications: 'Material: Sterling Silver.',
    quantity: 5,
  },
  {
    productId: '23',
    name: 'Rose Gold Chain',
    description: 'A beautiful rose gold chain to add a touch of color.',
    price: 3800,
    images: [
      '/category/chains/image3.jpeg',
      '/category/chains/image3.jpeg',
      '/category/chains/image3.jpeg',
      '/category/chains/image3.jpeg',
    ],
    category: 'chains',
    sizes: accessorySizes,
    specifications: 'Material: Copper Alloy; Plating: Rose Gold.',
    quantity: 5,
  },
  // Studs (3 products)
  {
    productId: '24',
    name: 'Diamond Look Studs',
    description: 'Elegant studs that give the look of real diamonds.',
    price: 4500,
    images: [
      '/category/studs/image1.jpeg',
      '/category/studs/image1.jpeg',
      '/category/studs/image1.jpeg',
      '/category/studs/image1.jpeg',
    ],
    category: 'studs',
    sizes: accessorySizes,
    specifications: 'Material: Cubic Zirconia, Alloy.',
    quantity: 5,
  },
  {
    productId: '25',
    name: 'Pearl Stud Earrings',
    description: 'Classic pearl studs for a timeless look.',
    price: 3200,
    images: [
      '/category/studs/image2.jpeg',
      '/category/studs/image2.jpeg',
      '/category/studs/image2.jpeg',
      '/category/studs/image2.jpeg',
    ],
    category: 'studs',
    sizes: accessorySizes,
    specifications: 'Material: Faux Pearl, Stainless Steel.',
    quantity: 5,
  },
  {
    productId: '26',
    name: 'Kundan Flower Studs',
    description: 'Traditional kundan studs in a floral design.',
    price: 5500,
    images: [
      '/category/studs/image3.jpeg',
      '/category/studs/image3.jpeg',
      '/category/studs/image3.jpeg',
      '/category/studs/image3.jpeg',
    ],
    category: 'studs',
    sizes: accessorySizes,
    specifications: 'Material: Kundan, Brass.',
    quantity: 5,
  },
  // Anklets (3 products)
  {
    productId: '27',
    name: 'Oxidised Silver Anklet',
    description: 'A traditional oxidised silver anklet with ghungroos.',
    price: 2500,
    images: [
      '/category/anklets/image1.jpeg',
      '/category/anklets/image1.jpeg',
      '/category/anklets/image1.jpeg',
      '/category/anklets/image1.jpeg',
    ],
    category: 'anklets',
    sizes: accessorySizes,
    specifications: 'Material: German Silver.',
    quantity: 5,
  },
  {
    productId: '28',
    name: 'Gold Beaded Anklet',
    description: 'A simple and elegant gold beaded anklet.',
    price: 2100,
    images: [
       '/category/anklets/image2.jpeg',
       '/category/anklets/image2.jpeg',
       '/category/anklets/image2.jpeg',
       '/category/anklets/image2.jpeg',
    ],
    category: 'anklets',
    sizes: accessorySizes,
    specifications: 'Material: Brass, Gold Plating.',
    quantity: 5,
  },
  {
    productId: '29',
    name: 'Evil Eye Anklet',
    description: 'A trendy evil eye anklet to ward off negativity.',
    price: 1800,
    images: [
      '/category/anklets/image3.jpeg',
      '/category/anklets/image3.jpeg',
      '/category/anklets/image3.jpeg',
      '/category/anklets/image3.jpeg',
    ],
    category: 'anklets',
    sizes: accessorySizes,
    specifications: 'Material: Thread, Glass Beads.',
    quantity: 5,
  },
  // Bracelets (3 products)
  {
    productId: '30',
    name: 'American Diamond Bracelet',
    description: 'A sparkling American diamond bracelet for special occasions.',
    price: 6500,
    images: [
      '/category/bracelets/image1.jpeg',
      '/category/bracelets/image1.jpeg',
      '/category/bracelets/image1.jpeg',
      '/category/bracelets/image1.jpeg',
    ],
    category: 'bracelets',
    sizes: accessorySizes,
    specifications: 'Material: Cubic Zirconia, Rhodium Plating.',
    quantity: 5,
  },
  {
    productId: '31',
    name: 'Charm Bracelet',
    description: 'A fun and quirky charm bracelet.',
    price: 3800,
    images: [
      '/category/bracelets/image2.jpeg',
      '/category/bracelets/image2.jpeg',
      '/category/bracelets/image2.jpeg',
      '/category/bracelets/image2.jpeg',
    ],
    category: 'bracelets',
    sizes: accessorySizes,
    specifications: 'Material: Mixed Metal Alloys.',
    quantity: 5,
  },
  {
    productId: '32',
    name: 'Meenakari Kada Bracelet',
    description: 'A traditional meenakari kada bracelet.',
    price: 7200,
    images: [
      '/category/bracelets/image3.jpeg',
      '/category/bracelets/image3.jpeg',
      '/category/bracelets/image3.jpeg',
      '/category/bracelets/image3.jpeg',
    ],
    category: 'bracelets',
    sizes: accessorySizes,
    specifications: 'Material: Brass, Enamel Work.',
    quantity: 5,
  },
  // Danglers (3 products)
  {
    productId: '33',
    name: 'Jhumka Danglers',
    description: 'Classic jhumka style danglers for a traditional look.',
    price: 4800,
    images: [
     '/category/danglers/image1.jpeg',
     '/category/danglers/image1.jpeg',
     '/category/danglers/image1.jpeg',
     '/category/danglers/image1.jpeg', 
    ],
    category: 'danglers',
    sizes: accessorySizes,
    specifications: 'Material: Alloy, Faux Pearls.',
    quantity: 5,
  },
  {
    productId: '34',
    name: 'Crystal Waterfall Danglers',
    description: 'Stunning crystal waterfall danglers for a glamorous look.',
    price: 6800,
    images: [
      '/category/danglers/image2.jpeg',
      '/category/danglers/image2.jpeg',
      '/category/danglers/image2.jpeg',
      '/category/danglers/image2.jpeg',
    ],
    category: 'danglers',
    sizes: accessorySizes,
    specifications: 'Material: High-quality Crystals, Metal Alloy.',
    quantity: 5,
  },
  {
    productId: '35',
    name: 'Bohemian Tassel Danglers',
    description: 'Boho-chic tassel danglers to complete your look.',
    price: 2900,
    images: [
      '/category/danglers/image3.jpeg',
      '/category/danglers/image3.jpeg',
      '/category/danglers/image3.jpeg',
      '/category/danglers/image3.jpeg',
    ],
    category: 'danglers',
    sizes: accessorySizes,
    specifications: 'Material: Thread Tassels, Mixed Metal.',
    quantity: 5,
  }
];

// const banners = [
//   {
//     title: "Modern Indian Wear",
//     description: "Where tradition meets style.",
//     imageUrl: "/images/image0.webp",
//     buttonText: "SHOP NOW",
//     buttonLink: "/shop",
//     backgroundColor: "#000000",
//     textColor: "#ffffff",
//     position: 'top-of-page',
//     targetPages: ['home'],
//     order: -1,
//     isActive: true,
//     animation: 'fade',
//     clickableImage: false,
//   },
//   {
//     description: "Pan India Shipping | Handcrafted Luxury 🥰",
//     backgroundColor: "#DDE2D3",
//     textColor: "#000000",
//     position: 'above-header',
//     targetPages: ['all'],
//     order: 1,
//     isActive: true,
//   },
//   {
//     description: "10% Off Sitewide - Shop Now!🛒",
//     buttonLink: "/shop",
//     backgroundColor: "#E45757",
//     textColor: "#ffffff",
//     position: 'above-header',
//     targetPages: ['all'],
//     order: 2,
//     isActive: true,
//     clickableImage: true,
//   }
// ];

const categories = [
  // Collections
  // { name: 'Sharara Sets', slug: 'sharara-set', parent: 'collection' },
  // { name: 'Sarees', slug: 'saree', parent: 'collection' },
  { name: 'Draped Sets', slug: 'draped-sets', parent: 'collection' },
  { name: 'Ethnic Sets', slug: 'ethnic-sets', parent: 'collection' },
  { name: 'Dresses', slug: 'dresses', parent: 'collection' },
  { name: 'Pre-drape Sarees', slug: 'pre-drape-sarees', parent: 'collection' },
  // Accessories
  { name: 'Chains', slug: 'chains', parent: 'accessory' },
  { name: 'Studs', slug: 'studs', parent: 'accessory' },
  { name: 'Anklets', slug: 'anklets', parent: 'accessory' },
  { name: 'Bracelets', slug: 'bracelets', parent: 'accessory' },
  { name: 'Danglers', slug: 'danglers', parent: 'accessory' },
];

let dummyUsers = [];
let dummyOrders = [];

const createDummyData = async () => {
    // Create dummy users
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    dummyUsers = [
        {
            _id: new mongoose.Types.ObjectId("60f8d2d3c3b4a2001c8e4f5a"), // Fixed ID
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            password: hashedPassword,
            addresses: [{ fullAddress: '123 Main St, Anytown, USA - 12345, United States' }],
        },
        {
            _id: new mongoose.Types.ObjectId("60f8d2d3c3b4a2001c8e4f5b"), // Fixed ID
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane.smith@example.com',
            password: hashedPassword,
            addresses: [{ fullAddress: '456 Oak Ave, Anytown, USA - 12345, United States' }],
        },
    ];

    // Create dummy orders
    dummyOrders = [
        {
            _id: new mongoose.Types.ObjectId("60f8d2d3c3b4a2001c8e4f5c"), // Fixed ID
            userId: dummyUsers[0]._id,
            items: [
                { productId: products[0].productId, name: products[0].name, quantity: 1, price: products[0].price, size: 'M' },
                { productId: products[2].productId, name: products[2].name, quantity: 1, price: products[2].price, size: 'L' },
            ],
            totalAmount: products[0].price + products[2].price,
            shippingAddress: '123 Main St, Anytown, USA - 12345, United States',
            status: 'Delivered',
        },
        {
            _id: new mongoose.Types.ObjectId("60f8d2d3c3b4a2001c8e4f5d"), // Fixed ID
            userId: dummyUsers[1]._id,
            items: [
                { productId: products[4].productId, name: products[4].name, quantity: 1, price: products[4].price, size: 'S' },
            ],
            totalAmount: products[4].price,
            shippingAddress: '456 Oak Ave, Anytown, USA - 12345, United States',
            status: 'Shipped',
        },
        {
            _id: new mongoose.Types.ObjectId("60f8d2d3c3b4a2001c8e4f5e"), // Fixed ID
            userId: dummyUsers[0]._id,
            items: [
                { productId: products[6].productId, name: products[6].name, quantity: 2, price: products[6].price, size: 'XL' },
            ],
            totalAmount: products[6].price * 2,
            shippingAddress: '123 Main St, Anytown, USA - 12345, United States',
            status: 'Pending',
        },
    ];
};


const seedDatabase = async () => {
    try {
        await createDummyData();

        // Use updateOne with upsert for non-destructive seeding
        console.log('Seeding products...');
        for (const product of products) {
            await Product.updateOne({ productId: product.productId }, { $set: product }, { upsert: true });
        }
        console.log(`${products.length} products seeded successfully!`);
        
        console.log('Seeding categories...');
        for (const category of categories) {
            await Category.updateOne({ slug: category.slug }, { $set: category }, { upsert: true });
        }
        console.log(`${categories.length} categories seeded successfully!`);
        
        console.log('Seeding dummy users...');
        for (const user of dummyUsers) {
            await User.updateOne({ email: user.email }, { $set: user }, { upsert: true });
        }
        console.log(`${dummyUsers.length} dummy users seeded successfully!`);

        console.log('Seeding dummy orders...');
        for (const order of dummyOrders) {
            await Order.updateOne({ _id: order._id }, { $set: order }, { upsert: true });
        }
        console.log(`${dummyOrders.length} dummy orders seeded successfully!`);


    } catch (err) {
        console.error('Error seeding database:', err.message);
        process.exit(1);
    } finally {
        console.log('Seeding complete. Closing DB connection.');
        process.exit(0);
    }
};

// This allows the script to be executed directly
if (require.main === module) {
    console.log('Connecting to DB to run seeder...');
    connectDB().then(() => {
        seedDatabase();
    });
}


module.exports = seedDatabase;
