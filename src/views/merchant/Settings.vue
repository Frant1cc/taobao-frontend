<template>
  <div class="merchant-settings">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2>商家设置</h2>
      <p class="page-description">管理您的店铺信息和基本设置</p>
    </div>

    <!-- 设置内容 -->
    <div class="settings-content">
      <!-- 左侧导航菜单 -->
      <div class="settings-nav">
        <el-menu
          :default-active="activeTab"
          class="settings-menu"
          @select="handleMenuSelect"
        >
          <el-menu-item index="basic">
            <el-icon><User /></el-icon>
            <span>店铺信息</span>
          </el-menu-item>
          <el-menu-item index="logo">
            <el-icon><Picture /></el-icon>
            <span>店铺Logo</span>
          </el-menu-item>
        </el-menu>
      </div>

      <!-- 右侧设置面板 -->
      <div class="settings-panel">
        <!-- 基本信息 -->
        <div v-if="activeTab === 'basic'" class="tab-content">
          <el-card class="setting-card">
            <template #header>
              <h3>基本信息</h3>
            </template>
            <el-form :model="basicForm" label-width="120px">
              <el-form-item label="店铺名称">
                <el-input v-model="basicForm.shopName" placeholder="请输入店铺名称" />
              </el-form-item>
              <el-form-item label="店铺简介">
                <el-input
                  v-model="basicForm.shopDescription"
                  type="textarea"
                  :rows="4"
                  placeholder="请输入店铺简介"
                  maxlength="200"
                  show-word-limit
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="saveBasicInfo">保存</el-button>
                <el-button @click="resetBasicForm">重置</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </div>

        <!-- 个人头像 -->
        <div v-if="activeTab === 'logo'" class="tab-content">
          <el-card class="setting-card">
            <template #header>
              <h3>个人头像</h3>
            </template>
            <div class="logo-upload">
              <div class="logo-preview">
                <el-image
                  :src="logoForm.shopLogo"
                  fit="cover"
                  class="current-logo"
                />
                <div class="logo-actions">
                  <el-upload
                    action="#"
                    :show-file-list="false"
                    :before-upload="beforeLogoUpload"
                    :http-request="handleLogoUpload"
                  >
                    <el-button type="primary">更换头像</el-button>
                  </el-upload>
                  <el-button @click="removeLogo">删除头像</el-button>
                </div>
              </div>
              <div class="logo-tips">
                <p>建议尺寸：200x200像素</p>
                <p>支持格式：JPG、PNG、GIF</p>
                <p>文件大小：不超过2MB</p>
              </div>
            </div>
          </el-card>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  User,
  Picture
} from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import { getShopInfo, updateShopInfo,uploadShopLogo } from '@/api/modules/shop'
import type { ShopInfo, UpdateShopParams } from '@/types/shop'

// 当前激活的标签页
const activeTab = ref('basic')
const router = useRouter()
const userStore = useUserStore()

// 用户信息
const userInfo = computed(() => userStore.userInfo)

// 表单数据
const basicForm = reactive({
  shopName: '',
  shopDescription: ''
})

const logoForm = reactive({
  shopLogo: 'https://via.placeholder.com/200x200'
})

// 当前店铺状态
const currentShopStatus = ref<'normal' | 'closed' | 'auditing'>('normal')

// 方法
const handleMenuSelect = (index: string) => {
  activeTab.value = index
}

// 加载商家信息
const loadShopInfo = async () => {
  try {
    const response = await getShopInfo()
    if (response.code === 200 && response.data) {
      const shopInfo = response.data
      // 填充表单数据
      basicForm.shopName = shopInfo.shopName || ''
      basicForm.shopDescription = shopInfo.shopDescription || ''
      logoForm.shopLogo = shopInfo.shopLogo || 'https://via.placeholder.com/200x200'
      // 保存店铺状态
      currentShopStatus.value = shopInfo.status || 'normal'
    } else {
      ElMessage.error('获取商家信息失败')
    }
  } catch (error) {
    ElMessage.error('获取商家信息失败')
    console.error('获取商家信息失败:', error)
  }
}

const saveBasicInfo = async () => {
  try {
    // 更新商家信息
    const updateParams: UpdateShopParams = {
      shopName: basicForm.shopName,
      shopDescription: basicForm.shopDescription,
      shopLogo: logoForm.shopLogo,
      shopBanner: '', // 暂时留空，后续可以添加店铺横幅功能
      status: currentShopStatus.value
    }
    
    const response = await updateShopInfo(updateParams)
    if (response.code === 200) {
      ElMessage.success('商家信息更新成功')
      // 重新加载商家信息
      await loadShopInfo()
    } else {
      ElMessage.error('更新商家信息失败')
    }
  } catch (error) {
    ElMessage.error('更新商家信息失败')
    console.error('更新商家信息失败:', error)
  }
}

const beforeLogoUpload = (file: File) => {
  const isJPG = file.type === 'image/jpeg'
  const isPNG = file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJPG && !isPNG) {
    ElMessage.error('Logo只能是 JPG 或 PNG 格式!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('Logo大小不能超过 2MB!')
    return false
  }
  return true
}

const handleLogoUpload = async (options: any) => {
  const file = options.file
  try {
    // 创建FormData对象
    const formData = new FormData()
    formData.append('logo', file)
    
    // 使用专门的上传Logo接口
    const response = await uploadShopLogo(formData)
    if (response.code === 200) {
      // 上传成功后，获取返回的文件路径
      const logoPath = response.data
      
      // 更新店铺信息，使用返回的Logo路径
      const updateParams: UpdateShopParams = {
        shopName: basicForm.shopName,
        shopDescription: basicForm.shopDescription,
        shopLogo: logoPath,
        shopBanner: '', // 暂时留空，后续可以添加店铺横幅功能
        status: currentShopStatus.value
      }
      
      const updateResponse = await updateShopInfo(updateParams)
      if (updateResponse.code === 200) {
        // 更新前端显示的Logo（这里需要根据实际返回的路径格式调整）
        // 假设返回的是相对路径，需要拼接完整的URL
        logoForm.shopLogo = logoPath.startsWith('http') ? logoPath : `/api/${logoPath}`
        ElMessage.success('店铺Logo上传成功')
      } else {
        ElMessage.error(updateResponse.msg || '更新店铺信息失败')
      }
    } else {
      ElMessage.error(response.msg || '上传失败')
    }
  } catch (error) {
    ElMessage.error('上传失败，请重试')
    console.error('上传失败:', error)
  }
}

const removeLogo = () => {
  ElMessageBox.confirm('确定要删除店铺Logo吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    logoForm.shopLogo = 'https://via.placeholder.com/200x200'
    ElMessage.success('店铺Logo已删除')
  })
}

// 重置基本信息表单
const resetBasicForm = async () => {
  try {
    await loadShopInfo()
    ElMessage.success('表单已重置')
  } catch (error) {
    ElMessage.error('重置表单失败')
  }
}

// 页面加载时获取商家信息
onMounted(() => {
  loadShopInfo()
})
</script>

<style scoped lang="scss">
@use "sass:color";

// 使用客户端相同的颜色主题
$primary-color: #ff5000;
$text-primary: #333;
$text-secondary: #666;
$border-color: #ddd;
$gray-light: #f5f5f5;
$white: #fff;

.merchant-settings {
  .page-header {
    margin-bottom: 24px;

    h2 {
      margin: 0 0 8px 0;
      color: $text-primary;
    }

    .page-description {
      margin: 0;
      color: $text-secondary;
      font-size: 14px;
    }
  }

  .settings-content {
    display: flex;
    gap: 24px;

    .settings-nav {
      width: 200px;
      flex-shrink: 0;

      .settings-menu {
        border-right: none;

        .el-menu-item {
          height: 48px;
          line-height: 48px;

          &.is-active {
            background-color: color.adjust($primary-color, $lightness: 45%);
            color: $primary-color;
          }
        }
      }
    }

    .settings-panel {
      flex: 1;

      .setting-card {
        margin-bottom: 24px;

        .el-card__header {
          border-bottom: 1px solid $border-color;
          padding: 16px 20px;

          h3 {
            margin: 0;
            color: $text-primary;
          }
        }

        .el-form-item {
          margin-bottom: 20px;
        }

        .unit {
          margin-left: 8px;
          color: $text-secondary;
        }

        .switch-label {
          margin-left: 8px;
          color: $text-secondary;
        }
      }

      .logo-upload {
        .logo-preview {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 20px;

          .current-logo {
            width: 100px;
            height: 100px;
            border-radius: 8px;
            border: 1px solid $border-color;
          }

          .logo-actions {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }
        }

        .logo-tips {
          p {
            margin: 4px 0;
            color: $text-secondary;
            font-size: 12px;
          }
        }
      }

      .payment-methods,
      .notification-settings,
      .security-settings {
        .payment-item,
        .notification-item,
        .security-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 0;
          border-bottom: 1px solid $border-color;

          &:last-child {
            border-bottom: none;
          }

          .payment-info,
          .notification-info,
          .security-info {
            display: flex;
            align-items: center;
            gap: 12px;

            .payment-icon {
              font-size: 24px;
              color: $primary-color;
            }

            h4 {
              margin: 0 0 4px 0;
              color: $text-primary;
            }

            p {
              margin: 0;
              color: $text-secondary;
              font-size: 12px;
            }
          }
        }
      }

      .payment-actions,
      .notification-actions {
        margin-top: 20px;
        text-align: right;
      }
    }
  }
}

@media (max-width: 768px) {
  .merchant-settings {
    .settings-content {
      flex-direction: column;

      .settings-nav {
        width: 100%;
      }
    }
  }
}
</style>