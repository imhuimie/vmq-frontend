const DEFAULT_ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const DEFAULT_MAX_FILE_SIZE = 2 * 1024 * 1024
const DEFAULT_MAX_PIXELS = 4096 * 4096

export interface ImageValidationOptions {
  allowedTypes?: string[]
  maxFileSize?: number
  maxPixels?: number
}

export function validateImageFile(
  file: File,
  options: ImageValidationOptions = {}
): string | null {
  const allowedTypes = options.allowedTypes || DEFAULT_ALLOWED_TYPES
  const maxFileSize = options.maxFileSize || DEFAULT_MAX_FILE_SIZE

  if (!allowedTypes.includes(file.type)) {
    return '图片只支持 JPG、PNG、WEBP 格式'
  }

  if (file.size > maxFileSize) {
    return `图片大小不能超过 ${Math.floor(maxFileSize / 1024 / 1024)}MB`
  }

  return null
}

export function validateImageDimensions(
  image: HTMLImageElement,
  options: ImageValidationOptions = {}
): string | null {
  const maxPixels = options.maxPixels || DEFAULT_MAX_PIXELS
  const pixels = image.naturalWidth * image.naturalHeight

  if (pixels > maxPixels) {
    return '图片尺寸过大，请上传较小的二维码图片'
  }

  return null
}
