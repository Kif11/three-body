varying vec3 vColor;
uniform vec3 sunCentroid;
uniform float fadeOutTime;

void main() {
  gl_FragColor = vec4(1.15 * pow(vColor, vec3(0.44, 0.44, 0.44)), 1.0);
  @import ./ColorCorrection;
}
