/*
 * © 2021-2025 JustWhatever. All rights reserved.
 * Property of Gavin Abu-Zahra. Do not reproduce or distribute without explicit permission.
 */

import {RenderEvent, Sprite} from "../../engine/renderer/Sprite";
import {MoveableSprite} from "../../engine/renderer/MoveableSprite";
import Physics, {createRect} from "../../engine/util/Physics";

export class TexturedMoveableSprite extends MoveableSprite {
  private _texture: string = "";
  protected w: number;
  protected h: number;
  protected img = new Image();
  protected yOffset: number = 0;
  set texture(texture: string) {
    this._texture = texture;
    this.img.src = texture;
  }
  get texture(): string {return this._texture;}
  
  constructor(props: any, id: number, width: number, height: number) {
    super(props, id);
    this.w = width;
    this.h = height;
    this._pys = new Physics(0,0,createRect([0,0], [width,height]),0);
    this.img.src = this._texture;
  }
  
  static create(props: any): (id: number) => Sprite {
    return (id: number) => {
      return new this(props, id, props.width, props.height);
    }
  }
  
  async render(ev: RenderEvent): Promise<void> {
    const { ctx } = ev.display;
    
    if (!this.img.complete) return;
    
    ctx.save();
    
    ctx.translate(this._pys.x, this._pys.y);
    ctx.rotate((this._pys.rot * Math.PI) / 180);
    
    const zOffset = this.yOffset ?? 0;
    const scaleX = this.w / this.img.width;
    
    const cropHeight = this.h / scaleX;
    const clampedCropY = Math.min(Math.max(zOffset, 0), this.img.height - cropHeight);
    const clampedCropHeight = Math.min(cropHeight, this.img.height - clampedCropY);
    
    ctx.drawImage(
      this.img,
      0, clampedCropY,
      this.img.width, clampedCropHeight,
      -this.w / 2, -this.h / 2,
      this.w, this.h
    );
    
    ctx.restore();
  }
  
}