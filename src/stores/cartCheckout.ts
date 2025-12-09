import { defineStore } from 'pinia'

// 选中商品的类型定义
interface SelectedProduct {
  productId: number
  skuId: number
  quantity: number
  price: number
  productname: string
  skuname: string
}

interface CartCheckoutState {
  selectedProducts: SelectedProduct[]
}

export const useCartCheckoutStore = defineStore('cartCheckout', {
  state: (): CartCheckoutState => ({
    selectedProducts: []
  }),
  
  getters: {
    getSelectedProducts: (state) => state.selectedProducts,
    hasSelectedProducts: (state) => state.selectedProducts.length > 0
  },
  
  actions: {
    setSelectedProducts(products: SelectedProduct[]) {
      this.selectedProducts = products
    },
    
    clearSelectedProducts() {
      this.selectedProducts = []
    },
    
    addProduct(product: SelectedProduct) {
      this.selectedProducts.push(product)
    },
    
    removeProduct(skuId: number) {
      const index = this.selectedProducts.findIndex(p => p.skuId === skuId)
      if (index !== -1) {
        this.selectedProducts.splice(index, 1)
      }
    }
  }
})