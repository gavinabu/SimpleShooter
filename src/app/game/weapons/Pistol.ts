/*
 * © 2021-2025 JustWhatever. All rights reserved.
 * Property of Gavin Abu-Zahra. Do not reproduce or distribute without explicit permission.
 */

import {Weapon} from "../Weapon";
import PistolTex from '../../assets/sprites/weapon/pistol.png'

export default class Pistol extends Weapon {
  constructor(props: any, id: number) {
    super(props, id);
    this.texture = PistolTex
  }
}