/*
 * © 2021-2025 JustWhatever. All rights reserved.
 * Property of Gavin Abu-Zahra. Do not reproduce or distribute without explicit permission.
 */

import {TexturedMoveableSprite} from "../engine/renderer/TexturedMoveableSprite";
import {Player} from "./sprites/Player";
import Physics, {createRect} from "../engine/util/Physics";
import {TickEvent} from "../engine";
import {RenderEvent} from "../engine/renderer/Sprite";

export class Weapon extends TexturedMoveableSprite {
  _pys = new Physics(0,0,createRect([0,0], [Weapon.width,Weapon.height]),0)
  parent: Player;
  priority = 2;
  
  private static width = 128;
  private static height = 128;
  
  // shots per magazine
  protected rounds = 12;
  // rounds per second
  protected firerate = 0.8;
  // burst
  protected burst = false;
  // burst count
  protected burstCount = 0;
  // burst speed. rounds per second
  protected burstSpeed = 0;
  
  constructor(props: {parent: Player}, id: number) {
    super(props, id, Weapon.width, Weapon.height);
    this.name = `Player-Weapon-${props.parent.username}`;
  }
  
  static create(props: {parent: Player}) {
    return super.create(props);
  }
  
  async render(ev: RenderEvent): Promise<void> {
    this._pys.y = ev.display.height / 2;
    this._pys.x = ev.display.width / 2;
    const rotated = Math.atan2(ev.engine.cursor.y - this._pys.y, ev.engine.cursor.x - this._pys.x) * (180 / Math.PI);
    this.yOffset = (rotated > 90 || rotated < -90) ? 128 : 0;
    this._pys.rot = rotated + ((rotated > 90 || rotated < -90) ? 180 : 0)
    await super.render(ev);
  }
  
  async tick(ev: TickEvent): Promise<void> {
  }
}