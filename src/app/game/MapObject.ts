/*
 * © 2021-2025 JustWhatever. All rights reserved.
 * Property of Gavin Abu-Zahra. Do not reproduce or distribute without explicit permission.
 */

import {TexturedMoveableSprite} from "../engine/renderer/TexturedMoveableSprite";
import Physics, {createRect} from "../engine/util/Physics";
import {RenderEvent} from "../engine/renderer/Sprite";
import {SimpleShooter} from "./SimpleShooter";
9
export class MapObject extends TexturedMoveableSprite {
  _pys = new Physics(0,0,createRect([0,0], [MapObject.width,MapObject.height]),0)
  
  private static width = 64;
  private static height = 64;
  
  constructor(props: any, id: number) {
    super(props, id, MapObject.width, MapObject.height);
  }
  
  _name = "MapObject";
  
  public x: number = 0;
  public y: number = 0;
  
  async render(ev: RenderEvent): Promise<void> {
    this._pys.x = (ev.display.width / 2) - SimpleShooter.instance.player.x;
    this._pys.y = (ev.display.height / 2) + SimpleShooter.instance.player.y;
    await super.render(ev);
  }
}