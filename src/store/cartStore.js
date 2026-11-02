import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (product) => {
        if (product.stock <= 0 || product.outOfStock) {
          return false;
        }

        const items = get().items;

        const existingItem = items.find((item) => item.id === product.id);

        if (existingItem) {
          if (existingItem.quantity >= product.stock) {
            return false;
          }

          set({
            items: items.map((item) =>
              item.id === product.id
                ? {
                    ...item,
                    quantity: item.quantity + 1,
                    price: product.price,
                    stock: product.stock,
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

        return true;
      },

      removeFromCart: (productId) => {
        set({
          items: get().items.filter((item) => item.id !== productId),
        });
      },

      increaseQuantity: (productId) => {
        set({
          items: get().items.map((item) => {
            if (item.id !== productId) return item;

            if (item.quantity >= item.stock) return item;

            return {
              ...item,
              quantity: item.quantity + 1,
            };
          }),
        });
      },

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

      clearCart: () => {
        set({ items: [] });
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

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
