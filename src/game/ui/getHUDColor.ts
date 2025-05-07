/*
 * © 2021-2025 JustWhatever. All rights reserved.
 * Property of Gavin Abu-Zahra. Do not reproduce or distribute without explicit permission.
 */

import Game from "../Game";

function getBrightness(r: number, g: number, b: number, a: number) {
  const rBlended = r * a + 255 * (1 - a);
  const gBlended = g * a + 255 * (1 - a);
  const bBlended = b * a + 255 * (1 - a);

  return Math.max(0, Math.min(255, (rBlended * 299 + gBlended * 587 + bBlended * 114) / 1000));
}

function sum(numbers: number[]): number {
  return numbers.reduce((accumulator, current) => accumulator + current, 0);
}

export default function getHUDColor(position: DOMRect, game: Game) {
  const data = game.renderer.context.getImageData(position.x*2,position.y*2, (position.width || 1)*2, (position.height || 1)*2).data
  const newData = [];
  for (let i = 0; i < data.length/4; i++) {
    newData.push(getBrightness(
      data[(i*4)],
      data[(i*4)+1],
      data[(i*4)+2],
      data[(i*4)+3],
    ));
  }
  
  return sum(newData) / newData.length > 128 ? "black" : "white"
}