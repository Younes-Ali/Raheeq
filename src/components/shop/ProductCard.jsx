import React from "react";
import toast from "react-hot-toast";
import { useCartStore } from "../../store/cartStore.js";

export default function ProductCard({ product }) {
  const outOfStock = product.outOfStock;
  const addToCart = useCartStore((state) => state.addToCart);

  const handleAddToCart = () => {
    if (outOfStock) {
      toast.error("This product is currently out of stock");
      return;
    }

    addToCart(product);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div
      className={`relative overflow-hidden rounded-[20px] border border-[rgba(242,234,217,0.12)] bg-[var(--dark-green-soft)] transition-all duration-300 hover-card ${
        outOfStock ? "opacity-75" : ""
      }`}
    >
      {outOfStock && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-[rgba(22,40,28,0.75)]">
          {" "}
          <span className="rounded-full border border-[var(--beige)] px-5 py-2 text-sm font-medium tracking-wide text-[var(--beige)]">
            Out of Stock{" "}
          </span>{" "}
        </div>
      )}
      ```
      <img
        src={product.img}
        alt={product.name || "Product"}
        loading="lazy"
        onError={(event) => {
          event.currentTarget.style.visibility = "hidden";
        }}
        className="aspect-square w-full object-cover -mt-6"
      />
      <div className="p-5">
        <div className="mb-1.5 text-[11px] tracking-[0.1em] text-[var(--white)]">
          {product.tag}
        </div>

        <h3 className="text-[18px] text-[var(--beige)]">{product.name}</h3>

        <div className="mt-2.5 flex items-center justify-between gap-3">
          <span className="text-[15px] font-medium text-yellow-500">
            {product.price} EGP
          </span>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={outOfStock}
            className={`rounded-full px-4 py-2 text-[12px] transition-all duration-300 ${
              outOfStock
                ? "cursor-not-allowed bg-gray-400 text-gray-700"
                : "cursor-pointer bg-[var(--beige)] text-[var(--dark-green)] hover:scale-105 hover:bg-white active:scale-95"
            }`}
          >
            {outOfStock ? "Unavailable" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
