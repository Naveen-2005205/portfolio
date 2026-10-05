// src/components/Projects.jsx
const { useState, useRef, useEffect } = React;
const { prefersReducedMotion } = window.PortfolioUtils || { prefersReducedMotion: false };

const Projects = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const viewportRef = useRef(null);
  const dragStartRef = useRef(0);
  const dragOffsetRef = useRef(0);
  const isDraggingActive = useRef(false);
  const wasDraggingRef = useRef(false);
  const lastWheelTimeRef = useRef(0);

  // Retrieve reusable ProjectCard component from global namespace
  const ProjectCard = window.PortfolioComponents?.ProjectCard || window.Portfolio?.ProjectCard;

  // Retrieve projects from central data registry
  const projectsData = window.PortfolioData?.projects || [];

  // Monitor viewport resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getVisibleCardsCount = (width) => {
    if (width >= 1024) return 3;
    if (width >= 768) return 2;
    return 1;
  };

  const visibleCount = getVisibleCardsCount(windowWidth);
  const maxIndex = Math.max(0, projectsData.length - visibleCount);

  // Ensure currentIndex stays within bounds when resizing
  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [maxIndex, currentIndex]);

  // Drag and Swipe Handlers for carousel
  const handleDragStart = (clientX) => {
    isDraggingActive.current = true;
    setIsDragging(true);
    dragStartRef.current = clientX;
    dragOffsetRef.current = 0;
    setDragOffset(0);
  };

  const handleDragMove = (clientX) => {
    if (!isDraggingActive.current) return;
    const offset = clientX - dragStartRef.current;

    // Apply resistance at bounds
    let finalOffset = offset;
    if (currentIndex === 0 && offset > 0) {
      finalOffset = offset * 0.35;
    } else if (currentIndex === maxIndex && offset < 0) {
      finalOffset = offset * 0.35;
    }

    dragOffsetRef.current = finalOffset;
    setDragOffset(finalOffset);
  };

  const handleDragEnd = () => {
    if (!isDraggingActive.current) return;
    isDraggingActive.current = false;
    setIsDragging(false);

    const threshold = 60;
    const offset = dragOffsetRef.current;

    if (Math.abs(offset) > 10) {
      wasDraggingRef.current = true;
      setTimeout(() => {
        wasDraggingRef.current = false;
      }, 50);
    }

    if (offset < -threshold && currentIndex < maxIndex) {
      setCurrentIndex(prev => prev + 1);
    } else if (offset > threshold && currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }

    setDragOffset(0);
  };

  // Mouse Handlers
  const onMouseDown = (e) => {
    if (e.button !== 0) return; // only left click
    handleDragStart(e.clientX);
  };

  const onMouseMove = (e) => {
    handleDragMove(e.clientX);
  };

  const onMouseUp = () => {
    handleDragEnd();
  };

  const onMouseLeave = () => {
    handleDragEnd();
  };

  // Touch Handlers
  const onTouchStart = (e) => {
    handleDragStart(e.touches[0].clientX);
  };

  const onTouchMove = (e) => {
    handleDragMove(e.touches[0].clientX);
  };

  const onTouchEnd = () => {
    handleDragEnd();
  };

  // Keyboard navigation for carousel
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      if (currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
      }
    } else if (e.key === 'ArrowRight') {
      if (currentIndex < maxIndex) {
        setCurrentIndex(prev => prev + 1);
      }
    }
  };

  // Mouse wheel horizontal scrolling
  const handleWheel = (e) => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      e.preventDefault();
      const now = Date.now();
      if (now - lastWheelTimeRef.current < 400) return;

      if (e.deltaX > 15 && currentIndex < maxIndex) {
        setCurrentIndex(prev => prev + 1);
        lastWheelTimeRef.current = now;
      } else if (e.deltaX < -15 && currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
        lastWheelTimeRef.current = now;
      }
    }
  };

  return (
    <section
      id="projects"
      className="projects-section"
      style={{
        padding: 'var(--section-spacing-y) 0',
        backgroundColor: 'transparent',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div className="container" style={{ position: 'relative' }}>

        {/* Section Header */}
        <div className="section-header reveal-on-scroll">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              flexWrap: 'wrap',
              gap: '12px',
              width: '100%'
            }}
          >
            <div>
              <span className="section-label">04 / PROJECTS</span>
              <h2 className="section-title">PROJECTS</h2>
            </div>

            {/* Controls */}
            <div
              className="carousel-controls"
              style={{
                display: 'flex',
                gap: '12px',
                zIndex: 10,
                paddingBottom: '2px'
              }}
            >
              <button
                onClick={() => currentIndex > 0 && setCurrentIndex(prev => prev - 1)}
                disabled={currentIndex === 0}
                aria-label="Previous Project"
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  border: '2px solid #171717',
                  backgroundColor: '#FFFDF9',
                  color: '#171717',
                  opacity: currentIndex === 0 ? 0.4 : 1,
                  cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: currentIndex === 0 ? 'none' : '3px 4px 0 #171717',
                  transition: 'all 0.15s ease',
                  outline: 'none'
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px', height: '18px' }}>
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
              </button>
              <button
                onClick={() => currentIndex < maxIndex && setCurrentIndex(prev => prev + 1)}
                disabled={currentIndex === maxIndex}
                aria-label="Next Project"
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  border: '2px solid #171717',
                  backgroundColor: '#FFFDF9',
                  color: '#171717',
                  opacity: currentIndex === maxIndex ? 0.4 : 1,
                  cursor: currentIndex === maxIndex ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: currentIndex === maxIndex ? 'none' : '3px 4px 0 #171717',
                  transition: 'all 0.15s ease',
                  outline: 'none'
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px', height: '18px' }}>
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>
          </div>

          <div className="section-divider" aria-hidden="true">
            <div className="section-divider-coral" />
          </div>
        </div>

        {/* Carousel Viewport Container */}
        <div
          ref={viewportRef}
          className={`projects-viewport ${isDragging ? 'dragging' : ''}`}
          tabIndex={0}
          aria-label="Projects carousel navigation. Use left and right arrow keys to navigate."
          onKeyDown={handleKeyDown}
          onWheel={handleWheel}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseLeave}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div
            className="projects-track"
            style={{
              transform: `translate3d(calc(-${currentIndex} * (var(--card-width) + 20px) + ${dragOffset}px), 0, 0)`,
              transition: prefersReducedMotion ? 'none' : (isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)')
            }}
          >
            {projectsData.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                wasDraggingRef={wasDraggingRef}
              />
            ))}
          </div>
        </div>

        {/* Pagination Dots */}
        {maxIndex > 0 && (
          <div
            className="carousel-pagination"
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '12px'
            }}
          >
            {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: currentIndex === idx ? 'var(--color-accent-coral)' : '#D1D1D6',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'background-color 0.2s ease',
                  outline: 'none'
                }}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

// Double-safe Namespace Registries
window.Portfolio = window.Portfolio || {};
window.PortfolioComponents = window.PortfolioComponents || {};

window.Portfolio.Projects = Projects;
window.PortfolioComponents.Projects = Projects;
