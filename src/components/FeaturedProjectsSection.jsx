import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  MapPin, 
  Search, 
  ArrowRight, 
  Sparkles, 
  Layers, 
  SlidersHorizontal,
  Compass,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { FEATURED_PROJECTS } from '../data/featuredProjectsData';
import ProjectDetailModal from './ProjectDetailModal';

export default function FeaturedProjectsSection({ onNavigate }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeProject, setActiveProject] = useState(null);

  // Category counts
  const categories = [
    { id: 'all', label: 'All Projects', count: FEATURED_PROJECTS.length },
    { id: 'life-republic', label: 'Life Republic, Hinjawadi', count: FEATURED_PROJECTS.filter(p => p.category === 'life-republic').length },
    { id: 'tathwade', label: 'Tathwade', count: FEATURED_PROJECTS.filter(p => p.category === 'tathwade').length },
    { id: 'punawale', label: 'Punawale', count: FEATURED_PROJECTS.filter(p => p.category === 'punawale').length },
    { id: 'baner', label: 'Baner', count: FEATURED_PROJECTS.filter(p => p.category === 'baner').length },
    { id: 'sinhagad-road', label: 'Sinhagad Road', count: FEATURED_PROJECTS.filter(p => p.category === 'sinhagad-road').length },
    { id: 'kharadi', label: 'Upper Kharadi', count: FEATURED_PROJECTS.filter(p => p.category === 'kharadi').length },
    { id: 'others', label: 'Mamurdi & Mahalunge', count: FEATURED_PROJECTS.filter(p => p.category === 'mamurdi' || p.category === 'mahalunge').length }
  ];

  const filteredProjects = useMemo(() => {
    return FEATURED_PROJECTS.filter(project => {
      // Category filter
      let matchesCat = true;
      if (selectedCategory === 'others') {
        matchesCat = project.category === 'mamurdi' || project.category === 'mahalunge';
      } else if (selectedCategory !== 'all') {
        matchesCat = project.category === selectedCategory;
      }

      // Search filter
      const q = searchTerm.toLowerCase().trim();
      const matchesSearch = !q || 
        project.name.toLowerCase().includes(q) ||
        project.location.toLowerCase().includes(q) ||
        project.locationTag.toLowerCase().includes(q) ||
        project.developer.toLowerCase().includes(q) ||
        project.bhk.toLowerCase().includes(q);

      return matchesCat && matchesSearch;
    });
  }, [selectedCategory, searchTerm]);

  return (
    <section 
      id="featured-projects-section"
      style={{
        background: '#FAF7F2',
        padding: '54px 0 72px',
        borderTop: '1px solid #EAE4D9',
        borderBottom: '1px solid #EAE4D9'
      }}
    >
      <div className="content-wrapper" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        
        {/* Section Header */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          marginBottom: '36px'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: '#F4EFE6',
            color: '#8C7355',
            padding: '5px 14px',
            borderRadius: '999px',
            fontSize: '0.75rem',
            fontWeight: 800,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '12px',
            border: '1px solid #E6DCCD'
          }}>
            <Sparkles size={14} color="#C59B27" />
            <span>CURATED PUNE DEVELOPMENTS</span>
          </div>

          <h2 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: '2.4rem',
            fontWeight: 700,
            color: '#1A1A1A',
            margin: '0 0 10px 0',
            letterSpacing: '-0.01em'
          }}>
            Featured Residential Projects
          </h2>

          <p style={{
            fontSize: '1rem',
            color: '#6B6861',
            maxWidth: '680px',
            lineHeight: 1.5,
            margin: 0
          }}>
            Explore prominent launches and gated communities across Pune’s highest velocity corridors. Click any development to inspect specifications, unit layouts, and amenities.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '32px'
        }}>
          {/* Category Tabs */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexWrap: 'wrap'
          }}>
            {categories.map(cat => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    background: isActive ? '#1A1A1A' : '#FFFFFF',
                    color: isActive ? '#FFFFFF' : '#4A4A4A',
                    border: isActive ? '1px solid #1A1A1A' : '1px solid #E5E0D8',
                    padding: '8px 16px',
                    borderRadius: '999px',
                    fontSize: '0.825rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: isActive ? '0 4px 12px rgba(0,0,0,0.12)' : '0 1px 3px rgba(0,0,0,0.03)'
                  }}
                >
                  <span>{cat.label}</span>
                  <span style={{
                    marginLeft: '6px',
                    fontSize: '0.725rem',
                    opacity: isActive ? 0.8 : 0.6
                  }}>
                    ({cat.count})
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Search input */}
          <div style={{ position: 'relative', width: '260px' }}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search project or BHK..."
              style={{
                width: '100%',
                padding: '9px 12px 9px 36px',
                borderRadius: '999px',
                border: '1px solid #E5E0D8',
                background: '#FFFFFF',
                fontSize: '0.85rem',
                color: '#1A1A1A',
                boxSizing: 'border-box',
                outline: 'none',
                boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
              }}
            />
            <Search size={16} color="#8C7355" style={{ position: 'absolute', left: '12px', top: '10px' }} />
          </div>
        </div>

        {/* Projects Grid matching Screenshot 1 & 2 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
          gap: '24px'
        }}>
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              style={{
                background: '#FFFFFF',
                borderRadius: '20px',
                border: '1px solid #EFEAE1',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 28px rgba(0, 0, 0, 0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.04)';
              }}
              onClick={() => {
                if (onNavigate) {
                  onNavigate('featured-project', { projectId: project.id });
                }
              }}
            >
              {/* Image Container with overlaid BHK badge (Screenshot 1 & 2) */}
              <div style={{
                position: 'relative',
                height: '190px',
                overflow: 'hidden',
                background: '#E2E8F0'
              }}>
                <img
                  src={project.image}
                  alt={project.name}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease'
                  }}
                  onError={(e) => {
                    // Fallback architectural gradient if remote image fails
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement.style.background = 'linear-gradient(135deg, #1E293B 0%, #334155 100%)';
                  }}
                />

                {/* Overlaid BHK Pill Badge at bottom-left */}
                <div style={{
                  position: 'absolute',
                  bottom: '12px',
                  left: '12px',
                  background: 'rgba(15, 23, 42, 0.9)',
                  backdropFilter: 'blur(4px)',
                  color: '#FFFFFF',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '4px 10px',
                  borderRadius: '6px',
                  letterSpacing: '0.02em',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                }}>
                  {project.bhk}
                </div>
              </div>

              {/* Card Body */}
              <div style={{
                padding: '20px 22px 24px',
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                justifyContent: 'space-between'
              }}>
                <div>
                  {/* Location Tag Pill matching reference screenshots */}
                  <div style={{
                    display: 'inline-block',
                    background: '#F4EFE6',
                    color: '#7D6343',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    letterSpacing: '0.07em',
                    textTransform: 'uppercase',
                    padding: '3px 10px',
                    borderRadius: '6px',
                    marginBottom: '10px'
                  }}>
                    {project.locationTag}
                  </div>

                  {/* Project Title with serif luxury styling */}
                  <h3 style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: '1.45rem',
                    fontWeight: 700,
                    color: '#18181B',
                    margin: '0 0 16px 0',
                    lineHeight: 1.25
                  }}>
                    {project.name}
                  </h3>
                </div>

                {/* Outlined Action Button matching Screenshot 1 & 2 */}
                <div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onNavigate) {
                        onNavigate('featured-project', { projectId: project.id });
                      }
                    }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: 'transparent',
                      border: '1.5px solid #18181B',
                      borderRadius: '8px',
                      padding: '8px 18px',
                      color: '#18181B',
                      fontSize: '0.875rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#18181B';
                      e.currentTarget.style.color = '#FFFFFF';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#18181B';
                    }}
                  >
                    <span>View Project</span>
                    <span style={{ fontSize: '1rem', lineHeight: 1 }}>→</span>
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* Empty state if search finds nothing */}
        {filteredProjects.length === 0 && (
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            padding: '48px 24px',
            textAlign: 'center',
            border: '1px solid #EFEAE1'
          }}>
            <Building2 size={40} color="#94A3B8" style={{ margin: '0 auto 12px' }} />
            <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1E293B', margin: '0 0 6px 0' }}>
              No developments found matching "{searchTerm}"
            </h4>
            <p style={{ fontSize: '0.875rem', color: '#64748B', margin: '0 0 16px 0' }}>
              Try searching by area (e.g. Hinjawadi, Tathwade) or clearing your search filter.
            </p>
            <button
              type="button"
              onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}
              style={{
                background: '#1A1A1A',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 18px',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>

      {/* Project Detail Modal matching Screenshot 3 & 4 */}
      {activeProject && (
        <ProjectDetailModal
          project={activeProject}
          onClose={() => setActiveProject(null)}
          onNavigate={onNavigate}
        />
      )}
    </section>
  );
}
