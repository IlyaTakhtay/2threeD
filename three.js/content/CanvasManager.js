import { Point, Line, ObjectsManager } from './Objects.js';

export class CanvasManager {

    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.objectsManager = new ObjectsManager();
        this.addLineMode = false;
        this.addPointMode = false;
        this.tempLineStart = null;
        this.isDragging = false;
        this.dragStartX = 0;
        this.dragStartY = 0;
        this.dragEndX = 0;
        this.dragEndY = 0;

        this.setupEventListeners();
    }

    setupEventListeners() {
        this.canvas.addEventListener('click', this.handleCanvasClick.bind(this));
        this.canvas.addEventListener('contextmenu', this.handleContextMenu.bind(this));
        this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
    }

    handleCanvasClick(event) {
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        if (this.addPointMode) {
            const newPoint = new Point({ x, y });
            this.objectsManager.addObject(newPoint);
        } else if (this.addLineMode) {
            if (this.tempLineStart === null) {
                this.tempLineStart = { x, y };
            } else {
                const newLine = new Line({ x1: this.tempLineStart.x, y1: this.tempLineStart.y, x2: x, y2: y });
                this.objectsManager.addObject(newLine);
                this.tempLineStart = null;
            }
        }
        this.drawObjects();
    }

    handleContextMenu(event) {
        event.preventDefault();
    }

    handleMouseDown(event) {
        const rect = this.canvas.getBoundingClientRect();
        this.dragStartX = event.clientX - rect.left;
        this.dragStartY = event.clientY - rect.top;
        this.isDragging = true;
    }

    handleMouseMove(event) {
        if (this.isDragging) {
            const rect = this.canvas.getBoundingClientRect();
            this.dragEndX = event.clientX - rect.left;
            this.dragEndY = event.clientY - rect.top;
            this.drawSelectionRect();
        }
    }

    handleMouseUp() {
        this.isDragging = false;
        const rect = {
            x1: Math.min(this.dragStartX, this.dragEndX),
            y1: Math.min(this.dragStartY, this.dragEndY),
            x2: Math.max(this.dragStartX, this.dragEndX),
            y2: Math.max(this.dragStartY, this.dragEndY)
        };
        this.objectsManager.clearSelectedObjects();
        this.objectsManager.selectObjectsInRect(rect);
        this.drawObjects();
    }

    drawObjects() {
        this.ctx.canvas.width = window.innerWidth;
        this.ctx.canvas.height = window.innerHeight;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.objectsManager.objects.forEach((obj) => {
            if (obj instanceof Point) {
                this.ctx.beginPath();
                this.ctx.arc(obj.pointX, obj.pointY, 3, 0, Math.PI * 2);
                this.ctx.fill();
            } else if (obj instanceof Line) {
                this.ctx.beginPath();
                this.ctx.moveTo(obj.linePointX1, obj.linePointY1);
                this.ctx.lineTo(obj.linePointY1, obj.linePointY2);
                this.ctx.stroke();
            }
        });
    }

    drawSelectionRect() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawObjects();
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
        this.objectsManager.deleteSelectedObjects();
        this.drawObjects();
    }
}
