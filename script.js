import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

let scene, camera, renderer, controls;
let regeneratingBlock, player, inventoryCount = 0;
const inventory = [];

// Initialize the game
function init() {
    // Scene setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 10);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    // Create the regenerating block
    regeneratingBlock = createBlock(0, 1, 0, 0x00ff00);
    scene.add(regeneratingBlock);

    // Player settings
    player = { position: new THREE.Vector3(0, 1, 5), velocity: new THREE.Vector3(0, 0, 0) };

    // Event listeners
    window.addEventListener('resize', onWindowResize);
    window.addEventListener('keydown', handleKeyDown);

    animate();
}

// Create a block with given color and position
function createBlock(x, y, z, color) {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color });
    const block = new THREE.Mesh(geometry, material);
    block.position.set(x, y, z);
    return block;
}

// Regenerate the main block and add it to inventory
function regenerateBlock() {
    scene.remove(regeneratingBlock);
    regeneratingBlock = createBlock(0, 1, 0, 0x00ff00);
    scene.add(regeneratingBlock);

    // Update inventory
    inventory.push(createBlock(0, 1, 0, 0xaaaaaa));
    inventoryCount++;
    document.getElementById('inventory-count').innerText = inventoryCount;
}

// Handle placing blocks from inventory
function placeBlock() {
    if (inventory.length > 0) {
        const block = inventory.pop();
        block.position.set(player.position.x, 1, player.position.z);
        scene.add(block);
        inventoryCount--;
        document.getElementById('inventory-count').innerText = inventoryCount;
    }
}

// Handle player controls
function handleKeyDown(event) {
    switch (event.key) {
        case 'w': player.position.z -= 1; break;
        case 's': player.position.z += 1; break;
        case 'a': player.position.x -= 1; break;
        case 'd': player.position.x += 1; break;
        case 'e': regenerateBlock(); break;  // Press 'E' to break/regenerate the main block
        case 'q': placeBlock(); break;       // Press 'Q' to place a block from inventory
    }
    controls.target.copy(player.position);
}

// Update window size for responsive design
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

// Initialize the game
init();
