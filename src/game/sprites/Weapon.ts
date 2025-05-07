/*
 * © 2021-2025 JustWhatever. All rights reserved.
 * Property of Gavin Abu-Zahra. Do not reproduce or distribute without explicit permission.
 */

import Sprite, {RenderEvent, TickEvent} from "../Sprite";
import Player from "./Player";
import Game from "../Game";
import {Bodies, Body, Composite, Query, Vector, World} from "matter-js";
import {config} from "../../config";
import {TexturesType} from "../util/generateTextures";

export enum FireType {
  semiauto,
  fullauto
}

function easeInOut(t: number) {
  if(t <= 0.5) return 2.0 * t * t;
  
  t -= 0.5;
  return 2.0 * t * (1.0 - t) + 0.5;
}

export class Weapon extends Sprite {
  name: string = "None"
  
  body: Body;
  parent: Player;
  
  // rounds per second
  fireRate: number = 9;
  
  rounds: number = 17;
  
  type: FireType = FireType.semiauto;
  // 0-1
  reloadProgress = 1;
  // ms
  reloadTime: number = 1350;
  
  roundsInChamber: number;
  
  
  
  private flipped: boolean = false;
  private lastDown = false;
  private lastFire = 0;
  selected: boolean = true;
  flippedTexture: string = "";
  normalTexture: string = "";
  reloading: boolean = false;
  
  // all of these are to the top left.
  protected relativePoint: Vector;
  protected relativePointFlipped: Vector;
  protected barrelPoint: Vector;
  protected barrelPointFlipped: Vector;
  
  constructor(textures: TexturesType, parent: Player, game: Game, x: number, y: number) {
    super(textures, x, y, game, "", 512);
    this.body.isSensor = true;
    this.parent = parent;
    setTimeout(() => this.roundsInChamber = this.rounds)
    
  }
  
  getFiringPoint(): Vector {
    const angleRadians = this.parent.gunFacing;
    
    const p = Vector.mult(Vector.div(Vector.sub(this.flipped ? this.relativePointFlipped : this.relativePoint, {x: 64, y: 64}), 128), 144);
    const point = this.flipped ? {x: -p.x, y: -p.y} : p
    const origin = Vector.create(0, 0);
    
    const translatedX = point.x - origin.x;
    const translatedY = point.y - origin.y;
    
    return Vector.add(this.parent.innerBody.position, Vector.create(
      translatedX * Math.cos(angleRadians) - translatedY * Math.sin(angleRadians),
      translatedX * Math.sin(angleRadians) + translatedY * Math.cos(angleRadians)
    ))
  }
  
  getBarrelPoint(angleRadians: number): Vector {
    const p = Vector.mult(Vector.div(Vector.sub(this.flipped ? this.barrelPointFlipped : this.barrelPoint, {x: 64, y: 64}), 128), 144);
    const point = this.flipped ? {x: -p.x, y: -p.y} : p
    const origin = Vector.create(0, 0);
    
    const translatedX = point.x - origin.x;
    const translatedY = point.y - origin.y;
    
    return Vector.add(this.parent.innerBody.position, Vector.create(
      translatedX * Math.cos(angleRadians) - translatedY * Math.sin(angleRadians),
      translatedX * Math.sin(angleRadians) + translatedY * Math.cos(angleRadians)
    ))
  }
  
  tick(ev: TickEvent) {
    this.body.render.visible = this.selected
    
    if(config.debug.showBarrelPoint) {
      const p = this.getBarrelPoint(this.parent.gunFacing);
      const dot = Bodies.circle(p.x, p.y, 2, {isSensor: true, render: {
          fillStyle: "red"
        }});
      
      World.add(this.game.engine.world, dot)
      setTimeout(() => World.remove(this.game.engine.world, dot), 250)
    }
    if(config.debug.showFirePoint) {
      const p = this.getFiringPoint();
      const dot = Bodies.circle(p.x, p.y, 2, {isSensor: true, render: {
          fillStyle: "blue"
        }});
      
      World.add(this.game.engine.world, dot)
      setTimeout(() => World.remove(this.game.engine.world, dot), 250)
    }
    
    if(this.selected && (this.parent.isMe || ((!this.game.isSpectating) && this.game.player === this.parent))) {
      
      const playerScreenPos = {
        x: Math.round(ev.renderer.canvas.width / 2),
        y: Math.round(ev.renderer.canvas.height / 2)
      };
      const mouseWorldPos = {
        x: Math.round(this.parent.innerBody.position.x + (this.game.mouse.position.x - playerScreenPos.x)),
        y: Math.round(this.parent.innerBody.position.y + (this.game.mouse.position.y - playerScreenPos.y))
      };
      const barrel = this.getBarrelPoint(Math.atan2(mouseWorldPos.y - playerScreenPos.y, mouseWorldPos.x - playerScreenPos.x));
      
      const angle = Math.atan2(mouseWorldPos.y - barrel.y, mouseWorldPos.x - barrel.x);
      if(Math.hypot(this.game.mouse.position.x - playerScreenPos.x, this.game.mouse.position.y - playerScreenPos.y) > 12 && Math.abs(this.parent.gunFacing - angle) > 0.01) {
        this.game.socket.emit("faceUpdate", angle);
        this.parent.gunFacing = angle;
      }
      
      
      if(this.game.mouseButtons[0] && (this.type === FireType.fullauto || this.lastDown === false) && this.roundsInChamber > 0 && this.lastFire+(1000/this.fireRate) < performance.now()) {
        
        const start = this.getFiringPoint();
        
        const direction = {
          x: Math.cos(this.parent.gunFacing),
          y: Math.sin(this.parent.gunFacing),
        };
        
        const end = {
          x: start.x + (direction.x * 100000),
          y: start.y + (direction.y * 100000),
        }
        
        const rcollisions = Query.ray(Composite.allBodies(ev.engine.world), start, end)
          .filter(e => !(e.bodyA.isSensor || e.bodyB.isSensor))
          .sort((a, b) => {
            const distA = Vector.magnitude(Vector.sub(a.supports[0], start));
            const distB = Vector.magnitude(Vector.sub(b.supports[0], start));
            return distA - distB;
          })
          .filter(e => {
            return !((e.bodyA.id === this.game.player.innerBody.id || e.bodyB.id === this.game.player.innerBody.id) || (this.game.player.weapons.map(e => e.body.id).includes(e.bodyA.id) || this.game.player.weapons.map(e => e.body.id).includes(e.bodyB.id)))
          })
        
        
        const hit = rcollisions[0] ? Vector.add(rcollisions[0].supports[0], rcollisions[0].penetration) : end;
        const angle = Math.atan2(hit.y - start.y, hit.x - start.x);
        
        
        const playerCollisions = rcollisions.filter(e => e.bodyA.label === "Player" || e.bodyB.label === "Player");
        
        if(playerCollisions[0]) {
          const player = this.game.gameObjects.filter(e => e instanceof Player).filter((e: Player) => playerCollisions[0].bodyA.id === e.innerBody.id || playerCollisions[0].bodyB.id === e.innerBody.id)[0];
          if(player && player instanceof Player) {
            // this is horible for if someone tries to download cheats but i will fix it later

            // TODO: fix this so that it alot harder to hack.
            this.game.socket.emit("fire", {
              start,
              end: hit,
              angle,
              weapon: this.name,
              hitPlayer: player.sid
            })
          }
        } else {
          this.game.socket.emit("fire", {
            start,
            end: hit,
            angle,
            weapon: this.name
          })
        }
        
        this.lastFire = performance.now();
        this.roundsInChamber--;
      }
      
      this.lastDown = this.game.mouseButtons[0];
    }
    
    const flipThreshold = Math.PI / 2;
    const flipDeadzone = 0.2;
    
    const shouldFlip = this.parent.gunFacing > flipThreshold + flipDeadzone || this.parent.gunFacing < -flipThreshold - flipDeadzone;
    const shouldUnflip = this.parent.gunFacing < flipThreshold - flipDeadzone && this.parent.gunFacing > -flipThreshold + flipDeadzone;
    
    if (this.flipped) {
      if (shouldUnflip) this.flipped = false;
    } else {
      if (shouldFlip) this.flipped = true;
    }
    
  }
  
  preRender(ev: RenderEvent) {
    super.preRender(ev);
    Body.setPosition(this.body, this.parent.innerBody.position)
    Body.setAngle(this.body, this.parent.innerBody.angle + this.parent.gunFacing + (this.flipped ? Math.PI : 0))
  }
  
  render(ev: RenderEvent) {
    this.body.render.sprite.texture = this.flipped ? this.flippedTexture : this.normalTexture;
  }
  
  reload() {
    this.reloading = true;
    const start = performance.now()
    const interval = setInterval(() => {
      this.reloadProgress = (performance.now() - start) / this.reloadTime;
      if(start + this.reloadTime <= performance.now()) {
        this.reloading = false;
        this.roundsInChamber = this.rounds;
        clearInterval(interval);
      }
    })
  }
}