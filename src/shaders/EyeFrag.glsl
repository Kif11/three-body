uniform float time;

void main() {
  gl_FragColor = vec4(0.8+0.5*sin(time),0.1,0.0,1.0);
}
