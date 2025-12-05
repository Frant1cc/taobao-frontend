<template>
  <div class="address-management-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="back-btn" @click="goBack">
          <span class="back-icon">←</span>
          <span class="back-text">返回</span>
        </div>
        <h1 class="page-title">收货地址管理</h1>
      </div>
    </div>

    <!-- 地址列表 -->
    <div class="address-list">
      <div 
        v-for="address in addressList" 
        :key="address.addressId"
        class="address-item"
        :class="{ 'default-address': address.isDefault }"
      >
        <div class="address-info">
          <div class="address-header">
            <span class="recipient-name">{{ address.recipientName }}</span>
            <span class="recipient-phone">{{ address.phone }}</span>
            <span v-if="address.isDefault" class="default-tag">默认</span>
          </div>
          <div class="address-detail">
            {{ address.fullAddress }}
          </div>
        </div>
        <div class="address-actions">
          <button 
            class="edit-btn" 
            @click="editAddress(address)"
          >
            编辑
          </button>
          <button 
            class="delete-btn" 
            @click="handleDeleteAddress(address.addressId)"
          >
            删除
          </button>
          <button 
            v-if="!address.isDefault"
            class="set-default-btn" 
            @click="handleSetDefaultAddress(address.addressId)"
          >
            设为默认
          </button>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="addressList.length === 0" class="empty-state">
        <div class="empty-icon">📍</div>
        <div class="empty-text">暂无收货地址</div>
        <div class="empty-desc">添加收货地址，购物更便捷</div>
      </div>
    </div>

    <!-- 添加地址按钮 -->
    <div class="add-address-section">
      <button class="add-address-btn" @click="handleAddAddress">
        <span class="add-icon">+</span>
        <span class="add-text">添加新地址</span>
      </button>
    </div>

    <!-- 淘宝风格地址编辑弹窗 -->
    <div class="address-editor-overlay" v-if="showEditor">
        <div class="editor-content">
          <AddressEditor
            :visible="showEditor"
            :address="editingAddress || undefined"
            @update:visible="showEditor = $event"
            @submit="handleAddressSubmit"
            @cancel="handleEditorCancel"
          />
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import AddressEditor from '@/components/AddressEditor.vue'
import { 
  getAddressList, 
  addAddress, 
  updateAddress, 
  deleteAddress, 
  setDefaultAddress 
} from '@/api/modules/address'
import type { Address, CreateAddressRequest, UpdateAddressRequest } from '@/types/address'

// 地址表单数据类型定义
interface AddressFormData {
  fullAddress: string
  recipientName: string
  phone: string
  isDefault: boolean
}

const router = useRouter()

// 地址列表
const addressList = ref<Address[]>([])

// 加载状态
const loading = ref(false)

// 编辑弹窗相关
const showEditor = ref(false)
const editingAddress = ref<Address | null>(null)

// 返回上一页
const goBack = () => {
  router.back()
}

// 添加地址
const handleAddAddress = () => {
  editingAddress.value = null
  showEditor.value = true
}

// 编辑地址
const editAddress = (address: Address) => {
  editingAddress.value = address
  showEditor.value = true
}

// 加载地址列表
const loadAddressList = async () => {
  try {
    loading.value = true
    const response = await getAddressList()
    if (response.code === 200) {
      addressList.value = response.data || []
    } else {
      ElMessage.error(response.msg || '获取地址列表失败')
    }
  } catch (error) {
    console.error('获取地址列表失败:', error)
    ElMessage.error('获取地址列表失败')
  } finally {
    loading.value = false
  }
}

// 删除地址
const handleDeleteAddress = async (addressId: number) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除这个收货地址吗？',
      '确认删除',
      {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    // 执行删除操作
    const response = await deleteAddress(addressId)
    if (response.code === 200) {
      ElMessage.success('地址删除成功')
      await loadAddressList() // 重新加载地址列表
    } else {
      ElMessage.error(response.msg || '地址删除失败')
    }
  } catch {
    // 用户取消删除
  }
}

// 设为默认地址
const handleSetDefaultAddress = async (addressId: number) => {
  try {
    const response = await setDefaultAddress(addressId)
    if (response.code === 200) {
      ElMessage.success('默认地址设置成功')
      await loadAddressList() // 重新加载地址列表
    } else {
      ElMessage.error(response.msg || '设置默认地址失败')
    }
  } catch (error) {
    console.error('设置默认地址失败:', error)
    ElMessage.error('设置默认地址失败')
  }
}

// 处理地址提交
const handleAddressSubmit = async (formData: AddressFormData) => {
  try {
    if (editingAddress.value) {
      // 编辑模式
      const updateData: UpdateAddressRequest = {
        addressId: editingAddress.value.addressId,
        fullAddress: formData.fullAddress,
        recipientName: formData.recipientName,
        phone: formData.phone,
        isDefault: formData.isDefault
      }
      
      const response = await updateAddress(updateData)
      if (response.code === 200) {
        ElMessage.success('地址修改成功')
        await loadAddressList() // 重新加载地址列表
      } else {
        ElMessage.error(response.msg || '地址修改失败')
      }
    } else {
      // 添加模式
      const createData: CreateAddressRequest = {
        fullAddress: formData.fullAddress,
        recipientName: formData.recipientName,
        phone: formData.phone,
        isDefault: formData.isDefault
      }
      
      const response = await addAddress(createData)
      if (response.code === 200) {
        ElMessage.success('地址添加成功')
        await loadAddressList() // 重新加载地址列表
      } else {
        ElMessage.error(response.msg || '地址添加失败')
      }
    }
    
    showEditor.value = false
    editingAddress.value = null
  } catch (error) {
    console.error('地址操作失败:', error)
    ElMessage.error('地址操作失败')
  }
}

// 处理编辑取消
const handleEditorCancel = () => {
  showEditor.value = false
  editingAddress.value = null
}

// 页面加载时获取地址列表
onMounted(() => {
  loadAddressList()
})
</script>

<style scoped>
.address-management-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 80px;
}

/* 页面头部样式 - 淘宝风格 */
.page-header {
  background: white;
  border-bottom: 1px solid #e8e8e8;
  padding: 15px 0;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
}

.back-btn {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #666;
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.3s;
  font-size: 14px;
}

.back-btn:hover {
  background: #f5f5f5;
  color: #ff5000;
}

.back-icon {
  font-size: 18px;
  margin-right: 5px;
  font-weight: bold;
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
  margin-left: 20px;
  flex: 1;
}

/* 地址列表样式 - 淘宝风格 */
.address-list {
  max-width: 1200px;
  margin: 0 auto;
  padding: 15px;
}

.address-item {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 12px;
  border: 1px solid #e8e8e8;
  transition: all 0.3s;
  position: relative;
}

.address-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border-color: #ff5000;
}

.address-item.default-address {
  border-color: #ff5000;
  background: rgba(255, 80, 0, 0.02);
}

.address-item.default-address::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: #ff5000;
  border-radius: 8px 0 0 8px;
}

.address-info {
  margin-bottom: 15px;
}

.address-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.recipient-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.recipient-phone {
  font-size: 14px;
  color: #666;
}

.default-tag {
  background: #ff5000;
  color: white;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: 500;
}

.address-detail {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  padding-left: 5px;
}

.address-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  border-top: 1px solid #f0f0f0;
  padding-top: 15px;
}

.edit-btn,
.delete-btn,
.set-default-btn {
  padding: 6px 16px;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s;
  background: white;
}

.edit-btn {
  color: #666;
}

.edit-btn:hover {
  background: #f8f8f8;
  border-color: #ccc;
  color: #333;
}

.delete-btn {
  color: #ff4d4f;
  border-color: #ff4d4f;
}

.delete-btn:hover {
  background: #ff4d4f;
  color: white;
}

.set-default-btn {
  color: #ff5000;
  border-color: #ff5000;
}

.set-default-btn:hover {
  background: #ff5000;
  color: white;
}

/* 空状态样式 */
.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: #999;
  background: white;
  border-radius: 8px;
  margin: 20px 0;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
  opacity: 0.6;
}

.empty-text {
  font-size: 16px;
  margin-bottom: 8px;
  color: #666;
}

.empty-desc {
  font-size: 14px;
  color: #999;
}

/* 添加地址按钮 - 淘宝风格 */
.add-address-section {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  padding: 15px 20px;
  border-top: 1px solid #e8e8e8;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
}

.add-address-btn {
  width: 100%;
  background: linear-gradient(135deg, #ff5000 0%, #ff7a33 100%);
  color: white;
  border: none;
  padding: 14px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(255, 80, 0, 0.3);
}

.add-address-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 80, 0, 0.4);
}

.add-address-btn:active {
  transform: translateY(0);
}

.add-icon {
  font-size: 20px;
  font-weight: 600;
}

.add-text {
  font-size: 16px;
}

/* 淘宝风格地址编辑弹窗 */
.address-editor-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;
}

.address-editor-container {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow: hidden;
  animation: slideUp 0.3s ease-out;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e8e8e8;
  background: linear-gradient(135deg, #ff5000 0%, #ff7a33 100%);
  color: white;
}

.editor-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 20px;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.close-icon {
  line-height: 1;
}

.editor-content {
  padding: 0;
  max-height: calc(80vh - 80px);
  overflow-y: auto;
}

/* 自定义动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .address-editor-container {
    width: 95%;
    max-width: none;
    margin: 0 10px;
  }
  
  .editor-header {
    padding: 15px;
  }
  
  .editor-title {
    font-size: 16px;
  }
  
  .address-list {
    padding: 10px;
  }
  
  .address-item {
    padding: 15px;
  }
  
  .address-actions {
    flex-direction: column;
    gap: 8px;
  }
  
  .edit-btn,
  .delete-btn,
  .set-default-btn {
    width: 100%;
    padding: 10px;
  }
}
</style>