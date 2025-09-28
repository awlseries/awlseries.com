// src/components/LottieAnimation/LottieAnimation.jsx
import React, { useEffect, useRef } from 'react';
import lottie from 'lottie-web';
import gearAnimation from './gear-icon.json';

const LottieAnimation = ({ width = 40, height = 40, color = '#ff781fff' }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      const animation = lottie.loadAnimation({
        container: containerRef.current,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: gearAnimation
      });

      animation.addEventListener('DOMLoaded', () => {
        // Изменяем цвет всех путей в SVG
        const paths = containerRef.current.querySelectorAll('path');
        paths.forEach(path => {
          path.style.fill = color;
          path.style.stroke = color;
        });
      });

      return () => {
        animation.destroy();
      };
    }
  }, [color]);

  return (
    <div 
      ref={containerRef} 
      style={{ width: `${width}px`, height: `${height}px`, margin: '0 auto' }}
    />
  );
};

export default LottieAnimation;