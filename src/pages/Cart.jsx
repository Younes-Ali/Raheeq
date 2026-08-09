import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Minus,
    Plus,
    Trash2,
    ArrowLeft,
} from "lucide-react";

import { useCartStore } from "../store/cartStore.js";
import Summary from "../components/cart/Summary.jsx";
import ItemsCart from "../components/cart/ItemsCart.jsx";

export default function Cart() {
    const navigate = useNavigate();

    const items = useCartStore(
        (state) => state.items
    );

    const getTotalPrice = useCartStore(
        (state) => state.getTotalPrice
    );

    const total = getTotalPrice();

    return (
        <div
            className="
            min-h-screen
            px-5 sm:px-8 md:px-12 lg:px-20 py-8
            text-[var(--dark-green)]
            bg-[var(--beige)]
          "
        >
            {/* Back */}
            <Link
                to="/shop"
                className="
                inline-flex items-center
                mb-10
                text-sm text-[var(--dark-green)]
                opacity-80 hover:opacity-100 transition
                gap-2
              "
            >
                <ArrowLeft size={17} />
                Continue Shopping
            </Link>

            {/* Header */}
            <header
                className="
                mb-10
              "
            >
                <p
                    className="
                    mb-2
                    text-xs text-black tracking-[0.2em]
                  "
                >
                    YOUR SELECTION
                </p>

                <h1
                    className="
                    text-[clamp(2rem,5vw,4rem)]
                    display
                  "
                >
                    Your Cart
                </h1>
            </header>

            {items.length === 0 ? (
                <div
                    className="
                    flex flex-col items-center justify-center
                    min-h-[400px]
                    text-center
                  "
                >
                    <p
                        className="
                        mb-6
                        text-black
                      "
                    >
                        Your cart is empty.
                    </p>

                    <button
                        onClick={() => navigate("/shop")}
                        className="
                        rounded-full
                        bg-[var(--beige)]
                        px-7
                        py-3
                        text-sm
                        text-[var(--dark-green)]
                        transition
                        hover:scale-105
                        "
                    >
                        Explore the Collection
                    </button>
                </div>
            ) : (
                <div
                    className="
                    grid lg:grid-cols-[1fr_360px]
                    max-w-[1200px]
                    mx-auto
                    gap-8
                  "
                >
                    {/* Items */}
                    <ItemsCart items={items} />
                    {/* Summary */}
                    <Summary total={total} />
                </div>
            )}
        </div>
    );
}
