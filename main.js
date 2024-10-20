import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 800 / 800, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(800, 800); 
document.body.appendChild(renderer.domElement);

const geometry = new THREE.SphereGeometry(1, 32, 32);  
let material = new THREE.MeshBasicMaterial({ color: getRandomColor() });
const object = new THREE.Mesh(geometry, material);
scene.add(object);

object.position.set(0, 0, 0);
camera.position.z = 7; 

let velocityX = (Math.random() * 0.05) + 0.02; 
let velocityY = (Math.random() * 0.05) + 0.02; 

velocityX *= Math.random() < 0.5 ? -1 : 1;
velocityY *= Math.random() < 0.5 ? -1 : 1;

let bounces = 0;

function getRandomColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
}

function calculateScreenBoundaries() {
    const frustumHeight = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2) * camera.position.z;
    const frustumWidth = frustumHeight * (renderer.domElement.width / renderer.domElement.height);
    
    return {
        minX: -frustumWidth / 2,
        maxX: frustumWidth / 2,
        minY: -frustumHeight / 2,
        maxY: frustumHeight / 2
    };
}

function animate() {
    object.position.x += velocityX;
    object.position.y += velocityY;

    const boundaries = calculateScreenBoundaries();

    const dynamicHalfSize = 0.5 * object.scale.x;  

    if (object.position.x + dynamicHalfSize >= boundaries.maxX || object.position.x - dynamicHalfSize <= boundaries.minX) {
        velocityX = -velocityX;
        handleBounce();
    }

    if (object.position.y + dynamicHalfSize >= boundaries.maxY || object.position.y - dynamicHalfSize <= boundaries.minY) {
        velocityY = -velocityY;
        handleBounce();
    }

    renderer.render(scene, camera);
    requestAnimationFrame(animate); 
}

function handleBounce() {
    bounces += 1;

    object.material.color.set(getRandomColor());

    if (object.scale.x > 0.05 && object.scale.y > 0.05 && object.scale.z > 0.05) {
        object.scale.x *= 0.7;  
        object.scale.y *= 0.7;
        object.scale.z *= 0.7;
    }

    if (bounces >= 8) {
        object.visible = false; 
    }
}

animate();
