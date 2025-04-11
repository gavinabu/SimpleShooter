/*
 * © 2021-2025 JustWhatever. All rights reserved.
 * Property of Gavin Abu-Zahra. Do not reproduce or distribute without explicit permission.
 */

export type Cord = [number,number];
export type Shape = Cord[];

export default class Physics {
  // origin
  x: number;
  // origin
  y: number;
  shape: Shape;
  rot: number;
  constructor(x: number, y: number,shape: Shape, rot: number) {
    this.x = x;
    this.y = y;
    this.shape = shape;
    this.rot = rot;
  }
  
  moveWithGrid(x:number, y:number) {
    this.x += x;
    this.y += y;
  }
  
  moveWithRot(amount: number, degOffset?: number) {
    const rad = (this.rot + (degOffset||0)) * (Math.PI / 180)
    
    this.x += Math.cos(rad) * amount;
    this.y += Math.sin(rad) * amount;
  }
  
  getShapeWithRot(): Shape {
    return this.shape.map(([x,y]) => {
      return rotatePointWithOrigin([x,y],[0,0],this.rot)
    }) as Shape;
  }
}

export function rotatePointWithOrigin([x,y]: Cord, [originX,originY]: Cord, rot: number) {
  const xx = x - originX;
  const yy = y - originY;
  const rad = rot * (Math.PI / 180);
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  return [(xx*cos - yy*sin) - originX, (xx*sin + yy*cos) + originY]
}

export function addCords([x1,y1]: Cord, [x2,y2]: Cord): Cord {
  return [x1+x2, y1+y2];
}

export function subtractCords([x1,y1]: Cord, [x2,y2]: Cord): Cord {
  return [x1-x2, y1-y2];
}

export function multiplyCords([x1,y1]: Cord, [x2,y2]: Cord): Cord {
  return [x1*x2, y1*y2];
}

export function divideCords([x1,y1]: Cord, [x2,y2]: Cord): Cord {
  return [x1/x2, y1/y2];
}

export function createRect([x,y]: Cord,[w,h]: Cord): Shape {
  return [
    addCords([x,y],multiplyCords([-w,h], [0.5,0.5])),
    addCords([x,y],multiplyCords([w,h], [0.5,0.5])),
    addCords([x,y],multiplyCords([w,-h], [0.5,0.5])),
    addCords([x,y],multiplyCords([-w,-h], [0.5,0.5])),
  ]
}

export function closeShape(shape: Shape) {
  return [...shape, shape[0]];
}