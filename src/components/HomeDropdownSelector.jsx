import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  MapPin, 
  ChevronDown, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  FileText,
  Search
} from 'lucide-react';
import puneHierarchy from '../data/puneHierarchyData.js';

export default function HomeDropdownSelector({ onContinue }) {
  // 1. District: Auto-selected to Pune
  const [selectedDistrict, setSelectedDistrict] = useState('Pune');

  // 2. Taluka
  const talukas = puneHierarchy.talukas || [];
  const [selectedTalukaSlug, setSelectedTalukaSlug] = useState('haveli'); // default Haveli

  // 3. Villages for selected Taluka
  const villages = useMemo(() => {
    if (!selectedTalukaSlug) return [];
    return puneHierarchy.villagesByTaluka[selectedTalukaSlug] || [];
  }, [selectedTalukaSlug]);

  const [selectedVillageSlug, setSelectedVillageSlug] = useState(() => {
    const list = puneHierarchy.villagesByTaluka['haveli'] || [];
    return list[1]?.slug || list[0]?.slug || ''; // 'baner'
  });

  // When taluka changes, update village
  const handleTalukaChange = (e) => {
    const newTalukaSlug = e.target.value;
    setSelectedTalukaSlug(newTalukaSlug);
    const newVillages = puneHierarchy.villagesByTaluka[newTalukaSlug] || [];
    setSelectedVillageSlug(newVillages[0]?.slug || '');
    setSelectedProjectKey('');
    setCustomProjectName('');
  };

  // 4. Projects for selected Taluka + Village
  const projects = useMemo(() => {
    if (!selectedTalukaSlug || !selectedVillageSlug) return [];
    const key = `${selectedTalukaSlug}/${selectedVillageSlug}`;
    return puneHierarchy.projectsByVillage[key] || [];
  }, [selectedTalukaSlug, selectedVillageSlug]);

  const [selectedProjectKey, setSelectedProjectKey] = useState('');
  const [customProjectName, setCustomProjectName] = useState('');

  // Find active project object
  const activeProject = useMemo(() => {
    if (selectedProjectKey) {
      return projects.find(p => (p.id || p.projectId) === selectedProjectKey) || null;
    }
    return projects[0] || null;
  }, [selectedProjectKey, projects]);

  const currentTalukaObj = useMemo(() => {
    return talukas.find(t => t.slug === selectedTalukaSlug) || talukas[0];
  }, [selectedTalukaSlug, talukas]);

  const currentVillageObj = useMemo(() => {
    return villages.find(v => v.slug === selectedVillageSlug) || villages[0];
  }, [selectedVillageSlug, villages]);

  const handleContinueClick = (e) => {
    e.preventDefault();

    const chosenTaluka = currentTalukaObj?.name || 'Haveli';
    const chosenVillage = currentVillageObj?.name || 'Baner';
    const chosenProject = activeProject ? {
      ...activeProject,
      name: customProjectName.trim() || activeProject.name
    } : {
      id: `proj-${Date.now()}`,
      name: customProjectName.trim() || 'GOVIND VILAS',
      rera: 'P52100008590',
      taluka: chosenTaluka,
      village: chosenVillage
    };

    onContinue({
      district: 'Pune',
      taluka: chosenTaluka,
      talukaSlug: selectedTalukaSlug,
      village: chosenVillage,
      villageSlug: selectedVillageSlug,
      initialProject: chosenProject
    });
  };

  return (
    <div style={{
      maxWidth: '680px',
      margin: '0 auto 36px',
      background: '#ffffff',
      borderRadius: '24px',
      border: '2px solid #2563eb',
      boxShadow: '0 20px 45px -10px rgba(37, 99, 235, 0.18)',
      padding: '36px 32px',
      position: 'relative'
    }}>
      {/* Badge Indicator */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        background: '#eff6ff',
        border: '1px solid #bfdbfe',
        color: '#1d4ed8',
        padding: '5px 12px',
        borderRadius: '999px',
        fontSize: '0.78rem',
        fontWeight: 800,
        marginBottom: '16px'
      }}>
        <Sparkles size={14} />
        <span>STEP-BY-STEP SELECTION • PUNE DISTRICT</span>
      </div>

      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
          Search &amp; Select Property
        </h2>
        <p style={{ fontSize: '0.9rem', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
          Select district, taluka, village and project name to continue to the property information &amp; deed request page.
        </p>
      </div>

      {/* STRICTLY VERTICAL FORM */}
      <form onSubmit={handleContinueClick} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* 1. DISTRICT DROPDOWN (AUTO SELECT PUNE) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1e293b' }}>
              1. District
            </label>
            <span style={{ color: '#16a34a', fontSize: '0.75rem', fontWeight: 700, background: '#dcfce7', padding: '2px 8px', borderRadius: '4px' }}>
              Auto-selected: Pune
            </span>
          </div>

          <div style={{ position: 'relative' }}>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 40px 14px 16px',
                borderRadius: '12px',
                border: '2px solid #22c55e',
                background: '#f0fdf4',
                color: '#14532d',
                fontSize: '0.95rem',
                fontWeight: 800,
                appearance: 'none',
                cursor: 'default',
                boxSizing: 'border-box'
              }}
            >
              <option value="Pune">Pune District (Auto-selected)</option>
            </select>
            <div style={{
              position: 'absolute',
              right: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              color: '#16a34a'
            }}>
              <CheckCircle2 size={18} />
            </div>
          </div>
        </div>

        {/* 2. TALUKA DROPDOWN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1e293b' }}>
              2. Taluka
            </label>
            <span style={{ color: '#2563eb', fontSize: '0.75rem', fontWeight: 700 }}>
              {talukas.length} Talukas Available
            </span>
          </div>

          <div style={{ position: 'relative' }}>
            <select
              value={selectedTalukaSlug}
              onChange={handleTalukaChange}
              style={{
                width: '100%',
                padding: '14px 40px 14px 16px',
                borderRadius: '12px',
                border: '1.5px solid #cbd5e1',
                background: '#ffffff',
                color: '#0f172a',
                fontSize: '0.95rem',
                fontWeight: 700,
                appearance: 'none',
                cursor: 'pointer',
                boxSizing: 'border-box'
              }}
            >
              {talukas.map((t) => (
                <option key={t.slug} value={t.slug}>
                  {t.name} ({t.projectCount?.toLocaleString('en-IN')} projects)
                </option>
              ))}
            </select>
            <ChevronDown 
              size={18} 
              color="#64748b" 
              style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
            />
          </div>
        </div>

        {/* 3. VILLAGE DROPDOWN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1e293b' }}>
              3. Village / Locality
            </label>
            <span style={{ color: '#2563eb', fontSize: '0.75rem', fontWeight: 700 }}>
              {villages.length} Villages in {currentTalukaObj?.name || 'Taluka'}
            </span>
          </div>

          <div style={{ position: 'relative' }}>
            <select
              value={selectedVillageSlug}
              onChange={(e) => {
                setSelectedVillageSlug(e.target.value);
                setSelectedProjectKey('');
                setCustomProjectName('');
              }}
              disabled={villages.length === 0}
              style={{
                width: '100%',
                padding: '14px 40px 14px 16px',
                borderRadius: '12px',
                border: '1.5px solid #cbd5e1',
                background: villages.length === 0 ? '#f8fafc' : '#ffffff',
                color: '#0f172a',
                fontSize: '0.95rem',
                fontWeight: 700,
                appearance: 'none',
                cursor: 'pointer',
                boxSizing: 'border-box'
              }}
            >
              {villages.map((v) => (
                <option key={v.slug} value={v.slug}>
                  {v.name} ({v.projectCount} projects)
                </option>
              ))}
            </select>
            <ChevronDown 
              size={18} 
              color="#64748b" 
              style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
            />
          </div>
        </div>

        {/* 4. PROJECT NAME DROPDOWN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1e293b' }}>
              4. Project Name
            </label>
            <span style={{ color: '#2563eb', fontSize: '0.75rem', fontWeight: 700 }}>
              {projects.length} Registered Projects
            </span>
          </div>

          <div style={{ position: 'relative' }}>
            <select
              value={selectedProjectKey}
              onChange={(e) => {
                setSelectedProjectKey(e.target.value);
                const p = projects.find(proj => (proj.id || proj.projectId) === e.target.value);
                if (p) setCustomProjectName(p.name);
              }}
              style={{
                width: '100%',
                padding: '14px 40px 14px 16px',
                borderRadius: '12px',
                border: '1.5px solid #cbd5e1',
                background: '#ffffff',
                color: '#0f172a',
                fontSize: '0.95rem',
                fontWeight: 700,
                appearance: 'none',
                cursor: 'pointer',
                boxSizing: 'border-box'
              }}
            >
              <option value="">
                {projects.length > 0 ? `-- Select from ${projects.length} Projects --` : 'No pre-recorded projects (custom ok)'}
              </option>
              {projects.map((p) => (
                <option key={p.id || p.projectId} value={p.id || p.projectId}>
                  {p.name} {p.rera ? `(${p.rera})` : ''}
                </option>
              ))}
            </select>
            <ChevronDown 
              size={18} 
              color="#64748b" 
              style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
            />
          </div>

          {/* Optional manual project name if not selected or custom */}
          <div style={{ marginTop: '4px' }}>
            <input
              type="text"
              value={customProjectName}
              onChange={(e) => setCustomProjectName(e.target.value)}
              placeholder="Or type custom project name if not in list (optional)"
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '10px',
                border: '1px solid #e2e8f0',
                background: '#f8fafc',
                fontSize: '0.85rem',
                color: '#334155',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>

        {/* SELECTION PATH SUMMARY BADGE */}
        <div style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.85rem',
          color: '#475569'
        }}>
          <MapPin size={16} color="#2563eb" style={{ flexShrink: 0 }} />
          <div>
            <b>Pune</b> &gt; <b>{currentTalukaObj?.name}</b> &gt; <b>{currentVillageObj?.name}</b>
            {activeProject ? ` > ${customProjectName || activeProject.name}` : ''}
          </div>
        </div>

        {/* FULL-WIDTH VERTICAL CONTINUE BUTTON */}
        <button
          type="submit"
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            color: '#ffffff',
            border: 'none',
            padding: '16px 28px',
            borderRadius: '14px',
            fontSize: '1.05rem',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 8px 20px rgba(37, 99, 235, 0.35)',
            transition: 'all 0.15s ease',
            marginTop: '8px'
          }}
        >
          <span>Continue to Property Details</span>
          <ArrowRight size={20} />
        </button>

      </form>
    </div>
  );
}
