export interface Address {
  addressId: number;
  userId: number;
  fullAddress: string;
  recipientName: string;
  phone: string;
  isDefault: boolean;
  createTime: string;
  updateTime: string;
}

export interface BaseResponse {
  code: number;
  msg: string;
  data?: any;
}

export interface AddressListResponse extends BaseResponse {
  data: Address[];
}

export interface AddressResponse extends BaseResponse {
  data?: Address;
}

export interface CreateAddressRequest {
  fullAddress: string;
  recipientName: string;
  phone: string;
  isDefault?: boolean;
}

export interface UpdateAddressRequest extends CreateAddressRequest {
  addressId: number;
}