varying vec3 vViewPosition;
varying vec3 vNormal;
varying vec2 vUv;

attribute vec2 uv2;

uniform float bbox_max;
uniform float bbox_min;
uniform float timeInFrames;
uniform float numFrames;

uniform sampler2D posTex;
uniform sampler2D normalTex;

void main() {
  vUv = uv;
  float tt = timeInFrames/numFrames + 1.0/numFrames;
  vec4 texPos = texture2D(posTex, vec2(uv2.x, uv2.y + tt - 1.0)); //repeat wrapping does not work for custom attributes?
  vec4 texNormal = texture2D(normalTex, vec2(uv2.x, uv2.y + tt - 1.0));
  // vColor = texColor.xyz;
  //
  vec3 texturePos = texPos.xyz;
  float expand = bbox_max - bbox_min; //bbmax - bbmin
  texturePos.xyz *= expand;
  texturePos.xyz += bbox_min;
  vec3 p = position + texturePos.xzy;  //swizzle y and z because textures are exported with z-up

  texNormal *= 2.0;
  texNormal -= 1.0;
  vNormal = normalMatrix * texNormal.xzy;

  vec4 modelViewPosition = modelViewMatrix * vec4(p, 1.0);
  vViewPosition = -modelViewPosition.xyz;
  gl_Position = projectionMatrix * modelViewPosition;
}
