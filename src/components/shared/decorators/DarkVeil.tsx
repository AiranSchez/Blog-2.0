import React, { useRef } from 'react';
import DarkVeilCanvas from '../../DarkVeil.tsx';

interface DarkVeilBackgroundProps {
  className?: string;
  children?: React.ReactNode;
  hueShift?: number;
  noiseIntensity?: number;
  scanlineIntensity?: number;
  speed?: number;
  scanlineFrequency?: number;
  warpAmount?: number;
  resolutionScale?: number;
}

export default function DarkVeilBackground({
  className = '',
  children,
  hueShift = 0,
  noiseIntensity = 0.02,
  scanlineIntensity = 0.1,
  speed = 0.3,
  scanlineFrequency = 0,
  warpAmount = 0,
  resolutionScale = 0.5,
}: DarkVeilBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Canvas background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <DarkVeilCanvas
          hueShift={hueShift}
          noiseIntensity={noiseIntensity}
          scanlineIntensity={scanlineIntensity}
          speed={speed}
          scanlineFrequency={scanlineFrequency}
          warpAmount={warpAmount}
          resolutionScale={resolutionScale}
        />
      </div>

      {/* Content */}
      {children}
    </div>
  );
}
