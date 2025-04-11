/*
 * © 2021-2025 JustWhatever. All rights reserved.
 * Property of Gavin Abu-Zahra. Do not reproduce or distribute without explicit permission.
 */

import Engine from "../index";
import {EventType} from "./Sprite";

export interface DisplayProps {
  width: number;
  height: number;
  ctx: CanvasRenderingContext2D;
}

export default class Renderer {
  protected canvas: HTMLCanvasElement;
  protected ctx: CanvasRenderingContext2D;
  protected engine: Engine;
  private _fps: number;
  private _tps: number;
  private _tfps: number;
  private _ttps: number;
  private _lfps: number;
  private _ltps: number;
  public get fps() {return this._fps;}
  public get tps() {return this._tps;}
  
  constructor(canvas: HTMLCanvasElement, engine: Engine) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.engine = engine;
  }
  
  private getDisplayProps(): DisplayProps {
    return {
      ctx: this.ctx,
      height: this.canvas.height,
      width: this.canvas.width,
    }
  }
  
  protected render() {
    this._lfps += 1;
    if(performance.now() > this._tfps + 250) {
      this._fps = this._lfps;
      this._tfps = performance.now();
    }
    
    for (let sprite of this.engine.sprites.sort((a,b) => a.priority - b.priority)) {
      sprite.render({
        display: this.getDisplayProps(),
        type: EventType.render,
        engine: this.engine,
      });
    }
    
    requestAnimationFrame(this.render.bind(this));
  }
  
  protected tick() {
    this._ltps += 1;
    if(performance.now() > this._ttps + 250) {
      this._tps = this._ltps;
      this._ttps = performance.now();
    }
    
    for (let sprite of this.engine.sprites) {
      sprite.tick({
        type: EventType.tick,
        engine: this.engine
      });
    }
    
    setTimeout(this.tick.bind(this), 1000 / this.engine.tickSpeed)
  }
  
  start() {
    this.render();
    this.tick();
  }
}