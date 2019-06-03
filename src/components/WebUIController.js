import AFRAME from 'aframe';

AFRAME.registerComponent('web-ui-controller', {
  init: function () {
    const { sceneEl } = this.el;
    const startBtnEl = document.getElementById('startBtn');
    const mainScene = document.getElementById('mainScene');
    const introScreen = document.getElementById('introScreen');
    const enterVRButton = document.querySelector('.VRButton');
    const introText = document.getElementById('introText');
    const winningText = document.getElementById('winningText');
    const losingText = document.getElementById('losingText');
    sceneEl.addEventListener('loaded', (event) => {
      // all game assets loaded
      introScreen.classList.remove('hidden');
    });

    sceneEl.addEventListener('enter-vr', (event) => {
      introText.emit('show-intro-text');
    });

    sceneEl.addEventListener('fade-in-complete', (event) => {
      introText.emit('hide-intro-text');
    });

    startBtnEl.addEventListener('click', event => {
      sceneEl.enterVR();
      mainScene.setAttribute('visible', 'true');
      introScreen.setAttribute('style', 'visibility: hidden');
      introScreen.setAttribute('visible', 'false');
      enterVRButton.classList.add('visible');
      this.el.emit('begin-game');
    })

    sceneEl.addEventListener('gameLose', event => {
      losingText.emit('show-lose-text');
      //position in front of cam once
      this.setFrontOfCamera(losingText);
    })

    sceneEl.addEventListener('gameWin', event => {
      winningText.emit('show-win-text');
      //position in front of cam once
      this.setFrontOfCamera(winningText);
    })
  },
  setFrontOfCamera: function(entity) {
    const camera = document.querySelector('#camera');
    var left = new THREE.Vector3().set(-1,0,0).transformDirection(camera.object3D.matrixWorld)
    var worldPos = new THREE.Vector3().setFromMatrixPosition(camera.object3D.matrixWorld).add(left.multiplyScalar(4.5));
    worldPos.y = 3;
    var forward = new THREE.Vector3().set(0,0,-1).transformDirection(camera.object3D.matrixWorld)
    forward.y = 0;
    entity.object3D.position.copy(worldPos).add(forward.multiplyScalar(10));
    entity.object3D.lookAt(worldPos);
  }
});
