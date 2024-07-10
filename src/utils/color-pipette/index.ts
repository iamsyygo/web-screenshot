import { renderTooltip, getCanvasRectColor, renderColorInfo, Rect } from './helper.ts'
import { rgba2hex } from '../index.ts'
export interface ColorPipetteOptions {
  scale?: number
  ctx: CanvasRenderingContext2D
}
// 拾色器
class ColorPipette {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  scale = 1
  magnifier: any = null
  colorContainer: any = null
  colors: string[][] = []
  tooltipVisible = true
  visible = true
  isOutdrop = false
  constructor(props: ColorPipetteOptions) {
    const { scale = 1, ctx } = props
    this.ctx = ctx
    this.canvas = ctx.canvas
    this.scale = scale > 4 ? 4 : scale
  }
  async start() {
    try {
      // const tooltip = renderTooltip('按 Esc 可退出')
      // document.body.appendChild(tooltip)
      // setTimeout(() => tooltip?.parentNode?.removeChild(tooltip), 3000)
      this.canvas.addEventListener('mousemove', this.handleMove)
      // this.canvas.addEventListener('mousedown', this.handleDown)
      document.addEventListener('keydown', this.handleKeyDown)
      // this.canvas.addEventListener('mouseleave', this.validateOutdrop.bind(this))
    } catch (error) {
      console.log(`COLORPIPETTE START ERROR: ${error}`)
      this.destroy()
    }
  }
  destroy() {
    // this.canvas.removeEventListener('mousemove', this.handleMove)
    // this.canvas.removeEventListener('mousedown', this.handleDown)
    // document.removeEventListener('keydown', this.handleKeyDown)
    // this.canvas?.parentNode?.removeChild(this.canvas)
    // this.colorContainer?.parentNode?.removeChild(this.colorContainer)
  }

  // 判断是否鼠标移动出界外
  validateOutdrop(e: MouseEvent) {
    const { x, y, width, height } = this.canvas.getBoundingClientRect()
    if (e.clientX < x || e.clientX > x + width || e.clientY < y || e.clientY > y + height) {
      this.hide()
      this.isOutdrop = true
      return
    }
  }

  handleMove = (e?: MouseEvent) => {
    if (!this.visible || !e) return
    const { color, colors } = this.getPointColors(e)
    const point = { x: e.clientX + 15, y: e.clientY + 15 }
    const colorContainer = renderColorInfo({
      containerDom: this.colorContainer,
      color,
      colors,
      point,
    })
    if (!this.colorContainer) {
      this.colorContainer = colorContainer
      document.body.appendChild(colorContainer)
    }
  }
  handleDown = (e: MouseEvent) => {
    // 右键点击退出
    if (e.button === 2) {
      return
    }
    const res = this.getPointColors(e)
    console.log(JSON.stringify(res.colors, null, 4))
    // this.destroy()
  }

  // 处理键盘按下Esc退出拾色
  handleKeyDown = (e: KeyboardEvent) => {
    if (e.code === 'Escape') {
      this.destroy()
    }
  }

  // 获取鼠标点周围的颜色整列
  getPointColors(e: MouseEvent) {
    const { ctx, scale } = this
    let { clientX: x, clientY: y } = e
    const color = this.getPointColor(x, y)
    const size = 19
    const half = Math.floor(size / 2)
    const colors = getCanvasRectColor(
      ctx,
      { x: x - half, y: y - half, width: size, height: size },
      scale,
    )
    return { color, colors }
  }

  /**
   * 获取鼠标点的颜色
   */
  getPointColor(x: number, y: number) {
    const { scale } = this
    const { data } = this.ctx.getImageData(x * scale, y * scale, 1, 1)
    const r = data[0]
    const g = data[1]
    const b = data[2]
    const a = data[3] / 255
    return rgba2hex(r, g, b, a)
  }
  show() {
    this.visible = true
    this.colorContainer.style.display = 'block'
  }
  hide() {
    this.visible = false
    this.colorContainer.style.display = 'none'
  }
}

export default ColorPipette
