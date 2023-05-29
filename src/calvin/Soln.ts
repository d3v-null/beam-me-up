import * as THREE from 'three'
// @ts-ignore
import vertexShader from './shader.vert'
// @ts-ignore
import fragmentShader from './shader.frag'
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer'


type Input = {
    Antenna: number;
    Tile: number;
    Rx: number;
    Slot: number;
    Pol: string;
    TileName: string;
    Flag: number;
    North: number;
    East: number;
    Height: number;
    // labelDiv: HTMLDivElement | null;
    label: CSS2DObject | null;
    loc: THREE.Vector3 | null;
};

export const OBSIDS: number[] = [
    1061316296,
    1365977896,
]

export class Soln extends THREE.Group {
    geometry: THREE.BufferGeometry = new THREE.BufferGeometry();
    meta: Array<Input>;
    a: number = 1000;
    obsid: number;
    tex: THREE.Texture;
    material: THREE.ShaderMaterial;
    constructor(obsid: number, meta: Array<Input>, tex: THREE.Texture) {
        super();
        this.obsid = obsid;
        this.meta = meta.filter(ant => ant.Pol == "X");
        // Create a ShaderMaterial
        this.tex = tex;
        var {height: nants, width: nchans} = this.tex.image;
        this.material = new THREE.ShaderMaterial({
            uniforms: {
                tex: { value: tex },
                nants: { value: nants },
                nchans: { value: nchans }
            },
            vertexShader,
            fragmentShader,
            transparent: true
        });
        // this.updateLayout();
    }

    init() {
        this.updateLayout();

        // Create a Points object with the geometry and material
        this.add(new THREE.LineSegments(this.geometry, this.material));
        this.add(new THREE.Points(this.geometry, this.material));
    }
    
    updateMeta(obsid: number, meta: Array<Input>, tex: THREE.Texture) {
        this.obsid = obsid;
        this.meta = meta.filter(ant => ant.Pol == "X");
        this.tex = tex;
        const {height: nants, width: nchans} = this.tex.image;
        this.tex.needsUpdate = true;
        this.material.uniforms.tex.value = tex;
        this.material.uniforms.nants.value = nants;
        this.material.uniforms.nchans.value = nchans;
        this.material.needsUpdate = true;
        this.updateLayout();
    }

    relabel(ant: Input) {
        let labelDiv: HTMLDivElement
        if (!ant.label) {
            labelDiv = document.createElement('div');
            ant.label = new CSS2DObject(labelDiv);
            this.add(ant.label);
        }
        ant.label.element.id = ant.TileName;
        ant.label.element.className = 'label';
        ant.label.element.style.backgroundColor = '#77777777';
        ant.label.element.style.fontSize = '12px';
        ant.label.element.style.fontFamily = 'monospace';
        ant.label.element.style.marginTop = '-1em';
        ant.label.element.style.color = 'white';
        ant.label.element.style.textShadow = '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000'
        // ant.Antenna.toHtml();
        ant.label.element.innerHTML = `${ant.TileName}<!--
        <br>${ant.Rx}.${ant.Slot}
            <h1>${ant.TileName}</h1>
            <ul>
                <li>Antenna: ${ant.Antenna}</li>
                <li>Tile: ${ant.Tile}</li>
                <li>Rx: ${ant.Rx}</li>
                <li>Slot: ${ant.Slot}</li>
                <li>Pol: ${ant.Pol}</li>
                <li>TileName: ${ant.TileName}</li>
                <li>Flag: ${ant.Flag}</li>
                <li>North: ${ant.North}</li>
                <li>East: ${ant.East}</li>
                <li>Height: ${ant.Height}</li>
            </ul>-->
        `;
    };

    updateLayout(a: number = this.a) {
        console.log("Updating layout");
        // const antLocs = [];
        const maxHeight = Math.max(...this.meta.map(ant => ant.Height));      
        for(var ant of this.meta) {
            if (ant.Pol == "Y") {
                continue;
            }
            if (!ant.loc) {
                ant.loc = new THREE.Vector3();
            }
            ant.loc.set(ant.North, ant.Height - maxHeight, ant.East);
            ant.loc.setLength(a * Math.atan(ant.loc.length() / a));

            this.relabel(ant);

            ant.label!.position.copy(ant.loc);
            ant.label!.position.setY(0);
        }

        var {height: nants, width: nchans} = this.tex.image;
        if(nants != this.meta.length) {
            console.log("Number of antennas in meta data does not match number of antennas in texture");
        }
        var ant_idxs = [];
        var chan_idxs = [];
        const indices: number[] = [];
        var positions = [];
        for (var i = 0; i < nchans * nants; i++) {
            const ant_idx = Math.floor(i / nchans);
            ant_idxs.push(ant_idx);
            const {loc, Flag: flag} = this.meta[ant_idx];
            const chan_idx = i % nchans;
            chan_idxs.push(chan_idx);
            if (chan_idx>0 && !flag) {
                indices.push(i - 1, i);
            }
            positions.push(loc!.x, loc!.y, loc!.z);
        }
        console.log(indices);
        this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        this.geometry.setIndex(indices);
        this.geometry.setAttribute('ant_idx', new THREE.Float32BufferAttribute(ant_idxs, 1));
        this.geometry.setAttribute('chan_idx', new THREE.Float32BufferAttribute(chan_idxs, 1));

    }
}