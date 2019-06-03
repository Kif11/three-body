uniform float fadeOutTime;

void main() {
  gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
  gl_FragColor.rgb += fadeOutTime/abs(fadeOutTime)*pow(abs(fadeOutTime),2.0);
}
