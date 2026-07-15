import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, color = null, quantity = 1) => {
        const { items } = get()
        const existingItem = items.find(
          (item) => item.product_id === product.id && item.color === color
        )

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.id === existingItem.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          })
        } else {
          const newItem = {
            id: `${product.id}-${color}-${Date.now()}`,
            product_id: product.id,
            name: product.name,
            slug: product.slug,
            price: product.price,
            image: product.images?.[0] || null,
            color,
            quantity,
            stock: product.stock,
          }
          set({ items: [...items, newItem] })
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) })
      },

      updateQuantity: (id, quantity) => {
        if (quantity < 1) return
        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        })
      },

      clearCart: () => set({ items: [] }),

      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        )
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0)
      },
    }),
    {
      name: 'jewel-inara-cart',
    }
  )
)
