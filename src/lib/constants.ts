export const BRAND = {
  name: "Yesly",
  tagline:
    "Curating the world's finest ateliers, legendary châteaux, and haute bridal artisans.",
  email: "concierge@yesly.com",
  phone: "+1 (415) 555-0134",
  address: "18 Atelier Lane, San Francisco, CA",
  social: {
    instagram: "https://www.instagram.com/yeslyweddings",
    pinterest: "https://www.pinterest.com/yeslyweddings",
    facebook: "https://www.facebook.com/yeslyweddings",
  },
  developer: {
    name: "Mith9n",
    portfolioUrl: "https://mith9n.netlify.app/",
  },
};

export const CATEGORIES = [
  "Photography & Videography",
  "Wedding Venues",
  "Decoration & Florist",
  "Catering Services",
  "Makeup & Styling",
  "Wedding Fashion",
] as const;

export const CATEGORY_META: Record<
  string,
  { icon: string; blurb: string; image: string }
> = {
  "Photography & Videography": {
    icon: "photo_camera",
    blurb: "Fine art portraiture, editorial film and cinematic reels.",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80",
  },
  "Wedding Venues": {
    icon: "castle",
    blurb: "Historic estates, vineyard terraces and private châteaux.",
    image:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=80",
  },
  "Decoration & Florist": {
    icon: "local_florist",
    blurb: "Sculptural floral architecture and bespoke tablescapes.",
    image:
      "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=900&q=80",
  },
  "Catering Services": {
    icon: "restaurant",
    blurb: "Michelin-trained chefs, estate pairings and haute pâtisserie.",
    image:
      "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=900&q=80",
  },
  "Makeup & Styling": {
    icon: "face",
    blurb: "Bridal beauty artistry that photographs beautifully in any light.",
    image:
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=900&q=80",
  },
  "Wedding Fashion": {
    icon: "checkroom",
    blurb: "Couture gowns, tailoring and hand-embroidered veils.",
    image:
      "https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=900&q=80",
  },
};

export const CATEGORY_ICONS: Record<string, string> = Object.fromEntries(
  Object.entries(CATEGORY_META).map(([key, meta]) => [key, meta.icon]),
);

export const HERO_VIDEO =
  "/yesly_hero_section_video/Wedding%20Planner%20Website%20Video%20Yesly.mp4";

export const STATUS_STYLES: Record<string, string> = {
  pending: "bg-secondary-fixed/40 text-on-secondary-fixed",
  approved: "bg-[#e6f2e5] text-[#2f6b3a]",
  rejected: "bg-error-container text-error",
  accepted: "bg-[#e6f2e5] text-[#2f6b3a]",
  cancelled: "bg-surface-container-highest text-on-surface-variant",
  paid: "bg-[#e6f2e5] text-[#2f6b3a]",
  failed: "bg-error-container text-error",
};

export const PRICE_SORT_OPTIONS = [
  { value: "newest", label: "Newest curations" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
] as const;
