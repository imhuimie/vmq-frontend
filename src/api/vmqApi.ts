import api from '@/utils/http'
import { ApiResponse } from '@/typings/api'
import { useUserStore } from '@/store/modules/user'

// 设置 VMQ API 基础 URL
// const VITE_VMQ_API_URL = import.meta.env.VITE_VMQ_API_URL
// api.defaults.baseURL = VITE_VMQ_API_URL

// 二维码查询参数接口
interface QrcodeParams {
  page?: number
  limit?: number
}

// 二维码项接口
interface QrcodeItem {
  id: number
  price: number
  pay_url: string
  state: number
  state_text?: string
  create_date?: string
}

// 二维码响应接口
interface QrcodeResponse {
  total?: number
  items?: QrcodeItem[]
  data?: QrcodeItem[] | { total?: number; items?: QrcodeItem[] }
  [key: string]: any
}

/**
 * VMQ API接口
 */
export class VmqService {
  /**
   * 登录接口
   * @param params 登录参数
   */
  static async login(params: { username: string; password: string }) {
    const responseData = await api.post<{
      accessToken: string
      refreshToken: string
      tokenType: string
      expiresIn: number
      refreshTokenExpiresIn: number
      username: string
    }>({
      url: `/api/auth/login`,
      data: {
        user: params.username,
        pass: params.password
      }
    })

    return {
      accessToken: responseData.accessToken,
      refreshToken: responseData.refreshToken,
      tokenType: responseData.tokenType,
      expiresIn: responseData.expiresIn,
      refreshTokenExpiresIn: responseData.refreshTokenExpiresIn,
      message: '登录成功'
    }
  }

  /**
   * 获取菜单数据
   */
  static async getMenu() {
    return api.get<any>({
      url: `/api/menu`
    })
  }

  /**
   * 获取订单列表
   * @param params 查询参数
   */
  static async getOrders(params?: { page?: number; limit?: number; state?: number }) {
    const res = await api.get<any>({
      url: `/api/order/list`,
      params
    })
    return normalizePage(res, normalizeOrder)
  }

  /**
   * 获取微信二维码列表
   */
  static async getWxQrcodes(params: QrcodeParams) {
    const res = await api.get<any>({
      url: '/api/qrcode/wechat',
      params
    })
    return normalizePage(res)
  }

  /**
   * 获取支付宝二维码列表
   */
  static async getZfbQrcodes(params: QrcodeParams) {
    const res = await api.get<any>({
      url: '/api/qrcode/alipay',
      params
    })
    return normalizePage(res)
  }

  /**
   * 添加微信二维码
   */
  static async addWxQrcode(data: { price: number; pay_url: string }) {
    return api.post<ApiResponse<any>>({
      url: '/api/qrcode/wechat',
      data
    })
  }

  /**
   * 添加支付宝二维码
   */
  static async addZfbQrcode(data: { price: number; pay_url: string }) {
    return api.post<ApiResponse<any>>({
      url: '/api/qrcode/alipay',
      data
    })
  }

  /**
   * 删除微信二维码
   */
  static async delWxQrcode(id: number) {
    return api.del<ApiResponse<any>>({
      url: `/api/qrcode/wechat/${id}`
    })
  }

  /**
   * 删除支付宝二维码
   */
  static async delZfbQrcode(id: number) {
    return api.del<ApiResponse<any>>({
      url: `/api/qrcode/alipay/${id}`
    })
  }

  /**
   * 上传微信二维码图片
   */
  static async uploadWxQrcode(formData: FormData) {
    const { accessToken } = useUserStore()
    const headers: Record<string, string> = {}
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`
    }

    // 使用 fetch API 发送请求，确保 FormData 被正确处理
    const response = await fetch(`/api/qrcode/parse`, {
      method: 'POST',
      headers,
      body: formData
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ msg: `HTTP 错误，状态码: ${response.status}` }))
      throw new Error(errorData.msg || '上传失败')
    }

    return response.json()
  }

  /**
   * 上传支付宝二维码图片
   */
  static async uploadZfbQrcode(formData: FormData) {
    return api.post<any>({
      url: `/api/qrcode/parse`,
      data: formData
    })
  }

  /**
   * 解析二维码
   */
  static async parseQrcode(qrcodeData: string) {
    // 此方法已不再需要，因为我们现在直接上传文件
    // 保留此空方法或移除它都可以，为了安全起见，我们先注释掉其内容
    /*
    try {
      console.log('调用parseQrcode方法，数据长度:', qrcodeData.length)

      const formData = new FormData()

      const byteCharacters = atob(qrcodeData)
      const byteNumbers = new Array(byteCharacters.length)
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }
      const byteArray = new Uint8Array(byteNumbers)
      const blob = new Blob([byteArray], { type: 'image/png' })

      formData.append('file', blob, 'qrcode.png')

      const response = await api.post<any>({
        url: `/api/qrcode/parse`,
        data: formData
      })

      console.log('解析二维码API调用成功:', response)
      return response
    } catch (error) {
      console.error('解析二维码API调用失败:', error)
      throw error
    }
    */
    return Promise.resolve()
  }

  /**
   * 获取系统设置
   */
  static async getSettings() {
    return api.get<any>({
      url: `/api/config/settings`
    })
  }

  /**
   * 更新系统设置
   */
  static async updateSettings(params: any) {
    return api.post<any>({
      url: `/api/config/settings`,
      data: params
    })
  }

  /**
   * 获取监控端状态
   */
  static async getMonitorStatus() {
    return api.get<any>({
      url: `/api/config/monitor`
    })
  }

  /**
   * 设置监控端参数
   */
  static async saveMonitorSettings(params: any) {
    return api.post<any>({
      url: `/api/config/monitor`,
      data: params
    })
  }

  /**
   * 删除订单
   */
  static async deleteOrder(id: number) {
    return api.del<any>({
      url: `/api/order/${id}`
    })
  }

  /**
   * 补单（重新发起异步通知）
   */
  static async reissueOrder(id: number) {
    return api.post<any>({
      url: `/api/order/reissue/${id}`
    })
  }

  /**
   * 关闭超时订单
   */
  static async closeExpiredOrders() {
    return api.post<any>({
      url: `/closeEndOrder`
    })
  }

  /**
   * 删除过期订单
   */
  static async deleteExpiredOrders() {
    return api.del<any>({
      url: `/api/order/expired`
    })
  }

  /**
   * 删除历史订单
   */
  static async deleteLastOrders() {
    return api.del<any>({
      url: `/api/order/last`
    })
  }

  /**
   * 设置二维码状态（启用/禁用）
   * @param id 二维码ID
   * @param state 状态：0-启用，1-禁用
   */
  static async setQrcodeState(id: number, state: number) {
    return api.post<ApiResponse<any>>({
      url: `/api/qrcode/bind/${id}`,
      data: { state }
    })
  }
}

/**
 * 获取系统状态（统计数据）
 * @returns Promise
 */
export const getSystemStatus = () => {
  return api.get<any>({ url: '/api/config/status' })
}

/**
 * 获取系统配置（环境信息）
 * @returns Promise
 */
export const getSystemConfig = () => {
  return api.get<any>({ url: '/api/config/get' })
}

const normalizePage = <T = any>(res: any, mapper?: (item: any) => T) => {
  const items = Array.isArray(res) ? res : res?.items || res?.data || []
  return {
    items: mapper ? items.map(mapper) : items,
    total: res?.total ?? res?.count ?? items.length
  }
}

const normalizeOrder = (order: any) => {
  const stateTextMap: Record<number, string> = {
    [-1]: '已关闭',
    0: '未支付',
    1: '已支付',
    2: '通知失败'
  }
  const typeTextMap: Record<number, string> = {
    1: '微信',
    2: '支付宝'
  }

  return {
    ...order,
    state_text: order.state_text || stateTextMap[order.state] || '未知',
    type_text: order.type_text || typeTextMap[order.type] || '未知',
    create_time: order.create_time || formatUnix(order.create_date)
  }
}

const formatUnix = (value?: number) => {
  if (!value) return ''
  return new Date(value * 1000).toLocaleString()
}

export type { QrcodeItem, QrcodeResponse }
