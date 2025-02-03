import * as THREE from 'three';
import {GLTFLoader} from'three/addons/loaders/GLTFLoader.js'
import {OrbitControls} from'three/addons/controls/OrbitControls.js'
//DRACO LOADING (compressed models)
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

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
renderer.setClearColor(0x000000, 0);
renderer.setSize(canvas.clientWidth, canvas.clientHeight);

// LIGHT SETUP
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);
/*
const spotLight = new THREE.SpotLight(0xffffff);
spotLight.position.set(0, 0, 5);
scene.add(spotLight);
const spotLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotLightHelper);
*/

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(1, 1, 1).normalize();
scene.add(directionalLight);

/*
const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);
*/

// BASIC CUBE
/*const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
cube.name = "cube";
scene.add(cube);
*/
//OR use this method to create all 3 transform sliders at once.
//createAllTransformSliders(gui,cube,-5,5);

//DRACO LOADER CONFIG
const loader = new GLTFLoader();
configureDracoLoader(loader);

//LOAD CUSTOM MODEL(s)
let monkey1 = await loadModel('../assets/models/Monkey.glb');
monkey1.position.set(0, -1.75, 2);
scene.add(monkey1);

//MATERIALS & TEXTURES
const textureLoader = new THREE.TextureLoader();
const metalTexture = textureLoader.load('../assets/textures/metal-texture.jpg');

const metalMaterial = new THREE.MeshStandardMaterial({
    color: 0xffff00,
    map: metalTexture,
    metalness: 0.9,
    roughness: 0.5
});

monkey1.traverse((child) => {
    if (child.isMesh) {
        child.material = metalMaterial;
    }
});

//CONTROLS
const controls = new OrbitControls(camera, renderer.domElement);

// ANIMATE
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    controls.update();
    //monkey1.rotation.y += 0.01; // Continu draaien
}
handleWindowResize();
animate();

// GLOBAL EVENT LISTENERS
window.addEventListener('resize', handleWindowResize);

//DRAAI MODEL BIJ SCROLL (VANILLA JS)
function rotateModel() {  
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    // Berekent de totale scrollbare hoogte van de pagina  
    // (totale hoogte van de inhoud min de hoogte van het venster)  
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;  
    // Haalt de huidige scrollpositie op (hoe ver de gebruiker naar beneden heeft gescrold)  
    // Sommige browsers gebruiken document.documentElement, andere document.body  
    const rotation = (scrollTop / scrollHeight) * 2 * Math.PI;  
    // Berekent de rotatiehoek in radialen op basis van de scrollpositie  
    // 0 bij de top, 2π bij het einde van de scroll -> 360 graden
    monkey1.rotation.y = rotation;  
    // Past de berekende rotatie toe op de y-as van het 3D-model
}
document.body.onscroll = rotateModel;  

//DRAAI MODEL BIJ SCROLL (GSAP)
/*const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
gsap.registerPlugin(ScrollTrigger);
gsap.to(monkey1.rotation, {
    scrollTrigger: {
        trigger: document.body,
        start: 0,
        end: scrollHeight,
        scrub: true
    },
    y: 2 * Math.PI, // 360 graden draaien
});*/