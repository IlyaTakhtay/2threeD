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
fifthExample(planeModelXZ, planeModelYZ, planeModelXY);
console.log(planeModelXZ, planeModelYZ, planeModelXY);
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

window.saveData = function() {
    window.showSaveFilePicker({
        suggestedName: 'models_data.json',
        types: [{
            description: 'JSON Files',
            accept: {'application/json': ['.json']}
        }]
    }).then(fileHandle => {
        const data = {
            XZ: planeModelXZ.objects.map(obj => obj.toJSON()),
            XY: planeModelXY.objects.map(obj => obj.toJSON()),
            YZ: planeModelYZ.objects.map(obj => obj.toJSON())
        };
        const dataStr = JSON.stringify(data, null, 2);

        return fileHandle.createWritable().then(writable => {
            return writable.write(dataStr).then(() => {
                return writable.close().then(() => {
                    console.log('File saved successfully.');
                }).catch(error => {
                    console.error('Error closing file:', error);
                });
            }).catch(error => {
                console.error('Error writing to file:', error);
            });
        }).catch(error => {
            console.error('Error creating writable stream:', error);
        });
    }).catch(error => {
        console.error('Error showing save file picker:', error);
    });
};

window.loadData = function(event) {
    const input = event.target;
    if (input.files.length === 0) {
        return;
    }
    const file = input.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const dataStr = e.target.result;
        console.log("File content:", dataStr); // Debugging
        try {
            const data = JSON.parse(dataStr);
            console.log("Parsed data:", data); // Debugging
            
            // Convert JSON data to objects
            let planeModelXZObjects = data.XZ.map(obj => {
                console.log("XZ Object:", obj); // Debugging
                if (obj.x !== undefined && obj.y !== undefined) {
                    return Point.fromJSON(obj);
                } else {
                    return Line.fromJSON(obj);
                }
            });

            let planeModelXYObjects = data.XY.map(obj => {
                console.log("XY Object:", obj); // Debugging
                if (obj.x !== undefined && obj.y !== undefined) {
                    return Point.fromJSON(obj);
                } else {
                    return Line.fromJSON(obj);
                }
            });

            let planeModelYZObjects = data.YZ.map(obj => {
                console.log("YZ Object:", obj); // Debugging
                if (obj.x !== undefined && obj.y !== undefined) {
                    return Point.fromJSON(obj);
                } else {
                    return Line.fromJSON(obj);
                }
            });

            // Match points to lines
            planeModelXZObjects = matchPointsToLines(planeModelXZObjects);
            planeModelXYObjects = matchPointsToLines(planeModelXYObjects);
            planeModelYZObjects = matchPointsToLines(planeModelYZObjects);

            console.log("planeModelXZObjects:", planeModelXZObjects); // Debugging
            console.log("planeModelXYObjects:", planeModelXYObjects); // Debugging
            console.log("planeModelYZObjects:", planeModelYZObjects); // Debugging

            // Set objects in models
            planeModelXZ.setObjects(planeModelXZObjects);
            planeModelXY.setObjects(planeModelXYObjects);
            planeModelYZ.setObjects(planeModelYZObjects);

            // Redraw the objects on the views
            planeViewXZ.drawObjects();
            planeViewXY.drawObjects();
            planeViewYZ.drawObjects();
        } catch (error) {
            console.error("Error parsing JSON data: ", error);
            alert("Error loading data. Please check the file format.");
        }
    };
    
    reader.readAsText(file);
};

// Function to match points to lines based on coordinates
function matchPointsToLines(planeModelObjects) {
    const allPoints = planeModelObjects.filter(obj => obj instanceof Point);
    const allLines = planeModelObjects.filter(obj => obj instanceof Line);

    // Create a map of points for quick lookup by name
    const pointMap = new Map(allPoints.map(point => [point.name, point]));

    // Link points within lines to actual point objects
    allLines.forEach(line => {
        // Find and link point1
        if (line.point1 && typeof line.point1 === 'object') {
            line.point1 = pointMap.get(line.point1.name);
        }
        // Find and link point2
        if (line.point2 && typeof line.point2 === 'object') {
            line.point2 = pointMap.get(line.point2.name);
        }
    });

    // Return combined array of points and lines
    return [...allPoints, ...allLines];
}

// Function to find a matching point based on coordinates
function findMatchingPoint(targetPoint, pointsArray) {
    return pointsArray.find(point => point.pointX === targetPoint.pointX && point.pointY === targetPoint.pointY);
}

// if ('serviceWorker' in navigator) {
//     window.addEventListener('load', () => {
//       navigator.serviceWorker.register('/service-worker.js').then(registration => {
//         console.log('ServiceWorker registration successful with scope: ', registration.scope);
//       }, error => {
//         console.log('ServiceWorker registration failed: ', error);
//       });
//     });
//   }