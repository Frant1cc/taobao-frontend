import { defineStore } from 'pinia'
import { getShopInfo, updateShopInfo, uploadShopLogo } from '@/api/modules/shop'
import type { ShopInfo, UpdateShopParams, ShopStatistics } from '@/types/shop/index'

// 商家店铺状态接口
export interface ShopState {
  // 当前店铺信息
  shopInfo: ShopInfo | null
  // 店铺统计信息
  shopStatistics: ShopStatistics | null
  // 加载状态
  loading: boolean
  // 错误信息
  error: string | null
}

export const useShopStore = defineStore('shop', {
  state: (): ShopState => ({
    shopInfo: null,
    shopStatistics: null,
    loading: false,
    error: null
  }),
  
  getters: {
    // 获取店铺基本信息
    currentShop: (state) => state.shopInfo,
    // 获取店铺统计信息
    statistics: (state) => state.shopStatistics,
    // 检查店铺是否正常营业
    isShopNormal: (state) => state.shopInfo?.status === 'normal',
    // 检查店铺是否关闭
    isShopClosed: (state) => state.shopInfo?.status === 'closed',
    // 检查店铺是否在审核中
    isShopAuditing: (state) => state.shopInfo?.status === 'auditing',
    // 获取店铺Logo URL（处理跨域问题）
    shopLogoUrl: (state) => {
      if (!state.shopInfo?.shopLogo) return 'https://via.placeholder.com/200x200'
      
      const logoPath = state.shopInfo.shopLogo
      
      // 如果已经是完整URL，检查是否来自阿里云OSS
      if (logoPath.startsWith('http://') || logoPath.startsWith('https://')) {
        if (logoPath.includes('taobao-hqh.oss-cn-beijing.aliyuncs.com')) {
          // 将阿里云OSS URL转换为本地代理路径
          const ossPath = logoPath.replace('https://taobao-hqh.oss-cn-beijing.aliyuncs.com/', '')
          return `/oss/${ossPath}`
        } else {
          // 其他外部URL直接使用
          return logoPath
        }
      }
      
      // 相对路径，拼接基础图片URL
      return `${import.meta.env.VITE_IMAGE_BASE_URL}${logoPath}`
    }
  },
  
  actions: {
    // 设置店铺信息
    setShopInfo(shopInfo: ShopInfo) {
      this.shopInfo = shopInfo
      // 同时保存到本地存储
      localStorage.setItem('shopInfo', JSON.stringify(shopInfo))
    },
    
    // 设置店铺统计信息
    setShopStatistics(statistics: ShopStatistics) {
      this.shopStatistics = statistics
    },
    
    // 从本地存储加载店铺信息
    loadFromLocalStorage() {
      const shopInfoStr = localStorage.getItem('shopInfo')
      
      if (shopInfoStr) {
        try {
          const shopInfo = JSON.parse(shopInfoStr)
          this.shopInfo = shopInfo
        } catch (e) {
          console.error('解析店铺信息失败:', e)
        }
      }
    },
    
    // 获取店铺信息
    async fetchShopInfo() {
      this.loading = true
      this.error = null
      
      try {
        const response = await getShopInfo()
        if (response.code === 200 && response.data) {
          this.setShopInfo(response.data)
          return response.data
        } else {
          this.error = response.msg || '获取店铺信息失败'
          throw new Error(this.error)
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : '获取店铺信息失败'
        console.error('获取店铺信息失败:', error)
        throw error
      } finally {
        this.loading = false
      }
    },
    
    // 更新店铺信息
    async updateShopInfo(updateParams: UpdateShopParams) {
      this.loading = true
      this.error = null
      
      try {
        const response = await updateShopInfo(updateParams)
        if (response.code === 200) {
          // 更新本地店铺信息
          if (this.shopInfo) {
            this.setShopInfo({
              ...this.shopInfo,
              ...updateParams
            })
          }
          return response.data
        } else {
          this.error = response.msg || '更新店铺信息失败'
          throw new Error(this.error)
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : '更新店铺信息失败'
        console.error('更新店铺信息失败:', error)
        throw error
      } finally {
        this.loading = false
      }
    },
    
    // 上传店铺Logo
    async uploadShopLogo(file: File) {
      this.loading = true
      this.error = null
      
      try {
        const formData = new FormData()
        formData.append('logo', file)  // 修复：字段名改为 'logo'
        
        const response = await uploadShopLogo(formData)
        if (response.code === 200) {
          // 更新店铺信息中的Logo路径
          if (this.shopInfo) {
            this.setShopInfo({
              ...this.shopInfo,
              shopLogo: response.data
            })
          }
          return response.data
        } else {
          this.error = response.msg || '上传Logo失败'
          throw new Error(this.error)
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : '上传Logo失败'
        console.error('上传Logo失败:', error)
        throw error
      } finally {
        this.loading = false
      }
    },
    
    // 清除店铺信息（退出登录时使用）
    clearShopInfo() {
      this.shopInfo = null
      this.shopStatistics = null
      this.error = null
      localStorage.removeItem('shopInfo')
    },
    
    // 重置错误信息
    clearError() {
      this.error = null
    }
  }
})