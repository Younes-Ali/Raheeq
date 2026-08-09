import React from "react";
import toast from "react-hot-toast";
import { useCartStore } from "../../store/cartStore.js";

export default function ProductCard({ product }) {
  const addToCart = useCartStore(
    (state) => state.addToCart
  );

  const handleAddToCart = () => {
    addToCart(product);

    toast.success(
      `${product.name} added to cart`
    );
  };

  return (
    <div
      className="
        hover-card
        overflow-hidden
        rounded-[20px]
        border
        border-[rgba(242,234,217,0.12)]
        bg-[var(--dark-green-soft)]
      "
    >
      <img
        src={product.img}
        alt={product.name}
        className="
          block
          aspect-square
          w-full
          object-cover
        "
      />

      <div className="p-5">
        <div
          className="
            mb-1.5
            text-[11px]
            tracking-[0.1em]
            text-[var(--white)]
          "
        >
          {product.tag}
        </div>

        <div
          className="
            display
            text-[18px]
            text-[var(--beige)]
          "
        >
          {product.name}
        </div>

        <div
          className="
            mt-2.5
            flex
            items-center
            justify-between
            gap-3
          "
        >
          <span
            className="
              text-[15px]
              text-yellow-500
            "
          >
            {product.price} EGP
          </span>

          <button
            onClick={handleAddToCart}
            className="
              cursor-pointer
              rounded-full
              bg-[var(--beige)]
              px-4
              py-2
              text-[12px]
              text-[var(--dark-green)]
              transition-all
              duration-300
              hover:scale-105
              hover:bg-white
              active:scale-95
            "
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
