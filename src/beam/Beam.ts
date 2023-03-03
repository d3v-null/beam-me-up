import * as THREE from 'three'
// @ts-ignore
import vertexShader from './shader.vert'
// @ts-ignore
import fragmentShader from './shader.frag'

export const TEXTURES = [
  'textures/beam_texture_p00_f049920000.png',
  'textures/beam_texture_p00_f110080000.png',
  'textures/beam_texture_p00_f327680000.png',
  'textures/beam_texture_p02_f102400000.png',
  'textures/beam_texture_p02_f128000000.png',
];

export class Beam extends THREE.Mesh {
  constructor() {
    const geometry = new THREE.SphereGeometry(1, 512, 512)

    // Load the heightmap data
    const tex = new THREE.TextureLoader().load(TEXTURES[3]);
    tex.minFilter = THREE.LinearFilter;

    const material = new THREE.ShaderMaterial({
      uniforms: {
        tex: {
          value: tex
        },
      },
      vertexShader,
      fragmentShader,
      depthWrite: true,
      side: THREE.DoubleSide
    })

    super(geometry, material)
  }

  updateTex(tex: THREE.Texture) {
    const materials = (Array.isArray(this.material)) ? this.material : [this.material];
    materials.forEach((material) => {
      if (material instanceof THREE.ShaderMaterial) {
        material.uniforms.tex.value = tex
        material.needsUpdate = true
      }
    })
  }
}
