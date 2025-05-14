
import { Seller, Buyer, Product, Cart, Message, Transaction } from '../types';

export const sellers: Seller[] = [
  {
    id: 'seller1',
    name: 'Sophia Chen',
    photo: '/artisans/seller1_portrait_new.jpg', // AI-generated portrait of Sophia Chen with her work
    location: 'Portland, OR',
    style: 'Modern Minimalist',
    bio: 'I create functional ceramics with clean lines and muted colors. Each piece is hand-thrown and designed to bring simple elegance to everyday moments.',
    story: 'My journey with ceramics began during college when I took an elective pottery class. What started as a way to de-stress quickly evolved into a passion. After completing my design degree, I established my Portland studio where I focus on creating pieces that enhance daily rituals. My work is influenced by Japanese minimalism and Scandinavian design principles.',
    studioImages: [
      '/artisans/seller1_working_new.jpg', // Working at pottery wheel
      '/artisans/seller1_display_new.jpg', // Arranging her ceramic collection
      '/images/p1_2.jpg'  // Example of her work
    ],
    products: ['p1', 'p2', 'p3', 'p7', 'p11'],
    featured: true
  },
  {
    id: 'seller2',
    name: 'Marcus Johnson',
    photo: '/artisans/seller2_portrait_new.jpg', // AI-generated portrait of Marcus Johnson with his work
    location: 'Brooklyn, NY',
    style: 'Organic Textures',
    bio: 'My work explores the relationship between natural textures and geometric forms. I find inspiration in landscapes and translate those elements into tactile ceramics.',
    story: "Before becoming a full-time ceramicist, I worked as an architect for 12 years. That background informs my approach to clay—I see each piece as a small architectural form. My Brooklyn studio is housed in a converted industrial space where I experiment with various textures and glazing techniques. I'm particularly drawn to the interplay between rough and smooth surfaces, often incorporating elements from urban environments and natural landscapes.",
    studioImages: [
      '/artisans/seller2_working_new.jpg', // Working on textured vessel
      '/artisans/seller2_display_new.jpg', // Displaying his ceramic collection
      '/images/p4.jpg'  // Example of his work
    ],
    products: ['p4', 'p5', 'p6', 'p12'],
    featured: true
  },
  {
    id: 'seller3',
    name: 'Emma Rodriguez',
    photo: '/artisans/seller3_portrait_new.jpg', // AI-generated portrait of Emma Rodriguez with her work
    location: 'Austin, TX',
    style: 'Colorful Contemporary',
    bio: 'I love experimenting with vibrant glazes and playful forms. My ceramics aim to bring joy and a pop of color to any space.',
    story: "Growing up in a family of artists, creativity has always been at the center of my life. I studied fine arts with a focus on sculpture before discovering my love for ceramics. My Austin studio is a colorful, energetic space where I blend traditional techniques with contemporary designs. I'm constantly experimenting with new glazes and forms, drawing inspiration from the vibrant street art and music scene that makes Austin so unique. Each piece I create is meant to bring a sense of joy and playfulness to everyday objects.",
    studioImages: [
      '/artisans/seller3_working_new.jpg', // Applying colorful glazes
      '/artisans/seller3_display_new.jpg', // Arranging her vibrant collection
      '/images/p8.jpg'  // Example of her work
    ],
    products: ['p8', 'p9', 'p10', 'p13'],
    featured: true
  }
];

export const buyers: Buyer[] = [
  {
    id: 'buyer1',
    name: 'Alex Taylor',
    location: 'Seattle, WA',
    favorites: ['p1', 'p8'],
    avatar: '/placeholder.svg'
  },
  {
    id: 'buyer2',
    name: 'Jamie Wong',
    location: 'Chicago, IL',
    favorites: ['p3', 'p5'],
    avatar: '/placeholder.svg'
  }
];

export const products: Product[] = [
  {
    id: 'p1',
    sellerId: 'seller1',
    title: 'Minimalist Ceramic Mug',
    description: 'Hand-thrown mug with a clean silhouette and matte finish. Perfect for your morning coffee or tea. Microwave and dishwasher safe.',
    price: 38,
    images: [
      '/images/p1_1.jpg', // front view
      '/images/p1_2.jpg', // angle view
      '/images/p1_3.jpg', // top view
      '/images/p1_4.jpg', // handle close-up
      '/images/p1_5.jpg'  // lifestyle view
    ],
    category: 'Kitchen',
    tags: ['mug', 'minimal', 'tableware'],
    featured: true,
    inventory: 15
  },
  {
    id: 'p2',
    sellerId: 'seller1',
    title: 'Speckled Bowl Set',
    description: 'Set of three nesting bowls with speckled glaze. Each bowl is slightly different, making a unique set for serving or display.',
    price: 85,
    images: [
      '/images/p2_1.jpg', // set view
      '/images/p2_2.jpg', // single bowl
      '/images/p2_3.jpg', // angle view
      '/images/p2_4.jpg', // stacked view
      '/images/p2_5.jpg'  // lifestyle view
    ],
    category: 'Kitchen',
    tags: ['bowl', 'set', 'speckled', 'tableware'],
    featured: false,
    inventory: 7
  },
  {
    id: 'p3',
    sellerId: 'seller1',
    title: 'Ceramic Planter',
    description: 'Modern ceramic planter with drainage hole and saucer. The perfect home for your favorite plant.',
    price: 52,
    images: [
      '/images/p3_1.jpg', // front view
      '/images/p3_2.jpg', // empty planter
      '/images/p3_3.jpg', // angle view
      '/images/p3_4.jpg', // top view
      '/images/p3_5.jpg'  // lifestyle view
    ],
    category: 'Home',
    tags: ['planter', 'home decor', 'garden'],
    featured: false,
    inventory: 9
  },
  {
    id: 'p4',
    sellerId: 'seller2',
    title: 'Textured Vase',
    description: 'Handcrafted vase with organic texture inspired by natural landscapes. Each piece has unique variations in the glazing process.',
    price: 120,
    images: [
      '/images/p4.jpg', // main view (temporarily using same image)
      '/images/p4.jpg', // will be replaced with angle view
      '/images/p4.jpg', // will be replaced with detail view
      '/images/p4.jpg', // will be replaced with top view
      '/images/p4.jpg'  // will be replaced with lifestyle view
    ],
    category: 'Home',
    tags: ['vase', 'textured', 'decorative', 'home decor'],
    featured: true,
    inventory: 3
  },
  {
    id: 'p5',
    sellerId: 'seller2',
    title: 'Serving Platter',
    description: 'Large oval serving platter with raised edges. Perfect for entertaining or as a statement piece for your dining table.',
    price: 95,
    images: [
      '/images/p5.jpg', // main view (temporarily using same image)
      '/images/p5.jpg', // will be replaced with angle view
      '/images/p5.jpg', // will be replaced with side view
      '/images/p5.jpg', // will be replaced with detail view
      '/images/p5.jpg'  // will be replaced with lifestyle view
    ],
    category: 'Kitchen',
    tags: ['platter', 'serving', 'entertaining', 'tableware'],
    featured: false,
    inventory: 5
  },
  {
    id: 'p6',
    sellerId: 'seller2',
    title: 'Ceramic Wall Tiles',
    description: 'Set of 4 decorative wall tiles with relief patterns. Can be arranged in various configurations for a custom wall installation.',
    price: 160,
    images: [
      '/images/p6.jpg', // grid formation (temporarily using same image)
      '/images/p6.jpg', // will be replaced with single tile view
      '/images/p6.jpg', // will be replaced with row arrangement
      '/images/p6.jpg', // will be replaced with detail view
      '/images/p6.jpg'  // will be replaced with lifestyle view
    ],
    category: 'Home',
    tags: ['tiles', 'wall art', 'installation', 'home decor'],
    featured: false,
    inventory: 2
  },
  {
    id: 'p7',
    sellerId: 'seller1',
    title: 'Ceramic Pour-Over Coffee Set',
    description: 'Hand-thrown ceramic pour-over coffee dripper with matching mug. The perfect set for coffee enthusiasts who appreciate artisanal craftsmanship.',
    price: 75,
    images: [
      '/images/p7.jpg', // full set (temporarily using same image)
      '/images/p7.jpg', // will be replaced with dripper only
      '/images/p7.jpg', // will be replaced with mug only
      '/images/p7.jpg', // will be replaced with angle view
      '/images/p7.jpg'  // will be replaced with lifestyle view
    ],
    category: 'Kitchen',
    tags: ['coffee', 'pour-over', 'set', 'tableware'],
    featured: true,
    inventory: 8
  },
  {
    id: 'p8',
    sellerId: 'seller3',
    title: 'Colorful Dessert Plates',
    description: 'Set of 4 hand-painted dessert plates in vibrant colors. Each plate features a unique pattern while maintaining a cohesive collection.',
    price: 88,
    images: [
      '/images/p8.jpg', // full set (temporarily using same image)
      '/images/p8.jpg', // will be replaced with single plate
      '/images/p8.jpg', // will be replaced with stacked view
      '/images/p8.jpg', // will be replaced with pattern detail
      '/images/p8.jpg'  // will be replaced with lifestyle view
    ],
    category: 'Kitchen',
    tags: ['plates', 'colorful', 'tableware', 'set'],
    featured: true,
    inventory: 6
  },
  {
    id: 'p9',
    sellerId: 'seller3',
    title: 'Ceramic Jewelry Dish',
    description: 'Small hand-pinched dish perfect for holding rings, earrings, and small treasures. Glazed in a vibrant turquoise with gold accents.',
    price: 28,
    images: [
      '/images/p9.jpg', // top view (temporarily using same image)
      '/images/p9.jpg', // will be replaced with angle view
      '/images/p9.jpg', // will be replaced with side view
      '/images/p9.jpg', // will be replaced with detail view
      '/images/p9.jpg'  // will be replaced with lifestyle view
    ],
    category: 'Home',
    tags: ['jewelry', 'dish', 'small', 'home decor'],
    featured: false,
    inventory: 12
  },
  {
    id: 'p10',
    sellerId: 'seller3',
    title: 'Ceramic Wind Chimes',
    description: 'Handcrafted ceramic wind chimes that create a gentle, soothing sound. Each piece is individually shaped and glazed in complementary colors.',
    price: 65,
    images: [
      '/images/p10.jpg', // full view (temporarily using same image)
      '/images/p10.jpg', // will be replaced with hanging view
      '/images/p10.jpg', // will be replaced with pieces close-up
      '/images/p10.jpg', // will be replaced with connection detail
      '/images/p10.jpg'  // will be replaced with lifestyle view
    ],
    category: 'Garden',
    tags: ['wind chimes', 'garden', 'outdoor', 'decor'],
    featured: false,
    inventory: 4
  },
  {
    id: 'p11',
    sellerId: 'seller1',
    title: 'Stoneware Teapot',
    description: 'Elegant stoneware teapot with bamboo handle. Features a built-in strainer for loose leaf tea and a smooth-pouring spout. Glazed in a calming celadon green.',
    price: 68,
    images: [
      '/images/p11_front.jpg',  // front view
      '/images/p11_angle.jpg',  // angle view showing spout and handle
      '/images/p11_top.jpg',    // top view with lid off showing strainer
      '/images/p11_detail.jpg', // detail of spout and handle
      '/images/p11_lifestyle.jpg' // lifestyle view with tea service
    ],
    category: 'Kitchen',
    tags: ['teapot', 'tea', 'stoneware', 'tableware'],
    featured: true,
    inventory: 7
  },
  {
    id: 'p12',
    sellerId: 'seller2',
    title: 'Ceramic Soap Dish',
    description: 'Hand-built ceramic soap dish with drainage ridges to keep your soap dry between uses. Available in a soft matte glaze with subtle speckles.',
    price: 24,
    images: [
      '/images/p12_top.jpg',     // top view showing drainage ridges
      '/images/p12_angle.jpg',   // angle view
      '/images/p12_side.jpg',    // side profile view
      '/images/p12_with-soap.jpg', // with soap bar
      '/images/p12_lifestyle.jpg'  // lifestyle in bathroom setting
    ],
    category: 'Bath',
    tags: ['soap dish', 'bathroom', 'home', 'functional'],
    featured: false,
    inventory: 12
  },
  {
    id: 'p13',
    sellerId: 'seller3',
    title: 'Decorative Ceramic Lantern',
    description: 'Intricately carved ceramic lantern that casts beautiful shadow patterns when lit. Perfect for creating a warm, cozy atmosphere indoors or on a covered patio.',
    price: 95,
    images: [
      '/images/p13_unlit.jpg',    // full view unlit
      '/images/p13_lit.jpg',      // full view lit from within
      '/images/p13_detail.jpg',   // detail of carving pattern
      '/images/p13_top.jpg',      // top view showing candle holder
      '/images/p13_lifestyle.jpg' // lifestyle in evening setting showing shadow patterns
    ],
    category: 'Home',
    tags: ['lantern', 'lighting', 'carved', 'decorative', 'home decor'],
    featured: true,
    inventory: 5
  }
];

export const carts: Cart[] = [
  {
    buyerId: 'buyer1',
    items: [],
    updatedAt: new Date().toISOString()
  },
  {
    buyerId: 'buyer2',
    items: [],
    updatedAt: new Date().toISOString()
  }
];

export const messages: Message[] = [
  {
    id: 'msg1',
    buyerId: 'buyer1',
    sellerId: 'seller1',
    content: "Hi, I'm interested in your Minimalist Ceramic Mug. Do you offer custom glazes?",
    timestamp: '2023-05-10T14:24:00Z',
    read: true
  },
  {
    id: 'msg2',
    buyerId: 'buyer1',
    sellerId: 'seller1',
    content: "Thank you for your interest! Yes, I can create custom glazes. Did you have a specific color in mind?",
    timestamp: '2023-05-10T15:02:00Z',
    read: true
  }
];

export const transactions: Transaction[] = [
  {
    id: 'transaction1',
    buyerId: 'buyer2',
    sellerId: 'seller3',
    items: [
      {
        productId: 'p8',
        sellerId: 'seller3',
        quantity: 1,
        price: 88,
        title: 'Colorful Dessert Plates',
        image: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?q=80&w=1974&auto=format'
      }
    ],
    total: 88,
    timestamp: '2023-04-28T09:15:00Z',
    status: 'completed'
  }
];

export const categories = [
  'All',
  'Kitchen',
  'Home',
  'Garden',
];
