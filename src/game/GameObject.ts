/*
 * © 2021-2025 JustWhatever. All rights reserved.
 * Property of Gavin Abu-Zahra. Do not reproduce or distribute without explicit permission.
 */

import {Bodies, Body, Composite, Engine, Render, World} from "matter-js";
import Game from "./Game";
import Sprite from "./Sprite";
import {TexturesType} from "./util/generateTextures";

export default class GameObject {
  body: Body | Composite;
  protected game: Game;
  protected textures: TexturesType;
  constructor(textures: TexturesType, x: number, y: number, game: Game, texture: string, textureSize: number = 128, isStatic: boolean = true) {
    this.body = Bodies.rectangle(x,y,72,72, {isStatic, render: {sprite: {texture, xScale: 72/textureSize, yScale: 72/textureSize}}});
    this.game = game
    this.textures = textures
  }
}