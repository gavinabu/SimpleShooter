/*
 * © 2021-2025 JustWhatever. All rights reserved.
 * Property of Gavin Abu-Zahra. Do not reproduce or distribute without explicit permission.
 */

import {RenderEvent} from "../../engine/renderer/Sprite";
import {MoveableSprite} from "../../engine/renderer/MoveableSprite";
import Physics, {closeShape, createRect, rotatePointWithOrigin} from "../../engine/util/Physics";
import {TickEvent} from "../../engine";
import {TexturedMoveableSprite} from "../../engine/renderer/TexturedMoveableSprite";
import Ploom from '../../assets/sprites/player/ploom_red.png'

export interface PlayerProps {
  username: string;
}

export class Player extends TexturedMoveableSprite {
  _pys = new Physics(0,0,createRect([0,0], [Player.width,Player.height]),0)
  props: PlayerProps;
  priority = 1;
  
  get username(): string {return this.props.username}
  private static width = 64;
  private static height =  64;
  
  public x: number = 0;
  public y: number = 0;
  
  constructor(props: PlayerProps, id: number) {
    super(props, id, Player.width, Player.height);
    this.texture = Ploom;
    this.name = `Player-${props.username}`;
  }
  
  static create(props: PlayerProps) {
    return super.create({...props, width: Player.width, height: Player.height})
  }
  
  async render(ev: RenderEvent): Promise<void> {
    this._pys.y = ev.display.height / 2;
    this._pys.x = ev.display.width / 2;
    await super.render(ev);
  }
  
  async tick(ev: TickEvent): Promise<void> {
    const right = ev.engine.keysDown.has("KeyD") || ev.engine.keysDown.has("ArrowRight") ? 1 : 0;
    const left = ev.engine.keysDown.has("KeyA") || ev.engine.keysDown.has("ArrowLeft") ? 1 : 0;
    const up = ev.engine.keysDown.has("KeyW") || ev.engine.keysDown.has("ArrowUp") ? 1 : 0;
    const down = ev.engine.keysDown.has("KeyS") || ev.engine.keysDown.has("ArrowDown") ? 1 : 0;
    
    const dx = right - left;
    const dy = up - down;
    
    this.yOffset = (dx !== 0 ? 4+dx : dy !== 0 ? Math.min(2-dy,2) : 0) * 128;
    
    const magnitude = Math.hypot(dx, dy);
    const speed = 10;
    
    if (magnitude > 0) {
      this.x += (dx / magnitude) * speed;
      this.y += (dy / magnitude) * speed;
    }
  }
}