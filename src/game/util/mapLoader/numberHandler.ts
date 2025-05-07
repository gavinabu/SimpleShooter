/*
 * © 2021-2025 JustWhatever. All rights reserved.
 * Property of Gavin Abu-Zahra. Do not reproduce or distribute without explicit permission.
 */


export function uint32ToInt32(u: number) {
  return u > 0x7FFFFFFF ? u - 0x100000000 : u;
}

export function int32ToUint32(i: number) {
  return i < 0 ? i + 0x100000000 : i;
}
