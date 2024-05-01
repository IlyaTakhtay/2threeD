import observer from './utils/observer.js'

export class Algoritm{
    //Get interetion of lines algo 
    static intersects(point1, point2, point3, point4) {
        // point1, point2 - line 1
        // point3, point4 - line 2
    
        var det, gamma, lambda;
        det = (point2.pointX - point1.pointX) * (point4.pointY - point3.pointY) - (point4.pointX - point3.pointX) * (point2.pointY - point1.pointY);
        if (det === 0) {
            return false;
        } else {
            lambda = ((point4.pointY - point3.pointY) * (point4.pointX - point1.pointX) + (point3.pointX - point4.pointX) * (point4.pointY - point1.pointY)) / det;
            gamma = ((point1.pointY - point2.pointY) * (point4.pointX - point1.pointX) + (point2.pointX - point1.pointX) * (point4.pointY - point1.pointY)) / det;
            return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
        }
    }   
    
    // Метод для проверки пересечения линии и прямоугольника
    static lineIntersectsRect(line, rect) {
        let linePoint1 = line.firstPoint;
        let linePoint2 = line.secondPoint;
        
        let rectanglePoint1 = new Point({x: rect.x1, y: rect.y1});
        let rectanglePoint2 = new Point({x: rect.x1, y: rect.y2});
        let rectanglePoint3 = new Point({x: rect.x2, y: rect.y2});
        let rectanglePoint4 = new Point({x: rect.x2, y: rect.y1});
    
        const intersections = [
            this.intersects(linePoint1, linePoint2, rectanglePoint1, rectanglePoint2),
            this.intersects(linePoint1, linePoint2, rectanglePoint2, rectanglePoint3),
            this.intersects(linePoint1, linePoint2, rectanglePoint3, rectanglePoint4),
            this.intersects(linePoint1, linePoint2, rectanglePoint4, rectanglePoint1),
        ];
    
        if (intersections.some(Boolean)) {
            console.log("intersected");
            return true;
        }
        
        // Проверка, находятся ли концы линии внутри прямоугольника
        if (this.pointInsideRectangle(linePoint1, rect) || this.pointInsideRectangle(linePoint2, rect)) {
            return true;
        }

        return false;
    }
    
    static pointInsideRectangle(point, rect) {
        return (
            point.pointX >= rect.x1 &&
            point.pointX <= rect.x2 &&
            point.pointY >= rect.y1 &&
            point.pointY <= rect.y2
        );
    }

    static calculateDistance(point1, point2) {
        const dx = point2.x - point1.x;
        const dy = point2.y - point1.y;
        return Math.sqrt(dx ** 2 + dy ** 2);
    }

    static findIntersectionPoint(point, line) {
        const { x, y } = point;
        const { linePointX1: x1, linePointY1: y1, linePointX2: x2, linePointY2: y2 } = line;
        const dx = x2 - x1;
        const dy = y2 - y1;
        const px = x - x1;
        const py = y - y1;
    
        const dotProduct = px * dx + py * dy;
        const lengthSquared = dx * dx + dy * dy;
    
        if (lengthSquared === 0) {
            return { x: x1, y: y1 };
        }
    
        const t = dotProduct / lengthSquared;
    
        if (t < 0) {
            return { x: x1, y: y1 };
        } else if (t > 1) {
            return { x: x2, y: y2 };
        } else {
            const nearestX = x1 + t * dx;
            const nearestY = y1 + t * dy;
            return { x: nearestX, y: nearestY };
        }
    }

    static pointToLineDistance({ x = null, y = null, point = null, line }) {
        if (point) {
            x = point.pointX;
            y = point.pointY;
        }
    
        const intersectionPoint = this.findIntersectionPoint({ x, y }, line);
        return this.calculateDistance({ x, y }, intersectionPoint);
    }
}

export class Point {
    #x;
    #y;
    #name;
    constructor({x = null, y = null, name = null}) {
        this.#x = x;
        this.#y = y; 
        this.#name = name;
    }
    get pointX() { return this.#x }
    get pointY() { return this.#y }

    get name() { return this.#name }

    set pointX(x) {this.#x = x}
    set pointY(y) {this.#y = y}

    set name(name) { this.#name = name }

    equals(other) {
        return this.pointX === other.pointX && this.pointY === other.pointY;
    }
}

export class Line {
    #point1;
    #point2;
    #name;
    constructor({point1 = null, point2 = null, name = null}) {
        this.#point1 = point1;
        this.#point2 = point2;
        this.#name = name;
    }
    get linePointX1() { return this.#point1.pointX }
    get linePointY1() { return this.#point1.pointY }

    get linePointX2() { return this.#point2.pointX }
    get linePointY2() { return this.#point2.pointY }

    set linePointX1(x1) { this.#point1.pointX = x1 }
    set linePointY1(y1) { this.#point1.pointY = y1 }

    set linePointX2(x2) { this.#point2.pointX = x2 }
    set linePointY2(y2) { this.#point2.pointY = y2 }

    get firstPoint() { return this.#point1 }
    get secondPoint() { return this.#point2 }

    get name() { return this.#name };

    set name(name) { this.#name = name }

    equals(other) {
        return (
            (this.firstPoint.equals(other.firstPoint) && this.secondPoint.equals(other.secondPoint)) ||
            (this.secondPoint.equals(other.firstPoint) && this.firstPoint.equals(other.secondPoint))
            );
    }

    equalsInDot(other) {
        return (this.firstPoint.equals(this.secondPoint) && 
        (this.firstPoint.equals(other.firstPoint) || this.firstPoint.equals(other.secondPoint)))
    }

    isDotsOnLineBoolean(points, tolerance = 1e-9) {
        const lineX1 = this.linePointX1;
        const lineY1 = this.linePointY1;
        const lineX2 = this.linePointX2;
        const lineY2 = this.linePointY2;
    
        // Если передан массив точек
        if (Array.isArray(points)) {
            for (let i = 0; i < points.length; i++) {
                const point = points[i];
                const x = point.pointX;
                const y = point.pointY;
    
                const crossProduct = (lineX2 - lineX1) * (y - lineY1) - (lineY2 - lineY1) * (x - lineX1);
                if (Math.abs(crossProduct) > tolerance) {
                    return false; // Если хотя бы одна точка не лежит на линии, вернуть false
                }
                // TODO: ??? это нужно или нет
                // const t = ((x - lineX1) * (lineX2 - lineX1) + (y - lineY1) * (lineY2 - lineY1)) / ((lineX2 - lineX1) ** 2 + (lineY2 - lineY1) ** 2);
                // if (!(0 <= t && t <= 1)) {
                //     return false; // Если t не находится в диапазоне [0, 1], точка лежит за пределами отрезка
                // }
            }
            return true; // Все точки находятся на линии
        }
        // Если передана одна точка
        // TODO: проверить работоспособность функции части которая с одной точки
        else {
            const x = points.pointX;
            const y = points.pointY;
    
            const crossProduct = (lineX2 - lineX1) * (y - lineY1) - (lineY2 - lineY1) * (x - lineX1);
            if (Math.abs(crossProduct) > tolerance) {
                return false;
            }
            // TODO: ??? это нужно или нет?
            // const t = ((x - lineX1) * (lineX2 - lineX1) + (y - lineY1) * (lineY2 - lineY1)) / ((lineX2 - lineX1) ** 2 + (lineY2 - lineY1) ** 2);
            // return 0 <= t && t <= 1;
            return true
        }
    }
    
    
}

export class PlaneModel {
    pointCounter = 1;
    lineCounter = 1;

    #objects;
    #selectedObjects;
    
    constructor() {
        this.#objects = []; // Массив для хранения всех объектов
        this.#selectedObjects = new Set(); // Множество для хранения выделенных объектов
    }

    // Добавление нового объекта в массив объектов
    createObject(coordinates, objectName = null) {
        const { x, y, x1, y1, x2, y2, radius } = coordinates;
        if ((x !== undefined) && (y !== undefined) && (x1 === undefined) && (y1 === undefined) && (x2 === undefined) && (y2 === undefined)) {
            const point = new Point({
                x: x,
                y: y,
                // name: objectName === null ? `Точка ${this.objects.filter(obj => obj instanceof Point).length + 1}` : objectName,
                name: `Точка ${this.pointCounter++}`,
            });
            this.objects.push(point);
        }

        if ((x === undefined) && (y === undefined) && (x1 !== undefined) && (y1 !== undefined) && (x2 !== undefined) && (y2 !== undefined)) {
            let point1 = this.findObject({ x: x1, y: y1, radius: radius })?.object;
            let point2 = this.findObject({ x: x2, y: y2, radius: radius })?.object;

            if (!point1) {
                point1 = new Point({
                    x: x1,
                    y: y1,
                    // name: `Точка ${this.objects.filter(obj => obj instanceof Point).length + 1}`,
                    name: `Точка ${this.pointCounter++}`,
                });
                this.objects.push(point1);
            }

            if (!point2) {
                point2 = new Point({
                    x: x2,
                    y: y2,
                    // name: `Точка ${this.objects.filter(obj => obj instanceof Point).length + 1}`,
                    name: `Точка ${this.pointCounter++}`,
                });
                this.objects.push(point2);
            }

            const line = new Line({
                point1: point1,
                point2: point2,
                // name: objectName === null ? `Линия ${this.objects.filter(obj => obj instanceof Line).length + 1}` : objectName,
                name: `Линия ${this.lineCounter++}`,
            });
            this.objects.push(line);
        }
    }

    findPointByCoordinates(x, y) {
        return this.objects.find(obj => obj instanceof Point && obj.pointX === x && obj.pointY === y);
    }

    deleteObject(coordinates) {
        const { x, y, x1, y1, x2, y2, radius } = coordinates;
        if ((x !== undefined) && (y !== undefined) && (x1 === undefined) && (y1 === undefined) && (x2 === undefined) && (y2 === undefined)) {
            const foundPoint = this.findObject(x, y, radius);
            if (foundPoint) {
                const index = this.#objects.indexOf(foundPoint);
                if (index !== -1) {
                    this.#objects.splice(index, 1);
                    return true;
                }
            }
        }
        return false
        // if ((x === undefined) && (y === undefined) && (x1 !== undefined) && (y1 !== undefined) && (x2 !== undefined) && (y2 !== undefined)) {
        //     const object = new Line({x1: x1, y1: y1, x2: x2, y2: y2});
        //     this.#objects.push(object);
        // }
    }


    findObject(coordinates) {
        const { x, y, radius , width} = coordinates;
    
        if ((x !== undefined) && (y !== undefined) && ((radius !== undefined) || (width !== undefined))) {
            const index = this.#objects.findIndex(item => {
                if (item instanceof Point) {
                    const distance = Math.sqrt((item.pointX - x) ** 2 + (item.pointY - y) ** 2);
                    return distance <= radius;
                } else if (item instanceof Line) {
                    const distance = Algoritm.pointToLineDistance({x:x,y:y,line:item})
                    return distance <= width;
                }
                return false;
            });
        
            if (index !== -1) {
                const item = this.#objects[index];
                if (item instanceof Point) {
                    return {
                        object: item,
                        pointType: 'point'
                    };
                } else if (item instanceof Line) {
                    return {
                        object: item,
                    };
                }
            }
            return null;
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

    selectObjectByName(name) { //TODO: through try catch use
        const findedInObjects = this.objects.find(item => item.name === name);

        if (findedInObjects) {
            this.toggleSelectObject(findedInObjects)
            observer.dispatch('objectUpdated', findedInObjects) // TODO
            return true
        } else {
            return false
        }
    }

    selectObjectsInRect(rect) {
        this.#objects.forEach((obj) => {
            if (obj instanceof Point) {
                if (rect.x1 < obj.pointX && obj.pointX < rect.x2 && rect.y1 < obj.pointY && obj.pointY < rect.y2) {
                    this.selectObject(obj);
                }
            } else if (obj instanceof Line) {
                if (Algoritm.lineIntersectsRect(obj,rect)) {
                    this.selectObject(obj);
                }
            }
        });
    }

    updateObjectCoordinatesByName(objectName, x, y, pointType=null) {
        const object = this.#objects.find(item => item.name === objectName);
        if (object) {
            if (object instanceof Point) {
                console.log('yes')
                object.pointX = x;
                object.pointY = y;
                console.log(object)
                observer.dispatch('objectUpdated', object) // TODO
            } else if (object instanceof Line) {
                if (pointType == 'Point1'){
                    object.linePointX1 = x;
                    object.linePointY1 = y;
                } else if (pointType == 'Point2'){
                    object.linePointX2 = x;
                    object.linePointY2 = y;
                }
            }
        }
    }

    updateObjectName(objectName,newName) {
        if (this.#objects.find( item => item.name === newName)){
            return 'exists'
        }
        const object = this.#objects.find(item => item.name === objectName);
        if (object) {
            object.name = newName;
        }
    }

    splitSelectedLine(data) {
        const { x, y, name } = data;
        const line = [...this.selectedObjects].find(item => item.name === name);
        const index = this.objects.indexOf(line);
        if (line) {
            const nearestPoint = Algoritm.findIntersectionPoint({x,y},line)
            console.log(nearestPoint);

            //TODO: move to function
            const point2 = new Point({
                    x: nearestPoint.x,
                    y: nearestPoint.y,
                    name: `Точка ${this.pointCounter++}`,
                });
            this.objects.push(point2);
            
            const line1 = new Line({
                point1: line.firstPoint,
                point2: point2,
                name: `Линия ${this.lineCounter++}`,
            });
            
            const line2 = new Line({
                point1: point2,
                point2: line.secondPoint, 
                name: `Линия ${this.lineCounter++}`,
            });
            this.objects.push(line1);
            this.objects.push(line2);
            //TODO: move to function
            if (index > -1) {
                this.selectedObjects.delete(line)
                this.objects.splice(index, 1);
            }
            return nearestPoint;
        }
    }

}
// ТРЕБУЕТСЯ РЕФАКТОРИНГ!!!
