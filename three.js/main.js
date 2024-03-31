import { CanvasManager } from './content/CanvasManager.js';

// Usage
const canvasManager = new CanvasManager('myCanvas');

window.toggleAddPointMode = canvasManager.toggleAddPointMode.bind(canvasManager);
window.toggleAddLineMode = canvasManager.toggleAddLineMode.bind(canvasManager);
window.deleteSelected = canvasManager.deleteSelected.bind(canvasManager);
