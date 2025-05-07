/*
 * © 2021-2025 JustWhatever. All rights reserved.
 * Property of Gavin Abu-Zahra. Do not reproduce or distribute without explicit permission.
 */

import GameObject from "../GameObject";
import Game from "../Game";
import {TexturesType} from "../util/generateTextures";

export default class Crate extends GameObject {
  constructor(textures: TexturesType, x: number, y: number, game: Game) {
    super(textures, x, y, game, textures.crate);
  }
}