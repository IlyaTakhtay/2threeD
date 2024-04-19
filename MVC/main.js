import { PlaneController } from './planes/planeController.js';
import { Line, PlaneModel, Point } from './planes/planeModel.js';
import { PlaneView } from './planes/planeView.js';
import { Legend } from './planes/planeView.js'
import { firstExample, secondExample } from './planes/utils/example.js';

import { Space3DModel } from './planes/reconstruction.js';
import { Space3DView } from './planes/planeView.js';

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

const plane3D = new Space3DModel()
//   const legend = new Legend('XYCanvas', legendData);
//   legend.render();

//set example
secondExample(planeModelXZ, planeModelYZ, planeModelXY);

const Space3D = new Space3DView("container3D")
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