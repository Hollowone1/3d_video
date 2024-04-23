import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js'; // Import correct du VRButton
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'; // Import du loader GLTF

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 100);
const renderer = new THREE.WebGLRenderer();
const controls = new OrbitControls(camera, renderer.domElement);
const radius = 30;

controls.enablePan = false;
controls.enableZoom = false;

let spherical = new THREE.Spherical(1, Math.PI / 2, 0);
spherical.makeSafe();
camera.position.setFromSpherical(spherical);

let src = 'https://s.bepro11.com/vr-video-sample.mp4';
const video = document.createElement('video');
video.src = src;
video.loop = true;
video.muted = true;
video.playsInline = true;
video.crossOrigin = 'anonymous';
video.play();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const texture = new THREE.VideoTexture(video);
const geometry = new THREE.SphereGeometry(radius, 48, 32);
const material = new THREE.MeshBasicMaterial({ map: texture });
material.side = THREE.BackSide;

const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

// Créer un élément HTML pour afficher le message d'instruction
const instructionElement = document.createElement('div');
instructionElement.textContent = 'Tournez vers la gauche pour mettre en pause la vidéo';
instructionElement.style.position = 'absolute';
instructionElement.style.top = '20px';
instructionElement.style.left = '20px';
document.body.appendChild(instructionElement);

// Variable pour suivre l'état de la lecture de la vidéo
let videoPlaying = true;

// Capturer les mouvements de la souris
let lastMouseX = null;

document.addEventListener('mousemove', (event) => {
    if (lastMouseX !== null) {
        // Calculer le déplacement horizontal de la souris
        const deltaX = event.clientX - lastMouseX;

        // Mettre à jour lastMouseX pour le prochain mouvement de la souris
        lastMouseX = event.clientX;

        // Définir un seuil pour détecter le mouvement vers la gauche
        const threshold = 10;

        // Si le déplacement de la souris est supérieur au seuil et la vidéo est en cours de lecture, mettre en pause la vidéo
        if (deltaX < -threshold && videoPlaying) {
            video.pause();
            videoPlaying = false;
        }
        // Si le déplacement de la souris est inférieur au seuil et la vidéo est en pause, reprendre la lecture de la vidéo
        else if (deltaX > threshold && !videoPlaying) {
            video.play();
            videoPlaying = true;
        }
    } else {
        // Initialiser lastMouseX lors du premier mouvement de la souris
        lastMouseX = event.clientX;
    }
});

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();

document.body.appendChild(VRButton.createButton(renderer));

renderer.xr.enabled = true;

// Charger le modèle de ciseaux uniquement lorsqu'on entre en mode VR
renderer.xr.addEventListener('sessionstart', () => {
    const loader = new THREE.GLTFLoader();
    const scissorsModelPath = 'test.glb'; // Remplacez par le chemin de votre modèle GLB

    loader.load(scissorsModelPath, (gltf) => {
        const scissors = gltf.scene;
        scene.add(scissors);

        // Positionner les ciseaux à la place de la main gauche
        // Remplacez les valeurs x, y, z par les coordonnées appropriées
        scissors.position.set(x, y, z);
    });
});

window.addEventListener('resize', onWindowResize);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
