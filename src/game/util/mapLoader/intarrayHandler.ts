/*
 * © 2021-2025 JustWhatever. All rights reserved.
 * Property of Gavin Abu-Zahra. Do not reproduce or distribute without explicit permission.
 */

export function toInt8(array: any) {
  return new Int8Array(array.buffer);
}

export function toUint8(array: any) {
  return new Uint8Array(array.buffer);
}

export function toInt16(array: any) {
  return new Int16Array(array.buffer);
}

export function toUint16(array: any) {
  return new Uint16Array(array.buffer);
}

export function toInt32(array: any) {
  return new Int32Array(array.buffer);
}

export function toUint32(array: any) {
  return new Uint32Array(array.buffer);
}

export function toFloat32(array: any) {
  return new Float32Array(array.buffer);
}

export function toFloat64(array: any) {
  return new Float64Array(array.buffer);
}
