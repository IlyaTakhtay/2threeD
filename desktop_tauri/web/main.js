import { Line, PlaneModel, Point } from './planes/planeModel.js';
import { PlaneController } from './planes/planeController.js';
import { PlaneView } from './planes/planeView.js';
import { Legend } from './planes/planeView.js'

import observer from './planes/utils/observer.js';

import { Space3DModel } from './threeD/space3DModel.js';
import { Space3DView } from './threeD/space3DView.js';

import { firstExample, fouthExample, secondExample, thirdExample,fifthExample } from './planes/utils/example.js';
import { Space3DController } from './threeD/space3DController.js';

import { ContainerController } from './ui/mainField.js';

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

planeViewYZ.drawObjects();
planeViewXY.drawObjects();
planeViewXZ.drawObjects();
//set example
fouthExample(planeModelXZ, planeModelYZ, planeModelXY);

planeViewYZ.drawObjects(); //need to draw afte example initiation
planeViewXY.drawObjects();
planeViewXZ.drawObjects();

const space3DModel = new Space3DModel()
const space3DController = new Space3DController(space3DModel);
const space3DView = new Space3DView("container3D",space3DController);

window.splitLine = function() {
    planeViewXZ.toggleAddPointMode();
    planeViewXY.toggleAddPointMode();
    planeViewYZ.toggleAddPointMode();
  };

window.reconstruct = function() {
    observer.dispatch('reconstruct', {yzObjects:planeModelYZ.objects, xzObjects: planeModelXZ.objects, xyObjects: planeModelXY.objects})
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

window.toggleStats = function() {
    space3DView.toggleStats();
}

window.toggleContainers = function() {
    ContainerController.toggleContainers();
    planeViewXZ.onWindowResize();
    planeViewXY.onWindowResize();
    planeViewYZ.onWindowResize();
    space3DView.onWindowResize();
}

window.toggleAddDashedLineMode = function() {
    planeViewXZ.toggleAddDashedLineMode();
    planeViewXY.toggleAddDashedLineMode();
    planeViewYZ.toggleAddDashedLineMode();
}