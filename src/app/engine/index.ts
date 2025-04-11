/*
 * © 2021-2025 JustWhatever. All rights reserved.
 * Property of Gavin Abu-Zahra. Do not reproduce or distribute without explicit permission.
 */

import Renderer from "./renderer";
import {EventType, Sprite, SpriteEvent} from "./renderer/Sprite";

export interface TickEvent extends SpriteEvent {
  type: EventType.tick;
  engine: Engine;
}

export default class Engine {
  protected _renderer: Renderer;
  protected keys: Set<string> = new Set<string>();
  get keysDown() {return this.keys}
  /**
   * Ticks per second
   * @protected
   */
  tickSpeed: number = 50;
  sprites: Sprite[] = [];
  cursor = {x: 0, y: 0};
  protected spriteID: number = 0;
  get renderer() {return this._renderer}
  
  getSprite(id: number) {
    return this.sprites.find(e => e.getInfo().id === id);
  }
  
  createSprite(createFunction: (id: number) => Sprite) {
    this.sprites.push(createFunction(this.spriteID));
    this.spriteID++;
    return this.spriteID - 1;
  }
  
  constructor(props: {
    canvas: HTMLCanvasElement
  }) {
    document.addEventListener("keydown", (e) => {
      this.keys.add(e.code)
    })
    document.addEventListener("keyup", (e) => {
      this.keys.delete(e.code)
    })
    document.addEventListener("mousemove", (e) => {
      this.cursor = {x: e.x, y: e.y}
    })
    this._renderer = new Renderer(props.canvas, this);
    this._renderer.start();
  }
}