import { Line, PlaneModel, Point } from './planes/planeModel.js';
import { PlaneController } from './planes/planeController.js';
import { PlaneView } from './planes/planeView.js';
import { Legend } from './planes/planeView.js'

import observer from './planes/utils/observer.js';

import { Space3DModel } from './threeD/space3DModel.js';
import { Space3DView } from './threeD/space3DView.js';

import { firstExample, fouthExample, secondExample, thirdExample,fifthExample } from './planes/utils/example.js';
import { Space3DController } from './threeD/space3DController.js';

const planeModelXZ = new PlaneModel;
const planeControllerXZ = new PlaneController(planeModelXZ);
const planeViewXZ = new PlaneView('containerXZ','XZCanvas','XZCanvasCoordinates', 'XZegend',planeControllerXZ);

const planeModelXY = new PlaneModel;
const planeControllerXY = new PlaneController(planeModelXY);
const planeViewXY = new PlaneView('containerXY','XYCanvas','XYCanvasCoordinates', 'XYlegend',planeControllerXY);

const planeModelYZ = new PlaneModel;
const planeControllerYZ = new PlaneController(planeModelYZ);
const planeViewYZ = new PlaneView('containerYZ','YZCanvas','YZCanvasCoordinates', 'YZlegend',planeControllerYZ);

planeViewYZ.configurePlaneAxesDirection('leftLower')
planeViewXY.configurePlaneAxesDirection('rightUpper')
planeViewXZ.configurePlaneAxesDirection('rightLower')
//   const legend = new Legend('XYCanvas', legendData);
//   legend.render();


//set example
fifthExample(planeModelXZ, planeModelYZ, planeModelXY);


const space3DModel = new Space3DModel()
const space3DController = new Space3DController(space3DModel);
const space3DView = new Space3DView("container3D",space3DController);

// planeViewXY.resizeCanvas(120,120);
// planeViewXZ.resizeCanvas(120,120);
// planeViewYZ.resizeCanvas(120,120);

window.splitLine = function() {
    planeViewXZ.toggleAddPointMode();
    planeViewXY.toggleAddPointMode();
    planeViewYZ.toggleAddPointMode();
  };

window.reconstruct = function() {
    observer.dispatch('reconstruct', {yzObjects:planeModelYZ.objects, xzObjects: planeModelXZ.objects, xyObjects: planeModelXY.objects})
    // space3DModel.mainProcess({yzObjects:planeModelYZ.objects, xzObjects: planeModelXZ.objects, xyObjects: planeModelXY.objects});
}

window.switchCamera = function() {
    space3DView.toggleCamera();
}
window.toggleDefaultMode = function(){
    planeViewXZ.toggleDefaultMode();
    planeViewXY.toggleDefaultMode();
    planeViewYZ.toggleDefaultMode();
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