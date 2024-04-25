import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

import { Space3DController as controller } from './space3DController';
import observer  from '../planes/utils/observer.js'
export class Space3DView {
    constructor(containerID, controller=null) {
        this.container = document.getElementById(containerID);

        this.isPerspectiveCamera = true;
        
        this.scene = new THREE.Scene();
    
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setClearColor(0xffffff);
        this.container.appendChild(this.renderer.domElement);

        
        this.gridSize = 20;
        this.gridHelper = new THREE.GridHelper(this.gridSize, this.gridSize);
        this.scene.add(this.gridHelper);
        
        this.rootObject = new THREE.Object3D();
        this.rootObject.rotation.x = -Math.PI / 2;
        this.scene.add(this.rootObject)
        
        this.controller = controller;
        this.frustumSize = 20; // Определите frustumSize здесь
        this.camera = new THREE.PerspectiveCamera(75, this.container.clientWidth / this.container.clientHeight, 0.1, 1000);
        this.camera.position.set(30, 30, 30);
        this.camera.lookAt(0, 0, 0);

        // Добавление OrbitControls для вращения камерой
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.screenSpacePanning = false;
        this.controls.minDistance = 20;
        this.controls.maxDistance = 100;

        window.addEventListener('resize', this.onWindowResize, false);
        document.addEventListener('keydown', this.onKeyDown);
        // Добавление осей координат
        this.axesHelper = new THREE.AxesHelper(7);
        this.rootObject.add(this.axesHelper);
        
        // Добавление текстовых меток для осей
        const loader = new FontLoader();
        //TODO : fix font link to js.file
        loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
            const materialParams = {
                color: 0x000000,
                transparent: true,
                opacity: 0.8,
            };

            const createAxisLabel = (text, position) => {
                const geometry = new TextGeometry(text, {
                    font: font,
                    size: 0.5,
                    depth: 0.1,
                });
                const material = new THREE.MeshBasicMaterial(materialParams);
                const label = new THREE.Mesh(geometry, material);
                label.position.copy(position);
                label.rotateX(Math.PI / 2)
                this.rootObject.add(label);
            };

            createAxisLabel('X', new THREE.Vector3(6, 0, 0));
            createAxisLabel('Y', new THREE.Vector3(0, 6, 0));
            createAxisLabel('Z', new THREE.Vector3(0, 0, 6));
        });
        this.animate();
        this.subscribe();
    }

    onKeyDown = (event) => {
        if (event.key === 'c') {
          this.toggleCamera();
        }
      };


    toggleCamera() {
        if (this.isPerspectiveCamera) {
            // Переключение на ортографическую камеру
            const aspect = this.container.clientWidth / this.container.clientHeight;
            const frustumSize = 20;
            const left = frustumSize * aspect / -2;
            const right = frustumSize * aspect / 2;
            const top = frustumSize / 2;
            const bottom = frustumSize / -2;
            const near = 0.1;
            const far = 1000;
        
            this.camera = new THREE.OrthographicCamera(left, right, top, bottom, near, far);
            this.camera.position.set(20, 20, 20);
            this.camera.lookAt(0, 0, 0);
            this.camera.zoom = 1; // Установите начальный масштаб для ортографической камеры
            // Создание объекта OrbitControls

            this.controls.enableRotate = true; // Включение вращения для ортографической камеры
            this.controls.enableZoom = true; // Включение масштабирования для ортографической камеры
            this.controls.enablePan = true; // Включение панорамирования для ортографической камеры

        } else {
            // Переключение на перспективную камеру
            this.camera = new THREE.PerspectiveCamera(75, this.container.clientWidth / this.container.clientHeight, 0.1, 1000);
            this.camera.position.set(30, 30, 30);
            this.camera.lookAt(0, 0, 0);

            this.controls.enableRotate = true; // Включение вращения для перспективной камеры
            this.controls.enableZoom = true; // Включение масштабирования для перспективной камеры
            this.controls.enablePan = true; // Включение панорамирования для перспективной камеры
            this.controls.minDistance = 20;
            this.controls.maxDistance = 100;
        }
      
        this.isPerspectiveCamera = !this.isPerspectiveCamera;
        this.controls.object = this.camera;
        this.controls.update();
        this.onWindowResize();
    }

    subscribe() {
        observer.subscribe('reconstruct',() => {
            this.render();
      });
    }

    onWindowResize = () => {
        if (this.isPerspectiveCamera) {
            this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        } else {
            const aspect = this.container.clientWidth / this.container.clientHeight;
            this.camera.left = -this.frustumSize * aspect / 2;
            this.camera.right = this.frustumSize * aspect / 2;
            this.camera.top = this.frustumSize / 2;
            this.camera.bottom = -this.frustumSize / 2;
        }
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    };

    updateGridAndAxesScale() {
        let scale;
        if (this.isPerspectiveCamera) {
            const distance = this.camera.position.distanceTo(new THREE.Vector3(0, 0, 0));
            scale = distance / 10;
        } else {
            scale = this.camera.zoom * 0.1;
        }
        
        this.gridHelper.scale.set(scale, scale, scale);
        this.axesHelper.scale.set(scale, scale, scale);
    }
    
    resetCamera = () => {
        this.camera.position.copy(this.defaultCameraPosition);
        this.controls.target.set(0, 0, 0);
        this.controls.update();
    };

    animate = () => {
        requestAnimationFrame(this.animate.bind(this));

        this.updateGridAndAxesScale();
      
        this.controls.update();
        this.renderer.render(this.scene,this.camera);
    };


    // Функция для преобразования Point3D в координаты для THREE.Points + offest к 0;0;0
    convertPointsToPositions(points) {
        const positions = [];
        points.forEach(point => {
            positions.push(point.pointX - points[0].pointX, point.pointY - points[0].pointY, point.pointZ - points[0].pointZ);
        });
        return positions;
    }

    // Функция для преобразования Line3D в координаты для THREE.LineSegments
    convertLinesToPositions(lines) {
        const positions = [];
        const firstPoint = lines[0].firstPoint;
        lines.forEach(line => {
            positions.push(line.firstPoint.pointX - firstPoint.pointX, line.firstPoint.pointY - firstPoint.pointY, line.firstPoint.pointZ - firstPoint.pointZ);
            positions.push(line.secondPoint.pointX - firstPoint.pointX, line.secondPoint.pointY - firstPoint.pointY, line.secondPoint.pointZ - firstPoint.pointZ);
        });
        return positions;
    }

    render = () => {
        // Создаем массив для хранения объектов, которые нужно сохранить
        const objectsToKeep = [];
    
        // Добавляем сетку, оси и подписи в массив
        objectsToKeep.push(this.gridHelper);
        objectsToKeep.push(this.rootObject.children.find(child => child instanceof THREE.AxesHelper));
        this.rootObject.children.forEach(child => {
            if (child.type === 'Mesh' && child.material.transparent) {
                objectsToKeep.push(child);
            }
        });
    
        // Удаляем все объекты из сцены, кроме тех, что в массиве objectsToKeep
        this.rootObject.children.forEach(object => {
            if (!objectsToKeep.includes(object)) {
                this.rootObject.remove(object);
            }
        });
    
        // Создаем геометрию и материал для точек
        const pointGeometry = new THREE.BufferGeometry();
        const pointMaterial = new THREE.PointsMaterial({ color: 0xff0000, size: 1 });

        // Создаем геометрию и материал для линий
        const lineGeometry = new THREE.BufferGeometry();
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff, linewidth: 1 });

        // Получаем точки и линии из this.controller.handleObjects()
        // Добавляем новые объекты из this.controller.handleObjects()
        const { vertices:vertices, edges:edges }= this.controller.handleObjects();

        // Преобразуем Point3D и Line3D в координаты для рендера
        const pointPositions = this.convertPointsToPositions(vertices);
        const linePositions = this.convertLinesToPositions(edges);
        console.log(pointPositions,linePositions)
        // Добавляем точки в геометрию
        pointGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pointPositions), 3));

        // Добавляем линии в геометрию
        lineGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(linePositions), 3));

        // Создаем объекты Three.js для точек и линий
        const points = new THREE.Points(pointGeometry, pointMaterial);
        const lines = new THREE.LineSegments(lineGeometry, lineMaterial);

        // Добавляем точки и линии в сцену
        
        this.rootObject.add(points);
        this.rootObject.add(lines);
    }
}

