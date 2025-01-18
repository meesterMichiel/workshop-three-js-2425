import * as THREE from 'three';
import {GLTFLoader} from'three/addons/loaders/GLTFLoader.js'
import {OrbitControls} from'three/addons/controls/OrbitControls.js'
//DRACO LOADING (compressed models)
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import GUI from 'lil-gui';
import {createPositionSliders, createRotationSliders, createScaleSliders,createAllTransformSliders} from 'lil-gui-helper'

const gui= new GUI();


// FUNCTIONS
function handleWindowResize() {
    const { clientWidth, clientHeight } = canvas;
    camera.aspect = clientWidth / clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(clientWidth, clientHeight);
}


function configureDracoLoader(gltfLoader) {
    if (!(gltfLoader instanceof GLTFLoader)) {
        throw new Error('The first parameter must be an instance of THREE.GLTFLoader');
    }
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://cdn.jsdelivr.net/npm/three@0.172.0/examples/jsm/libs/draco/');
    gltfLoader.setDRACOLoader(dracoLoader);
}
function loadModel(url) {
    let name = url.substring(url.lastIndexOf('/') + 1);
    name = name.substring(0, name.lastIndexOf('.'));
    console.log(name);
    return new Promise((resolve, reject) => {
        loader.load(
            url,
            (gltf) => {
                gltf.scene.name = name;
                resolve(gltf.scene);
            },
            (xhr) => {
                console.log(Math.round(xhr.loaded / xhr.total * 100) + '% loaded');
            },
            (error) => {
                console.error('Error loading model:', error);
                reject(error);
            }
        );
    });
}

// SCENE SETUP
const canvas = document.querySelector('#threejs-canvas');
const scene = new THREE.Scene();

// CAMERA
const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
camera.position.z = 5;

// RENDERER
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.antialias = true;
renderer.setSize(canvas.clientWidth, canvas.clientHeight);

// LIGHT SETUP
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const spotLight = new THREE.SpotLight(0xffffff);
spotLight.position.set(0,0,5);
scene.add(spotLight);
const spotLightHelper = new THREE.SpotLightHelper(spotLight);
//scene.add(spotLightHelper);

// BASIC CUBE
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
cube.name = "cube";
scene.add(cube);

createPositionSliders(gui,cube,-5,5);
createRotationSliders(gui,cube,0,5);
createScaleSliders(gui,cube,0,5);

//OR use this method to create all 3 transform sliders at once.
//createAllTransformSliders(gui,cube,-5,5);

//DRACO LOADER CONFIG
const loader = new GLTFLoader();
configureDracoLoader(loader);

//LOAD CUSTOM MODEL(s)
let monkey1 = await loadModel('../assets/models/Monkey.glb');
scene.add(monkey1);
createPositionSliders(gui,monkey1,-5,5);

//CONTROLS
const controls = new OrbitControls(camera, renderer.domElement);

// ANIMATE
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    controls.update();
}
handleWindowResize();
animate();

// GLOBAL EVENT LISTENERS
window.addEventListener('resize', handleWindowResize);