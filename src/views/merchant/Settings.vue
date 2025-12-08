<template>
  <div class="merchant-settings">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2>店铺设置</h2>
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
            <span>基本信息</span>
          </el-menu-item>
          <el-menu-item index="logo">
            <el-icon><Picture /></el-icon>
            <span>店铺Logo</span>
          </el-menu-item>
          <el-menu-item index="contact">
            <el-icon><Phone /></el-icon>
            <span>联系方式</span>
          </el-menu-item>
          <el-menu-item index="shipping">
            <el-icon><Van /></el-icon>
            <span>运费设置</span>
          </el-menu-item>
          <el-menu-item index="payment">
            <el-icon><Money /></el-icon>
            <span>支付设置</span>
          </el-menu-item>
          <el-menu-item index="notification">
            <el-icon><Bell /></el-icon>
            <span>消息通知</span>
          </el-menu-item>
          <el-menu-item index="security">
            <el-icon><Lock /></el-icon>
            <span>安全设置</span>
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
                  v-model="basicForm.description"
                  type="textarea"
                  :rows="4"
                  placeholder="请输入店铺简介"
                  maxlength="200"
                  show-word-limit
                />
              </el-form-item>
              <el-form-item label="主营类目">
                <el-select v-model="basicForm.category" placeholder="请选择主营类目">
                  <el-option label="服装鞋包" value="clothing" />
                  <el-option label="数码家电" value="electronics" />
                  <el-option label="美妆护肤" value="beauty" />
                  <el-option label="食品生鲜" value="food" />
                  <el-option label="家居百货" value="home" />
                </el-select>
              </el-form-item>
              <el-form-item label="营业时间">
                <el-time-picker
                  v-model="basicForm.businessHours"
                  is-range
                  range-separator="至"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  placeholder="选择营业时间"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="saveBasicInfo">保存</el-button>
                <el-button>重置</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </div>

        <!-- 店铺Logo -->
        <div v-if="activeTab === 'logo'" class="tab-content">
          <el-card class="setting-card">
            <template #header>
              <h3>店铺Logo</h3>
            </template>
            <div class="logo-upload">
              <div class="logo-preview">
                <el-image
                  :src="logoForm.logoUrl"
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
                    <el-button type="primary">更换Logo</el-button>
                  </el-upload>
                  <el-button @click="removeLogo">删除Logo</el-button>
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

        <!-- 联系方式 -->
        <div v-if="activeTab === 'contact'" class="tab-content">
          <el-card class="setting-card">
            <template #header>
              <h3>联系方式</h3>
            </template>
            <el-form :model="contactForm" label-width="120px">
              <el-form-item label="客服电话">
                <el-input v-model="contactForm.phone" placeholder="请输入客服电话" />
              </el-form-item>
              <el-form-item label="客服邮箱">
                <el-input v-model="contactForm.email" placeholder="请输入客服邮箱" />
              </el-form-item>
              <el-form-item label="联系地址">
                <el-input
                  v-model="contactForm.address"
                  type="textarea"
                  :rows="3"
                  placeholder="请输入联系地址"
                />
              </el-form-item>
              <el-form-item label="在线客服">
                <el-switch v-model="contactForm.onlineService" />
                <span class="switch-label">{{ contactForm.onlineService ? '开启' : '关闭' }}在线客服</span>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="saveContactInfo">保存</el-button>
                <el-button>重置</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </div>

        <!-- 运费设置 -->
        <div v-if="activeTab === 'shipping'" class="tab-content">
          <el-card class="setting-card">
            <template #header>
              <h3>运费设置</h3>
            </template>
            <el-form :model="shippingForm" label-width="120px">
              <el-form-item label="运费模板">
                <el-select v-model="shippingForm.template" placeholder="请选择运费模板">
                  <el-option label="包邮" value="free" />
                  <el-option label="按重量计费" value="weight" />
                  <el-option label="按件数计费" value="count" />
                  <el-option label="固定运费" value="fixed" />
                </el-select>
              </el-form-item>
              <el-form-item v-if="shippingForm.template === 'fixed'" label="固定运费">
                <el-input-number
                  v-model="shippingForm.fixedFee"
                  :min="0"
                  :max="100"
                  controls-position="right"
                />
                <span class="unit">元</span>
              </el-form-item>
              <el-form-item label="发货地址">
                <el-cascader
                  v-model="shippingForm.shippingAddress"
                  :options="addressOptions"
                  placeholder="请选择发货地址"
                />
              </el-form-item>
              <el-form-item label="发货时间">
                <el-select v-model="shippingForm.shippingTime" placeholder="请选择发货时间">
                  <el-option label="24小时内" value="24h" />
                  <el-option label="48小时内" value="48h" />
                  <el-option label="3天内" value="3d" />
                  <el-option label="5天内" value="5d" />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="saveShippingSettings">保存</el-button>
                <el-button>重置</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </div>

        <!-- 支付设置 -->
        <div v-if="activeTab === 'payment'" class="tab-content">
          <el-card class="setting-card">
            <template #header>
              <h3>支付设置</h3>
            </template>
            <div class="payment-methods">
              <div class="payment-item">
                <div class="payment-info">
                  <el-icon class="payment-icon"><CreditCard /></el-icon>
                  <div class="payment-details">
                    <h4>支付宝</h4>
                    <p>支持支付宝支付</p>
                  </div>
                </div>
                <el-switch v-model="paymentForm.alipay" />
              </div>
              
              <div class="payment-item">
                <div class="payment-info">
                  <el-icon class="payment-icon"><CreditCard /></el-icon>
                  <div class="payment-details">
                    <h4>微信支付</h4>
                    <p>支持微信支付</p>
                  </div>
                </div>
                <el-switch v-model="paymentForm.wechat" />
              </div>
              
              <div class="payment-item">
                <div class="payment-info">
                  <el-icon class="payment-icon"><CreditCard /></el-icon>
                  <div class="payment-details">
                    <h4>银行卡</h4>
                    <p>支持银行卡支付</p>
                  </div>
                </div>
                <el-switch v-model="paymentForm.bank" />
              </div>
            </div>
            <div class="payment-actions">
              <el-button type="primary" @click="savePaymentSettings">保存设置</el-button>
            </div>
          </el-card>
        </div>

        <!-- 消息通知 -->
        <div v-if="activeTab === 'notification'" class="tab-content">
          <el-card class="setting-card">
            <template #header>
              <h3>消息通知</h3>
            </template>
            <div class="notification-settings">
              <div class="notification-item">
                <div class="notification-info">
                  <h4>新订单通知</h4>
                  <p>当有新订单时发送通知</p>
                </div>
                <el-switch v-model="notificationForm.newOrder" />
              </div>
              
              <div class="notification-item">
                <div class="notification-info">
                  <h4>库存预警</h4>
                  <p>商品库存低于阈值时发送通知</p>
                </div>
                <el-switch v-model="notificationForm.stockAlert" />
              </div>
              
              <div class="notification-item">
                <div class="notification-info">
                  <h4>退款申请</h4>
                  <p>有用户申请退款时发送通知</p>
                </div>
                <el-switch v-model="notificationForm.refundRequest" />
              </div>
              
              <div class="notification-item">
                <div class="notification-info">
                  <h4>系统消息</h4>
                  <p>接收平台系统消息</p>
                </div>
                <el-switch v-model="notificationForm.systemMessage" />
              </div>
            </div>
            <div class="notification-actions">
              <el-button type="primary" @click="saveNotificationSettings">保存设置</el-button>
            </div>
          </el-card>
        </div>

        <!-- 安全设置 -->
        <div v-if="activeTab === 'security'" class="tab-content">
          <el-card class="setting-card">
            <template #header>
              <h3>安全设置</h3>
            </template>
            <div class="security-settings">
              <div class="security-item">
                <div class="security-info">
                  <h4>修改密码</h4>
                  <p>定期修改密码保障账户安全</p>
                </div>
                <el-button type="primary" @click="showChangePassword">修改密码</el-button>
              </div>
              
              <div class="security-item">
                <div class="security-info">
                  <h4>登录保护</h4>
                  <p>开启后需要验证码登录</p>
                </div>
                <el-switch v-model="securityForm.loginProtection" />
              </div>
              
              <div class="security-item">
                <div class="security-info">
                  <h4>操作日志</h4>
                  <p>记录账户重要操作</p>
                </div>
                <el-button @click="viewOperationLogs">查看日志</el-button>
              </div>
            </div>
          </el-card>
        </div>
      </div>
    </div>

    <!-- 修改密码对话框 -->
    <el-dialog v-model="passwordDialogVisible" title="修改密码" width="400px">
      <el-form :model="passwordForm" label-width="80px">
        <el-form-item label="原密码">
          <el-input v-model="passwordForm.oldPassword" type="password" />
        </el-form-item>
        <el-form-item label="新密码">
          <el-input v-model="passwordForm.newPassword" type="password" />
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input v-model="passwordForm.confirmPassword" type="password" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="passwordDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="changePassword">确认修改</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  User,
  Picture,
  Phone,
  Van,
  Money,
  Bell,
  Lock,
  CreditCard
} from '@element-plus/icons-vue'
import { getShopInfo, updateShopInfo, getShopStatistics } from '@/api/modules/shop'
import type { ShopInfo, UpdateShopParams, ShopStatistics } from '@/types/shop'

// 当前激活的标签页
const activeTab = ref('basic')

// 店铺信息
const shopInfo = ref<ShopInfo | null>(null)
const shopStatistics = ref<ShopStatistics | null>(null)

// 表单数据
const basicForm = reactive({
  shopName: '',
  description: '',
  category: 'clothing',
  businessHours: [new Date(2023, 0, 1, 9, 0), new Date(2023, 0, 1, 18, 0)]
})

const logoForm = reactive({
  logoUrl: 'https://via.placeholder.com/200x200'
})

const contactForm = reactive({
  phone: '400-123-4567',
  email: 'service@myshop.com',
  address: '北京市朝阳区某某街道123号',
  onlineService: true
})

const shippingForm = reactive({
  template: 'free',
  fixedFee: 8,
  shippingAddress: [],
  shippingTime: '24h'
})

const paymentForm = reactive({
  alipay: true,
  wechat: true,
  bank: false
})

const notificationForm = reactive({
  newOrder: true,
  stockAlert: true,
  refundRequest: true,
  systemMessage: true
})

const securityForm = reactive({
  loginProtection: true
})

const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 对话框状态
const passwordDialogVisible = ref(false)

// 地址选项（简化版）
const addressOptions = [
  {
    value: 'beijing',
    label: '北京市',
    children: [
      {
        value: 'chaoyang',
        label: '朝阳区'
      }
    ]
  }
]

// 方法
const handleMenuSelect = (index: string) => {
  activeTab.value = index
}

// 加载店铺信息
const loadShopInfo = async () => {
  try {
    const response = await getShopInfo()
    if (response.code === 200) {
      shopInfo.value = response.data
      // 填充表单数据
      basicForm.shopName = response.data.shopName || ''
      basicForm.description = response.data.shopDescription || ''
      logoForm.logoUrl = response.data.shopLogo || 'https://via.placeholder.com/200x200'
    }
  } catch (error) {
    ElMessage.error('获取店铺信息失败')
    console.error('获取店铺信息失败:', error)
  }
}

// 加载店铺统计信息
const loadShopStatistics = async () => {
  try {
    const response = await getShopStatistics()
    if (response.code === 200) {
      shopStatistics.value = response.data
    }
  } catch (error) {
    console.error('获取店铺统计信息失败:', error)
  }
}

const saveBasicInfo = async () => {
  try {
    const updateParams: UpdateShopParams = {
      shopName: basicForm.shopName,
      shopDescription: basicForm.description,
      shopLogo: logoForm.logoUrl,
      shopBanner: shopInfo.value?.shopBanner || ''
    }
    
    const response = await updateShopInfo(updateParams)
    if (response.code === 200) {
      ElMessage.success('店铺信息更新成功')
      // 重新加载店铺信息
      await loadShopInfo()
    } else {
      ElMessage.error(response.msg || '更新失败')
    }
  } catch (error) {
    ElMessage.error('更新店铺信息失败')
    console.error('更新店铺信息失败:', error)
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

const handleLogoUpload = (options: any) => {
  // 模拟上传过程
  const file = options.file
  const reader = new FileReader()
  reader.onload = (e) => {
    logoForm.logoUrl = e.target?.result as string
    ElMessage.success('Logo上传成功')
  }
  reader.readAsDataURL(file)
}

const removeLogo = () => {
  ElMessageBox.confirm('确定要删除Logo吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    logoForm.logoUrl = 'https://via.placeholder.com/200x200'
    ElMessage.success('Logo已删除')
  })
}

const saveContactInfo = () => {
  ElMessage.success('联系方式保存成功')
}

const saveShippingSettings = () => {
  ElMessage.success('运费设置保存成功')
}

const savePaymentSettings = () => {
  ElMessage.success('支付设置保存成功')
}

const saveNotificationSettings = () => {
  ElMessage.success('消息通知设置保存成功')
}

const showChangePassword = () => {
  passwordDialogVisible.value = true
}

const changePassword = () => {
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    ElMessage.error('两次输入的密码不一致')
    return
  }
  ElMessage.success('密码修改成功')
  passwordDialogVisible.value = false
}

const viewOperationLogs = () => {
  ElMessage.info('查看操作日志功能开发中...')
}

// 页面加载时获取店铺信息
onMounted(() => {
  loadShopInfo()
  loadShopStatistics()
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