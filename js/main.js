
let scene, renderer, camera, mesh, mesh2;
let hasLoaded = false;
let mixer1, mixer2, clock, cameraAnimation;
const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;
function getQueryStringValue(key) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(key);
}
const pmx = getQueryStringValue('pmx');
const vmdpath = getQueryStringValue('vmd') || "bts-bestofme";
const pmx2 = getQueryStringValue('pmx2') || "AoiZaizen/AoiZaizen.pmx";
const cameraId = getQueryStringValue('camera');
const stage = getQueryStringValue('stage') || "/sorclair/sorclair.pmx";
let Pmx;
let Pmx2;

//define new camposition globally
let xyzglobal = [];
let positionXYZ = localStorage.getItem('xyz') || "0, 0, 0";
if (positionXYZ) {xyzglobal = positionXYZ.split(',').map(parseFloat);}



if (pmx) {
  Pmx = `./pmx/pronama/${pmx.trim()}`;
  console.log(`PMX: ${pmx.trim()}`);
} else {
  console.log("No PMX selected.");
}
if (pmx2) {
  Pmx2 = `./pmx/pronama/${pmx2.trim()}`;
  console.log(`PMX2: ${pmx2.trim()}`);
} else {
  console.log("No PMX2 selected.");
}
let StagePath = stage ? `./stages/${stage.trim()}` : './stages/sorclair/sorclair.pmx';
if (pmx) {
  Pmx = `./pmx/pronama/${pmx.trim()}`;console.log(`PMX: ${pmx.trim()}`);} else {console.log("No PMX selected.");}
  if (pmx2) {Pmx2 = `./pmx/pronama/${pmx2.trim()}`;console.log(`PMX2: ${pmx2.trim()}`);} else {console.log("No PMX2 selected.");}
  if (StagePath) {StagePath = `./stages${stage.trim()}`;} else {StagePath = './stages/sorclair/sorclair.pmx';}
  console.log('StagePath:', StagePath);
  if (StagePath) {
  const loader = new THREE.MMDLoader();
  const lastIndex = StagePath.lastIndexOf("/");
  const basePath = StagePath.substring(0, lastIndex);
  const vmd1Path = `${basePath}/001.vmd`;
  const vmd2Path = `${basePath}/002.vmd`;
  loader.load(StagePath, (stageObject) => {
    var ambientLight = new THREE.AmbientLight(0xffffff, 1.0); //hardcoded
    scene.add(ambientLight);
    scene.add(stageObject);

//set stage pos.
let positionXYZ = localStorage.getItem('xyz') || "0, 0, 0";
let xyzArray = [];
if (positionXYZ) {xyzArray = positionXYZ.split(',').map(parseFloat);}
let x, y, z;
if (xyzArray.length === 3 && xyzArray.every(coord => !isNaN(coord))) {[x, y, z] = xyzArray.map((coord, index) => coord + (index === 0 ? -0 : -0));}
x = -x; //flip x because we move over 0coordinate
//y = 0;  //y must always be 0 so we do not fall under the stage
z= -z; //flip x because we move over 0coordinate
stageObject.position.set(x, y, z);

    const mixer = new THREE.AnimationMixer(stageObject);
    loader.loadAnimation(vmd1Path, stageObject, (vmd1Clip) => {
      vmd1Clip.name = "001";
      console.log(`Loaded VMD: ${vmd1Path}`);
      const motionObject1 = MotionObjects.find(obj => obj.id === "001");
      if (motionObject1) {
        motionObject1.VmdClip = vmd1Clip;
        const action1 = mixer.clipAction(vmd1Clip);
        action1.play();
      } else {
        console.warn(`Motion object with id "001" not found.`);
      }
    }, onProgress, onError);
    loader.loadAnimation(vmd2Path, stageObject, (vmd2Clip) => {
      vmd2Clip.name = "002";
      console.log(`Loaded VMD: ${vmd2Path}`);
      const motionObject2 = MotionObjects.find(obj => obj.id === "002");
      if (motionObject2) {
        motionObject2.VmdClip = vmd2Clip;
        const action2 = mixer.clipAction(vmd2Clip);
        action2.play();
      } else {
        console.warn(`Motion object with id "002" not found.`);
      }
    }, onProgress, onError);
    const clock = new THREE.Clock();
    const animate = () => {
      requestAnimationFrame(animate);
      const delta = clock.getDelta();
      mixer.update(delta);
      renderer.render(scene, camera);
    };
    animate();
  }, onProgress, onError);
} else {console.warn('No valid stage path found.');}
//if (!Stage) {Stage = stage ? `stages${stage}` : '/sorclair/sorclair.pmx';}
if (!Pmx) {Pmx = `./pmx/pronama/AoiZaizen/AoiZaizen.pmx`;}
console.log('StagePath:', StagePath);
const MotionObjects = [
  { id: "001", pose: "001", VmdClip: null, AudioClip: false },
  { id: "002", pose: "002", VmdClip: null, AudioClip: false },
];
window.onload = () => {
  Init();
  LoadStage().then(() => {
    LoadModels().then(() => {
    });
  });
};
function Init() {
  document.getElementById("moveLeftButton").addEventListener("click", () => { camera.position.x -= 1; });
  document.getElementById("moveRightButton").addEventListener("click", () => { camera.position.x += 1; });
  document.getElementById("moveUpButton").addEventListener("click", () => { camera.position.y += 1; });
  document.getElementById("moveDownButton").addEventListener("click", () => { camera.position.y -= 1; });
  document.getElementById("rotaterightButton").addEventListener("click", () => { mesh.rotateY(Math.PI / 4); });
  document.getElementById("rotateleftButton").addEventListener("click", () => { mesh.rotateY(-Math.PI / 4); });
  const storedValue = localStorage.getItem('xyz');
const displayDiv = document.getElementById('xyzvalue');
displayDiv.innerHTML = "<b>&nbsp;XYZ</b>" + storedValue;
  scene = new THREE.Scene();
  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  camera = new THREE.PerspectiveCamera(100, windowWidth / windowHeight, 1, 1000);
// Initialize camera position
//let positionXYZ = localStorage.getItem('xyz');
//let xyzArray = [];
//if (positionXYZ) {xyzArray = positionXYZ.split(',').map(parseFloat);}
//if (xyzArray.length === 3) {
//const [x, y, z] = xyzArray;
//camera.position.set(x, y, z);} else {
//camera.position.set(0, 19, 20);
//}
let positionXYZ = localStorage.getItem('xyz');
let xyzArray = [];
if (positionXYZ) {xyzArray = positionXYZ.split(',').map(parseFloat);}
let x, y, z;
if (xyzArray.length === 3 && xyzArray.every(coord => !isNaN(coord))) {[x, y, z] = xyzArray.map((coord, index) => coord + (index === 0 ? 15 : 15)); // Add 15 to x and y
} else {
x = 0;y = 19;z = 20;}
camera.position.set(x, y, z);
  clock = new THREE.Clock();
}



function LoadStage() {
  return new Promise((resolve, reject) => {
    const loader = new THREE.MMDLoader();
    loader.load(StagePath, (stageObject) => {
      resolve();
    }, onProgress, reject);
  });
}
let animate;
function startAnimation() {
   document.getElementById('readystate').innerHTML = 'Camera(localstorage): ready - ' + localStorage.getItem('vmd') + ' <a href="javascript:location.reload(true)">Reload</a>';
  if (!animate) {
    console.error('Animation function not initialized.');
    return;
  }
  animate(); // Start the animation loop
}
document.getElementById('play').addEventListener('click', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const vmdValue = urlParams.get('vmd') || "bts-bestofme";
    if (!vmdValue) {
        console.log('No vmd parameter found in the URL');
        return false;}
    console.log('vmdValue from URL:', vmdValue);
    const audioPath = `audio/${vmdValue}.mp3`;
    const audioListener = new THREE.AudioListener();
    const audio = new THREE.Audio(audioListener);
    const audioLoader = new THREE.AudioLoader();
    try {
        const audioBuffer = await new Promise((resolve, reject) => {
            audioLoader.load(audioPath, resolve, onAudioLoadProgress, reject);
        });
        const loopDuration = parseFloat(localStorage.getItem('vmdplay'));
        audio.setBuffer(audioBuffer);
        audio.setLoop(true); // Set to true if audio should loop
        audio.setVolume(1.0); // Adjust volume as needed
        audio.play();
        console.log('Audio loaded and playing:', audioPath);
    } catch (error) {
        console.error('Error loading audio:', error);
        document.getElementById('readystate').textContent = "Error loading Audio";

        return false;
    }
    function onAudioLoadProgress(xhr) {
        if (xhr.lengthComputable) {
            const percentComplete = (xhr.loaded / xhr.total) * 100;
            console.log('Audio load progress:', percentComplete.toFixed(2) + '%');}}
  try {
    startAnimation();
  } catch (error) {
    console.error('Error loading models:', error);}});
async function LoadModels() {
  const loader = new THREE.MMDLoader();

  function LoadPMX(path) {
    return new Promise((resolve, reject) => {
      loader.load(path, (object) => {
        resolve(object);
      }, onProgress, reject); // Reject the promise if there's an error
    });
  }
  async function LoadVMDAnimation(mesh, id) {
    function getQueryStringParameter(name) {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get(name);
    }

    const vmdId = getQueryStringParameter('vmd') || 'bts-bestofme';
    const vmdPaths = [
      `./vmd/${vmdId}.vmd`,
      `./vmd/${vmdId}_lips.vmd`,
      `./vmd/${vmdId}_facials.vmd`
    ];
    
    localStorage.setItem('vmd', vmdId);

    async function fileExists(url) {
      try {
        const response = await fetch(url, { method: 'HEAD' });
        return response.ok;
      } catch {
        return false;
      }
    }

    const animations = [];
    for (const path of vmdPaths) {
      if (await fileExists(path)) {
        const vmdClip = await new Promise((resolve, reject) => {
          loader.loadAnimation(path, mesh, (clip) => {
            clip.name = path;
            resolve(clip);
          }, onProgress, reject);
        });
        animations.push(vmdClip);
        if (path.includes('_lips') || path.includes('_facials')) {
          console.log(`Loaded additional VMD: ${path}`);
        }
      } else {
        console.log(`File not found: ${path}`);
      }
    }

    if (animations.length > 0) {
      const mainAnimation = animations.find(clip => !clip.name.includes('_lips') && !clip.name.includes('_facials'));
      if (mainAnimation) {
        const vmdPlayTime = mainAnimation.duration.toFixed(2); // Get the VMD animation duration
        localStorage.setItem('vmdplay', vmdPlayTime); // Save the VMD play time to localStorage
        const vmdPlayDiv = document.getElementById('vmdplay');
        vmdPlayDiv.innerHTML = `<b>VMD Playtime:</b> ${vmdPlayTime} seconds`; // Output the duration to the "vmdplay" div
      }
      return animations;
    } else {
      console.log('No VMD files loaded.');
      return [];
    }
  }






async function LoadCameraAnimation(camera) {
  let camid;
  if (new URLSearchParams(window.location.search).has('camera')) {
    camid = new URLSearchParams(window.location.search).get('camera');
  } else if (new URLSearchParams(window.location.search).has('vmd')) {
    camid = new URLSearchParams(window.location.search).get('vmd');
  } else {
    camid = localStorage.getItem('camid');
    if (!camid) {
      camid = 'bts-bestofme';
    }
  }
  const cameraVmdPath = "./camera/" + camid + ".vmd";
  try {
      

let positionXYZ = localStorage.getItem('xyz');
let xyzArray = [];
if (positionXYZ) {xyzArray = positionXYZ.split(',').map(parseFloat);}
let x, y, z;
if (xyzArray.length === 3 && xyzArray.every(coord => !isNaN(coord))) {[x, y, z] = xyzArray.map((coord, index) => coord + (index === 0 ? 15 : 15));}
//camera.position.set(x, y, z);

const vmdClip = await new Promise((resolve, reject) => {
loader.loadAnimation(cameraVmdPath, camera, (vmdClip) => {
vmdClip.name = camid;
resolve(vmdClip);}, onProgress, reject);});
return vmdClip;} catch (error) {console.error('Error loading camera animation:', error);
throw error;
}}





async function LoadModel1() {
  let positionXYZ = localStorage.getItem('xyz')|| "0, 0, 0";
  let position = new THREE.Vector3(0, 0, 0);
  if (positionXYZ) {
    const xyzArray = positionXYZ.split(',').map(parseFloat);
    if (xyzArray.length === 3) {
      const [x, y, z] = xyzArray;
      //camera.position.set(x, y, z);
      //position.set(x, y, z);
    } else {console.error('Stored xyz coordinates in localStorage are not in the expected format.');}
  } else {
    console.error('No xyz coordinates found in localStorage.');}
  const mesh = await LoadPMX(Pmx);
  mesh.position.copy(position);
  scene.add(mesh);
  const vmdClip = await LoadVMDAnimation(mesh, "001");
  const helper = new THREE.MMDAnimationHelper({ afterglow: 1.0 });
  const mmd = { mesh: mesh, animation: vmdClip };
  helper.add(mmd.mesh, {
    animation: mmd.animation,
    physics: true
  });
  return { mesh: mesh, helper: helper };
}

async function LoadModel2() {
  try {
    if (!Pmx2) {
      throw new Error('Pmx2 is not defined.');}
    let positionXYZ = localStorage.getItem('xyz')|| "0, 0, 0";
    let position = new THREE.Vector3(0, 0, 0);
    if (positionXYZ) {
      const xyzArray = positionXYZ.split(',').map(parseFloat);
      if (xyzArray.length === 3) {
        const [x, y, z] = xyzArray;
        position.set(x, y, z);
      } else {
        throw new Error('Stored xyz coordinates in localStorage are not in the expected format.');
      }
    } else {
      throw new Error('No xyz coordinates found in localStorage.');
    }
    const mesh2 = await LoadPMX(Pmx2);
    //mesh2.position.copy(position);
    mesh2.position.x += 15;
    scene.add(mesh2);
    const vmdClip = await LoadVMDAnimation(mesh2, "002");
    const helper = new THREE.MMDAnimationHelper({ afterglow: 1.0 });
    helper.add(mesh2, {
      animation: vmdClip,
      physics: true
    });
    return { mesh: mesh2, helper };
  } catch (error) {
    console.error('Error loading model 2:', error);
    return null;
  }
}
  const { mesh: mesh1, helper: helper1 } = await LoadModel1();
  const { mesh: mesh2, helper: helper2 } = await LoadModel2();
const fov = 45; // Define the field of view
const aspect = window.innerWidth / window.innerHeight; // Define the aspect ratio
const near = 1; // Define the near clipping plane
const far = 1000; // Define the far clipping plane
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  const cameraVmdClip = await LoadCameraAnimation(camera);
  const cameraHelper = new THREE.MMDAnimationHelper();
  cameraHelper.add(camera, {
    animation: cameraVmdClip
  });
  const clock = new THREE.Clock();
  animate = () => {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    helper1.update(delta);
    if (helper2) helper2.update(delta);
    cameraHelper.update(delta); // Update camera animation
    renderer.render(scene, camera);
  };
}
function onProgress(xhr) {
  if (xhr.lengthComputable) {
    const percentComplete = xhr.loaded / xhr.total * 100;
    console.log(Math.round(percentComplete) + '% downloaded');
document.getElementById('readystate').innerHTML = Math.round(percentComplete) + '% downloaded (if stuck, click <a href="audio" target="_blank">here</a>) ' + 'Camera: ready -  ' + localStorage.getItem('camid');
  }
}
function onError(xhr) {
  console.error("Error loading resource:", xhr);
document.getElementById('readystate').textContent = "Error loading resource: " + xhr.statusText;

}
    fullscreenButton.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        //document.body.requestFullscreen();
        renderer.domElement.requestFullscreen();
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    });




