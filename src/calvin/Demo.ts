import { Engine } from '../engine/Engine'
import * as THREE from 'three'
import { Experience } from '../engine/Experience'
import { Resource } from '../engine/Resources'

// @ts-ignore
import vertexShader from './shader.vert'
// @ts-ignore
import fragmentShader from './shader.frag'
// import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer'
import {Soln} from './Soln'

export class Demo implements Experience {
    resources: Resource[] = []
    texNames: string[] = [
        "hyp_soln_1061316296_30l_src4k_XX", 
        "hyp_soln_1061316296_30l_src4k_YY",
        "hyp_soln_1365977896_30l_src4k_XX", 
        "hyp_soln_1365977896_30l_src4k_YY",
    ]
    objNames: string[] = [
        "1061316296",
        "1365977896",
    ]
    a: number = 1000;
    refant: number = 143;
    static title = 'Calvis'
    static description = 'calibration solution visualizer'

    constructor(private engine: Engine) {
        engine.debug.gui.show();
        engine.debug.gui.close();
        for( const name of this.texNames) {
            this.resources.push({
                name,
                type: 'texture',
                path: `textures/${name}.png`
            })
        }
        for (const name of this.objNames) {
            this.resources.push({
                name,
                type: 'json',
                path: `objects/${name}.json`
            })
        }
        const debugLayout = engine.debug.gui.addFolder('Layout')
        debugLayout.add(this, 'a', 1, 1000, 1).onChange((a: number) => {
            this.engine.scene.traverse( (child)=>{
                if(child instanceof Soln) {
                  child.updateLayout(a)
                }
            })
        })
        debugLayout.add(this, 'refant', 1, 144, 1).onChange((a: number) => {
            this.engine.scene.traverse( (child)=>{
                if(child instanceof Soln) {
                  child.updateRefant(a)
                }
            })
        })
    }

    init() {
        this.engine.scene.add(new THREE.AmbientLight(0xffffff, 0.5))
        // let directionalLight = new THREE.DirectionalLight(0xffffff, 1)
        // directionalLight.castShadow = true
        // directionalLight.position.set(100, 100, 100)

        const axesHelper = new THREE.AxesHelper(5);
        axesHelper.layers.enableAll();
        this.engine.scene.add(axesHelper);
        // this.engine.camera.setTarget(new THREE.Vector3(100, 7.5, -40));
        this.engine.camera.setTarget(new THREE.Vector3(0, 0, 0));
        // this.engine.camera.instance.set(140, 7.5, 20);

        // this.engine.scene.add(directionalLight)

        // Load the antenna positions
        const obsid = 1365977896
        // const obsid = 1061316296
        const meta = this.engine.resources.getItem(`${obsid}`)
        const texture_xx = this.engine.resources.getItem(`hyp_soln_${obsid}_30l_src4k_XX`) as THREE.Texture;
        const texture_yy = this.engine.resources.getItem(`hyp_soln_${obsid}_30l_src4k_YY`) as THREE.Texture;

        const soln_xx = new Soln(obsid, meta, texture_xx, 1/24);
        soln_xx.init();
        this.engine.scene.add(soln_xx);
        const soln_yy = new Soln(obsid, meta, texture_yy, -1/24);
        soln_yy.init();
        this.engine.scene.add(soln_yy);
    }

    resize() { }

    update(_delta: number) { 
        // this.engine.camera.translateCamera(new THREE.Vector3(_delta, 0, 0));
        // this.engine.camera.translateTarget(new THREE.Vector3(_delta, 0, 0));
    }
}