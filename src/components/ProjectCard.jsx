// src/components/ProjectCard.jsx — Reusable 3D Flip Project Card Component
const { useState, useRef } = React;

const ProjectCard = ({ project, wasDraggingRef }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  // Toggle flip on card click unless a drag/swipe just occurred
  const handleCardClick = (e) => {
    if (e.target.closest('a') || e.target.closest('button')) {
      return;
    }
    if (wasDraggingRef && wasDraggingRef.current) {
      return;
    }
    setIsFlipped(prev => !prev);
  };

  // Keyboard accessibility: Toggle flip on Enter or Space
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      // If pressing on an anchor or button inside, allow its default native action
      if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') {
        return;
      }
      e.preventDefault();
      setIsFlipped(prev => !prev);
    }
  };

  // Independent link click handler: Opens URL and prevents card flip
  const handleLinkClick = (e) => {
    e.stopPropagation();
    if (project.githubUrl) {
      window.open(project.githubUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // Flip back button click handler: Flips card back to front
  const handleFlipBackClick = (e) => {
    e.stopPropagation();
    setIsFlipped(false);
  };

  return (
    <div
      className="project-card"
      tabIndex={0}
      role="region"
      aria-label={`${project.title} project card. Press Enter or Space to ${isFlipped ? 'flip back to overview' : 'view detailed project specifications'}.`}
      aria-expanded={isFlipped}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
    >
      <div className={`project-card-inner ${isFlipped ? 'is-flipped' : ''}`}>
        
        {/* =========================================================
            FRONT FACE — EXACT VISUALLY IDENTICAL ORIGINAL DESIGN
            ========================================================= */}
        <div className="project-card-front">
          {/* Image / Fallback Visual */}
          <div className="project-card-image-wrap">
            {project.heroImage ? (
              <img
                src={project.heroImage}
                alt={project.title}
                className="project-image"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              <div className="project-image-fallback-svg">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
              </div>
            )}

            {/* Project Number badge over top-left of image */}
            <div className="project-number-badge">
              {project.number}
            </div>
          </div>

          {/* Front Content Section */}
          <div className="project-card-front-content">
            <div>
              <span className="project-category-tag">
                {project.category}
              </span>

              <h3 className="project-card-title">
                {project.title}
              </h3>

              <p className="project-desc-clamp">
                {project.description}
              </p>
            </div>

            <div className="project-card-front-footer">
              {/* Tech tags */}
              <div className="project-tech-tags">
                {project.technologies && project.technologies.map(tech => (
                  <span key={tech} className="project-tech-pill">
                    {tech}
                  </span>
                ))}
              </div>

              {/* View Project link CTA */}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-view-link"
                  onClick={handleLinkClick}
                  aria-label={`View ${project.title} on GitHub`}
                >
                  VIEW PROJECT <span className="arrow" aria-hidden="true">→</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* =========================================================
            BACK FACE — DYNAMIC PROJECT-SPECIFIC DETAILS
            ========================================================= */}
        <div className="project-card-back">
          <div className="project-back-scrollable">
            {/* Header row */}
            <div className="project-back-header">
              <span className="project-back-label">PROJECT DETAILS</span>
              <span className="project-back-number">{project.number}</span>
            </div>

            <div className="project-back-divider" />

            {/* Project Title */}
            <h3 className="project-back-title">
              {project.title}
            </h3>

            {/* Project-specific Explanation */}
            <p className="project-back-description">
              {project.details || project.description}
            </p>

            {/* Key Features */}
            {project.features && project.features.length > 0 && (
              <div className="project-back-section">
                <h4 className="project-back-section-title">KEY FEATURES</h4>
                <ul className="project-back-features-list">
                  {project.features.map((feat, idx) => (
                    <li key={idx}>
                      <span className="bullet" aria-hidden="true">•</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tech Stack */}
            <div className="project-back-section">
              <h4 className="project-back-section-title">TECH STACK</h4>
              <div className="project-tech-tags">
                {project.technologies && project.technologies.map(tech => (
                  <span key={tech} className="project-tech-pill">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Role */}
            {project.role && (
              <div className="project-back-section">
                <h4 className="project-back-section-title">ROLE</h4>
                <p className="project-back-role-text">{project.role}</p>
              </div>
            )}
          </div>

          {/* Back Actions Footer */}
          <div className="project-back-footer">
            {project.githubUrl ? (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="project-view-link"
                onClick={handleLinkClick}
                aria-label={`View ${project.title} on GitHub`}
              >
                VIEW PROJECT <span className="arrow" aria-hidden="true">→</span>
              </a>
            ) : (
              <div />
            )}

            <button
              type="button"
              className="project-flip-back-btn"
              onClick={handleFlipBackClick}
              aria-label="Flip back to overview"
            >
              ↻ FLIP BACK
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

// Double-safe Namespace Registries
window.Portfolio = window.Portfolio || {};
window.PortfolioComponents = window.PortfolioComponents || {};

window.Portfolio.ProjectCard = ProjectCard;
window.PortfolioComponents.ProjectCard = ProjectCard;
