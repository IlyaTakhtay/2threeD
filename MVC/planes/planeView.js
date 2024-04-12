import { Point, Line} from './planeModel.js';
import observer from './utils/observer.js'
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
                colorBox.style.backgroundColor = 'black';
                label.textContent = item.name;
            }
            
            if (item instanceof Line) {
                colorBox.style.backgroundColor = 'blue';
                label.textContent = item.name;
            }
            
            label.addEventListener('dblclick', this.updateObjectName);
            label.addEventListener('contextmenu', this.updateCoordinates);
            // label.addEventListener('contextmenu', this.handleContextMenu);
            legendItem.appendChild(colorBox);
            legendItem.appendChild(label);
            this.legendElement.appendChild(legendItem);
        });
    }
    
    updateObjectName = (event) => {
        if (event.button == 0){
            const element = event.target; // Элемент, вызвавший событие
            const name = element.textContent;
            const newName = prompt("Введите новое имя:", name);
            if (newName) {
                this.controller.handleUpdateObjectName(name, newName);
                element.textContent = newName; // Обновляем отображаемое имя прямо здесь, если это требуется
            }
        }
    }

    updateCoordinates = (event) => {
        console.log("эээээ")
        if (event.button == 2){
            console.log("normis")
            const element = event.target;
            const name = element.textContent;
            const newCoord = prompt("Введите новые координаты формата x;y");
            if (newCoord) {
                const [x,y] = newCoord.split(";");
                this.controller.handleUpdateObjectCoordinates(name, x, y);
            }
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
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // нужно чтобы при отпускании мышки не зависал пямоугольник выделения
        this.controller.handleObjects().forEach((obj) => {
            if (obj instanceof Point) {
                this.ctx.beginPath();
                this.ctx.arc(obj.pointX, obj.pointY, 3, 0, Math.PI * 2);
                this.ctx.fill();
            } else if (obj instanceof Line) {
                this.ctx.beginPath();
                this.ctx.moveTo(obj.linePointX1, obj.linePointY1);
                this.ctx.lineTo(obj.linePointX2, obj.linePointY2);
                this.ctx.stroke();
            }
        });

        this.Legend.render(this.controller.handleObjects()) //Legend
    }

    drawMovingPoint() {
        const xSnapped = this.snapCoordinate(this.dragNow.x);
        const ySnapped = this.snapCoordinate(this.dragNow.y);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawObjects();// нужно чтобы не пропадали точки и линии во время переноса объекта
        this.ctx.beginPath();
        this.ctx.arc(xSnapped, ySnapped, 3, 0, Math.PI * 2);
        this.ctx.fill();
        this.dragNow = {x:xSnapped, y:ySnapped}
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
            x: event.clientX - canvasCorrection.left,
            y: event.clientY - canvasCorrection.top,
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

        if ((event.button == 0) && (this.addPointMode == false)) { //Для перемещения точки
            this.dragStart = this.canvasCoordinates(event)
            const object = this.controller.handleFindObjectName({ x: this.dragStart.x, y: this.dragStart.y, radius: 3 });
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
            // this.drawMovingPoint();
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

