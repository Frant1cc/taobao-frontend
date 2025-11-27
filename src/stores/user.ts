import { defineStore } from 'pinia'
import { getUserInfo } from '@/api/modules/user'
import type { UserInfo } from '@/types/user'

interface UserState {
  userInfo: UserInfo | null
  token: string | null
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    userInfo: null,
    token: localStorage.getItem('token') || null
  }),
  
  getters: {
    isLoggedIn: (state) => !!state.token,
    username: (state) => state.userInfo?.username || ''
  },
  
  actions: {
    setToken(token: string) {
      this.token = token
      localStorage.setItem('token', token)
    },
    
    clearToken() {
      this.token = null
      localStorage.removeItem('token')
    },
    
    async fetchUserInfo() {
      try {
        const response = await getUserInfo()
        this.userInfo = response.data.data
        return response.data
      } catch (error) {
        console.error('获取用户信息失败:', error)
        throw error
      }
    }
  }
})