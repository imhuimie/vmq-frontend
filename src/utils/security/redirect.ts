const SAFE_PROTOCOLS = new Set(['http:', 'https:'])

/**
 * 校验外部跳转地址，默认允许同源地址。
 * 需要允许商户域名时，通过 VITE_ALLOWED_REDIRECT_HOSTS 配置逗号分隔白名单。
 */
export function getSafeRedirectUrl(rawUrl: string, allowedHosts = getAllowedRedirectHosts()) {
  if (!rawUrl) return null

  try {
    const url = new URL(rawUrl, window.location.origin)

    if (!SAFE_PROTOCOLS.has(url.protocol)) {
      return null
    }

    if (url.origin === window.location.origin || allowedHosts.includes(url.hostname)) {
      return url.toString()
    }

    return null
  } catch {
    return null
  }
}

function getAllowedRedirectHosts(): string[] {
  return String(import.meta.env.VITE_ALLOWED_REDIRECT_HOSTS || '')
    .split(',')
    .map((host) => host.trim())
    .filter(Boolean)
}
