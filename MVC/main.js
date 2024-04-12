import { PlaneController } from './planes/planeController.js';
import { PlaneModel } from './planes/planeModel.js';
import { PlaneView } from './planes/planeView.js';
import { Legend } from './planes/planeView.js'

const planeModelXZ = new PlaneModel;

const planeControllerXZ = new PlaneController(planeModelXZ);

const planeViewXZ = new PlaneView('containerXZ','XZCanvas','XZCanvasCoordinates', 'XZegend',planeControllerXZ);

const planeModelXY = new PlaneModel;

const planeControllerXY = new PlaneController(planeModelXY);

const planeViewXY = new PlaneView('containerXY','XYCanvas','XYCanvasCoordinates', 'XYlegend',planeControllerXY);
//   const legend = new Legend('XYCanvas', legendData);
//   legend.render();

window.toggleAddPointMode = function() {
    planeViewXZ.toggleAddPointMode();
    planeViewXY.toggleAddPointMode();
  };
  
window.toggleAddLineMode = function() {
    planeViewXZ.toggleAddLineMode();
    planeViewXY.toggleAddLineMode();
};
  
window.deleteSelected = function() {
    planeViewXZ.deleteSelected();
    planeViewXY.deleteSelected();
};