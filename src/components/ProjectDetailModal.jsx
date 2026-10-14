import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Building2, 
  Calendar, 
  Maximize2, 
  Sparkles, 
  Download, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  FileText, 
  ArrowRight,
  Phone,
  Mail,
  User,
  Share2
} from 'lucide-react';

export default function ProjectDetailModal({ project, onClose, onNavigate }) {
  const [showEnquiryForm, setShowEnquiryForm] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [selectedUnitType, setSelectedUnitType] = useState(project?.units?.[0]?.type || '2 BHK');
  const [brochureDownloaded, setBrochureDownloaded] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    note: ''
  });

  if (!project) return null;

  const handleSubmitEnquiry = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    setFormSubmitted(true);
  };

  const handleDownloadBrochure = () => {
    setBrochureDownloaded(true);
    // Simulate real download by generating a text/mock summary blob
    const content = `================================================
PUREFRAME PROPERTY INTELLIGENCE • BROCHURE SUMMARY
================================================
Project: ${project.name}
Developer: ${project.developer}
Location: ${project.fullLocation}
Configuration: ${project.bhk}
Carpet Area: ${project.carpetArea}
Possession: ${project.possession}
Structure: ${project.structure}
Land Parcel: ${project.landParcel}
MahaRERA: ${project.reraNumber}

KEY AMENITIES:
${project.amenities.map(a => `• ${a}`).join('\n')}

DISCLAIMER:
${project.disclaimer}
================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${project.id}-brochure-pureframe.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setTimeout(() => setBrochureDownloaded(false), 5000);
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(6px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        overflowY: 'auto'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        style={{
          background: '#ffffff',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '960px',
          maxHeight: '92vh',
          overflowY: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Sticky Modal Top Bar */}
        <div style={{
          position: 'sticky',
          top: 0,
          background: '#ffffff',
          borderBottom: '1px solid #f1f5f9',
          padding: '16px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 10
        }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '8px 14px',
              color: '#475569',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            ← Back to Projects
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              onClick={handleDownloadBrochure}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: '#f1f5f9',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                padding: '9px 18px',
                color: '#1e293b',
                fontWeight: 700,
                fontSize: '0.875rem',
                cursor: 'pointer'
              }}
            >
              <Download size={16} />
              <span>{brochureDownloaded ? 'Downloaded ✓' : 'Download Brochure'}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowEnquiryForm(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
                border: 'none',
                borderRadius: '8px',
                padding: '9px 22px',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.875rem',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(217, 119, 6, 0.25)'
              }}
            >
              <Send size={15} />
              <span>Enquire Now</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              style={{
                background: '#f1f5f9',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#64748b',
                marginLeft: '6px'
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Hero Banner Header */}
        <div style={{
          position: 'relative',
          height: '280px',
          overflow: 'hidden',
          background: '#0f172a'
        }}>
          <img 
            src={project.image} 
            alt={project.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: 0.85
            }}
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.4) 60%, transparent 100%)'
          }} />

          <div style={{
            position: 'absolute',
            bottom: '24px',
            left: '32px',
            right: '32px',
            color: '#ffffff'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{
                background: '#fef3c7',
                color: '#92400e',
                fontSize: '0.72rem',
                fontWeight: 800,
                padding: '4px 10px',
                borderRadius: '6px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase'
              }}>
                {project.locationTag}
              </span>
              <span style={{
                background: 'rgba(0,0,0,0.6)',
                backdropFilter: 'blur(4px)',
                color: '#ffffff',
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '4px 10px',
                borderRadius: '6px'
              }}>
                {project.bhk}
              </span>
            </div>

            <h1 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: '2.5rem',
              fontWeight: 700,
              margin: '0 0 6px 0',
              color: '#ffffff'
            }}>
              {project.name}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', color: '#cbd5e1' }}>
              <MapPin size={16} color="#38bdf8" />
              <span>{project.fullLocation}</span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div style={{ padding: '32px', background: '#faf9f5' }}>

          {/* Screenshot 4: Top Stat Highlights Strip */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '16px',
            background: '#ffffff',
            borderRadius: '16px',
            padding: '20px 24px',
            border: '1px solid #ede8de',
            marginBottom: '32px',
            boxShadow: '0 4px 14px rgba(0,0,0,0.03)'
          }}>
            <div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 800 }}>
                CONFIGURATION
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#18181b', marginTop: '4px' }}>
                {project.bhk}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 800 }}>
                CARPET AREA
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#18181b', marginTop: '4px' }}>
                {project.carpetArea}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 800 }}>
                POSSESSION
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#18181b', marginTop: '4px' }}>
                {project.possession}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 800 }}>
                {project.landParcelLabel || 'LAND PARCEL'}
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#18181b', marginTop: '4px' }}>
                {project.landParcel}
              </div>
            </div>
          </div>

          {/* Screenshot 3 & 4: OVERVIEW Section */}
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            padding: '32px',
            border: '1px solid #ede8de',
            marginBottom: '32px',
            boxShadow: '0 4px 14px rgba(0,0,0,0.03)'
          }}>
            <div style={{
              fontSize: '0.75rem',
              fontWeight: 800,
              color: '#b45309',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: '6px'
            }}>
              OVERVIEW
            </div>
            
            <h2 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: '1.85rem',
              fontWeight: 700,
              color: '#18181b',
              margin: '0 0 16px 0'
            }}>
              What {project.name} is
            </h2>

            <p style={{ fontSize: '0.95rem', color: '#475569', lineHeight: 1.6, margin: '0 0 24px 0' }}>
              {project.overviewText}
            </p>

            {/* Specifications Key-Value Table matching Screenshot 3 & 4 */}
            <div style={{ borderTop: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid #f1f5f9', fontSize: '0.9rem' }}>
                <span style={{ color: '#64748b', fontWeight: 500 }}>Developer</span>
                <span style={{ color: '#0f172a', fontWeight: 700 }}>{project.developer}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid #f1f5f9', fontSize: '0.9rem' }}>
                <span style={{ color: '#64748b', fontWeight: 500 }}>Project type</span>
                <span style={{ color: '#0f172a', fontWeight: 700 }}>{project.projectType}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid #f1f5f9', fontSize: '0.9rem' }}>
                <span style={{ color: '#64748b', fontWeight: 500 }}>Structure</span>
                <span style={{ color: '#0f172a', fontWeight: 700 }}>{project.structure}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid #f1f5f9', fontSize: '0.9rem' }}>
                <span style={{ color: '#64748b', fontWeight: 500 }}>Land parcel</span>
                <span style={{ color: '#0f172a', fontWeight: 700 }}>{project.landParcel}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid #f1f5f9', fontSize: '0.9rem' }}>
                <span style={{ color: '#64748b', fontWeight: 500 }}>Location</span>
                <span style={{ color: '#0f172a', fontWeight: 700, textAlign: 'right', maxWidth: '60%' }}>{project.fullLocation}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid #f1f5f9', fontSize: '0.9rem' }}>
                <span style={{ color: '#64748b', fontWeight: 500 }}>MahaRERA Registration</span>
                <span style={{ color: '#2563eb', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldCheck size={16} />
                  {project.reraNumber}
                </span>
              </div>
            </div>

            {/* Disclaimer block (Screenshot 3) */}
            <div style={{
              marginTop: '24px',
              padding: '16px 20px',
              background: '#f8fafc',
              borderLeft: '3px solid #cbd5e1',
              borderRadius: '0 8px 8px 0',
              fontSize: '0.8rem',
              color: '#64748b',
              lineHeight: 1.6
            }}>
              {project.disclaimer}
            </div>
          </div>

          {/* Screenshot 4: Unit Types and Areas Table */}
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            padding: '32px',
            border: '1px solid #ede8de',
            marginBottom: '32px',
            boxShadow: '0 4px 14px rgba(0,0,0,0.03)'
          }}>
            <div style={{
              fontSize: '0.75rem',
              fontWeight: 800,
              color: '#b45309',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: '6px'
            }}>
              CONFIGURATIONS
            </div>

            <h2 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: '1.85rem',
              fontWeight: 700,
              color: '#18181b',
              margin: '0 0 20px 0'
            }}>
              Unit types and areas
            </h2>

            <div style={{ overflowX: 'auto', border: '1px solid #ede8de', borderRadius: '10px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ background: '#fdfbf7', borderBottom: '2px solid #ede8de' }}>
                    <th style={{ padding: '14px 18px', fontWeight: 700, color: '#475569', width: '50%' }}>Type</th>
                    <th style={{ padding: '14px 18px', fontWeight: 700, color: '#475569', width: '50%' }}>Carpet area</th>
                  </tr>
                </thead>
                <tbody>
                  {project.units.map((unit, idx) => (
                    <tr key={idx} style={{ borderBottom: idx !== project.units.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                      <td style={{ padding: '16px 18px', fontWeight: 700, color: '#0f172a' }}>{unit.type}</td>
                      <td style={{ padding: '16px 18px', color: '#475569' }}>{unit.carpetArea}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p style={{ fontSize: '0.825rem', color: '#64748b', marginTop: '16px', margin: '16px 0 0 0' }}>
              Official developer specifications and sanctioned MahaRERA carpet dimensions.
            </p>
          </div>

          {/* Screenshot 4: On-Site Amenities Badges */}
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            padding: '32px',
            border: '1px solid #ede8de',
            marginBottom: '32px',
            boxShadow: '0 4px 14px rgba(0,0,0,0.03)'
          }}>
            <div style={{
              fontSize: '0.75rem',
              fontWeight: 800,
              color: '#b45309',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: '6px'
            }}>
              AMENITIES
            </div>

            <h2 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: '1.85rem',
              fontWeight: 700,
              color: '#18181b',
              margin: '0 0 20px 0'
            }}>
              On-site amenities
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '12px'
            }}>
              {project.amenities.map((item, idx) => (
                <div 
                  key={idx}
                  style={{
                    background: '#fdfbf7',
                    border: '1px solid #ede8de',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    fontSize: '0.85rem',
                    color: '#334155',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#b45309' }} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pureframe IGR Deed Verification Card */}
          <div style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            borderRadius: '20px',
            padding: '32px',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '20px'
          }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(59, 130, 246, 0.2)', padding: '4px 10px', borderRadius: '999px', fontSize: '0.72rem', color: '#93c5fd', fontWeight: 700, marginBottom: '8px' }}>
                <Sparkles size={13} />
                <span>GOVERNMENT REGISTRY DEEDS</span>
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 6px 0', color: '#ffffff' }}>
                Verify Registered Deeds for {project.location}
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0, maxWidth: '520px' }}>
                Inspect actual prices paid in {project.location} registered at the Inspector General of Registration (IGR). Unbiased and free of broker markup.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                onClose();
                onNavigate('transactions', { projectId: project.id, cityId: 'pune' });
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: '#2563eb',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                padding: '12px 22px',
                fontWeight: 700,
                fontSize: '0.875rem',
                cursor: 'pointer'
              }}
            >
              <FileText size={16} />
              <span>Explore IGR Deeds</span>
              <ArrowRight size={16} />
            </button>
          </div>

        </div>

        {/* Modal Enquiry Slide-Over Form */}
        {showEnquiryForm && (
          <div 
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.6)',
              zIndex: 1100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px'
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowEnquiryForm(false);
            }}
          >
            <div style={{
              background: '#ffffff',
              borderRadius: '20px',
              padding: '32px',
              maxWidth: '480px',
              width: '100%',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              position: 'relative'
            }}>
              <button
                type="button"
                onClick={() => setShowEnquiryForm(false)}
                aria-label="Close enquiry form"
                style={{
                  position: 'absolute',
                  top: '18px',
                  right: '18px',
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#64748b'
                }}
              >
                <X size={18} />
              </button>

              {formSubmitted ? (
                <div style={{ textAlign: 'center', padding: '24px 0' }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: '#dcfce7',
                    color: '#15803d',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px'
                  }}>
                    <CheckCircle2 size={36} />
                  </div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: '0 0 8px 0' }}>
                    Enquiry Received!
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.5, margin: '0 0 20px 0' }}>
                    Thank you, <b>{formData.name}</b>. An advisor with verified brochure & floor plans for <b>{project.name}</b> will reach out on <b>{formData.phone}</b> shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setFormSubmitted(false);
                      setShowEnquiryForm(false);
                    }}
                    style={{
                      background: '#0f172a',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '10px 24px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitEnquiry}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#b45309', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
                    ENQUIRE ABOUT {project.name.toUpperCase()}
                  </div>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: '0 0 8px 0' }}>
                    Get Official Brochure &amp; Floor Plans
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 20px 0' }}>
                    Receive verified unit availability and floor layout plans direct from the developer.
                  </p>

                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                      Your Full Name *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Rahul Sharma"
                        style={{
                          width: '100%',
                          padding: '10px 12px 10px 36px',
                          borderRadius: '8px',
                          border: '1px solid #cbd5e1',
                          fontSize: '0.9rem',
                          boxSizing: 'border-box'
                        }}
                      />
                      <User size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                    </div>
                  </div>

                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                      Mobile Number *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="e.g. +91 98765 43210"
                        style={{
                          width: '100%',
                          padding: '10px 12px 10px 36px',
                          borderRadius: '8px',
                          border: '1px solid #cbd5e1',
                          fontSize: '0.9rem',
                          boxSizing: 'border-box'
                        }}
                      />
                      <Phone size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                    </div>
                  </div>

                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                      Email Address
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. rahul@example.com"
                        style={{
                          width: '100%',
                          padding: '10px 12px 10px 36px',
                          borderRadius: '8px',
                          border: '1px solid #cbd5e1',
                          fontSize: '0.9rem',
                          boxSizing: 'border-box'
                        }}
                      />
                      <Mail size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                    </div>
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                      Preferred Unit Configuration
                    </label>
                    <select
                      value={selectedUnitType}
                      onChange={(e) => setSelectedUnitType(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.9rem',
                        boxSizing: 'border-box'
                      }}
                    >
                      {project.units.map((u, i) => (
                        <option key={i} value={u.type}>
                          {u.type} ({u.carpetArea})
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    style={{
                      width: '100%',
                      background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '12px',
                      fontSize: '0.95rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(217, 119, 6, 0.3)'
                    }}
                  >
                    Submit Enquiry &amp; Receive Brochure
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
