// src/components/Navbar.jsx — Light Neo-Brutalist floating navigation
const { useState, useEffect, useRef } = React;
const { prefersReducedMotion } = window.PortfolioUtils || { prefersReducedMotion: false };

const Navbar = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [hoveredSection, setHoveredSection] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const progressBarRef = useRef(null);

  useEffect(() => {
    const resize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', resize, { passive: true });
    return () => window.removeEventListener('resize', resize);
  }, []);

  useEffect(() => {
    const sections = ['hero', 'about', 'journey', 'skills', 'projects', 'contact'];
    let ticking = false;

    const updateActiveSection = () => {
      const marker = window.scrollY + Math.min(window.innerHeight * 0.32, 280);
      let current = 'hero';

      sections.forEach(id => {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= marker) current = id;
      });

      if (window.scrollY < window.innerHeight * 0.4) {
        current = 'hero';
      }

      setActiveSection(prev => prev !== current ? current : prev);
      ticking = false;
    };

    const onScroll = () => {
      // Direct progress bar update without React re-renders
      if (!prefersReducedMotion && progressBarRef.current) {
        const total = document.documentElement.scrollHeight - window.innerHeight;
        const progress = total > 0 ? (window.scrollY / total) * 100 : 0;
        progressBarRef.current.style.width = `${progress}%`;
      }

      if (!ticking) {
        window.requestAnimationFrame(updateActiveSection);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    updateActiveSection();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const isMobile = windowWidth < 768;
  const navLinks = [
    { label: 'Home', href: '#hero', id: 'hero' },
    { label: 'About', href: '#about', id: 'about' },
    { label: 'Experience', href: '#journey', id: 'journey' },
    { label: 'Skills', href: '#skills', id: 'skills' },
    { label: 'Projects', href: '#projects', id: 'projects' },
    { label: 'Contact', href: '#contact', id: 'contact' }
  ];

  const handleLinkClick = (e, href) => {
    e.preventDefault();
    const target = document.getElementById(href.slice(1));
    if (target) {
      if (window.lenis) {
        window.lenis.scrollTo(target, { offset: -20, duration: 1.25 });
      } else {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      window.history.pushState(null, '', href);
    }
  };

  return (
    <>
      {!prefersReducedMotion && (
        <div id="scroll-progress-bar" ref={progressBarRef} style={{ width: '0%' }} />
      )}

      <a
        className="neo-nav-logo"
        href="#hero"
        onClick={(e) => handleLinkClick(e, '#hero')}
        aria-label="Naveen Rajan home"
      >
        NR.
      </a>

      <nav className={`neo-navbar ${isMobile ? 'neo-navbar-mobile' : ''}`} aria-label="Primary navigation">
        <div className="neo-navbar-links">
          {navLinks.map(link => {
            const active = (hoveredSection || activeSection) === link.id;
            return (
              <a
                key={link.id}
                href={link.href}
                className={`neo-nav-link ${active ? 'neo-nav-active' : ''}`}
                onClick={(e) => handleLinkClick(e, link.href)}
                onMouseEnter={() => setHoveredSection(link.id)}
                onMouseLeave={() => setHoveredSection(null)}
              >
                {link.label}
                {active && <span className="neo-nav-dot" aria-hidden="true" />}
              </a>
            );
          })}
        </div>
      </nav>
    </>
  );
};

window.Portfolio = window.Portfolio || {};
window.PortfolioComponents = window.PortfolioComponents || {};
window.Portfolio.Navbar = Navbar;
window.PortfolioComponents.Navbar = Navbar;
