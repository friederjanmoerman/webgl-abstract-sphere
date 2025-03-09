import vertexShader from './shaders/vertexShader.vert';
import fragmentShader from './shaders/fragmentShader.frag';

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Set the background color.
renderer.setClearColor(0x000000);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const orbit = new OrbitControls(camera, renderer.domElement);
camera.position.set(6, 8, 14);
orbit.update();

// Lights
const lights = {};
lights.a = {
    intensity: 1.8,
    position: new THREE.Vector3(10,0,5)
};


const uniforms = {
    u_time: { value: 0.0 },

    // Light uniforms
    uLightAPosition: { value: lights.a.position },
    uLightAIntensity: { value: lights.a.intensity },

    diffuse: { value: new THREE.Color(0.2, 0.2, 0.2) } // Dark grey base color
};

const mat = new THREE.ShaderMaterial({
    wireframe: false,
    uniforms,
    vertexShader,
    fragmentShader
});


const geo = new THREE.IcosahedronGeometry(4, 30);
const mesh = new THREE.Mesh(geo, mat);
scene.add(mesh);

// Create a MeshDepthMaterial and assign it to the mesh.
// This depth material is used in shadow mapping or depth passes.
mesh.customDepthMaterial = new THREE.MeshDepthMaterial();

const clock = new THREE.Clock();
const speedFactor = 0.2;

function animate() {
  uniforms.u_time.value = clock.getElapsedTime() * speedFactor;
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
