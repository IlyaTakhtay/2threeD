import { PlaneController } from './planes/planeController.js';
import { PlaneModel } from './planes/planeModel.js';
import { PlaneView } from './planes/planeView.js';
import { Legend } from './planes/planeView.js'

const planeModel = new PlaneModel;

const planeController = new PlaneController(planeModel);

const planeView = new PlaneView('container','XYCanvas','XYCanvasCoordinates', 'XYlegend',planeController);

const planeModelYZ = new PlaneModel;

const planeControllerYZ = new PlaneController(planeModelYZ);

const planeViewYZ = new PlaneView('containerYZ','YZCanvas','YZCanvasCoordinates', 'YZlegend',planeControllerYZ);
//   const legend = new Legend('XYCanvas', legendData);
//   legend.render();

window.toggleAddPointMode = function() {
    planeView.toggleAddPointMode();
    planeViewYZ.toggleAddPointMode();
  };
  
window.toggleAddLineMode = function() {
    planeView.toggleAddLineMode();
    planeViewYZ.toggleAddLineMode();
};
  
window.deleteSelected = function() {
    planeView.deleteSelected();
    planeViewYZ.deleteSelected();
};