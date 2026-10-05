// src/components/Experience.jsx
const { useEffect, useState, useRef } = React;

const Experience = () => {
  const journeySteps = window.PortfolioData.journeySteps || [];

  const [activeIndex, setActiveIndex] = useState(-1);
  const [reachedIndices, setReachedIndices] = useState([]);

  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const itemRefs = useRef([]);

  // Align refs array size with data length
  useEffect(() => {
    itemRefs.current = itemRefs.current.slice(0, journeySteps.length);
  }, [journeySteps.length]);

  // Scroll Progress and Milestone Activation Handler
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current || !trackRef.current) return;

      const trackRect = trackRef.current.getBoundingClientRect();
      const viewHeight = window.innerHeight;

      // Viewport trigger line at 60% of viewport height
      const triggerY = viewHeight * 0.6;

      const trackTop = trackRect.top;
      const trackHeight = trackRect.height;

      // Calculate progress of the scroll-driven line
      let progress = 0;
      if (trackTop <= triggerY) {
        progress = (triggerY - trackTop) / trackHeight;
        progress = Math.min(Math.max(progress, 0), 1);
      }

      // Update the CSS custom property on the track container
      trackRef.current.style.setProperty('--timeline-progress', `${progress * 100}%`);

      // Determine reached and active milestones
      let newActiveIndex = -1;
      const newReachedIndices = [];

      itemRefs.current.forEach((item, idx) => {
        if (!item) return;
        const circle = item.querySelector('.timeline-circle');
        if (circle) {
          const circleRect = circle.getBoundingClientRect();
          const circleCenterY = circleRect.top + circleRect.height / 2;

          // If the circle crosses above the 60% trigger point in the viewport
          if (circleCenterY <= triggerY) {
            newReachedIndices.push(idx);
            newActiveIndex = idx;
          }
        }
      });

      // Only update React state if the active index has changed (maximizes scroll performance)
      setActiveIndex(prev => {
        if (prev !== newActiveIndex) {
          setReachedIndices(newReachedIndices);
          return newActiveIndex;
        }
        return prev;
      });
    };

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    // Initial evaluation
    handleScroll();

    // Timeout fallback to ensure bounds calculation is correct after full page rendering
    const timer = setTimeout(handleScroll, 150);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      clearTimeout(timer);
    };
  }, [journeySteps.length]);

  return (
    <section
      id="journey"
      ref={sectionRef}
      className="journey-section"
    >
      <div className="container">

        {/* Section Header */}
        <div className="section-header reveal-on-scroll">
          <span className="section-label">02 / MY JOURNEY</span>
          <h2 className="section-title">MY JOURNEY</h2>
          <div className="section-divider" aria-hidden="true">
            <div className="section-divider-coral" />
          </div>
        </div>

        {/* Timeline Content Wrapper (Left-aligned timeline, wide cards) */}
        <div className="journey-content-wrapper">
          <div className="timeline-wrapper">

            {/* Double-layered vertical progress track */}
            <div className="timeline-track-container" ref={trackRef}>
              <div className="timeline-track" />
              <div className="timeline-progress" />
              <div className="timeline-start-dot" />
              <div className="timeline-end-indicator">
                <svg viewBox="0 0 24 24" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </div>

            {/* Cards List */}
            <div className="timeline-items-list">
              {journeySteps.map((evt, idx) => {
                const isReached = reachedIndices.includes(idx);
                const isActive = activeIndex === idx;
                const isInternship = evt.id === 'internship';

                return (
                  <div
                    key={evt.id}
                    ref={el => itemRefs.current[idx] = el}
                    className={`timeline-item ${isActive ? 'active' : ''}`}
                  >
                    {/* Circle Milestone Node */}
                    <div className={`timeline-circle ${isReached ? 'reached' : ''} ${isActive ? 'active' : ''}`} />

                    {/* Editorial Card */}
                    <div className={`timeline-card ${isActive ? 'active' : ''} ${isInternship ? 'is-internship' : ''}`}>

                      {/* Meta row */}
                      <div className="timeline-card-meta-row">
                        <span className="timeline-card-metadata">{evt.metadata}</span>
                        <span className="timeline-card-year">{evt.year}</span>
                      </div>

                      {/* Title */}
                      <h3 className="timeline-card-title">{evt.title}</h3>

                      {/* Description */}
                      <p className="timeline-card-description">{evt.description}</p>

                      {/* View Certificate Button (Preserved for internship card) */}
                      {isInternship && evt.certificateUrl && (
                        <a
                          href={evt.certificateUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="timeline-cert-btn"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '12px', height: '12px' }}>
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="16" y1="13" x2="8" y2="13" />
                            <line x1="16" y1="17" x2="8" y2="17" />
                          </svg>
                          VIEW CERTIFICATE
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

// Double-safe Namespace Registries
window.Portfolio = window.Portfolio || {};
window.PortfolioComponents = window.PortfolioComponents || {};

window.Portfolio.Experience = Experience;
window.PortfolioComponents.Experience = Experience;
