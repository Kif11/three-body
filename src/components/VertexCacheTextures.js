import VertexCacheSoftFrag from '../shaders/VertexCacheSoftFrag.glsl';
import VertexCacheSoftVert from '../shaders/VertexCacheSoftVert.glsl';
import VertexCacheFluidFrag from '../shaders/VertexCacheFluidFrag.glsl';
import VertexCacheFluidVert from '../shaders/VertexCacheFluidVert.glsl';
import CharacterSoftFrag from '../shaders/CharacterSoftFrag.glsl';

THREE.FBXLoader = require('../libs/FBXLoader');

AFRAME.registerComponent('vertex-cache-textures', {
  schema: {
    posTex:    { type: 'asset' },
    colorTex:  { type: 'asset', default: 'none' },
    normalTex:  { type: 'asset', default: 'none' },
    diffuseTex:  { type: 'asset', default: 'none' },
    fbxModel:  { type: 'asset' },
    params:  { type: 'asset' },
    fps:  { type: 'int', default: 30 },
    mode:  { type: 'string', default: 'fluid' },
    fragmentShader: {type: 'string'}
  },

  init: function () {
    this.posTex = null;
    this.colorTex = null;
    this.normalTex = null;
    this.diffuseTex = null;
    this.fbxModel = null;
    this.params = null;
    this.load = this.load.bind(this);
    this.animating = true;
    this.el.addEventListener('start-vertex-animation', (evt) => {
      this.animating = true;
    });
  },

  update: function () {
    const data = this.data;
    if (!data.posTex || !data.colorTex || !data.colorTex || !data.fbxModel || !data.params || !data.diffuseTex ) return;

    const fbxLoader = new THREE.FBXLoader();
    fbxLoader.load(data.fbxModel, (response) => this.load(response, 'fbx') );

    const loader = new THREE.FileLoader();
    loader.load(data.posTex, (response) => this.load(response, 'pos') );
    if(data.colorTex !== 'none'){
      loader.load(data.colorTex, (response) => this.load(response, 'color') );
    } else {
      this.colorTex = 'none';
    }
    if(data.normalTex !== 'none'){
      loader.load(data.normalTex, (response) => this.load(response, 'normals') );
    } else {
      this.normalTex = 'none';
    }
    loader.load(data.params, (response) => this.load(response, 'params') );

  },

  load: function (response, type) {
    if (type == 'fbx'){
      this.fbxModel = response;
    } else if (type == 'pos') {
      this.posTex = response;
    } else if(type == 'color') {
      this.colorTex = response;
    } else if(type == 'normals') {
      this.normalTex = response;
    }else if(type == 'params') {
      this.params = response;
    }
    if (this.posTex && this.colorTex && this.normalTex && this.fbxModel && this.params) {
      this.buildModel();
    }
  },

  handleFbxModel: function () {
    const triangleCloud = this.fbxModel.children[0];

    if(this.data.diffuseTex !== 'none'){
      this.diffuseTex = new THREE.TextureLoader().load(this.data.diffuseTex.src, (tex) => {
        this.model.material.uniforms.diffuseTex.value = tex;
      });
    }

    var uniforms = ({
      bbox_max: {value: this.params.bbox_max},
      bbox_min: {value: this.params.bbox_min},
      numFrames: {value: this.params.numframes},
      posTex: {value: 0},
      colorTex: {value: 0},
      normalTex: {value: 0},
      diffuseTex: {value: this.diffuseTex},
      timeInFrames: {value: 0},
      time: {value: 0}
    });
    var phongShader = THREE.ShaderLib.phong;
    var mUniforms = THREE.UniformsUtils.merge([phongShader.uniforms, uniforms]);

    var fragmentShader;
    if (this.data.fragmentShader) {
      fragmentShader = CharacterSoftFrag;
    } else {
      fragmentShader = (this.data.mode === 'fluid') ? VertexCacheFluidFrag: VertexCacheSoftFrag;
    }
    // ANIMATION PARAMETERS
    var material = new THREE.ShaderMaterial({
      uniforms: mUniforms,
      vertexShader: (this.data.mode === 'fluid') ? VertexCacheFluidVert: VertexCacheSoftVert,
      fragmentShader: fragmentShader,
      side: THREE.DoubleSide,
      lights: true,
      extensions: {
      	derivatives: true, // set to use derivatives
      }
    });
    this.model = new THREE.Mesh(triangleCloud.geometry, material);
    this.model.scale.set(0.01, 0.01, 0.01); //houdini tool scales mesh up by 100
    this.model.frustumCulled = false;
    this.model.castShadow = true;

    this.el.setObject3D('vertex-cache', this.model);
  },

  handleEXRTextures: function () {
    let exrPos = new Module.EXRLoader(this.posTex);
    let exrColor = new Module.EXRLoader(this.colorTex);
    let exrNormal = new Module.EXRLoader(this.normalTex);

    // Cache image data to this variables to avoid call
    // to this member functions in the render for loop
    const exrPosBytes = exrPos.getBytes();
    const exrColorBytes = exrColor.getBytes();
    const exrNormalBytes = exrNormal.getBytes();
    const texWidth = exrPos.width();
    const texHeight = exrPos.height();

    // javascript code must explicitly delete any C++ object handles,
    // to clear the emscripten heap
    exrPos.delete();
    exrColor.delete();
    exrNormal.delete();

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

    const normalTexture = new THREE.DataTexture( exrNormalBytes, texWidth, texHeight, THREE.RGBAFormat, THREE.FloatType );
    normalTexture.magFilter = THREE.NearestFilter;
    normalTexture.minFilter = THREE.NearestFilter;
    normalTexture.wrapT = normalTexture.wrapS =THREE.RepeatWrapping;
    normalTexture.needsUpdate = true
    this.model.material.uniforms.normalTex.value = normalTexture;
  },

  buildModel: function () {
    this.handleFbxModel();
    this.handleEXRTextures();
    this.time = 0;
    this.el.emit('vertex-cache-loaded');
  },

  remove: function () {
    if (this.model) this.el.removeObject3D('vertex-cache');
  },

  tick: function (time, timeDelta) {
    if(!this.model) return;
    if(!this.animating) return;
    var currentFrame = Math.ceil(this.time/this.data.fps);
    if(currentFrame >= this.params.numframes) {
      this.time = 0
    }
    this.model.material.uniforms.timeInFrames.value = currentFrame;
    this.model.material.uniforms.time.value = time/1000;
    this.time += timeDelta;
  }
});
