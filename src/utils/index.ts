/**
 * RGB 转换为 HEX
 * @param r
 * @param g
 * @param b
 * @returns
 */
export function rgb2hex(r: number, g: number, b: number) {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
}

// RGBA 转换为 HEX
export function rgba2hex(r: number, g: number, b: number, a: number) {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}${Math.round(a * 255)
    .toString(16)
    .padStart(2, '0')}`
}

/**
 * RGB 转换为 HSL
 * @param r
 * @param g
 * @param b
 * @returns
 */
export function rgb2hsl(r: number, g: number, b: number) {
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h,
    s,
    l = (max + min) / 2

  if (max === min) {
    h = s = 0
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    h /= 6
  }

  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)]
}

export function base642Blob(base64: string, contentType = 'image/png'): Blob {
  // 去掉base64格式图片的头部
  const arr = base64.split(',')
  // atob()方法将数据解码
  const bstr = atob(arr[1])
  let leng = bstr.length
  const u8arr = new Uint8Array(leng)
  while (leng--) {
    // 返回指定位置的字符的 Unicode 编码
    u8arr[leng] = bstr.charCodeAt(leng)
  }
  return new Blob([u8arr], { type: contentType })
}
