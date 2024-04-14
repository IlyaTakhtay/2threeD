import { Point } from "./planeModel.js";
import { Line } from "./planeModel.js";
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
  set pointZ(z) {this.#y = z}

  set name(name) { this.#name = name }

  equals(other) {
    return this.#x === other.pointX && this.#y === other.pointY && this.#z === other.pointZ;
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
      (this.secondPoint.equals(other.endPoint) && this.secondPoint.equals(other.secondPoint))
    );
  }
}

class Face {
  constructor(vertices) {
    this.vertices = vertices;
  }
}

export class Plane3D {
  #vertices;
  #edges;
  #faces;
  constructor() {
    this.#vertices = [];
    this.#edges = [];
    this.#faces = [];
  }

  pointsExtractor(objects){
    objects.forEach(element => {
      if (element instanceof Point) return element
    });
  }

  linesExtractor(objects){
    objects.forEach(element => {
      if (element instanceof Line) return element
    });
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

  find3DEdges(points3D, frontEdges, topEdges, sideEdges) {
    const edges3D = [];
  
    for (let i = 0; i < points3D.length; i++) {
      for (let j = i + 1; j < points3D.length; j++) {
        const startPoint = points3D[i];
        const endPoint = points3D[j];
  
        const frontEdge = new Edge(
          new Point3D(startPoint.pointX, null, startPoint.pointZ),
          new Point3D(endPoint.pointX, null, endPoint.pointZ)
        );
        const topEdge = new Edge(
          new Point3D(startPoint.pointX, startPoint.pointY, null),
          new Point3D(endPoint.pointX, endPoint.pointY, null)
        );
        const sideEdge = new Edge(
          new Point3D(null, startPoint.pointY, startPoint.pointZ),
          new Point3D(null, endPoint.pointY, endPoint.pointZ)
        );
  
        if (
          (frontEdges.some(e => e.equals(frontEdge)) || startPoint.pointX === endPoint.pointX && startPoint.pointZ === endPoint.pointZ) &&
          (topEdges.some(e => e.equals(topEdge)) || startPoint.pointX === endPoint.pointX && startPoint.pointY === endPoint.pointY) &&
          (sideEdges.some(e => e.equals(sideEdge)) || startPoint.pointY === endPoint.pointY && startPoint.pointZ === endPoint.pointZ)
        ) {
          const edge3D = new Edge(startPoint, endPoint);
          edges3D.push(edge3D);
        }
      }
    }
  
    return edges3D;
  }
  

  mainProcess ({yzObjects, xzObjects, xyObjects}) {
    const sideView = ({
      points:this.pointsExtractor(this.inputDataConverter({objects:yzObjects, planeAxes:'YZ'})),
      lines:this.linesExtractor(this.inputDataConverter({objects:yzObjects, planeAxes:'YZ'}))
    });
    const frontView = this.inputDataConverter({objects:xzObjects, planeAxes:'XZ'})
    const topView = this.inputDataConverter({objects:xyObjects, planeAxes:'XY'})
    sideView = 
    console.log("Planes", sideView,frontView,topView)
    console.log("3Dpoints", this.find3DPoints({sideView:sideView,frontView:frontView,topView:topView}))
  }


}