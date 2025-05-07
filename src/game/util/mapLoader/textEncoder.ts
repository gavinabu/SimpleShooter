/*
 * © 2021-2025 JustWhatever. All rights reserved.
 * Property of Gavin Abu-Zahra. Do not reproduce or distribute without explicit permission.
 */

export function textToInt32Array(text: string) {
  const SEGMENT_COUNT = 64;
  const BYTES_PER_SEGMENT = 4;
  const TOTAL_BYTES = SEGMENT_COUNT * BYTES_PER_SEGMENT;
  
  const encoder = new TextEncoder();
  const encoded = encoder.encode(text);
  
  const buffer = new ArrayBuffer(TOTAL_BYTES);
  const byteView = new Uint8Array(buffer);
  
  byteView.set(encoded.subarray(0, TOTAL_BYTES));
  
  return new Int32Array(buffer);
}

export function int32ArrayToText(int32Array: Int32Array): string {
  const byteView = new Uint8Array(int32Array.buffer.slice(0,64));
  const decoder = new TextDecoder();
  return decoder.decode(byteView).replace(/\0+$/, '');
}
