uniform float time;
uniform float fadeOutTime;
uniform vec3 fireRingColor2;
uniform vec3 fireRingColor1;
uniform vec3 sunCentroid;

varying vec2 vUv;
varying vec3 vPos;

@import ./PerlinNoise;

void main() {
  vec3 scrollingPos = vec3(vUv.x, vUv.y, 1.0);
  vec3 scrollingPos2 = vec3(.5*vUv.x, 3.0*vUv.y+0.5*time, 1.0);

  float noise = cnoise(2.0*vec3(scrollingPos));
  float noise2 = 2.0*cnoise(vec3(scrollingPos2));

  float t = pow(1.0/(vUv.y - mod(2.0*time, 10.0))/10.0,3.0);
  vec3 finalColor = mix(fireRingColor1, fireRingColor2, clamp(t, 0.0, 1.0));

  float m = abs(vUv.x - 0.5);
  float n = 1.0 - vUv.y;
  gl_FragColor = vec4(finalColor, clamp(noise*noise2,0.8*(n - 0.2*m), 1.2*(n - 0.2*m)));

}
