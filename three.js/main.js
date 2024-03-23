import {Point,Line, ObjectsManager} from './content/Objects.js'


let addLineMode = false;
let addPointMode = false;
let tempLineStart = null; // Переменная для хранения временных координат начальной точки линии
let isDragging = false;
let dragStartX, dragStartY, dragEndX, dragEndY;

window.toggleAddPointMode = function() {
    addPointMode = !addPointMode;
    if (!addPointMode) {
        addLineMode = false;
        tempLineStart = null;
    }
};

window.toggleAddLineMode = function() {
    addLineMode = !addLineMode;
    if (addLineMode) {
        addPointMode = false;
    }
};

window.deleteSelected = function() {
    console.log('admit')
    objectsManager.deleteSelectedObjects()
    drawObjects();
}


const canvas = document.getElementById('myCanvas');
const objectsManager = new ObjectsManager();

// ТРЕБУЕТСЯ РЕФАКТОРИНГ!!!

        const ctx = canvas.getContext('2d');

        canvas.addEventListener('click', function(event) {
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
        
            if (addPointMode) {
                const newPoint = new Point({x, y});
                objectsManager.addObject(newPoint);
            } else if (addLineMode) {
                if (tempLineStart === null) {
                    tempLineStart = {x, y}; // Сохраняем координаты начальной точки линии
                } else {
                    const newLine = new Line({x1: tempLineStart.x, y1: tempLineStart.y, x2: x, y2: y});
                    objectsManager.addObject(newLine);
                    tempLineStart = null; // Сбрасываем временные координаты
                }
            }
            drawObjects();
        });
        
        function drawObjects() {
            ctx.canvas.width  = window.innerWidth;
            ctx.canvas.height = window.innerHeight;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            objectsManager.objects.forEach((obj) => {
                if (obj instanceof Point) {
                    ctx.beginPath();
                    ctx.arc(obj.x, obj.y, 3, 0, Math.PI * 2);
                    ctx.fill();
                } else if (obj instanceof Line) {
                    ctx.beginPath();
                    ctx.moveTo(obj.x1, obj.y1);
                    ctx.lineTo(obj.x2, obj.y2);
                    ctx.stroke();
                }
            });
        }

        canvas.addEventListener('contextmenu', function(event) {
            event.preventDefault(); // Предотвращаем стандартное контекстное меню браузера
            // addNewObject(event); // Добавляем новый объект при нажатии правой кнопки мыши
        });

        canvas.addEventListener('mousedown', function(event) {
            const rect = canvas.getBoundingClientRect();
            dragStartX = event.clientX - rect.left;
            dragStartY = event.clientY - rect.top;
            isDragging = true;
        });

        canvas.addEventListener('mousemove', function(event) {
            if (isDragging) {
                const rect = canvas.getBoundingClientRect();
                dragEndX = event.clientX - rect.left;
                dragEndY = event.clientY - rect.top;
                drawSelectionRect();
            }
        });

        canvas.addEventListener('mouseup', function(event) {
            isDragging = false;
            const rect = {
                x1: Math.min(dragStartX, dragEndX),
                y1: Math.min(dragStartY, dragEndY),
                x2: Math.max(dragStartX, dragEndX),
                y2: Math.max(dragStartY, dragEndY)
            };
            objectsManager.clearSelectedObjects();
            objectsManager.selectObjectsInRect(rect);
            drawObjects();
        });

        function drawSelectionRect() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawObjects();
            ctx.beginPath();
            ctx.rect(dragStartX, dragStartY, dragEndX - dragStartX, dragEndY - dragStartY);
            ctx.strokeStyle = 'blue';
            ctx.stroke();
        }

        