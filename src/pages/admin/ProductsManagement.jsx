import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { adminLogout, adminRequest } from "../../api/admin";

const INITIAL_FORM = {
  name: "",
  description: "",
  category: "Honey",
  price: "",
  old_price: "",
  tag: "",
  img: "",
  stock: "10",
  is_active: "true",
};

const CATEGORIES = ["Honey", "Pollen", "Royal Jelly", "Honeycomb", "Gift Sets"];

const formatPrice = (price) =>
  `${Number(price || 0).toLocaleString("en-US")} EGP`;

function formatDate(date) {
  if (!date) return "—";

  const parsed = new Date(date);

  return Number.isNaN(parsed.getTime())
    ? "—"
    : parsed.toLocaleDateString("en-GB");
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = String(reader.result);
      resolve(result.split(",")[1]);
    };

    reader.onerror = reject;

    reader.readAsDataURL(file);
  });
}

export default function ProductsManagement() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [form, setForm] = useState(INITIAL_FORM);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  async function loadProducts() {
    try {
      setLoading(true);

      const result = await adminRequest({
        action: "list",
        sheet: "products",
      });

      setProducts(result);
    } catch (error) {
      toast.error("Failed to load products");

      if (error.message === "unauthorized") {
        adminLogout();
        navigate("/admin/login", { replace: true });
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) return products;

    return products.filter((product) =>
      [product.name, product.category, product.tag, product.id].some((value) =>
        String(value || "")
          .toLowerCase()
          .includes(query),
      ),
    );
  }, [products, search]);

  const activeCount = products.filter(
    (product) => String(product.is_active).toLowerCase() === "true",
  ).length;

  const outOfStockCount = products.filter(
    (product) => Number(product.stock) <= 0,
  ).length;

  function openAddModal() {
    setEditingProduct(null);
    setForm({ ...INITIAL_FORM });
    setSelectedImage(null);
    setImagePreview("");
    setModalOpen(true);
  }

  function openEditModal(product) {
    setEditingProduct(product);

    setForm({
      name: product.name || "",
      description: product.description || "",
      category: product.category || "Honey",
      price: String(product.price ?? ""),
      old_price: product.old_price ? String(product.old_price) : "",
      tag: product.tag || "",
      img: product.img || "",
      stock: String(product.stock ?? 0),
      is_active:
        String(product.is_active).toLowerCase() === "false" ? "false" : "true",
    });

    setSelectedImage(null);
    setImagePreview(product.img || "");
    setModalOpen(true);
  }

  function closeModal() {
    if (saving) return;

    setModalOpen(false);
    setEditingProduct(null);
    setSelectedImage(null);
    setImagePreview("");
  }

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleImageChange(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG, PNG, WEBP and GIF images are allowed");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5 MB");
      e.target.value = "";
      return;
    }

    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function uploadProductImage(file) {
    const base64 = await fileToBase64(file);

    const result = await adminRequest({
      action: "upload_image",
      image: base64,
      mimeType: file.type,
      name: file.name,
    });

    return result.url;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error("Product name is required");
      return;
    }

    const price = Number(form.price);
    const stock = Number(form.stock);
    const oldPrice = form.old_price.trim() === "" ? 0 : Number(form.old_price);

    if (!Number.isFinite(price) || price <= 0) {
      toast.error("Enter a valid product price");
      return;
    }

    if (!Number.isInteger(stock) || stock < 0) {
      toast.error("Stock must be a non-negative whole number");
      return;
    }

    if (!Number.isFinite(oldPrice) || oldPrice < 0) {
      toast.error("Enter a valid old price");
      return;
    }

    try {
      setSaving(true);

      let imageUrl = form.img;

      if (selectedImage) {
        toast.loading("Uploading product image...", {
          id: "product-image",
        });

        imageUrl = await uploadProductImage(selectedImage);

        toast.success("Image uploaded successfully", {
          id: "product-image",
        });
      }

      const now = new Date().toISOString();

      const record = {
        id: editingProduct ? String(editingProduct.id) : String(Date.now()),

        name: form.name.trim(),
        description: form.description.trim(),
        category: form.category,
        price,
        old_price: oldPrice,
        tag: form.tag.trim(),
        img: imageUrl,
        stock,
        is_active: form.is_active,
        created_at: editingProduct ? editingProduct.created_at : now,
        updated_at: now,
      };

      await adminRequest({
        action: "upsert",
        sheet: "products",
        record,
      });

      toast.success(
        editingProduct
          ? "Product updated successfully"
          : "Product added successfully",
      );

      closeModal();
      await loadProducts();
    } catch (error) {
      toast.error(error.message || "Failed to save product");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(product) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"?`,
    );

    if (!confirmed) return;

    try {
      await adminRequest({
        action: "delete",
        sheet: "products",
        id: product.id,
      });

      setProducts((previous) =>
        previous.filter((item) => String(item.id) !== String(product.id)),
      );

      toast.success("Product deleted successfully");
    } catch (error) {
      toast.error(error.message || "Failed to delete product");
    }
  }

  async function toggleProductStatus(product) {
    const newStatus =
      String(product.is_active).toLowerCase() === "true" ? "false" : "true";

    try {
      await adminRequest({
        action: "upsert",
        sheet: "products",
        record: {
          ...product,
          is_active: newStatus,
          updated_at: new Date().toISOString(),
        },
      });

      setProducts((previous) =>
        previous.map((item) =>
          String(item.id) === String(product.id)
            ? { ...item, is_active: newStatus }
            : item,
        ),
      );

      toast.success(
        newStatus === "true" ? "Product activated" : "Product deactivated",
      );
    } catch (error) {
      toast.error(error.message || "Failed to update product");
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f1e8] md:flex">
      <aside className="flex w-full flex-col bg-[#173f32] p-6 text-white md:min-h-screen md:w-64">
        <div>
          <h1 className="text-3xl font-bold">Raheeq</h1>
          <p className="mt-1 text-sm text-white/60">Admin Panel</p>
        </div>

        <nav className="mt-10 flex gap-2 md:flex-col">
          <Link
            to="/admin"
            className="rounded-lg px-4 py-3 text-white/75 transition hover:bg-white/10"
          >
            Dashboard
          </Link>

          <Link
            to="/admin/products"
            className="rounded-lg bg-white/15 px-4 py-3 font-medium"
          >
            Products
          </Link>

          <Link
            to="/admin/orders"
            className="rounded-lg px-4 py-3 text-white/75 transition hover:bg-white/10"
          >
            Orders
          </Link>
        </nav>

        <button
          onClick={() => {
            adminLogout();
            navigate("/admin/login", { replace: true });
          }}
          className="mt-auto hidden rounded-lg border border-white/20 px-4 py-3 text-left text-white/80 transition hover:bg-red-500 md:block"
        >
          Logout
        </button>
      </aside>

      <main className="min-w-0 flex-1 p-5 md:p-8">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-[#173f32]">Products</h2>

            <p className="mt-2 text-gray-500">
              Manage your store inventory and products.
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="rounded-lg bg-[#173f32] px-5 py-3 font-semibold text-white transition hover:bg-[#1b9c85]"
          >
            + Add Product
          </button>
        </header>

        <section className="mb-8 grid gap-4 sm:grid-cols-3">
          {[
            {
              title: "Total Products",
              value: products.length,
            },
            {
              title: "Active Products",
              value: activeCount,
            },
            {
              title: "Out of Stock",
              value: outOfStockCount,
            },
          ].map((stat) => (
            <div
              key={stat.title}
              className="rounded-2xl border border-[#e9e1d2] bg-white p-5 shadow-sm"
            >
              <p className="text-sm text-gray-500">{stat.title}</p>

              <h3 className="mt-3 text-3xl font-bold text-[#173f32]">
                {stat.value}
              </h3>
            </div>
          ))}
        </section>

        <section className="overflow-hidden rounded-2xl border border-[#e9e1d2] bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b p-5">
            <h3 className="text-xl font-bold text-[#173f32]">All Products</h3>

            <div className="flex gap-3">
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full rounded-lg border border-gray-200 px-4 py-2 outline-none focus:border-[#1b9c85] sm:w-64"
              />

              <button
                onClick={loadProducts}
                disabled={loading}
                className="rounded-lg border border-gray-200 px-4 py-2 text-[#173f32] transition hover:bg-gray-50 disabled:opacity-50"
              >
                Refresh
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-[350px] items-center justify-center">
              <div className="text-center">
                <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#1b4d3e] border-t-transparent" />

                <p className="mt-4 text-[#1b4d3e]">Loading products...</p>
              </div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-lg font-semibold text-[#173f32]">
                No products found
              </p>

              <p className="mt-2 text-sm text-gray-400">
                Try another search or add a new product.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left">
                <thead className="bg-[#faf9f5] text-sm text-gray-500">
                  <tr>
                    <th className="px-5 py-4 font-medium">Product</th>
                    <th className="px-5 py-4 font-medium">Category</th>
                    <th className="px-5 py-4 font-medium">Price</th>
                    <th className="px-5 py-4 font-medium">Stock</th>
                    <th className="px-5 py-4 font-medium">Status</th>
                    <th className="px-5 py-4 font-medium">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredProducts.map((product) => {
                    const active =
                      String(product.is_active).toLowerCase() === "true";

                    return (
                      <tr
                        key={product.id}
                        className="border-t border-gray-100 transition hover:bg-[#faf9f5]"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={product.img || "/images/placeholder.png"}
                              alt={product.name}
                              className="h-14 w-14 rounded-lg border border-gray-100 object-cover"
                            />

                            <div>
                              <p className="font-semibold text-[#173f32]">
                                {product.name}
                              </p>

                              <p className="mt-1 text-xs text-gray-400">
                                ID: {product.id}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-sm text-gray-600">
                          {product.category}
                        </td>

                        <td className="px-5 py-4">
                          <p className="font-semibold text-[#173f32]">
                            {formatPrice(product.price)}
                          </p>

                          {Number(product.old_price) > 0 && (
                            <p className="text-xs text-gray-400 line-through">
                              {formatPrice(product.old_price)}
                            </p>
                          )}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={
                              Number(product.stock) <= 0
                                ? "font-semibold text-red-600"
                                : "text-gray-600"
                            }
                          >
                            {product.stock}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <button
                            onClick={() => toggleProductStatus(product)}
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              active
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {active ? "Active" : "Inactive"}
                          </button>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openEditModal(product)}
                              className="rounded-lg bg-[#eaf2ed] px-3 py-2 text-sm font-medium text-[#173f32] hover:bg-[#d8e8dd]"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() => handleDelete(product)}
                              className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {!loading && filteredProducts.length > 0 && (
            <div className="border-t px-5 py-4 text-sm text-gray-400">
              Showing {filteredProducts.length} of {products.length} products
            </div>
          )}
        </section>
      </main>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <form
            onSubmit={handleSubmit}
            className="my-8 w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-[#173f32]">
                  {editingProduct ? "Edit Product" : "Add Product"}
                </h2>

                <p className="mt-1 text-sm text-gray-400">
                  Enter your product information.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="text-2xl text-gray-400 hover:text-red-500"
              >
                ×
              </button>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Product Name *
                </label>

                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  maxLength={150}
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-[#1b9c85]"
                  placeholder="Enter product name"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Description
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  maxLength={500}
                  rows={3}
                  className="w-full resize-none rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-[#1b9c85]"
                  placeholder="Product description..."
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Category *
                </label>

                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-[#1b9c85]"
                >
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Tag
                </label>

                <input
                  name="tag"
                  value={form.tag}
                  onChange={handleChange}
                  maxLength={100}
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-[#1b9c85]"
                  placeholder="e.g. Bestseller"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Price (EGP) *
                </label>

                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  min="0.01"
                  step="0.01"
                  required
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-[#1b9c85]"
                  placeholder="220"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Old Price (EGP)
                </label>

                <input
                  type="number"
                  name="old_price"
                  value={form.old_price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-[#1b9c85]"
                  placeholder="Optional"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Stock *
                </label>

                <input
                  type="number"
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  min="0"
                  step="1"
                  required
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-[#1b9c85]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Product Status
                </label>

                <select
                  name="is_active"
                  value={form.is_active}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-[#1b9c85]"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Product Image
                </label>

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleImageChange}
                  className="w-full rounded-lg border border-gray-200 p-3 text-sm"
                />

                <p className="mt-2 text-xs text-gray-400">
                  JPG, PNG, WEBP or GIF. Maximum size: 5 MB.
                </p>

                {imagePreview && (
                  <div className="mt-4">
                    <img
                      src={imagePreview}
                      alt="Product preview"
                      className="h-36 w-36 rounded-xl border border-gray-200 object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3 border-t pt-5">
              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="rounded-lg border border-gray-200 px-5 py-3 text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-[#173f32] px-6 py-3 font-semibold text-white transition hover:bg-[#1b9c85] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? "Saving..."
                  : editingProduct
                    ? "Save Changes"
                    : "Add Product"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
