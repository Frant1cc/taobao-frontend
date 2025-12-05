<template>
  <div class="address-editor">
    <!-- 标题 -->
    <div class="editor-header">
      <h2>{{ title }}</h2>
      <button class="close-btn" @click="handleClose">×</button>
    </div>

    <!-- 表单 -->
    <form @submit.prevent="handleSubmit" class="address-form">
      <!-- 收货人姓名 -->
      <div class="form-group">
        <label for="recipientName" class="form-label">收货人</label>
        <input
          id="recipientName"
          v-model="formData.recipientName"
          type="text"
          placeholder="请输入收货人姓名"
          class="form-input"
          required
        />
      </div>

      <!-- 手机号码 -->
      <div class="form-group">
        <label for="phone" class="form-label">手机号码</label>
        <input
          id="phone"
          v-model="formData.phone"
          type="tel"
          placeholder="请输入手机号码"
          class="form-input"
          pattern="[0-9]{11}"
          required
        />
      </div>

      <!-- 完整地址 -->
      <div class="form-group">
        <label for="fullAddress" class="form-label">完整地址</label>
        <textarea
          id="fullAddress"
          v-model="formData.fullAddress"
          placeholder="请输入完整的收货地址，包括省市区和详细地址"
          class="form-textarea"
          rows="3"
          required
        ></textarea>
      </div>

      <!-- 设为默认地址 -->
      <div class="form-group checkbox-group">
        <label class="checkbox-label">
          <input
            type="checkbox"
            v-model="formData.isDefault"
            class="checkbox-input"
          />
          <span class="checkbox-custom"></span>
          <span class="checkbox-text">设为默认地址</span>
        </label>
      </div>

      <!-- 按钮组 -->
      <div class="form-actions">
        <button type="button" class="btn-cancel" @click="handleClose">
          取消
        </button>
        <button type="submit" class="btn-submit">
          {{ submitText }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

// 导入地址类型
import type { Address } from '@/types/address'

// 地址表单数据类型定义
export interface AddressFormData {
  fullAddress: string
  recipientName: string
  phone: string
  isDefault: boolean
}

interface Props {
  address?: Address
  visible: boolean
}

interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'submit', data: AddressFormData): void
  (e: 'cancel'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 表单数据
const formData = ref<AddressFormData>({
  recipientName: '',
  phone: '',
  fullAddress: '',
  isDefault: false
})

// 计算属性
const title = computed(() => props.address ? '修改地址' : '添加新地址')
const submitText = computed(() => props.address ? '保存修改' : '添加地址')

// 监听地址变化，填充表单数据
watch(() => props.address, (newAddress) => {
  if (newAddress) {
    formData.value = {
      recipientName: newAddress.recipientName,
      phone: newAddress.phone,
      fullAddress: newAddress.fullAddress,
      isDefault: newAddress.isDefault
    }
  } else {
    // 重置表单
    formData.value = {
      recipientName: '',
      phone: '',
      fullAddress: '',
      isDefault: false
    }
  }
}, { immediate: true })

// 关闭弹窗
const handleClose = () => {
  emit('update:visible', false)
  emit('cancel')
}

// 提交表单
const handleSubmit = () => {
  // 表单验证
  if (!formData.value.recipientName.trim()) {
    alert('请输入收货人姓名')
    return
  }
  
  if (!formData.value.phone.trim() || !/^1[3-9]\d{9}$/.test(formData.value.phone)) {
    alert('请输入正确的手机号码')
    return
  }
  
  if (!formData.value.fullAddress.trim()) {
    alert('请输入完整地址')
    return
  }
  
  // 提交数据
  emit('submit', formData.value)
  emit('update:visible', false)
}
</script>

<style scoped lang="scss">
.address-editor {
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  max-width: 500px;
  height: calc(100% - 60px);
  background: white;
  z-index: 1000;
  overflow-y: auto;
  margin-top: 60px;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e0e0e0;
  
  h2 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #333333;
  }
  
  .close-btn {
    background: none;
    border: none;
    font-size: 24px;
    color: #666666;
    cursor: pointer;
    padding: 0;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    
    &:hover {
      background: #f5f5f5;
      color: #333333;
    }
  }
}

.address-form {
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
  
  &.checkbox-group {
    margin-bottom: 30px;
  }
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333333;
  font-size: 14px;
}

.form-input,
.form-textarea {
  width: 100%;
  box-sizing: border-box;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.2s;
  
  &:focus {
    outline: none;
    border-color: #ff5021;
    box-shadow: 0 0 0 2px rgba(255, 80, 33, 0.1);
  }
  
  &::placeholder {
    color: #999999;
  }
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
  max-height: 120px;
  overflow-y: auto;
}

.region-selector {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 8px;
}

.region-select {
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 14px;
  background: white;
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    border-color: #ff5021;
  }
}

.tag-selector {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.tag-option {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.tag-radio {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.tag-label {
  padding: 6px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 12px;
  color: #666666;
  transition: all 0.2s;
  
  .tag-radio:checked + & {
    border-color: #ff5021;
    background: rgba(255, 80, 33, 0.1);
    color: #ff5021;
  }
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  color: #666666;
}

.checkbox-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.checkbox-custom {
  width: 16px;
  height: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 2px;
  margin-right: 8px;
  position: relative;
  
  .checkbox-input:checked + & {
    background: #ff5021;
    border-color: #ff5021;
    
    &::after {
      content: '✓';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: white;
      font-size: 12px;
    }
  }
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding-top: 20px;
  border-top: 1px solid #e0e0e0;
}

.btn-cancel,
.btn-submit {
  padding: 10px 24px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel {
  background: #f5f5f5;
  color: #666666;
  
  &:hover {
    background: #e8e8e8;
  }
}

.btn-submit {
  background: #ff5021;
  color: white;
  
  &:hover {
    background: #e6450d;
  }
  
  &:disabled {
    background: #f5f5f5;
    color: #999999;
    cursor: not-allowed;
  }
}
</style>