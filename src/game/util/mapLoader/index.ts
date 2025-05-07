/*
 * © 2021-2025 JustWhatever. All rights reserved.
 * Property of Gavin Abu-Zahra. Do not reproduce or distribute without explicit permission.
 */

import {int32ArrayToText} from "./textEncoder";
import {toInt8} from "./intarrayHandler";
import {int32ToUint32} from "./numberHandler";

export interface Block {
  x: number,
  y: number,
  blockId: number,
  data: Int32Array,
}

export interface Map {
  name: string,
  authorId: number,
  options: {
    resolution: number,
    unused0: number,
    unused1: number,
    unused2: number,
  },
  origin: {x: number, y: number},
  blocks: Block[],
}

const resolutions = [
  72,
  36,
  18,
  9,
  4.5,
  2.25,
  1,
  0.5
]

export default function loadMap(map: Int32Array): Map {
  const [resolution,unused0,unused1,unused2] = toInt8(map.slice(64,65));
  const blocks: Block[] = [];
  for (let i = 0; i < Math.floor((map.length - 68) / 8); i++) {
    blocks.push({
      x: map[i + 68] * resolutions[resolution],
      y: map[i + 68 + 1] * resolutions[resolution],
      blockId: int32ToUint32(map[i + 68 + 2]),
      data: map.slice(i + 68 + 3, i + 68 + 3 + 5)
    });
  }
  return {
    name: int32ArrayToText(map.slice(0,64)),
    authorId: map[65],
    options: {
      resolution,
      unused0,
      unused1,
      unused2
    },
    origin: {x: map[66], y: map[67]},
    blocks
  }
}