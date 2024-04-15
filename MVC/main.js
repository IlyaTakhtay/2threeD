import { PlaneController } from './planes/planeController.js';
import { Line, PlaneModel, Point } from './planes/planeModel.js';
import { PlaneView } from './planes/planeView.js';
import { Legend } from './planes/planeView.js'

import { Plane3D } from './planes/reconstruction.js';

const planeModelXZ = new PlaneModel;
const planeControllerXZ = new PlaneController(planeModelXZ);
const planeViewXZ = new PlaneView('containerXZ','XZCanvas','XZCanvasCoordinates', 'XZegend',planeControllerXZ);

const planeModelXY = new PlaneModel;
const planeControllerXY = new PlaneController(planeModelXY);
const planeViewXY = new PlaneView('containerXY','XYCanvas','XYCanvasCoordinates', 'XYlegend',planeControllerXY);

const planeModelYZ = new PlaneModel;
const planeControllerYZ = new PlaneController(planeModelYZ);
const planeViewYZ = new PlaneView('containerYZ','YZCanvas','YZCanvasCoordinates', 'YZlegend',planeControllerYZ);

planeViewYZ.configure('leftLower')
planeViewXY.configure('rightUpper')
planeViewXZ.configure('rightLower')

const plane3D = new Plane3D()
//   const legend = new Legend('XYCanvas', legendData);
//   legend.render();

//set first test construction

// // Создание точек
// const point1 = new Point({x:20, y:20, name: 'Point 1'});
// const point2 = new Point({x:40, y:40, name: 'Point 2'});
// const point3 = new Point({x:40, y:80, name: 'Point 2'});

// // Добавление точек в planeModelXY
// planeModelXY.objects.push(point1);
// planeModelXY.objects.push(point2);
// planeModelXY.objects.push(new Line({point1: point1, point2: point2, name: 'Line 1'}));

// // Добавление точек в planeModelYZ
// planeModelYZ.objects.push(point1);
// planeModelYZ.objects.push(point3);
// planeModelYZ.objects.push(new Line({point1: point1, point2: point3, name: 'Line 1'}));

// // Добавление точек в planeModelXZ
// planeModelXZ.objects.push(point1);
// planeModelXZ.objects.push(point3);
// planeModelXZ.objects.push(new Line({point1: point1, point2: point3, name: 'Line 1'}));

//set second test construction
// Создание точек квадрата на плоскости XY
const xySquarePoint1 = new Point({x:20, y:20, name: 'XY Square Point 1'});
const xySquarePoint2 = new Point({x:40, y:20, name: 'XY Square Point 2'});
const xySquarePoint3 = new Point({x:40, y:40, name: 'XY Square Point 3'});
const xySquarePoint4 = new Point({x:20, y:40, name: 'XY Square Point 4'});

// Добавление точек и линий квадрата на плоскость XY
planeModelXY.objects.push(xySquarePoint1);
planeModelXY.objects.push(xySquarePoint2);
planeModelXY.objects.push(xySquarePoint3);
planeModelXY.objects.push(xySquarePoint4);
planeModelXY.objects.push(new Line({point1: xySquarePoint1, point2: xySquarePoint2, name: 'XY Square Line 1'}));
planeModelXY.objects.push(new Line({point1: xySquarePoint2, point2: xySquarePoint3, name: 'XY Square Line 2'}));
planeModelXY.objects.push(new Line({point1: xySquarePoint3, point2: xySquarePoint4, name: 'XY Square Line 3'}));
planeModelXY.objects.push(new Line({point1: xySquarePoint4, point2: xySquarePoint1, name: 'XY Square Line 4'}));

// Создание точек квадрата на плоскости YZ
const yzSquarePoint1 = new Point({x:20, y:20, name: 'YZ Square Point 1'});
const yzSquarePoint2 = new Point({x:40, y:20, name: 'YZ Square Point 2'});
const yzSquarePoint3 = new Point({x:40, y:40, name: 'YZ Square Point 3'});
const yzSquarePoint4 = new Point({x:20, y:40, name: 'YZ Square Point 4'});

// Добавление точек и линий квадрата на плоскость YZ
planeModelYZ.objects.push(yzSquarePoint1);
planeModelYZ.objects.push(yzSquarePoint2);
planeModelYZ.objects.push(yzSquarePoint3);
planeModelYZ.objects.push(yzSquarePoint4);
planeModelYZ.objects.push(new Line({point1: yzSquarePoint1, point2: yzSquarePoint2, name: 'YZ Square Line 1'}));
planeModelYZ.objects.push(new Line({point1: yzSquarePoint2, point2: yzSquarePoint3, name: 'YZ Square Line 2'}));
planeModelYZ.objects.push(new Line({point1: yzSquarePoint3, point2: yzSquarePoint4, name: 'YZ Square Line 3'}));
planeModelYZ.objects.push(new Line({point1: yzSquarePoint4, point2: yzSquarePoint1, name: 'YZ Square Line 4'}));

// Создание точек квадрата на плоскости XZ
const xzSquarePoint1 = new Point({x:20, y:20, name: 'XZ Square Point 1'});
const xzSquarePoint2 = new Point({x:40, y:20, name: 'XZ Square Point 2'});
const xzSquarePoint3 = new Point({x:40, y:40, name: 'XZ Square Point 3'});
const xzSquarePoint4 = new Point({x:20, y:40, name: 'XZ Square Point 4'});
// Добавление точек и линий квадрата на плоскость XZ
planeModelXZ.objects.push(xzSquarePoint1);
planeModelXZ.objects.push(xzSquarePoint2);
planeModelXZ.objects.push(xzSquarePoint3);
planeModelXZ.objects.push(xzSquarePoint4);
planeModelXZ.objects.push(new Line({point1: xzSquarePoint1, point2: xzSquarePoint2, name: 'XZ Square Line 1'}));
planeModelXZ.objects.push(new Line({point1: xzSquarePoint2, point2: xzSquarePoint3, name: 'XZ Square Line 2'}));
planeModelXZ.objects.push(new Line({point1: xzSquarePoint3, point2: xzSquarePoint4, name: 'XZ Square Line 3'}));
planeModelXZ.objects.push(new Line({point1: xzSquarePoint4, point2: xzSquarePoint1, name: 'XZ Square Line 4'}));

window.reconstruct = function() {
    plane3D.mainProcess({yzObjects:planeModelYZ.objects, xzObjects: planeModelXZ.objects, xyObjects: planeModelXY.objects});
}   

window.toggleAddPointMode = function() {
    planeViewXZ.toggleAddPointMode();
    planeViewXY.toggleAddPointMode();
    planeViewYZ.toggleAddPointMode();
  };
  
window.toggleAddLineMode = function() {
    planeViewXZ.toggleAddLineMode();
    planeViewXY.toggleAddLineMode();
    planeViewYZ.toggleAddLineMode();
};
  
window.deleteSelected = function() {
    planeViewXZ.deleteSelected();
    planeViewXY.deleteSelected();
    planeViewYZ.deleteSelected();
};