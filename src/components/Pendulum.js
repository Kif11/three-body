import SunCalibratedMaterial from '../shaders/SunCalibratedMaterial';
import PendulumFrag from '../shaders/PendulumFrag.glsl';
import PendulumVert from '../shaders/PendulumVert.glsl';

import AFRAME from 'aframe';
const THREE = AFRAME.THREE;

AFRAME.registerComponent('pendulum', {
  schema: {
    height: {
      type: 'int',
      default: 30
    },
    radius: {
      type: 'int',
      default: 3
    },
  },

  init: function () {
    const system = document.querySelector('a-scene').systems['sunSystem'];

    const camera = document.querySelector('#camera');
    this.lookControls = camera.getAttribute('look-controls');

    const ballMat = new THREE.ShaderMaterial({
      uniforms: {
        sunCentroid: {value: new THREE.Vector3(0,0,0)},
        fadeOutTime: {value: 0},
        time: {value: 0},
        glow: {value: 0.1},
      },
      vertexShader: PendulumVert,
      fragmentShader: PendulumFrag,
    });
    var ballGeo = new THREE.SphereGeometry(this.data.radius);
    this.ball = new THREE.Mesh(ballGeo, ballMat);
    system.registerMaterial(ballMat);
    
    this.root = new THREE.Vector3(0,this.data.height,0);
    this.axis = new THREE.Vector3(0,-1,0);
    this.rotAxis = new THREE.Vector3(0,0,-1);
    this.quat = new THREE.Quaternion();
    this.length = this.data.height - this.data.radius/2;

    var planeGeo = new THREE.PlaneGeometry( this.data.height,this.data.height );
    const planeMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#ff00ff"),
      wireframe: true,
      side: THREE.DoubleSide
    })
    this.plane = new THREE.Mesh(planeGeo, planeMat);

    this.el.object3D.add(this.ball);
    this.el.object3D.add(this.plane);

    this.force = 2;
    this.curTime = 0;
    this.startingAngle = 0;
    this.curAngle = 0;

    this.raycasterSystem = document.querySelector('a-scene').systems['raycasterSystem'];

    this.el.sceneEl.addEventListener( 'raycast-active-onset', (event) => {
      var t = this.raycasterSystem.intersectObject(this.ball);
      if(t[0]){
        this.lookControls.enabled = false;
        this.raycasting = true;
      }
    }, false );

    this.el.sceneEl.addEventListener( 'raycast-active', (event) => {
      var t = this.raycasterSystem.intersectObject(this.ball);
      var m = this.raycasterSystem.intersectObject(this.plane);

      if(m[0]&&t[0]){
        this.el.object3D.worldToLocal(m[0].point);
        m[0].point.sub(this.root).normalize().multiplyScalar(this.length).add(this.root);
        this.startingAngle = m[0].point.clone().sub(this.root).angleTo(this.axis);
        this.force = 1;
        if(m[0].point.x > 0){
          this.startingAngle *= -1;
        }
        this.curTime = 0;
        this.ball.position.copy(m[0].point);
      }
    }, false );

    this.el.sceneEl.addEventListener( 'raycast-finished', (event) => {
      this.raycasting = false;
      this.lookControls.enabled = true;
    }, false );

    this.system.registerPendulum(this);
  },
  brighten: function (coef)  {
    this.ball.material.uniforms.glow.value = coef;
  },
  tick: function (time, timeDelta) {

    if(this.raycasting) return;

    // this.force *= 0.998;
    this.dampeningFactor = this.startingAngle * this.force;
    this.curAngle = this.dampeningFactor*Math.cos(this.curTime);
    this.quat.setFromAxisAngle(this.rotAxis, this.curAngle);

    var newAxis = this.axis.clone().applyQuaternion(this.quat).multiplyScalar(this.length);
    var newPos = this.root.clone().add(newAxis);
    // this.el.setAttribute('position', newPos);
    if(this.startingAngle < 0 ) {
      this.curTime -= 0.002*timeDelta;
    } else {
      this.curTime += 0.002*timeDelta;
    }
    this.ball.position.copy(newPos);
  }
});
