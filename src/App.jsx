// src/App.jsx
const { useEffect, useState } = React;

const App = () => {
  const [loading, setLoading] = useState(true);

  // Retrieve registered components from global namespace
  const {
    Navbar,
    Hero,
    About,
    Marquee,
    Projects,
    Skills,
    Experience,
    Contact,
    CustomCursor,
    Footer
  } = window.PortfolioComponents;

  useEffect(() => {
    // Hide standard page preloader once components mount
    const timer = setTimeout(() => {
      setLoading(false);
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  // Initialize Lenis High-Performance Smooth Scrolling
  useEffect(() => {
    if (typeof Lenis === 'undefined') return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.8,
      infinite: false,
    });

    window.lenis = lenis;

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      lenis.destroy();
      window.lenis = null;
    };
  }, []);

  // Monitor scroll triggers for reveal animations on scroll
  useEffect(() => {
    if (loading) return;

    // 1. Identify sections and register them for scroll reveal
    const sections = ['about', 'journey', 'skills', 'projects', 'contact'];
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.classList.add('reveal-on-scroll', 'section-reveal');
      }
    });

    // 2. Identify header text lines for staggered entrance reveals
    document.querySelectorAll('.section-header').forEach(hdr => {
      const label = hdr.querySelector('.section-label');
      const title = hdr.querySelector('.section-title');
      const hr = hdr.querySelector('hr');
      if (label) label.classList.add('reveal-header-label');
      if (title) title.classList.add('reveal-header-title');
      if (hr) hr.classList.add('reveal-header-line');
    });

    // 3. Register skill category cards for staggering offsets
    document.querySelectorAll('.skill-category-card').forEach((card, idx) => {
      card.classList.add('reveal-skill-card');
    });

    // 4. Register project deck elements
    document.querySelectorAll('.projects-deck-wrapper').forEach(wrapper => {
      wrapper.classList.add('reveal-projects-deck');
    });

    // 5. Register contact layout grid
    const contactGrid = document.querySelector('.contact-layout-grid');
    if (contactGrid) {
      contactGrid.classList.add('reveal-contact-grid');
    }

    // 6. Initialize IntersectionObserver to trigger .revealed classes
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));


    return () => {
      observer.disconnect();
    };
  }, [loading]);

  if (loading) {
    return (
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          backgroundColor: 'var(--color-bg)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <div className="loader-spinner" style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid rgba(23,23,23,0.08)', borderTopColor: 'var(--color-accent-coral)', animation: 'spin 0.8s linear infinite' }} />
          <span style={{ fontSize: '0.62rem', fontWeight: '800', letterSpacing: '0.12em', color: '#171717', textTransform: 'uppercase' }}>
            LOADING SYSTEM...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }}>
      
      {/* 1. Global Page HUD Widgets */}
      <CustomCursor />
      <Navbar />

      {/* 2. Page Sections */}
      <main style={{ flexGrow: 1 }}>
        <Hero />
        <About />
        <Experience />
        <Marquee />
        <Skills />
        <Projects />
        <Contact />
      </main>

      {/* 3. Global Page Footer */}
      <Footer />

    </div>
  );
};

// Double-safe Namespace Registries
window.Portfolio = window.Portfolio || {};
window.PortfolioComponents = window.PortfolioComponents || {};

window.Portfolio.App = App;
window.PortfolioComponents.App = App;

