interface ScreenshotOptions {
  image: string
}

export class Screenshot {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private modal: HTMLDivElement
  private options: ScreenshotOptions

  private screenWidth: number
  private screenHeight: number

  private start: { x: number; y: number } = { x: 0, y: 0 }
  private end: { x: number; y: number } = { x: 0, y: 0 }

  constructor(options: ScreenshotOptions) {
    // full screen size
    const { width, height } = window.screen
    this.screenWidth = width * window.devicePixelRatio
    this.screenHeight = height * window.devicePixelRatio

    this.options = options
    this.canvas = document.createElement('canvas')
    this.ctx = this.canvas.getContext('2d')!
    this.modal = document.createElement('div')
    this.setupModal()
  }

  private setupModal() {
    this.modal.style.width = this.screenWidth + 'px'
    this.modal.style.height = this.screenHeight + 'px'
    this.modal.style.position = 'fixed'
    this.modal.style.top = '0'
    this.modal.style.left = '0'
    this.modal.style.backgroundColor = 'rgba(0, 0, 0, 0.3)'
    this.modal.style.opacity = '0'
    this.modal.style.transition = 'opacity 0.3s'
    this.modal.style.display = 'none'

    this.modal.addEventListener('click', this.startSelecting.bind(this))

    document.body.appendChild(this.modal)
  }

  public async takeScreenshot() {
    const img = new Image()
    img.src = this.options.image
    img.onload = () => {
      const width = this.screenWidth || img.width
      const height = this.screenHeight || img.height

      this.canvas.width = width
      this.canvas.height = height
      // this.ctx.drawImage(img, 0, 0, width, height)

      this.showScreenshot()
    }

    img.onerror = error => {
      console.error('图片加载失败:', error)
    }
  }

  private showScreenshot() {
    const screenshotImg = new Image()
    screenshotImg.src = this.canvas.toDataURL()
    this.modal.appendChild(screenshotImg)
    this.modal.style.display = 'block'
    this.modal.style.opacity = '1'
  }

  public hideScreenshot() {
    this.modal.style.display = 'none'
    this.modal.style.opacity = '0'
  }

  public startSelecting() {
    this.modal.style.cursor = 'crosshair'
    this.modal.addEventListener('mousedown', this.handleMouseDown)
    this.modal.addEventListener('mousemove', this.handleMouseMove)
    this.modal.addEventListener('mouseup', this.handleMouseUp)
  }
  handleMouseDown = (e: MouseEvent) => {
    console.log(e)

    this.start.x = e.clientX
    this.start.y = e.clientY
  }
  handleMouseMove = (e: MouseEvent) => {
    this.end.x = e.clientX
    this.end.y = e.clientY
    this.drawSelectRect()
  }
  handleMouseUp = (e: MouseEvent) => {
    this.end.x = e.clientX
    this.end.y = e.clientY
    this.drawSelectRect()
    // this.cropScreenshot()
  }
  drawSelectRect() {
    const { x, y } = this.start
    const width = this.end.x - x
    const height = this.end.y - y
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.ctx.drawImage(this.modal.querySelector('img')!, 0, 0)
    this.ctx.strokeStyle = 'red'
    this.ctx.lineWidth = 2
    this.ctx.strokeRect(x, y, width, height)
  }
  cropScreenshot() {
    const { x, y } = this.start
    const width = this.end.x - x
    const height = this.end.y - y
    const imageData = this.ctx.getImageData(x, y, width, height)
    this.canvas.width = width
    this.canvas.height = height
    this.ctx.putImageData(imageData, 0, 0)
    this.hideScreenshot()
    this.modal.style.cursor = 'default'
    this.modal.removeEventListener('mousedown', this.handleMouseDown)
    this.modal.removeEventListener('mousemove', this.handleMouseMove)
    this.modal.removeEventListener('mouseup', this.handleMouseUp)
  }
}
