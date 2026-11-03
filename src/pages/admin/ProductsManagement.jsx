import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { adminLogout, adminRequest } from "../../api/admin";

import AdminHeader from "../../components/admin/layout/AdminHeader";

import ProductStats from "../../components/admin/products/ProductStats";
import ProductsTable from "../../components/admin/products/ProductsTable";
import ProductForm from "../../components/admin/products/ProductForm";

import LoadingState from "../../components/admin/shared/LoadingState";

import { Plus, RefreshCw } from "lucide-react";

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
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [form, setForm] = useState(INITIAL_FORM);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const loadProducts = useCallback(
    async (isRefresh = false) => {
      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const result = await adminRequest({
          action: "list",
          sheet: "products",
        });

        setProducts(Array.isArray(result) ? result : []);
      } catch (error) {
        toast.error("Failed to load products");

        if (
          error.message === "unauthorized" ||
          error.message === "session_expired"
        ) {
          adminLogout();
          navigate("/admin/login", { replace: true });
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [navigate],
  );

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

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
    setForm({ ...INITIAL_FORM });
  }

  function handleImageChange(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG, PNG, WEBP and GIF images are allowed");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5 MB");
      event.target.value = "";
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

  async function handleSubmit(event) {
    event.preventDefault();

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

      setModalOpen(false);
      setEditingProduct(null);
      setSelectedImage(null);
      setImagePreview("");
      setForm({ ...INITIAL_FORM });

      await loadProducts(true);
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
    <>
      <AdminHeader
        actions={
          <button
            type="button"
            onClick={openAddModal}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#173f32] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1b9c85]"
          >
            <Plus size={18} />
            Add Product
          </button>
        }
      />

      <div className="space-y-6 p-5 sm:p-8">
        <ProductStats
          totalProducts={products.length}
          activeProducts={activeCount}
          outOfStock={outOfStockCount}
        />

        <section className="overflow-hidden rounded-2xl border border-[#e9e1d2] bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e9e1d2] p-5">
            <div>
              <h3 className="text-xl font-bold text-[#173f32]">All Products</h3>

              <p className="mt-1 text-sm text-gray-500">
                Manage your store inventory and products.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search products..."
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#1b9c85] sm:w-64"
              />

              <button
                type="button"
                onClick={() => loadProducts(true)}
                disabled={refreshing}
                className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm text-[#173f32] transition hover:bg-gray-50 disabled:opacity-50"
              >
                <RefreshCw
                  size={16}
                  className={refreshing ? "animate-spin" : ""}
                />
                Refresh
              </button>
            </div>
          </div>

          {loading ? (
            <LoadingState message="Loading products..." />
          ) : (
            <>
              <ProductsTable
                products={filteredProducts}
                onEdit={openEditModal}
                onDelete={handleDelete}
                onToggleStatus={toggleProductStatus}
              />

              <div className="border-t border-[#e9e1d2] px-5 py-4 text-sm text-gray-400">
                Showing {filteredProducts.length} of {products.length} products
              </div>
            </>
          )}
        </section>
      </div>

      {modalOpen && (
        <ProductForm
          form={form}
          setForm={setForm}
          editingProduct={editingProduct}
          saving={saving}
          selectedImage={selectedImage}
          imagePreview={imagePreview}
          onImageChange={handleImageChange}
          onSubmit={handleSubmit}
          onClose={closeModal}
        />
      )}
    </>
  );
}
