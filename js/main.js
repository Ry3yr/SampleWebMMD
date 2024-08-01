
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
try {
    scene.add(ambientLight);
} catch (error) {
    console.error("Failed to add ambient light. Reloading the page.", error);
    window.location.reload();
}
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
document.getElementById("play").disabled = true;
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
        console.log('Audio loaded and playing:', audioPath);} catch (error) {
        console.error('Error loading audio:', error);
        document.getElementById('readystate').textContent = "Error loading Audio";
        return false;}
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
      }, onProgress, reject); });}






async function LoadVMDAnimation(mesh, isMesh2 = false) {
  function getQueryStringParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);}
  const vmdId = getQueryStringParameter('vmd') || 'bts-bestofme';
  const vmdId2 = getQueryStringParameter('vmd2') || vmdId;
  const vmdPaths = isMesh2 ? [
    `./vmd/${vmdId2}.vmd`,
    `./vmd/${vmdId2}_lips.vmd`,
    `./vmd/${vmdId2}_facials.vmd`
  ] : [
    `./vmd/${vmdId}.vmd`,
    `./vmd/${vmdId}_lips.vmd`,
    `./vmd/${vmdId}_facials.vmd`
  ];
  localStorage.setItem('vmd', isMesh2 ? vmdId2 : vmdId);
async function fileExists(url) {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        resolve(xhr.status === 200);
      }
    };
    xhr.onerror = () => resolve(false);
    xhr.send();
  });
}
  // Check if 'extraz' is set to 'yes' and adjust paths accordingly
  const checkExtraz = localStorage.getItem('extraz') === 'yes';
  const pathsToCheck = [vmdPaths[0]]; // Always check the base VMD file
  if (checkExtraz) {
    pathsToCheck.push(vmdPaths[1], vmdPaths[2]);}
  const animations = [];
  for (const path of pathsToCheck) {
    if (await fileExists(path)) {
      const vmdClip = await new Promise((resolve, reject) => {
        loader.loadAnimation(path, mesh, (clip) => {
          clip.name = path;
          resolve(clip);
        }, onProgress, reject);});
      animations.push(vmdClip);
      if (path.includes('_lips') || path.includes('_facials')) {
        console.log(`Loaded additional VMD: ${path}`);}
    } else {
      console.log(`File not found: ${path}`);}}
  if (animations.length > 0) {
    const mainAnimation = animations.find(clip => !clip.name.includes('_lips') && !clip.name.includes('_facials'));
    if (mainAnimation) {
      //const vmdPlayTime = mainAnimation.duration.toFixed(2); // Get the VMD animation duration
      //const vmdPlayTime = `${String(Math.floor(mainAnimation.duration / 60)).padStart(2, '0')}:${String(Math.floor(mainAnimation.duration % 60)).padStart(2, '0')}.${(mainAnimation.duration % 1).toFixed(2).substring(2)}`;
      const vmdPlayTime = `${String(Math.floor(mainAnimation.duration / 60)).padStart(2, '0')}:${String(Math.floor(mainAnimation.duration % 60))}`;
      localStorage.setItem('vmdplay', vmdPlayTime); // Save the VMD play time to localStorage
      const vmdPlayDiv = document.getElementById('vmdplay');
      if (vmdPlayDiv) {
        //vmdPlayDiv.innerHTML = `<b>VMD Playtime:</b> ${vmdPlayTime} seconds`;}}
        vmdPlayDiv.innerHTML = `${vmdPlayTime}`;}}
    return animations;
  } else {console.log('No VMD files loaded.');
    const readystateDiv = document.getElementById('readystate');
    if (readystateDiv) {
      readystateDiv.textContent = 'MotionError: No valid VMD files found.';}
    return [];}}




async function LoadModel1() {
  let positionXYZ = localStorage.getItem('xyz') || "0, 0, 0";
  let position = new THREE.Vector3(0, 0, 0);
  if (positionXYZ) {
    const xyzArray = positionXYZ.split(',').map(parseFloat);
    if (xyzArray.length === 3) {
      const [x, y, z] = xyzArray;
      //camera.position.set(x, y, z);
      //position.set(x, y, z);
    } else {console.error('Stored xyz coordinates in localStorage are not in the expected format.');}
    } else {console.error('No xyz coordinates found in localStorage.');}
  const mesh = await LoadPMX(Pmx);
  mesh.position.copy(position);
  scene.add(mesh);
 //Get PMX Height
  const urlParams = new URLSearchParams(window.location.search);
  const pmx1 = urlParams.get('pmx') || "AoiZaizen/AoiZaizen.pmx";
  const boundingBox = new THREE.Box3().setFromObject(mesh);
  //const height = boundingBox.max.y - boundingBox.min.y;
  const height = ((boundingBox.max.y - boundingBox.min.y) / 12.97132464115047).toFixed(2); // Convert and round height directly
  const pmxHeight = `${pmx1.trim()}:${height} cm`;
  localStorage.setItem('pmxheight', pmxHeight);
  const vmdClip = await LoadVMDAnimation(mesh, false); // Pass false for mesh
  const helper = new THREE.MMDAnimationHelper({ afterglow: 1.0 });
  const mmd = { mesh: mesh, animation: vmdClip };
  helper.add(mmd.mesh, {
    animation: mmd.animation,
    physics: true
  });
  return { mesh: mesh, helper: helper };}
async function LoadModel2() {
  try {if (!Pmx2) {
    throw new Error('Pmx2 is not defined.');}
    let positionXYZ = localStorage.getItem('xyz') || "0, 0, 0";
    let position = new THREE.Vector3(0, 0, 0);
    if (positionXYZ) {
      const xyzArray = positionXYZ.split(',').map(parseFloat);
      if (xyzArray.length === 3) {
        const [x, y, z] = xyzArray;
        position.set(x, y, z);
      } else {throw new Error('Stored xyz coordinates in localStorage are not in the expected format.');}
      } else {throw new Error('No xyz coordinates found in localStorage.');}
    const mesh2 = await LoadPMX(Pmx2);
    //mesh2.position.copy(position);
    //mesh2.position.x += 15;
    //!new URLSearchParams(window.location.search).has('vmd2') && (mesh2.position.x += 15);
    mesh2.position.x = parseInt(new URLSearchParams(window.location.search).get('distance')) || (new URLSearchParams(window.location.search).has('vmd2') ? 0 : 15);
    scene.add(mesh2);
    // Get PMX2 Height
    const boundingBox2 = new THREE.Box3().setFromObject(mesh2);
    //const height2 = boundingBox2.max.y - boundingBox2.min.y;
    const height2 = ((boundingBox2.max.y - boundingBox2.min.y) / 12.97132464115047).toFixed(2); // Convert and round height directly
    const pmx2 = new URLSearchParams(window.location.search).get('pmx2') || "AoiZaizen/AoiZaizen.pmx";
    const pmxHeight2 = `${pmx2.trim()}:${height2} cm`;
    let pmxHeight = localStorage.getItem('pmxheight') || "";
    pmxHeight += pmxHeight ? `;${pmxHeight2}` : pmxHeight2;
    localStorage.setItem('pmxheight', pmxHeight);
    const vmdClip = await LoadVMDAnimation(mesh2, true); // Pass true for mesh2
    const helper = new THREE.MMDAnimationHelper({ afterglow: 1.0 });
    helper.add(mesh2, {
      animation: vmdClip,
      physics: true
    });
    document.getElementById('error') && (document.getElementById('error').innerHTML = ""); //empty error div after loading has finished
    return { mesh: mesh2, helper };
  } catch (error) {
    console.error('Error loading model 2:', error);
    return null;}}




async function LoadCameraAnimation(camera) {
  let camid;
  if (new URLSearchParams(window.location.search).has('camera')) {
    camid = new URLSearchParams(window.location.search).get('camera');
  } else if (new URLSearchParams(window.location.search).has('vmd')) {
    camid = new URLSearchParams(window.location.search).get('vmd');
  } else {
    camid = localStorage.getItem('camid');
    if (!camid) {
      camid = 'bts-bestofme';}}
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
throw error;}}
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

let startTime = Date.now();
let isAnimating = true; // Flag to control the animation

const parseTime = (timeString) => {
  const [minutes, seconds] = timeString.split(':').map(Number);
  return (minutes * 60) + seconds;
};

const getTargetPlaytime = () => {
  const vmdplayDiv = document.getElementById('vmdplay');
  if (vmdplayDiv) {
    const playtimeText = vmdplayDiv.textContent.trim();
    return parseTime(playtimeText);
  }
  return 0; // Default if the div is not found or contains invalid text
};

  animate = () => {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    helper1.update(delta);
    if (helper2) helper2.update(delta);
    cameraHelper.update(delta); // Update camera animation
    renderer.render(scene, camera)

  const elapsedTime = Math.floor((Date.now() - startTime) / 1000); // Time in seconds
  const minutes = Math.floor(elapsedTime / 60);
  const seconds = elapsedTime % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  document.getElementById('vmdcurr').textContent = formattedTime;

  // Get target playtime from the vmdplay div
  const targetPlaytime = getTargetPlaytime();

  // Check if the elapsed time has reached or exceeded the target playtime
  if (elapsedTime >= targetPlaytime) {
    // Animation has finished, reset the start time
    startTime = Date.now(); // Reset the start time if needed
    isAnimating = false; // Stop animation
    document.getElementById('vmdcurr').textContent = "00:00"; }
;};}

function onProgress(xhr) {
  if (xhr.lengthComputable) {
    const percentComplete = xhr.loaded / xhr.total * 100;
    console.log(Math.round(percentComplete) + '% downloaded');
document.getElementById('readystate').innerHTML = Math.round(percentComplete) + '% downloaded (if stuck, click <a href="audio" target="_blank">here</a>) ' + 'Camera: ready -  ' + localStorage.getItem('camid');}}
function onError(xhr) {
  console.error("Error loading resource:", xhr);
document.getElementById('readystate').textContent = "Error loading resource: " + xhr.statusText;}


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




