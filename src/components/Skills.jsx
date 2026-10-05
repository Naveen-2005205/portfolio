// src/components/Skills.jsx
const { useState } = React;

const Skills = () => {
  const skillCategories = window.PortfolioData.skillCategories || [];

  // Separate tools from main categories
  const mainCategories = skillCategories.filter(cat => cat.id !== 'tools');
  const toolsCategory = skillCategories.find(cat => cat.id === 'tools');
  const toolsSkills = toolsCategory ? toolsCategory.skills : [];

  const [expandedCats, setExpandedCats] = useState({});
  const [toolsExpanded, setToolsExpanded] = useState(false);

  const toggleExpandCategory = (catId) => {
    setExpandedCats(prev => ({
      ...prev,
      [catId]: !prev[catId]
    }));
  };

  return (
    <section
      id="skills"
      className="skills-section"
      style={{
        padding: 'var(--section-spacing-y) 0',
        backgroundColor: 'transparent',
        position: 'relative'
      }}
    >
      <div className="container">

        {/* Section Header */}
        <div className="section-header reveal-on-scroll">
          <span className="section-label">03 / TECH STACK</span>
          <h2 className="section-title">MY TOOLBOX</h2>
          <div className="section-divider" aria-hidden="true">
            <div className="section-divider-coral" />
          </div>
        </div>

        {/* Skill categories horizontal layout grid */}
        <div className="skills-categories-grid">
          {mainCategories.map(cat => {
            const isExpanded = !!expandedCats[cat.id];
            const visibleSkills = isExpanded ? cat.skills : cat.skills.slice(0, 3);
            const hasMore = cat.skills.length > 3;

            return (
              <div
                key={cat.id}
                className="skill-category-card"
                style={{
                  padding: '22px',
                  borderRadius: '16px',
                  backgroundColor: '#FFFDF9',
                  border: '2px solid #171717',
                  boxShadow: '5px 6px 0 #171717',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  alignSelf: 'start'
                }}
              >
                {/* Category Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{ width: '20px', height: '20px', color: 'var(--color-accent-coral)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                    dangerouslySetInnerHTML={{ __html: cat.icon }}
                  />
                  <h3 style={{ fontFamily: 'var(--font-headings)', fontSize: '0.85rem', fontWeight: '900', color: '#171717', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {cat.title}
                  </h3>
                </div>

                {/* Skills tiles list - Clean items with name only */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {visibleSkills.map(skill => (
                    <div
                      key={skill.name}
                      className="skill-tile"
                    >
                      <span className="skill-tile-name">
                        {skill.name}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Category Expand / Collapse trigger */}
                {hasMore && (
                  <button
                    type="button"
                    onClick={() => toggleExpandCategory(cat.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.7rem',
                      fontWeight: '900',
                      color: 'var(--color-accent-coral)',
                      cursor: 'pointer',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      border: 'none',
                      background: 'none',
                      padding: '4px 0',
                      marginTop: '2px',
                      alignSelf: 'center'
                    }}
                  >
                    {isExpanded ? 'Collapse ↑' : `+ ${cat.skills.length - 3} More ↓`}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Compact Expandable Tools Area */}
        {toolsSkills.length > 0 && (
          <div
            style={{
              marginTop: '28px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
              gap: '10px'
            }}
          >
            <button
              type="button"
              onClick={() => setToolsExpanded(!toolsExpanded)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 18px',
                borderRadius: '999px',
                backgroundColor: '#FFFDF9',
                border: '2px solid #171717',
                boxShadow: '3px 4px 0 #171717',
                fontSize: '0.75rem',
                fontWeight: '900',
                color: '#171717',
                cursor: 'pointer'
              }}
              className="btn-tools-toggle"
            >
              <span style={{ color: 'var(--color-accent-coral)', fontSize: '0.8rem' }}>⚙</span>
              TOOLS & UTILITIES {toolsExpanded ? '↑' : '↓'}
            </button>

            {toolsExpanded && (
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px',
                  justifyContent: 'center',
                  maxWidth: '650px',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.45)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  border: '2.5px solid #171717',
                  boxShadow: 'var(--shadow-brutal-sm)'
                }}
              >
                {toolsSkills.map(tool => (
                  <div
                    key={tool.name}
                    style={{
                      padding: '5px 11px',
                      borderRadius: '6px',
                      border: '2px solid #171717',
                      backgroundColor: '#FFFDF9',
                      fontSize: '0.7rem',
                      fontWeight: '800',
                      color: '#171717',
                      boxShadow: '2px 2px 0 #171717'
                    }}
                  >
                    {tool.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </section>
  );
};

// Double-safe Namespace Registries
window.Portfolio = window.Portfolio || {};
window.PortfolioComponents = window.PortfolioComponents || {};

window.Portfolio.Skills = Skills;
window.PortfolioComponents.Skills = Skills;
