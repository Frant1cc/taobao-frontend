// 地址相关API接口
import request from '@/api/request'
import type { 
  AddressListResponse, 
  CreateAddressRequest, 
  UpdateAddressRequest, 
  AddressResponse 
} from '@/types/address'

// 添加地址
export function addAddress(data: CreateAddressRequest) {
  return request<AddressResponse>({
    url: '/api/address/add',
    method: 'post',
    data
  })
}

// 获取地址列表
export function getAddressList() {
  return request<AddressListResponse>({
    url: '/api/address/list',
    method: 'get'
  })
}

// 获取默认地址
export function getDefaultAddress() {
  return request<AddressResponse>({
    url: '/api/address/default',
    method: 'get'
  })
}

// 根据ID获取地址
export function getAddressById(addressId: number) {
  return request<AddressResponse>({
    url: `/api/address/${addressId}`,
    method: 'get'
  })
}

// 更新地址
export function updateAddress(data: UpdateAddressRequest) {
  return request<AddressResponse>({
    url: '/api/address/update',
    method: 'put',
    data
  })
}

// 设置默认地址
export function setDefaultAddress(addressId: number) {
  return request<AddressResponse>({
    url: `/api/address/set-default/${addressId}`,
    method: 'put'
  })
}

// 删除地址
export function deleteAddress(addressId: number) {
  return request<AddressResponse>({
    url: `/api/address/${addressId}`,
    method: 'delete'
  })
}