/*
 * © 2021-2025 JustWhatever. All rights reserved.
 * Property of Gavin Abu-Zahra. Do not reproduce or distribute without explicit permission.
 */

import {Sprite} from "./Sprite";
import Physics from "../util/Physics";

export class MoveableSprite extends Sprite {
  protected _pys = new Physics(0,0,[],0);
  get pys() {return this._pys}
}