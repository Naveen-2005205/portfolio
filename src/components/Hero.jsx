// src/components/Hero.jsx — Light Neo-Brutalist 3D Cartoon Developer Hero
const { useState, useEffect, useRef } = React;

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const heroRef = useRef(null);
  const rafId = useRef(null);
  const targetMouse = useRef({ x: 0, y: 0 });
  const currentMouse = useRef({ x: 0, y: 0 });
  const isMoving = useRef(false);

  const config = window.PortfolioData?.config || {};

  useEffect(() => {
    // Staggered entrance trigger
    const loadTimer = setTimeout(() => setIsLoaded(true), 80);

    // Check device capabilities
    const isTouch =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia("(pointer: coarse)").matches;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let isReducedMotion = motionQuery.matches;

    const handleMotionChange = (e) => {
      isReducedMotion = e.matches;
      if (isReducedMotion && heroRef.current) {
        heroRef.current.style.setProperty("--mouse-px", "0");
        heroRef.current.style.setProperty("--mouse-py", "0");
      }
    };

    if (motionQuery.addEventListener) {
      motionQuery.addEventListener("change", handleMotionChange);
    }

    // High performance 60fps damped parallax loop via CSS variables (Zero React re-renders)
    const updateParallax = () => {
      if (!isMoving.current) return;

      const ease = 0.075;
      const dx = targetMouse.current.x - currentMouse.current.x;
      const dy = targetMouse.current.y - currentMouse.current.y;

      currentMouse.current.x += dx * ease;
      currentMouse.current.y += dy * ease;

      if (heroRef.current) {
        heroRef.current.style.setProperty("--mouse-px", currentMouse.current.x.toFixed(4));
        heroRef.current.style.setProperty("--mouse-py", currentMouse.current.y.toFixed(4));
      }

      // Settle down if movement is minimal to conserve power
      if (Math.abs(dx) < 0.0005 && Math.abs(dy) < 0.0005) {
        currentMouse.current.x = targetMouse.current.x;
        currentMouse.current.y = targetMouse.current.y;
        if (heroRef.current) {
          heroRef.current.style.setProperty("--mouse-px", targetMouse.current.x.toFixed(4));
          heroRef.current.style.setProperty("--mouse-py", targetMouse.current.y.toFixed(4));
        }
        isMoving.current = false;
        rafId.current = null;
        return;
      }

      rafId.current = requestAnimationFrame(updateParallax);
    };

    const startParallaxLoop = () => {
      if (!isMoving.current) {
        isMoving.current = true;
        if (!rafId.current) {
          rafId.current = requestAnimationFrame(updateParallax);
        }
      }
    };

    const onMouseMove = (event) => {
      if (isTouch || isReducedMotion) return;

      // Normalized coordinates from -1.0 to 1.0
      targetMouse.current.x = Math.max(-1, Math.min(1, (event.clientX / window.innerWidth - 0.5) * 2));
      targetMouse.current.y = Math.max(-1, Math.min(1, (event.clientY / window.innerHeight - 0.5) * 2));

      startParallaxLoop();
    };

    const onMouseLeave = () => {
      targetMouse.current.x = 0;
      targetMouse.current.y = 0;
      startParallaxLoop();
    };

    if (!isTouch && !isReducedMotion) {
      window.addEventListener("mousemove", onMouseMove, { passive: true });
      document.addEventListener("mouseleave", onMouseLeave, { passive: true });
    }

    return () => {
      clearTimeout(loadTimer);
      if (motionQuery.removeEventListener) {
        motionQuery.removeEventListener("change", handleMotionChange);
      }
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  const scrollToProjects = (event) => {
    event.preventDefault();
    const target = document.getElementById("projects");
    if (target) {
      if (window.lenis) {
        window.lenis.scrollTo(target, { offset: -20, duration: 1.15 });
      } else {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  };

  return (
    <section
      id="hero"
      ref={heroRef}
      className={`neo-hero ${isLoaded ? "neo-hero-loaded" : ""}`}
    >
      {/* Background grid with subtle parallax */}
      <div className="neo-hero-grid" aria-hidden="true" />

      {/* Decorative dot grid at bottom left */}
      <div className="neo-dot-grid" aria-hidden="true">
        {Array.from({ length: 9 }).map((_, i) => (
          <i key={i} />
        ))}
      </div>

      <div className="container neo-hero-container">
        {/* Left Headline */}
        <h1 className="neo-hero-heading">
          <span className="neo-title-top">HI, I'M</span>
          <span className="neo-title-name">NAVEEN</span>
        </h1>

        {/* Left Copy & CTA */}
        <div className="neo-hero-copy">
          <p className="neo-description">
            I build practical digital systems that connect software, hardware and real-world problems.
          </p>

          <div className="neo-actions">
            <a
              href="#projects"
              onClick={scrollToProjects}
              className="neo-btn neo-btn-primary"
              aria-label="View Selected Work"
            >
              VIEW SELECTED WORK
              <span aria-hidden="true">→</span>
            </a>

            <a
              href={config.resumePath || "assets/Naveen resume.pdf"}
              className="neo-btn neo-btn-secondary"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Download Resume (PDF)"
            >
              DOWNLOAD RESUME
              <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>

        {/* 3D Character Stage & Orb Backdrop */}
        <div className="neo-character-stage hero-character">
          <div className="neo-character-halo" aria-hidden="true" />

          <img
            className="neo-character"
            src="assets/hero-character.png"
            alt="Stylized 3D cartoon developer character with a friendly smile and clear glasses"
            width="460"
            height="460"
            decoding="async"
            fetchpriority="high"
            draggable="false"
          />

          <div className="neo-character-shadow" aria-hidden="true" />
        </div>

        {/* Yellow Circle at Bottom Right */}
        <div className="neo-yellow-orb hero-circle" aria-hidden="true" />

        {/* Curved Dashed Arrow from Build Mode to Open To Circle */}
        <div className="neo-curved-arrow" aria-hidden="true">
          <svg viewBox="0 0 160 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M 5 62 Q 65 -12, 145 28"
              stroke="#171717"
              strokeWidth="2.5"
              strokeDasharray="6 5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 132 16 L 148 29 L 132 38"
              stroke="#171717"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </div>

        {/* Floating / Responsive Status Cards Group */}
        <div className="neo-cards-group">
          {/* Card 1: Location (Top Right) */}
          <div
            className="neo-status-card neo-card-available available-badge"
            tabIndex="0"
            role="region"
            aria-label="Location"
          >
            <span className="neo-status-label coral">LOCATION</span>
            <strong>
              <i className="neo-status-dot coral-dot" aria-hidden="true" />
              PUDUKKOTTAI
            </strong>
          </div>

          {/* Card 2: Current Focus (Middle Right) */}
          <div
            className="neo-status-card neo-card-focus focus-badge"
            tabIndex="0"
            role="region"
            aria-label="Current Technical Focus"
          >
            <span className="neo-status-label blue">CURRENT FOCUS</span>
            <strong>Python • Django • React • REST APIs</strong>
          </div>

          {/* Card 3: Build Mode (Bottom Center) */}
          <div
            className="neo-status-card neo-card-build build-mode-badge"
            tabIndex="0"
            role="region"
            aria-label="Build Mode Status"
          >
            <span className="neo-status-label yellow">BUILD MODE</span>
            <strong>
              <i className="neo-status-dot yellow-dot" aria-hidden="true" />
              ACTIVE
            </strong>
          </div>

          {/* Card 4: Open To (Bottom Right on Yellow Circle) */}
          <div
            className="neo-status-card neo-card-open open-to-badge"
            tabIndex="0"
            role="region"
            aria-label="Open Opportunities Status"
          >
            <span className="neo-status-label green">OPEN TO</span>
            <strong>
              <i className="neo-status-dot green-dot" aria-hidden="true" />
              NEW OPPORTUNITIES
            </strong>
          </div>
        </div>
      </div>
    </section>
  );
};

// Double-safe Namespace Registries
window.Portfolio = window.Portfolio || {};
window.PortfolioComponents = window.PortfolioComponents || {};
window.Portfolio.Hero = Hero;
window.PortfolioComponents.Hero = Hero;
