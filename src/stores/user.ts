import { defineStore } from 'pinia'
import { getUserInfo, updateUserInfo as updateUserInfoApi } from '@/api/modules/user'
import type { LoginResponse } from '@/types/user'

// 用户信息类型定义
interface UserInfo {
  userId?: number
  account: string
  username: string
  email?: string
  phone?: string
  avatarUrl?: string
  description?: string
  create_time?: string
  update_time?: string
}

// 完整的用户信息类型定义
interface FullUserInfo {
  userId: number
  account: string
  password: string
  userType: string
  status?: string
  username: string | null
  gender?: string | null
  birthday?: string | null
  phone?: string | null
  email?: string | null
  avatarUrl?: string | null
  createTime?: string
  updateTime?: string
}

interface UserState {
  userInfo: UserInfo | FullUserInfo | null
  token: string | null
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    userInfo: null,
    token: localStorage.getItem('authToken') || null
  }),
  
  getters: {
    isLoggedIn: (state) => !!state.token,
    username: (state) => state.userInfo?.username || ''
  },
  
  actions: {
    setToken(token: string) {
      this.token = token
      localStorage.setItem('authToken', token)
    },
    
    setUserInfo(userInfo: LoginResponse ) {
      // 保存必要的用户信息到store
      this.userInfo = {
        account: userInfo.account,
        username: userInfo.username || userInfo.account || '',
        userType: userInfo.userType
      }
      
      // 保存完整信息到本地存储
      localStorage.setItem('userInfo', JSON.stringify(userInfo))
    },
    
    clearToken() {
      this.token = null
      this.userInfo = null
      localStorage.removeItem('authToken')
      localStorage.removeItem('userInfo')
    },
    
    loadFromLocalStorage() {
      const token = localStorage.getItem('authToken')
      const userInfoStr = localStorage.getItem('userInfo')
      
      if (token) {
        this.token = token
      }
      
      if (userInfoStr) {
        try {
          const userInfo = JSON.parse(userInfoStr)
          this.userInfo = userInfo
        } catch (e) {
          console.error('解析用户信息失败:', e)
        }
      }
    },
    
    async fetchUserInfo() {
      try {
        const response = await getUserInfo()
        this.userInfo = response.data
        return response.data
      } catch (error) {
        console.error('获取用户信息失败:', error)
        // 如果是未授权错误，清除认证信息
        if ((error as any).response?.status === 401) {
          this.clearToken()
        }
        throw error
      }
    },
    
    async updateUserInfo(userData: Partial<UserInfo>) {
      try {
        const response = await updateUserInfoApi(userData)
        if (response.code === 200) {
          // 更新本地存储的用户信息
          if (this.userInfo) {
            this.userInfo = { ...this.userInfo, ...userData }
          }
          
          // 更新本地存储
          const storedUserInfo = localStorage.getItem('userInfo')
          if (storedUserInfo) {
            const userInfo = JSON.parse(storedUserInfo)
            localStorage.setItem('userInfo', JSON.stringify({ ...userInfo, ...userData }))
          }
          
          return response.data
        } else {
          throw new Error(response.msg || '更新用户信息失败')
        }
      } catch (error) {
        console.error('更新用户信息失败:', error)
        throw error
      }
    }
  }
})