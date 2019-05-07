varying vec3 vNormal;
varying vec2 vUv;

uniform sampler2D diffuseTex;

void main() {
  vec4 diffuseColor = texture2D(diffuseTex, vUv);
  gl_FragColor = diffuseColor;
}
