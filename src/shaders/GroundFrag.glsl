uniform float time;
uniform sampler2D flowTexture;
varying vec2 vUv;

void main() {
  vec4 flowMap = texture2D(flowTexture, vUv);
  vec4 c1 = vec4(1.0, 0.0, 0.0, 1.0);
  vec4 c2 = vec4(0.0, 1.0, 0.0, 1.0);

  gl_FragColor = mix(c1, c2, flowMap.x);
}
