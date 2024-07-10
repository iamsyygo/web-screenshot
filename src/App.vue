<script setup lang="ts">
import { Screenshot } from './utils/screenshot'
import bd3aefcc4bb4c7cf8bd61f206b936525 from './assets/bd3aefcc4bb4c7cf8bd61f206b936525.png'
import { base642Blob } from './utils'
const toolbarItems: any = [
  {
    name: 'select',
    title: '擦除',
    icon: 'solar--eraser-square-bold-duotone',
    event: (e: MouseEvent) => {
      screenshot.cancelSelect(e)
    },
  },
  {
    name: 'undo',
    title: '撤销',
    icon: 'solar--restart-square-bold-duotone',
    event: (e: MouseEvent) => {
      screenshot.cancelSelect(e)
    },
  },
  {
    name: 'split',
    title: '分割线',
    icon: 'solar--split',
  },
  {
    name: 'copy',
    title: '复制',
    icon: 'solar--copy-bold-duotone',
    event: (e: MouseEvent) => {
      const img = screenshot.extractSelectedImage(e)
      // 复制图片至剪贴板
      // base64 转 blob
      const item = new ClipboardItem({ 'image/png': base642Blob(img) })
      navigator.clipboard.write([item])
    },
  },
  {
    name: 'cancel',
    title: '取消',
    icon: 'solar--close-square-bold-duotone',
    event: (e: MouseEvent) => {
      screenshot.cancelSelect(e)
    },
  },
  {
    name: 'download',
    title: '下载',
    icon: 'solar--download-square-bold-duotone',
    event: (e: MouseEvent) => {
      screenshot.cancelSelect(e)
    },
  },
  {
    name: 'success',
    title: '成功',
    icon: 'solar--check-square-bold-duotone',
    event: (e: MouseEvent) => {
      screenshot.extractSelectedImage(e)
    },
  },
  {
    name: 'top',
    title: '置顶',
    icon: 'solar--pin-circle-bold-duotone',
    event: () => {
      screenshot.extractSelectedImage()
    },
  },
]

let screenshot: Screenshot

window.onload = () => {
  screenshot = new Screenshot({
    canvasId: 'canvas',
    imageUrl: bd3aefcc4bb4c7cf8bd61f206b936525 as string,
    toolbarItems,
  })
}
function ontake() {
  // screenshot.takeScreenshot()
}
</script>

<template>
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
    <button type="button" @click="ontake">📷</button>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
