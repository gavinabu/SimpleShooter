/*
 * © 2021-2025 JustWhatever. All rights reserved.
 * Property of Gavin Abu-Zahra. Do not reproduce or distribute without explicit permission.
 */

import './index.css';
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
setInterval(() => {
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
},150)
