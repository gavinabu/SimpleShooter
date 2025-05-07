/*
 * © 2021-2025 JustWhatever. All rights reserved.
 * Property of Gavin Abu-Zahra. Do not reproduce or distribute without explicit permission.
 */

// WEAPONS
import PistolTex from '../../assets/game/textures/weapons/pistol.svg'

// SPRITES
import RedPloom from '../../assets/game/textures/sprites/ploom/Red.svg'
import GrayPloom from '../../assets/game/textures/sprites/ploom/Gray.svg'
import BluePloom from '../../assets/game/textures/sprites/ploom/Blue.svg'
import GreenPloom from '../../assets/game/textures/sprites/ploom/Green.svg'
import BlackPloom from '../../assets/game/textures/sprites/ploom/Black.svg'
import PinkPloom from '../../assets/game/textures/sprites/ploom/Pink.svg'
import OrangePloom from '../../assets/game/textures/sprites/ploom/Orange.svg'
import PurplePloom from '../../assets/game/textures/sprites/ploom/Purple.svg'
import WhitePloom from '../../assets/game/textures/sprites/ploom/White.svg'
import YellowPloom from '../../assets/game/textures/sprites/ploom/Yellow.svg'
import LightBluePloom from '../../assets/game/textures/sprites/ploom/Light Blue.svg'

// OBJECTS
import CrateTex from '../../assets/game/textures/objects/crate.svg'
import getTextures from "./getTextures";


export type SpriteTexture = {
  neutral: string,
  north: string,
  south: string,
  east: string,
  west: string,
}

export function textureToSpriteTexture(texture: string[]): SpriteTexture {
  return {
    neutral: texture[0],
    north: texture[1],
    south: texture[2],
    west: texture[3],
    east: texture[4],
  }
}

export type WeaponTexture = {
  left: string,
  right: string,
  icon: string
}

export function textureToWeaponTexture(texture: string[]): WeaponTexture {
  return {
    left: texture[0],
    right: texture[1],
    icon: texture[2],
  }
}

export type TexturesType = {
  ploom: {
    red: SpriteTexture,
    blue: SpriteTexture,
    green: SpriteTexture,
    orange: SpriteTexture,
    pink: SpriteTexture,
    yellow: SpriteTexture,
    purple: SpriteTexture,
    white: SpriteTexture,
    gray: SpriteTexture,
    black: SpriteTexture,
    lightblue: SpriteTexture,
  },
  crate: string,
  weapons: {
    pistol: WeaponTexture
  }
}

export default async function generateTextures(): Promise<TexturesType> {
  const redploom = await getTextures(RedPloom, {label: "Red Ploom"});
  const grayploom = await getTextures(GrayPloom, {label: "Gray Ploom"});
  const blueploom = await getTextures(BluePloom, {label: "Blue Ploom"});
  const greenploom = await getTextures(GreenPloom, {label: "Green Ploom"});
  const blackploom = await getTextures(BlackPloom, {label: "Black Ploom"});
  const pinkploom = await getTextures(PinkPloom, {label: "Pink Ploom"});
  const orangeploom = await getTextures(OrangePloom, {label: "Orange Ploom"});
  const purpleploom = await getTextures(PurplePloom, {label: "Purple Ploom"});
  const whiteploom = await getTextures(WhitePloom, {label: "White Ploom"});
  const yellowploom = await getTextures(YellowPloom, {label: "Yellow Ploom"});
  const lightblueploom = await getTextures(LightBluePloom, {label: "Light Blue Ploom"});
  
  const pistol = await getTextures(PistolTex, {
    sf: 8,
    label: "Pistol"
  });
  return {
    ploom: {
      red: textureToSpriteTexture(redploom),
      blue: textureToSpriteTexture(blueploom),
      green: textureToSpriteTexture(greenploom),
      pink: textureToSpriteTexture(pinkploom),
      orange: textureToSpriteTexture(orangeploom),
      yellow: textureToSpriteTexture(yellowploom),
      purple: textureToSpriteTexture(purpleploom),
      white: textureToSpriteTexture(whiteploom),
      gray: textureToSpriteTexture(grayploom),
      black: textureToSpriteTexture(blackploom),
      lightblue: textureToSpriteTexture(lightblueploom)
    },
    crate: (await getTextures(CrateTex, {label: "Crate"}))[0],
    weapons: {
      pistol: textureToWeaponTexture(pistol)
    }
  }
}