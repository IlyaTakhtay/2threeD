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