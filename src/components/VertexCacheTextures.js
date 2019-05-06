import VertexCacheFrag from '../shaders/VertexCacheFrag.glsl';
import VertexCacheVert from '../shaders/VertexCacheVert.glsl';

THREE.FBXLoader = require('../libs/FBXLoader');

AFRAME.registerComponent('vertex-cache-textures', {
  schema: {
    posTex:    { type: 'asset' },
    colorTex:  { type: 'asset' },
    fbxModel:  { type: 'asset' },
    params:  { type: 'asset' },
    fps:  { type: 'int', default: 30 },
  },

  init: function () {
    this.posTex = null;
    this.colorTex = null;
    this.fbxModel = null;
    this.params = null;
    this.load = this.load.bind(this);
  },

  update: function () {
    const data = this.data;
    if (!data.posTex || !data.colorTex || !data.fbxModel || !data.params) return;

    const fbxLoader = new THREE.FBXLoader();
    fbxLoader.load(data.fbxModel, (response) => this.load(response, 'fbx') );

    const loader = new THREE.FileLoader();
    loader.load(data.posTex, (response) => this.load(response, 'pos') );
    loader.load(data.colorTex, (response) => this.load(response, 'color') );
    loader.load(data.params, (response) => this.load(response, 'params') );

  },

  load: function (response, type) {
    if (type == 'fbx'){
      this.fbxModel = response;
    } else if (type == 'pos') {
      this.posTex = response;
    } else if(type == 'color') {
      this.colorTex = response;
    } else if(type == 'params') {
      this.params = response;
    }
    if (this.posTex && this.colorTex && this.fbxModel && this.params) {
      this.buildModel();
    }
  },

  handleFbxModel: function () {
    const triangleCloud = this.fbxModel.children[0];
    // ANIMATION PARAMETERS
    var material = new THREE.ShaderMaterial({
      uniforms: {
        bbox_max: {value: this.params.bbox_max},
        bbox_min: {value: this.params.bbox_min},
        numFrames: {value: this.params.numframes},
        posTex: {value: 0},
        colorTex: {value: 0},
        timeInFrames: {value: 0}
      },
      vertexShader: VertexCacheVert,
      fragmentShader: VertexCacheFrag,
      side: THREE.DoubleSide,
    });
    this.model = new THREE.Mesh(triangleCloud.geometry, material);
    this.el.setObject3D('mesh', this.model);
  },

  handleEXRTextures: function () {
    let exrPos = new Module.EXRLoader(this.posTex);
    let exrColor = new Module.EXRLoader(this.colorTex);

    // Cache image data to this variables to avoid call
    // to this member functions in the render for loop
    const exrPosBytes = exrPos.getBytes();
    const exrColorBytes = exrColor.getBytes();
    const texWidth = exrPos.width();
    const texHeight = exrPos.height();

    // javascript code must explicitly delete any C++ object handles,
    // to clear the emscripten heap
    exrPos.delete();
    exrColor.delete();

    const posTexture = new THREE.DataTexture( exrPosBytes, texWidth, texHeight, THREE.RGBAFormat, THREE.FloatType );
    posTexture.magFilter = THREE.NearestFilter;
    posTexture.minFilter = THREE.NearestFilter;
    posTexture.wrapT = posTexture.wrapS =THREE.RepeatWrapping;
    posTexture.needsUpdate = true
    this.model.material.uniforms.posTex.value = posTexture;

    const colorTexture = new THREE.DataTexture( exrColorBytes, texWidth, texHeight, THREE.RGBAFormat, THREE.FloatType );
    colorTexture.magFilter = THREE.NearestFilter;
    colorTexture.minFilter = THREE.NearestFilter;
    colorTexture.wrapT = colorTexture.wrapS =THREE.RepeatWrapping;
    colorTexture.needsUpdate = true
    this.model.material.uniforms.colorTex.value = colorTexture;
  },

  buildModel: function () {
    this.handleFbxModel();
    this.handleEXRTextures();
    this.time = 0;
  },

  remove: function () {
    if (this.model) this.el.removeObject3D('mesh');
  },

  tick: function (time, timeDelta) {
    if(!this.model) return;
    var currentFrame = Math.ceil(this.time/this.data.fps);
    if(currentFrame >= this.params.numframes) {
      this.time = 0
    }
    this.model.material.uniforms.timeInFrames.value = currentFrame;
    this.time += timeDelta;
  }
});
