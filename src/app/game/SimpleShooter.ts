/*
 * © 2021-2025 JustWhatever. All rights reserved.
 * Property of Gavin Abu-Zahra. Do not reproduce or distribute without explicit permission.
 */

import Engine from "../engine";
import {Player} from "./sprites/Player";
import Crate from "./objects/Crate";
import Pistol from "./weapons/Pistol";

export enum Scene {
  "main menu",
  "ingame-multiplayer",
  "ingame-singleplayer",
  "ingame-options",
  "ingame-settings-main",
  "ingame-settings-display",
  "ingame-settings-account",
}

export class SimpleShooter {
  private static _instance: SimpleShooter;
  public static get instance() {return this._instance};
  protected canvas: HTMLCanvasElement;
  protected engine: Engine;
  playerId: number;
  
  get player(): Player {return this.engine.getSprite(this.playerId) as Player}
  
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.engine = new Engine({canvas: this.canvas});
    this.playerId = this.engine.createSprite(Player.create({username: "Dev"}));
    this.engine.createSprite(Pistol.create({parent: this.engine.getSprite(this.playerId)}));
    this.engine.createSprite(Crate.create({}));
    SimpleShooter._instance = this;
  }
  
}