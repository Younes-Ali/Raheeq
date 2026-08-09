// Placeholder catalog — swap out once Strapi is wired up (see src/api/products.js)
const img = {
  honey: '/images/honey-jars-nuts.jpg',
  drip: '/images/honey-drip-jar.jpg',
  comb: '/images/honeycomb-chunks.jpg',
  bee1: '/images/bee-on-lavender.jpg',
  bee2: '/images/bee-on-red-flower.jpg',
  bee3: '/images/bee-on-yellow-flower.jpg',
};

export const CATEGORIES = ['All', 'Honey', 'Pollen', 'Royal Jelly', 'Honeycomb', 'Gift Sets'];

export const DUMMY_PRODUCTS = [
  { id: 1, name: 'Wildflower Honey', category: 'Honey', price: 220, tag: 'Bestseller', img: img.drip },
  { id: 2, name: 'Acacia Honey', category: 'Honey', price: 240, tag: 'Light & Floral', img: img.honey },
  { id: 3, name: 'Forest Honey', category: 'Honey', price: 260, tag: 'Bold', img: img.bee2 },
  { id: 4, name: 'Clover Honey', category: 'Honey', price: 210, tag: 'Everyday', img: img.bee3 },
  { id: 5, name: 'Raw Bee Pollen', category: 'Pollen', price: 180, tag: 'Raw', img: img.bee1 },
  { id: 6, name: 'Pollen Granules 250g', category: 'Pollen', price: 150, tag: 'Snack Size', img: img.bee2 },
  { id: 7, name: 'Royal Jelly Fresh', category: 'Royal Jelly', price: 380, tag: 'Limited', img: img.honey },
  { id: 8, name: 'Royal Jelly Capsules', category: 'Royal Jelly', price: 320, tag: 'Daily Dose', img: img.drip },
  { id: 9, name: 'Whole Honeycomb', category: 'Honeycomb', price: 300, tag: 'Whole Cut', img: img.comb },
  { id: 10, name: 'Honeycomb Chunks 200g', category: 'Honeycomb', price: 190, tag: 'Snackable', img: img.comb },
  { id: 11, name: 'Starter Gift Box', category: 'Gift Sets', price: 450, tag: '3 Jars', img: img.honey },
  { id: 12, name: 'Deluxe Tasting Set', category: 'Gift Sets', price: 620, tag: '5 Jars', img: img.drip },
  { id: 13, name: 'Honey & Comb Duo', category: 'Gift Sets', price: 380, tag: 'Popular', img: img.comb },
  { id: 14, name: 'Sidr Honey', category: 'Honey', price: 340, tag: 'Rare', img: img.bee1 },
];
