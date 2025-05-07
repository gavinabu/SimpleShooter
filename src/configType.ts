/*
 * © 2021-2025 JustWhatever. All rights reserved.
 * Property of Gavin Abu-Zahra. Do not reproduce or distribute without explicit permission.
 */

export interface ConfigType {
  version: {
    type: string,
    major: number,
    minor: number,
  },
  debug: {
    engineStats?: boolean,
    stats?: boolean,
    wireframes?: boolean,
    devAccount?: boolean,
    byPassMainMenu?: boolean,
    showBounds?: boolean,
    showAxes?: boolean,
    showIDs?: boolean,
    showVelocity?: boolean,
    showAngles?: boolean,
    showConvexHull?: boolean,
    showInternalEdges?: boolean,
    showVertexIDs?: boolean,
    showSeparations?: boolean,
    verboseLogs?: boolean,
    showBarrelPoint?: boolean,
    showFirePoint?: boolean,
    exposeSaves?: boolean,
  },
  server: {
    host: string,
    port?: number,
  },
  authServer: string
}