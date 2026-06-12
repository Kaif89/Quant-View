import React, { useState, useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';

interface ScrambleTextProps {
  text: string;
  delay?: number;
  duration?: number;
  className?: string;
  characters?: string;
}

const easeOutExpo = (x: number): number => {
  return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
};

export const ScrambleText: React.FC<ScrambleTextProps> = ({
  text,
  delay = 0,
  duration = 2.0,
  className = '',
  characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
}) => {
  const [displayText, setDisplayText] = useState('');
  const frameRef = useRef<number>(0);
  const startTimeRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLSpanElement>(null);
  
  // Only start when the element is actually visible
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });
  
  useEffect(() => {
    if (!isInView) return;

    const startAnimation = () => {
      const animate = (time: number) => {
        if (startTimeRef.current === null) startTimeRef.current = time;
        const elapsed = (time - startTimeRef.current) / 1000;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutExpo(progress);
        
        const revealThreshold = easedProgress * text.length;
        
        const currentText = text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';

            if (index < revealThreshold - 0.1) {
              return char;
            }
            
            if (index < revealThreshold + 1.2) {
               const targetIdx = characters.indexOf(char);
               if (targetIdx === -1) return char;
               
               const stepSize = 50; 
               const currentAlphaIdx = Math.floor(time / stepSize) % (targetIdx + 1);
               return characters[currentAlphaIdx];
            }
            
            return ' ';
          })
          .join('');
          
        setDisplayText(currentText);
        
        if (progress < 1) {
          frameRef.current = requestAnimationFrame(animate);
        }
      };
      
      frameRef.current = requestAnimationFrame(animate);
    };

    const timer = setTimeout(() => {
      startTimeRef.current = null;
      startAnimation();
    }, delay * 1000);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(frameRef.current);
    };
  }, [isInView, text, delay, duration, characters]);

  return (
    <span ref={containerRef} className={`${className} inline-block tabular-nums whitespace-pre`}>
      {displayText || text.split('').map(c => c === ' ' ? ' ' : ' ').join('')}
    </span>
  );
};
