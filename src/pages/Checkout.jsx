import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Link, Navigate, useNavigate } from "react-router-dom";

import { useCartStore } from "../store/cartStore.js";
import FullField from "../components/ckeckout/FullField.jsx";
import CheckoutForm from "../components/ckeckout/CheckoutForm.jsx";
import Summary from "../components/ckeckout/Summary.jsx";



export default function Checkout() {
    const navigate = useNavigate();


    const cartItems = useCartStore((state) => state.items);
    const getTotalPrice = useCartStore((state) => state.getTotalPrice);

    const total = getTotalPrice();


    if (cartItems.length === 0) {
        return <Navigate to="/shop" replace />;
    }


    return (
        <main
            className="
            min-h-screen
            px-5 sm:px-8 md:px-12 lg:px-20 py-8
            text-[var(--dark-green)]
            bg-[var(--beige)]
          "
        >


            <header
                className="
                flex items-center justify-between
                max-w-6xl
                mx-auto mb-10
              "
            >
                <Link
                    to="/cart"
                    className="
                    text-sm text-black hover:text-black/60
                    transition-colors
                  "
                >
                    ← Back to Cart
                </Link>

                <Link
                    to="/"
                    className="
                    text-xl text-[var(--dark-green]
                    transition-opacity hover:opacity-70
                    display
                  "
                >
                    Raheeq
                </Link>
            </header>

            <section
                className="
                max-w-6xl
                mx-auto mb-12
              "
            >
                <p
                    className="
                    mb-3
                    text-xs text-[var(--dark-green)] uppercase tracking-[0.25em]
                  "
                >
                    Complete your order
                </p>

                <h1
                    className="
                    text-[clamp(2.5rem,6vw,5rem)] leading-none
                    display
                  "
                >
                    Checkout
                </h1>
            </section>

            <div
                className="
                grid lg:grid-cols-[1fr_380px]
                max-w-6xl
                mx-auto
                gap-8
              "
            >
                <CheckoutForm total={total} cartItems={cartItems} />
                <Summary cartItems={cartItems} total={total} />


            </div>
        </main>
    );
}
