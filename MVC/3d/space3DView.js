import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

import { Space3DController as controller } from './space3DController';
import observer  from '../planes/utils/observer.js'
export class Space3DView {
    constructor(containerID, controller=null) {
        this.container = document.getElementById(containerID);

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, this.container.clientWidth / this.container.clientHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setClearColor(0xffffff);
        this.container.appendChild(this.renderer.domElement);

        this.camera.position.z = 5;

        this.gridHelper = new THREE.GridHelper(this.gridSize, this.gridSize);
        this.scene.add(this.gridHelper);

        this.controller = controller;
        this.gridSize = 20;

        // Добавление OrbitControls для вращения камерой
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.screenSpacePanning = false;
        this.controls.minDistance = 1;
        this.controls.maxDistance = 100;

        window.addEventListener('resize', this.onWindowResize, false);
        
        this.animate();

        // Добавление осей координат
        const axesHelper = new THREE.AxesHelper(5);
        this.scene.add(axesHelper);

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
                this.scene.add(label);
            };

            createAxisLabel('X', new THREE.Vector3(6, 0, 0));
            createAxisLabel('Y', new THREE.Vector3(0, 6, 0));
            createAxisLabel('Z', new THREE.Vector3(0, 0, 6));
        });
        this.subscribe();
    }

    subscribe() {
        observer.subscribe('reconstruct',() => {
            this.render();
      });
    }
    onWindowResize = () => {
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    };
    
    resetCamera = () => {
        this.camera.position.copy(this.defaultCameraPosition);
        this.controls.target.set(0, 0, 0);
        this.controls.update();
    };

    animate = () => {
        requestAnimationFrame(this.animate);

        // Обновление OrbitControls
        this.controls.update();

        this.renderer.render(this.scene, this.camera);

        // if (this.controller) {
        //     this.controller.update();
        // }
    };


    // Функция для преобразования Point3D в координаты для THREE.Points
    convertPointsToPositions(points) {
        const positions = [];
        points.forEach(point => {
            positions.push(point.pointX, point.pointY, point.pointZ);
        });
        return positions;
    }

    // Функция для преобразования Line3D в координаты для THREE.LineSegments
    convertLinesToPositions(lines) {
        const positions = [];
        lines.forEach(line => {
            positions.push(line.firstPoint.pointX, line.firstPoint.pointY, line.firstPoint.pointZ);
            positions.push(line.secondPoint.pointX, line.secondPoint.pointY, line.secondPoint.pointZ);
        });
        return positions;
    }

    render = () => {
        // Создаем массив для хранения объектов, которые нужно сохранить
        const objectsToKeep = [];
    
        // Добавляем сетку, оси и подписи в массив
        objectsToKeep.push(this.gridHelper);
        objectsToKeep.push(this.scene.children.find(child => child instanceof THREE.AxesHelper));
        this.scene.children.forEach(child => {
            if (child.type === 'Mesh' && child.material.transparent) {
                objectsToKeep.push(child);
            }
        });
    
        // Удаляем все объекты из сцены, кроме тех, что в массиве objectsToKeep
        this.scene.children.forEach(object => {
            if (!objectsToKeep.includes(object)) {
                this.scene.remove(object);
            }
        });
    
        // Создаем геометрию и материал для точек
        const pointGeometry = new THREE.BufferGeometry();
        const pointMaterial = new THREE.PointsMaterial({ color: 0xff0000, size: 3 });

        // Создаем геометрию и материал для линий
        const lineGeometry = new THREE.BufferGeometry();
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff, linewidth: 20 });

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
        
        this.scene.add(points);
        this.scene.add(lines);
    }
}

