/*
 * © 2021-2025 JustWhatever. All rights reserved.
 * Property of Gavin Abu-Zahra. Do not reproduce or distribute without explicit permission.
 */

export default class GameSave {
  private save: {[key: string]: any} = {};
  private id: string;
  
  private constructor(data: {[key: string]: any}, id: string) {
    this.id = id;
    this.save = data;
  }
  
  static create(id: string, defaultValue: {[key: string]: any}): GameSave {
    const d = localStorage.getItem(id);
    console.log(d)
    if(d) {
      return new GameSave(JSON.parse(atob(localStorage.getItem(id))), id);
    } else {
      localStorage.setItem(id, btoa(JSON.stringify(defaultValue)));
      return this.create(id, defaultValue);
    }
  }
  
  private async saveGame() {
    localStorage.setItem(this.id, btoa(JSON.stringify(this.save)));
  }
  
  entries() {
    return Object.entries(this.save);
  }
  
  keys() {
    return Object.keys(this.save);
  }
  
  values() {
    return Object.values(this.save);
  }
  
  toObject() {
    return this.save;
  }
  
  getItem(key: string) {
    return this.save[key];
  }
  
  setItem(key: string, value: any) {
    this.save[key] = value;
    this.saveGame();
  }
}