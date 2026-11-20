/**
 * Editorial data for the Yesly wedding shop.
 *
 * Photography is sourced from Unsplash and verified to load, so the shop is
 * fully server-renderable without a product database. Prices are indicative
 * and quoted in USD, matching the rest of the marketplace.
 */

export interface ShopCategory {
  name: string;
  blurb: string;
  image: string;
}

export interface ShopBrand {
  name: string;
  discipline: string;
  note: string;
  monogram: string;
}

export interface ShopProduct {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  image: string;
  events: string[];
  note: string;
}

export const SHOP_HERO_QUICK_PICKS = [
  "Wedding Dresses",
  "Jewellery",
  "Stationery",
  "Shoes & Accessories",
  "Reception & Flowers",
  "Gifts & Escapes",
] as const;

export const SHOP_CATEGORIES: ShopCategory[] = [
  {
    name: "Wedding Dresses",
    blurb: "Silk columns, corseted bodices and hand-finished hems.",
    image:
      "https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Bridesmaids",
    blurb: "Tonal satins cut to flatter every silhouette in the party.",
    image:
      "https://images.unsplash.com/photo-1562616293-1a11a7816903?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Suits & Tuxedos",
    blurb: "Velvet dinner jackets and Savile Row-trained tailoring.",
    image:
      "https://images.unsplash.com/photo-1618886614638-80e3c103d31a?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Jewellery",
    blurb: "Heirloom stones reset in recycled gold and platinum.",
    image:
      "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Stationery",
    blurb: "Letterpress suites printed on heavyweight cotton stock.",
    image:
      "https://images.unsplash.com/photo-1721176487015-5408ae0e9bc2?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Shoes & Accessories",
    blurb: "Dye-to-order satin, cathedral veils and bridal beauty.",
    image:
      "https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Reception & Flowers",
    blurb: "Sculptural florals, tablescapes and pâtisserie.",
    image:
      "https://images.unsplash.com/photo-1630527152680-500b5453fb04?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Gifts & Escapes",
    blurb: "Considered tokens, honeymoon suites and keepsakes.",
    image:
      "https://images.unsplash.com/photo-1608755728617-aefab37d2edd?auto=format&fit=crop&w=900&q=80",
  },
];

export const SHOP_EVENTS = [
  "Engagement",
  "Bridal Shower",
  "Bachelorette",
  "Rehearsal Dinner",
  "Welcome Party",
  "Wedding Day",
  "Honeymoon",
  "Anniversary",
] as const;

export const SHOP_BRANDS: ShopBrand[] = [
  {
    name: "Maison Vega",
    discipline: "Bridal Atelier",
    note: "Hand-finished silk gowns from a Florence workroom of eleven.",
    monogram: "MV",
  },
  {
    name: "Orfèvre & Co",
    discipline: "Fine Jewellery",
    note: "Heirloom stones reset in recycled gold and platinum.",
    monogram: "O&",
  },
  {
    name: "Papier de Lune",
    discipline: "Stationery",
    note: "Letterpress printed in Lyon on cotton stock.",
    monogram: "PL",
  },
  {
    name: "Cendrine",
    discipline: "Shoes",
    note: "Made in Portugal, dyed to order in fourteen tones.",
    monogram: "C",
  },
  {
    name: "House of Alden",
    discipline: "Tailoring",
    note: "Savile Row-trained bespoke tailoring for the party.",
    monogram: "HA",
  },
  {
    name: "Botanica",
    discipline: "Florals",
    note: "Sculptural arrangements from garden-grown stems.",
    monogram: "B",
  },
];

export const SHOP_PRODUCTS: ShopProduct[] = [
  {
    id: "aurelia-silk-column-gown",
    name: "Aurelia Silk Column Gown",
    brand: "Maison Vega",
    category: "Wedding Dresses",
    price: 2450,
    image:
      "https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&w=800&q=80",
    events: ["Wedding Day", "Rehearsal Dinner"],
    note: "Bias-cut Italian silk with a hand-rolled hem.",
  },
  {
    id: "celeste-cathedral-veil",
    name: "Céleste Cathedral Veil",
    brand: "Papier de Lune",
    category: "Shoes & Accessories",
    price: 420,
    image:
      "https://images.unsplash.com/photo-1606216794079-73f85bbd57d5?auto=format&fit=crop&w=800&q=80",
    events: ["Wedding Day"],
    note: "Three metres of silk tulle, combed by hand.",
  },
  {
    id: "etoile-solitaire-ring",
    name: "Étoile Solitaire Ring",
    brand: "Orfèvre & Co",
    category: "Jewellery",
    price: 3180,
    image:
      "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=800&q=80",
    events: ["Engagement", "Wedding Day"],
    note: "Old European cut stone, six-claw platinum setting.",
  },
  {
    id: "perle-drop-earrings",
    name: "Perle Drop Earrings",
    brand: "Orfèvre & Co",
    category: "Jewellery",
    price: 560,
    image:
      "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=800&q=80",
    events: ["Wedding Day", "Anniversary"],
    note: "Baroque freshwater pearls on fine gold wire.",
  },
  {
    id: "satin-bow-slingback",
    name: "Satin Bow Slingback",
    brand: "Cendrine",
    category: "Shoes & Accessories",
    price: 385,
    image:
      "https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?auto=format&fit=crop&w=800&q=80",
    events: ["Wedding Day", "Welcome Party"],
    note: "Seventy-millimetre heel, dyed to your palette.",
  },
  {
    id: "lettre-letterpress-suite",
    name: "Lettre Letterpress Suite",
    brand: "Papier de Lune",
    category: "Stationery",
    price: 640,
    image:
      "https://images.unsplash.com/photo-1721176487015-5408ae0e9bc2?auto=format&fit=crop&w=800&q=80",
    events: ["Engagement", "Wedding Day"],
    note: "Invitation, RSVP and envelope liner for fifty guests.",
  },
  {
    id: "minuit-velvet-tuxedo",
    name: "Minuit Velvet Tuxedo",
    brand: "House of Alden",
    category: "Suits & Tuxedos",
    price: 1290,
    image:
      "https://images.unsplash.com/photo-1618886614638-80e3c103d31a?auto=format&fit=crop&w=800&q=80",
    events: ["Wedding Day", "Rehearsal Dinner"],
    note: "Cotton velvet with a satin shawl collar.",
  },
  {
    id: "champagne-satin-bridesmaid",
    name: "Champagne Satin Bridesmaid",
    brand: "Maison Vega",
    category: "Bridesmaids",
    price: 320,
    image:
      "https://images.unsplash.com/photo-1562616293-1a11a7816903?auto=format&fit=crop&w=800&q=80",
    events: ["Wedding Day"],
    note: "Bias-cut duchess satin, available in six tones.",
  },
  {
    id: "the-heirloom-gift-set",
    name: "The Heirloom Gift Set",
    brand: "The Yesly Edit",
    category: "Gifts & Escapes",
    price: 180,
    image:
      "https://images.unsplash.com/photo-1608755728617-aefab37d2edd?auto=format&fit=crop&w=800&q=80",
    events: ["Bridal Shower", "Engagement"],
    note: "Silk ribbon, wax seal and a handwritten card.",
  },
  {
    id: "amalfi-honeymoon-escape",
    name: "Amalfi Honeymoon Escape",
    brand: "Voyage Privé",
    category: "Gifts & Escapes",
    price: 4200,
    image:
      "https://images.unsplash.com/photo-1535332371349-a5d229f49cb5?auto=format&fit=crop&w=800&q=80",
    events: ["Honeymoon", "Anniversary"],
    note: "Five nights on the cliff, arranged by our travel desk.",
  },
  {
    id: "studio-lumen-bridal-ritual",
    name: "Studio Lumen Bridal Ritual",
    brand: "Studio Lumen",
    category: "Shoes & Accessories",
    price: 350,
    image:
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80",
    events: ["Wedding Day", "Bridal Shower"],
    note: "Trial, wedding-day artistry and a touch-up kit.",
  },
  {
    id: "jardin-peony-bouquet",
    name: "Jardin Peony Bouquet",
    brand: "Botanica",
    category: "Reception & Flowers",
    price: 240,
    image:
      "https://images.unsplash.com/photo-1487530811176-3780de880c2d?auto=format&fit=crop&w=800&q=80",
    events: ["Wedding Day", "Anniversary"],
    note: "Garden peonies, bound in silk ribbon.",
  },
  {
    id: "vanille-bean-cake",
    name: "Vanille Bean Cake",
    brand: "Lumière Pâtisserie",
    category: "Reception & Flowers",
    price: 480,
    image:
      "https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=800&q=80",
    events: ["Wedding Day", "Anniversary"],
    note: "Three tiers, vanilla bean and burnt honey buttercream.",
  },
  {
    id: "lin-blanc-tablescape",
    name: "Lin Blanc Tablescape",
    brand: "The Yesly Edit",
    category: "Reception & Flowers",
    price: 520,
    image:
      "https://images.unsplash.com/photo-1630527152680-500b5453fb04?auto=format&fit=crop&w=800&q=80",
    events: ["Rehearsal Dinner", "Welcome Party"],
    note: "Belgian linen, brass candleholders and hand-thrown plates.",
  },
];
