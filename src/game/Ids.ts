/*
 * © 2020-2025 JustWhatever. All rights reserved.
 * Property of Gavin Abu-Zahra. Do not reproduce or distribute without explicit permission.
 */

import Game from "./Game";

export class GameID {
  readonly id: number;
  private readonly callback: (...args: any[]) => Promise<any>;
  constructor(id: number, cb: (...args: any[]) => Promise<any>) {
    this.id = id;
    this.callback = cb;
  }
  
  async build(...args: any[]) {
    return await this.callback(...args);
  }
}

export const GameIDs: GameID[] = [

]