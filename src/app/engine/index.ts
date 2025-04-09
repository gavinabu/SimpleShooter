/*
 * © 2021-2025 JustWhatever. All rights reserved.
 * Property of Gavin Abu-Zahra. Do not reproduce or distribute without explicit permission.
 */

import Renderer from "./renderer";

export interface TickEvent {

}

export default class Engine {
  protected _renderer: Renderer;
  tickSpeed: number = 20;
  get renderer() {return this._renderer}
  
  constructor(props: {
    canvas: HTMLCanvasElement
  }) {
    this._renderer = new Renderer(props.canvas);
  }
}