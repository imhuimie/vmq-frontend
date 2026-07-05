const ALLOWED_TAGS = new Set([
  'a',
  'abbr',
  'b',
  'blockquote',
  'br',
  'code',
  'del',
  'div',
  'em',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'hr',
  'i',
  'img',
  'li',
  'ol',
  'p',
  'pre',
  'span',
  'strong',
  'table',
  'tbody',
  'td',
  'th',
  'thead',
  'tr',
  'u',
  'ul'
])

const ALLOWED_ATTRS = new Set([
  'alt',
  'class',
  'colspan',
  'height',
  'href',
  'rel',
  'rowspan',
  'src',
  'style',
  'target',
  'title',
  'width'
])

const URI_ATTRS = new Set(['href', 'src'])
const SAFE_URI_PATTERN = /^(https?:|mailto:|tel:|\/|#)/i

/**
 * 清洗可渲染 HTML，避免 v-html 直接执行脚本或事件属性。
 */
export function sanitizeHtml(html: string): string {
  if (!html) return ''

  const template = document.createElement('template')
  template.innerHTML = html
  sanitizeNode(template.content)
  return template.innerHTML
}

function sanitizeNode(node: Node): void {
  Array.from(node.childNodes).forEach((child) => {
    if (child.nodeType === Node.COMMENT_NODE) {
      child.remove()
      return
    }

    if (child.nodeType !== Node.ELEMENT_NODE) {
      return
    }

    const element = child as HTMLElement
    const tagName = element.tagName.toLowerCase()

    if (!ALLOWED_TAGS.has(tagName)) {
      element.remove()
      return
    }

    sanitizeAttributes(element)
    sanitizeNode(element)
  })
}

function sanitizeAttributes(element: HTMLElement): void {
  Array.from(element.attributes).forEach((attr) => {
    const name = attr.name.toLowerCase()
    const value = attr.value.trim()

    if (name.startsWith('on') || !ALLOWED_ATTRS.has(name)) {
      element.removeAttribute(attr.name)
      return
    }

    if (URI_ATTRS.has(name) && !SAFE_URI_PATTERN.test(value)) {
      element.removeAttribute(attr.name)
      return
    }

    if (name === 'style' && /url\s*\(|expression\s*\(/i.test(value)) {
      element.removeAttribute(attr.name)
      return
    }

    if (name === 'target' && value === '_blank') {
      element.setAttribute('rel', 'noopener noreferrer')
    }
  })
}
