uniform float time;
varying vec3 vColor;

void main() {
  gl_FragColor = vec4(2.0*vColor, 1.0);
}
