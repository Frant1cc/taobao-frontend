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
        <label for="name" class="form-label">收货人</label>
        <input
          id="name"
          v-model="formData.name"
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

      <!-- 省市区选择 -->
      <div class="form-group">
        <label class="form-label">所在地区</label>
        <div class="region-selector">
          <select v-model="formData.province" class="region-select" required>
            <option value="">请选择省份</option>
            <option value="北京市">北京市</option>
            <option value="上海市">上海市</option>
            <option value="广东省">广东省</option>
            <option value="浙江省">浙江省</option>
            <option value="江苏省">江苏省</option>
          </select>
          <select v-model="formData.city" class="region-select" required>
            <option value="">请选择城市</option>
            <option v-if="formData.province === '北京市'" value="北京市">北京市</option>
            <option v-if="formData.province === '上海市'" value="上海市">上海市</option>
            <option v-if="formData.province === '广东省'" value="广州市">广州市</option>
            <option v-if="formData.province === '广东省'" value="深圳市">深圳市</option>
            <option v-if="formData.province === '浙江省'" value="杭州市">杭州市</option>
            <option v-if="formData.province === '浙江省'" value="宁波市">宁波市</option>
            <option v-if="formData.province === '江苏省'" value="南京市">南京市</option>
            <option v-if="formData.province === '江苏省'" value="苏州市">苏州市</option>
          </select>
          <select v-model="formData.district" class="region-select" required>
            <option value="">请选择区县</option>
            <option v-if="formData.city === '北京市'" value="朝阳区">朝阳区</option>
            <option v-if="formData.city === '北京市'" value="海淀区">海淀区</option>
            <option v-if="formData.city === '上海市'" value="浦东新区">浦东新区</option>
            <option v-if="formData.city === '上海市'" value="徐汇区">徐汇区</option>
            <option v-if="formData.city === '广州市'" value="天河区">天河区</option>
            <option v-if="formData.city === '广州市'" value="越秀区">越秀区</option>
            <option v-if="formData.city === '深圳市'" value="南山区">南山区</option>
            <option v-if="formData.city === '深圳市'" value="福田区">福田区</option>
            <option v-if="formData.city === '杭州市'" value="西湖区">西湖区</option>
            <option v-if="formData.city === '杭州市'" value="上城区">上城区</option>
            <option v-if="formData.city === '南京市'" value="玄武区">玄武区</option>
            <option v-if="formData.city === '南京市'" value="鼓楼区">鼓楼区</option>
          </select>
        </div>
      </div>

      <!-- 详细地址 -->
      <div class="form-group">
        <label for="detail" class="form-label">详细地址</label>
        <textarea
          id="detail"
          v-model="formData.detail"
          placeholder="请输入详细地址"
          class="form-textarea"
          rows="3"
          required
        ></textarea>
      </div>

      <!-- 地址标签 -->
      <div class="form-group">
        <label class="form-label">地址标签</label>
        <div class="tag-selector">
          <label class="tag-option">
            <input
              type="radio"
              v-model="formData.tag"
              value="家"
              class="tag-radio"
            />
            <span class="tag-label">家</span>
          </label>
          <label class="tag-option">
            <input
              type="radio"
              v-model="formData.tag"
              value="公司"
              class="tag-radio"
            />
            <span class="tag-label">公司</span>
          </label>
          <label class="tag-option">
            <input
              type="radio"
              v-model="formData.tag"
              value="学校"
              class="tag-radio"
            />
            <span class="tag-label">学校</span>
          </label>
          <label class="tag-option">
            <input
              type="radio"
              v-model="formData.tag"
              value="其他"
              class="tag-radio"
            />
            <span class="tag-label">其他</span>
          </label>
        </div>
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
import type { Address, AddressFormData } from '@/types/user'

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
  name: '',
  phone: '',
  province: '',
  city: '',
  district: '',
  detail: '',
  isDefault: false,
  tag: undefined
})

// 计算属性
const title = computed(() => props.address ? '修改地址' : '添加新地址')
const submitText = computed(() => props.address ? '保存修改' : '添加地址')

// 监听地址变化，填充表单数据
watch(() => props.address, (newAddress) => {
  if (newAddress) {
    formData.value = {
      name: newAddress.name,
      phone: newAddress.phone,
      province: newAddress.province,
      city: newAddress.city,
      district: newAddress.district,
      detail: newAddress.detail,
      isDefault: newAddress.isDefault,
      tag: newAddress.tag
    }
  } else {
    // 重置表单
    formData.value = {
      name: '',
      phone: '',
      province: '',
      city: '',
      district: '',
      detail: '',
      isDefault: false,
      tag: undefined
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
  if (!formData.value.name.trim()) {
    alert('请输入收货人姓名')
    return
  }
  
  if (!formData.value.phone.trim() || !/^1[3-9]\d{9}$/.test(formData.value.phone)) {
    alert('请输入正确的手机号码')
    return
  }
  
  if (!formData.value.province || !formData.value.city || !formData.value.district) {
    alert('请选择完整的省市区')
    return
  }
  
  if (!formData.value.detail.trim()) {
    alert('请输入详细地址')
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