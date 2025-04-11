/*
 * © 2021-2025 JustWhatever. All rights reserved.
 * Property of Gavin Abu-Zahra. Do not reproduce or distribute without explicit permission.
 */

import {MapObject} from "../MapObject";
import CrateImg from '../../assets/objects/crate.png'

export default class Crate extends MapObject {
  constructor(props: any, id: number) {
    super(props,id);
    this.texture = CrateImg
  }
}