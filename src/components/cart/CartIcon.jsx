import React from "react";
import { ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../../store/cartStore.js";

export default function CartIcon() {
    const navigate = useNavigate();

    const items = useCartStore(
        (state) => state.items
    );

    const totalItems = items.reduce(
        (total, item) => total + item.quantity,
        0
    );

    return (
        <button
            onClick={() => navigate("/cart")}
            aria-label="Shopping cart"
            className="
        fixed
        right-5
        top-5
        z-[1000]
        flex
        h-12
        w-12
        items-center
        justify-center
        rounded-full
        border-2
        border-[var(--dark-green)]
        bg-[var(--beige)]
        text-[var(--dark-green)]
        shadow-lg
        transition-all
        duration-300
        hover:scale-110
        hover:bg-[var(--dark-green)]
        hover:text-[var(--beige)]
        active:scale-95
      "
        >
            <ShoppingBag size={20} strokeWidth={1.7} />

            {totalItems > 0 && (
                <span
                    className="
            absolute
            -right-1
            -top-1
            flex
            h-5
            min-w-5
            items-center
            justify-center
            rounded-full
            bg-red-500
            px-1
            text-[10px]
            font-bold
            text-[var(--beige)]
          "
                >
                    {totalItems}
                </span>
            )}
        </button>
    );
}
