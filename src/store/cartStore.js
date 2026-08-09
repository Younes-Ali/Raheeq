import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      // Add product
      addToCart: (product) => {
        const items = get().items;

        const existingItem = items.find((item) => item.id === product.id);

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.id === product.id
                ? {
                    ...item,
                    quantity: item.quantity + 1,
                  }
                : item,
            ),
          });
        } else {
          set({
            items: [
              ...items,
              {
                ...product,
                quantity: 1,
              },
            ],
          });
        }
      },

      // Remove completely
      removeFromCart: (productId) => {
        set({
          items: get().items.filter((item) => item.id !== productId),
        });
      },

      // Increase quantity
      increaseQuantity: (productId) => {
        set({
          items: get().items.map((item) =>
            item.id === productId
              ? {
                  ...item,
                  quantity: item.quantity + 1,
                }
              : item,
          ),
        });
      },

      // Decrease quantity
      decreaseQuantity: (productId) => {
        const items = get().items;

        set({
          items: items
            .map((item) =>
              item.id === productId
                ? {
                    ...item,
                    quantity: item.quantity - 1,
                  }
                : item,
            )
            .filter((item) => item.quantity > 0),
        });
      },

      // Clear cart
      clearCart: () => {
        set({ items: [] });
      },

      // Total number of products
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      // Total price
      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + Number(item.price) * item.quantity,
          0,
        );
      },
    }),
    {
      name: "raheeq-cart",
    },
  ),
);
