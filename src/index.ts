/*
 * © 2021-2025 JustWhatever. All rights reserved.
 * Property of Gavin Abu-Zahra. Do not reproduce or distribute without explicit permission.
 */

import {config} from "./config";

console.log(`%cSimple Shooter%c\n%c${config.version.type} v${config.version.major}.${config.version.minor}`, "color: #ffffff; font-family: sans-serif; font-size: 14px; background: #FF5D5D; border: 4px solid #993838; border-radius: 12px; padding: 12px; margin-top: 8px; border-bottom-left-radius: 0;", "", "font-size: 8px; color: #ffffff; background: #FF5D5D; border: 4px solid #993838; border-radius: 8px; padding: 6px; margin-top: -2px; border-top-left-radius: 0; border-top-right-radius: 0; margin-bottom: 8px;")


if(config.debug.verboseLogs) {
  console.debug("start");
  performance.mark("AA start");
}


import Game from "./game/Game";
import './index.css'
import {measureMemory} from "node:vm";

const game = new Game("D8EA69AD38321AD20A1FD296CC2258D7", "localhost", false, () => {
  console.log("Game Finished")
})