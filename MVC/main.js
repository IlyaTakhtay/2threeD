import { PlaneController } from './planes/planeController.js';
import { PlaneModel } from './planes/planeModel.js';
import { PlaneView } from './planes/planeView.js';
import { Legend } from './planes/planeView.js'

const planeModel = new PlaneModel;

const planeController = new PlaneController(planeModel);

const planeView = new PlaneView('container','XYCanvas','mouseCoordinates',planeController);

  // Использование
  const legendData = [
    { label: 'Объект 1', color: 'red', size: 10 },
    { label: 'Объект 2', color: 'green', size: 12 },
    { label: 'Объект 3', color: 'blue', size: 8 },
  ];
  
  const legend = new Legend('XYCanvas', legendData);
  legend.render();

window.toggleAddPointMode = planeView.toggleAddPointMode.bind(planeView);
window.toggleAddLineMode = planeView.toggleAddLineMode.bind(planeView);
window.deleteSelected = planeView.deleteSelected.bind(planeView);
