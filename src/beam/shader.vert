varying vec2 vUv;
uniform sampler2D tex;

void main() {
    vUv = uv;
    vec4 texValue = texture2D(tex, vUv);
    vec3 newPosition = position + normal * (2.0 * texValue.a - 1.0);
    // vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
    vec4 modelViewPosition = modelViewMatrix * vec4(newPosition, 1.0);
    gl_Position = projectionMatrix * modelViewPosition;
}