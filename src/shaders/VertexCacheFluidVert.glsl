varying vec3 vColor;
varying vec2 vUv;

uniform float bbox_max;
uniform float bbox_min;
uniform float timeInFrames;
uniform float numFrames;

uniform sampler2D posTex;
uniform sampler2D colorTex;

void main() {
  vUv = uv;
  float tt = timeInFrames/numFrames + 1.0/numFrames;
  vec4 texPos = texture2D(posTex, vec2(uv.x, uv.y + tt - .25/numFrames));
  vec4 texColor = texture2D(colorTex, vec2(uv.x, uv.y + tt - .25/numFrames));
  vColor = texColor.xyz;

  vec3 texturePos = texPos.xyz;
  float expand = bbox_max - bbox_min; //bbmax - bbmin
  texturePos.xyz *= expand;
  texturePos.xyz += bbox_min;
  vec3 p = texturePos.xzy;  //swizzle y and z because textures are exported with z-up
  vec4 modelViewPosition = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * modelViewPosition;
}
