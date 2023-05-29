varying vec2 vUv;
uniform sampler2D tex;
attribute float ant_idx;
attribute float chan_idx;
uniform float nants;
uniform float nchans;
void main() {
    vUv = (vec2(chan_idx, ant_idx) + vec2(0.5, 0.5)) / vec2(nchans, nants);
    vec4 texColor = texture2D(tex, vUv);
    vec2 cplx = vec2(texColor.r, texColor.g) * 2. - 1.;
    vec4 newPos = vec4(position.x + cplx.x, position.y + (chan_idx / 24.), position.z + cplx.y, 1.);
    gl_Position = projectionMatrix * modelViewMatrix * newPos;
    gl_PointSize = 10.0 * texColor.a;
}
