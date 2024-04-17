import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 100);
const renderer = new THREE.WebGLRenderer();
const controls = new OrbitControls(camera, renderer.domElement);
const radius = 30;

controls.enablePan = false;
controls.enableZoom = false;

// Points the camera at the horizon by default
// Also moves the camera away for the OrbitControls target slightly so it works
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

window.addEventListener('resize', onWindowResize);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

renderer.domElement.addEventListener('wheel', handleZoom);

function handleZoom(e) {
    camera.fov = clamp(camera.fov + e.deltaY / 10, 10, 100);
    camera.updateProjectionMatrix();
}

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}
