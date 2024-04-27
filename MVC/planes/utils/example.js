//set first test construction
import { Point } from "../planeModel";
import { Line } from "../planeModel";

// Создание точек
export function firstExample (frontPlaneModel, sidePlaneModel, topPlaneModel) {
    const point1 = new Point({x:20, y:20, name: 'Point 1'});
    const point2 = new Point({x:40, y:40, name: 'Point 2'});
    const point3 = new Point({x:40, y:80, name: 'Point 2'});

    // Добавление точек в frontPlaneModel
    topPlaneModel.objects.push(point1);
    topPlaneModel.objects.push(point2);
    topPlaneModel.objects.push(new Line({point1: point1, point2: point2, name: 'Line 1'}));

    // Добавление точек в sidePlaneModel
    sidePlaneModel.objects.push(point1);
    sidePlaneModel.objects.push(point3);
    sidePlaneModel.objects.push(new Line({point1: point1, point2: point3, name: 'Line 1'}));

    // Добавление точек в topPlaneModel
    frontPlaneModel.objects.push(point1);
    frontPlaneModel.objects.push(point3);
    frontPlaneModel.objects.push(new Line({point1: point1, point2: point3, name: 'Line 1'}));
}

//set second test construction

export function secondExample (frontPlaneModel, sidePlaneModel, topPlaneModel){
// Создание точек квадрата на плоскости XY
    const xySquarePoint1 = new Point({x:20, y:20, name: 'XY Square Point 1'});
    const xySquarePoint2 = new Point({x:40, y:20, name: 'XY Square Point 2'});
    const xySquarePoint3 = new Point({x:40, y:40, name: 'XY Square Point 3'});
    const xySquarePoint4 = new Point({x:20, y:40, name: 'XY Square Point 4'});

    // Добавление точек и линий квадрата на плоскость XY
    topPlaneModel.objects.push(xySquarePoint1);
    topPlaneModel.objects.push(xySquarePoint2);
    topPlaneModel.objects.push(xySquarePoint3);
    topPlaneModel.objects.push(xySquarePoint4);
    topPlaneModel.objects.push(new Line({point1: xySquarePoint1, point2: xySquarePoint2, name: 'XY Square Line 1'}));
    topPlaneModel.objects.push(new Line({point1: xySquarePoint2, point2: xySquarePoint3, name: 'XY Square Line 2'}));
    topPlaneModel.objects.push(new Line({point1: xySquarePoint3, point2: xySquarePoint4, name: 'XY Square Line 3'}));
    topPlaneModel.objects.push(new Line({point1: xySquarePoint4, point2: xySquarePoint1, name: 'XY Square Line 4'}));

    // Создание точек квадрата на плоскости YZ
    const yzSquarePoint1 = new Point({x:20, y:20, name: 'YZ Square Point 1'});
    const yzSquarePoint2 = new Point({x:40, y:20, name: 'YZ Square Point 2'});
    const yzSquarePoint3 = new Point({x:40, y:40, name: 'YZ Square Point 3'});
    const yzSquarePoint4 = new Point({x:20, y:40, name: 'YZ Square Point 4'});

    // Добавление точек и линий квадрата на плоскость YZ
    sidePlaneModel.objects.push(yzSquarePoint1);
    sidePlaneModel.objects.push(yzSquarePoint2);
    sidePlaneModel.objects.push(yzSquarePoint3);
    sidePlaneModel.objects.push(yzSquarePoint4);
    sidePlaneModel.objects.push(new Line({point1: yzSquarePoint1, point2: yzSquarePoint2, name: 'YZ Square Line 1'}));
    sidePlaneModel.objects.push(new Line({point1: yzSquarePoint2, point2: yzSquarePoint3, name: 'YZ Square Line 2'}));
    sidePlaneModel.objects.push(new Line({point1: yzSquarePoint3, point2: yzSquarePoint4, name: 'YZ Square Line 3'}));
    sidePlaneModel.objects.push(new Line({point1: yzSquarePoint4, point2: yzSquarePoint1, name: 'YZ Square Line 4'}));

    // Создание точек квадрата на плоскости XZ
    const xzSquarePoint1 = new Point({x:20, y:20, name: 'XZ Square Point 1'});
    const xzSquarePoint2 = new Point({x:40, y:20, name: 'XZ Square Point 2'});
    const xzSquarePoint3 = new Point({x:40, y:40, name: 'XZ Square Point 3'});
    const xzSquarePoint4 = new Point({x:20, y:40, name: 'XZ Square Point 4'});
    // Добавление точек и линий квадрата на плоскость XZ
    frontPlaneModel.objects.push(xzSquarePoint1);
    frontPlaneModel.objects.push(xzSquarePoint2);
    frontPlaneModel.objects.push(xzSquarePoint3);
    frontPlaneModel.objects.push(xzSquarePoint4);
    frontPlaneModel.objects.push(new Line({point1: xzSquarePoint1, point2: xzSquarePoint2, name: 'XZ Square Line 1'}));
    frontPlaneModel.objects.push(new Line({point1: xzSquarePoint2, point2: xzSquarePoint3, name: 'XZ Square Line 2'}));
    frontPlaneModel.objects.push(new Line({point1: xzSquarePoint3, point2: xzSquarePoint4, name: 'XZ Square Line 3'}));
    frontPlaneModel.objects.push(new Line({point1: xzSquarePoint4, point2: xzSquarePoint1, name: 'XZ Square Line 4'}));
}

export function thirdExample (frontPlaneModel, sidePlaneModel, topPlaneModel){
    // Создание точек буквы "T" на плоскости XY
    const xyTPoint1 = new Point({x:20, y:20, name: 'XY T Point 1'});
    const xyTPoint2 = new Point({x:20, y:60, name: 'XY T Point 2'});
    const xyTPoint3 = new Point({x:40, y:60, name: 'XY T Point 3'});
    const xyTPoint4 = new Point({x:40, y:140, name: 'XY T Point 4'});

    const xyTPoint5 = new Point({x:80, y:140, name: 'XY Point 5'});
    const xyTPoint6 = new Point({x:80, y:60, name: 'XY Point 6'});
    const xyTPoint7 = new Point({x:100, y:60, name: 'XY Point 7'});
    const xyTPoint8 = new Point({x:100, y:20, name: 'XY Point 8'});

    
    // Добавление точек и линий буквы "T" на плоскость XY
    topPlaneModel.objects.push(xyTPoint1, xyTPoint2, xyTPoint3, xyTPoint4, xyTPoint5, xyTPoint6, xyTPoint7, xyTPoint8);
    topPlaneModel.objects.push(new Line({point1: xyTPoint1, point2: xyTPoint2, name: 'XY T Line 1'}));
    topPlaneModel.objects.push(new Line({point1: xyTPoint2, point2: xyTPoint3, name: 'XY T Line 2'}));
    topPlaneModel.objects.push(new Line({point1: xyTPoint3, point2: xyTPoint4, name: 'XY T Line 3'}));
    topPlaneModel.objects.push(new Line({point1: xyTPoint4, point2: xyTPoint5, name: 'XY T Line 4'}));
    topPlaneModel.objects.push(new Line({point1: xyTPoint5, point2: xyTPoint6, name: 'XY T Line 5'}));
    topPlaneModel.objects.push(new Line({point1: xyTPoint6, point2: xyTPoint7, name: 'XY T Line 6'}));
    topPlaneModel.objects.push(new Line({point1: xyTPoint7, point2: xyTPoint8, name: 'XY T Line 7'}));
    topPlaneModel.objects.push(new Line({point1: xyTPoint8, point2: xyTPoint1, name: 'XY T Line 8'}));

    // Создание точек буквы "T" на плоскости XZ
    const xzTPoint1 = new Point({x:20, y:20, name: 'XZ T Point 1'});
    const xzTPoint2 = new Point({x:20, y:60, name: 'XZ T Point 2'});
    const xzTPoint3 = new Point({x:40, y:60, name: 'XZ T Point 3'});
    const xzTPoint4 = new Point({x:80, y:60, name: 'XZ T Point 4'});
    
    const xzTPoint5 = new Point({x:100, y:60, name: 'XZ T Point 5'});
    const xzTPoint6 = new Point({x:100, y:20, name: 'XZ T Point 6'});
    const xzTPoint7 = new Point({x:80, y:20, name: 'XZ T Point 7'});
    const xzTPoint8 = new Point({x:40, y:20, name: 'XZ T Point 8'});

    // Добавление точек и линий буквы "T" на плоскость XZ
    frontPlaneModel.objects.push(xzTPoint1, xzTPoint2, xzTPoint3, xzTPoint4, xzTPoint5, xzTPoint6, xzTPoint7, xzTPoint8);
    frontPlaneModel.objects.push(new Line({point1: xzTPoint1, point2: xzTPoint2, name: 'XZ T Line 1'}));
    frontPlaneModel.objects.push(new Line({point1: xzTPoint2, point2: xzTPoint3, name: 'XZ T Line 2'}));
    frontPlaneModel.objects.push(new Line({point1: xzTPoint3, point2: xzTPoint4, name: 'XZ T Line 3'}));
    frontPlaneModel.objects.push(new Line({point1: xzTPoint4, point2: xzTPoint5, name: 'XZ T Line 4'}));
    frontPlaneModel.objects.push(new Line({point1: xzTPoint5, point2: xzTPoint6, name: 'XZ T Line 5'}));
    frontPlaneModel.objects.push(new Line({point1: xzTPoint6, point2: xzTPoint7, name: 'XZ T Line 6'}));
    frontPlaneModel.objects.push(new Line({point1: xzTPoint7, point2: xzTPoint8, name: 'XZ T Line 7'}));
    frontPlaneModel.objects.push(new Line({point1: xzTPoint8, point2: xzTPoint1, name: 'XZ T Line 8'}));
    frontPlaneModel.objects.push(new Line({point1: xzTPoint4, point2: xzTPoint7, name: 'XZ T Line 9'}));
    frontPlaneModel.objects.push(new Line({point1: xzTPoint3, point2: xzTPoint8, name: 'XZ T Line 10'}));

    // Создание точек буквы "T" на плоскости YZ
    const yzTPoint1 = new Point({x:20, y:20, name: 'YZ T Point 1'});
    const yzTPoint2 = new Point({x:60, y:20, name: 'YZ T Point 2'});
    const yzTPoint3 = new Point({x:140, y:20, name: 'YZ T Point 3'});
    const yzTPoint4 = new Point({x:140, y:60, name: 'YZ T Point 4'});
    const yzTPoint5 = new Point({x:60, y:60, name: 'YZ T Point 5'});
    const yzTPoint6 = new Point({x:20, y:60, name: 'YZ T Point 6'});

    // Добавление точек и линий буквы "T" на плоскость YZ
    sidePlaneModel.objects.push(yzTPoint1, yzTPoint2, yzTPoint3, yzTPoint4, yzTPoint5, yzTPoint6);
    sidePlaneModel.objects.push(new Line({point1: yzTPoint1, point2: yzTPoint2, name: 'YZ T Line 1'}));
    sidePlaneModel.objects.push(new Line({point1: yzTPoint2, point2: yzTPoint3, name: 'YZ T Line 2'}));
    sidePlaneModel.objects.push(new Line({point1: yzTPoint3, point2: yzTPoint4, name: 'YZ T Line 3'}));
    sidePlaneModel.objects.push(new Line({point1: yzTPoint4, point2: yzTPoint5, name: 'YZ T Line 4'}));
    sidePlaneModel.objects.push(new Line({point1: yzTPoint5, point2: yzTPoint6, name: 'YZ T Line 5'}));
    sidePlaneModel.objects.push(new Line({point1: yzTPoint6, point2: yzTPoint1, name: 'YZ T Line 6'}));
    sidePlaneModel.objects.push(new Line({point1: yzTPoint2, point2: yzTPoint5, name: 'YZ T Line 7'}));
}

export function fouthExample (frontPlaneModel, sidePlaneModel, topPlaneModel){
    // Создание точек "[]" на плоскости XY
    const xyTPoint1 = new Point({x:20, y:20, name: 'XY T Point 1'});
    const xyTPoint2 = new Point({x:20, y:80, name: 'XY T Point 2'});
    const xyTPoint3 = new Point({x:80, y:80, name: 'XY T Point 3'});
    const xyTPoint4 = new Point({x:80, y:20, name: 'XY T Point 4'});

    const xyTPoint5 = new Point({x:100, y:40, name: 'XY Point 5'});
    const xyTPoint6 = new Point({x:80, y:40, name: 'XY Point 6'});
    const xyTPoint7 = new Point({x:80, y:60, name: 'XY Point 7'});
    const xyTPoint8 = new Point({x:100, y:60, name: 'XY Point 8'});

    const xyTPoint9 = new Point({x:20, y:40, name: 'XY Point 9'});
    const xyTPoint10 = new Point({x:0, y:40, name: 'XY Point 10'});
    const xyTPoint11 = new Point({x:0, y:60, name: 'XY Point 11'});
    const xyTPoint12 = new Point({x:20, y:60, name: 'XY Point 12'});

    
    // Добавление точек и линий "[]" на плоскость XY
    topPlaneModel.objects.push(xyTPoint1, xyTPoint2, xyTPoint3, xyTPoint4, xyTPoint5, xyTPoint6, xyTPoint7, xyTPoint8, xyTPoint9, xyTPoint10, xyTPoint11, xyTPoint12);
    topPlaneModel.objects.push(new Line({point1: xyTPoint1, point2: xyTPoint2, name: 'XY T Line 1'}));
    topPlaneModel.objects.push(new Line({point1: xyTPoint2, point2: xyTPoint3, name: 'XY T Line 2'}));
    topPlaneModel.objects.push(new Line({point1: xyTPoint3, point2: xyTPoint4, name: 'XY T Line 3'}));
    topPlaneModel.objects.push(new Line({point1: xyTPoint4, point2: xyTPoint1, name: 'XY T Line 4'}));

    topPlaneModel.objects.push(new Line({point1: xyTPoint5, point2: xyTPoint6, name: 'XY T Line 5'}));
    topPlaneModel.objects.push(new Line({point1: xyTPoint6, point2: xyTPoint7, name: 'XY T Line 6'}));
    topPlaneModel.objects.push(new Line({point1: xyTPoint7, point2: xyTPoint8, name: 'XY T Line 7'}));
    topPlaneModel.objects.push(new Line({point1: xyTPoint8, point2: xyTPoint5, name: 'XY T Line 8'}));

    topPlaneModel.objects.push(new Line({point1: xyTPoint9, point2: xyTPoint10, name: 'XY T Line 9'}));
    topPlaneModel.objects.push(new Line({point1: xyTPoint10, point2: xyTPoint11, name: 'XY T Line 10'}));
    topPlaneModel.objects.push(new Line({point1: xyTPoint11, point2: xyTPoint12, name: 'XY T Line 11'}));
    topPlaneModel.objects.push(new Line({point1: xyTPoint12, point2: xyTPoint9, name: 'XY T Line 12'}));

    // Создание точек "[]" на плоскости XZ
    const xzTPoint1 = new Point({x:20, y:20, name: 'XZ T Point 1'});
    const xzTPoint2 = new Point({x:20, y:80, name: 'XZ T Point 2'});
    const xzTPoint3 = new Point({x:80, y:80, name: 'XZ T Point 3'});
    const xzTPoint4 = new Point({x:80, y:20, name: 'XZ T Point 4'});

    const xzTPoint5 = new Point({x:100, y:40, name: 'XZ Point 5'});
    const xzTPoint6 = new Point({x:80, y:40, name: 'XZ Point 6'});
    const xzTPoint7 = new Point({x:80, y:60, name: 'XZ Point 7'});
    const xzTPoint8 = new Point({x:100, y:60, name: 'XZ Point 8'});

    const xzTPoint9 = new Point({x:20, y:40, name: 'XZ Point 9'});
    const xzTPoint10 = new Point({x:0, y:40, name: 'XZ Point 10'});
    const xzTPoint11 = new Point({x:0, y:60, name: 'XZ Point 11'});
    const xzTPoint12 = new Point({x:20, y:60, name: 'XZ Point 12'});

    
    // Добавление точек и линий "[]" на плоскость XZ
    frontPlaneModel.objects.push(xzTPoint1, xzTPoint2, xzTPoint3, xzTPoint4, xzTPoint5, xzTPoint6, xzTPoint7, xzTPoint8, xzTPoint9, xzTPoint10, xzTPoint11, xzTPoint12);
    frontPlaneModel.objects.push(new Line({point1: xzTPoint1, point2: xzTPoint2, name: 'XZ T Line 1'}));
    frontPlaneModel.objects.push(new Line({point1: xzTPoint2, point2: xzTPoint3, name: 'XZ T Line 2'}));
    frontPlaneModel.objects.push(new Line({point1: xzTPoint3, point2: xzTPoint4, name: 'XZ T Line 3'}));
    frontPlaneModel.objects.push(new Line({point1: xzTPoint4, point2: xzTPoint1, name: 'XZ T Line 4'}));

    frontPlaneModel.objects.push(new Line({point1: xzTPoint5, point2: xzTPoint6, name: 'XZ T Line 5'}));
    frontPlaneModel.objects.push(new Line({point1: xzTPoint6, point2: xzTPoint7, name: 'XZ T Line 6'}));
    frontPlaneModel.objects.push(new Line({point1: xzTPoint7, point2: xzTPoint8, name: 'XZ T Line 7'}));
    frontPlaneModel.objects.push(new Line({point1: xzTPoint8, point2: xzTPoint5, name: 'XZ T Line 8'}));

    frontPlaneModel.objects.push(new Line({point1: xzTPoint9, point2: xzTPoint10, name: 'XZ T Line 9'}));
    frontPlaneModel.objects.push(new Line({point1: xzTPoint10, point2: xzTPoint11, name: 'XZ T Line 10'}));
    frontPlaneModel.objects.push(new Line({point1: xzTPoint11, point2: xzTPoint12, name: 'XZ T Line 11'}));
    frontPlaneModel.objects.push(new Line({point1: xzTPoint12, point2: xzTPoint9, name: 'XZ T Line 12'}));

    // Создание точек "[]" на плоскости YZ
    const yzTPoint1 = new Point({x:20, y:20, name: 'XY T Point 1'});
    const yzTPoint2 = new Point({x:20, y:80, name: 'XY T Point 2'});
    const yzTPoint3 = new Point({x:80, y:80, name: 'XY T Point 3'});
    const yzTPoint4 = new Point({x:80, y:20, name: 'XY T Point 4'});

    const yzTPoint5 = new Point({x:40, y:40, name: 'XY Point 5'});
    const yzTPoint6 = new Point({x:40, y:60, name: 'XY Point 6'});
    const yzTPoint7 = new Point({x:60, y:60, name: 'XY Point 7'});
    const yzTPoint8 = new Point({x:60, y:40, name: 'XY Point 8'});

    // Добавление точек и линий "[]" на плоскость YZ
    sidePlaneModel.objects.push(yzTPoint1, yzTPoint2, yzTPoint3, yzTPoint4, yzTPoint5, yzTPoint6, yzTPoint7, yzTPoint8);
    sidePlaneModel.objects.push(new Line({point1: yzTPoint1, point2: yzTPoint2, name: 'YZ T Line 1'}));
    sidePlaneModel.objects.push(new Line({point1: yzTPoint2, point2: yzTPoint3, name: 'YZ T Line 2'}));
    sidePlaneModel.objects.push(new Line({point1: yzTPoint3, point2: yzTPoint4, name: 'YZ T Line 3'}));
    sidePlaneModel.objects.push(new Line({point1: yzTPoint4, point2: yzTPoint1, name: 'YZ T Line 4'}));
    sidePlaneModel.objects.push(new Line({point1: yzTPoint5, point2: yzTPoint6, name: 'YZ T Line 5'}));
    sidePlaneModel.objects.push(new Line({point1: yzTPoint6, point2: yzTPoint7, name: 'YZ T Line 6'}));
    sidePlaneModel.objects.push(new Line({point1: yzTPoint7, point2: yzTPoint8, name: 'YZ T Line 7'}));
    sidePlaneModel.objects.push(new Line({point1: yzTPoint8, point2: yzTPoint5, name: 'YZ T Line 8'}));

}