import { Point, Line} from './planeModel.js';
import { Space3DModel } from './reconstruction.js';
import observer from './utils/observer.js'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

export class ToolBar { // TODO: mb i ne nado

}

export class Legend { // should to make it maximally independent to PlaneView 

    constructor(canvasId, legendID, containerID, controller) {
        this.controller = controller
        this.legendID = legendID
        this.canvas = document.getElementById(canvasId);
        this.legendElement = document.createElement('div');
        this.legendElement.setAttribute("name", "legend");
        this.legendElement.id = legendID
        this.legendElement.style.marginTop = '10px';
        document.getElementById(containerID).appendChild(this.legendElement)
    }

    createLegendItems(objects) {
        document.getElementById(this.legendID).innerHTML = '';
        objects.forEach((item) => {

            const legendItem = document.createElement('div');
            legendItem.style.display = 'flex';
            legendItem.style.alignItems = 'center';
            legendItem.style.marginBottom = '5px';

            const colorBox = document.createElement('div');
            colorBox.style.width = '20px';
            colorBox.style.height = '20px';
            colorBox.style.marginRight = '10px';

            const label = document.createElement('span');
            if (item instanceof Point) {
                if (this.controller.handleCheckObjectSelection(item)) {
                    legendItem.classList.toggle('selected');
                }
                colorBox.style.backgroundColor = 'black';
                label.textContent = item.name;
            }
            
            if (item instanceof Line) {
                if (this.controller.handleCheckObjectSelection(item)) {
                    legendItem.classList.toggle('selected');
                }
                colorBox.style.backgroundColor = 'blue';
                label.textContent = item.name;
            }
            
            label.addEventListener('dblclick', this.updateObjectName);
            label.addEventListener('contextmenu', this.updateCoordinates);
            label.addEventListener('click', this.selectObject);

            legendItem.appendChild(colorBox);
            legendItem.appendChild(label);
            this.legendElement.appendChild(legendItem);
        });
    }
    
    updateObjectName = (event) => {
        if (event.button == 0) {
            const element = event.target; // Элемент, вызвавший событие
            const name = element.textContent;
            const newName = prompt("Введите новое имя:", name);
            if (newName) {
                if (this.controller.handleUpdateObjectName(name, newName) === 'exists'){
                    alert('Такое имя уже есть!')
                } else {
                    element.textContent = newName; // Обновляем отображаемое имя прямо здесь, если это требуется
                } 
            }
        }
    }

    updateCoordinates = (event) => {
        if (event.button == 2){
            const element = event.target;
            const name = element.textContent;
            const newCoord = prompt("Введите новые координаты формата x;y");
            if (newCoord) {
                const [x,y] = newCoord.split(";");
                this.controller.handleUpdateObjectCoordinates(name, x, y);
            }
        }
    }

    selectObject = (event) => {
        let element = event.target;
        const name = element.textContent;
        element = element.parentElement;
        // console.log(element)
        if (this.controller.handleSelectObjectByName(name)){
            console.log(element)
        } else {
            console.log("err")
        }
    }

    handleContextMenu = (event) =>  {
        event.preventDefault(); // Отменяем контекстное меню, которое на RMB
    }

    render(objects) {
        this.createLegendItems(objects);
        // this.canvas.parentNode.insertBefore(this.legendElement, this.canvas.nextSibling);
    }
  }
  

//legend
export class PlaneView {

    constructor(containerID, canvasID, coordinatesID, legendID, controller) {
        const container = document.getElementById(containerID)
        console.log(container)

        this.Legend = new Legend(canvasID, legendID, containerID, controller); // test feature - Колхоз если кратко.

        this.canvas = document.createElement('canvas');
        this.canvas.id = canvasID;
        this.canvas.width = 640;
        this.canvas.height = 480;
    
        this.ctx = this.canvas.getContext('2d');

        this.pointOfOrigin = {x:0,y:0};
        this.pointRadius = 3;
    
        this.mouseCoordinatesElement = document.createElement('div');
        this.mouseCoordinatesElement.id = coordinatesID;
        this.mouseCoordinatesElement.setAttribute("name", "mouseCoordinates");
        this.mouseCoordinatesElement.textContent = '0, 0';
        
        container.appendChild(this.canvas);
        container.appendChild(this.mouseCoordinatesElement);

        this.controller = controller
        this.gridSize = 20;

        // ??
        this.addLineMode = false;
        this.addPointMode = false;
        this.tempLineStart = null;
        this.isSelectionDragging = false;
        this.isObjectDragging = false;
        this.draggedObectName = null;
        // ??
        this.dragStart = { x:null, y:null };
        this.dragNow = { x:null, y:null };
        this.dragEnd = { x:null, y:null };
        
        this.makeGirdOnSVG(container);
        this.bindEventListeners();
        this.subscribe();
    }

    makeGirdOnSVG(container) {
        // Создание SVG сетки
        const gridSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        gridSVG.setAttribute('name', 'gridSVG');
        gridSVG.setAttribute("width", "640");
        gridSVG.setAttribute("height", "480");
        container.insertBefore(gridSVG, container.firstChild);
        console.log("grid",container)
        for (let x = 0; x <= gridSVG.getAttribute('width'); x += this.gridSize) {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', x);
            line.setAttribute('y1', 0);
            line.setAttribute('x2', x);
            line.setAttribute('y2', gridSVG.getAttribute('height'));
            line.setAttribute('stroke', 'lightgray');
            gridSVG.appendChild(line);
        }
        for (let y = 0; y <= gridSVG.getAttribute('height'); y += this.gridSize) {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', 0);
            line.setAttribute('y1', y);
            line.setAttribute('x2', gridSVG.getAttribute('width'));
            line.setAttribute('y2', y);
            line.setAttribute('stroke', 'lightgray');
            gridSVG.appendChild(line);
        }
    }

    bindEventListeners() {
        this.canvas.addEventListener('click', this.onCanvasClick);
        this.canvas.addEventListener('contextmenu', this.handleContextMenu);
        this.canvas.addEventListener('mousedown', this.onMouseDown);
        this.canvas.addEventListener('mousemove', this.onMouseMove);
        this.canvas.addEventListener('mouseup', this.onMouseUp);
        this.canvas.addEventListener('mouseout', this.onMouseOut);
    }

    // /**
    //  * Configures the canvas based on the given type.
    //  * @param {('rightUpper'|'rightLower'|'leftUpper'|'leftLower')} type - The type of configuration.
    //  */
    configure(type) {
        switch (type){
            case 'rightUpper':
                this.ctx.scale(-1, 1);
                this.ctx.translate(-this.canvas.width, 0);
                this.pointOfOrigin.x = this.canvas.width
                this.pointOfOrigin.y = 0
                break;
            case 'rightLower':
                this.ctx.scale(-1, -1);
                this.ctx.translate(-this.canvas.width, -this.canvas.height);
                this.pointOfOrigin.x = this.canvas.width
                this.pointOfOrigin.y = this.canvas.height
                break;
            case 'leftUpper':
                console.log('default')
                break;
            case 'leftLower':
                this.ctx.scale(1, -1);
                this.ctx.translate(0, -this.canvas.height);
                this.pointOfOrigin.x = 0
                this.pointOfOrigin.y = this.canvas.height
                break;
            default:
                console.log('default')
        }
    }

    subscribe() {
        observer.subscribe('objectUpdated', () => {
            this.drawObjects()
        });
    }

    snapCoordinate(value) {
        let snapTolerance = 4
        let ralativeToCell = value % this.gridSize;

        if (ralativeToCell <= snapTolerance) {
            // snap to lower value
            return value - ralativeToCell;
        } else if (ralativeToCell >= (this.gridSize - snapTolerance)) {
            // snap to higher value
            return value + (this.gridSize - ralativeToCell);
        } else
            return value
    }

    handleContextMenu = (event) =>  {
        event.preventDefault(); // Отменяем контекстное меню, которое на RMB
    }

    drawObjects() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.controller.handleObjects().forEach((obj) => {
            if (obj instanceof Point) {
                if (this.controller.handleCheckObjectSelection(obj)) {
                    this.ctx.fillStyle = 'blue'; // Устанавливаем синий цвет для выделенных линий
                } else {
                    this.ctx.fillStyle = 'black'; // Устанавливаем черный цвет для невыделенных линий
                }
                this.ctx.beginPath();
                this.ctx.arc(obj.pointX, obj.pointY, this.pointRadius, 0, Math.PI * 2);
                this.ctx.fill();
            } else if (obj instanceof Line) {
                if (this.controller.handleCheckObjectSelection(obj)) {
                    this.ctx.strokeStyle = 'blue'; // Устанавливаем синий цвет для выделенных линий
                } else {
                    this.ctx.strokeStyle = 'black'; // Устанавливаем черный цвет для невыделенных линий
                }
                this.ctx.beginPath();
                this.ctx.moveTo(obj.linePointX1, obj.linePointY1);
                this.ctx.lineTo(obj.linePointX2, obj.linePointY2);
                this.ctx.stroke();
            }
        });
    
        this.Legend.render(this.controller.handleObjects()); //Legend
    }

    drawObjectOnline(event) { //TODO: rename and optimise
        // const xSnapped = this.snapCoordinate(this.canvasCoordinates(event).x);
        // const ySnapped = this.snapCoordinate(this.canvasCoordinates(event).y);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawObjects(); // нужно чтобы не пропадали точки и линии во рисования объекта
        if (this.tempLineStart) {
            this.ctx.strokeStyle = 'rgba(128, 128, 128, 0.5)';
            this.ctx.beginPath();
            
            // Рисуем точку в начале линии
            this.ctx.arc(this.tempLineStart.x, this.tempLineStart.y, this.pointRadius, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(128, 128, 128, 0.5)';
            this.ctx.fill();
            
            this.ctx.moveTo(this.tempLineStart.x, this.tempLineStart.y);
            this.ctx.lineTo(this.canvasCoordinates(event).x, this.canvasCoordinates(event).y);
            this.ctx.stroke();
        }
        this.ctx.beginPath();
        this.ctx.arc(this.canvasCoordinates(event).x, this.canvasCoordinates(event).y, this.pointRadius, 0, Math.PI * 2);
        this.ctx.fillStyle = 'rgba(128, 128, 128, 0.5)'; // Устанавливаем цвет заливки серым
        this.ctx.fill();

        // this.dragNow = {x:xSnapped, y:ySnapped}
    }

    drawSelectionRect() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // нужно чтобы внутри прямоугольной области выделения удалялись предыдущие области
        //выделения
        this.drawObjects();// нужно чтобы не пропадали точки и линии во время рисования прямоугольника
        this.ctx.beginPath();
        this.ctx.rect(this.dragStart.x, this.dragStart.y, this.dragNow.x - this.dragStart.x, this.dragNow.y - this.dragStart.y);
        this.ctx.strokeStyle = 'blue';
        this.ctx.stroke();
    }

    canvasCoordinates(event){
        let canvasCorrection = this.canvas.getBoundingClientRect();

        return {
            x: Math.abs(this.pointOfOrigin.x - (event.clientX - canvasCorrection.left)),
            y: Math.abs(this.pointOfOrigin.y - (event.clientY - canvasCorrection.top)),
        };
    }

    drawCanvasCoordinates(event){
        this.mouseCoordinatesElement.textContent = `${this.canvasCoordinates(event).x}, ${this.canvasCoordinates(event).y}`;
    }

    onCanvasClick = (event) => {

        const coordinates = this.canvasCoordinates(event)
        if (this.addPointMode) {
            this.controller.handleCreateObject(coordinates);
            console.log('point', coordinates)
        }

        if (this.addLineMode) {
            if (this.tempLineStart === null) {
                this.tempLineStart = this.canvasCoordinates(event);

            } else {
                const lineCoordinates = { 
                    x1: this.tempLineStart.x,
                    y1: this.tempLineStart.y,
                    x2: coordinates.x,
                    y2: coordinates.y,
                    radius: this.pointRadius
                };
                this.controller.handleCreateObject(lineCoordinates);
                this.tempLineStart = null;
            }
        }
        
        this.drawObjects();
    }

    onMouseDown = (event) => {
        if (event.button == 2) { //Для выделения прямоугольником
            this.dragStart = this.canvasCoordinates(event)
            this.isSelectionDragging = true;
        }

        if ((event.button == 0) && (this.addPointMode == false) && (this.addLineMode == false)) { //Для перемещения точки
            this.dragStart = this.canvasCoordinates(event)
            const object = this.controller.handleFindObjectName({ x: this.dragStart.x, y: this.dragStart.y, radius: this.pointRadius });
            if (object) {
                this.draggedObject = object;
                console.log(this.draggedObject)
                this.isObjectDragging = true;
            }
        }
    }

    onMouseMove = (event) => {

        if (this.isSelectionDragging) { // Для выделения прямоугольником
            this.dragNow = this.canvasCoordinates(event);
            this.drawSelectionRect();
        }

        if (this.isObjectDragging && this.draggedObject.type == 'Point') { // Перемещение точки
            this.dragNow = this.canvasCoordinates(event);
            const snappedX = this.snapCoordinate(this.dragNow.x);
            const snappedY = this.snapCoordinate(this.dragNow.y);
            this.controller.handleUpdateObjectCoordinates(this.draggedObject.name, snappedX, snappedY);
            this.drawObjects();
            
        }
        if ((this.addPointMode || this.addLineMode) && !this.isSelectionDragging){
            this.drawObjectOnline(event);
        }

        if (this.isObjectDragging && this.draggedObject.type == 'Line') { // Перемещение точки
            this.dragNow = this.canvasCoordinates(event);
            const snappedX = this.snapCoordinate(this.dragNow.x);
            const snappedY = this.snapCoordinate(this.dragNow.y);
            this.controller.handleUpdateObjectCoordinates(this.draggedObject.name, snappedX, snappedY, this.draggedObject.pointType);
            this.drawObjects();
            // this.drawMovingPoint();
        }

        // Отображение координат мышки на canvas
        this.drawCanvasCoordinates(event)
    }


    onMouseUp = (event) => {
        this.dragEnd = this.canvasCoordinates(event);
        if (event.button == 2){ // Для выделения прямоугольником
            this.isSelectionDragging = false;
            const rect = {
                x1: Math.min(this.dragStart.x, this.dragEnd.x),
                y1: Math.min(this.dragStart.y, this.dragEnd.y),
                x2: Math.max(this.dragStart.x, this.dragEnd.x),
                y2: Math.max(this.dragStart.y, this.dragEnd.y)
            };
            this.controller.handleClearSelectedObjects();
            this.controller.handleSelectObjectsInRect(rect);
        }
        if (event.button == 0){ // Для перемещения точки
            // if (this.isObjectDragging == true) {
            //     this.isObjectDragging = false;
            //     this.controller.handleUpdateObjectCoordinates(
            //         this.draggedObject.name,
            //         this.snapCoordinate(this.dragEnd.x), 
            //         this.snapCoordinate(this.dragEnd.y),
            //     )
            // }
            if (this.isObjectDragging && this.draggedObject) {
                this.isObjectDragging = false;
                this.draggedObject = null;
            }
        }
        this.drawObjects();
    }

    onMouseOut = (event) => {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawObjects();
    }

    toggleAddPointMode() {
        this.addPointMode = !this.addPointMode;
        if (!this.addPointMode) {
            this.addLineMode = false;
            this.tempLineStart = null;
        }
    }

    toggleAddLineMode() {
        this.addLineMode = !this.addLineMode;
        if (this.addLineMode) {
            this.addPointMode = false;
        }
    }

    deleteSelected() {
        console.log('admit');
        this.controller.handleDeleteSelectedObjects();
        this.drawObjects();
    }
}

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

        // Добавление куба на сцену
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);
        this.scene.add(cube);

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
    }

    addObject(object) {
        this.scene.add(object);
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

        if (this.controller) {
            this.controller.update();
        }
    };
}

