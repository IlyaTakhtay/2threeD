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

  equalsProjection(other) {
    const equalXY = 
                    this.pointX === other.pointX && this.pointY === other.pointY;
  
    const equalXZ = 
                    this.pointX === other.pointX && this.pointZ === other.pointZ;
  
    const equalYZ = 
                    this.pointY === other.pointY && this.pointZ === other.pointZ;
    
    return equalXY || equalXZ || equalYZ;
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

  getProjectionOnXY(){
    return new Line({point1:new Point({x:this.linePointX1,y:this.linePointY1}), point2:new Point({x:this.linePointX2, y:this.linePointY2})})
  }
  
  getProjectionOnYZ(){
    return new Line({point1:new Point({x:this.linePointY1,y:this.linePointZ1}), point2:new Point({x:this.linePointY2, y:this.linePointZ2})})
  }

  getProjectionOnXZ(){
    return new Line({point1:new Point({x:this.linePointX1,y:this.linePointZ1}), point2:new Point({x:this.linePointX2, y:this.linePointZ2})})
  }

  equals(other) {
    return (
      (this.firstPoint.equals(other.firstPoint) && this.secondPoint.equals(other.secondPoint)) ||
      (this.secondPoint.equals(other.firstPoint) && this.firstPoint.equals(other.secondPoint))
    );
  }

  equalsProjection(other) { 
    return (
      (this.firstPoint.equalsProjection(other.firstPoint) && this.secondPoint.equalsProjection(other.secondPoint)) ||
      (this.secondPoint.equalsProjection(other.firstPoint) && this.firstPoint.equalsProjection(other.secondPoint))
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
  
  //TODO: WRITTEN BY GPT // может быть уже и не нужно
  makeLineByLinesChain(lines) {
    const mergedLines = [];
  
    // Создаем копию массива линий
    const remainingLines = [...lines];
  
    while (remainingLines.length > 0) {
      const chain = [remainingLines[0]];
      remainingLines.shift();
  
      let i = 0;
      while (i < remainingLines.length) {
        const lastLine = chain[chain.length - 1];
        const currentLine = remainingLines[i];
  
        if (this.areCollinear(lastLine, currentLine) && this.haveCommonPoint(lastLine, currentLine)) {
          chain.push(currentLine);
          remainingLines.splice(i, 1);
        } else {
          i++;
        }
      }
  
      if (chain.length > 1) {
        const mergedLine = new Line({
          point1: chain[0].firstPoint,
          point2: chain[chain.length - 1].secondPoint
        });
        mergedLines.push(mergedLine);
      } else {
        // mergedLines.push(chain[0]);
      }
    }
    console.log("added lines",mergedLines)
    mergedLines.forEach(e => lines.push(e))
    return lines;
  }
  
  areCollinear(line1, line2) {
    const p1 = line1.firstPoint;
    const p2 = line1.secondPoint;
    const p3 = line2.firstPoint;
    const p4 = line2.secondPoint;
  
    // Проверяем, лежат ли точки на одной прямой
    if((p2.pointY - p1.pointY) * (p4.pointX - p3.pointX) === (p4.pointY - p3.pointY) * (p2.pointX - p1.pointX)){
      return true
    }
    // console.log((p2.pointY - p1.pointY) * (p4.pointX - p3.pointX) === (p4.pointY - p3.pointY) * (p2.pointX - p1.pointX))
    // return (p2.pointY - p1.pointY) * (p4.pointX - p3.pointX) === (p4.pointY - p3.pointY) * (p2.pointX - p1.pointX);
  }
  
  haveCommonPoint(line1, line2) {
    // Проверяем, имеют ли линии общую точку
    return (
      line1.firstPoint.equals(line2.firstPoint) ||
      line1.firstPoint.equals(line2.secondPoint) ||
      line1.secondPoint.equals(line2.firstPoint) ||
      line1.secondPoint.equals(line2.secondPoint)
    );
  }
  //TODO: WRITTEN BY GPT


  linesExtractor(objects) {
    return objects.filter(element => element instanceof Line);
  }

  inputDataConverter({objects, planeAxes}){
      const points = objects.filter(obj => obj instanceof Point);
      const lines = objects.filter(obj => obj instanceof Line);
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
      for (let j = 0; j < points3D.length; j++) {
        const point1 = points3D[i];
        const point2 = points3D[j];
      
        const currentLine = new Line3D({point1:point1,point2:point2})
        // console.log("currentLine", currentLine)

        const currentFrontProjection = currentLine.getProjectionOnXZ()
        const currentSideProjection = currentLine.getProjectionOnYZ()
        const currentTopProjection = currentLine.getProjectionOnXY()

        // console.log("currentLineProetions", currentFrontProjection,currentSideProjection,currentTopProjection)

        const frontCondition = frontLines.some(e => {
          if (currentFrontProjection.equals(e) || currentFrontProjection.equalsInDot(e) || currentFrontProjection.isDotsOnLineBoolean([e.firstPoint,e.secondPoint])) {
            // console.log("Front lines match:", e, currentFrontProjection);
            return true;
          }
        });

        const sideCondition = sideLines.some(e => {
          if (currentSideProjection.equals(e) || currentSideProjection.equalsInDot(e) || currentSideProjection.isDotsOnLineBoolean([e.firstPoint,e.secondPoint])) {
            // console.log("Side lines match:", e, currentFrontProjection);
            return true;
          }
        });

        const topCondition = topLines.some(e => {
          if (currentTopProjection.equals(e) || currentTopProjection.equalsInDot(e) || currentTopProjection.isDotsOnLineBoolean([e.firstPoint,e.secondPoint])) {
            // console.log("Top lines match:", e, currentFrontProjection);
            return true;
          }
        });
        if (topCondition && sideCondition && frontCondition){
          Lines3D.push(currentLine);
        }
      }
    }
    return Lines3D;
  }


  mainProcess ({yzObjects, xzObjects, xyObjects}) {
    this.#edges = [],this.#faces = [],this.#vertices = [];
    const sideView = {
      points: this.pointsExtractor(this.inputDataConverter({ objects: yzObjects, planeAxes: 'YZ' })),
      lines: this.linesExtractor(yzObjects)
    };
    
    const frontView = {
      points: this.pointsExtractor(this.inputDataConverter({ objects: xzObjects, planeAxes: 'XZ' })),
      lines: this.linesExtractor(xzObjects)
    };
    
    const topView = {
      points: this.pointsExtractor(this.inputDataConverter({ objects: xyObjects, planeAxes: 'XY' })),
      lines: this.linesExtractor(xyObjects)
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