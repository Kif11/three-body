import AFRAME from 'aframe';

AFRAME.registerComponent('web-ui-controller', {
  init: function () {
    const { sceneEl } = this.el;
    const startBtnEl = document.getElementById('startBtn');
    const loseScreen = document.getElementById('loseScene');
    const mainScene = document.getElementById('mainScene');
    const introScreen = document.getElementById('introScreen');
    const enterVRButton = document.querySelector('.VRButton');

    sceneEl.addEventListener('loaded', (event) => {
      // all game assets loaded
      introScreen.setAttribute('style', 'visibility: visible');
    });

    startBtnEl.addEventListener('click', event => {
      mainScene.setAttribute('visible', 'true');
      introScreen.setAttribute('style', 'visibility: hidden');

      enterVRButton.classList.add('visible');

      sceneEl.enterVR();
      this.el.emit('begin-game');
    })

    sceneEl.addEventListener('lose', event => {
      loseScreen.setAttribute('style', 'visibility: visible');
      mainScene.setAttribute('visible', 'false');
      loseScreen.style.display = 'flex';
    })
  }
});
