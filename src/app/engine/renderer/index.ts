/*
 * © 2021-2025 JustWhatever. All rights reserved.
 * Property of Gavin Abu-Zahra. Do not reproduce or distribute without explicit permission.
 */

export interface DisplayProps {
  width: number;
  height: number;
  ctx: CanvasRenderingContext2D;
}

export default class Renderer {
  protected canvas: HTMLCanvasElement;
  protected ctx: CanvasRenderingContext2D;
  constructor(canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext("2d");
  }
  
  
}