// src/index.jsx
// Bootstrap React App
const { App } = window.PortfolioComponents;

const renderApp = () => {
  const container = document.getElementById('root');
  if (container) {
    const root = ReactDOM.createRoot(container);
    root.render(React.createElement(App));
    console.log("[System] React Application loaded successfully under static UMD CDN.");
  } else {
    console.error("[System] Mount container #root not found in DOM.");
  }
};

// Render React App when DOM contents load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderApp);
} else {
  renderApp();
}
