import { div } from 'three/examples/jsm/nodes/Nodes.js';
import { Point, Line} from './planeModel.js';
import observer from './utils/observer.js'
import { isPowerOfTwo } from 'three/src/math/MathUtils.js';

export class ToolBar { // TODO: mb i ne nado

}

export class Legend { // should to make it maximally independent to PlaneView 

    constructor(canvasId, legendID, containerID, controller) {
        this.controller = controller
        this.legendID = legendID
        this.canvas = document.getElementById(canvasId);
        this.legendElement = document.createElement('div');
        this.legendElement.setAttribute("class", "plain__legend");
        this.legendElement.id = legendID
        this.legendElement.style.marginTop = '10px';
        document.getElementById(containerID).appendChild(this.legendElement)
    }

    createLegendItems(objects) {
        document.getElementById(this.legendID).innerHTML = '';
        objects.forEach((item) => {

            const legendItem = document.createElement('div');
            legendItem.classList.add('plain__legend-item')

            const colorBox = document.createElement('div');
            colorBox.classList.add('plain__legend-color')

            const label = document.createElement('span');
            label.classList.add('plain__legend-label')
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
        this.canvas.width = 0;
        this.canvas.height = 0;
        this.canvasScale = 1;
        
        this.canvas.classList.add('planeCanvas')
        this.canvas.setAttribute('tabindex', '0');
        this.ctx = this.canvas.getContext('2d');
        this.pointOfOrigin = {x:0,y:0};
        this.canvasTypeByCoordinatesAxesLocation = 'leftUpper'
        this.canvasWrapper = null;

        this.relativeCanvasPosition = {x:0,y:0}
        
        this.gridSVG = null;
        this.gridFieldSize = {width:0,height:0};

        
        this.pointRadius = 3;
        this.lineWidth = 0.5; //TODO: make implementation on code
        this.pointSelectionTolerance = this.pointRadius;
        this.lineSelectionTolerance = this.lineWidth * 6;
    
        this.mouseCoordinatesElement = document.createElement('div');
        this.mouseCoordinatesElement.id = coordinatesID;
        this.mouseCoordinatesElement.setAttribute("name", "mouseCoordinates");
        this.mouseCoordinatesElement.textContent = '0, 0';
        
        this.KeyPressCount = 0;

        container.appendChild(this.mouseCoordinatesElement);

        this.controller = controller;
        this.container = container;
        this.gridSize = 20;
        // ??
        this.statement = null;
        this.previousStatement = null;
        this.splitLineMode = true;
        this.tempLineStart = null;
        // ??
        this.bindEventListeners();
        this.initCanvasWrapper();
        this.resizeCanvas(this.canvasWrapper.clientWidth, this.canvasWrapper.clientHeight)
        this.makeGirdOnSVG();
        this.subscribe();
        this.changeStatement(new DefaultStatement(this));        
    }

    updateGridSVGPosition() {
        let x = this.relativeCanvasPosition.x;
        let y = this.relativeCanvasPosition.y;
        console.log('canvasPos',this.relativeCanvasPosition)
        switch (this.canvasTypeByCoordinatesAxesLocation) {
            case 'leftUpper':
                break;
            case 'rightUpper':
                if (this.relativeCanvasPosition.x >= 0){
                    x = (x % this.gridSize) - this.gridSize;
                } else {
                    x = x % this.gridSize;
                }

                if (this.relativeCanvasPosition.y <= 0){
                    y = - (y % this.gridSize) - this.gridSize;
                } else {
                    y = - y % this.gridSize;
                }
                break;
            case 'leftLower':
                if (this.relativeCanvasPosition.x <= 0){
                    x = - (x % this.gridSize) - this.gridSize;
                } else {
                    x = - x % this.gridSize;
                }

                if (this.relativeCanvasPosition.y >= 0){
                    y = (y % this.gridSize) - this.gridSize;
                } else {
                    y = y % this.gridSize;
                }
                break;
            case 'rightLower':
                if (this.relativeCanvasPosition.x >= 0){
                    x = (x % this.gridSize) - this.gridSize;
                    console.log('first pos')
                } else {
                    x = x % this.gridSize;
                    console.log('second pos')
                }

                if (this.relativeCanvasPosition.y >= 0){
                    y = (y % this.gridSize) - this.gridSize;
                } else {
                    y = y % this.gridSize;
                }
                break;
        }

        this.gridSVG.style.transform = `translate(${x}px, ${y}px) scale(${this.canvasScale})`;
    }

    makeGirdOnSVG() { //TODO: rename that is set and resize
        // Создание SVG сетки
        if (!this.gridSVG) {
        this.gridSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        this.gridSVG.setAttribute('name', 'gridSVG');
        this.canvasWrapper.insertBefore(this.gridSVG, this.canvasWrapper.firstChild);
        }
        this.gridFieldSize.width = this.canvas.width;
        this.gridFieldSize.height = this.canvas.height;

        this.gridSVG.setAttribute("width", this.gridFieldSize.width + this.gridSize);
        this.gridSVG.setAttribute("height", this.gridFieldSize.height + this.gridSize);
        while(this.gridSVG.firstChild){
            this.gridSVG.removeChild(this.gridSVG.lastChild); // Тут нужно удалить всех детей, потому что при ресайзе остаются старые линии и руинят все.
        }
        let xDirection, yDirection, xStart, yStart;
        let gridWidth = parseInt(this.gridSVG.getAttribute('width'));
        let gridHeight = parseInt(this.gridSVG.getAttribute('height'));
        switch (this.canvasTypeByCoordinatesAxesLocation) {
            case 'leftUpper':
                xDirection = 1;
                yDirection = 1;
                xStart = 0;
                yStart = 0;
                break;
            case 'rightUpper':
                xDirection = -1;
                yDirection = 1;
                xStart = gridWidth;
                yStart = 0;
                break;
            case 'rightLower':
                xDirection = -1;
                yDirection = -1;
                xStart = gridWidth;
                yStart = gridHeight;
                break;
            case 'leftLower':
                xDirection = 1;
                yDirection = -1;
                xStart = 0;
                yStart = gridHeight;
                break;
            default:
                xDirection = 1;
                yDirection = 1;
                xStart = 0;
                yStart = 0;
                break;
        }
        // Рисуем горизонтальные линии
        for (let y = yStart; (yStart === 0 ? y <= gridHeight : y >= 0); y += this.gridSize * yDirection) {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', xStart);
            line.setAttribute('y1', y);
            line.setAttribute('x2', xStart + gridWidth * xDirection);
            line.setAttribute('y2', y);
            line.setAttribute('stroke', 'lightgray');
            this.gridSVG.appendChild(line);
        }

        // Рисуем вертикальные линии
        for (let x = xStart; (xStart === 0 ? x <= gridWidth : x >= 0); x += this.gridSize * xDirection) {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', x);
            line.setAttribute('y1', yStart);
            line.setAttribute('x2', x);
            line.setAttribute('y2', yStart + gridHeight * yDirection);
            line.setAttribute('stroke', 'lightgray');
            this.gridSVG.appendChild(line);
        }
    }

    initCanvasWrapper(){
        this.canvasWrapper = document.createElement('div');
        this.canvasWrapper.classList.add('plain__canvas-wrapper');
        this.container.insertBefore(this.canvasWrapper,this.container.firstChild);
        this.canvasWrapper.appendChild(this.canvas);
    }

    bindEventListeners() {
        this.canvas.addEventListener('click', this.onCanvasClick);
        this.canvas.addEventListener('contextmenu', this.handleContextMenu);
        this.canvas.addEventListener('mousedown', this.onMouseDown);
        this.canvas.addEventListener('mousemove', this.onMouseMove);
        this.canvas.addEventListener('mouseup', this.onMouseUp);
        this.canvas.addEventListener('mouseout', this.onMouseOut);
        this.canvas.addEventListener('keydown', this.onKeyDown);
        this.canvas.addEventListener('keyup', this.onKeyUp);
        this.canvas.addEventListener('wheel', this.onMouseScroll);
        window.addEventListener('resize',this.onWindowResize);
    }

    // /**
    //  * Configures the canvas based on the given type.
    //  * @param {('rightUpper'|'rightLower'|'leftUpper'|'leftLower')} type - The type of configuration.
    //  */
    configurePlaneAxesDirection(type) {
        // this
        this.pointOfOriginLocation = type;
        this.restoreAxesPosition(type);
    }

    restoreAxesPosition(type){
        this.ctx.setTransform(1, 0, 0, 1, 0, 0); // Сбрасываем трансформации
        switch (type){
            case 'rightUpper':
                this.ctx.scale(-1, 1);
                this.ctx.translate(-this.canvas.width, 0);
                this.pointOfOrigin.x = this.canvas.width
                this.pointOfOrigin.y = 0
                this.changeCanvasTypeEvent('rightUpper');
                break;
            case 'rightLower':
                this.ctx.scale(-1, -1);
                this.ctx.translate(-this.canvas.width, -this.canvas.height);
                this.pointOfOrigin.x = this.canvas.width
                this.pointOfOrigin.y = this.canvas.height
                this.changeCanvasTypeEvent('rightLower');
                break;
            case 'leftUpper':
                this.changeCanvasTypeEvent('leftUpper');
                console.log('default')
                break;
            case 'leftLower':
                this.ctx.scale(1, -1);
                this.ctx.translate(0, -this.canvas.height);
                this.pointOfOrigin.x = 0
                this.pointOfOrigin.y = this.canvas.height
                this.changeCanvasTypeEvent('leftLower');
                break;
            default:
                console.log('default')
        }
    }

    changeCanvasTypeEvent(type){
        this.canvasTypeByCoordinatesAxesLocation = type;
        this.makeGirdOnSVG();
    }

    changeStatement(type) {
        this.statement = type;
    }

    subscribe() {
        observer.subscribe('objectUpdated', () => {
            this.drawObjects()
        });
        observer.subscribe('canvasMoved', (data) => {
            this.moveCanvasByOther(data);
        })
        observer.subscribe('restorePosition', (data) => {
            this.restoreCanvasPosition(data);
        })
    }

    snapCoordinate(value) {
        let snapTolerance = 4
        let relativeToCell = value % this.gridSize;
        
        if (relativeToCell < 0) {
            relativeToCell += this.gridSize;
        }

        if (relativeToCell <= snapTolerance) {
            // snap to lower value
            return value - relativeToCell;
        } else if (relativeToCell >= (this.gridSize - snapTolerance)) {
            // snap to higher value
            return value + (this.gridSize - relativeToCell);
        } else
            return value
    }

    handleContextMenu = (event) =>  {
        event.preventDefault(); // Отменяем контекстное меню, которое на RMB
    }
    resizeCanvasWrapper(width, height) {
        this.canvasWrapper.style.width = `${width}px` ;
        this.canvasWrapper.style.height = `${height}px` ;
    }

    resizeCanvas(width, height) {
        // Изменяем размеры canvas
        this.canvas.width = width
        this.canvas.height = height
    
        // Очищаем canvas
        this.ctx.clearRect(0, 0, width, height);
    
        // Перерисовываем объекты с учетом новых размеров
        this.restoreAxesPosition(this.pointOfOriginLocation);
        // this.resizeCanvasWrapper(this.canvas.width,this.canvas.height);
        this.makeGirdOnSVG();
        this.drawObjects();
    }

    onWindowResize = (event) => {
        this.resizeCanvas(this.canvasWrapper.clientWidth, this.canvasWrapper.clientHeight)
    }

    moveCanvasByOther(data) {
        let coordinatesCorrection = data[0];
        let canvasType = data[1];
        
        if (canvasType !== this.canvasTypeByCoordinatesAxesLocation){
            console.log(canvasType,this.canvasTypeByCoordinatesAxesLocation)
            console.log(this.canvasTypeByCoordinatesAxesLocation,data)
            if (canvasType == 'rightLower'){

                if (this.canvasTypeByCoordinatesAxesLocation == 'leftLower'){
                    this.relativeCanvasPosition.y = coordinatesCorrection.y
                }
                if (this.canvasTypeByCoordinatesAxesLocation == 'rightUpper'){
                    this.relativeCanvasPosition.x = coordinatesCorrection.x
                } 
            }
            if (canvasType == 'leftLower'){

                if (this.canvasTypeByCoordinatesAxesLocation == 'rightLower'){
                    this.relativeCanvasPosition.y = coordinatesCorrection.y
                }
                if (this.canvasTypeByCoordinatesAxesLocation == 'rightUpper'){
                    this.relativeCanvasPosition.y = coordinatesCorrection.x
                }  
            }
            if (canvasType == 'rightUpper'){

                if (this.canvasTypeByCoordinatesAxesLocation == 'rightLower'){
                    this.relativeCanvasPosition.x = coordinatesCorrection.x
                }
                if (this.canvasTypeByCoordinatesAxesLocation == 'leftLower'){
                    this.relativeCanvasPosition.x = coordinatesCorrection.y
                }  
            }
            this.updateGridSVGPosition()
            this.drawObjects();  
        }
    }

    convertGlobalCoordinatesToLocal(input) {
        if (typeof input === 'object' && input.hasOwnProperty('x') && input.hasOwnProperty('y')) {
            return {
                x: input.x - this.relativeCanvasPosition.x,
                y: input.y - this.relativeCanvasPosition.y
            };
        } else if (typeof input === 'object' && input.hasOwnProperty('x1') && input.hasOwnProperty('y1') && input.hasOwnProperty('x2') && input.hasOwnProperty('y2')) {
            return {
                x1: input.x1 - this.relativeCanvasPosition.x,
                y1: input.y1 - this.relativeCanvasPosition.y,
                x2: input.x2 - this.relativeCanvasPosition.x,
                y2: input.y2 - this.relativeCanvasPosition.y
            };
        } else if (input instanceof Point) {
            return new Point({
                x: input.pointX - this.relativeCanvasPosition.x,
                y: input.pointY - this.relativeCanvasPosition.y,
                name: input.name
            });
        } else if (input instanceof Line) {
            return new Line({
                point1: new Point({
                    x: input.linePointX1 - this.relativeCanvasPosition.x,
                    y: input.linePointY1 - this.relativeCanvasPosition.y,
                    name: input.firstPoint.name
                }),
                point2: new Point({
                    x: input.linePointX2 - this.relativeCanvasPosition.x,
                    y: input.linePointY2 - this.relativeCanvasPosition.y,
                    name: input.secondPoint.name
                }),
                name: input.name
            });
        } else {
            throw new Error('convertGlobalCoordinatesToLocal получил неподдерживаемый тип входных данных');
        }
    }
    
    convertLocalCoordinatesToGlobal(input) {
        if (typeof input === 'object' && input.hasOwnProperty('x') && input.hasOwnProperty('y')) {
            return {
                x: input.x + this.relativeCanvasPosition.x,
                y: input.y + this.relativeCanvasPosition.y
            };
        } else if (typeof input === 'object' && input.hasOwnProperty('x1') && input.hasOwnProperty('y1') && input.hasOwnProperty('x2') && input.hasOwnProperty('y2')) {
            return {
                x1: input.x1 + this.relativeCanvasPosition.x,
                y1: input.y1 + this.relativeCanvasPosition.y,
                x2: input.x2 + this.relativeCanvasPosition.x,
                y2: input.y2 + this.relativeCanvasPosition.y
            };
        } else if (input instanceof Point) {
            return new Point({
                x: input.pointX + this.relativeCanvasPosition.x,
                y: input.pointY + this.relativeCanvasPosition.y,
                name: input.name
            });
        } else if (input instanceof Line) {
            return new Line({
                point1: new Point({
                    x: input.linePointX1 + this.relativeCanvasPosition.x,
                    y: input.linePointY1 + this.relativeCanvasPosition.y,
                    name: input.firstPoint.name
                }),
                point2: new Point({
                    x: input.linePointX2 + this.relativeCanvasPosition.x,
                    y: input.linePointY2 + this.relativeCanvasPosition.y,
                    name: input.secondPoint.name
                }),
                name: input.name
            });
        } else {
            throw new Error('convertLocalCoordinatesToGlobal получил неподдерживаемый тип входных данных');
        }
    }

    drawCanvasAxes(){
        this.ctx.globalAlpha = 0.5;
        this.ctx.beginPath();
        this.ctx.arc(-this.relativeCanvasPosition.x, -this.relativeCanvasPosition.y, this.pointRadius, 0, Math.PI * 2);
        this.ctx.fillStyle = 'orange';
        this.ctx.fill();
        this.ctx.globalAlpha = 1;
    }

    drawObjects() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.controller.handleObjects().forEach((obj) => {
            // console.log(obj)
            if (obj instanceof Point) {
                if (this.controller.handleCheckObjectSelection(obj)) {
                    this.ctx.fillStyle = 'blue'; // Устанавливаем синий цвет для выделенных линий
                } else {
                    this.ctx.fillStyle = 'black'; // Устанавливаем черный цвет для невыделенных линий
                }
                this.ctx.beginPath();
                obj = this.convertGlobalCoordinatesToLocal(obj);
                this.ctx.arc(obj.pointX, obj.pointY, this.pointRadius, 0, Math.PI * 2);
                this.ctx.fill();
            } else if (obj instanceof Line) {
                if (this.controller.handleCheckObjectSelection(obj)) {
                    this.ctx.strokeStyle = 'blue'; // Устанавливаем синий цвет для выделенных линий
                } else {
                    this.ctx.strokeStyle = 'black'; // Устанавливаем черный цвет для невыделенных линий
                }
                this.ctx.beginPath();
                obj = this.convertGlobalCoordinatesToLocal(obj);
                this.ctx.moveTo(obj.linePointX1, obj.linePointY1);
                this.ctx.lineTo(obj.linePointX2, obj.linePointY2);
                this.ctx.stroke();
            }
        });
        this.drawCanvasAxes();
        this.Legend.render(this.controller.handleObjects()); //Legend
    }

    drawObjectOnline(event) { //TODO: rename and optimise
        // const xSnapped = this.snapCoordinate(this.canvasCoordinates(event).x);
        // const ySnapped = this.snapCoordinate(this.canvasCoordinates(event).y);
        let x = this.canvasCoordinates(event).x;
        let y = this.canvasCoordinates(event).y;
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
            this.ctx.lineTo(x, y);
            this.ctx.stroke();
        }
        this.ctx.beginPath();
        this.ctx.arc(x, y, this.pointRadius, 0, Math.PI * 2);
        this.ctx.fillStyle = 'rgba(128, 128, 128, 0.5)'; // Устанавливаем цвет заливки серым
        this.ctx.fill();

        // this.dragNow = {x:xSnapped, y:ySnapped}
    }

    drawSelectionRect() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // нужно чтобы внутри прямоугольной области выделения удалялись предыдущие области
        //выделения
        this.drawObjects();// нужно чтобы не пропадали точки и линии во время рисования прямоугольника
        this.ctx.beginPath();
        this.ctx.rect(this.statement.dragStart.x, 
            this.statement.dragStart.y, 
            this.statement.dragNow.x - this.statement.dragStart.x, 
            this.statement.dragNow.y - this.statement.dragStart.y);
        this.ctx.strokeStyle = 'blue';
        this.ctx.stroke();
    }

    canvasCoordinates(event){
        let canvasCorrection = this.canvas.getBoundingClientRect();
        
        let x = Math.abs(this.pointOfOrigin.x - (event.clientX - canvasCorrection.left));
        let y = Math.abs(this.pointOfOrigin.y - (event.clientY - canvasCorrection.top));
        return {
            x: Math.floor(x),
            y: Math.floor(y),
        };
    }

    drawCanvasCoordinates(event){
        this.mouseCoordinatesElement.textContent = `${this.canvasCoordinates(event).x}, ${this.canvasCoordinates(event).y}`;
    }

    restoreCanvasPosition(data){
        console.log('restore')
        this.relativeCanvasPosition ={x:0,y:0};
        this.updateGridSVGPosition();
        this.drawObjects();
    }
    

    onKeyDown = (event) => {

        if (event.key === 'Control'){
            console.log(event)
            observer.dispatch('restorePosition',this.canvasTypeByCoordinatesAxesLocation);
        }

        if (event.key === 'Alt' && !(this.statement instanceof CanvasMoveStatement)) {
            event.preventDefault();
            console.log('set new statement' )
            this.previousStatement = this.statement;
            this.statement = new CanvasMoveStatement(this);
            this.statement.onKeyDown();
        }
    }

    onKeyUp = (event) => {
        if (event.key === 'Alt') {
            event.preventDefault();
            this.statement.onKeyUp();
            this.statement = this.previousStatement
        }
    }
    
    onCanvasClick = (event) => {
        // console.log(this.statement)
        this.statement.onCanvasClick(event);
        this.canvas.focus();
        console.log(this.canvas)
    }

    onMouseDown = (event) => {
        this.statement.onMouseDown(event);
        
    }

    onMouseMove = (event) => {
        this.statement.onMouseMove(event)
        // Отображение координат мышки на canvas
        this.drawCanvasCoordinates(event)
    }


    onMouseUp = (event) => {
        this.statement.onMouseUp(event);
    }

    onMouseOut = (event) => {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawObjects();
        this.statement.onMouseOut();
    }

    onMouseScroll = (event) => {
        this.statement.onMouseScroll(event);
    }

    toggleDefaultMode() {
        this.changeStatement(new DefaultStatement(this));
    }
    toggleAddPointMode() {
        if (!(this.statement instanceof AddPointStatement)){
            this.changeStatement(new AddPointStatement(this))
        }
    }

    toggleAddLineMode() {
        if (!(this.statement instanceof AddLineStatement)){
            this.changeStatement(new AddLineStatement(this))
        }
    }

    deleteSelected() {
        console.log('admit');
        this.controller.handleDeleteSelectedObjects();
        this.drawObjects();
    }
}
class Statement {
    constructor(planeView) {
        this.planeView = planeView;
        this.dragStart = { x:null, y:null };
        this.dragNow = { x:null, y:null };
        this.dragEnd = { x:null, y:null };
    }

    onMouseOut(event) {}
    onCanvasClick(event) {}
    onMouseDown(event) {}
    onMouseMove(event) {}
    onMouseUp(event) {}
    onKeyDown(event) {}
    onKeyUp(event) {}
    onMouseScroll(event) {}
}

class CanvasMoveStatement extends Statement {
    constructor(planeView){
        super(planeView);
        this.isClicked = false;
        this.startRelativeCanvasPosition = {x:0,y:0};
    }

    setRelativeCanvasPosition() {
        this.planeView.relativeCanvasPosition = {
            x: this.startRelativeCanvasPosition.x - (this.dragNow.x - this.dragStart.x),
            y: this.startRelativeCanvasPosition.y - (this.dragNow.y - this.dragStart.y)
        };
        observer.dispatch('canvasMoved', [this.planeView.relativeCanvasPosition, this.planeView.canvasTypeByCoordinatesAxesLocation]);
    }

    onMouseDown(event) {
        this.isClicked = true;
        console.log(this.isClicked);
        this.dragStart = this.planeView.canvasCoordinates(event);
        this.startRelativeCanvasPosition = {
            x: this.planeView.relativeCanvasPosition.x,
            y: this.planeView.relativeCanvasPosition.y
        };
        console.log(`Drag started at: (${this.dragStart.x}, ${this.dragStart.y})`);
    }

    onMouseMove(event) {
        if (this.isClicked) {
            this.dragNow = this.planeView.canvasCoordinates(event);
            this.setRelativeCanvasPosition();
            this.planeView.drawObjects();
            this.planeView.updateGridSVGPosition();
            console.log(`Drag now at: (${this.dragNow.x}, ${this.dragNow.y})`);
        }
    }

    onMouseUp(event) {
        this.dragEnd = this.planeView.canvasCoordinates(event);
        this.isClicked = false;
        console.log(`Drag started at: (${this.dragStart.x}, ${this.dragStart.y})`);
        console.log(`Drag end at: (${this.dragEnd.x}, ${this.dragEnd.y})`);
    }

    onMouseOut(event) {
        this.onKeyUp(event);
    }
    
    onKeyDown(event) {
        this.planeView.canvas.style.cursor = 'move';
    }
      
    onKeyUp(event) {
        this.planeView.canvas.style.cursor = 'default';
    }

    onMouseScroll(event) {
        console.log("scroll")
        this.planeView.canvasScale = this.planeView.canvasScale + 1;
        
    }

}

//TODO: add MagnetStatement;
//TODO: invole SelectionDrag Statemnet;
class DefaultStatement extends Statement {
    constructor(planeView) {
        super(planeView);
        this.isSelectionDragging = false;
        this.draggedObectName = null;
        this.isPlaneMove = null;
        this.draggedObject = null;
        // this.dragStartGlobal = null;
        // this.dragNowGlobal = null;
        // this.dragEndGlobal = null;
    }

    onCanvasClick(event) {
        //TODO: make to block selection while dragging
        
        if (!(this.dragStart.x - this.dragEnd.x)||!(this.dragStart.y - this.dragEnd.y)){
            console.log(this.dragStartStart, this.dragEnd)
            const { x, y } = this.planeView.convertLocalCoordinatesToGlobal(this.planeView.canvasCoordinates(event));
            const object = this.planeView.controller.handleFindObjectName({ x, y, 
                width:this.planeView.lineSelectionTolerance, radius: this.planeView.pointSelectionTolerance });
            if (object) {
                this.planeView.controller.handleSelectObjectByName(object.name);
            }
        }
    }

    onMouseDown(event) {
        const LEFT_BUTTON = 0;
        const RIGHT_BUTTON = 2;

        if (event.button === RIGHT_BUTTON) {
            this.dragStart = this.planeView.canvasCoordinates(event);
            this.isSelectionDragging = true;
        } else if (event.button === LEFT_BUTTON) {
            this.dragStart = this.planeView.canvasCoordinates(event);
            let dragStartGlobal = this.planeView.convertLocalCoordinatesToGlobal(this.dragStart);
            const object = this.planeView.controller.handleFindObjectName({ x: dragStartGlobal.x, y: dragStartGlobal.y, radius: this.planeView.pointSelectionTolerance });
            if (object) {
                this.draggedObject = object;
                console.log(this.draggedObject)
            }
        }
    }

    onMouseMove(event) {
        if (this.isSelectionDragging) {
            this.dragNow = this.planeView.canvasCoordinates(event);
            this.planeView.drawSelectionRect();
        } else if (this.draggedObject) {
            this.dragNow = this.planeView.canvasCoordinates(event);
            let dragNowGlobal = this.planeView.convertLocalCoordinatesToGlobal(this.dragNow);
            const snappedX = this.planeView.snapCoordinate(dragNowGlobal.x);
            const snappedY = this.planeView.snapCoordinate(dragNowGlobal.y);

            if (this.draggedObject.pointType === 'point') {
                this.planeView.controller.handleUpdateObjectCoordinates(this.draggedObject.name, snappedX, snappedY);
            } else if (this.draggedObject.pointType === 'line') { //Legacy ?
                this.planeView.controller.handleUpdateObjectCoordinates(this.draggedObject.name, snappedX, snappedY, this.draggedObject.pointType);
            }

            this.planeView.drawObjects();
        }
    }

    onMouseUp(event) {
        const LEFT_BUTTON = 0;
        const RIGHT_BUTTON = 2;
        this.dragEnd = this.planeView.canvasCoordinates(event);
        if (event.button === RIGHT_BUTTON) {
            this.isSelectionDragging = false;
            const rect = this.getSelectionRect();
            this.planeView.controller.handleClearSelectedObjects();
            this.planeView.controller.handleSelectObjectsInRect(rect);
        }
        if (event.button == LEFT_BUTTON) {
            if (this.draggedObject) {
                this.draggedObject = null;
            }
        }
        this.planeView.drawObjects();
    }
    
    
    getSelectionRect() {
        let rectangle = {
            x1: Math.min(this.dragStart.x, this.dragEnd.x),
            y1: Math.min(this.dragStart.y, this.dragEnd.y),
            x2: Math.max(this.dragStart.x, this.dragEnd.x),
            y2: Math.max(this.dragStart.y, this.dragEnd.y),
        };
        return this.planeView.convertLocalCoordinatesToGlobal(rectangle);
    }

}

class AddPointStatement extends Statement {
    constructor(planeView) {
    super(planeView);
    }

    splitSelectedLine(name){ //TODO: хз вообще что это такое
        // this.planeView.controller.handleSplitSelectedLineByName(name);
    }
    
    onCanvasClick(event) {
        const { x, y } = this.planeView.convertLocalCoordinatesToGlobal(this.planeView.canvasCoordinates(event));
        const coordinates = {
            x: this.planeView.snapCoordinate(x),
            y: this.planeView.snapCoordinate(y),
        };
        if (this.planeView.splitLineMode){
            const obj = this.planeView.controller.handleFindObjectName({x, y, width: this.planeView.pointSelectionTolerance});
            if (obj){
                console.log("name",obj.name)
                this.planeView.controller.handleSplitSelectedLine({name:obj.name, x, y});
            } else {
                this.planeView.controller.handleCreateObject(coordinates);
            }
        }
        this.planeView.drawObjects();
    }
    
    onMouseMove(event) {
        this.planeView.drawObjectOnline(event);
    }
}
    
class AddLineStatement extends Statement {
    constructor(planeView) {
        super(planeView);
        this.tempLineStartGlobal = null;
        // this.tempLineStart = null; //TODO: make conclusion || couse render func in planeView also need this data.
        // Короче случше бы чтобы темп лайн старт был только здесь и не был в planeView, но там он тоже нужен для рисования онлайн
    }
    
    onCanvasClick(event) {
        const { x, y } = this.planeView.canvasCoordinates(event);
        const { x:globalX, y:globalY } = this.planeView.convertLocalCoordinatesToGlobal(this.planeView.canvasCoordinates(event));
        let globalCoordinates = this.planeView.convertGlobalCoordinatesToLocal({
            x: this.planeView.snapCoordinate(x),
            y: this.planeView.snapCoordinate(y),
        });
        let localCoordinates = {
            x: this.planeView.snapCoordinate(x),
            y: this.planeView.snapCoordinate(y),
        };
        if (this.planeView.splitLineMode){
            if (this.planeView.tempLineStart === null) {
                console.log("click", {x,y})
                console.log("click", {globalX,globalY})
                this.planeView.tempLineStart = {x,y};
                this.tempLineStartGlobal = {x:globalX,y:globalY}
            } else {
                const objStart = this.planeView.controller.handleFindObjectName({
                    x: this.tempLineStartGlobal.x,
                    y: this.tempLineStartGlobal.y,
                    width: this.planeView.pointSelectionTolerance,
                });
                const checkPointNearStart = this.planeView.controller.handleFindObjectName({
                    x: this.tempLineStartGlobal.x,
                    y: this.tempLineStartGlobal.y,
                    radius: this.planeView.pointSelectionTolerance,
                });
                const objEnd = this.planeView.controller.handleFindObjectName({
                    x: globalCoordinates.x,
                    y: globalCoordinates.y,
                    width: this.planeView.pointSelectionTolerance,
                });
                const checkPointNearEnd = this.planeView.controller.handleFindObjectName({
                    x: globalCoordinates.x,
                    y: globalCoordinates.y,
                    radius: this.planeView.pointSelectionTolerance,
                });
                if (objStart && !checkPointNearStart){
                    console.log("nameStart",objStart.name)
                    this.tempLineStartGlobal = this.planeView.controller.handleSplitSelectedLine({name:objStart.name, 
                        x:this.tempLineStartGlobal.x, y:this.tempLineStartGlobal.y});
                    console.log("this.tempLineStartGlobal",this.tempLineStartGlobal)
                     
                } 
                if (objEnd && !checkPointNearEnd){
                    console.log("nameEnd",objEnd.name)
                    globalCoordinates = this.planeView.controller.handleSplitSelectedLine({name:objEnd.name, globalX, globalY});
                    console.log("this.planeView.coordinates",globalCoordinates)

                }
                const lineCoordinates = {
                    x1: this.tempLineStartGlobal.x,
                    y1: this.tempLineStartGlobal.y,
                    x2: globalX,
                    y2: globalY,
                    radius: this.planeView.pointRadius,
                };
                this.planeView.controller.handleCreateObject(lineCoordinates);
                this.planeView.tempLineStart = null;
                this.tempLineStartGlobal = null;


            }
        } else {    
            if (this.planeView.tempLineStart === null || this.tempLineStartGlobal) {
                this.planeView.tempLineStart = localCoordinates;
                this.tempLineStartGlobal = globalCoordinates;
            } else {
                const lineCoordinates = {
                    x1: this.planeView.tempLineStartGlobal.x,
                    y1: this.planeView.tempLineStartGlobal.y,
                    x2: globalCoordinates.x,
                    y2: globalCoordinates.y,
                    radius: this.planeView.pointRadius,
                };
                this.planeView.controller.handleCreateObject(lineCoordinates);
                this.planeView.tempLineStart = null;
                this.tempLineStartGlobal = null;
            }
        }
        this.planeView.drawObjects();
    }

    onMouseMove(event) {
        this.planeView.drawObjectOnline(event);
    }
}
