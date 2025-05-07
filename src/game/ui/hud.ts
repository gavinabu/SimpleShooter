/*
 * © 2021-2025 JustWhatever. All rights reserved.
 * Property of Gavin Abu-Zahra. Do not reproduce or distribute without explicit permission.
 */

import Game from "../Game";
import StatusBar from "./statusBar";
import Matter, {Runner} from "matter-js";
import Sprite from "../Sprite";
import {config} from "../../config";
import getHUDColor from "./getHUDColor";

export default function Hud(game: Game) {
  function makeStats() {
    const ele = document.createElement("div");
    ele.className = "hud";
    const health = StatusBar("Health", "#FF4D4D", game)
    const stamina = StatusBar("Stamina", "#4D8EFF", game)
    const debug = document.createElement("div");
    let debuginterval: NodeJS.Timeout;
    let debuginterval2: NodeJS.Timeout;
    if(config.debug.stats) {
      debug.className = "debug";
      function createDebugEle(label: string) {
        const debugele = document.createElement("div");
        const labelele = document.createElement("span");
        labelele.className = "label";
        labelele.innerText = label;
        const valueele = document.createElement("span");
        valueele.innerText = "";
        valueele.className = "value";
        debugele.append(labelele,valueele);
        return {
          ele: debugele,
          setValue: (value: string) => {
            valueele.innerText = value;
          },
          updateColor: () => {
            labelele.style.color = getHUDColor(labelele.getBoundingClientRect(), game);
            valueele.style.color = getHUDColor(valueele.getBoundingClientRect(), game);
          }
        }
      }
      
      const fps = createDebugEle("FPS");
      const bodies = createDebugEle("BODIES");
      const constraints = createDebugEle("CONSTRAINTS");
      const sprites = createDebugEle("SPRITES");
      const gameobjects = createDebugEle("GAME OBJECTS");
      const pos = createDebugEle("POS");
      const ping = createDebugEle("PING");
      const nrpso = createDebugEle("NRps OUT");
      const nrpsi = createDebugEle("NRps IN");
      const nrps = createDebugEle("NRps");
      
      debug.append(fps.ele, bodies.ele, constraints.ele, sprites.ele, gameobjects.ele, pos.ele, ping.ele, nrpso.ele, nrpsi.ele, nrps.ele);
      
      let lastPing = 0;
      debuginterval = setInterval(() => {
        if(lastPing + 250 < performance.now()) {
          lastPing = performance.now();
          const send = Date.now()
          game.socket.emitWithAck("getTime").then((response: number) => {
            ping.setValue((response-send).toFixed(0));
          })
        }
        fps.setValue((1000/game.dt).toFixed(0));
        gameobjects.setValue((game.gameObjects.length).toFixed(0));
        sprites.setValue((game.gameObjects.filter(e=> e instanceof Sprite).length).toFixed(0));
        bodies.setValue(Matter.Composite.allBodies(game.engine.world).length.toFixed(0));
        constraints.setValue(Matter.Composite.allConstraints(game.engine.world).length.toFixed(0));
        pos.setValue(`${game.player.innerBody.position.x.toFixed(0)},${game.player.innerBody.position.y.toFixed(0)}`);
        nrpso.setValue(`${game.nrps[1].toFixed(0)}`)
        nrpsi.setValue(`${game.nrps[0].toFixed(0)}`)
        nrps.setValue(`${(game.nrps[0] + game.nrps[1]).toFixed(0)}`)
      },100)
      
      debuginterval2 = setInterval(() => {
        fps.updateColor();
        gameobjects.updateColor();
        sprites.updateColor();
        bodies.updateColor();
        constraints.updateColor();
        pos.updateColor();
        ping.updateColor();
        nrpso.updateColor();
        nrpsi.updateColor();
        nrps.updateColor();
      })
    }
    
    
    ele.append(health.ele, stamina.ele, config.debug.stats ? debug : "");
    const interval = setInterval(() => {
      health.setBar(game.player.health);
      stamina.setBar(game.player.stamina);
      health.updateColor();
      stamina.updateColor();
    })
    
    return {ele, remove: () => {
      ele.remove();
      clearInterval(interval);
      if(debuginterval) clearInterval(debuginterval);
      if(debuginterval2) clearInterval(debuginterval2);
    }};
  }
  
  function makeHotbar() {
    const ele = document.createElement("div");
    ele.className = "hotbar";
    const weaponInfo = document.createElement("div");
    weaponInfo.className = "weaponinfo";
    
    const weaponAmmo = document.createElement("span");
    
    const reloadBar = StatusBar("", "#ffffff", game, 12);
    
    weaponInfo.append(weaponAmmo, reloadBar.ele);
    
    ele.append(weaponInfo);
    
    const updateInterval = setInterval(() => {
      const weapon = game.player.weapons[game.player.selected]
      weaponAmmo.innerHTML = `${weapon.roundsInChamber}/${weapon.rounds}`;
      weaponAmmo.style.color = getHUDColor(weaponAmmo.getBoundingClientRect(), game);
      reloadBar.setBar(weapon.reloading ?
        (weapon.reloadProgress + (weapon.roundsInChamber/weapon.rounds * (1-weapon.reloadProgress))) :
        weapon.roundsInChamber/weapon.rounds);
    })
    
    return {
      ele,
      remove: () => {
        clearInterval(updateInterval);
      }
    }
  }
  
  const ele = document.createElement("div");
  
  const stats = makeStats();
  
  const hotbar = makeHotbar();
  
  ele.append(stats.ele, hotbar.ele);
  
  return {
    ele,
    remove: () => {
      stats.remove();
      hotbar.remove();
    }
  }
}