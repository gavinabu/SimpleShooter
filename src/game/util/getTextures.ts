/*
 * © 2021-2025 JustWhatever. All rights reserved.
 * Property of Gavin Abu-Zahra. Do not reproduce or distribute without explicit permission.
 */


export default async function getTextures(assetlocation: string, {sf = 1, label}: {sf?: number, label?: string}): Promise<string[]> {
  const url = assetlocation;
  
  const img: any = await new Promise((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = reject;
    i.src = url;
  });
  
  const { width, height } = img;
  if (!width || !height) throw new Error('SVG has no dimensions');
  
  const frameCount = Math.floor(height / width);
  const scaledSize = width * sf;
  const frames = [];
  
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = scaledSize;
  canvas.height = scaledSize;
  
  for (let i = 0; i < frameCount; i++) {
    ctx.clearRect(0, 0, scaledSize, scaledSize);
    ctx.drawImage(
      img,
      0, i * width, width, width,
      0, 0, scaledSize, scaledSize
    );
    
    const dataUrl = canvas.toDataURL('image/png');
    frames.push(dataUrl);
  }
  
  URL.revokeObjectURL(url);
  return frames;
}