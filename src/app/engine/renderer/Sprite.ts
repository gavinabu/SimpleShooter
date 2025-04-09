/*
 * © 2021-2025 JustWhatever. All rights reserved.
 * Property of Gavin Abu-Zahra. Do not reproduce or distribute without explicit permission.
 */

import {DisplayProps} from "./index";
import {TickEvent} from "../index";

export interface SpriteInfo {
  name: string;
}

export enum EventType {
  "render"
}

export interface SpriteEvent {
  type: EventType;
  
}

export interface RenderEvent extends SpriteEvent {
  type: EventType.render;
  display: DisplayProps;
  
}

export class Sprite {
  protected name: string = "Unknown Sprite";
  protected id: number;
  protected props: any;
  
  constructor(props: any, id: number) {
    this.id = id;
    this.props = props;
  }
  
  static create(props: any) {
    return (id: number) => {
      return new this(props, id);
    }
  }
  
  /**
   * DO NOT OVERRIDE.
   */
  getInfo(): SpriteInfo {
    return {
      name: this.name
    }
  }
  
  /**
   * Ran every render. Do not put movement or anything else. just render to the display.
   * @param ev
   */
  async render(ev: RenderEvent): Promise<void> {}
  
  /**
   * Ran every tick. This is where movement should be. Default tick speed is 50tick/second. This can be changed by servers.
   * @param ev
   */
  async tick(ev: TickEvent): Promise<void> {}
  
  
}