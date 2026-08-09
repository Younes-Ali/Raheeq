import React from 'react'

export default function Summary({ cartItems, total }) {
    return (
        <aside
            className="
            lg:sticky lg:top-8
            h-fit
            p-6 sm:p-8
            bg-[var(--dark-green-soft)]
            rounded-[28px] border border-[rgba(242,234,217,0.12)]
          "
        >
            <h2
                className="
                mb-7
                text-2xl text-[var(--beige)]
                display
              "
            >
                Your Order
            </h2>

            {/* Products */}

            <div
                className="
                space-y-5
              "
            >
                {cartItems.map((item) => (
                    <div
                        key={item.id}
                        className="
                        flex items-center justify-between
                        gap-4
                      "
                    >

                        {/* Product */}

                        <div
                            className="
                            flex items-center
                            min-w-0
                            gap-3
                          "
                        >

                            <img
                                src={item.img}
                                alt={item.name}
                                className="
                                object-cover
                                h-14 w-14
                                rounded-xl
                                shrink-0
                              "
                            /
                            >

                            <div
                                className="
                                min-w-0
                              "
                            >

                                <p
                                    className="
                                    truncate text-sm text-[var(--beige)]
                                  "
                                >
                                    {item.name}
                                </p>

                                <p
                                    className="
                                    mt-1
                                    text-xs text-[rgba(242,234,217,0.45)]
                                  "
                                >
                                    {item.quantity} × {item.price} EGP
                                </p>

                            </div>

                        </div>

                        {/* Subtotal */}

                        <span
                            className="
                            text-sm text-yellow-500
                            shrink-0
                          "
                        >
                            {Number(item.price) * item.quantity} EGP
                        </span>

                    </div>
                ))}
            </div>

            {/* Divider */}

            <div
                className="
                h-px
                my-6
                bg-white
              "
            /
            >

            {/* Subtotal */}

            <div
                className="
                flex items-center justify-between
              "
            >
                <span
                    className="
                    text-sm text-[var(--beige)]
                  "
                >
                    Subtotal
                </span>

                <span
                    className="
                    text-sm text-yellow-500
                  "
                >
                    {total} EGP
                </span>
            </div>

            {/* Shipping */}

            <div
                className="
                flex items-center justify-between
                mt-3
              "
            >
                <span
                    className="
                    text-sm text-[var(--beige)]
                  "
                >
                    Shipping
                </span>

                <span
                    className="
                    text-sm text-[var(--beige)]
                  "
                >
                    Calculated later
                </span>
            </div>

            {/* Total */}

            <div
                className="
                h-px
                my-6
                bg-[rgba(242,234,217,0.1)]
              "
            /
            >

            <div
                className="
                flex items-center justify-between
              "
            >
                <span
                    className="
                    text-sm text-[var(--beige)]
                  "
                >
                    Total
                </span>

                <span
                    className="
                    text-2xl text-yellow-500
                    display
                  "
                >
                    {total} EGP
                </span>
            </div>

        </aside>
    )
}
