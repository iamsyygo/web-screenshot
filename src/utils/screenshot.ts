interface ScreenshotOptions {
  imageUrl: string
  canvasId?: string
}
export class Screenshot {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private imageUrl: string

  // 是否正在选择区域
  private isSelecting: boolean
  private startX: number
  private startY: number
  private endX: number
  private endY: number
  private image: HTMLImageElement
  private points: { x: number; y: number }[]
  private draggingPoint: { x: number; y: number } | null

  // 正在拖动大小...
  private dragging: boolean

  // 正在移动选区...
  private isMoving: boolean
  private offsetX: number
  private offsetY: number

  private dashOffset: number = 0
  private reqAnimFrameFlag = 0
  constructor(canvasId: string, imageUrl: string) {
    this.canvas = <HTMLCanvasElement>document.getElementById(canvasId)
    this.ctx = this.canvas.getContext('2d')!
    this.imageUrl = imageUrl

    this.dragging = false
    this.isSelecting = false
    this.isMoving = false
    this.offsetX = 0
    this.offsetY = 0
    this.startX = 0
    this.startY = 0
    this.endX = 0
    this.endY = 0
    this.draggingPoint = null
    this.points = [
      { x: 0, y: 0 },
      { x: 0, y: 0 },
      { x: 0, y: 0 },
      { x: 0, y: 0 },
      { x: 0, y: 0 },
      { x: 0, y: 0 },
      { x: 0, y: 0 },
      { x: 0, y: 0 },
    ]

    this.image = new Image()
    this.image.onload = () => {
      this.canvas.width = this.image.width
      this.canvas.height = this.image.height
      this.ctx.drawImage(this.image, 0, 0)
    }
    this.image.src = this.imageUrl

    this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this))
    this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this))
    this.canvas.addEventListener('mouseup', this.onMouseUp.bind(this))
    this.canvas.addEventListener('contextmenu', this.cancelSelect.bind(this))
  }

  onMouseDown(event: MouseEvent) {
    const { offsetX, offsetY } = event
    this.draggingPoint = this.getDraggingPoint(offsetX, offsetY)!

    // 如果点击的是拖动点
    if (this.draggingPoint) {
      this.dragging = true
      this.isSelecting = false
    } else if (this.isInsideSelection(offsetX, offsetY)) {
      // 点击的是选区or边框
      this.isMoving = true
      this.offsetX = offsetX - this.startX
      this.offsetY = offsetY - this.startY
      this.canvas.style.cursor = 'grabbing'
    } else {
      // 点击的是画布
      this.isSelecting = true
      this.startX = offsetX
      this.startY = offsetY
      this.endX = offsetX
      this.endY = offsetY
      this.canvas.style.cursor = 'crosshair'
    }
    this.dashOffset = 0
    cancelAnimationFrame(this.reqAnimFrameFlag)
    this.animate()
  }

  // TODO: 优化, 重复的判断逻辑过多
  onMouseMove(event: MouseEvent) {
    const { offsetX, offsetY } = event
    const draggingPoint = this.getDraggingPoint(offsetX, offsetY)

    const updateCursor = (cursorStyle: string) => {
      this.canvas.style.cursor = cursorStyle
    }

    if (draggingPoint && !this.dragging) {
      this.setCursorForPoint(draggingPoint)
    } else if (this.isSelecting) {
      this.endX = offsetX
      this.endY = offsetY
      updateCursor('crosshair')
    } else if (this.isMoving && !this.dragging) {
      this.moveSelection(offsetX - this.offsetX, offsetY - this.offsetY)
      updateCursor('grabbing')
    } else if (this.isInsideSelection(offsetX, offsetY) && !this.dragging) {
      updateCursor('grabbing')
    } else if (!this.dragging) {
      updateCursor('crosshair')
    }

    if (this.draggingPoint) {
      this.moveDraggingPoint(offsetX, offsetY)
    }

    this.draw()
  }

  onMouseUp(event: MouseEvent) {
    this.isSelecting = false
    this.isMoving = false
    this.draggingPoint = null
    this.canvas.style.cursor = 'crosshair'
    this.updatePoints()
    this.dragging = false
  }

  /**
   * 判断是否在选区内
   * @param x
   * @param y
   * @returns
   */
  isInsideSelection(x: number, y: number) {
    return x > this.startX && x < this.endX && y > this.startY && y < this.endY
  }

  /**
   * 移动选区
   * @param x
   * @param y
   */
  moveSelection(x: number, y: number) {
    const width = this.endX - this.startX
    const height = this.endY - this.startY
    this.startX = x
    this.startY = y
    this.endX = x + width
    this.endY = y + height
  }

  /**
   * 获取拖动点
   * @param x
   * @param y
   * @returns
   */
  getDraggingPoint(x: number, y: number) {
    return this.points.find(point => Math.abs(point.x - x) < 5 && Math.abs(point.y - y) < 5) || null
  }

  /**
   * 移动拖动点
   * @param x
   * @param y
   * @returns
   */
  moveDraggingPoint(x: number, y: number) {
    if (!this.draggingPoint) return
    const index = this.points.indexOf(this.draggingPoint)
    if (index === -1) return

    this.points[index].x = x
    this.points[index].y = y

    switch (index) {
      case 0:
        this.startX = x
        this.startY = y
        break
      case 1:
        this.endX = x
        this.startY = y
        break
      case 2:
        this.endX = x
        this.endY = y
        break
      case 3:
        this.startX = x
        this.endY = y
        break
      case 4:
        this.startX = x
        break
      case 5:
        this.endX = x
        break
      case 6:
        this.startY = y
        break
      case 7:
        this.endY = y
        break
    }
  }

  /**
   * 设置鼠标样式
   * @param point 鼠标位置
   */
  setCursorForPoint(point: { x: number; y: number }) {
    const index = this.points.indexOf(point)
    switch (index) {
      case 0:
      case 2:
        // 左上角 or 右下角
        this.canvas.style.cursor = 'nwse-resize'
        break

      case 1:
      case 3:
        // 右上角 or 左下角
        this.canvas.style.cursor = 'nesw-resize'
        break

      case 4:
      case 5:
        // 左中 or 右中
        this.canvas.style.cursor = 'col-resize'
        break

      case 6:
      case 7:
        // 上中 or 下中
        this.canvas.style.cursor = 'row-resize'
        break

      default:
        this.canvas.style.cursor = 'default'
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.ctx.drawImage(this.image, 0, 0)

    if (this.startX !== this.endX && this.startY !== this.endY) {
      this.ctx.setLineDash([5, 5])
      this.ctx.strokeStyle = 'black'
      this.ctx.lineDashOffset = -this.dashOffset
      this.ctx.lineWidth = 0.5
      this.ctx.strokeRect(
        this.startX,
        this.startY,
        this.endX - this.startX,
        this.endY - this.startY,
      )
      this.drawPoints()
    }
  }

  drawPoints() {
    this.updatePoints()
    this.ctx.fillStyle = 'white'
    this.ctx.strokeStyle = 'black'
    this.points.forEach(point => {
      this.ctx.beginPath()
      this.ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI)
      this.ctx.fill()
    })
  }

  updatePoints() {
    // fix change quote generate error
    // top left
    this.points[0].x = this.startX
    this.points[0].y = this.startY

    // top right
    this.points[1].x = this.endX
    this.points[1].y = this.startY

    // bottom right
    this.points[2].x = this.endX
    this.points[2].y = this.endY

    // bottom left
    this.points[3].x = this.startX
    this.points[3].y = this.endY

    // middle left
    this.points[4].x = this.startX
    this.points[4].y = (this.startY + this.endY) / 2

    // middle right
    this.points[5].x = this.endX
    this.points[5].y = (this.startY + this.endY) / 2

    // middle top
    this.points[6].x = (this.startX + this.endX) / 2
    this.points[6].y = this.startY

    // middle bottom
    this.points[7].x = (this.startX + this.endX) / 2
    this.points[7].y = this.endY
  }

  extractSelectedImage() {
    const width = this.endX - this.startX
    const height = this.endY - this.startY
    const tempCanvas = <HTMLCanvasElement>document.createElement('canvas')
    const tempCtx: CanvasRenderingContext2D | null = tempCanvas.getContext('2d')
    tempCanvas.width = width
    tempCanvas.height = height
    tempCtx?.drawImage(this.canvas, this.startX, this.startY, width, height, 0, 0, width, height)
    const selectedImageUrl = tempCanvas.toDataURL('image/png')
    console.log(selectedImageUrl) // 可以在这里处理选取的图像数据
  }

  // 右键取消选择
  cancelSelect(event: MouseEvent) {
    event.preventDefault()
    this.isSelecting = false
    this.startX = 0
    this.startY = 0
    this.endX = 0
    this.endY = 0
    this.draw()
  }

  /**
   * 绘制流动的线
   */
  animate() {
    this.dashOffset += 0.5 // 改变这个值可以改变流动的速度
    this.draw()
    // requestAnimationFrame(this.animate.bind(this))
    this.reqAnimFrameFlag = requestAnimationFrame(this.animate.bind(this))
  }
}

