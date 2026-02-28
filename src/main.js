import './style.css'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

// 🔹 Canvas
const canvas = document.getElementById('three-canvas')
const container = document.querySelector('.bottom-box')

// 🔹 Scene
const scene = new THREE.Scene()

// 🔹 Camera
const camera = new THREE.PerspectiveCamera(
  45,
  container.clientWidth / container.clientHeight,
  0.1,
  100
)
camera.position.set(0, 0, 8)

// 🔹 Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
  antialias: true
})
renderer.setSize(container.clientWidth, container.clientHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// 🔹 Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 1.2)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5)
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

// 🔹 Loader
const loader = new GLTFLoader()

let penguinGroup = new THREE.Group()
scene.add(penguinGroup)
let penguinMesh;

loader.load('/penguin.glb', (gltf) => {
  penguinMesh = gltf.scene

  // Center model automatically
  const box = new THREE.Box3().setFromObject(penguinMesh)
  const center = box.getCenter(new THREE.Vector3())
  penguinMesh.position.sub(center)

  penguinGroup.add(penguinMesh)
  
  // Set initial scale
  penguinGroup.scale.set(1.5, 1.5, 1.5)
})

// 🔹 Animation (Breathing and slight rotation)
function animate() {
  requestAnimationFrame(animate)

  if (penguinMesh) {
    const time = Date.now() * 0.002

    // Smooth breathing applied to the group
    penguinGroup.scale.y = 1.5 + Math.sin(time) * 0.05
    penguinGroup.scale.x = 1.5 - Math.sin(time) * 0.01
    penguinGroup.scale.z = 1.5 - Math.sin(time) * 0.01

    // Slight romantic rotation
    penguinGroup.rotation.y = Math.sin(time * 0.5) * 0.3
  }

  renderer.render(scene, camera)
}
animate()

// 🔹 Resize handler
window.addEventListener('resize', () => {
  const width = container.clientWidth
  const height = container.clientHeight

  renderer.setSize(width, height)
  camera.aspect = width / height
  camera.updateProjectionMatrix()
})