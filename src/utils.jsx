// Shared Portfolio Utilities
window.PortfolioUtils = window.PortfolioUtils || {};

// 1. Device/Touch detection
window.PortfolioUtils.isTouchDevice = 
  ('ontouchstart' in window) || 
  (navigator.maxTouchPoints > 0) || 
  window.matchMedia("(pointer: coarse)").matches;

// 2. Reduced Motion check
window.PortfolioUtils.prefersReducedMotion = 
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// 3. Framer Motion availability
window.PortfolioUtils.framerMotionAvailable = typeof framerMotion !== 'undefined';

// 4. Safe Motion Component Proxy
// If Framer Motion is available, it maps to framerMotion.motion.
// Otherwise, it falls back to standard HTML tags.
const standardHTMLProxy = (tag) => {
  return React.forwardRef((props, ref) => {
    // Strip Framer Motion specific props to avoid warnings on native tags
    const { 
      animate, initial, exit, transition, variants, 
      whileHover, whileTap, whileInView, viewport, 
      ...restProps 
    } = props;
    
    return React.createElement(tag, { ref, ...restProps });
  });
};

if (window.PortfolioUtils.framerMotionAvailable) {
  window.PortfolioUtils.motion = framerMotion.motion;
  window.PortfolioUtils.AnimatePresence = framerMotion.AnimatePresence;
} else {
  console.warn("[System] Framer Motion UMD CDN failed to load. Falling back to native CSS transitions.");
  window.PortfolioUtils.AnimatePresence = ({ children }) => React.createElement(React.Fragment, null, children);
  
  const tags = [
    'div', 'section', 'nav', 'header', 'footer', 'main', 'article',
    'button', 'span', 'h1', 'h2', 'h3', 'p', 'a', 'ul', 'li', 'svg', 'path', 'line', 'polyline'
  ];
  
  const motionFallback = {};
  tags.forEach(tag => {
    motionFallback[tag] = standardHTMLProxy(tag);
  });
  
  window.PortfolioUtils.motion = motionFallback;
}
