import AFRAME from 'aframe';
const THREE = AFRAME.THREE;

import LaserFrag from '../shaders/LaserFrag.glsl';
import LaserVert from '../shaders/LaserVert.glsl';

import { setQuaternionFromDirection } from '../libs/Utils';

AFRAME.registerSystem('raycasterSystem', {
  schema: {
  },

  init: function () {
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.triggerDown = false;
    this.mouseDown = false;

    this.tmps = {
      v1: new THREE.Vector3(),
      v2: new THREE.Vector3()
    };

    const controller = document.querySelector('#controller');
    this.controllerObject = controller.object3D;

    var planeGeo = new THREE.PlaneGeometry( 0.05,6 );
    var m1 = new THREE.Matrix4().makeRotationX(Math.PI/2)
    var m2 = new THREE.Matrix4().makeTranslation(0,0,3)
    planeGeo.applyMatrix(m2.multiply(m1))
    var planeMat = new THREE.ShaderMaterial({
      uniforms: {
        sunCentroid: {value: new THREE.Vector3(0,0,0)},
        fadeOutTime: {value: 0},
        fireRingColor2: {value: new THREE.Color("#ffffff")},
        fireRingColor1: {value: new THREE.Color("#ffffff")},
        time: {value: 0},
      },
      side:THREE.DoubleSide,
      transparent: true,
      vertexShader: LaserVert,
      fragmentShader: LaserFrag,
      depthWrite: false,
    });
    this.laserPlane = new THREE.Mesh(planeGeo, planeMat);
    this.sceneEl.object3D.add(this.laserPlane);

    const system = document.querySelector('a-scene').systems['sunSystem'];
    system.registerMaterial(planeMat);

    window.addEventListener( 'mousedown', (event) => {
      this.mouseDown = true;

      this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
      this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
      this.raycaster.setFromCamera( this.mouse, this.sceneEl.camera );
      this.sceneEl.emit('raycast-active-onset');
    }, false );

    window.addEventListener( 'mousemove', (event) => {
      if(!this.mouseDown) return;
      this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
      this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
      this.raycaster.setFromCamera( this.mouse, this.sceneEl.camera );
      this.sceneEl.emit('raycast-active');
    }, false );

    window.addEventListener( 'mouseup', (event) => {
      this.mouseDown = false;

      this.sceneEl.emit('raycast-finished');
    }, false );


    window.addEventListener( 'triggerdown', (event) => {
      this.triggerDown = true;
      var origin = this.tmps.v1.setFromMatrixPosition(this.controllerObject.matrixWorld);
      var forward = this.tmps.v2.set(0,0,-1).transformDirection(this.controllerObject.matrixWorld);
      this.raycaster.set(origin, forward);
      this.sceneEl.emit('raycast-active-onset');
    }, false );

    window.addEventListener( 'triggerup', (event) => {
      this.triggerDown = false;
      this.sceneEl.emit('raycast-finished');
    }, false );
  },

  updateTriggerRay: function() {
    var origin = this.tmps.v1.setFromMatrixPosition(this.controllerObject.matrixWorld);
    var forward = this.tmps.v2.set(0,0,-1).transformDirection(this.controllerObject.matrixWorld);

    setQuaternionFromDirection(forward, new THREE.Vector3(0,1,0), this.laserPlane.quaternion)
    this.laserPlane.position.copy(origin)

    if(!this.triggerDown) return;
    this.raycaster.set(origin, forward);
    this.sceneEl.emit('raycast-active');
  },

  intersectObject: function(obj3d) {
    return this.raycaster.intersectObject(obj3d);
  },

  tick: function (time, timeDelta) {
    console.log(timeDelta)
    this.updateTriggerRay();
  }
});
