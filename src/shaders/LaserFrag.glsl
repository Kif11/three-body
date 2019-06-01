uniform float time;
uniform float fadeOutTime;
uniform vec3 sunCentroid;

varying vec2 vUv;

@import ./PerlinNoise;

void main() {
  vec3 scrollingPos = vec3(.5*vUv.x, 3.0*vUv.y+0.5*time, 1.0);

  float noise = cnoise(vec3(scrollingPos));

  float m = abs(vUv.x - 0.5);
  float n = 1.0 - vUv.y;

  vec3 color1 = vec3 (0.5, 0.5, 0.5);
  vec3 color2 = vec3 (1.0, 1.0, 1.0);

  gl_FragColor = vec4(color1+abs(noise)*color2, 0.8*(n - 0.2*m));
}
