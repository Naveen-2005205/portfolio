// src/components/Footer.jsx
const Footer = () => {
  const currentYear = 2026;

  return (
    <footer
      className="site-footer"
      role="contentinfo"
      aria-label="Site Footer"
    >
      <div className="container">
        <div className="footer-inner">
          <div className="footer-left">
            © {currentYear} NAVEEN RAJAN.
          </div>

          <div className="footer-right">
            <span>DESIGNED TO CONNECT</span>
            <span className="footer-dot" aria-hidden="true">•</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Double-safe Namespace Registries
window.Portfolio = window.Portfolio || {};
window.PortfolioComponents = window.PortfolioComponents || {};

window.Portfolio.Footer = Footer;
window.PortfolioComponents.Footer = Footer;
