// src/components/ProjectModal.jsx
const { useEffect, useRef } = React;
const { motion, AnimatePresence } = window.PortfolioUtils;
const { prefersReducedMotion } = window.PortfolioUtils;

const ProjectModal = ({ project, onClose, triggerRef }) => {
  const modalRef = useRef(null);
  const closeBtnRef = useRef(null);

  // Set focus on close button upon mounting
  useEffect(() => {
    if (closeBtnRef.current) {
      closeBtnRef.current.focus();
    }
  }, []);

  // Handle ESC key press and focus restoration on unmount
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      // Restore focus to the element that triggered the modal
      if (triggerRef && triggerRef.current) {
        triggerRef.current.focus();
      }
    };
  }, [onClose, triggerRef]);

  // Trap focus inside the modal
  useEffect(() => {
    if (!modalRef.current) return;

    const focusable = modalRef.current.querySelectorAll('a, button, [tabindex="0"]');
    if (focusable.length === 0) return;

    const firstEl = focusable[0];
    const lastEl = focusable[focusable.length - 1];

    const handleFocusTrap = (e) => {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey) {
        if (document.activeElement === firstEl) {
          lastEl.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastEl) {
          firstEl.focus();
          e.preventDefault();
        }
      }
    };

    modalRef.current.addEventListener('keydown', handleFocusTrap);
    return () => {
      modalRef.current?.removeEventListener('keydown', handleFocusTrap);
    };
  }, []);

  // Prevent background scroll while open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    window.lenis?.stop();
    return () => {
      document.body.style.overflow = '';
      window.lenis?.start();
    };
  }, []);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const renderModalImage = () => {
    if (project.heroImage) {
      return (
        <div style={{ border: '2px solid #171717', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: 'var(--spacing-md)' }}>
          <img 
            src={project.heroImage} 
            alt={`${project.title} detailed screenshot`} 
            style={{
              width: '100%',
              maxHeight: '340px',
              objectFit: 'cover',
              display: 'block'
            }}
          />
        </div>
      );
    }
    
    return (
      <div 
        style={{
          width: '100%',
          height: '200px',
          borderRadius: 'var(--radius-md)',
          background: 'linear-gradient(135deg, #171717 0%, #333333 100%)',
          color: 'var(--color-accent-blue)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          border: '2px solid #171717',
          marginBottom: 'var(--spacing-md)'
        }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '48px', height: '48px' }}>
          {project.id === 'zion-racing' ? (
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          ) : (
            <rect x="5" y="2" width="14" height="20" rx="2" />
          )}
        </svg>
      </div>
    );
  };

  return (
    <div 
      className="modal-overlay"
      onClick={handleOverlayClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        backgroundColor: 'rgba(23, 23, 23, 0.40)',
        backdropFilter: prefersReducedMotion ? 'none' : 'blur(12px)',
        WebkitBackdropFilter: prefersReducedMotion ? 'none' : 'blur(12px)',
        zIndex: 2000,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px'
      }}
    >
      <motion.div 
        ref={modalRef}
        className="modal-container"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 15 }}
        animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
        exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        style={{
          width: '100%',
          maxWidth: '720px',
          maxHeight: '90vh',
          backgroundColor: '#FFFDF9',
          border: '2px solid #171717',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-brutal-lg)',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}
      >
        {/* Header bar / Close */}
        <div 
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            padding: '24px 24px 16px 24px',
            borderBottom: '2px solid #171717'
          }}
        >
          <div>
            <span style={{ fontSize: '0.62rem', fontWeight: '800', letterSpacing: '0.08em', color: 'var(--color-accent-coral)' }}>PROJECT PROFILE</span>
            <h2 id="modal-title" style={{ fontFamily: 'var(--font-headings)', fontSize: '1.6rem', fontWeight: '900', color: 'var(--color-text-primary)', margin: 0 }}>
              {project.title}
            </h2>
          </div>
          
          <button 
            ref={closeBtnRef}
            onClick={onClose}
            aria-label="Close Project Modal"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.45)',
              border: '2px solid #171717',
              boxShadow: 'var(--shadow-brutal-sm)',
              color: '#171717',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer'
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }}>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Modal Scroll Content */}
        <div id="modal-desc" style={{ padding: '24px', overflowY: 'auto' }}>
          {renderModalImage()}

          {/* Section: Purpose */}
          <div style={{ marginBottom: 'var(--spacing-md)' }}>
            <h4 style={{ fontSize: '0.72rem', fontWeight: '800', color: 'var(--color-accent-coral)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>
              Project Purpose
            </h4>
            <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', lineHeight: '1.6', margin: 0 }}>
              {project.purpose}
            </p>
          </div>

          {/* Section: Why Built (conditional) */}
          {project.whyBuilt && (
            <div style={{ marginBottom: 'var(--spacing-md)' }}>
              <h4 style={{ fontSize: '0.72rem', fontWeight: '800', color: 'var(--color-accent-coral)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>
                Why I Built It
              </h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', lineHeight: '1.6', margin: 0 }}>
                {project.whyBuilt}
              </p>
            </div>
          )}

          {/* Section: Key Features */}
          <div style={{ marginBottom: 'var(--spacing-md)' }}>
            <h4 style={{ fontSize: '0.72rem', fontWeight: '800', color: 'var(--color-accent-coral)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>
              Key Features
            </h4>
            <ul style={{ paddingLeft: '16px', listStyleType: 'disc', color: 'var(--color-text-secondary)' }}>
              {(project.keyFeatures || []).map((feat, idx) => (
                <li key={idx} style={{ fontSize: '0.88rem', marginBottom: '6px', lineHeight: '1.4' }}>
                  {feat}
                </li>
              ))}
            </ul>
          </div>

          {/* Section: Technologies */}
          <div style={{ marginBottom: 'var(--spacing-lg)' }}>
            <h4 style={{ fontSize: '0.72rem', fontWeight: '800', color: 'var(--color-accent-coral)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>
              Technology Stack
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {(project.technologies || []).map(tech => (
                <span 
                  key={tech}
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: '700',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'rgba(23, 23, 23, 0.05)',
                    border: '1.5px solid #171717',
                    color: '#171717'
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div 
          style={{
            padding: '16px 24px',
            borderTop: '2px solid #171717',
            display: 'flex',
            gap: 'var(--spacing-md)',
            justifyContent: 'flex-end',
            backgroundColor: 'rgba(255, 255, 255, 0.25)'
          }}
        >
          {project.githubUrl && (
            <a 
              href={project.githubUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-secondary"
              style={{ fontSize: '0.78rem', padding: '10px 18px' }}
            >
              GITHUB REPO
            </a>
          )}
          {project.liveUrl && (
            <a 
              href={project.liveUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-primary"
              style={{ fontSize: '0.78rem', padding: '10px 18px' }}
            >
              LIVE DEMO
            </a>
          )}
        </div>
      </motion.div>
    </div>
  );
};

// Double-safe Namespace Registries
window.Portfolio = window.Portfolio || {};
window.PortfolioComponents = window.PortfolioComponents || {};

window.Portfolio.ProjectModal = ProjectModal;
window.PortfolioComponents.ProjectModal = ProjectModal;

