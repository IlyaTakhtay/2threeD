import { Point, Line} from './planeModel.js';

export class PlaneView {

    constructor(canvasId, controller) {
        this.controller = controller 
        this.gridSize = 20
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        // ??
        this.addLineMode = false;
        this.addPointMode = false;
        this.tempLineStart = null;
        this.isSelectionDragging = false;
        this.isObjectDragging = false;
        // ??
        this.dragStartX = 0;
        this.dragStartY = 0;
        this.dragEndX = 0;
        this.dragEndY = 0;

        this.makeGirdOnSVG();
        this.bindEventListeners();
    }

    makeGirdOnSVG(){
        // Создание SVG сетки
        const gridSVG = document.getElementById('gridSVG');
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
    //
    bindEventListeners() {
        this.canvas.addEventListener('click', this.onCanvasClick);
        this.canvas.addEventListener('contextmenu', this.handleContextMenu);
        this.canvas.addEventListener('mousedown', this.onMouseDown);
        this.canvas.addEventListener('mousemove', this.onMouseMove);
        this.canvas.addEventListener('mouseup', this.onMouseUp);
    }

    onCanvasClick = (event) => {
        const canvasCorrection = this.canvas.getBoundingClientRect();
        const x = event.clientX - canvasCorrection.left;
        const y = event.clientY - canvasCorrection.top;
        // const x = event.clientX;
        // const y = event.clientY;
        if (this.addPointMode) {
            const pointCoordinates = { x: x, y: y };
            this.controller.handleCreateObject(pointCoordinates);
            console.log('point', pointCoordinates)
        } else if (this.addLineMode) {
            if (this.tempLineStart === null) {
                this.tempLineStart = { x1: x, y1: y };
            } else {
                const lineCoordinates = { x1: this.tempLineStart.x1, y1: this.tempLineStart.y1, x2: x, y2: y };
                this.controller.handleCreateObject(lineCoordinates);
                this.tempLineStart = null;
            }
        }
        this.drawObjects();
    }

    // Разобраться как работает!!!!!!!!!!!!! ТАК ОНО ЕЩЁ И НЕ РАБОТАЕТ + ЕЩЁ НАДО onMOVE а не на onMouseUP
    snapCoordinate(value) {
        let snapTolerance = 5
        let moduloValue = value % this.gridSIze;

        if (moduloValue <= snapTolerance) {
            // snap to lower value
            return value - moduloValue;
        } else if (moduloValue >= (this.gridSIze - snapTolerance)) {
            // snap to higher value
            return value + (this.gridSIze - moduloValue);
        } else
            return value
    }
    // Разобраться как работает!!!!!!!!!!!!! ТАК ОНО ЕЩЁ И НЕ РАБОТАЕТ

    handleContextMenu = (event) =>  {
        event.preventDefault(); // Отменяем контекстное меню, которое на RMB
    }

    onMouseDown = (event) => {
        const canvasCorrection = this.canvas.getBoundingClientRect();
        if (event.button == 2) { //Для выделения прямоугольником
            this.dragStartX = event.clientX - canvasCorrection.left;
            this.dragStartY = event.clientY - canvasCorrection.top;
            this.isSelectionDragging = true;
        }
        if ((event.button == 0) && (this.addPointMode == false)) { //Для перемещения точки
            this.dragStartX = event.clientX - canvasCorrection.left
            this.dragStartY = event.clientY - canvasCorrection.top
            if ( this.controller.handleDeleteObject({x: this.dragStartX , y: this.dragStartY, radius: 3}) == true ){
                this.isObjectDragging = true;
            }
        }
    }

    onMouseMove = (event) => {

        if (this.isSelectionDragging) { // Для выделения прямоугольником
            const rect = this.canvas.getBoundingClientRect();
            this.dragEndX = event.clientX - rect.left;
            this.dragEndY = event.clientY - rect.top;
            this.drawSelectionRect();
        }

        if (this.isObjectDragging) {
            const rect = this.canvas.getBoundingClientRect();
            this.dragEndX = event.clientX - rect.left;
            this.dragEndY = event.clientY - rect.top;
            this.drawMovingPoint();
        }

        // Просмоторщик координат мышки
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'right';
        this.ctx.textBaseline = 'bottom';
        
        this.ctx.clearRect(350, 385, 50, 20);
        this.ctx.fillText(event.clientX  + ', ' + event.clientY, 400, 400);

        // Просмоторщик координат мышки
    }


    onMouseUp = (event) => {
        
        if (event.button == 2){ // Для выделения прямоугольником
            this.isSelectionDragging = false;
            const rect = {
                x1: Math.min(this.dragStartX, this.dragEndX),
                y1: Math.min(this.dragStartY, this.dragEndY),
                x2: Math.max(this.dragStartX, this.dragEndX),
                y2: Math.max(this.dragStartY, this.dragEndY)
            };
            this.controller.handleClearSelectedObjects();
            this.controller.handleSelectObjectsInRect(rect);
        }
        if (event.button == 0){ // Для перемещения точки
            if (this.isObjectDragging == true) {
                this.isObjectDragging = false;
                this.controller.handleCreateObject({ x: this.dragEndX, y: this.dragEndY })
            }
        }
        this.drawObjects();
    }

    drawObjects() {
        // this.ctx.canvas.width = window.innerWidth;
        // this.ctx.canvas.height = window.innerHeight;

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
    }

    drawMovingPoint() {
        const xSnapped = this.snapCoordinate(this.dragEndX)
        const ySnapped = this.snapCoordinate(this.dragEndY)
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawObjects();// нужно чтобы не пропадали точки и линии во время переноса объекта
        this.ctx.beginPath()
        this.ctx.arc(xSnapped, ySnapped, 3, 0, Math.PI * 2);
        this.ctx.fill();
        this.dragEndX = xSnapped
        this.dragEndY = ySnapped
    }

    drawSelectionRect() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // нужно чтобы внутри прямоугольной области выделения удалялись предыдущие области
        //выделения
        this.drawObjects();// нужно чтобы не пропадали точки и линии во время рисования прямоугольника
        this.ctx.beginPath();
        this.ctx.rect(this.dragStartX, this.dragStartY, this.dragEndX - this.dragStartX, this.dragEndY - this.dragStartY);
        this.ctx.strokeStyle = 'blue';
        this.ctx.stroke();
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
