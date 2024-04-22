import { Point } from "../planes/planeModel.js";
import { Line } from "../planes/planeModel.js";
import observer from "../planes/utils/observer.js";

class Point3D {
  #x;
  #y;
  #z;
  #name;
  constructor(x=null, y=null, z=null) {
    this.#x = x;
    this.#y = y;
    this.#z = z;
  }

  get pointX() { return this.#x }
  get pointY() { return this.#y }
  get pointZ() { return this.#z }

  get name() { return this.#name }

  set pointX(x) {this.#x = x}
  set pointY(y) {this.#y = y}
  set pointZ(z) {this.#z = z}

  set name(name) { this.#name = name }

  equals(other) {
    return this.pointX === other.pointX && this.pointY === other.pointY && this.pointZ === other.pointZ;
  }
}

class Line3D {
  #point1;
  #point2;
  #name;
  constructor({point1 = null, point2 = null, name = null}) {
      this.#point1 = point1;
      this.#point2 = point2;
      this.#name = name;
  }
  get linePointX1() { return this.#point1.pointX }
  get linePointY1() { return this.#point1.pointY }
  get linePointZ1() { return this.#point1.pointZ }

  get linePointX2() { return this.#point2.pointX }
  get linePointY2() { return this.#point2.pointY }
  get linePointZ2() { return this.#point2.pointZ }

  set linePointX1(x1) { this.#point1.pointX = x1 }
  set linePointY1(y1) { this.#point1.pointY = y1 }
  set linePointZ1(z1) { this.#point1.pointZ = z1 }

  set linePointX2(x2) { this.#point2.pointX = x2 }
  set linePointY2(y2) { this.#point2.pointY = y2 }
  set linePointZ2(z2) { this.#point2.pointZ = z2 }

  get firstPoint() { return this.#point1 }
  get secondPoint() { return this.#point2 }

  get name() { return this.#name };

  set name(name) { this.#name = name }
  
  equals(other) { 
    return (
      (this.firstPoint.equals(other.firstPoint) && this.secondPoint.equals(other.secondPoint)) ||
      (this.secondPoint.equals(other.firstPoint) && this.secondPoint.equals(other.secondPoint))
    );
  }
}

class Face {
  constructor(vertices) {
    this.vertices = vertices;
  }
}


export class Space3DModel {
  #vertices;
  #edges;
  #faces;
  constructor() {
    this.#vertices = [];
    this.#edges = [];
    this.#faces = [];
    // this.init();
    this.subscribe();
  }

  subscribe() {
    observer.subscribe('reconstruct',(data) => {
      if (data && data.yzObjects && data.xzObjects && data.xyObjects) {
        // Data is valid, send it to mainProcess
        this.mainProcess({
          yzObjects: data.yzObjects,
          xzObjects: data.xzObjects,
          xyObjects: data.xyObjects
        });
      } else {
        console.error("Invalid data for reconstruct received:", data);
      }
    });
  }
  
  get vertices(){
    return this.#vertices;
  }

  get edges(){
    return this.#edges;
  }

  get faces(){
    return this.#faces;
  }


  pointsExtractor(objects) {
    return objects.filter(element => element instanceof Point3D);
  }
  
  linesExtractor(objects) {
    return objects.filter(element => element instanceof Line3D);
  }

  inputDataConverter({objects, planeAxes}){
      console.log(objects)
      const points = objects.filter(obj => obj instanceof Point);
      const lines = objects.filter(obj => obj instanceof Line);
      console.log(points)
      console.log(lines)
      let convertedPoints;
      switch (planeAxes){
        case 'XY':
          convertedPoints = points.map(point => new Point3D(point.pointX, point.pointY, null));
            break;
        case 'XZ':
          convertedPoints = points.map(point => new Point3D(point.pointX, null, point.pointY));
            break;
        case 'YZ':
          convertedPoints = points.map(point => new Point3D(null, point.pointX, point.pointY));
            break;
    }
      
      
      const convertedLines = lines.map(line => {
        const point1Index = points.indexOf(line.firstPoint);
        const point2Index = points.indexOf(line.secondPoint);

        return new Line3D({point1:convertedPoints[point1Index], point2:convertedPoints[point2Index]});
      });
      
      return objects.map(obj => {
        if (obj instanceof Point) {
          return convertedPoints[points.indexOf(obj)];
        } else if (obj instanceof Line) {
          return convertedLines[lines.indexOf(obj)];
        }
      });
  }

  find3DPoints ({frontView, topView, sideView}){
      const result = [];
      console.log("find3DPoints", frontView, topView, sideView)
      for (const frontElement of frontView) {
        if (frontElement instanceof Point3D) {
          const x1 = frontElement.pointX;
          const z1 = frontElement.pointZ;
    
          for (const topElement of topView) {
            if (topElement instanceof Point3D && x1 === topElement.pointX) {
              const y1 = topElement.pointY;
    
              for (const sideElement of sideView) {
                if (sideElement instanceof Point3D && y1 === sideElement.pointY && z1 === sideElement.pointZ) {
                  const point3D = new Point3D(x1, y1, z1);
    
                  // Проверяем, есть ли уже такая точка в результирующем массиве
                  if (!result.some(p => p.equals(point3D))) {
                    result.push(point3D);
                  }
                }
              }
            }
          }
        }
      }
      return result;
  }

  find3DLines({points3D, frontLines, topLines, sideLines}) {
    const Lines3D = [];
    console.log("find3DLines",points3D, frontLines, topLines, sideLines)
    for (let i = 0; i < points3D.length; i++) {
      for (let j = i + 1; j < points3D.length; j++) {
        const point1 = points3D[i];
        const point2 = points3D[j];
        
  
        const frontLine = new Line3D({
          point1:new Point3D(point1.pointX, null, point1.pointZ),
          point2:new Point3D(point2.pointX, null, point2.pointZ)
        });
        const topLine = new Line3D({
          point1:new Point3D(point1.pointX, point1.pointY, null),
          point2:new Point3D(point2.pointX, point2.pointY, null)
        });
        const sideLine = new Line3D({
          point1:new Point3D(null, point1.pointY, point1.pointZ),
          point2:new Point3D(null, point2.pointY, point2.pointZ)
        });
        console.log("Points",point1,point2)
        console.log("check current lines", frontLine.firstPoint, frontLine.secondPoint, 
        topLine.firstPoint, topLine.secondPoint, sideLine.firstPoint, sideLine.secondPoint)
        if (
          (frontLines.some(e => e.equals(frontLine))) &&
          (topLines.some(e => e.equals(topLine)))  &&
          (sideLines.some(e => e.equals(sideLine))) 
        ) {
          const line3D = new Line3D({point1:point1, point2:point2});
          Lines3D.push(line3D);
        }
      }
    }
  
    return Lines3D;
  }
  // find3DLines({points3D, frontLines, topLines, sideLines}) {
  //   const Lines3D = [];

  //   for (let i = 0; i < points3D.length; i++) {
  //     for (let j = i + 1; j < points3D.length; j++) {
  //       const point1 = points3D[i];
  //       const point2 = points3D[j];

  //       const frontLine = new Line3D({
  //         point1: new Point3D(point1.pointX, null, point1.pointZ),
  //         point2: new Point3D(point2.pointX, null, point2.pointZ)
  //       });
  //       const topLine = new Line3D({
  //         point1: new Point3D(point1.pointX, point1.pointY, null),
  //         point2: new Point3D(point2.pointX, point2.pointY, null)
  //       });
  //       const sideLine = new Line3D({
  //         point1: new Point3D(null, point1.pointY, point1.pointZ),
  //         point2: new Point3D(null, point2.pointY, point2.pointZ)
  //       });

  //       if (frontLines.some(e => e.equals(frontLine)) &&
  //           (point1.pointY === point2.pointY || topLines.some(e => e.equals(topLine))) &&
  //           (point1.pointZ === point2.pointZ || sideLines.some(e => e.equals(sideLine)))) {
  //         const line3D = new Line3D({point1, point2});
  //         Lines3D.push(line3D);
  //       }
  //     }
  //   }

  //   return Lines3D;
  // }
  

  mainProcess ({yzObjects, xzObjects, xyObjects}) {
    this.#edges = [],this.#faces = [],this.#vertices = [] 
    const sideView = {
      points: this.pointsExtractor(this.inputDataConverter({ objects: yzObjects, planeAxes: 'YZ' })),
      lines: this.linesExtractor(this.inputDataConverter({ objects: yzObjects, planeAxes: 'YZ' }))
    };
    
    const frontView = {
      points: this.pointsExtractor(this.inputDataConverter({ objects: xzObjects, planeAxes: 'XZ' })),
      lines: this.linesExtractor(this.inputDataConverter({ objects: xzObjects, planeAxes: 'XZ' }))
    };
    
    const topView = {
      points: this.pointsExtractor(this.inputDataConverter({ objects: xyObjects, planeAxes: 'XY' })),
      lines: this.linesExtractor(this.inputDataConverter({ objects: xyObjects, planeAxes: 'XY' }))
    };
    console.log("PlanesLines", sideView,frontView,topView)
    console.log("PlanesLines", sideView.lines,frontView.lines,topView.lines)
    const points3D = this.find3DPoints({sideView:sideView.points,frontView:frontView.points,topView:topView.points});
    points3D.forEach(item => this.#vertices.push(item))
    const lines3D = this.find3DLines({points3D:points3D,sideLines:sideView.lines,frontLines:frontView.lines,topLines:topView.lines})
    lines3D.forEach(item => this.#edges.push(item))
    console.log("3Dpoints", this.#vertices)
    console.log("3DLines,", this.#edges)
  }

}