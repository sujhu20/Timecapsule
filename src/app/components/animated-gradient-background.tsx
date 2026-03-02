"use client";

import { useEffect, useRef } from 'react';

interface AnimatedGradientBackgroundProps {
  className?: string;
}

export default function AnimatedGradientBackground({ className = '' }: AnimatedGradientBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    // Initialize canvas size
    resizeCanvas();

    // Update canvas on window resize
    window.addEventListener('resize', resizeCanvas);

    // Gradient settings
    const colors = [
      { r: 59, g: 130, b: 246 }, // Blue
      { r: 139, g: 92, b: 246 }, // Purple
      { r: 79, g: 70, b: 229 },  // Indigo
    ];
    
    const gradientSpeed = 0.002;
    const colorTransitionSpeed = 0.004;
    
    // Create gradient points
    const gradientPoints = Array.from({ length: 3 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: 300 + Math.random() * 200,
    }));

    // Color transition state
    let colorPhase = 0;

    // Animation loop
    const animate = () => {
      // Clear canvas with a subtle background color
      ctx.fillStyle = 'rgba(15, 23, 42, 0.03)'; // Very subtle slate color
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Update color phase
      colorPhase = (colorPhase + colorTransitionSpeed) % 1;
      
      // Move gradient points
      gradientPoints.forEach(point => {
        // Move the point
        point.x += point.vx;
        point.y += point.vy;
        
        // Bounce off edges
        if (point.x < 0 || point.x > canvas.width) point.vx *= -1;
        if (point.y < 0 || point.y > canvas.height) point.vy *= -1;
      });
      
      // Draw each gradient
      gradientPoints.forEach((point, i) => {
        // Calculate color based on position in the cycle
        const colorIndex1 = i % colors.length;
        const colorIndex2 = (i + 1) % colors.length;
        const colorMix = (colorPhase + i / gradientPoints.length) % 1;
        
        const color1 = colors[colorIndex1];
        const color2 = colors[colorIndex2];
        
        const r = Math.floor(color1.r * (1 - colorMix) + color2.r * colorMix);
        const g = Math.floor(color1.g * (1 - colorMix) + color2.g * colorMix);
        const b = Math.floor(color1.b * (1 - colorMix) + color2.b * colorMix);
        
        // Create radial gradient
        const gradient = ctx.createRadialGradient(
          point.x, point.y, 0,
          point.x, point.y, point.radius
        );
        
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.15)`);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
        ctx.fill();
      });
      
      requestAnimationFrame(animate);
    };

    // Start animation
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className={`fixed top-0 left-0 w-full h-full -z-10 pointer-events-none ${className}`}
    />
  );
} 