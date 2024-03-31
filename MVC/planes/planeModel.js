export class Point {
    #x;
    #y;
    constructor({x = null, y = null}) {
        this.#x = x;
        this.#y = y; 
    }
    get pointX() { return this.#x }
    get pointY() { return this.#y }

}

export class Line {
    #x1;
    #x2;
    #y1;
    #y2;
    constructor({x1 = null, y1 = null, x2 = null, y2 = null}) {
        this.#x1 = x1;
        this.#y1 = y1;
        this.#x2 = x2;
        this.#y2 = y2; 
    }
    get linePointX1() { return this.#x1 }
    get linePointY1() { return this.#y1 }

    get linePointX2() { return this.#x2 }
    get linePointY2() { return this.#y2 }

    get firstPoint() { return {x:this.#x1, y:this.#y1} }
    get secondPoint() { return {x:this.#x2, y:this.#y2}}

}

export class PlaneModel {
    
    #objects;
    #selectedObjects;
    
    constructor() {
        this.#objects = []; // Массив для хранения всех объектов
        this.#selectedObjects = new Set(); // Множество для хранения выделенных объектов
    }

    // Добавление нового объекта в массив объектов
    createObject(coordinates) {
        const { x, y, x1, y1, x2, y2 } = coordinates;
        if ((x !== undefined) && (y !== undefined) && (x1 === undefined) && (y1 === undefined) && (x2 === undefined) && (y2 === undefined)) {
            const object = new Point({x: x,y: y});
            this.#objects.push(object);
        }
        if ((x === undefined) && (y === undefined) && (x1 !== undefined) && (y1 !== undefined) && (x2 !== undefined) && (y2 !== undefined)) {
            const object = new Line({x1: x1, y1: y1, x2: x2, y2: y2});
            this.#objects.push(object);
        }
    }

    get objects(){
        return this.#objects
    }

    get selectedObjects(){
        return this.#selectedObjects
    }

    // Выделение объекта
    selectObject(object) {
        this.#selectedObjects.add(object);
    }

    // Снятие выделения с объекта
    deselectObject(object) {
        this.#selectedObjects.delete(object);
    }

    // Переключение выделения объекта (выделение/снятие выделения)
    toggleSelectObject(object) {
        if (this.#selectedObjects.has(object)) {
            this.#selectedObjects.delete(object); // Снятие выделения, если объект уже выделен
        } else {
            this.#selectedObjects.add(object); // Выделение объекта, если он не был выделен
        }
    }

    getSelectedPoints() {
        return this.#objects.filter((obj) => obj instanceof Point && this.#selectedObjects.has(obj));
    }

    getSelectedLines() {
        return this.#objects.filter((obj) => obj instanceof Line && this.#selectedObjects.has(obj));
    }

    clearSelectedObjects() {
        this.#selectedObjects.clear();
    }

    // Удаление выделенных объектов из массива объектов
    deleteSelectedObjects() {
        this.#objects = this.#objects.filter(obj => !this.#selectedObjects.has(obj)); //переопределние массива объектов новым без выделенных элементов
        // Очистить множество выделенных объектов после удаления
        this.#selectedObjects.clear();
    }

    selectObjectsInRect(rect) {
        this.#objects.forEach((obj) => {
            if (obj instanceof Point) {
                if (rect.x1 < obj.pointX && obj.pointX < rect.x2 && rect.y1 < obj.pointY && obj.pointY < rect.y2) {
                    this.selectObject(obj);
                }
            } else if (obj instanceof Line) {
                if (this.lineIntersectsRect(obj,rect)) {
                    this.selectObject(obj);
                }
            }
        });
    }

    //Get interetion of lines algo 
    intersects(point1,point2,point3,point4) {
        //point1, point2 - line 1
        //point3, point4 - line 2

        var det, gamma, lambda;
        det = (point2.x - point1.x) * (point4.y - point3.y) - (point4.x - point3.x) * (point2.y - point1.y);
        if (det === 0) {
          return false;
        } else {
          lambda = ((point4.y - point3.y) * (point4.x - point1.x) + (point3.x - point4.x) * (point4.y - point1.y)) / det;
          gamma = ((point1.y - point2.y) * (point4.x - point1.x) + (point2.x - point1.x) * (point4.y - point1.y)) / det;
          return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
        }
      };

    // Метод для проверки пересечения линии и прямоугольника
    lineIntersectsRect(line, rect) {

    let linePoint1 = line.firstPoint
    let linePoint2 = line.secondPoint
    
    let rectanglePoint1 = {x:rect.x1,y:rect.y1}
    let rectanglePoint2 = {x:rect.x1,y:rect.y2}
    let rectanglePoint3 = {x:rect.x2,y:rect.y2}
    let rectanglePoint4 = {x:rect.x2,y:rect.y1}

    // Получаем координаты начала и конца линии
    //rect hights:
    //x1,y1 - lowerLeft ; x1y2 - topLeft, x2y1 - lowerRight, x2y2 - topRight;

    let upperIntersection = this.intersects(linePoint1,linePoint2,rectanglePoint2,rectanglePoint3)
    let lowerInteersection =  this.intersects(linePoint1,linePoint2,rectanglePoint1,rectanglePoint4)
    let rightIntercetion = this.intersects(linePoint1,linePoint2,rectanglePoint3,rectanglePoint4)
    let leftIntersection = this.intersects(linePoint1,linePoint2,rectanglePoint1,rectanglePoint2)

    if ((upperIntersection || lowerInteersection || rightIntercetion || leftIntersection)){
        console.log("intersected")
        return true
    }

    // этот колхоз переделать в функцию 
    if (((linePoint1.x >= Math.min(rectanglePoint1.x, rectanglePoint3.x)) && (linePoint1.x <= Math.max(rectanglePoint1.x, rectanglePoint3.x))) &&
    ((linePoint2.x >= Math.min(rectanglePoint1.x, rectanglePoint3.x)) && (linePoint2.x <= Math.max(rectanglePoint1.x, rectanglePoint3.x)))) {
        if (((linePoint1.y >= Math.min(rectanglePoint1.y, rectanglePoint3.y)) && (linePoint1.y <= Math.max(rectanglePoint1.y, rectanglePoint3.y))) &&
            ((linePoint2.y >= Math.min(rectanglePoint1.y, rectanglePoint3.y)) && (linePoint2.y <= Math.max(rectanglePoint1.y, rectanglePoint3.y)))) {
            return true;
        }
    }
    return false; // Линия не пересекает прямоугольник
    }

}
// ТРЕБУЕТСЯ РЕФАКТОРИНГ!!!
