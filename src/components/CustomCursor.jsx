// src/components/CustomCursor.jsx — Ultra-smooth Direct GPU-Accelerated Cursor Follower
const { useState, useEffect, useRef } = React;
const { isTouchDevice, prefersReducedMotion } = window.PortfolioUtils || { isTouchDevice: false, prefersReducedMotion: false };

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const [cursorState, setCursorState] = useState({
    isHovered: false,
    isProjectCard: false,
    isActiveCard: false
  });

  useEffect(() => {
    // Custom cursor only active for desktop fine-pointer viewports
    if (isTouchDevice || prefersReducedMotion) return;

    let isVisible = false;

    const handleMouseMove = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
        if (!isVisible) {
          isVisible = true;
          cursorRef.current.style.opacity = '1';
        }
      }
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      if (!target) return;

      const isInteractive = !!target.closest('a, button, [role="button"], input, textarea, select, .project-card, .btn-primary, .neo-btn');
      const inProjectCard = !!target.closest('.project-card, .project-editorial-card');
      const inActiveCard = !!target.closest('.timeline-card.active');

      setCursorState(prev => {
        if (
          prev.isHovered === isInteractive &&
          prev.isProjectCard === inProjectCard &&
          prev.isActiveCard === inActiveCard
        ) {
          return prev;
        }
        return {
          isHovered: isInteractive,
          isProjectCard: inProjectCard,
          isActiveCard: inActiveCard
        };
      });
    };

    const handleMouseLeave = () => {
      if (cursorRef.current) {
        cursorRef.current.style.opacity = '0';
      }
      isVisible = false;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  if (isTouchDevice || prefersReducedMotion) return null;

  const { isHovered, isProjectCard, isActiveCard } = cursorState;
  const cursorSize = isActiveCard ? '96px' : (isProjectCard ? '80px' : (isHovered ? '38px' : '12px'));

  return (
    <div 
      ref={cursorRef}
      className={`custom-cursor-follower ${isHovered ? 'cursor-hover' : ''} ${isProjectCard ? 'cursor-project' : ''} ${isActiveCard ? 'cursor-active-card' : ''}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        transform: 'translate3d(-100px, -100px, 0) translate(-50%, -50%)',
        width: cursorSize,
        height: cursorSize,
        borderRadius: '50%',
        backgroundColor: isProjectCard ? 'var(--color-accent-coral)' : (isHovered ? 'transparent' : 'var(--color-accent-coral)'),
        border: isHovered && !isProjectCard ? '2px solid var(--color-accent-coral)' : 'none',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        pointerEvents: 'none',
        zIndex: 99999,
        opacity: 0,
        willChange: 'transform, width, height',
        transition: 'width 0.2s cubic-bezier(0.16, 1, 0.3, 1), height 0.2s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.2s ease, border 0.2s ease, opacity 0.2s ease'
      }}
    >
      {isProjectCard && (
        <span 
          style={{ 
            fontSize: '0.52rem', 
            fontWeight: '900', 
            letterSpacing: '0.08em', 
            color: '#FFFFFF',
            whiteSpace: 'nowrap',
            fontFamily: 'var(--font-headings)'
          }}
        >
          VIEW PROJECT
        </span>
      )}
    </div>
  );
};

// Double-safe Namespace Registries
window.Portfolio = window.Portfolio || {};
window.PortfolioComponents = window.PortfolioComponents || {};

window.Portfolio.CustomCursor = CustomCursor;
window.PortfolioComponents.CustomCursor = CustomCursor;
