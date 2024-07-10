import { renderTooltip, getCanvasRectColor,  renderColorInfo, Rect } from './helper.ts';
import { rgba2hex } from '../index.ts';
export interface ColorPipetteOptions {
  scale?: number;
  ctx: CanvasRenderingContext2D;
}
// 拾色器
class ColorPipette {
  rect: Rect = { x: 0, y: 0, width: 0, height: 0 };
  canvas: any = {};
  ctx: CanvasRenderingContext2D;
  scale = 1;
  magnifier: any = null;
  colorContainer: any = null;
  colors: string[][] = [];
  tooltipVisible = true;
  constructor(props: ColorPipetteOptions) {
    const { scale = 1, ctx } = props;
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.rect = ctx.canvas.getBoundingClientRect();
    this.scale = scale > 4 ? 4 : scale;
  }
  async start() {
    try {
      const tooltip = renderTooltip('按 Esc 可退出');
      document.body.appendChild(tooltip);
      setTimeout(() => tooltip?.parentNode?.removeChild(tooltip), 3000);
      this.canvas.addEventListener('mousemove', this.handleMove);
      this.canvas.addEventListener('mousedown', this.handleDown);
      document.addEventListener('keydown', this.handleKeyDown);
    } catch (error) {
      console.log(`COLORPIPETTE START ERROR: ${error}`);
      this.destroy();
    }
  }
  destroy() {
    this.canvas.removeEventListener('mousemove', this.handleMove);
    this.canvas.removeEventListener('mousedown', this.handleDown);
    document.removeEventListener('keydown', this.handleKeyDown);
    this.canvas?.parentNode?.removeChild(this.canvas);
    this.colorContainer?.parentNode?.removeChild(this.colorContainer);
  }
  handleMove = (e: MouseEvent) => {
    const { color, colors } = this.getPointColors(e);
    const point = { x: e.pageX + 15, y: e.pageY + 15 };
    const colorContainer = renderColorInfo({
      containerDom: this.colorContainer,
      color,
      colors,
      point,
    });
    if (!this.colorContainer) {
      this.colorContainer = colorContainer;
      document.body.appendChild(colorContainer);
    }
  }
  handleDown = (e: MouseEvent) => {
    const res = this.getPointColors(e);
    console.log(JSON.stringify(res.colors, null, 4));
    this.destroy();
  }

  // 处理键盘按下Esc退出拾色
  handleKeyDown = (e: KeyboardEvent) => {
    if (e.code === 'Escape') {
      this.destroy();
    }
  };

  // 获取鼠标点周围的颜色整列
  getPointColors(e: MouseEvent) {
    const { ctx, rect, scale } = this;
    let { pageX: x, pageY: y } = e;

    // 得到相对于canvas的坐标
    x -= rect.x || 0;
    y -= rect.y || 0;
    const color = this.getPointColor(x, y);
    const size = 19;
    const half = Math.floor(size / 2);
    const colors = getCanvasRectColor(ctx, { x: x - half, y: y - half, width: size, height: size }, scale);
    return { color, colors };
  }

  /**
   * 获取鼠标点的颜色
   */
  getPointColor(x: number, y: number) {
    const { scale } = this;
    const { data } = this.ctx.getImageData(x * scale, y * scale, 1, 1);
    const r = data[0];
    const g = data[1];
    const b = data[2];
    const a = data[3] / 255;
    return rgba2hex(r, g, b, a);
  }
}

export default ColorPipette;





// 初始化
// const pipette = new ColorPipette({
//     container: document.body,
//     scale: 2,
//     listener: {
//       onOk({ color, colors }) => {
//         console.log(color, colors);
//       },
//     }
//   });
//   // 开始取色
//   pipette.start();