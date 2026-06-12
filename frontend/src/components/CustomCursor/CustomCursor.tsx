import { useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import './CustomCursor.scss';

const CustomCursor = () => {
  const bigBallRef = useRef<HTMLDivElement>(null);
  const smallBallRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const isHovering = useRef(false);
  const isVisible = useRef(true);
  const mousePos = useRef({ x: -100, y: -100 });
  const bigPos = useRef({ x: -100, y: -100 });
  const currentScale = useRef(1);
  const rafId = useRef<number>(0);

  // Reset hover state on route change
  useEffect(() => {
    isHovering.current = false;
    currentScale.current = 1;
    if (bigBallRef.current) {
      bigBallRef.current.style.transform = `translate(${bigPos.current.x}px, ${bigPos.current.y}px) scale(1)`;
    }
  }, [location.pathname]);

  const animate = useCallback(() => {
    const bigBall = bigBallRef.current;
    const smallBall = smallBallRef.current;
    if (!bigBall || !smallBall) {
      rafId.current = requestAnimationFrame(animate);
      return;
    }

    // Lerp the big ball position (smooth follow — lower = slower/smoother)
    const posLerp = 0.08;
    bigPos.current.x += (mousePos.current.x - bigPos.current.x) * posLerp;
    bigPos.current.y += (mousePos.current.y - bigPos.current.y) * posLerp;

    // Linear step for smooth, consistent hover grow/shrink animation
    const targetScale = isHovering.current ? 2 : 1;
    const step = 0.15; // fast but still visibly animated (~0.12s to expand)
    if (currentScale.current < targetScale) {
      currentScale.current = Math.min(currentScale.current + step, targetScale);
    } else if (currentScale.current > targetScale) {
      currentScale.current = Math.max(currentScale.current - step, targetScale);
    }

    const opacity = isVisible.current ? 1 : 0;

    bigBall.style.transform = `translate(${bigPos.current.x - 15}px, ${bigPos.current.y - 15}px) scale(${currentScale.current})`;
    bigBall.style.opacity = String(opacity);
    smallBall.style.transform = `translate(${mousePos.current.x - 5}px, ${mousePos.current.y - 5}px)`;
    smallBall.style.opacity = String(opacity);

    rafId.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      isVisible.current = true;
    };

    const onMouseLeave = () => {
      isVisible.current = false;
    };

    const onMouseEnter = () => {
      isVisible.current = true;
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as Element;
      if (target.closest('a, button, .hoverable, input, select, textarea, [role="button"]')) {
        isHovering.current = true;
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      const target = e.target as Element;
      if (target.closest('a, button, .hoverable, input, select, textarea, [role="button"]')) {
        isHovering.current = false;
      }
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);
    document.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mouseout', onMouseOut);

    // Start animation loop
    rafId.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseout', onMouseOut);
      cancelAnimationFrame(rafId.current);
    };
  }, [animate]);

  return (
    <>
      <div className="big-ball" ref={bigBallRef}>
        <svg viewBox="0 0 30 30">
          <circle cx="15" cy="15" r="12" />
        </svg>
      </div>
      <div className="small-ball" ref={smallBallRef}>
        <svg viewBox="0 0 10 10">
          <circle cx="5" cy="5" r="4" />
        </svg>
      </div>
    </>
  );
};

export default CustomCursor;
