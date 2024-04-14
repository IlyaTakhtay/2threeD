import { PlaneController } from './planes/planeController.js';
import { PlaneModel } from './planes/planeModel.js';
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