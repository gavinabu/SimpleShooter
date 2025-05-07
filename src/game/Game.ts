/*
 * © 2021-2025 JustWhatever. All rights reserved.
 * Property of Gavin Abu-Zahra. Do not reproduce or distribute without explicit permission.
 */


import {Bodies, Engine, Events, Mouse, Render, Runner, Vector, World} from "matter-js";
import Sprite from "./Sprite";
import Player, {Skin} from "./sprites/Player";
import GameObject from "./GameObject";
import Crate from "./objects/Crate";
import SplashScreen, {SplashScreenType} from "../SplashScreen";
import Hud from "./ui/hud";
import {config} from "../config";
import {io, Socket} from "socket.io-client";
import GameSave from "./util/gameSave";
import generateTextures from "./util/generateTextures";
import loadMap, {Map as IMap} from "./util/mapLoader";

export type PlayerType = {
  id: string,
  cosmetics?: {
    myWeaponSkins: {
      type: "pistol" | "smg" | "shotgun" | "ar" | "sniper",
      skin: string
    }[],
    mySkin: Skin
  },
  pos: {x: number, y: number},
  facing: number,
  health: number
}


export default class Game {
  gameId: string;
  isLoading: boolean = true;
  
  isSpectating: boolean = false;
  
  engine: Engine;
  renderer: Render;
  player: Player;
  keys: Set<string> = new Set();
  hud: {ele: HTMLDivElement, remove: () => void};
  dt: number = 0;
  private lastNRPS = 0;
  private _nrps: [number, number] = [0, 0]; // in,out
  nrps: [number,number] = [0,0]; // in,out
  gameObjects: GameObject[] = [];
  mouse: Mouse;
  mouseButtons = [false,false,false]
  socket: Socket;
  id: string;
  mainGameSave: GameSave = GameSave.create("main", {
    selectedSkin: "ploom-red",
    service: "default"
  });
  private _level: string;
  private _map: IMap;
  get map() {return this._map;}
  get level(): string {return this._level}
  private eventListeners: [string, (...params: any) => any][] = [];
  private exists: boolean = true;
  
  protected lastTime: number = performance.now();
  private lastCheckin: number = 0
  
  private engineRunner = Runner.create();
  
  private readonly onFinish: () => void;
  constructor(gameId: string, host: string, secure: boolean, onFinish: () => void, port: number = 8227) {
    this.onFinish = onFinish;
    const splash = SplashScreen(SplashScreenType.beta);
    document.body.append(splash);
    this.gameId = gameId;
    if(config.debug.verboseLogs) {
      console.debug(`Game ID: ${gameId}`);
      console.debug(`Game Server: ${host}:${port}`);
      console.debug("game create\nconnectingtoserver");
      performance.mark("AA gamecreate");
    }
    
    
    
    (async () => {
      if(config.debug.verboseLogs) {
        console.debug("get temp token");
        performance.mark("AA gettemptoken");
      }
      
      this.socket = io(`${host}:${port}`, {
        reconnectionAttempts: 3,
        port: port,
        auth: {
          token: await (await fetch(`${config.authServer}/api/getTempToken`, {headers: {Authorization: localStorage.getItem("jwt")}})).text()
        },
        query: {
          gameId: gameId
        }
      });
      
      if(config.debug.verboseLogs) {
        console.debug("connect to sio");
        performance.mark("AA connecttosio");
      }
      
      this.socket.onAny(() => this._nrps[0] += 1);
      this.socket.onAnyOutgoing(() => this._nrps[1] += 1);
      
      this.socket.on("removal", (data) => {
        console.log("Removed from game", data);
        this.exists = false;
        this.eventListeners.filter(e => e[0] === "exit").forEach(e => {
          e[1](data)
        });
      });
      
      this.socket.on("disconnect", () => {
        this.socket.disconnect();
        console.log("Disconnected from game");
        splash.remove();
      });
      
      this.socket.on("deathTo", (from: string) => {
        if(from === "bounds") {
          this.leave();
        } else {
          const deathTo = this.gameObjects.find(e => e instanceof Player &&  e.sid === from);
          if(!deathTo) return this.leave();
          this.isSpectating = true;
          this.player = deathTo as Player;
          this.eventListeners.filter(e => e[0] === "death").forEach(e => {
            e[1](
            
            )
          });
        }
      });
      
      if(!this.exists) return;
      this.id = await new Promise((resolve) => this.socket.on("connect", () => resolve(this.socket.id)));
      this._level = await this.socket.emitWithAck("getLevel");
      
      if(config.debug.verboseLogs) {
        console.debug("map load");
        performance.mark("AA mapload");
      }
      try {
        this._map = loadMap(new Int32Array(await (await fetch(`${secure ? "https://" : "http://"}${host}:${port}/${this.level}`)).arrayBuffer()));
      } catch (e) {
        console.error(`Failed to load map. ${e}`);
        this.leave();
      }
      
      this.socket.emit("cosmetic", {
        mySkin: this.mainGameSave.getItem("selectedSkin"),
        myWeaponSkins: []
      } as {
          myWeaponSkins: {type: "pistol" | "shotgun" | "smg" | "ar" | "sniper", skin: string}[],
          mySkin: Skin
        })
      
      if(!this.exists) {
        splash.remove();
        return;
      }
      
      if(config.debug.verboseLogs) {
        console.debug("game start");
        performance.mark("AA gamestart");
      }
      
      
      
      if(!this.exists) {
        splash.remove();
        return;
      }
      
      if(config.debug.verboseLogs) {
        console.debug("game done assets");
        performance.mark("AA gameassetdone");
      }
      
      function ultraFlatten(obj: Record<string, any>) {
        let values: any[] = [];
        for (const key in obj) {
          const val = obj[key];
          if (typeof val === 'string') {
            values.push(val);
          } else if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
            values = values.concat(ultraFlatten(val));
          }
        }
        return values;
      }
      if(!this.exists) {
        splash.remove();
        return;
      }
      this.isLoading = false;
      this.engine = Engine.create({
        gravity: {
          y: 0
        },
      });
      
      const textures = await generateTextures();
      
      const texts = ultraFlatten(textures);
      
      if(!this.exists) {
        splash.remove();
        return;
      }
      this.renderer = Render.create({
        element: document.body,
        engine: this.engine,
        options: {
          width: window.innerWidth*2,
          height: window.innerHeight*2,
          wireframes: config.debug.wireframes,
          showDebug: config.debug.engineStats,
          showBounds: config.debug.showBounds,
          showAxes: config.debug.showAxes,
          showIds: config.debug.showIDs,
          showVelocity: config.debug.showVelocity,
          showAngleIndicator: config.debug.showAngles,
          showConvexHulls: config.debug.showConvexHull,
          showInternalEdges: config.debug.showInternalEdges,
          showVertexNumbers: config.debug.showVertexIDs,
          showSeparations: config.debug.showSeparations,
          background: "#ffffff",
        },
        textures: texts,
      });
      this.socket.on("disconnect", () => {
        this.leave();
      });
      this.mouse = Mouse.create(this.renderer.canvas);
      
      Render.run(this.renderer);
      Runner.run(this.engineRunner, this.engine);
      
      if(config.debug.exposeSaves) {
        (window as any).gs = {
          main: this.mainGameSave
        }
      }
      document.addEventListener('keydown', e => this.keys.add(e.code));
      document.addEventListener('keyup', e => this.keys.delete(e.code));
      document.addEventListener('mousedown', e => {
        this.mouseButtons[e.which-1] = true
      });
      document.addEventListener('mouseup', e => {
        this.mouseButtons[e.which-1] = false
      });
      
      for (let x = 0; x < 24; x++) {
        for (let y = 0; y < 24; y++) {
          const c = new Crate(textures, x * 72 + 128, y * 72 + 128, this);
          this.gameObjects.push(c)
          World.add(this.engine.world, c.body);
        }
      }
      
      const p = new Player(textures, this, this.mainGameSave.getItem("selectedSkin"), this.socket.id, true);
      this.player = p
      World.add(this.engine.world, p.body);
      this.gameObjects.push(p);
      
      const players: PlayerType[] = await this.socket.emitWithAck("getPlayers")
      players.filter(e => e.id !== this.socket.id).forEach(player => {
        const p = new Player(textures, this, player.cosmetics.mySkin, player.id);
        World.add(this.engine.world, p.body);
        this.gameObjects.push(p);
      })
      
      
      this.socket.on("newPlayer", (id) => {
        const p = new Player(textures, this, "none", id);
        World.add(this.engine.world, p.body);
        this.gameObjects.push(p);
      })
      
      this.socket.on("playerDisconnect", (id) => {
        this.removePlayer(id);
      })
      
      this.socket.on("playerCosmeticsUpdate", (id, data) => {
        const p = this.gameObjects.find(e => e instanceof Player && e.sid === id) as Player;
        if(!p) this.removePlayer(id);
        p.updateSkin(data.mySkin);
      })
      
      this.socket.on("playerUpdatePOS", (id: string, pos: Vector) => {
        const p = this.gameObjects.find(e => e instanceof Player && e.sid === id) as Player;
        p.targetPos = pos;
      });
      
      this.socket.on("playerUpdateFACE", (id: string, angle: number) => {
        const p = this.gameObjects.find(e => e instanceof Player && e.sid === id) as Player;
        p.gunFacing = angle;
      })
      
      this.socket.on("weaponFired", (sid: string, data: {
        start: {x: number, y: number},
        end: {x: number, y: number},
        angle: number,
        trail: boolean,
        trailDuration: number,
      }) => {
        if(data.trail) {
          const length = Math.hypot(data.end.x - data.start.x, data.end.y - data.start.y);
          const line = Bodies.rectangle(
            (data.start.x + data.end.x) / 2,
            (data.start.y + data.end.y) / 2,
            length,
            2,
            {
              isStatic: true,
              angle: data.angle,
              render: {
                fillStyle: 'yellow',
                strokeStyle: 'yellow',
                lineWidth: 2
              },
              isSensor: true
            }
          );
          
          World.add(this.engine.world, line);
          const str = performance.now();
          const ival = setInterval(() => {
            line.render.opacity = Math.max(0, 0-((performance.now() - str) / data.trailDuration - 1)**3);
          })
          setTimeout(() => {
            clearInterval(ival);
            World.remove(this.engine.world, line);
          },data.trailDuration)
        }
      })
      
      Events.on(this.engine, 'collisionActive', (event) => {
        for (const pair of event.pairs) {
          const { bodyA, bodyB } = pair;
          const a = this.gameObjects.filter(e => e instanceof Player).filter((e: Player) => e.innerBody.id === bodyA.id)[0];
          const b = this.gameObjects.filter(e => e instanceof Player).filter((e: Player) => e.innerBody.id === bodyB.id)[0];
          if (a instanceof Player && b instanceof Player) {
            this.socket.emit("playerPush", {
              aID: a.sid,
              bID: b.sid,
              a: a.innerBody.position,
              b: b.innerBody.position,
            })
          }
        }
      });
      
      Events.on(this.renderer, 'afterUpdate', () => {
        this.gameObjects.forEach((gameObject) => {
          if(gameObject instanceof Sprite) {
            gameObject.postRender({
              engine: this.engine,
              renderer: this.renderer,
              game: this
            })
          }
          
        })
      });
      
      Events.on(this.renderer, 'beforeRender', () => {
        const currentTime = performance.now();
        const delta = currentTime - this.lastTime;
        this.lastTime = currentTime;
        this.dt = delta;
        
        this.gameObjects.forEach((gameObject) => {
          if(gameObject instanceof Sprite) {
            gameObject.preRender({
              engine: this.engine,
              renderer: this.renderer,
              game: this
            })
            gameObject.render({
              engine: this.engine,
              renderer: this.renderer,
              game: this
            })
          }
          
        })
      });
      
      
      Events.on(this.engine, 'afterUpdate', () => {
        if(this.lastCheckin + 250 < performance.now()) {
          this.lastCheckin = performance.now();
          
          this.socket.emit("checkin", this.gameObjects.filter(e => e instanceof Player).filter((e: Player) => e.sid !== this.player.sid).map((e: Player) => {return {id: e.sid, x: e.innerBody.position.x, y: e.innerBody.position.y, gunFacing: e.gunFacing}}));
        }
        
        this.gameObjects.forEach((gameObject) => {
          if(gameObject instanceof Sprite) {
            gameObject.postTick({
              engine: this.engine,
              renderer: this.renderer,
              game: this
            })
          }
        })
      });
      
      Events.on(this.engine, 'beforeUpdate', () => {
        if(performance.now() > this.lastNRPS + 1000) {
          this.lastNRPS = performance.now();
          this.nrps = this._nrps;
          this._nrps = [0,0];
        }
        
        this.gameObjects.forEach((gameObject) => {
          if(gameObject instanceof Sprite) {
            gameObject.preTick({
              engine: this.engine,
              renderer: this.renderer,
              game: this
            })
            gameObject.tick({
              engine: this.engine,
              renderer: this.renderer,
              game: this
            })
          }
        })
      });
      splash.remove();
      this.hud = Hud(this);
      document.body.append(this.hud.ele);
      if(config.debug.verboseLogs) {
        console.log("game loaded");
        performance.mark("AA gameload");
      }
    })();
  }
  
  addEventListener(type: "close", listener: (...args: any) => void) {
    this.eventListeners.push([type, listener]);
  }
  
  private removePlayer(id: string) {
    const p = this.gameObjects.find(e => e instanceof Player && e.sid === id) as Player;
    if(!p) {
      console.warn("Unknown player disconnected");
      return
    }
    this.gameObjects.slice(this.gameObjects.indexOf(p), 1);
    p.weapons.forEach(w => {
      World.remove(this.engine.world, w.body);
    })
    World.remove(this.engine.world, p.innerBody);
    World.remove(this.engine.world, p.body);
  }
  
  leave() {
    if(this.renderer) this.renderer.element.remove();
    Runner.stop(this.engineRunner);
    this.gameObjects = [];
    this.exists = false;
    this.onFinish();
  }
}