import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import './CustomCursor.scss';

const CustomCursor = () => {
  const bigBallRef = useRef<HTMLDivElement>(null);
  const smallBallRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Reset cursor on route change
  useEffect(() => {
    if (bigBallRef.current) {
      gsap.to(bigBallRef.current, {
        duration: 0.3,
        scale: 1,
      });
    }
  }, [location.pathname]);

  useEffect(() => {
    const bigBall = bigBallRef.current;
    const smallBall = smallBallRef.current;

    if (!bigBall || !smallBall) return;

    // Move the cursor
    const onMouseMove = (e: MouseEvent) => {
      gsap.to(bigBall, {
        duration: 0.4,
        x: e.clientX - 15,
        y: e.clientY - 15,
      });
      gsap.to(smallBall, {
        duration: 0.1,
        x: e.clientX - 5,
        y: e.clientY - 5,
      });
    };

    // Hover effect
    const onMouseHover = () => {
      gsap.to(bigBall, {
        duration: 0.3,
        scale: 4,
      });
    };

    const onMouseHoverOut = () => {
      gsap.to(bigBall, {
        duration: 0.3,
        scale: 1,
      });
    };

    // Event listeners
    document.addEventListener('mousemove', onMouseMove);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as Element;
      if (target.closest('a, button, .hoverable')) {
        onMouseHover();
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as Element;
      if (target.closest('a, button, .hoverable')) {
        onMouseHoverOut();
      }
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

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
