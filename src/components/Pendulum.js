import PendulumMaterial from '../shaders/PendulumMaterial';
import SunCalibratedMaterial from '../shaders/SunCalibratedMaterial';

import PendulumFrag from '../shaders/PendulumFrag.glsl';
import PendulumVert from '../shaders/PendulumVert.glsl';

import AFRAME from 'aframe';
const THREE = AFRAME.THREE;

AFRAME.registerComponent('pendulum', {
  schema: {
    height: {
      type: 'int',
      default: 16.1
    },
    radius: {
      type: 'int',
      default: 1
    },
    color: {
      type: 'color',
      default: null
    },
  },

  init: function () {
    const system = document.querySelector('a-scene').systems['sunSystem'];
    this.material = new SunCalibratedMaterial(system, new THREE.Color(this.data.color));

    const camera = document.querySelector('#camera');
    this.lookControls = camera.getAttribute('look-controls');

    this.el.addEventListener('model-loaded', () => {
      const scene = this.el.getObject3D('mesh');
      this.ball = scene.children[0].children[2]
      this.el.object3D.add(this.ball);

      this.ball.material = new PendulumMaterial(system, new THREE.Color(this.data.color));
      this.ball.geometry.computeVertexNormals();

      this.rope = scene.children[0].children[1];
      this.rope.material = this.material;
      this.rope.geometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0, -18.1, 0 ) );
      this.rope.position.y = 18.1;

      this.stand = scene.children[0].children[0];
      this.stand.material = this.material;
    });

    this.ball = new THREE.Object3D()
    this.ball.material = {};

    this.root = new THREE.Vector3(0,this.data.height,0);
    this.offsetRoot = new THREE.Vector3(0, this.data.height, -7.4);

    this.axis = new THREE.Vector3(0, -1, 0);
    this.rotAxis = new THREE.Vector3(0, 0, -1);
    this.quat = new THREE.Quaternion();
    this.length = this.data.height - this.data.radius/2;

    var planeGeo = new THREE.PlaneGeometry( this.data.height,this.data.height );
    const planeMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#ff00ff"),
      wireframe: true,
      side: THREE.DoubleSide,
      alphaTest: 0,
      visible: false
    })
    this.plane = new THREE.Mesh(planeGeo, planeMat);
    this.plane.position.z = -7.4;
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
        m[0].point.sub(this.offsetRoot).normalize().multiplyScalar(this.length).add(this.offsetRoot);
        this.startingAngle = m[0].point.clone().sub(this.offsetRoot).angleTo(this.axis);
        this.force = 1;
        if(m[0].point.x > 0){
          this.startingAngle *= -1;
        }
        this.curTime = 0;
        m[0].point.z = 0;
        this.ball.position.copy(m[0].point);
        if(this.rope){
          this.quat.setFromAxisAngle(this.rotAxis, this.startingAngle);
          this.rope.quaternion.copy(this.quat);
        }
      }
    }, false );

    this.el.sceneEl.addEventListener( 'raycast-finished', (event) => {
      this.raycasting = false;
      this.lookControls.enabled = true;
    }, false );

    this.system.registerPendulum(this);
  },
  brighten: function (coef)  {
    if(!this.ball.material.shader) return;
    this.ball.material.shader.uniforms.glow.value = coef;
  },
  tick: function (time, timeDelta) {

    if(this.raycasting) return;
    if(!this.ball) return;

    // this.force *= 0.998;
    this.dampeningFactor = this.startingAngle * this.force;
    this.curAngle = this.dampeningFactor*Math.cos(this.curTime);
    this.quat.setFromAxisAngle(this.rotAxis, this.curAngle);

    if(this.rope){
      this.rope.quaternion.copy(this.quat);
    }
    var newAxis = this.axis.clone().applyQuaternion(this.quat).multiplyScalar(this.length);
    var newPos = this.root.clone().add(newAxis);
    if(this.startingAngle < 0 ) {
      this.curTime -= 0.002*timeDelta;
    } else {
      this.curTime += 0.002*timeDelta;
    }
    this.ball.position.copy(newPos);
  }
});
