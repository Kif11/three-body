varying vec3 vPos;
varying vec2 vUv;

#include <fog_pars_vertex>

void main() {
  vPos = position;
  vUv = uv;

  vec4 mvPosition = modelViewMatrix * vec4( vPos, 1.0 );
  gl_Position = projectionMatrix * mvPosition;

  @import ./FogReplaceVert;
}
