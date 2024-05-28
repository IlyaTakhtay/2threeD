export class PlaneController {

    constructor(model){
        this.model = model;
    }

    handleCreateObject(coordinates){
        console.log("Handle add Obejct")
        console.log("Coordinates", coordinates)
        if (!coordinates){
            throw Error ('Can\'t add empty');
        }
        return this.model.createObject(coordinates);
    }
    
    handleDeleteObject(coordinates){
        console.log("Handle Remove object")
        if (!coordinates){
            throw Error ('Can\'t delete empty');
        }
        return this.model.deleteObject(coordinates);
    }

    handleObjects(){
        // console.log("Handle Obects to render")
        return this.model.objects;
    }

    handleSelect(object){
        console.log("Handle select Obejct")
        if (!object){
            throw Error ('Can\'t select empty');
        }
        return this.model.selectObject(object);
    }

    handleClearSelectedObjects() {
        console.log("Handle clear selected Obejcts")
        return this.model.clearSelectedObjects();
    }

    handleDeleteSelectedObjects(){
        console.log("Handle delete Object");
        return this.model.deleteSelectedObjects();
    }

    handleSelectObjectByName(name) {
        console.log("Handle selection object")
        return this.model.selectObjectByName(name);
    }
    handleSelectObjectsInRect(rect){
        console.log("Handle selection objects by rectangle")
        if (!rect){
            throw Error('Can\'t select by empty rectangle')
        }
        return this.model.selectObjectsInRect(rect);
    }

    handleFindObjectName(coordinates) {
        console.log("Handle find object coordinates");
        const result = this.model.findObject(coordinates);
        console.log('pn', result);
        if (result) {
            const { object, pointType } = result;
            return {
                name: object.name,
                type: object.constructor.name,
                pointType: pointType,
            };
        } else {
            return null;
        }
    }

    handleUpdateObjectCoordinates(objectName, x, y, pointType=null) {
        console.log('coord',objectName, x, y)
        this.model.updateObjectCoordinatesByName(objectName, x, y, pointType);
    }

    handleUpdateObjectName(objectName,newName) {
        console.log("Handle update object name")
        return this.model.updateObjectName(objectName,newName)
    }

    handleCheckObjectSelection(obj) {
        return this.model.selectedObjects.has(obj);
    }

    handleSplitSelectedLine(data){//TODO
        const point = this.model.splitSelectedLine(data);
        console.log("Handle split line")
        console.log("split line in point: ", point)
        return point
    }
}