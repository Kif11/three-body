uniform float time;
uniform vec3 color1;
varying vec2 vUv;

void main() {
  // vec2 distortedUv = vec2(vUv.x + 0.001*sin(5.0*vUv.y + 0.001*time), vUv.y);
  float r = 0.12;
  float c = pow(vUv.x - 0.5,2.0) + pow(vUv.y-0.5,2.0);
  float z = 1.5*pow(abs(c - r*r),0.01*sin(0.001*time) + 0.1);

  gl_FragColor = z*vec4(color1,1.0);
}
