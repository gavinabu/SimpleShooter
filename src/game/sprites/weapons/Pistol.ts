/*
 * © 2021-2025 JustWhatever. All rights reserved.
 * Property of Gavin Abu-Zahra. Do not reproduce or distribute without explicit permission.
 */

import {Weapon} from "../Weapon";
import {Vector} from "matter-js";

export default class Pistol extends Weapon {
  name = "Pistol"
  
  normalTexture = this.textures.weapons.pistol.left;
  flippedTexture = this.textures.weapons.pistol.right;
  
  rounds: number = 17;
  
  relativePoint = Vector.create(118, 58);
  barrelPoint = Vector.create(94, 58);
  
  relativePointFlipped = Vector.create(9, 58);
  barrelPointFlipped = Vector.create(32, 58);
}
