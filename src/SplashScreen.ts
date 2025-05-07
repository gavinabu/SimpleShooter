/*
 * © 2021-2025 JustWhatever. All rights reserved.
 * Property of Gavin Abu-Zahra. Do not reproduce or distribute without explicit permission.
 */

import {config} from "./config";

export enum SplashScreenType {
  "beta"
}

export default function SplashScreen(type: SplashScreenType) {
  const ele = document.createElement("div");
  switch (type) {
    case SplashScreenType.beta: {
      ele.className = "splash-beta"
      const main = document.createElement("span");
      main.className = "loading";
      main.innerText = "Loading...";
      const txt = document.createElement("span");
      txt.className = "version";
      txt.innerText = `Simple Shooter ${config.version.type} ${config.version.major}.${config.version.minor}`;
      ele.append(main, txt);
      return ele;
    }
  }
}