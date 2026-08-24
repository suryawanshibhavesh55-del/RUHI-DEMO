// Migration Script to Seed Initial 10 RUHI Products into MongoDB
const { connectToDatabase } = require('../lib/db');
require('dotenv').config();

const initialProducts = [
  {
    productName: 'RUHI VANTA',
    slug: 'ruhi-vanta',
    description: 'An intense, dark composition where smoked leather meets midnight oud and warm amber. Designed for profound sophistication and quiet authority.',
    sizeML: '8ML',
    family: 'AMBER LEATHER',
    personality: 'Deep • Dark • Sophisticated',
    notesPyramid: {
      top: 'Smoked Cardamom, Black Pepper, Saffron',
      heart: 'Black Leather Accord, Cypress, Midnight Oud',
      base: 'Dark Amber, Haitian Vetiver, Tonka Bean'
    },
    imageUrl: 'assets/hd/bottle_01.png',
    cloudinaryPublicId: '',
    displayOrder: 1,
    isActive: true,
  },
  {
    productName: 'RUHI NOXEN',
    slug: 'ruhi-noxen',
    description: 'Enigmatic labdanum and smoked incense wrapped in rich black amber and guaiac wood. An aura of captivating power.',
    sizeML: '8ML',
    family: 'ORIENTAL WOODY',
    personality: 'Mysterious • Powerful',
    notesPyramid: {
      top: 'Calabrian Bergamot, Pink Peppercorn',
      heart: 'Labdanum Resin, Smoked Incense, Turkish Rose',
      base: 'Black Amber, Guaiac Wood, Sandalwood'
    },
    imageUrl: 'assets/hd/bottle_02.png',
    cloudinaryPublicId: '',
    displayOrder: 2,
    isActive: true,
  },
  {
    productName: 'RUHI VELOR',
    slug: 'ruhi-velor',
    description: 'Sumptuous rum accord, dark violet, and rich tobacco leaves resting over velvety musk and benzoin. Pure dark indulgence.',
    sizeML: '8ML',
    family: 'VELVET MUSK',
    personality: 'Dark Luxury',
    notesPyramid: {
      top: 'Aged Rum Accord, Bitter Almond',
      heart: 'Cashmere Wood, Black Violet, Tobacco Leaf',
      base: 'Creamy Vanilla, Benzoin, Velvet Musk'
    },
    imageUrl: 'assets/hd/bottle_03.png',
    cloudinaryPublicId: '',
    displayOrder: 3,
    isActive: true,
  },
  {
    productName: 'RUHI ZAYRON',
    slug: 'ruhi-zayron',
    description: 'Commanding Cambodian oud infused with nutmeg, smoked birch, and ambergris. A fragrance for natural leaders.',
    sizeML: '8ML',
    family: 'SPICY OUD',
    personality: 'Bold • Commanding',
    notesPyramid: {
      top: 'Nutmeg, Clove Bud, Fresh Bergamot',
      heart: 'Cambodian Oud, Cedarwood, Ambergris',
      base: 'Smoked Birch, Fine Leather, Oakmoss'
    },
    imageUrl: 'assets/hd/bottle_04.png',
    cloudinaryPublicId: '',
    displayOrder: 4,
    isActive: true,
  },
  {
    productName: 'RUHI DRAEVEN',
    slug: 'ruhi-draeven',
    description: 'Dark plum and smoked frankincense melting into patchouli and rich bourbon vanilla. An enigmatic, intoxicating spell.',
    sizeML: '8ML',
    family: 'SMOKY AMBER',
    personality: 'Intense • Enigmatic',
    notesPyramid: {
      top: 'Dark Plum, Juniper Berry',
      heart: 'Smoked Frankincense, Cinnamon Bark, Rose',
      base: 'Black Amber, Patchouli, Bourbon Vanilla'
    },
    imageUrl: 'assets/hd/bottle_05.png',
    cloudinaryPublicId: '',
    displayOrder: 5,
    isActive: true,
  },
  {
    productName: 'RUHI VEXOR',
    slug: 'ruhi-vexor',
    description: 'A sharp, rebellious fusion of crushed black pepper, vetiver root, and smoked cedarwood for unmatched edge.',
    sizeML: '8ML',
    family: 'AROMATIC WOODY',
    personality: 'Sharp • Rebellious',
    notesPyramid: {
      top: 'Grapefruit Zest, Crushed Black Pepper',
      heart: 'Haitian Vetiver Root, Lavender, Sage',
      base: 'Atlas Cedarwood, AmberXtreme, Smoked Musk'
    },
    imageUrl: 'assets/hd/bottle_01.png',
    cloudinaryPublicId: '',
    displayOrder: 6,
    isActive: true,
  },
  {
    productName: 'RUHI AUREV',
    slug: 'ruhi-aurev',
    description: 'Golden saffron and imperial rose grounded in white sandalwood and royal amber. Effortless luxury and noble charm.',
    sizeML: '8ML',
    family: 'IMPERIAL FLORAL',
    personality: 'Elegant • Exclusive',
    notesPyramid: {
      top: 'Golden Saffron, Mandarin Zest',
      heart: 'Imperial Rose, Jasmine Sambac, Florentine Iris',
      base: 'Royal Amber, White Sandalwood, Cashmeran'
    },
    imageUrl: 'assets/hd/bottle_02.png',
    cloudinaryPublicId: '',
    displayOrder: 7,
    isActive: true,
  },
  {
    productName: 'RUHI SOVREN',
    slug: 'ruhi-sovren',
    description: 'Regal royal oud, myrrh, and rich ebony wood designed for dominant, stately presence and unquestioned grandeur.',
    sizeML: '8ML',
    family: 'REGAL WOODS',
    personality: 'Royal • Dominant',
    notesPyramid: {
      top: 'Green Cardamom, Bergamot, Coriander',
      heart: 'Royal Oud Accord, Myrrh, Cinnamon Bark',
      base: 'Rich Ebony Wood, Golden Amber, Saddle Leather'
    },
    imageUrl: 'assets/hd/bottle_03.png',
    cloudinaryPublicId: '',
    displayOrder: 8,
    isActive: true,
  },
  {
    productName: 'RUHI NYVOR',
    slug: 'ruhi-nyvor',
    description: 'Sensual black cherry, vanilla orchid, and dark musk that leaves an intoxicating, deeply seductive trail in its wake.',
    sizeML: '8ML',
    family: 'GOURMAND AMBER',
    personality: 'Mysterious • Seductive',
    notesPyramid: {
      top: 'Black Cherry Accord, Sunlit Bergamot',
      heart: 'Midnight Jasmine, Cocoa Shell, Vanilla Orchid',
      base: 'Dark Musk, Warm Amber, Creamy Sandalwood'
    },
    imageUrl: 'assets/hd/bottle_04.png',
    cloudinaryPublicId: '',
    displayOrder: 9,
    isActive: true,
  },
  {
    productName: 'RUHI ZEVARO',
    slug: 'ruhi-zevaro',
    description: 'Smoked birch, leather accord, and dark amber resin crafted for understated power and supreme elegance.',
    sizeML: '8ML',
    family: 'SMOKED LEATHER',
    personality: 'Powerful • Sophisticated',
    notesPyramid: {
      top: 'Pink Peppercorn, Elemi Resin',
      heart: 'Smoked Birch Wood, Italian Leather, Amber Resin',
      base: 'Haitian Vetiver, Atlas Cedarwood, Dark Musk'
    },
    imageUrl: 'assets/hd/bottle_05.png',
    cloudinaryPublicId: '',
    displayOrder: 10,
    isActive: true,
  }
];

async function seedDatabase() {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('products');

    const count = await collection.countDocuments();
    if (count > 0) {
      console.log(`Database already contains ${count} products. Skipping initial seed.`);
      process.exit(0);
    }

    console.log('Seeding 10 initial RUHI products into MongoDB...');
    const docs = initialProducts.map(p => ({
      ...p,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    await collection.insertMany(docs);
    console.log('Successfully seeded 10 initial products into MongoDB!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
}

seedDatabase();
