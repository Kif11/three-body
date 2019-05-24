uniform float time;
varying vec3 vColor;

void main() {
  gl_FragColor = vec4(1.15 * pow(vColor, vec3(0.44, 0.44, 0.44)), 1.0);
}
