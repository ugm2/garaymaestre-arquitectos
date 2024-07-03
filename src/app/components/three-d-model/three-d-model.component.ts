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
  private pivot!: THREE.Group;
  private directionalLight1!: THREE.DirectionalLight;
  private directionalLight2!: THREE.DirectionalLight;

  constructor() { }

  ngOnInit(): void {
    this.initThreeJS();
  }

  private initThreeJS(): void {
    const canvas = this.canvasRef.nativeElement;
    this.setupRenderer(canvas);
    this.setupScene();
    this.setupCamera(canvas);
    this.setupControls();
    this.setupLights();
    this.loadModel('assets/3D-models/modern-villa/', 'scene.gltf');
    this.startAnimationLoop();

    window.addEventListener('resize', this.onWindowResize.bind(this));
  }

  private setupRenderer(canvas: HTMLCanvasElement): void {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Soft shadow mapping for better quality
  }

  private setupScene(): void {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xffffff);
  }

  private setupCamera(canvas: HTMLCanvasElement): void {
    this.camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    this.camera.position.set(10, 5, 50); // Start the camera farther away
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
  }

  private setupControls(): void {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.25;
    this.controls.screenSpacePanning = false;
    this.controls.maxPolarAngle = Math.PI / 2;
  }

  private setupLights(): void {
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    this.scene.add(ambientLight);

    this.directionalLight1 = new THREE.DirectionalLight(0xffffff, 1);
    this.directionalLight1.position.set(5, 10, 7.5);
    this.directionalLight1.castShadow = true;
    this.directionalLight1.shadow.mapSize.width = 2048; // Adjusted shadow map size
    this.directionalLight1.shadow.mapSize.height = 2048;
    this.directionalLight1.shadow.camera.near = 0.5;
    this.directionalLight1.shadow.camera.far = 500;
    this.scene.add(this.directionalLight1);

    this.directionalLight2 = new THREE.DirectionalLight(0xffffff, 1);
    this.directionalLight2.position.set(-5, -10, -7.5);
    this.directionalLight2.castShadow = true;
    this.directionalLight2.shadow.mapSize.width = 2048; // Adjusted shadow map size
    this.directionalLight2.shadow.mapSize.height = 2048;
    this.directionalLight2.shadow.camera.near = 0.5;
    this.directionalLight2.shadow.camera.far = 500;
    this.scene.add(this.directionalLight2);
  }

  private loadModel(path: string, fileName: string): void {
    const gltfLoader = new GLTFLoader();
    gltfLoader.setPath(path);
    gltfLoader.load(fileName, (gltf) => {
      const object = gltf.scene;
      object.scale.set(1, 1, 1);

      // Compute the bounding box of the model
      const box = new THREE.Box3().setFromObject(object);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());

      // Adjust model's position to center it
      object.position.x += (object.position.x - center.x);
      object.position.y += (object.position.y - center.y);
      object.position.z += (object.position.z - center.z);

      object.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      this.pivot = new THREE.Group();
      this.pivot.add(object);
      this.scene.add(this.pivot);

      // Adjust shadow camera to fit the model size
      this.updateShadowCamera(size);

      console.log('Model loaded successfully');
      this.controls.update();
      this.startIntroAnimation();
    }, undefined, (error) => {
      console.error('An error happened', error);
    });
  }

  private updateShadowCamera(size: THREE.Vector3): void {
    const d = Math.max(size.x, size.y, size.z) * 0.75; // Adjusted factor for better shadow coverage

    // Update directional light 1 shadow camera bounds
    this.directionalLight1.shadow.camera.left = -d;
    this.directionalLight1.shadow.camera.right = d;
    this.directionalLight1.shadow.camera.top = d;
    this.directionalLight1.shadow.camera.bottom = -d;
    this.directionalLight1.shadow.camera.near = 0.5;
    this.directionalLight1.shadow.camera.far = d * 10;

    // Update directional light 2 shadow camera bounds
    this.directionalLight2.shadow.camera.left = -d;
    this.directionalLight2.shadow.camera.right = d;
    this.directionalLight2.shadow.camera.top = d;
    this.directionalLight2.shadow.camera.bottom = -d;
    this.directionalLight2.shadow.camera.near = 0.5;
    this.directionalLight2.shadow.camera.far = d * 10;

    // Update shadow camera projections
    this.directionalLight1.shadow.camera.updateProjectionMatrix();
    this.directionalLight2.shadow.camera.updateProjectionMatrix();
  }

  private startIntroAnimation(): void {
    const initialRotation = { y: 0 };
    const finalRotation = { y: 2 * Math.PI };  // Full rotation

    const initialPosition = { x: 10, y: 5, z: 50 }; // Start far
    const finalPosition = { x: 15, y: 5, z: 15 }; // Adjusted to match the desired ending view

    const rotationTween = new TWEEN.Tween(initialRotation)
      .to(finalRotation, 4000)  // 4 seconds
      .easing(TWEEN.Easing.Quadratic.Out)
      .onUpdate(() => {
        this.pivot.rotation.y = initialRotation.y;
      });

    const positionTween = new TWEEN.Tween(initialPosition)
      .to(finalPosition, 4000)  // 4 seconds
      .easing(TWEEN.Easing.Quadratic.Out)
      .onUpdate(() => {
        this.camera.position.set(initialPosition.x, initialPosition.y, initialPosition.z);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        this.controls.update();
      });

    rotationTween.start();
    positionTween.start();
  }

  private startAnimationLoop(): void {
    const animate = () => {
      requestAnimationFrame(animate);
      TWEEN.update();
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
    };

    animate();
  }

  private onWindowResize(): void {
    const canvas = this.canvasRef.nativeElement;
    this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  }
}