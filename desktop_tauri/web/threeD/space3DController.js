export class Space3DController {

    constructor(model){
        this.model = model;
    }

    handleObjects(){
        console.log("Handle 3D Obects  to render")
        return ({vertices:this.model.vertices, edges:this.model.edges});
    }

}