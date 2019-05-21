import AFRAME from 'aframe';

import JSX from './JSX';
import './style.css';

import './components/Spinner';
import './components/SetGLTFMaterial';
import './components/SetCharacterMaterial';
import './components/DefaultMaterial';
import './components/Sun';
import './components/Sky';
import './components/CharacterMover';
import './components/SpeechController';
import './components/AmbientController';
import './components/VertexCacheTextures';
import './components/FireManager';
import './components/WebUIController';
import './systems/SunSystem';

import CameraRig from './CameraRig';
// <audio id="speech1" src="assets/speech/speech1.mp3" preload="auto"></audio>
// <audio id="speech2" src="assets/speech/followMe.mp3" preload="auto"></audio>
// <audio id="speech3" src="assets/speech/speech3.mp3" preload="auto"></audio>
// <audio id="speech4" src="assets/speech/speech4.mp3" preload="auto"></audio>
//224000 0.02
const App = () => (
  <a-scene
    stats
    background="color: black"
    sunSystem="speed: 0.02; skyRadius: 500; timeOffset:190000; color: #ffe4aa;"
    renderer="
      antialias: true;
      physicallyCorrectLights: true;
      colorManagement: true;
      foveationLevel: 3;
      shadowMapEnabled: true;
    "
    fog="type: exponential; color: #ffe4aa; density: 0.004;"
  >
    {CameraRig()}
    <a-assets>
      {/* Audio */}
      <audio id="speech1" src="assets/speech/speech1.mp3" preload="auto"></audio>
      <audio id="speech2" src="assets/speech/speech2.mp3" preload="auto"></audio>
      <audio id="speech3" src="assets/speech/speech3.mp3" preload="auto"></audio>
      <audio id="speech4" src="assets/speech/speech4.mp3" preload="auto"></audio>
      <audio id="track1" src="assets/ambient/track1.mp3" preload="auto"></audio>
      <audio id="track2" src="assets/ambient/track2.mp3" preload="auto"></audio>
      <audio id="track3" src="assets/ambient/track3.mp3" preload="auto"></audio>

      {/* Environment */}
      <a-asset-item id="mountains" src="assets/mountains/mountains.gltf" />
      <a-asset-item id="cubes" src="assets/cubes/cubes.gltf" />
      <a-asset-item id="ruins" src="assets/ruins/ruins.gltf" />
      <a-asset-item id="arc" src="assets/arc/arc.gltf" />
      <a-asset-item id="cliff" src="assets/cliff/cliff.gltf" />
      <a-asset-item id="dunes" src="assets/dunes/dunes.gltf" />
      <a-asset-item id="moon_rock" src="assets/moon_rock/moon_rock.gltf" />
      <a-asset-item id="dried_body" src="assets/dried_body/dried_body.gltf" />
      <a-asset-item id="pyramid" src="assets/pyramid/pyramid.gltf" />

      {/* Character */}
      <a-asset-item id="mask" src="assets/mask/mask.gltf" />
      <a-asset-item id="char" src="assets/char/char_mesh.fbx" />
      <img id="charDiffuse" src="assets/char/char_diffuse.png"/>
      <a-asset-item id="charPosExr" src="assets/char/char_pos.exr" response-type="arraybuffer"/>
      <a-asset-item id="charNormalExr" src="assets/char/char_norm.exr" response-type="arraybuffer" />
      <a-asset-item id="charParams" src="assets/char/char_minmax.json" response-type="json"/>
    </a-assets>

    <a-entity web-ui-controller />

    <a-entity id="scene1">
      <div id="buttonsContainer">
        <div class="startBtn" id="startBtn">
          enter 3body.net
        </div>
      </div>
    </a-entity>

    <a-entity id="scene2">
      <a-entity
        id="ambientSounds"
        ambient-controller
        sound__1="
          src: #track1;
          volume:0;
          loop: true;
          positional: false;
        "
        sound__2="
          src: #track2;
          volume:0;
          loop: true;
          positional: false;
        "xw
        sound__3="
          src: #track3;
          volume:0;
          loop: true;
          positional: false;
        "
      />

      <a-gltf-model
        id="character"
        src="#mask"
        vertex-cache-textures="
          mode: 'soft';
          fps: 100;
          fbxModel: #char;
          params: #charParams;
          posTex: #charPosExr;
          normalTex: #charNormalExr;
          diffuseTex: #charDiffuse;
          fragmentShader: 'CharacterSoftFrag';
        "
        set-character-material="color: #ffffff;"
        character-mover
        speech-controller
        sound__1="
          src: #speech1;
          volume:0;
          loop: false;
          positional: true;
        "
        sound__2="
          src: #speech2;
          volume:0;
          loop: false;
          positional: true;
        "
        sound__3="
          src: #speech3;
          volume:0;
          loop: false;
          positional: true;
        "
        sound__4="
          src: #speech4;
          volume:0;
          loop: false;
          positional: true;
        "
      />

      {/* <a-sphere color="yellow" radius="0.01" position="0 1 -4"  shadow="cast: true; receive: true" ></a-sphere> */}
      {/* <a-gltf-model src="#mountains" scale="0.5 0.1 0.5" set-gltf-material="color: #e2aa73; receiveShadow: true;" /> */}

      {/* Environment */}

      <a-entity light="type: hemisphere; color: #1c3865; groundColor: #1c3865; intensity: 0.9" />
      <a-entity id="sky" sky />

      <a-entity sun="sunRadius:0.2; pathRadius:0.8; speed:-0.002; offset:0.2" />
      <a-entity sun="sunRadius:0.06; pathRadius:0.8; speed:-0.004; offset:1" />
      <a-entity sun="sunRadius:0.1; pathRadius:0.8; speed:-0.006; offset:2" />

      <a-gltf-model id="ruins" src="#ruins" position="5 0.1 10" set-gltf-material="castShadow: true;" />
      <a-gltf-model id="arc" src="#arc" gltf-model="assets/arc/arc.gltf" position="-12 0.51061 3.8" rotation="0 117 0" scale="0.9 0.9 0.9" set-gltf-material="castShadow: true"></a-gltf-model>
      <a-gltf-model id="dunes" src="#dunes" scale="1 1 1" set-gltf-material="color: #e2aa73; receiveShadow: true;" />
      <a-gltf-model id="dried_body" src="#dried_body" gltf-model="assets/dried_body/dried_body.gltf" scale="0.39461 0.39461 0.39461" position="4.93378 0.05593 -0.47953" rotation="0 19.212420786326764" set-gltf-material="color: #02080e; receiveShadow: true"></a-gltf-model>
      <a-gltf-model id="pyramid" src="#pyramid" gltf-model="assets/pyramid/pyramid.gltf" rotation="0 -85.67151431693634" position="60.74943 -0.13907 52.90357" scale="" set-gltf-material="color: #e2aa73; receiveShadow: true; collideWith: true"></a-gltf-model>

      <a-gltf-model id="cliff1" rotation="0 -139.75185468374448 0" src="#cliff" position="76.8745 -5.17808 -101.02159" scale="1.01696 1.77721 1.6834" set-gltf-material="color: #e2aa73"></a-gltf-model>
      <a-gltf-model id="cliff2" rotation="0 10.34188820211136 0" src="#cliff" position="155.357 -2.5 -35.56886" scale="1.5073 0.96664 2.1263" set-gltf-material="color: #e2aa73"></a-gltf-model>
      <a-gltf-model id="cliff3" rotation="179.9998479605043 62.488496010352975 -179.9998479605043" src="#cliff" position="11.33276 -2.5 -203.52688" scale="0.63449 1.22352 1.05029" set-gltf-material="color: #e2aa73"></a-gltf-model>
      <a-gltf-model id="cliff4" rotation="0 -70 0" src="#cliff" position="-308 -2.5 -212" scale="2.3 1.4 3.4" set-gltf-material="color: #e2aa73"></a-gltf-model>
      <a-gltf-model id="cliff5" rotation="180 -85 179" src="#cliff" position="-71 -2.5 208" scale="1.7 1.3 1.8" set-gltf-material="color: #e2aa73"></a-gltf-model>
      <a-gltf-model id="cliff6" rotation="0 -70 0" src="#cliff" position="87 -1.8 263" scale="2 1.4 3.3" set-gltf-material="color: #e2aa73"></a-gltf-model>
      <a-gltf-model id="cliff7" rotation="0 19.987059725343638 0" src="#cliff" position="-437.62339 -2.5 244" scale="1.94443 1.19725 1.94443" set-gltf-material="color: #e2aa73"></a-gltf-model>
      <a-gltf-model id="cliff8" rotation="0 126.67924963003964" src="#cliff" gltf-model="assets/cliff/cliff.gltf" position="124.97708 -2.5 -342.52154" scale="1.5073 0.96664 2.1263" set-gltf-material="color: #e2aa73"></a-gltf-model>

      <a-gltf-model
        id="moon_rock"
        src="#moon_rock"
        position="-198 -2.5 -340"
        scale="1.2 1.2 1.2"
        set-gltf-material="color: #e2aa73"
      />
    </a-entity>
  </a-scene>
);

     // <a-entity vertex-cache-textures="fbxModel:#fire; posTex:#firePosExr; colorTex:#fireColorExr; params:#fireParams;" fire-manager scale="0 0 0"></a-entity>
     // <a-entity vertex-cache-textures="fbxModel:#cloth; posTex:#clothPosExr; normalTex:#clothNormalExr; diffuseTex:#clothDiffuse; params:#clothParams; mode:'soft';" position="-4.2 0.2 0.2" scale="0.02 0.02 0.02"></a-entity>

document.querySelector('body').appendChild(App());
