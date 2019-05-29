import SunCalibratedMaterial from '../shaders/SunCalibratedMaterial';


import AFRAME from 'aframe';
const THREE = AFRAME.THREE;

AFRAME.registerComponent('pendulum', {
  schema: {
  },

  init: function () {
    const system = document.querySelector('a-scene').systems['sunSystem'];

    const camera = document.querySelector('#camera');
    this.lookControls = camera.getAttribute('look-controls');

    const ballMat = new SunCalibratedMaterial(system, new THREE.Color('#c1c1c1'));

    var ballGeo = new THREE.SphereGeometry( 0.5 );
    this.ball = new THREE.Mesh(ballGeo, ballMat);
    this.ball.position.set(3,3,-1)

    this.root = new THREE.Vector3(0,6,0);
    this.axis = new THREE.Vector3(0,-1,0);
    this.rotAxis = new THREE.Vector3(0,0,-1);
    this.quat = new THREE.Quaternion();
    this.length = 5;

    var planeGeo = new THREE.PlaneGeometry( 6,6 );
    const planeMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#ff00ff"),
      wireframe: true,
    })
    this.plane = new THREE.Mesh(planeGeo, planeMat);


    this.el.object3D.add(this.ball);
    this.el.object3D.add(this.plane);

    this.force = 2;
    this.curTime = 0;
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
        m[0].point.sub(this.root).normalize().multiplyScalar(this.length).add(this.root);
        this.curAngle = m[0].point.clone().sub(this.root).angleTo(this.axis);
        this.force = 1;
        if(m[0].point.x > 0){
          this.curAngle *= -1;
        }
        this.curTime = 0;
        this.ball.position.copy(m[0].point);
      }
    }, false );

    this.el.sceneEl.addEventListener( 'raycast-finished', (event) => {
      this.raycasting = false;
      this.lookControls.enabled = true;
    }, false );
  },
  tick: function (time, timeDelta) {

    if(this.raycasting) return;

    this.force *= 0.998;
    this.quat.setFromAxisAngle(this.rotAxis, this.curAngle*this.force*Math.cos(this.curTime));
    var newAxis = this.axis.clone().applyQuaternion(this.quat).multiplyScalar(this.length);
    var newPos = this.root.clone().add(newAxis);
    // this.el.setAttribute('position', newPos);
    if(this.curAngle < 0 ) {
      this.curTime -= 0.002*timeDelta;
    } else {
      this.curTime += 0.002*timeDelta;
    }
    this.ball.position.copy(newPos);
  }
});
