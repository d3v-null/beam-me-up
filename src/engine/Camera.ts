import { Engine } from './Engine'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FlyControls } from 'three/examples/jsm/controls/FlyControls.js'
import { GameEntity } from './GameEntity'

export class Camera implements GameEntity {
  public instance!: THREE.PerspectiveCamera
  private controls!: OrbitControls | FlyControls

  constructor(private engine: Engine) {
    this.initCamera()
    this.initControls()
  }

  private initCamera() {
    this.instance = new THREE.PerspectiveCamera(
      80,
      window.innerWidth / window.innerHeight,
      0.1,
      10000
    )
    this.instance.position.x = 0
    this.instance.position.y = 0
    this.instance.position.z = 0
    this.engine.scene.add(this.instance)
  }

  private initControls() {
    // this.controls = new FlyControls(this.instance, this.engine.canvas);
    // this.controls.dragToLook = true;
    // this.controls.autoForward = true;

    this.controls = new OrbitControls(this.instance, this.engine.canvas)
    this.controls.keys.LEFT = 'KeyA';
    this.controls.keys.RIGHT = 'KeyD';
    this.controls.keys.BOTTOM = 'KeyS';
    this.controls.keys.UP = 'KeyW';
    this.controls.keyPanSpeed = 20;
    this.controls.autoRotate = false;
    this.controls.enableDamping = true;
    this.controls.listenToKeyEvents(window);
    this.controls.update()
  }

  resize() {
    this.instance.aspect = this.engine.sizes.aspectRatio
    this.instance.updateProjectionMatrix()
  }

  update(_delta: number) {
    if (this.controls instanceof OrbitControls) {
      this.controls.update()
    } else {
      this.controls.update(_delta)
    }
  }

  setTarget(target: THREE.Vector3) {
    if (this.controls instanceof OrbitControls) {
      this.controls.target = target
    }
  }

  translateCamera(delta: THREE.Vector3) {
    this.instance.position.add(delta);
  }

  translateTarget(delta: THREE.Vector3) {
    if (this.controls instanceof OrbitControls) {
      this.controls.target.add(delta);
    }
  }
}
