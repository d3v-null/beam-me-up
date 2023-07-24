import { Engine } from './Engine'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FlyControls } from 'three/examples/jsm/controls/FlyControls.js'
import { GameEntity } from './GameEntity'
import GUI from 'lil-gui'

export class Camera implements GameEntity {
  public instance!: THREE.PerspectiveCamera
  private controls!: OrbitControls | FlyControls
  private debugPosition: GUI
  private debugTarget: GUI

  constructor(private engine: Engine) {
    this.initCamera()
    this.initControls()
    this.debugPosition = engine.debug.gui.addFolder('Camera Position')
    this.debugPosition.add(this.instance.position, 'x', -100, 100, 0.1)
    this.debugPosition.add(this.instance.position, 'y', -100, 100, 0.1)
    this.debugPosition.add(this.instance.position, 'z', -100, 100, 0.1)
    // this.debugPosition.add(this.instance.position, 'w', -100, 100, 0.1)
    this.debugTarget = engine.debug.gui.addFolder('Camera Quaternion')
    this.debugTarget.add((this.controls as OrbitControls).target, 'x', -1, 1, 0.1)
    this.debugTarget.add((this.controls as OrbitControls).target, 'y', -1, 1, 0.1)
    this.debugTarget.add((this.controls as OrbitControls).target, 'z', -1, 1, 0.1)
    // this.debugTarget.add(this.controls.target, 'w', -1, 1, 0.1)
  }

  private initCamera() {
    this.instance = new THREE.PerspectiveCamera(
      80,
      window.innerWidth / window.innerHeight,
      0.1,
      10000
    )
    this.instance.position.x = 122
    this.instance.position.y = 0
    this.instance.position.z = -20
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

  setPosition(position: THREE.Vector3) {
    this.instance.position.copy(position)
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
