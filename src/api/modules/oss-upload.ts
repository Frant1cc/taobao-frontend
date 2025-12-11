// OSS图片上传服务
import request from '@/api/request'
import type { ShopResponse } from '@/types/shop'

/**
 * OSS图片上传参数
 */
export interface OssUploadParams {
  file: File
  fileName?: string
  folder?: string
}

/**
 * OSS上传响应
 */
export interface OssUploadResponse {
  url: string
  fileName: string
  size: number
}

/**
 * 上传图片到OSS
 * @param params 上传参数
 * @returns 上传结果
 */
export const uploadToOss = (params: OssUploadParams): Promise<ShopResponse<OssUploadResponse>> => {
  const formData = new FormData()
  formData.append('file', params.file)
  
  if (params.fileName) {
    formData.append('fileName', params.fileName)
  }
  
  if (params.folder) {
    formData.append('folder', params.folder)
  }
  
  return request({
    url: '/api/oss/upload',
    method: 'POST',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * 批量上传图片到OSS
 * @param files 文件列表
 * @param folder 文件夹路径
 * @returns 上传结果列表
 */
export const batchUploadToOss = async (
  files: File[],
  folder: string = 'images'
): Promise<ShopResponse<OssUploadResponse>[]> => {
  const uploadPromises = files.map(file => {
    const fileName = `${folder}/${Date.now()}_${file.name}`
    return uploadToOss({
      file,
      fileName,
      folder
    })
  })
  
  return Promise.all(uploadPromises)
}