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
        this.legendElement.setAttribute("class", "legend");
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
        this.canvas.width = 320;
        this.canvas.height = 320;
    
        this.ctx = this.canvas.getContext('2d');

        this.pointOfOrigin = {x:0,y:0};
        this.pointRadius = 3;
        this.lineWidth = 0.5; //TODO: make implementation on code
        this.pointSelectionTolerance = this.pointRadius;
        this.lineSelectionTolerance = this.lineWidth * 6;
    
        this.mouseCoordinatesElement = document.createElement('div');
        this.mouseCoordinatesElement.id = coordinatesID;
        this.mouseCoordinatesElement.setAttribute("name", "mouseCoordinates");
        this.mouseCoordinatesElement.textContent = '0, 0';
        
        container.appendChild(this.canvas); // Временный коммент для того, чтобы настроить адаптив.
        container.appendChild(this.mouseCoordinatesElement);

        this.controller = controller;
        this.container = container;
        this.gridSize = 20;
        // ??
        this.statement = null;
        this.splitLineMode = true;
        this.tempLineStart = null;
        // ??
        this.makeGirdOnSVG();
        this.bindEventListeners();
        this.subscribe();
        this.changeStatement(new DefaultStatement(this));
    }

    makeGirdOnSVG() { //TODO: rename that is set and resize
        // Создание SVG сетки
        let gridSVG = this.container.querySelector('[name="gridSVG"]');
        if (!gridSVG) {
          gridSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
          gridSVG.setAttribute('name', 'gridSVG');
          this.container.insertBefore(gridSVG, this.container.firstChild);
        }
        gridSVG.setAttribute("width", this.canvas.width);
        gridSVG.setAttribute("height", this.canvas.height);
        while(gridSVG.firstChild){
            gridSVG.removeChild(gridSVG.lastChild); // Тут нужно удалить всех детей, потому что при ресайзе остаются старые линии и руинят все.
        }
        
        console.log("grid", this.container)
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
    configurePlaneAxesDirection(type) {
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

    changeStatement(type) {
        this.statement = type;
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

    resizeCanvas(width, height) {
        // Изменяем размеры canvas
        this.canvas.width = width;
        this.canvas.height = height;
    
        // Очищаем canvas
        this.ctx.clearRect(0, 0, width, height);
    
        // Перерисовываем объекты с учетом новых размеров
        this.restoreAxesPosition(this.pointOfOriginLocation);
        this.makeGirdOnSVG();
        this.drawObjects();
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
        this.ctx.rect(this.statement.dragStart.x, 
            this.statement.dragStart.y, 
            this.statement.dragNow.x - this.statement.dragStart.x, 
            this.statement.dragNow.y - this.statement.dragStart.y);
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
        console.log(this.statement)
        this.statement.onCanvasClick(event);
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
}

//TODO: add MagnetStatement;
//TODO: invole SelectionDrag Statemnet;
class DefaultStatement extends Statement {
    constructor(planeView) {
        super(planeView);
        this.isSelectionDragging = false;
        this.draggedObectName = null;
    }

    onCanvasClick(event) {
        //TODO: make to block selection while dragging
        const { x, y } = this.planeView.canvasCoordinates(event);
        const object = this.planeView.controller.handleFindObjectName({ x, y, 
            width:this.planeView.lineSelectionTolerance, radius: this.planeView.pointSelectionTolerance });
        if (object) {
            this.planeView.controller.handleSelectObjectByName(object.name);
        }
    }

    onMouseDown(event) {
        const LEFT_BUTTON = 0;
        const RIGHT_BUTTON = 2;

        if (event.button === RIGHT_BUTTON) {
            this.dragStart = this.planeView.canvasCoordinates(event);
            this.planeView.isSelectionDragging = true;
        } else if (event.button === LEFT_BUTTON) {
            this.dragStart = this.planeView.canvasCoordinates(event);
            const object = this.planeView.controller.handleFindObjectName({ x: this.dragStart.x, y: this.dragStart.y, radius: this.planeView.pointSelectionTolerance });
            if (object) {
                this.draggedObject = object;
                console.log(this.draggedObject)
            }
        }
    }

    onMouseMove(event) {
        if (this.planeView.isSelectionDragging) {
            this.dragNow = this.planeView.canvasCoordinates(event);
            this.planeView.drawSelectionRect();
        } else if (this.draggedObject) {
            this.dragNow = this.planeView.canvasCoordinates(event);
            const snappedX = this.planeView.snapCoordinate(this.dragNow.x);
            const snappedY = this.planeView.snapCoordinate(this.dragNow.y);

            if (this.draggedObject.type === 'Point') {
                this.planeView.controller.handleUpdateObjectCoordinates(this.draggedObject.name, snappedX, snappedY);
            } else if (this.draggedObject.type === 'Line') { //Legacy ?
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
            this.planeView.isSelectionDragging = false;
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
        return {
            x1: Math.min(this.dragStart.x, this.dragEnd.x),
            y1: Math.min(this.dragStart.y, this.dragEnd.y),
            x2: Math.max(this.dragStart.x, this.dragEnd.x),
            y2: Math.max(this.dragStart.y, this.dragEnd.y),
        };
    }
}

class AddPointStatement extends Statement {
    constructor(planeView) {
    super(planeView);
    }

    splitSelectedLine(name){ //TODO: move to option
        this.planeView.controller.handleSplitSelectedLineByName(coordinates);
    }
    
    onCanvasClick(event) {
        const { x, y } = this.planeView.canvasCoordinates(event);
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
        // this.tempLineStart = null; //TODO: make conclusion || couse render func in planeView also need this data.
    }
    
    onMouseMove(event) {
        this.planeView.drawObjectOnline(event);
    }
    
    onCanvasClick(event) {
        const { x, y } = this.planeView.canvasCoordinates(event);
        let coordinates = {
            x: this.planeView.snapCoordinate(x),
            y: this.planeView.snapCoordinate(y),
        };
        if (this.planeView.splitLineMode){
            if (this.planeView.tempLineStart === null) {
                console.log("click", {x,y})
                this.planeView.tempLineStart = {x,y};
            } else {
                const objStart = this.planeView.controller.handleFindObjectName({x:this.planeView.tempLineStart.x, y:this.planeView.tempLineStart.y, 
                    width: this.planeView.pointSelectionTolerance});
                const checkPointNearStart = this.planeView.controller.handleFindObjectName({x:this.planeView.tempLineStart.x, y:this.planeView.tempLineStart.y, 
                    radius: this.planeView.pointSelectionTolerance});
                const objEnd = this.planeView.controller.handleFindObjectName({x:x, y:y, 
                    width: this.planeView.pointSelectionTolerance});
                const checkPointNearEnd = this.planeView.controller.handleFindObjectName({x:x, y:y, 
                    radius: this.planeView.pointSelectionTolerance});
                if (objStart && !checkPointNearStart){
                    console.log("nameStart",objStart.name)
                    this.planeView.tempLineStart = this.planeView.controller.handleSplitSelectedLine({name:objStart.name, 
                        x:this.planeView.tempLineStart.x, y:this.planeView.tempLineStart.y});
                    console.log("this.planeView.tempLineStart",this.planeView.tempLineStart)
                     
                } 
                if (objEnd && !checkPointNearEnd){
                    console.log("nameEnd",objEnd.name)
                    coordinates = this.planeView.controller.handleSplitSelectedLine({name:objEnd.name, x, y});
                    console.log("this.planeView.coordinates",coordinates)

                }
                const lineCoordinates = {
                    x1: this.planeView.tempLineStart.x,
                    y1: this.planeView.tempLineStart.y,
                    x2: x,
                    y2: y,
                    radius: this.planeView.pointRadius,
                };
                this.planeView.controller.handleCreateObject(lineCoordinates);
                this.planeView.tempLineStart = null;

            }
        } else {    
            if (this.planeView.tempLineStart === null) {
                this.planeView.tempLineStart = coordinates;
            } else {
                const lineCoordinates = {
                    x1: this.planeView.tempLineStart.x,
                    y1: this.planeView.tempLineStart.y,
                    x2: coordinates.x,
                    y2: coordinates.y,
                    radius: this.planeView.pointRadius,
                };
                this.planeView.controller.handleCreateObject(lineCoordinates);
                this.planeView.tempLineStart = null;
            }
        }
        this.planeView.drawObjects();
    }
}
