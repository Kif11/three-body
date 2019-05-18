import AFRAME from 'aframe';

AFRAME.registerComponent('web-ui-controller', {
  init: function () {
    const startBtnEl = document.getElementById('buttonsContainer');
    document.getElementById('scene2').setAttribute('visible', 'false')
    startBtnEl.addEventListener('click', event => {
      document.getElementById('scene2').setAttribute('visible', 'true')
      startBtnEl.style.display = 'none';
      this.el.emit('begin-game');
    })
  }
});
