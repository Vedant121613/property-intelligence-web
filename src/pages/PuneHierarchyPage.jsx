import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  MapPin, 
  ChevronRight, 
  ArrowLeft, 
  Search, 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  Compass, 
  FileText,
  ShieldCheck,
  TrendingUp,
  Map
} from 'lucide-react';
import puneHierarchy from '../data/puneHierarchyData.js';
import Breadcrumbs from '../components/Breadcrumbs';
import HomeDropdownSelector from '../components/HomeDropdownSelector';

export default function PuneHierarchyPage({ onNavigate }) {
  // Navigation drill-down state:
  // step: 'city' -> 'district' -> 'taluka' -> 'village'
  const [currentStep, setCurrentStep] = useState('city');
  const [selectedTaluka, setSelectedTaluka] = useState(null);
  const [selectedVillage, setSelectedVillage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Talukas of Pune District
  const talukas = puneHierarchy.talukas || [];

  // 2. Villages for selected Taluka
  const villages = useMemo(() => {
    if (!selectedTaluka) return [];
    return puneHierarchy.villagesByTaluka[selectedTaluka.slug] || [];
  }, [selectedTaluka]);

  // 3. Projects for selected Taluka + Village
  const projects = useMemo(() => {
    if (!selectedTaluka || !selectedVillage) return [];
    const key = `${selectedTaluka.slug}/${selectedVillage.slug}`;
    return puneHierarchy.projectsByVillage[key] || [];
  }, [selectedTaluka, selectedVillage]);

  // Filtered Talukas
  const filteredTalukas = useMemo(() => {
    if (!searchQuery.trim()) return talukas;
    const q = searchQuery.toLowerCase();
    return talukas.filter(t => 
      t.name.toLowerCase().includes(q) || 
      (t.topVillages && t.topVillages.some(v => v.toLowerCase().includes(q)))
    );
  }, [talukas, searchQuery]);

  // Filtered Villages
  const filteredVillages = useMemo(() => {
    if (!searchQuery.trim()) return villages;
    const q = searchQuery.toLowerCase();
    return villages.filter(v => v.name.toLowerCase().includes(q));
  }, [villages, searchQuery]);

  // Filtered Projects
  const filteredProjects = useMemo(() => {
    if (!searchQuery.trim()) return projects;
    const q = searchQuery.toLowerCase();
    return projects.filter(p => 
      p.name.toLowerCase().includes(q) || 
      (p.rera && p.rera.toLowerCase().includes(q)) ||
      (p.address && p.address.toLowerCase().includes(q))
    );
  }, [projects, searchQuery]);

  // Handlers for step transitions
  const handleSelectCity = () => {
    setCurrentStep('district');
    setSearchQuery('');
  };

  const handleSelectTaluka = (taluka) => {
    setSelectedTaluka(taluka);
    setSelectedVillage(null);
    setCurrentStep('taluka');
    setSearchQuery('');
  };

  const handleSelectVillage = (village) => {
    setSelectedVillage(village);
    setCurrentStep('village');
    setSearchQuery('');
  };

  const handleDropdownContinue = (params) => {
    onNavigate('continue', params);
  };

  const handleSelectProject = (project) => {
    onNavigate('continue', {
      district: 'Pune',
      taluka: selectedTaluka?.name || project.taluka || 'Pune City',
      talukaSlug: selectedTaluka?.slug,
      village: selectedVillage?.name || project.village,
      villageSlug: selectedVillage?.slug,
      initialProject: project
    });
  };

  // Build breadcrumbs for the hierarchy
  const breadcrumbItems = [
    { label: 'Pune', onClick: () => { setCurrentStep('city'); setSelectedTaluka(null); setSelectedVillage(null); setSearchQuery(''); } }
  ];

  if (currentStep !== 'city') {
    breadcrumbItems.push({
      label: 'District: Pune',
      onClick: () => { setCurrentStep('district'); setSelectedTaluka(null); setSelectedVillage(null); setSearchQuery(''); }
    });
  }

  if (selectedTaluka && (currentStep === 'taluka' || currentStep === 'village')) {
    breadcrumbItems.push({
      label: `Taluka: ${selectedTaluka.name}`,
      onClick: () => { setCurrentStep('taluka'); setSelectedVillage(null); setSearchQuery(''); }
    });
  }

  if (selectedVillage && currentStep === 'village') {
    breadcrumbItems.push({
      label: `Village: ${selectedVillage.name}`
    });
  }

  return (
    <div style={{ background: '#f8fafc', minHeight: '90vh', padding: '28px 0 64px' }}>
      <div className="content-wrapper">
        
        {/* Navigation Breadcrumb Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '24px',
          flexWrap: 'wrap',
          background: '#ffffff',
          padding: '12px 18px',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#1d4ed8', fontWeight: 700, fontSize: '0.85rem' }}>
            <MapPin size={16} />
            <span>Hierarchy Explorer:</span>
          </div>

          {breadcrumbItems.map((item, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <ChevronRight size={14} color="#94a3b8" />}
              {item.onClick ? (
                <button
                  type="button"
                  onClick={item.onClick}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: idx === breadcrumbItems.length - 1 ? '#0f172a' : '#2563eb',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  {item.label}
                </button>
              ) : (
                <span style={{ color: '#0f172a', fontWeight: 800, fontSize: '0.85rem' }}>
                  {item.label}
                </span>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* STEP 1: INITIAL CITY VIEW (ONLY PUNE IS SHOWN!) */}
        {currentStep === 'city' && (
          <div>
            {/* CASCADING DROPDOWNS: DISTRICT -> TALUKA -> VILLAGE -> PROJECT -> CONTINUE */}
            <HomeDropdownSelector onContinue={handleDropdownContinue} />

            {/* Header Banner */}
            <div style={{
              background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
              color: '#ffffff',
              borderRadius: '20px',
              padding: '36px 32px',
              marginBottom: '32px',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.4)'
            }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(59, 130, 246, 0.2)',
                border: '1px solid rgba(59, 130, 246, 0.4)',
                padding: '4px 12px',
                borderRadius: '999px',
                fontSize: '0.75rem',
                color: '#93c5fd',
                fontWeight: 700,
                marginBottom: '14px'
              }}>
                <Sparkles size={13} />
                <span>GOVERNMENT REGISTERED PROPERTY REPOSITORY</span>
              </div>

              <h1 style={{ fontSize: '2.2rem', fontWeight: 800, margin: '0 0 10px', color: '#ffffff', letterSpacing: '-0.02em' }}>
                Pune District Real Estate Intelligence
              </h1>
              <p style={{ fontSize: '0.95rem', color: '#cbd5e1', maxWidth: '640px', lineHeight: 1.6, margin: '0 0 24px' }}>
                Explore authentic MahaRERA project filings, exact geo-coordinates, and IGR registered deed valuations exclusively for Pune.
              </p>

              <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#38bdf8' }}>11,078</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>MahaRERA Projects</div>
                </div>
                <div style={{ width: '1px', background: 'rgba(255,255,255,0.15)' }} />
                <div>
                  <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#4ade80' }}>15</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Revenue Talukas</div>
                </div>
                <div style={{ width: '1px', background: 'rgba(255,255,255,0.15)' }} />
                <div>
                  <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#facc15' }}>400+</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Villages &amp; Localities</div>
                </div>
              </div>
            </div>

            {/* ONLY PUNE SELECTION CARD */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
                Select City / Region to Inspect:
              </div>

              <div 
                onClick={handleSelectCity}
                style={{
                  background: '#ffffff',
                  border: '2px solid #2563eb',
                  borderRadius: '18px',
                  padding: '28px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.1)',
                  transition: 'all 0.2s',
                  maxWidth: '720px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 16px -4px rgba(37, 99, 235, 0.4)'
                  }}>
                    <Building2 size={32} />
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                        Pune
                      </h2>
                      <span style={{
                        background: '#dcfce7',
                        border: '1px solid #86efac',
                        color: '#15803d',
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: '999px'
                      }}>
                        ACTIVE &amp; VERIFIED
                      </span>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '4px 0 0' }}>
                      Maharashtra, India • Complete coverage of Haveli, Mulshi, Pune City, Mawal, and 11 other Talukas
                    </p>
                    <div style={{ display: 'flex', gap: '16px', marginTop: '8px', fontSize: '0.78rem', color: '#2563eb', fontWeight: 700 }}>
                      <span>15 Talukas</span>
                      <span>•</span>
                      <span>400+ Villages</span>
                      <span>•</span>
                      <span>11,078 Registered Projects</span>
                    </div>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#2563eb',
                  fontWeight: 800,
                  fontSize: '0.9rem'
                }}>
                  <span>Explore Pune Data</span>
                  <ChevronRight size={20} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: DISTRICT PUNE -> TALUKAS LIST */}
        {currentStep === 'district' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <button
                  type="button"
                  onClick={() => setCurrentStep('city')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'transparent',
                    border: 'none',
                    color: '#64748b',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    padding: 0,
                    marginBottom: '4px'
                  }}
                >
                  <ArrowLeft size={14} />
                  <span>Back to City Overview</span>
                </button>
                <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  District: Pune ({filteredTalukas.length} Talukas)
                </h2>
                <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '2px 0 0' }}>
                  Click a Taluka below to explore its constituent revenue villages and localities.
                </p>
              </div>

              {/* Search Talukas */}
              <div style={{ position: 'relative', width: '280px' }}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Taluka (Haveli, Mulshi...)"
                  style={{
                    width: '100%',
                    padding: '9px 12px 9px 34px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.85rem',
                    boxSizing: 'border-box'
                  }}
                />
                <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '11px' }} />
              </div>
            </div>

            {/* Talukas Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '16px'
            }}>
              {filteredTalukas.map((taluka) => (
                <div
                  key={taluka.slug}
                  onClick={() => handleSelectTaluka(taluka)}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '14px',
                    padding: '20px',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                    transition: 'all 0.2s',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#2563eb';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.transform = 'none';
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                      <div style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '10px',
                        background: '#eff6ff',
                        color: '#1d4ed8',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Building2 size={20} />
                      </div>
                      <span style={{
                        background: '#f1f5f9',
                        color: '#475569',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '6px'
                      }}>
                        TALUKA
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>
                      {taluka.name}
                    </h3>
                    <div style={{ fontSize: '0.775rem', color: '#64748b' }}>
                      Revenue Sub-Division of Pune District
                    </div>

                    {taluka.topVillages && (
                      <div style={{ marginTop: '12px', fontSize: '0.75rem', color: '#475569' }}>
                        <span style={{ color: '#94a3b8' }}>Key Villages: </span>
                        <b>{taluka.topVillages.slice(0, 3).join(', ')}</b>
                      </div>
                    )}
                  </div>

                  <div style={{
                    marginTop: '18px',
                    paddingTop: '14px',
                    borderTop: '1px solid #f1f5f9',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#2563eb' }}>
                        {taluka.projectCount?.toLocaleString('en-IN') || 0}
                      </span>
                      <span style={{ fontSize: '0.725rem', color: '#64748b', marginLeft: '4px' }}>projects</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.775rem', color: '#2563eb', fontWeight: 700 }}>
                      <span>{taluka.villageCount || 0} Villages</span>
                      <ChevronRight size={14} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: TALUKA SELECTED -> VILLAGES LIST */}
        {currentStep === 'taluka' && selectedTaluka && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <button
                  type="button"
                  onClick={() => setCurrentStep('district')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'transparent',
                    border: 'none',
                    color: '#64748b',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    padding: 0,
                    marginBottom: '4px'
                  }}
                >
                  <ArrowLeft size={14} />
                  <span>Back to Pune Talukas</span>
                </button>
                <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Villages in {selectedTaluka.name} Taluka ({filteredVillages.length})
                </h2>
                <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '2px 0 0' }}>
                  Select a village or locality to inspect registered housing projects.
                </p>
              </div>

              {/* Search Villages */}
              <div style={{ position: 'relative', width: '280px' }}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search village in ${selectedTaluka.name}...`}
                  style={{
                    width: '100%',
                    padding: '9px 12px 9px 34px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.85rem',
                    boxSizing: 'border-box'
                  }}
                />
                <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '11px' }} />
              </div>
            </div>

            {/* Villages Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '14px'
            }}>
              {filteredVillages.map((village) => (
                <div
                  key={village.slug}
                  onClick={() => handleSelectVillage(village)}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '16px 18px',
                    cursor: 'pointer',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
                    transition: 'all 0.18s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#2563eb';
                    e.currentTarget.style.backgroundColor = '#f8fafc';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.backgroundColor = '#ffffff';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: '#f0fdf4',
                      color: '#16a34a',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Compass size={17} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.9rem' }}>
                        {village.name}
                      </div>
                      <div style={{ fontSize: '0.725rem', color: '#64748b' }}>
                        {village.projectCount || 0} Registered Projects
                      </div>
                    </div>
                  </div>

                  <ChevronRight size={16} color="#94a3b8" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: VILLAGE SELECTED -> PROJECTS LIST */}
        {currentStep === 'village' && selectedVillage && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <button
                  type="button"
                  onClick={() => setCurrentStep('taluka')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'transparent',
                    border: 'none',
                    color: '#64748b',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    padding: 0,
                    marginBottom: '4px'
                  }}
                >
                  <ArrowLeft size={14} />
                  <span>Back to {selectedTaluka.name} Villages</span>
                </button>
                <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Projects in {selectedVillage.name} ({filteredProjects.length})
                </h2>
                <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '2px 0 0' }}>
                  Taluka: {selectedTaluka.name} • District: Pune
                </p>
              </div>

              {/* Search Projects */}
              <div style={{ position: 'relative', width: '280px' }}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search project name, RERA ID..."
                  style={{
                    width: '100%',
                    padding: '9px 12px 9px 34px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.85rem',
                    boxSizing: 'border-box'
                  }}
                />
                <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '11px' }} />
              </div>
            </div>

            {/* Projects Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '16px'
            }}>
              {filteredProjects.map((proj) => (
                <div
                  key={proj.id || proj.projectId}
                  onClick={() => handleSelectProject(proj)}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '14px',
                    padding: '20px',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                    transition: 'all 0.2s',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#2563eb';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.transform = 'none';
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <span style={{
                        background: '#eff6ff',
                        border: '1px solid #bfdbfe',
                        color: '#1d4ed8',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: '6px'
                      }}>
                        RERA: {proj.rera || 'VERIFIED'}
                      </span>
                      {proj.regDate && (
                        <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                          Reg: {proj.regDate}
                        </span>
                      )}
                    </div>

                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>
                      {proj.name}
                    </h3>

                    <div style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.4 }}>
                      {proj.address || `${selectedVillage.name}, ${selectedTaluka.name}, Pune`}
                    </div>
                  </div>

                  <div style={{
                    marginTop: '16px',
                    paddingTop: '12px',
                    borderTop: '1px solid #f1f5f9',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Map size={13} />
                      <span>Geo-Coords &amp; Map Available</span>
                    </span>

                    <span style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: '#2563eb',
                      fontWeight: 700,
                      fontSize: '0.8rem'
                    }}>
                      <span>View Details</span>
                      <ChevronRight size={14} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
