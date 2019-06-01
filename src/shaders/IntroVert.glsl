varying vec3 vNormal;
varying vec3 vPos;
varying vec2 vUv;

void main() {
  vPos = position;
  vNormal = normalize( normalMatrix * normal );
  vUv = uv;

  vec4 modelViewPosition = modelViewMatrix * vec4( vPos, 1.0 );
  gl_Position = projectionMatrix * modelViewPosition;
}
