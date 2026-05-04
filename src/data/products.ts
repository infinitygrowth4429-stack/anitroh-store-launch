import p1 from "@/assets/p1.jpg";
import p2 from "@/assets/p2.jpg";
import p3 from "@/assets/p3.jpg";
import p4 from "@/assets/p4.jpg";
import p5 from "@/assets/p5.jpg";
import p6 from "@/assets/p6.jpg";
import p7 from "@/assets/p7.jpg";
import p8 from "@/assets/p8.jpg";

export type Product = {
  id: string;
  name: string;
  category: "Men" | "Women" | "Footwear" | "Moringa" | "Accessories";
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  badge?: string;
  description: string;
  sizes?: string[];
  colors?: { name: string; hex: string }[];
  inStock: boolean;
};

export const products: Product[] = [
  {
    id: "ash-cashmere-01",
    name: "Ashen Cashmere Crewneck",
    category: "Men",
    price: 189,
    oldPrice: 240,
    rating: 4.8,
    reviews: 142,
    image: p1,
    badge: "Bestseller",
    description: "Hand-finished pure Mongolian cashmere with a relaxed editorial silhouette.",
    sizes: ["S", "M", "L", "XL"],
    colors: [{ name: "Onyx", hex: "#0e0e0e" }, { name: "Ivory", hex: "#efe6d2" }],
    inStock: true,
  },
  {
    id: "ivoire-slip-02",
    name: "Ivoire Silk Slip Dress",
    category: "Women",
    price: 229,
    rating: 4.9,
    reviews: 87,
    image: p2,
    badge: "New",
    description: "Bias-cut mulberry silk with a fluid drape — an heirloom for warm evenings.",
    sizes: ["XS", "S", "M", "L"],
    colors: [{ name: "Pearl", hex: "#f4ecdc" }, { name: "Noir", hex: "#0e0e0e" }],
    inStock: true,
  },
  {
    id: "sovrano-oxford-03",
    name: "Sovrano Leather Oxford",
    category: "Footwear",
    price: 349,
    oldPrice: 420,
    rating: 4.7,
    reviews: 203,
    image: p3,
    badge: "−17%",
    description: "Goodyear-welted full-grain leather, hand-burnished in soft black patina.",
    sizes: ["7", "8", "9", "10", "11", "12"],
    colors: [{ name: "Noir", hex: "#0e0e0e" }],
    inStock: true,
  },
  {
    id: "moringa-pure-04",
    name: "Pure Moringa Powder · 200g",
    category: "Moringa",
    price: 28,
    rating: 4.9,
    reviews: 612,
    image: p4,
    badge: "Bestseller",
    description: "Single-origin, cold-dried moringa oleifera — vivid green, naturally vital.",
    inStock: true,
  },
  {
    id: "camelot-coat-05",
    name: "Camelot Wool Overcoat",
    category: "Men",
    price: 489,
    rating: 4.8,
    reviews: 64,
    image: p5,
    description: "Italian double-faced wool, tailored with a tonal horn-button placket.",
    sizes: ["S", "M", "L", "XL"],
    colors: [{ name: "Camel", hex: "#b5895c" }],
    inStock: true,
  },
  {
    id: "blanc-court-06",
    name: "Blanc Court Sneaker",
    category: "Footwear",
    price: 169,
    rating: 4.6,
    reviews: 318,
    image: p6,
    description: "Vegetable-tanned Italian leather on a cushioned crepe sole.",
    sizes: ["6", "7", "8", "9", "10", "11"],
    colors: [{ name: "Ivory", hex: "#f4ecdc" }],
    inStock: true,
  },
  {
    id: "doré-watch-07",
    name: "Doré Automatique Watch",
    category: "Accessories",
    price: 599,
    oldPrice: 749,
    rating: 5.0,
    reviews: 41,
    image: p7,
    badge: "Limited",
    description: "Self-winding Swiss movement encased in 18k gold-plated steel.",
    inStock: true,
  },
  {
    id: "moringa-caps-08",
    name: "Moringa Vital Capsules · 60ct",
    category: "Moringa",
    price: 22,
    rating: 4.8,
    reviews: 289,
    image: p8,
    description: "Bioavailable plant capsules — daily wellness, effortlessly.",
    inStock: true,
  },
];

export const reviews = [
  { name: "Aanya M.", city: "Mumbai", text: "The cashmere feels like a second skin. Worth every rupee — and the packaging is a love letter.", rating: 5 },
  { name: "Devon R.", city: "London", text: "These oxfords have replaced my Church's. Editorial quality at an honest price.", rating: 5 },
  { name: "Priya S.", city: "Bengaluru", text: "I've tried six moringa brands. ANITROH's is the only one that tastes alive. Daily ritual now.", rating: 5 },
  { name: "Mateo L.", city: "Madrid", text: "Order shipped in 48h, arrived in tissue and silk ribbon. They get the details.", rating: 5 },
];
