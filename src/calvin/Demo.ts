import { Engine } from '../engine/Engine'
import * as THREE from 'three'
import { Experience } from '../engine/Experience'
import { Resource } from '../engine/Resources'

// @ts-ignore
import vertexShader from './shader.vert'
// @ts-ignore
import fragmentShader from './shader.frag'

export class Demo implements Experience {
    resources: Resource[] = []
    texNames: string[] = [
        // "hyp_soln_1061316296_30l_src4k_XX", 
        // "hyp_soln_1061316296_30l_src4k_YY",
        "hyp_soln_1365977896_30l_src4k_XX", 
        "hyp_soln_1365977896_30l_src4k_YY",
    ]
    objNames: string[] = [
        // "1061316296",
        "1365977896",
    ]
    static title = 'Cal Vis'
    static description = 'a'

    constructor(private engine: Engine) {
        engine.debug.gui.show();
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
    }

    init() {
        this.engine.scene.add(new THREE.AmbientLight(0xffffff, 0.5))
        // let directionalLight = new THREE.DirectionalLight(0xffffff, 1)
        // directionalLight.castShadow = true
        // directionalLight.position.set(100, 100, 100)

        const axesHelper = new THREE.AxesHelper(5);
        axesHelper.layers.enableAll();
        this.engine.scene.add(axesHelper);

        // this.engine.scene.add(directionalLight)

        // Load the antenna positions
        const obsid = "1365977896"
        const meta = this.engine.resources.getItem(obsid);
        var antLocs = [];
        const a = 1000;
        var maxHeight = 0;
        for(const ant of meta) {
            if (ant.Pol == "X") {
                const loc = new THREE.Vector3(ant.North, ant.Height, ant.East);
                loc.setLength(a * Math.atan(loc.length() / a));
                antLocs.push(loc);
                if (ant.Height > maxHeight) {
                    maxHeight = ant.Height;
                }
            }
        };

        // Load the texture
        const texture = this.engine.resources.getItem(`hyp_soln_${obsid}_30l_src4k_XX`) as THREE.Texture;
        // Get the image data from the texture
        var img = texture.image;
        // var canvas = document.createElement('canvas');
        // var context = canvas.getContext('2d')!;
        // canvas.width = img.width;
        // canvas.height = img.height;
        // context.drawImage(img, 0, 0, img.width, img.height);
        // var imageData = context.getImageData(0, 0, img.width, img.height);

        // Create a point for each pixel
        var geometry = new THREE.BufferGeometry();
        var nants = img.height;
        var nchans = img.width;
        var ant_idxs = [];
        var chan_idxs = [];
        var ncols = 8;
        var positions = [];
        var indices = [];
        // const texHalf = 256;
        console.log(meta[0]);
        for (var i = 0; i < img.width * img.height; i++) {
            const ant_idx = Math.floor(i / img.width);
            const loc = antLocs[ant_idx];
            ant_idxs.push(ant_idx);
            const chan_idx = i % img.width;
            chan_idxs.push(chan_idx);
            if (chan_idx > 0) {
                indices.push(i - 1, i);
            }
            positions.push(loc.x, loc.y - maxHeight, loc.z);
        }
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setIndex(indices);
        geometry.setAttribute('ant_idx', new THREE.Float32BufferAttribute(ant_idxs, 1));
        geometry.setAttribute('chan_idx', new THREE.Float32BufferAttribute(chan_idxs, 1));

        // point at the center of the image
        this.engine.camera.setTarget(new THREE.Vector3(ncols / 2, 2, 0));
        // this.engine.camera.setTarget(new THREE.Vector3(0.5, 0.5, 0));


        // Create a ShaderMaterial
        var material = new THREE.ShaderMaterial({
            wireframe: false,
            linewidth: 20,
            uniforms: {
                tex: { value: texture },
                nants: { value: nants },
                nchans: { value: nchans }
            },
            vertexShader,
            fragmentShader,
            transparent: true
        });

        // Create a Points object with the geometry and material
        var solutionLines = new THREE.LineSegments(geometry, material);
        var solutionPoints = new THREE.Points(geometry, material);

        // Add the Points object to the scene
        this.engine.scene.add(solutionLines);
        this.engine.scene.add(solutionPoints);

        // this.engine.camera.position.z = 128;  // Adjust the camera position so all antennas are visible
    }

    updateAttributes(a: number) {

    }

    resize() { }

    update(_delta: number) { 
        // this.engine.camera.translateCamera(new THREE.Vector3(_delta, 0, 0));
        // this.engine.camera.translateTarget(new THREE.Vector3(_delta, 0, 0));
    }
}