import { PlaneController } from './planes/planeController.js';
import { PlaneModel } from './planes/planeModel.js';
import { PlaneView } from './planes/planeView.js';
import { Legend } from './planes/planeView.js'

const planeModel = new PlaneModel;
console.log(planeModel.objects)

const planeController = new PlaneController(planeModel);

const planeView = new PlaneView('container','XYCanvas','XYCanvasCoordinates', 'XYlegend',planeController);

//   const legend = new Legend('XYCanvas', legendData);
//   legend.render();

window.toggleAddPointMode = planeView.toggleAddPointMode.bind(planeView);
window.toggleAddLineMode = planeView.toggleAddLineMode.bind(planeView);
window.deleteSelected = planeView.deleteSelected.bind(planeView);
