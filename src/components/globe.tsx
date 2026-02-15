"use client";

import createGlobe from "cobe";
import { useEffect, useRef } from "react";
import { useSpring } from "react-spring";
import { useTheme } from "next-themes";

export function Globe({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);
  const { theme } = useTheme();

  const [{ r }, api] = useSpring(() => ({
    r: 0,
    config: {
      mass: 1,
      tension: 280,
      friction: 40,
      precision: 0.001,
    },
  }));

  useEffect(() => {
    let phi = 0;
    let width = 0;
    const onResize = () => canvasRef.current && (width = canvasRef.current.offsetWidth)
    window.addEventListener('resize', onResize)
    onResize()

    const isDark = theme === 'dark';

    const globe = createGlobe(canvasRef.current!, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: 0.3,
      dark: isDark ? 1 : 0,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: isDark ? [0.3, 0.3, 0.3] : [0.8, 0.8, 0.8],
      markerColor: [0.1, 0.8, 1],
      glowColor: isDark ? [1, 1, 1] : [0.5, 0.5, 0.5],
      markers: [
        { location: [1.3521, 103.8198], size: 0.1 },      // Singapore
        { location: [42.7339, 25.4858], size: 0.05 },     // Bulgaria
        { location: [37.9838, 23.7275], size: 0.05 },     // Greece
        { location: [37.0902, -95.7129], size: 0.1 },      // USA
        { location: [40.4168, -3.7038], size: 0.1 },      // Spain
        { location: [51.5074, -0.1278], size: 0.08 },     // UK
        { location: [41.8719, 12.5674], size: 0.05 },     // Italy
        { location: [47.4979, 19.0402], size: 0.05 },     // Hungary
        { location: [48.1486, 17.1077], size: 0.05 },     // Slovakia
        { location: [50.0755, 14.4378], size: 0.05 },     // Czech Republic
        { location: [38.7223, -9.1393], size: 0.05 },     // Portugal
        { location: [36.1408, -5.3536], size: 0.04 },     // Gibraltar
        { location: [52.3676, 4.9041], size: 0.05 },      // Netherlands
        { location: [52.5200, 13.4050], size: 0.05 },     // Germany
        { location: [48.2082, 16.3738], size: 0.05 },     // Austria
        { location: [14.5995, 120.9842], size: 0.05 },    // Philippines
        { location: [11.5564, 104.9282], size: 0.05 },    // Cambodia
        { location: [3.1390, 101.6869], size: 0.05 },     // Malaysia
        { location: [13.7563, 100.5018], size: 0.05 },    // Thailand
        { location: [25.0330, 121.5654], size: 0.05 },    // Taiwan
        { location: [-8.3405, 115.0920], size: 0.05 },    // Indonesia (Bali)
        { location: [25.2854, 51.5310], size: 0.05 },     // Qatar
        { location: [43.5528, 7.0174], size: 0.05 },      // France (Cannes)
        { location: [50.8503, 4.3517], size: 0.05 },      // Belgium
      ],
      onRender: (state) => {
        // This prevents rotation while dragging
        if (!pointerInteracting.current) {
          // Called on every animation frame.
          // `state` will be an empty object, return updated params.
          phi += 0.005
        } 
        state.phi = phi + r.get()
        state.width = width * 2
        state.height = width * 2
      }
    })
    setTimeout(() => canvasRef.current!.style.opacity = '1')
    return () => { 
      globe.destroy();
      window.removeEventListener('resize', onResize);
    }
  }, [theme])

  return (
    <div style={{
      width: '100%',
      maxWidth: 600,
      aspectRatio: 1,
      margin: 'auto',
      position: 'relative',
      zIndex: 45,
    }} className={className}>
      <canvas
        ref={canvasRef}
        onPointerDown={(e) => {
          pointerInteracting.current = e.clientX - pointerInteractionMovement.current;
        }}
        onPointerUp={() => {
          pointerInteracting.current = null;
        }}
        onPointerOut={() => {
          pointerInteracting.current = null;
        }}
        onMouseMove={(e) => {
          if (pointerInteracting.current !== null) {
            const delta = e.clientX - pointerInteracting.current;
            pointerInteractionMovement.current = delta;
            api.start({
              r: delta / 200,
            });
          }
        }}
        onTouchMove={(e) => {
          if (pointerInteracting.current !== null && e.touches[0]) {
            const delta = e.touches[0].clientX - pointerInteracting.current;
            pointerInteractionMovement.current = delta;
            api.start({
              r: delta / 100,
            });
          }
        }}
        style={{
          width: '100%',
          height: '100%',
          cursor: 'grab',
          contain: 'layout paint size',
          opacity: 0,
          transition: 'opacity 1s ease',
        }}
      />
    </div>
  )
}
