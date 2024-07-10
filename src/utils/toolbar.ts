/**
 * 根据位置绘制工具栏
 * @param {number} x 工具栏的x坐标
 * @param {number} y 工具栏的y坐标
 * @param {number} width 工具栏的宽度
 * @param {number} height 工具栏的高度
 */
import { ToolbarItem } from './screenshot'
import './toolbar-icon.css'
interface Rect {
  x: number
  y: number
  width: number
  height: number
}

const wrapperDefaultStyle = `
        position: fixed;
        left: 0;
        top: 0;
        width: auto;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        opacity: 0;
        font-size: 26px;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 5px;
        transition: opacity 0.2s;
        border-radius: 5px;
        padding: 0 5px;`

interface ShowOptions {
  end: { x: number; y: number }
  start: { x: number; y: number }
  //   width: number
  //   height: number
}

interface ToolbarOptions {
  items: ToolbarItem[]
}

export class Toolbar {
  x = 0
  y = 0
  height = 30
  backgroundColor = '#fff'
  wrapperContainer: HTMLElement
  toolbarItems: ToolbarItem[] = []
  constructor(options: ToolbarOptions) {
    this.toolbarItems = options.items
    this.wrapperContainer = this.create()
  }

  draw() {
    console.log('draw toolbar')
  }

  create() {
    const wrapper = document.createElement('div')

    document.body.appendChild(wrapper)
    this.toolbarItems.forEach(item => {
      const itemDom = document.createElement('div')
      itemDom.className = item.icon + ' toolbar-item'
      itemDom.style.cursor = 'pointer'
      itemDom.title = item.title
      if (item.event) {
        itemDom.addEventListener('click', item.event)
      }
      wrapper.appendChild(itemDom)
    })

    // @ts-expect-error
    wrapper.style = `
        transform: translate(${this.x}px, ${this.y}px);
        height: ${this.height}px;
        background-color: ${this.backgroundColor};
        ${wrapperDefaultStyle}
        `
    return wrapper
  }

  show(options: ShowOptions) {
    // this.wrapperContainer.style.transform = `translate(${x}px, ${y + 10}px)`
    this.wrapperContainer.style.opacity = '1'
    const { start, end } = options

    // 显示在中间
    const x = (start.x + end.x) / 2 - this.wrapperContainer.offsetWidth / 2

    // 默认放在下面，如果下面空间不够，放在上面 || 如果上下都不够，放在画布最下角里面
    const distance = 10
    if (end.y + this.height + distance > window.innerHeight) {
      const y = start.y - this.height - distance
      this.wrapperContainer.style.transform = `translate(${x}px, ${y}px)`
      return
    }
    const y = end.y + distance
    this.wrapperContainer.style.transform = `translate(${x}px, ${y}px)`
  }
  hide() {
    this.wrapperContainer.style.opacity = '0'
  }
}
