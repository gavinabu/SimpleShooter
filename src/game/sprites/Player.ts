/*
 * © 2021-2025 JustWhatever. All rights reserved.
 * Property of Gavin Abu-Zahra. Do not reproduce or distribute without explicit permission.
 */

import Sprite, {RenderEvent, TickEvent} from "../Sprite";
import {Bodies, Body, Composite, Engine, Vector, World} from "matter-js";
import Game from "../Game";
import {Weapon} from "./Weapon";
import Pistol from "./weapons/Pistol";
import {TexturesType, textureToSpriteTexture} from "../util/generateTextures";

export type Skin =
  "ploom-red" | //
  "ploom-blue" | //
  "ploom-green" | //
  "ploom-pink" | //
  "ploom-white" | //
  "ploom-gray" | //
  "ploom-black" | //
  "ploom-orange" | //
  "ploom-yellow" | //
  "ploom-purple" | //
  "ploom-lightblue" | //
  "robot" |
  "none"

export function getPlayerSkin(skin: Skin, textures: TexturesType): {north: string, south: string, east: string, west: string, neutral: string} {
  switch (skin) {
    case "ploom-red": return textures.ploom.red;
    case "ploom-blue": return textures.ploom.blue;
    case "ploom-green": return textures.ploom.green;
    case "ploom-pink": return textures.ploom.pink;
    case "ploom-white": return textures.ploom.white;
    case "ploom-gray": return textures.ploom.gray;
    case "ploom-black": return textures.ploom.black;
    case "ploom-orange": return textures.ploom.orange;
    case "ploom-yellow": return textures.ploom.yellow;
    case "ploom-purple": return textures.ploom.purple;
    case "ploom-lightblue": return textures.ploom.lightblue;
    default: return textureToSpriteTexture(new Array(5).fill(""));
  }
}

export default class Player extends Sprite {
  sid: string;
  body = Composite.create();
  innerBody: Body;
  isMe: boolean = false;
  targetPos: Vector = Vector.create(0,0);
  
  get speed() {return Math.max(0.1, Math.min(0.25, 0.25 * this.stamina))};
  
  weapons: Weapon[] = [];
  // index in Player.weapons
  private _selected: number = 0;
  // 0-1
  private _health: number = 1;
  
  private lastMovementUpdate: Vector;
  
  get health(): number {return this._health;}
  set health(value: number) {
    this._health = Math.max(0,Math.min(1,value));
    this.game.socket.emit("dmgUpdate", value);
  }
  // 0-1
  stamina: number = 1;
  // radians
  gunFacing: number = 0;

  get isDead() {return this.health < 0.001}
  get isAlive() {return this.health >= 0.001}
  
  protected tex;
  
  
  updateSkin(skin: Skin) {
    this.tex = getPlayerSkin(skin, this.textures);
    this.innerBody.render.sprite.texture = this.tex.neutral;
  }
  
  constructor(textures: TexturesType, game: Game, skin: Skin, sid: string, isMe: boolean = false) {
    super(textures, 0, 0, game, getPlayerSkin(skin, textures).neutral);
    this.tex = getPlayerSkin(skin, textures);
    this.innerBody = Bodies.rectangle(0,0,72,72, {render: {sprite: {texture: this.tex.neutral, xScale: 72/128, yScale: 72/128}}, frictionAir: 0.75})
    this.innerBody.label = `Player`
    this.isMe = isMe;
    Body.setInertia(this.innerBody, Infinity);
    World.add(this.game.engine.world, this.innerBody)
    this.sid = sid;
    
    this.giveWeapon(new Pistol(textures, this, game, 0, 0))
    
    this.game.socket.on("playerStaminaUpdate", (id: string, stamina: number) => {
      if(id === sid) this.stamina = stamina;
    })
    this.game.socket.on("playerHealthUpdate", (id: string, health: number) => {
      if(id === sid) this.health = health;
    })
    
    if(isMe) {
      this.game.socket.on("healthUpdate", (health: number) => this.health = health);
      this.game.socket.on("posUpdate", (newPos: Vector) => this.targetPos = newPos)
      this.game.socket.on("faceUpdate", (facing: number) => this.gunFacing = facing)
    }
    
  }
  
  get selected(): number {return this._selected};
  
  set selected(selected: number) {this.weapons[this._selected].selected = false; this._selected = selected; this.weapons[selected].selected = true}
  
  giveWeapon(weapon: Weapon) {
    this.weapons.push(weapon);
    this.game.gameObjects.push(weapon);
    Composite.add(this.body, [weapon.body]);
  }
  
  preRender(ev: RenderEvent) {
    if(this.isMe || (this.game.isSpectating && this.game.player === this)) {
      ev.renderer.bounds.min.x = this.innerBody.position.x - ev.renderer.canvas.width / 2;
      ev.renderer.bounds.min.y = this.innerBody.position.y - ev.renderer.canvas.height / 2;
      ev.renderer.bounds.max.x = this.innerBody.position.x + ev.renderer.canvas.width / 2;
      ev.renderer.bounds.max.y = this.innerBody.position.y + ev.renderer.canvas.height / 2;
      
      ev.renderer.options.hasBounds = true;
    }
  }
  
  preTick(ev: TickEvent) {
    if(this.isMe) {
      
      let force = { x: 0, y: 0 };
      if (ev.game.keys.has('KeyW')) force.y -= 1;
      if (ev.game.keys.has('KeyS')) force.y += 1;
      if (ev.game.keys.has('KeyA')) force.x -= 1;
      if (ev.game.keys.has('KeyD')) force.x += 1;
      let tex = this.tex.neutral;
      if(force.y === 1) tex = this.tex.south;
      if(force.y === -1) tex = this.tex.north;
      if(force.x === 1) tex = this.tex.east;
      if(force.x === -1) tex = this.tex.west;
      this.innerBody.render.sprite.texture = tex;
      let newSamina = this.stamina;
      if(force.x !== 0 || force.y !== 0)
        newSamina = Math.max(0, this.stamina - 0.0005);
      else
        newSamina = Math.min(1, this.stamina + 0.001);
      if(this.stamina !== newSamina) {
        this.stamina = newSamina;
        this.game.socket.emit("staminaUpdate", this.stamina);
      }
      
      const mag = Math.hypot(force.x, force.y);
      if (mag > 0) {
        force.x /= mag;
        force.y /= mag;
        Body.applyForce(this.innerBody, this.innerBody.position, {
          x: force.x * this.speed,
          y: force.y * this.speed
        });
      }
      
      if (!this.lastMovementUpdate || Math.abs(this.innerBody.position.x - this.lastMovementUpdate.x) > 0.05 || Math.abs(this.innerBody.position.y - this.lastMovementUpdate.y) > 0.05) {
        this.lastMovementUpdate = Vector.clone(this.innerBody.position);
        this.game.socket.emit("movementUpdate", this.innerBody.position);
      }
    }
  }
  
  tick(ev: TickEvent) {
    const selected = this.weapons[this._selected];
    if(ev.game.keys.has("KeyR") && !selected.reloading && this.isMe) {
      selected.reload();
    }
  }
  
  render(ev: RenderEvent) {
    if(!this.isMe) Body.setPosition(this.innerBody, this.targetPos);
  }
  
};