uniform float time;
uniform float fadeOutTime;
uniform vec3 fireRingColor2;
uniform vec3 fireRingColor1;
uniform vec3 sunCentroid;

varying vec2 vUv;
varying vec3 vPos;

@import ./PerlinNoise;

void main() {
  vec3 scrollingPos = vec3(vPos.x, vPos.y*4.0, vPos.z+time);
  vec3 scrollingPos2 = vec3(vPos.x, vPos.y, vPos.z+4.0*time);

  float dist2Horiz = clamp(sunCentroid.y/1000.0, 0.0, 1.0);

  float noise = cnoise(vec3(0.01*scrollingPos));

  noise *= dist2Horiz*5.0*(pow(clamp(1.0-vUv.y,0.0,1.0),2.0));
  // noise *= sin(0.04*time+0.05*vPos.x);
  noise= 6.0*pow(noise,2.0) + dist2Horiz*pow((1.0-vUv.y),4.0)*cnoise(vec3(0.2*scrollingPos2));
  vec3 finalColor = mix(fireRingColor1, fireRingColor2, clamp(noise, 0.0, 1.0));
  gl_FragColor = vec4(finalColor, noise);

  @import ./ColorCorrection;
}
