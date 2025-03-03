uniform float time;
uniform float progress;
uniform sampler2D texture1;
uniform vec4 resolution;
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vColor;

uniform vec2 pixels;
float PI = 3.1415192653589793238;


void main() {
    // gl_FragColor = vec4(vUv, 0.0, 1.0);
    gl_FragColor = vec4(vColor, 1.);  

}