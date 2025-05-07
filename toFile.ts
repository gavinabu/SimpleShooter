/*
 * © 2021-2025 JustWhatever. All rights reserved.
 * Property of Gavin Abu-Zahra. Do not reproduce or distribute without explicit permission.
 */

import loadMap from "./src/game/util/mapLoader";
import * as fs from "node:fs";
import {textToInt32Array} from "./src/game/util/mapLoader/textEncoder";

fs.writeFileSync("testing.simplemap", Buffer.from(new Int32Array([
  ...textToInt32Array("Testing Map"),
  50331648,
  0,
  0,
  0,
  5,
  5,
  1,
  0,
  0,
  0,
  0,
  0
]).buffer), {encoding: "binary"})