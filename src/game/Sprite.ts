/*
 * © 2020-2025 JustWhatever. All rights reserved.
 * Property of Gavin Abu-Zahra. Do not reproduce or distribute without explicit permission.
 */

import {Engine, Render} from "matter-js";
import Game from "./Game";
import GameObject from "./GameObject";
import {TexturesType} from "./util/generateTextures";

export interface RenderEvent {
  engine: Engine;
  renderer: Render;
  game: Game
}

export interface TickEvent {
  engine: Engine;
  renderer: Render;
  game: Game
}

export default class Sprite extends GameObject {
  constructor(textures: TexturesType, x: number, y: number, game: Game, texture: string, textureSize: number = 128) {
    super(textures, x, y, game, texture, textureSize, false);
  }
  
  preRender(ev: RenderEvent) {}
  render(ev: RenderEvent) {}
  postRender(ev: RenderEvent) {}
  
  preTick(ev: TickEvent) {}
  tick(ev: TickEvent) {}
  postTick(ev: TickEvent) {}
}