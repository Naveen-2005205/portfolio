// src/components/PortfolioCharacter.jsx
const { useState, useEffect, useRef, useCallback } = React;
const { isTouchDevice, prefersReducedMotion } = window.PortfolioUtils || { isTouchDevice: false, prefersReducedMotion: false };

const PortfolioCharacter = ({
  src = "assets/about-character.png",
  variant = "about",
  alt = "3D illustrated character",
  activeCard = null,
  className = "",
  style = {}
}) => {
  const containerRef = useRef(null);
  const rafRef = useRef(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsRevealed(true);
          }
        });
      },
      { threshold: 0.12 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Subtle cursor interaction (desktop only, clamped to max 8px movement)
  useEffect(() => {
    if (isTouchDevice || prefersReducedMotion) return;

    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      rafRef.current = requestAnimationFrame(() => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - centerX) / window.innerWidth;
        const deltaY = (e.clientY - centerY) / window.innerHeight;

        const moveX = Math.max(-8, Math.min(8, deltaX * 14));
        const moveY = Math.max(-6, Math.min(6, deltaY * 10));
        const rot = Math.max(-2, Math.min(2, deltaX * 2.5));

        const charImg = containerRef.current.querySelector('.portfolio-character-img');
        if (charImg) {
          charImg.style.transform = `translate3d(${moveX.toFixed(1)}px, ${moveY.toFixed(1)}px, 0) rotate(${rot.toFixed(1)}deg)`;
        }
      });
    };

    const handleMouseLeave = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        if (!containerRef.current) return;
        const charImg = containerRef.current.querySelector('.portfolio-character-img');
        if (charImg) {
          charImg.style.transform = 'translate3d(0, 0, 0) rotate(0deg)';
        }
      });
    };

    const sectionEl = document.getElementById(variant);
    if (sectionEl) {
      sectionEl.addEventListener('mousemove', handleMouseMove, { passive: true });
      sectionEl.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (sectionEl) {
        sectionEl.removeEventListener('mousemove', handleMouseMove);
        sectionEl.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [variant]);

  // Determine card hover acknowledgment class
  let cardReactionClass = "";
  if (activeCard !== null && activeCard !== undefined) {
    cardReactionClass = `card-active-${activeCard}`;
  }

  return (
    <div
      ref={containerRef}
      className={`portfolio-character-container variant-${variant} ${isRevealed ? 'revealed' : ''} ${cardReactionClass} ${className}`}
      style={style}
      aria-hidden="true"
    >
      {/* Grounded anchor shadow underneath seated mascot */}
      <div className="portfolio-character-ground-shadow" />

      {/* Main 3D character image */}
      <img
        src={src}
        alt={alt}
        className="portfolio-character-img"
        loading="eager"
        draggable="false"
      />
    </div>
  );
};

// Double-safe Namespace Registries
window.Portfolio = window.Portfolio || {};
window.PortfolioComponents = window.PortfolioComponents || {};

window.Portfolio.PortfolioCharacter = PortfolioCharacter;
window.PortfolioComponents.PortfolioCharacter = PortfolioCharacter;
window.PortfolioComponents.ContactCharacter = PortfolioCharacter;
