import React from 'react';
import { Pixel } from '../types';
import { Check } from 'lucide-react';
interface PixelGridProps {
  pixels: Pixel[];
  currentUserId: string;
  onPixelClick?: (pixel: Pixel) => void;
}
export function PixelGrid({
  pixels,
  currentUserId,
  onPixelClick
}: PixelGridProps) {
  const gridSize = Math.ceil(Math.sqrt(pixels.length));
  return <div className="bg-white rounded-xl shadow-sm p-4">
      <div className="grid gap-1" style={{
      gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`
    }}>
        {pixels.map(pixel => {
        const isMyPixel = pixel.assignedTo === currentUserId;
        const isCompleted = !!pixel.uploadedPhoto;
        return <div key={pixel.id} onClick={() => onPixelClick?.(pixel)} className={`
                aspect-square rounded-sm relative overflow-hidden
                ${onPixelClick ? 'cursor-pointer' : ''}
                ${isMyPixel && !isCompleted ? 'ring-2 ring-blue-500 ring-offset-1' : ''}
                ${isCompleted ? 'opacity-100' : 'opacity-40'}
                transition-all hover:scale-105
              `} style={{
          backgroundColor: pixel.colorCode
        }}>
              {isCompleted && pixel.uploadedPhoto && <img src={pixel.uploadedPhoto} alt="Uploaded" className="w-full h-full object-cover" />}
              {isCompleted && <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                  <Check className="w-3 h-3 text-white drop-shadow" />
                </div>}
              {isMyPixel && !isCompleted && <div className="absolute inset-0 bg-blue-500/10" />}
            </div>;
      })}
      </div>
    </div>;
}