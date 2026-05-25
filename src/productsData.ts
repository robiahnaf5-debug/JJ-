export interface ProductItem {
  id: string;
  name: string;
  category: string;
  price: number;
  discountPrice: number;
  stock: number;
  rating: number;
  description: string;
  mainImage: string;
  images: string[];
}

export const initialProducts: ProductItem[] = [
  {
    id: "prod_1",
    name: "OnePlus Nord CE 4 (8GB RAM, 128GB)",
    category: "Electronics",
    price: 31999,
    discountPrice: 28999,
    stock: 12,
    rating: 4.6,
    description: "The OnePlus Nord CE 4 is a modern and powerful mid-range phone. It features a 5000mAh battery, 100W super-fast charging, and an ultra-clear AMOLED display. Highly recommended for multitasking and gaming.",
    mainImage: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&q=80&w=600",
    images: [
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&q=80&w=600"
    ]
  },
  {
    id: "prod_2",
    name: "Women's Premium Block Print Three-Piece",
    category: "Fashion",
    price: 2400,
    discountPrice: 1850,
    stock: 25,
    rating: 4.8,
    description: "Exquisite pure boutique print cotton three-piece with complete handwork. Highly comfortable to wear with a 100% color guarantee. Elegant outfit suitable for any festive occasion or casual gathering.",
    mainImage: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=600",
    images: [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1608748010899-18f300247112?auto=format&fit=crop&q=80&w=600"
    ]
  },
  {
    id: "prod_3",
    name: "Premium Formal Leather Shoes - Brown",
    category: "Shoes",
    price: 3800,
    discountPrice: 3200,
    stock: 8,
    rating: 4.5,
    description: "100% genuine leather gentleman shoes with a versatile casual and formal design. Flexible and highly durable sole. Comfortable for long hours without causing foot strain. Perfect for office or parties.",
    mainImage: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=600",
    images: [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&q=80&w=600"
    ]
  },
  {
    id: "prod_4",
    name: "Pure Wood-Pressed Mustard Oil (5 L)",
    category: "Grocery",
    price: 1350,
    discountPrice: 1199,
    stock: 50,
    rating: 4.9,
    description: "All-natural and chemical-free mustard oil, extracted from choice premium local mustard seeds using traditional wooden presses. Cold-pressed to retain its pure aroma and nutritional benefits. A healthy choice for daily cooking.",
    mainImage: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=600",
    images: [
      "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&q=80&w=600"
    ]
  },
  {
    id: "prod_5",
    name: "Magic Matte Finish Liquid Lipstick Kit",
    category: "Cosmetics",
    price: 1100,
    discountPrice: 850,
    stock: 0, // Out of Stock simulation
    rating: 4.3,
    description: "Waterproof, matte finish lipsticks in 6 royal shades in a single kit. Stays fresh and vibrant on lips for up to 24 hours. Made from lead-free, chemical-free ingredients to protect the natural color of your lips.",
    mainImage: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=600",
    images: [
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1625093742435-6fa192b6fb10?auto=format&fit=crop&q=80&w=600"
    ]
  },
  {
    id: "prod_6",
    name: "Luxury Wooden 4-Seater Sofa Set",
    category: "Furniture",
    price: 45000,
    discountPrice: 38000,
    stock: 3,
    rating: 4.7,
    description: "Exquisitely hand-carved double and single sofa set crafted from genuine Chittagong teakwood. Heavy density foam cushioning wrapped in premium imported fabrics brings a touch of royalty to your living room.",
    mainImage: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=600",
    images: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&q=80&w=600"
    ]
  },
  {
    id: "prod_7",
    name: "Men's Premium Slim Fit Cotton Casual T-Shirt",
    category: "Fashion",
    price: 750,
    discountPrice: 499,
    stock: 40,
    rating: 4.4,
    description: "100% export quality cotton casual slim-fit t-shirt. The fabric is highly sweat-absorbent and fade-resistant, keeping you comfortable in the sun. A popular stylish choice for the youth.",
    mainImage: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=600",
    images: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=600",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=600"
    ]
  },
  {
    id: "prod_8",
    name: "Premium Double-Pot Digital Rice Cooker",
    category: "Electronics",
    price: 4200,
    discountPrice: 3599,
    stock: 15,
    rating: 4.5,
    description: "State-of-the-art digital cooker designed to steam rice, khichuri, or momos quickly while preserving nutrients. Features a completely non-stick inner pot with a brilliant smart LED display and one-touch controls.",
    mainImage: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&q=80&w=600",
    images: [
      "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&q=80&w=600"
    ]
  }
];

export interface OrderItem {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  paymentMethod: string;
  items: {
    productName: string;
    price: number;
    quantity: number;
  }[];
  totalAmount: number;
  orderStatus: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  date: string;
  timestamp: number;
}

export const initialOrders: OrderItem[] = [
  {
    id: "ORD_9401",
    customerName: "Mahmudul Hasan Russel",
    phone: "01789123456",
    address: "House-24, Road-5, Sector-3, Uttara, Dhaka-1230",
    paymentMethod: "bKash",
    items: [
      { productName: "OnePlus Nord CE 4 (8GB RAM, 128GB)", price: 28999, quantity: 1 }
    ],
    totalAmount: 29059, // total details (including delivery charge)
    orderStatus: "Processing",
    date: "2026-05-24 11:20 AM",
    timestamp: 1779796800000
  },
  {
    id: "ORD_7322",
    customerName: "Afsana Begum",
    phone: "01912445566",
    address: "Noor Mansion (3rd Floor), Kazir Dewri, Chattogram",
    paymentMethod: "Cash On Delivery",
    items: [
      { productName: "Women's Premium Block Print Three-Piece", price: 1850, quantity: 2 },
      { productName: "Pure Wood-Pressed Mustard Oil (5 L)", price: 1199, quantity: 1 }
    ],
    totalAmount: 5019,
    orderStatus: "Pending",
    date: "2026-05-25 09:15 AM",
    timestamp: 1779875700000
  },
  {
    id: "ORD_1208",
    customerName: "Zahidul Islam",
    phone: "01555778899",
    address: "Upshahar Housing Estate, Block-D, Zindabazar, Sylhet",
    paymentMethod: "Nagad",
    items: [
      { productName: "Premium Formal Leather Shoes - Brown", price: 3200, quantity: 1 }
    ],
    totalAmount: 3320,
    orderStatus: "Delivered",
    date: "2026-05-20 04:30 PM",
    timestamp: 1779448200000
  }
];
