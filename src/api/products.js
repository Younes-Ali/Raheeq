import axios from 'axios';
import { DUMMY_PRODUCTS } from '../data/dummyProducts.js';

/**
 * ------------------------------------------------------------------
 * Swap-in point for Strapi
 * ------------------------------------------------------------------
 * Right now this always serves the local dummy catalog. Once your
 * Strapi instance is ready:
 *
 *   1. Create a `.env` file with: VITE_STRAPI_URL=http://localhost:1337
 *   2. Flip USE_STRAPI to true below.
 *
 * fetchProducts()'s signature and return shape stay exactly the same,
 * so Shop.jsx and every component that calls it needs ZERO changes.
 * ------------------------------------------------------------------
 */
const USE_STRAPI = false;
const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337';

export const api = axios.create({ baseURL: STRAPI_URL });

export async function fetchProducts({ page = 1, pageSize = 6, category = 'All' } = {}) {
  if (USE_STRAPI) {
    const params = {
      'pagination[page]': page,
      'pagination[pageSize]': pageSize,
      populate: '*',
    };
    if (category !== 'All') params['filters[category][$eq]'] = category;

    const { data } = await api.get('/api/products', { params });
    return {
      items: data.data.map((p) => ({
        id: p.id,
        name: p.attributes.name,
        category: p.attributes.category,
        price: p.attributes.price,
        tag: p.attributes.tag,
        img: p.attributes.image?.data?.attributes?.url ?? null,
      })),
      totalPages: data.meta.pagination.pageCount,
    };
  }

  // ---- dummy mode: simulates the same async shape a real API call has ----
  await new Promise((resolve) => setTimeout(resolve, 350));

  const filtered = category === 'All' ? DUMMY_PRODUCTS : DUMMY_PRODUCTS.filter((p) => p.category === category);
  const start = (page - 1) * pageSize;
  const items = filtered.slice(start, start + pageSize);

  return {
    items,
    totalPages: Math.max(1, Math.ceil(filtered.length / pageSize)),
  };
}
