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
    handleObjects(){
        console.log("Handle Obects to render")
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
    handleSelectObjectsInRect(rect){
        console.log("Handle selection objects by rectangle")
        if (!rect){
            throw Error('Can\'t select by empty rectangle')
        }
        return this.model.selectObjectsInRect(rect);
    }
}