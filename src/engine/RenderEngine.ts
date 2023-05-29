import { WebGLRenderer } from 'three'
import { Engine } from './Engine'
import * as THREE from 'three'
import { GameEntity } from './GameEntity'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer';

export class RenderEngine implements GameEntity {
  private readonly renderer: WebGLRenderer
  private readonly cssrenderer: CSS2DRenderer
  composer: EffectComposer

  constructor(private engine: Engine) {
    this.renderer = new WebGLRenderer({
      canvas: this.engine.canvas,
      antialias: true,
    })

    this.renderer.physicallyCorrectLights = true
    this.renderer.outputEncoding = THREE.sRGBEncoding
    this.renderer.toneMapping = THREE.CineonToneMapping
    this.renderer.toneMappingExposure = 1.75
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    this.renderer.setClearColor('#000000')
    this.renderer.setSize(this.engine.sizes.width, this.engine.sizes.height)
    this.renderer.setPixelRatio(Math.min(this.engine.sizes.pixelRatio, 2))

    this.composer = new EffectComposer(this.renderer)

    const renderPass = new RenderPass(
      this.engine.scene,
      this.engine.camera.instance
    )
    this.composer.addPass(renderPass)
    this.cssrenderer = new CSS2DRenderer();
    this.cssrenderer.domElement.style.position = 'absolute';
    this.cssrenderer.domElement.style.top = '0px';
    this.cssrenderer.domElement.style.pointerEvents = 'none';
    // this.cssrenderer.domElement.style.zIndex = '9999999';
    this.cssrenderer.domElement.id = 'cssrenderer';
    this.cssrenderer.setSize( this.engine.sizes.width, this.engine.sizes.height );
    document.getElementById('canvas')?.parentNode?.append( this.cssrenderer.domElement );
  }

  update() {
    this.composer.render()
    this.cssrenderer.render(this.engine.scene, this.engine.camera.instance)
  }

  resize() {
    this.renderer.setSize(this.engine.sizes.width, this.engine.sizes.height)
    this.cssrenderer.setSize( this.engine.sizes.width, this.engine.sizes.height );
    this.composer.setSize(this.engine.sizes.width, this.engine.sizes.height)
    this.composer.render()
  }
}
