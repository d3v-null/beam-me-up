uniform sampler2D tex;
varying vec2 vUv;
void main() {
    vec4 texData = texture2D(tex, vUv);
    gl_FragColor = vec4(texData.rgb, 1.0);
}