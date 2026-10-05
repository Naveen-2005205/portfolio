// src/components/About.jsx
const { useEffect, useState, useRef } = React;
const { prefersReducedMotion } = window.PortfolioUtils || { prefersReducedMotion: false };

const About = () => {
  const exploringCards = (window.PortfolioData && window.PortfolioData.exploringCards) || [];
  const [hoveredStat, setHoveredStat] = useState(null);

  // Custom Counter logic for animated stats
  const StatCounter = ({ endVal, suffix = "" }) => {
    const [count, setCount] = useState(0);
    const elementRef = useRef(null);
    const [hasFired, setHasFired] = useState(false);

    useEffect(() => {
      if (prefersReducedMotion) {
        setCount(endVal);
        return;
      }

      const observer = new IntersectionObserver((entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasFired) {
          setHasFired(true);
          let start = 0;
          const duration = 1200; // ms
          const stepTime = Math.abs(Math.floor(duration / endVal));

          const timer = setInterval(() => {
            start += 1;
            setCount(start);
            if (start >= endVal) {
              clearInterval(timer);
            }
          }, Math.max(stepTime, 20));
        }
      }, { threshold: 0.1 });

      if (elementRef.current) {
        observer.observe(elementRef.current);
      }

      return () => observer.disconnect();
    }, [endVal, hasFired]);

    return (
      <span ref={elementRef} className="stat-number">
        {count}{suffix}
      </span>
    );
  };

  const statItems = [
    {
      label: "COMPLETED PROJECTS",
      desc: "Real-world & personal builds",
      val: 3,
      suffix: "",
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      )
    },
    {
      label: "SKILLS & TECHNOLOGIES",
      desc: "Full-stack, tools & frameworks",
      val: 21,
      suffix: "+",
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
          <rect x="9" y="9" width="6" height="6" />
          <line x1="9" y1="1" x2="9" y2="4" />
          <line x1="15" y1="1" x2="15" y2="4" />
          <line x1="9" y1="20" x2="9" y2="23" />
          <line x1="15" y1="20" x2="15" y2="23" />
          <line x1="20" y1="9" x2="23" y2="9" />
          <line x1="20" y1="14" x2="23" y2="14" />
          <line x1="1" y1="9" x2="4" y2="9" />
          <line x1="1" y1="14" x2="4" y2="14" />
        </svg>
      )
    },
    {
      label: "INTERNSHIP MILESTONE",
      desc: "Practical industry experience",
      val: 1,
      suffix: "",
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      )
    }
  ];

  const handleCtaClick = (e) => {
    e.preventDefault();
    const contactEl = document.getElementById('contact');
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.pushState(null, '', '#contact');
    }
  };

  const PortfolioCharacterComponent =
    window.PortfolioComponents.PortfolioCharacter ||
    window.Portfolio.PortfolioCharacter;

  return (
    <section
      id="about"
      className="about-section"
    >
      <div className="container" style={{ position: 'relative' }}>

        {/* Section Header */}
        <div className="section-header reveal-on-scroll">
          <span className="section-label">01 / ABOUT ME</span>
          <h2 className="section-title">THE BUILDER</h2>
          <div className="section-divider" aria-hidden="true">
            <div className="section-divider-coral" />
          </div>
        </div>

        {/* Asymmetric Editorial Grid */}
        <div className="about-editorial-grid">

          {/* Left Column: Main Statement, Description & CTA */}
          <div className="about-left-col">
            <h3 className="about-editorial-statement">
              I TURN IDEAS<br />
              INTO WORKING<br />
              DIGITAL SYSTEMS.
            </h3>

            <p className="about-bio">
              I am a Computer Science Engineering student and a dedicated builder who enjoys exploring the vast layers of software development, mobile app design, database architecture, and IoT systems.
              My approach focuses on writing tidy, readable code, designing clean layouts, and continually refining system responsiveness.
            </p>

            {/* Editorial CTA */}
            <div style={{ marginTop: '28px' }}>
              <a
                href="#contact"
                onClick={handleCtaClick}
                className="btn-primary about-cta-btn"
              >
                LET'S BUILD TOGETHER
                <span className="arrow" style={{ display: 'inline-block', marginLeft: '8px', transition: 'transform 0.2s ease' }}>→</span>
              </a>
            </div>
          </div>

          {/* Right Column: Stats Panel with Integrated Seated 3D Character */}
          <div className="about-right-col about-right-stage">

            {/* Stat cards stack */}
            <div className="about-stats-stack">
              {statItems.map((stat, idx) => (
                <div
                  key={stat.label}
                  className={`stat-card stat-card-${idx}`}
                  onMouseEnter={() => setHoveredStat(idx)}
                  onMouseLeave={() => setHoveredStat(null)}
                >
                  <div className="stat-card-left">
                    <div className="stat-card-icon-box" aria-hidden="true">
                      {stat.icon}
                    </div>
                    <div className="stat-card-info">
                      <span className="stat-card-label">{stat.label}</span>
                      <span className="stat-card-desc">{stat.desc}</span>
                    </div>
                  </div>
                  <div className="stat-card-value">
                    <StatCounter endVal={stat.val} suffix={stat.suffix} />
                  </div>
                </div>
              ))}
            </div>

            {/* Reusable Seated Portfolio Mascot Component */}
            {PortfolioCharacterComponent ? (
              <PortfolioCharacterComponent
                src="assets/about-character.png"
                variant="about"
                alt="3D illustrated developer character seated beside statistics"
                activeCard={hoveredStat}
              />
            ) : (
              <div className="portfolio-character-container variant-about revealed">
                <div className="portfolio-character-ground-shadow" />
                <img
                  src="assets/about-character.png"
                  alt="3D illustrated developer character seated beside statistics"
                  className="portfolio-character-img"
                  loading="eager"
                  draggable="false"
                />
              </div>
            )}

          </div>

        </div>

        {/* "Currently Exploring" Subsection */}
        <div className="about-exploring-wrap" style={{ marginTop: 'clamp(28px, 3.5vw, 40px)' }}>
          <h4 className="about-exploring-title">
            CURRENTLY EXPLORING & EXPERIMENTING
          </h4>

          <div className="exploring-grid">
            {exploringCards.map(card => (
              <div
                key={card.id}
                className="exploring-card glass-panel"
              >
                <div
                  className="exploring-icon-wrapper"
                  dangerouslySetInnerHTML={{ __html: card.icon }}
                />
                <div>
                  <h5 className="exploring-card-title">
                    {card.title}
                  </h5>
                  <span className="exploring-card-subtitle">
                    {card.subtitle}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

// Double-safe Namespace Registries
window.Portfolio = window.Portfolio || {};
window.PortfolioComponents = window.PortfolioComponents || {};

window.Portfolio.About = About;
window.PortfolioComponents.About = About;
