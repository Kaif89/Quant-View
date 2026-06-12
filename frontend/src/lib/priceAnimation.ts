import { useState, useEffect } from 'react';

/**
 * Custom hook managing Framer Motion animate parameters based on price deltas.
 * Triggers a 300ms flash on the card background.
 */
export function usePriceFlash(currentPrice?: number) {
  const [prevPrice, setPrevPrice] = useState(currentPrice);
  const [flashProps, setFlashProps] = useState({ backgroundColor: 'transparent' });
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (currentPrice === undefined || prevPrice === undefined) {
      setPrevPrice(currentPrice);
      return;
    }

    if (currentPrice > prevPrice) {
      setFlashProps({ backgroundColor: 'rgba(34, 197, 94, 0.2)' }); // Green flash
      setKey(prev => prev + 1);
    } else if (currentPrice < prevPrice) {
      setFlashProps({ backgroundColor: 'rgba(239, 68, 68, 0.2)' }); // Red flash
      setKey(prev => prev + 1);
    }
    
    setPrevPrice(currentPrice);
    
    // Auto reset back to transparent after 300ms
    const timeout = setTimeout(() => {
      setFlashProps({ backgroundColor: 'transparent' });
    }, 300);

    return () => clearTimeout(timeout);
  }, [currentPrice, prevPrice]);

  return { flashProps, key };
}
