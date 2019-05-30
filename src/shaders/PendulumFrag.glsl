uniform float time;
uniform float fadeOutTime;
uniform float glow;
uniform vec3 sunCentroid;

varying float vReflectionFactor;


void main() {
  gl_FragColor = (0.5 + clamp(vReflectionFactor*glow,0.0,2.0))*vec4(0.3,0.3,0.3,1.0);
  @import ./ColorCorrection;
}
