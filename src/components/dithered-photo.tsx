"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface DitheredPhotoProps {
  src: string;
  alt: string;
  className?: string;
  enableDither?: boolean;
}

export function DitheredPhoto({ src, alt, className, enableDither = true }: DitheredPhotoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  // We only track error for the fallback display if the main image fails.
  // Canvas errors should just fallback to the main image.

  useEffect(() => {
    if (!enableDither || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new window.Image();
    img.crossOrigin = "Anonymous";
    img.src = src;

    img.onload = () => {
      try {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;

          // Atkinson Dithering
          for (let y = 0; y < canvas.height; y++) {
            for (let x = 0; x < canvas.width; x++) {
              const i = (y * canvas.width + x) * 4;
              
              const oldR = data[i];
              const oldG = data[i + 1];
              const oldB = data[i + 2];
              
              // Convert to grayscale for thresholding
              const oldPixel = (oldR + oldG + oldB) / 3;
              const newPixel = oldPixel > 128 ? 255 : 0;
              
              const quantError = oldPixel - newPixel;

              data[i] = newPixel;
              data[i + 1] = newPixel;
              data[i + 2] = newPixel;

              // Distribute error
              const distributeError = (dx: number, dy: number, factor: number) => {
                const nx = x + dx;
                const ny = y + dy;
                if (nx >= 0 && nx < canvas.width && ny >= 0 && ny < canvas.height) {
                  const ni = (ny * canvas.width + nx) * 4;
                  // We only update grayscale values for simplicity
                  const val = data[ni] + (quantError * factor) / 8;
                  data[ni] = val;
                  data[ni + 1] = val;
                  data[ni + 2] = val;
                }
              };

              distributeError(1, 0, 1);
              distributeError(2, 0, 1);
              distributeError(-1, 1, 1);
              distributeError(0, 1, 1);
              distributeError(1, 1, 1);
              distributeError(0, 2, 1);
            }
          }

          ctx.putImageData(imageData, 0, 0);
          setIsLoaded(true);
      } catch (e) {
          // If canvas operations fail (e.g. CORS), we just don't set isLoaded to true.
          // The main image will remain visible.
          console.warn("Dithering failed, falling back to original image:", e);
      }
    };

    img.onerror = () => {
        // If the canvas image fails to load, we just don't do dithering.
        // We do NOT set global error, because the Next/Image might still work (or handle its own error).
        console.warn("Could not load image for dithering");
    };

  }, [src, enableDither]);

  return (
    <div className={cn("relative overflow-hidden rounded-xl", className)}>
      <canvas
        ref={canvasRef}
        className={cn(
          "absolute inset-0 w-full h-full object-cover transition-opacity duration-500",
          isLoaded && enableDither ? "opacity-100" : "opacity-0"
        )}
      />
      <Image
        src={src}
        alt={alt}
        fill
        className={cn(
          "object-cover transition-opacity duration-500",
          isLoaded && enableDither ? "opacity-0" : "opacity-100"
        )}
        // We can optionally handle main image error here if we want a fallback UI
        // onError={() => setHasError(true)} 
      />
    </div>
  );
}
