'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface CartItem {
    id: string
    modelId: string
    modelName: string
    brandName: string
    categoryName: string
    conditionId: string
    conditionName: string
    carrierId?: string
    carrierName?: string
    storageId?: string
    storageName?: string
    hasOriginalBox: boolean
    hasOriginalCharger: boolean
    quotedPrice: number
    imageUrl?: string
    addedAt: string
}

interface CartContextType {
    items: CartItem[]
    addItem: (item: Omit<CartItem, 'id' | 'addedAt'>) => void
    removeItem: (id: string) => void
    clearCart: () => void
    totalPrice: number
    itemCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([])
    const [isLoaded, setIsLoaded] = useState(false)

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('recyce_cart')
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart))
            } catch (e) {
                console.error('Error loading cart:', e)
            }
        }
        setIsLoaded(true)
    }, [])

    // Save cart to localStorage on change
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('recyce_cart', JSON.stringify(items))
        }
    }, [items, isLoaded])

    const addItem = (item: Omit<CartItem, 'id' | 'addedAt'>) => {
        const newItem: CartItem = {
            ...item,
            id: crypto.randomUUID(),
            addedAt: new Date().toISOString()
        }
        setItems(prev => [...prev, newItem])
    }

    const removeItem = (id: string) => {
        setItems(prev => prev.filter(item => item.id !== id))
    }

    const clearCart = () => {
        setItems([])
    }

    const totalPrice = items.reduce((sum, item) => sum + item.quotedPrice, 0)
    const itemCount = items.length

    return (
        <CartContext.Provider value={{ items, addItem, removeItem, clearCart, totalPrice, itemCount }}>
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider')
    }
    return context
}
