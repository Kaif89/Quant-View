import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
}

export function SplitText({ text, className = '', delay = 0 }: SplitTextProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-20%' });

  // Split text into words, keeping spaces as separate elements for correct wrapping
  const words = text.split(' ').map(word => word + '\u00A0');

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { 
        staggerChildren: 0.05, 
        delayChildren: delay * i 
      },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        damping: 24,
        stiffness: 100,
        mass: 0.8,
      },
    },
    hidden: {
      opacity: 0,
      y: 20, // Animating up from y: 20 as requested
    },
  };

  return (
    <motion.div
      ref={ref}
      style={{ overflow: 'hidden', display: 'flex', flexWrap: 'wrap' }}
      variants={container}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className={className}
    >
      {words.map((word, index) => (
        <span
          style={{ overflow: 'hidden', display: 'inline-block' }}
          key={index}
        >
          <motion.span style={{ display: 'inline-block' }} variants={child}>
            {word}
          </motion.span>
        </span>
      ))}
    </motion.div>
  );
}
