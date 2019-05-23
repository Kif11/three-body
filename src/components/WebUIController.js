import AFRAME from 'aframe';

AFRAME.registerComponent('web-ui-controller', {
  init: function () {
    const { sceneEl } = this.el;
    const startBtnEl = document.getElementById('startBtn');
    const loseScreen = document.getElementById('loseScreen');
    const mainScene = document.getElementById('mainScene');
    const introScreen = document.getElementById('introScreen');
    const enterVRButton = document.querySelector('.VRButton');

    sceneEl.addEventListener('loaded', (event) => {
      // all game assets loaded
      introScreen.setAttribute('style', 'visibility: visible');
    });

    startBtnEl.addEventListener('click', event => {
      sceneEl.enterVR();
      mainScene.setAttribute('visible', 'true');
      introScreen.setAttribute('style', 'visibility: hidden');
      enterVRButton.classList.add('visible');
      this.el.emit('begin-game');
    })

    sceneEl.addEventListener('lose', event => {
      sceneEl.exitVR();
      loseScreen.setAttribute('style', 'visibility: visible');
      mainScene.setAttribute('visible', 'false');
      enterVRButton.classList.remove('visible');
    })
  }
});
