import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as TWEEN from '@tweenjs/tween.js';

@Component({
  selector: 'app-three-d-model',
  templateUrl: './three-d-model.component.html',
  styleUrls: ['./three-d-model.component.css']
})
export class ThreeDModelComponent implements OnInit {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private controls!: OrbitControls;

  constructor() { }

  ngOnInit(): void {
    this.initThreeJS();
  }

  private initThreeJS(): void {
    const canvas = this.canvasRef.nativeElement;

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;

    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xffffff);

    // Camera
    this.camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    this.camera.position.set(10, 5, 10);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));

    // Orbit Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true; // Enable smooth camera movement
    this.controls.dampingFactor = 0.25; // Damping factor
    this.controls.screenSpacePanning = false; // Disable panning
    this.controls.maxPolarAngle = Math.PI / 2; // Limit vertical rotation

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    this.scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight1.position.set(5, 10, 7.5);
    directionalLight1.castShadow = true;
    directionalLight1.shadow.mapSize.width = 1024;
    directionalLight1.shadow.mapSize.height = 1024;
    this.scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight2.position.set(-5, -10, -7.5);
    directionalLight2.castShadow = true;
    directionalLight2.shadow.mapSize.width = 1024;
    directionalLight2.shadow.mapSize.height = 1024;
    this.scene.add(directionalLight2);

    // Load glTF Model
    const gltfLoader = new GLTFLoader();
    gltfLoader.setPath('assets/3D-models/');
    gltfLoader.load('scene.gltf', (gltf) => {
      const object = gltf.scene;
      object.position.set(0, 0, 0);
      object.scale.set(1, 1, 1);

      object.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      this.scene.add(object);
      console.log('Model loaded successfully');
      this.controls.update();
      this.startCameraAnimation();
    }, undefined, (error) => {
      console.error('An error happened', error);
    });

    // Animation Loop
    const animate = () => {
      requestAnimationFrame(animate);
      TWEEN.update();
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
    };

    animate();

    // Resize Listener
    window.addEventListener('resize', () => {
      this.onWindowResize();
    });
  }

  private startCameraAnimation(): void {
    const initialPosition = { x: -5, y: 5, z: 10 };
    const targetPosition = { x: 1.1, y: 1.1, z: 1.1 };

    const tween = new TWEEN.Tween(initialPosition)
      .to(targetPosition, 2000) // Move over 2 seconds
      .easing(TWEEN.Easing.Quadratic.Out) // Easing function
      .onUpdate(() => {
        this.camera.position.set(initialPosition.x, initialPosition.y, initialPosition.z);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        this.controls.update();
      })
      .start();
  }

  private onWindowResize(): void {
    const canvas = this.canvasRef.nativeElement;
    this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  }
}