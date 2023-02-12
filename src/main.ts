import './style.scss'
import { Engine } from './engine/Engine'
import { Demo } from './demo/Demo'

new Engine({
  canvas: document.querySelector('#canvas') as HTMLCanvasElement,
  experience: Demo,
  info: {
    // twitter: '...',
    github: 'https://github.com/d3v-null/beam-me-up',
    description: 'Threejs WebGPU demo using MWA FEE beam via hyperbeam',
    documentTitle: 'MWA Beam Demo',
    title: 'MWA Beam Demo',
  },
})
