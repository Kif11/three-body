uniform float time;
uniform vec3 sunPos1;
uniform vec3 sunPos2;
uniform vec3 sunPos3;
uniform float sunRadius1;
uniform float sunRadius2;
uniform float sunRadius3;
uniform float skyRadius;

uniform sampler2D flowTexture;
varying vec2 vUv;
varying vec3 vPos;

void main() {
  float l = length(vPos - sunPos1);
  float l2 = length(vPos - sunPos2);
  float l3 = length(vPos - sunPos3);

  vec4 c1 = vec4(0.996, 0.996, 0.945, 1.0);
  vec4 c2 = vec4(0.482, 0.678, 0.776, 1.0);

  gl_FragColor = mix(c2, c1,
    pow(1.0 - clamp((l3 - sunRadius3)/(skyRadius*2.0), 0.0, 1.0),9.0) +
    pow(1.0 - clamp((l2 - sunRadius2)/(skyRadius*2.0), 0.0, 1.0),9.0) +
    pow(1.0 - clamp((l - sunRadius1)/(skyRadius*2.0), 0.0, 1.0),9.0)
    );

}
