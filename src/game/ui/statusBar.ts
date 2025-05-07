/*
 * © 2021-2025 JustWhatever. All rights reserved.
 * Property of Gavin Abu-Zahra. Do not reproduce or distribute without explicit permission.
 */

import getHUDColor from "./getHUDColor";
import Game from "../Game";

export default function StatusBar(label: string, color: string, game: Game, height: number = 24) {
  const container = document.createElement('div');
  container.className = 'bar-container';
  const labelele = document.createElement('span');
  labelele.innerText = label;
  const bar = document.createElement("div");
  bar.className = "bar";
  bar.style.height = (height-4) + "px";
  const inner = document.createElement("div");
  inner.className = "inner";
  inner.style.backgroundColor = color;
  bar.appendChild(inner);
  container.append(labelele, bar)
  
  return {
    ele: container,
    // 0-1
    setBar: (value: number) => {
      inner.style.width = `${value * 124}px`;
    },
    // css color
    setColor: (color: string) => {
      inner.style.backgroundColor = color;
    },
    
    updateColor: () => {
      labelele.style.color = getHUDColor(labelele.getBoundingClientRect(), game);
    }
    
  };
}