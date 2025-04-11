/*
 * © 2021-2025 JustWhatever. All rights reserved.
 * Property of Gavin Abu-Zahra. Do not reproduce or distribute without explicit permission.
 */

export class Logger {
  private _name: string;
  set name(name: string) {this._name = name;}
  
  constructor(name: string) {
    this._name = name;
  }
  
  log(...msg: any[]): void {
    console.log(`%c[LOG] [${new Date().toLocaleDateString()}] [${new Date().toLocaleTimeString()}}]`, "color: #6392f7", ...msg)
  }
  
  warn(...msg: any[]): void {
    console.log(`%c[WARN] [${new Date().toLocaleDateString()}] [${new Date().toLocaleTimeString()}}]`, "color: #ffa13d", ...msg)
  }
  
  error(...msg: any[]): void {
    console.log(`%c[ERROR] [${new Date().toLocaleDateString()}] [${new Date().toLocaleTimeString()}}]`, "color: #ff573d", ...msg)
  }
}