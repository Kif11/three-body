varying float vReflectionFactor;

void main() {
  vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
  vec3 worldNormal = normalize( mat3( modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz ) * normal );
  vec3 I = worldPosition.xyz - cameraPosition;
  vReflectionFactor = 1.0 + dot( normalize( I ), worldNormal );

  vec4 modelViewPosition = modelViewMatrix * vec4( position, 1.0 );
  gl_Position = projectionMatrix * modelViewPosition;
}
