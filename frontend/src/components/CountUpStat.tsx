import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface CountUpStatProps {
  target: number;
  prefix?: string;
  suffix?: string;
  label: string;
  decimals?: number;
  delay?: number;
}

const easeOutExpo = (x: number): number => {
  return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
};

export function CountUpStat({ 
  target, 
  prefix = '', 
  suffix = '', 
  label, 
  decimals = 0,
  delay = 0 
}: CountUpStatProps) {
  const [count, setCount] = useState(0);
  const [typedLabel, setTypedLabel] = useState('');
  const [isFinished, setIsFinished] = useState(false);
  
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.5 });
  
  const startTimeRef = useRef<number | null>(null);
  const duration = 2.0; // Seconds for count up

  useEffect(() => {
    if (!isInView) return;

    const startAnimation = () => {
      const animate = (time: number) => {
        if (startTimeRef.current === null) startTimeRef.current = time;
        const elapsed = (time - startTimeRef.current) / 1000;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutExpo(progress);
        
        setCount(easedProgress * target);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setIsFinished(true);
        }
      };
      
      requestAnimationFrame(animate);
    };

    const timer = setTimeout(startAnimation, delay * 1000);
    return () => clearTimeout(timer);
  }, [isInView, target, delay]);

  // Typewriter effect
  useEffect(() => {
    if (!isFinished) return;
    
    let currentIdx = 0;
    const typeSpeed = 50; // ms per char
    
    const interval = setInterval(() => {
      setTypedLabel(label.slice(0, currentIdx + 1));
      currentIdx++;
      
      if (currentIdx >= label.length) {
        clearInterval(interval);
      }
    }, typeSpeed);
    
    return () => clearInterval(interval);
  }, [isFinished, label]);

  return (
    <div ref={containerRef} className="text-left py-4">
      <div className="text-5xl md:text-6xl font-medium tracking-tighter mb-2 font-mono flex items-baseline">
        {prefix && <span className="opacity-50 text-2xl md:text-3xl mr-1">{prefix}</span>}
        <span>{count.toFixed(decimals)}</span>
        {suffix && <span className="opacity-50 text-2xl md:text-3xl ml-1">{suffix}</span>}
      </div>
      <div className="text-sm text-muted-foreground uppercase tracking-widest font-mono min-h-[1.5em]">
        {typedLabel}
        {!isFinished && <span className="sr-only">{label}</span>}
        {isFinished && typedLabel.length < label.length && <span className="animate-pulse">|</span>}
      </div>
    </div>
  );
}
