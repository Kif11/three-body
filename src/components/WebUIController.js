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
    const creditText = document.getElementById('creditText');
    const mainCamera = document.getElementById('camera');

    sceneEl.addEventListener('loaded', (event) => {
      // all game assets loaded
      introScreen.classList.remove('hidden');
    });

    sceneEl.addEventListener('fade-in-complete', (event) => {
      introText.emit('hide-intro-text');
    });

    startBtnEl.addEventListener('click', event => {
      // sceneEl.enterVR();
      mainScene.setAttribute('visible', 'true');
      introScreen.setAttribute('style', 'visibility: hidden');
      introScreen.setAttribute('visible', 'false');
      enterVRButton.classList.add('visible');

      mainCamera.setAttribute('active', true);

      this.el.emit('begin-game');
      introText.emit('show-intro-text');
    })

    sceneEl.addEventListener('gameLose', event => {
      losingText.emit('show-lose-text');
      this.setFrontOfCamera(losingText);
      document.querySelectorAll('.fire').forEach(el => el.emit('stop-char-fire'));
      window.setTimeout(() => {
        losingText.emit('hide-lose-text');
      }, 28000);
      window.setTimeout(() => {
        this.setFrontOfCamera(creditText);
        creditText.setAttribute('color', 'black');
        creditText.emit('show-credit-text');
      }, 33000);
    })

    sceneEl.addEventListener('gameWin', event => {
      winningText.emit('show-win-text');
      this.setFrontOfCamera(winningText);
      window.setTimeout(() => {
        winningText.emit('hide-win-text');
      }, 28000);
      window.setTimeout(() => {
        this.setFrontOfCamera(creditText);
        creditText.setAttribute('color', 'white');
        creditText.emit('show-credit-text');
      }, 33000);
    })
  },

  setFrontOfCamera: function(entity) {
    const camera = document.querySelector('#camera');
    const left = new THREE.Vector3().set(-1,0,0).transformDirection(camera.object3D.matrixWorld);
    const worldPos = new THREE.Vector3().setFromMatrixPosition(camera.object3D.matrixWorld).add(left.multiplyScalar(4.5));
    worldPos.y = 3;
    const forward = new THREE.Vector3().set(0,0,-1).transformDirection(camera.object3D.matrixWorld);
    forward.y = 0;
    entity.object3D.position.copy(worldPos).add(forward.multiplyScalar(10));
    entity.object3D.lookAt(worldPos);
  }
});
