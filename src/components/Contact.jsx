// src/components/Contact.jsx
const { useState, useEffect, useRef, useCallback } = React;
const { isTouchDevice, prefersReducedMotion } = window.PortfolioUtils || { isTouchDevice: false, prefersReducedMotion: false };

const Contact = () => {
  const data = (window.PortfolioData && window.PortfolioData.config) || {};
  const email = data.email || 'naveengrajan@gmail.com';
  const location = data.location || 'Tamil Nadu, India';

  // State for email copied toast notification and CTA hover reaction
  const [copiedToast, setCopiedToast] = useState(false);
  const [isCtaHovered, setIsCtaHovered] = useState(false);
  const toastTimeoutRef = useRef(null);

  // References for direct DOM manipulation (high performance 3D tilt, character cursor tracking & magnetic physics without React re-renders)
  const cardRef = useRef(null);
  const ctaRef = useRef(null);
  const charRef = useRef(null);
  const cardRafRef = useRef(null);
  const ctaRafRef = useRef(null);
  const charRafRef = useRef(null);

  // Section entry detection for staggered letter reveals
  const [isRevealed, setIsRevealed] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsRevealed(true);
            if (sectionRef.current) {
              sectionRef.current.classList.add('revealed');
            }
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // 3D Card Tilt & Character Cursor Response on pointer move
  const handleCardMouseMove = useCallback((e) => {
    if (isTouchDevice || prefersReducedMotion || !cardRef.current) return;

    if (cardRafRef.current) cancelAnimationFrame(cardRafRef.current);

    cardRafRef.current = requestAnimationFrame(() => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Subtle physical rotation clamped to ±4deg X and ±5deg Y
      const deltaX = (x - centerX) / centerX;
      const deltaY = (y - centerY) / centerY;
      const rotX = Math.max(-4, Math.min(4, -deltaY * 4));
      const rotY = Math.max(-5, Math.min(5, deltaX * 5));

      cardRef.current.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateZ(0)`;

      // Subtle cursor tracking for the character (max 8-12px translation and slight lean)
      if (charRef.current) {
        const charTransX = Math.max(-10, Math.min(10, deltaX * 8));
        const charTransY = Math.max(-8, Math.min(8, deltaY * 6));
        const charRot = Math.max(-2, Math.min(2, deltaX * 1.8));
        charRef.current.style.transform = `translate3d(${charTransX.toFixed(1)}px, ${charTransY.toFixed(1)}px, 0) rotate(${charRot.toFixed(1)}deg)`;
      }
    });
  }, []);

  const handleCardMouseLeave = useCallback(() => {
    if (isTouchDevice || prefersReducedMotion || !cardRef.current) return;
    if (cardRafRef.current) cancelAnimationFrame(cardRafRef.current);

    cardRafRef.current = requestAnimationFrame(() => {
      if (cardRef.current) {
        cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)';
      }
      if (charRef.current) {
        charRef.current.style.transform = 'translate3d(0px, 0px, 0) rotate(0deg)';
      }
    });
  }, []);

  // Magnetic CTA button physics
  const handleCtaMouseMove = useCallback((e) => {
    if (isTouchDevice || prefersReducedMotion || !ctaRef.current) return;

    if (ctaRafRef.current) cancelAnimationFrame(ctaRafRef.current);

    ctaRafRef.current = requestAnimationFrame(() => {
      if (!ctaRef.current) return;
      const rect = ctaRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Subtle pull (max ±8px X, ±6px Y)
      const transX = Math.max(-8, Math.min(8, (x - centerX) * 0.22));
      const transY = Math.max(-6, Math.min(6, (y - centerY) * 0.22));

      ctaRef.current.style.transform = `translate3d(${transX.toFixed(1)}px, ${transY.toFixed(1)}px, 35px)`;
    });
  }, []);

  const handleCtaMouseLeave = useCallback(() => {
    setIsCtaHovered(false);
    if (isTouchDevice || prefersReducedMotion || !ctaRef.current) return;
    if (ctaRafRef.current) cancelAnimationFrame(ctaRafRef.current);

    ctaRafRef.current = requestAnimationFrame(() => {
      if (ctaRef.current) {
        ctaRef.current.style.transform = 'translate3d(0px, 0px, 35px)';
      }
    });
  }, []);

  // Copy email to clipboard micro-interaction
  const handleCopyEmail = (e) => {
    if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(email)
        .then(() => {
          setCopiedToast(true);
          if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
          toastTimeoutRef.current = setTimeout(() => {
            setCopiedToast(false);
          }, 2200);
        })
        .catch(() => {
          window.location.href = `mailto:${email}`;
        });
    } else {
      window.location.href = `mailto:${email}`;
    }
  };

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
      if (cardRafRef.current) cancelAnimationFrame(cardRafRef.current);
      if (ctaRafRef.current) cancelAnimationFrame(ctaRafRef.current);
      if (charRafRef.current) cancelAnimationFrame(charRafRef.current);
    };
  }, []);

  // Letters of the heading "CONTACT"
  const headingLetters = ['C', 'O', 'N', 'T', 'A', 'C', 'T'];

  return (
    <section
      id="contact"
      ref={sectionRef}
      className={`contact-section reveal-on-scroll ${isRevealed ? 'revealed' : ''}`}
      aria-label="Contact Section"
    >
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>

        {/* Standard Section Header */}
        <div className="section-header reveal-on-scroll">
          {/* Subtle Top-Right Dot Matrix */}
          <div className="contact-dot-matrix-top" aria-hidden="true">
            {Array.from({ length: 20 }).map((_, i) => (
              <span key={i} />
            ))}
          </div>

          <span className="section-label">05 / CONTACT</span>

          <h2 className="section-title contact-heading" aria-label="CONTACT">
            {headingLetters.map((letter, index) => (
              <span
                key={index}
                className="contact-letter"
                style={{
                  animationDelay: `${index * 80}ms`,
                  opacity: isRevealed || prefersReducedMotion ? 1 : 0,
                  transform: isRevealed || prefersReducedMotion ? 'translateY(0)' : 'translateY(36px)',
                  transition: prefersReducedMotion ? 'none' : `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index * 70}ms, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index * 70}ms, color 0.18s ease`
                }}
              >
                {letter}
              </span>
            ))}
          </h2>

          {/* Thin horizontal divider with animated coral segment */}
          <div className="section-divider" aria-hidden="true">
            <div className="section-divider-coral" />
          </div>
        </div>

        {/* 2. TWO-COLUMN MAIN CONTACT EXPERIENCE */}
        <div className="contact-layout-grid">

          {/* LEFT SIDE: Editorial Headline & Copy */}
          <div className="contact-left-content">
            {/* 3x3 Subtle Coral Dot Matrix with sequential entrance */}
            <div className="contact-3x3-grid" aria-hidden="true" title="Ready to build">
              {Array.from({ length: 9 }).map((_, i) => (
                <span
                  key={i}
                  className="contact-dot"
                  style={{
                    animationDelay: `${(i % 3) * 0.2 + Math.floor(i / 3) * 0.15}s`
                  }}
                />
              ))}
            </div>

            <h3 className="contact-headline">
              HAVE AN IDEA?<br />
              LET'S <span className="contact-highlight-coral">BUILD</span> IT.
            </h3>

            {/* Subtle coral accent line */}
            <div className="contact-headline-rule" aria-hidden="true" />

            <p className="contact-desc">
              Have a project, collaboration idea, academic concept, or just want to say hello? Feel free to reach out.
            </p>
          </div>

          {/* RIGHT SIDE: Interactive 3D Contact Card + Integrated 3D Character */}
          <div className="contact-card-stage-container">
            <div className="contact-card-perspective-wrap">
              <div
                ref={cardRef}
                className="contact-interactive-card"
                onMouseMove={handleCardMouseMove}
                onMouseLeave={handleCardMouseLeave}
              >
                {/* Flight Path & Dashed Orbit Trajectory */}
                <div className="contact-card-flight-path" aria-hidden="true">
                  <svg
                    viewBox="0 0 460 140"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="flight-path-svg"
                  >
                    <path
                      d="M 30 110 C 120 25, 180 35, 230 45 C 280 55, 340 25, 430 95"
                      stroke="#171717"
                      strokeWidth="1.5"
                      strokeDasharray="6 6"
                      opacity="0.22"
                      fill="none"
                    />
                    <circle cx="80" cy="75" r="3" fill="#FF6255" opacity="0.65" />
                    <circle cx="380" cy="65" r="3" fill="#FF6255" opacity="0.65" />
                    <path d="M 395 60 L 405 60 M 400 55 L 400 65" stroke="#FF6255" strokeWidth="1.2" opacity="0.6" />
                  </svg>

                  {/* Circular Paper Plane Badge at Center Top */}
                  <div className="contact-plane-badge-center">
                    <svg
                      viewBox="0 0 24 24"
                      width="20"
                      height="20"
                      fill="none"
                      stroke="#FFFFFF"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" fill="rgba(255,255,255,0.2)" />
                    </svg>
                  </div>
                </div>

                {/* Card Header & Title */}
                <span className="contact-card-label">READY TO START?</span>
                <h4 className="contact-card-title">LET'S START A CONVERSATION</h4>

                {/* Primary Magnetic CTA Button */}
                <a
                  ref={ctaRef}
                  href={`mailto:${email}?subject=Let's%20Connect%20%E2%80%94%20Portfolio`}
                  className="magnetic-cta-btn"
                  onMouseMove={handleCtaMouseMove}
                  onMouseLeave={handleCtaMouseLeave}
                  onMouseEnter={() => setIsCtaHovered(true)}
                  onFocus={() => setIsCtaHovered(true)}
                  onBlur={() => setIsCtaHovered(false)}
                  aria-label={`Send email to ${email}`}
                >
                  LET'S CONNECT
                  <span className="cta-arrow" aria-hidden="true">→</span>
                </a>

              </div>
            </div>

            {/* INTEGRATED 3D CHARACTER COMPONENT (pointing to CTA) */}
            <div
              ref={charRef}
              className={`contact-character-wrap ${isRevealed ? 'revealed' : ''} ${isCtaHovered ? 'cta-active' : ''}`}
              aria-hidden="true"
            >
              {/* Reactive Speech Bubble */}
              <div className={`contact-speech-bubble ${isCtaHovered ? 'visible' : ''}`}>
                <span className="speech-text">
                  LET'S <span className="speech-coral">BUILD</span> SOMETHING!
                </span>
                <div className="speech-bubble-tail" />
              </div>

              {/* Character PNG Asset */}
              <img
                src="assets/contact-character.png"
                alt="3D illustrated character pointing toward the contact button"
                className="contact-character-img"
                loading="eager"
              />
            </div>

          </div>

        </div>

        {/* 3. CONTACT INFORMATION STRIP */}
        <div className="contact-info-strip">

          {/* Email Block with Copy Feedback */}
          <div className="contact-info-block email-block">
            <div className="contact-info-icon-box" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="var(--color-accent-coral)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>

            <div className="contact-info-details">
              <span className="contact-info-tag">EMAIL ME DIRECTLY</span>
              <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
                <button
                  type="button"
                  className="contact-email-btn"
                  onClick={handleCopyEmail}
                  title="Click to copy email address"
                  aria-label={`Copy email address ${email}`}
                >
                  {email}
                  <svg
                    className="contact-copy-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                </button>

                {/* Toast message upon copying */}
                {copiedToast && (
                  <div className="contact-toast" role="status">
                    EMAIL COPIED!
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Location Block with Availability status badge */}
          <div className="contact-info-block location-block">
            <div className="contact-info-icon-box" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="var(--color-accent-coral)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>

            <div className="contact-info-details">
              <span className="contact-info-tag">LOCATION</span>
              <div className="contact-location-val">
                <span>{location}</span>
              </div>
            </div>
          </div>

          {/* Social Links Circular Badges with Tooltips */}
          <div className="contact-social-group" aria-label="Social Profiles">

            {/* GitHub Badge */}
            {data.github && (
              <div className="contact-social-badge-wrap">
                <a
                  href={data.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-social-badge"
                  aria-label="Visit GitHub Profile"
                >
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                  </svg>
                </a>
                <span className="contact-tooltip">GitHub</span>
              </div>
            )}

            {/* LinkedIn Badge */}
            {data.linkedin && (
              <div className="contact-social-badge-wrap">
                <a
                  href={data.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-social-badge"
                  aria-label="Visit LinkedIn Profile"
                >
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect x="2" y="9" width="4" height="12" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </a>
                <span className="contact-tooltip">LinkedIn</span>
              </div>
            )}

            {/* Instagram Badge */}
            <div className="contact-social-badge-wrap">
              <a
                href={data.instagram || "https://instagram.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-social-badge"
                aria-label="Visit Instagram Profile"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <span className="contact-tooltip">Instagram</span>
            </div>

            {/* Email Badge */}
            <div className="contact-social-badge-wrap">
              <a
                href={`mailto:${email}`}
                className="contact-social-badge"
                aria-label="Send direct email"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </a>
              <span className="contact-tooltip">Email</span>
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

window.Portfolio.Contact = Contact;
window.PortfolioComponents.Contact = Contact;
