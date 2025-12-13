export const dynamic = 'force-dynamic';

import React from 'react';

type Direction = 'up' | 'down' | 'left' | 'right';

interface LandoltCProps {
    size: number; // pixel size
    direction: Direction;
    className?: string;
    onClick?: () => void;
}

const LandoltC: React.FC<LandoltCProps> = ({ size, direction, className, onClick }) => {
    const rotation = {
        right: 0,
        down: 90,
        left: 180,
        up: 270,
    }[direction];

    // Landolt C geometry
    // Outer diameter: 5 * gap
    // Inner diameter: 3 * gap
    // Gap: 1 * gap
    // We scale everything to the 'size' prop which is the outer diameter.

    return (
        <div
            className={`flex items-center justify-center ${className}`}
            style={{ width: size, height: size, transform: `rotate(${rotation}deg)` }}
            onClick={onClick}
        >
            <svg width={size} height={size} viewBox="0 0 100 100" shapeRendering="geometricPrecision">
                {/* 
                  Standard Landolt C Geometry:
                  Outer Radius R=50, Inner Radius r=30, Gap Width=20 (centered at y=50)
                  Gap is parallel, so we calculate intersection points.
                  y-offsets from center: +/- 10.
                  x-offsets from center: sqrt(R^2 - 10^2)
                  
                  Inner x offset: sqrt(900 - 100) = sqrt(800) ≈ 28.284
                  Outer x offset: sqrt(2500 - 100) = sqrt(2400) ≈ 48.990
                  
                  Points (relative to 50,50 center):
                  Inner Top: (28.284, -10) -> Absolute: (78.284, 40)
                  Outer Top: (48.990, -10) -> Absolute: (98.990, 40)
                  Inner Bot: (28.284, 10)  -> Absolute: (78.284, 60)
                  Outer Bot: (48.990, 10)  -> Absolute: (98.990, 60)
                */}
                <path
                    d="M 98.99 40 A 50 50 0 1 0 98.99 60 L 78.28 60 A 30 30 0 1 1 78.28 40 Z"
                    fill="black"
                />
            </svg>
        </div>
    );
};

export default LandoltC;
