import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { api } from '../api/client'
import { useAuth } from './AuthContext'

const WishlistContext = createContext(null)

export function WishlistProvider({ children }) {
  const { user } = useAuth()

  const [productIds, setProductIds] = useState(new Set())
  const [products, setProducts] = useState([])

  // ✅ Fetch wishlist
  const refresh = useCallback(async () => {
    if (!user) {
      setProductIds(new Set())
      setProducts([])
      return
    }

    try {
      const data = await api.get('/wishlist', true)

      const list = data.products || []
      setProducts(list)
      setProductIds(new Set(list.map((p) => p._id)))
    } catch (err) {
      console.log("Wishlist fetch error:", err)
    }
  }, [user])

  useEffect(() => {
    refresh()
  }, [refresh])

  // ✅ 🔥 FIXED TOGGLE (instant UI update + backend sync)
  async function toggle(productId) {
    if (!user) throw new Error('NOT_LOGGED_IN')

    // 👉 Optimistic UI update (instant heart change)
    setProductIds(prev => {
      const updated = new Set(prev)
      if (updated.has(productId)) {
        updated.delete(productId)
      } else {
        updated.add(productId)
      }
      return updated
    })

    try {
      const data = await api.post(`/wishlist/${productId}`, {}, true)

      const updatedProducts = data.wishlist?.products || []
      setProducts(updatedProducts)
      setProductIds(new Set(updatedProducts.map(p => p._id)))

      return data.added
    } catch (err) {
      console.log("Wishlist toggle error:", err)

      // ❌ revert if failed
      refresh()
    }
  }

  // ✅ check function
  function isWishlisted(productId) {
    return productIds.has(productId)
  }

  return (
    <WishlistContext.Provider
      value={{
        products,
        isWishlisted,
        toggle,
        refresh
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

// ✅ Hook
export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider')
  return ctx
}
