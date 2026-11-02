import { apiRequest } from "./api.js";

export async function fetchProducts({
  page = 1,
  pageSize = 6,
  category = "All",
} = {}) {
  const products = await apiRequest({
    action: "get_products",
  });

  const normalizedProducts = products.map((product) => ({
    id: String(product.id),
    name: product.name,
    description: product.description || "",
    category: product.category,
    price: Number(product.price),
    oldPrice: Number(product.old_price) || null,
    tag: product.tag || "",
    img: product.img || "",
    stock: Number(product.stock) || 0,
    outOfStock: Number(product.stock) <= 0,
  }));

  const filtered =
    category === "All"
      ? normalizedProducts
      : normalizedProducts.filter((product) => product.category === category);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  const start = (page - 1) * pageSize;

  return {
    items: filtered.slice(start, start + pageSize),
    totalPages,
  };
}
