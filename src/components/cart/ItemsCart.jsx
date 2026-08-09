import { Minus, Plus, Trash2 } from 'lucide-react'
import React from 'react'
import { useCartStore } from '../../store/cartStore';

export default function ItemsCart({ items }) {
    const increaseQuantity = useCartStore(
        (state) => state.increaseQuantity
    );

    const decreaseQuantity = useCartStore(
        (state) => state.decreaseQuantity
    );
    const removeFromCart = useCartStore(
        (state) => state.removeFromCart
    );

    return (
        <div
            className="
            space-y-4
          "
        >
            {items.map((item) => (
                <div
                    key={item.id}
                    className="
                    flex flex-col sm:flex-row sm:items-center
                    p-4
                    bg-[var(--dark-green-soft)]
                    rounded-[20px] border border-[rgba(242,234,217,0.12)]
                    gap-5
                  "
                >
                    {/* Image */}
                    <img
                        src={item.img}
                        alt={item.name}
                        className="
                        object-contain
                        h-28 w-fit
                        rounded-[14px]
                      "
                    /
                    >

                    {/* Info */}
                    <div
                        className="
                        flex-1
                      "
                    >
                        <p
                            className="
                            mb-1
                            text-[10px] text-[var(--white)] tracking-[0.12em]
                          "
                        >
                            {item.tag}
                        </p>

                        <h2
                            className="
                            text-xl text-[var(--beige)]
                            display
                          "
                        >
                            {item.name}
                        </h2>

                        <p
                            className="
                            mt-2
                            text-sm text-yellow-500
                          "
                        >
                            {item.price} EGP
                        </p>
                    </div>

                    {/* Quantity */}
                    <div
                        className="
                        flex items-center
                        w-fit
                        px-2 py-1
                        rounded-full border-2 border-[var(--beige)]
                        gap-3
                      "
                    >
                        <button
                            onClick={() =>
                                decreaseQuantity(item.id)
                            }
                            className="
                                flex
                                h-7
                                w-7
                                items-center
                                justify-center
                                rounded-full
                                transition
                                hover:bg-yellow-300
                                hover:text-black
                                text-[var(--beige)]
                                "
                        >
                            <Minus size={13} />
                        </button>

                        <span
                            className="
                            min-w-5
                            text-center text-sm text-[var(--beige)]
                          "
                        >
                            {item.quantity}
                        </span>

                        <button
                            onClick={() =>
                                increaseQuantity(item.id)
                            }
                            className="
                                    flex
                                    h-7
                                    w-7
                                    items-center
                                    justify-center
                                    rounded-full
                                    transition
                                    hover:bg-yellow-300
                                    hover:text-black
                                    text-[var(--beige)]
                                "
                        >
                            <Plus size={13} />
                        </button>
                    </div>

                    {/* Item total */}
                    <div
                        className="
                        min-w-[90px]
                        text-right
                      "
                    >
                        <p
                            className="
                            text-sm text-yellow-500
                          "
                        >
                            <span
                                className="
                                text-2xl text-[var(--beige)]
                              "
                            >total : </span>
                            {Number(item.price) *
                                item.quantity}{" "}
                            EGP
                        </p>

                        <button
                            onClick={() =>
                                removeFromCart(item.id)
                            }
                            className="
                                mt-2
                                text-sm
                                text-red-500
                                opacity-70
                                transition
                                hover:opacity-100
                                "
                        >
                            <Trash2
                                size={15}
                                className="
                                inline
                                mr-1
                              "
                            /
                            >
                            Remove
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )
}
