
uniform sampler2D tex;
varying vec2 vUv;
const float PI = 3.1415926535897932384626433832795;
vec3 HUEtoRGB(in float hue)
{
    // Hue [0..1] to RGB [0..1]
    // See http://www.chilliant.com/rgb2hsv.html
    vec3 rgb = abs(hue * 6. - vec3(3, 2, 4)) * vec3(1, -1, -1) + vec3(-1, 2, 2);
    return clamp(rgb, 0., 1.);
}

vec3 HSVtoRGB(in vec3 hsv)
{
    // Hue-Saturation-Value [0..1] to RGB [0..1]
    vec3 rgb = HUEtoRGB(hsv.x);
    return ((rgb - 1.) * hsv.y + 1.) * hsv.z;
}

float atan2(in float y, in float x)
{
    return x == 0.0 ? sign(y)*PI/2. : atan(y, x);
}
void main() {
    vec4 texColor = texture2D(tex, vUv);
    float real = texColor.r * 2. - 1.;
    float imag = texColor.g * 2. - 1.;
    float phase = atan2(imag, real);
    float mag = length(vec2(real, imag));
    float wght = texColor.a;
    float hue = mod(phase / (2. * PI), 1.);
    float sat = sqrt(mag);
    float val = 1.;
    gl_FragColor = vec4(HSVtoRGB(vec3(hue, sat, val)), wght);
}
