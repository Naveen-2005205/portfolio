// src/components/Marquee.jsx
const { prefersReducedMotion } = window.PortfolioUtils;

const Marquee = () => {
  const words = ["BUILD", "CREATE", "SOLVE", "SHIP"];
  
  // Create a repeated array of elements to ensure seamless loop
  const repeatedWords = Array(8).fill(words).flat();

  return (
    <div 
      className="marquee-section"
      style={{
        overflow: 'hidden',
        width: '100%',
        backgroundColor: 'transparent',
        borderTop: '2px solid #171717',
        borderBottom: '2px solid #171717',
        padding: '18px 0',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <div 
        className="marquee-track"
        style={{
          display: 'flex',
          whiteSpace: 'nowrap',
          willChange: 'transform',
          animation: prefersReducedMotion ? 'none' : 'marqueeScroll 35s linear infinite'
        }}
      >
        {repeatedWords.map((word, idx) => (
          <span 
            key={idx}
            style={{
              fontFamily: 'var(--font-headings)',
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              fontWeight: '900',
              letterSpacing: '0.04em',
              color: 'transparent',
              WebkitTextStroke: '1.5px #171717',
              padding: '0 30px',
              display: 'inline-flex',
              alignItems: 'center'
            }}
          >
            {word}
            <span style={{ 
              color: 'var(--color-accent-coral)', 
              fontSize: '1.2rem', 
              marginLeft: '60px', 
              WebkitTextStroke: 'none' 
            }}>
              •
            </span>
          </span>
        ))}
      </div>
    </div>
  );
};

// Double-safe Namespace Registries
window.Portfolio = window.Portfolio || {};
window.PortfolioComponents = window.PortfolioComponents || {};

window.Portfolio.Marquee = Marquee;
window.PortfolioComponents.Marquee = Marquee;

