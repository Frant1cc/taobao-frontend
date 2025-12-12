// 商家商品管理相关API接口
import request from '@/api/request'
import type { 
  AddProductParams, 
  UpdateProductParams, 
  ProductListResponse,
  AddSkuParams,
  UpdateSkuParams,
  AddProductWithImagesParams,
  ProductDetailResponse
} from '@/types/product'
import type { ShopResponse } from '@/types/shop'

/**
 * 商家添加商品
 * @param params 商品信息
 * @returns 添加结果
 */
export const addProduct = (params: AddProductParams): Promise<ShopResponse<string>> => {
  return request({
    url: '/api/shop/product/add',
    method: 'POST',
    data: params
  })
}

/**
 * 商家添加商品（支持直接上传图片文件）
 * @param params 商品创建信息
 * @param mainImageFiles 商品主图文件列表
 * @param detailImageFiles 商品详情图文件列表
 * @returns 创建结果
 */
export const addProductWithImages = (
  params: AddProductWithImagesParams,
  mainImageFiles?: File[],
  detailImageFiles?: File[]
): Promise<ShopResponse<string>> => {
  const formData = new FormData()
  
  // 添加商品信息（转换为JSON字符串）
  const productData = {
    productName: params.productName,
    description: params.description,
    categoryId: params.categoryId,
    status: params.status
  }
  formData.append('product', new Blob([JSON.stringify(productData)], { type: 'application/json' }))
  
  // 添加主图文件
  if (mainImageFiles && mainImageFiles.length > 0) {
    mainImageFiles.forEach((file, index) => {
      formData.append('mainImages', file)
    })
  }
  
  // 添加详情图文件
  if (detailImageFiles && detailImageFiles.length > 0) {
    detailImageFiles.forEach((file, index) => {
      formData.append('detailImages', file)
    })
  }
  
  return request({
    url: '/api/shop/product/add-with-images',
    method: 'POST',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * 商家获取商品列表
 * @param pageNum 页码
 * @param pageSize 每页数量
 * @param queryParams 查询参数
 * @returns 商品列表
 */
export const getProductList = (
  pageNum: number = 1, 
  pageSize: number = 10,
  queryParams?: {
    productName?: string
    status?: string
    categoryId?: number | string
  }
): Promise<ShopResponse<ProductListResponse>> => {
  const params = {
    pageNum,
    pageSize,
    ...queryParams
  }
  
  return request({
    url: '/api/shop/product/list',
    method: 'GET',
    params
  })
}

/**
 * 商家更新商品
 * @param productId 商品ID
 * @param params 商品更新信息
 * @returns 更新结果
 */
export const updateProduct = (
  productId: number, 
  params: UpdateProductParams
): Promise<ShopResponse<string>> => {
  return request({
    url: `/api/shop/product/update/${productId}`,
    method: 'PUT',
    data: params
  })
}

/**
 * 商家删除商品
 * @param productId 商品ID
 * @returns 删除结果
 */
export const deleteProduct = (productId: number): Promise<ShopResponse<string>> => {
  return request({
    url: `/api/shop/product/${productId}`,
    method: 'DELETE'
  })
}

/**
 * 商家添加SKU
 * @param params SKU信息
 * @returns 添加结果
 */
export const addSku = (params: AddSkuParams): Promise<ShopResponse<string>> => {
  return request({
    url: '/api/shop/product/sku/add',
    method: 'POST',
    data: params
  })
}

/**
 * 商家更新SKU
 * @param skuId SKU ID
 * @param params SKU更新信息
 * @returns 更新结果
 */
export const updateSku = (
  skuId: number, 
  params: UpdateSkuParams
): Promise<ShopResponse<string>> => {
  return request({
    url: `/api/shop/product/sku/update/${skuId}`,
    method: 'PUT',
    data: params
  })
}

/**
 * 商家删除SKU
 * @param skuId SKU ID
 * @returns 删除结果
 */
export const deleteSku = (skuId: number): Promise<ShopResponse<string>> => {
  return request({
    url: `/api/shop/product/sku/${skuId}`,
    method: 'DELETE'
  })
}

/**
 * 商家上传SKU图片
 * @param skuImageFile SKU图片文件
 * @returns 上传结果
 */
export const uploadSkuImage = (skuImageFile: File): Promise<ShopResponse<string>> => {
  const formData = new FormData()
  formData.append('skuImage', skuImageFile)
  
  return request({
    url: '/api/product/sku/image/upload',
    method: 'POST',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * 根据商品ID获取商品详情（包含SKU信息）
 * @param productId 商品ID
 * @returns 商品详情
 */
export const getProductDetails = (productId: number): Promise<ProductDetailResponse> => {
  return request({
    url: `/api/shop/products/${productId}`,
    method: 'GET'
  })
}