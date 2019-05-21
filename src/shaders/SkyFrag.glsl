@import ./PerlinNoise;
uniform float time;
uniform vec3 sunPos1;
uniform vec3 sunPos2;
uniform vec3 sunPos3;
uniform vec3 sunCentroid;
uniform float sunRadius1;
uniform float sunRadius2;
uniform float sunRadius3;
uniform float skyRadius;
uniform vec3 env_c1;
uniform vec3 env_c2;
uniform vec3 heat_c1;
uniform vec3 heat_c2;
uniform vec3 night_c1;
uniform float fadeOutTime;

uniform sampler2D flowTexture;
varying vec2 vUv;
varying vec3 vPos;

#include <common>
#include <fog_pars_fragment>

void main() {

  float freq = 1.1/(0.01 + skyRadius);

  vec3 scrollingPos = vec3(vPos.x, vPos.y, vPos.z + 100.0*time);
  float noise = cnoise(scrollingPos * freq) + 0.2;

  vec4 backgroundColor = vec4(mix(env_c1, env_c2, noise), 1.0);
  float noise2 = cnoise(scrollingPos*freq*1.0);

  vec4 heatColor = vec4(mix(heat_c1, heat_c2, noise2), 1.0);

  float l = length(vPos - sunPos1);
  float l2 = length(vPos - sunPos2);
  float l3 = length(vPos - sunPos3);

  float distHorizon = sunCentroid.y/(0.01 + skyRadius);

  backgroundColor = vec4(mix(night_c1.xyz, backgroundColor.xyz, clamp(distHorizon, 0.0, 1.0)), 1.0);

  float magnitude = (length(sunPos1 - sunCentroid) + length(sunPos3 - sunCentroid) + length(sunPos2 - sunCentroid))/6.0/(0.01 + skyRadius);
  float magnitudeS = (l + l2 + l3)/6.0/(0.01 + skyRadius);
  backgroundColor = mix(backgroundColor, heatColor, clamp(pow(1.0 - clamp(magnitudeS, .0, 1.0),2.0) * (1.5+pow(1.0 - clamp(magnitude, .0, 1.0),2.0)),0.0,1.0) );


  l = clamp((l-sunRadius1)/(4.0*sunRadius1), 0.0, 1.0);
  l2 = clamp((l2-sunRadius2)/(4.0*sunRadius2), 0.0, 1.0);
  l3 = clamp((l3-sunRadius3)/(4.0*sunRadius3), 0.0, 1.0);

  vec4 c1 = vec4(0.999, 0.999, 1.0, 1.0);

  //stars
  vec3 offset = vec3(100.0,100.0,100.0 );
  float cs = pow(cnoise(.01*vec3(vPos)+offset),5.0) + cnoise(.3*vec3(vPos));
  float ss =clamp(pow(cs,10.0),0.0,1.0);
  vec4 starColor = abs(clamp(distHorizon, -1.0, .0))*(vPos.y/(0.01 + skyRadius))*1.5*vec4(ss, ss, ss, 1.0);

  gl_FragColor = backgroundColor;
  @import ./ColorCorrection;
  @import ./FogReplaceFrag;

  gl_FragColor = mix(gl_FragColor, c1, clamp(pow(1.0 - l, 5.0) + pow(1.0 - l3, 5.0)+ pow(1.0 - l2, 5.0), 0.0, 1.0));
  // gl_FragColor += starColor;

}
