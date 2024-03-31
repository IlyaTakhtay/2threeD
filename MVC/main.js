import { PlaneController } from './planes/planeController.js';
import { PlaneModel } from './planes/planeModel.js';
import { PlaneView } from './planes/planeView.js';


const planeModel = new PlaneModel;

const planeController = new PlaneController(planeModel);

const planeView = new PlaneView('myCanvas',planeController);

window.toggleAddPointMode = planeView.toggleAddPointMode.bind(planeView);
window.toggleAddLineMode = planeView.toggleAddLineMode.bind(planeView);
window.deleteSelected = planeView.deleteSelected.bind(planeView);
