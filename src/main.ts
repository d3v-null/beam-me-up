import './style.scss'
import { Engine } from './engine/Engine'
// import { Demo } from './beam/Demo'
// import { Demo } from './grid/Demo'
// import { Demo } from './sdc3/Demo'
import { Demo } from './calvin/Demo'

new Engine({
  canvas: document.querySelector('#canvas') as HTMLCanvasElement,
  experience: Demo,
  info: {
    // twitter: '...',
    github: 'https://github.com/d3v-null/beam-me-up',
    description: Demo.description || '',
    title: Demo.title || '',
    documentTitle: Demo.title || 'Demo',
  },
})
