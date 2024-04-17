import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 100)
const renderer = new THREE.WebGLRenderer()
const controls = new THREE.OrbitControls(camera, renderer.domElement)
const radius = 30

controls.enablePan = false
controls.enableZoom = false

// Points the camera at the horizon by default
// Also moves the camera away for the OrbitControls target slightly so it works
let spherical = new THREE.Spherical(1, Math.PI / 2, 0)
spherical.makeSafe()
camera.position.setFromSpherical(spherical)

let src = 'https://s.bepro11.com/vr-video-sample.mp4'
const video = document.createElement('video')
video.src = src
video.loop = true
video.muted = true
video.playsInline = true
video.crossOrigin = 'anonymous'
video.play()

renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const texture = new THREE.VideoTexture(video)
const geometry = new THREE.SphereGeometry(radius, 48, 32)
const material = new THREE.MeshBasicMaterial({ map: texture })
material.side = THREE.BackSide

const sphere = new THREE.Mesh(geometry, material)
scene.add(sphere)