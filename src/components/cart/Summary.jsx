import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Summary({ total }) {
    const navigate = useNavigate()
    return (
        <aside
            className="
                h-fit
                rounded-[24px]
                border
                border-[rgba(242,234,217,0.12)]
                bg-[var(--dark-green-soft)]
                p-6
                lg:sticky
                lg:top-6
                "
        >
            <h2 className="display mb-6 text-2xl text-[var(--beige)]">
                Order Summary
            </h2>

            <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                    <span className="text-[var(--beige)]">
                        Subtotal
                    </span>

                    <span className="text-yellow-500">
                        {total} EGP
                    </span>
                </div>

                <div className="flex justify-between">
                    <span className="text-[var(--beige)]">
                        Delivery
                    </span>

                    <span className="text-[rgba(242,234,217,0.8)]">
                        Calculated at checkout
                    </span>
                </div>
            </div>

            <div
                className="
                            my-6
                            h-px
                            bg-[rgba(242,234,217,0.12)]
                        "
            />

            <div className="mb-6 flex justify-between">
                <span className="text-lg text-[var(--beige)]">Total</span>

                <span className="text-lg text-yellow-500">
                    {total} EGP
                </span>
            </div>

            <button
                onClick={() => navigate("/checkout")}
                className="
                        w-full
                        rounded-full
                        bg-[var(--beige)]
                        px-6
                        py-4
                        text-lg
                        font-medium
                        text-[var(--dark-green)]
                        transition-all
                        duration-300
                        hover:scale-[1.02]
                        hover:bg-white
                        active:scale-[0.98]
                    "
            >
                Order Now
            </button>
        </aside>
    )
}
