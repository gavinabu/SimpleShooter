/*
 * © 2021-2025 JustWhatever. All rights reserved.
 * Property of Gavin Abu-Zahra. Do not reproduce or distribute without explicit permission.
 */

import {ConfigType} from "./configType";

export const config: ConfigType = {
  version: {
    type: "BETA",
    major: 0,
    minor: 0,
  },
  debug: {
    stats: false,
    verboseLogs: true,
  },
  server: {
    host: "localhost",
  },
  authServer: "http://localhost:3001"
}