import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Download, 
  Send, 
  ChevronDown, 
  ChevronUp, 
  X, 
  CheckCircle2, 
  Phone, 
  Mail, 
  User, 
  MessageCircle,
  ArrowLeft
} from 'lucide-react';
import { FEATURED_PROJECTS } from '../data/featuredProjectsData';

export default function SupremeRivanaPage({ onNavigate, projectId = 'supreme-rivana-punawale' }) {
  const project = FEATURED_PROJECTS.find(p => 
    p.id === projectId || 
    p.slug === projectId || 
    p.alias === projectId ||
    (projectId && p.id.includes(projectId)) ||
    (projectId && projectId.includes(p.id)) ||
    (projectId && p.slug.includes(projectId))
  ) || FEATURED_PROJECTS[0];

  // Accordion open/close state
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  // Enquiry modal state
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [selectedUnitType, setSelectedUnitType] = useState(project?.units?.[0]?.type || '2 BHK');
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [brochureSuccess, setBrochureSuccess] = useState(false);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleBrochureDownload = () => {
    setBrochureSuccess(true);
    const content = `================================================
${(project.name || '').toUpperCase()} • PROJECT BROCHURE
================================================
Developer: ${project.developer || 'N/A'}
Project Type: ${project.projectType || 'Residential'}
Structure: ${project.structure || 'N/A'}
Land Parcel: ${project.landParcel || 'N/A'}
Location: ${project.fullLocation || project.location || 'Pune'}
MahaRERA Registration No: ${project.reraNumber || 'N/A'}
Possession: ${project.possession || 'N/A'}

CONFIGURATIONS & UNIT TYPES:
${(project.units || []).map(u => `• ${u.type} - Carpet Area: ${u.carpetArea}`).join('\n')}

ON-SITE AMENITIES:
${(project.amenities || []).map(a => `• ${a}`).join('\n')}

LOCATION:
${project.locationDescription || project.overviewText || ''}

DISCLAIMER:
${project.disclaimer || 'Figures on this page are drawn from public developer filings and verified against MahaRERA documentation. Please verify all details on Pureframe and on the MahaRERA website before you decide.'}
================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${project.slug || project.id}-brochure.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setTimeout(() => setBrochureSuccess(false), 4000);
  };

  const handleSubmitEnquiry = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    setFormSubmitted(true);
  };

  return (
    <div style={{
      background: '#F8F5EE',
      minHeight: '100vh',
      color: '#1A1A1A',
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
    }}>
      {/* Main Page Content */}
      <main style={{ maxWidth: '1180px', margin: '0 auto', padding: '24px 20px 80px' }}>
        
        {/* 2. Breadcrumbs */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.75rem',
          color: '#8A8275',
          marginBottom: '20px'
        }}>
          <button
            type="button"
            onClick={() => onNavigate('home')}
            style={{
              background: 'none',
              border: 'none',
              color: '#8A8275',
              cursor: 'pointer',
              padding: 0,
              fontSize: '0.75rem'
            }}
          >
            Home
          </button>
          <span>/</span>
          <button
            type="button"
            onClick={() => onNavigate('home')}
            style={{
              background: 'none',
              border: 'none',
              color: '#8A8275',
              cursor: 'pointer',
              padding: 0,
              fontSize: '0.75rem'
            }}
          >
            Projects
          </button>
          <span>/</span>
          <span style={{ color: '#1A1A1A', fontWeight: 600 }}>
            {project.name}
          </span>
        </div>

        {/* 3. HERO SECTION matching screenshot 1 */}
        <section style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.15fr) minmax(0, 0.95fr)',
          gap: '40px',
          alignItems: 'center',
          marginBottom: '44px'
        }}>
          {/* Left Hero Content */}
          <div>
            <div style={{
              fontSize: '0.75rem',
              fontWeight: 800,
              color: '#8C7355',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: '10px'
            }}>
              {project.tagline || 'RESIDENTIAL • PUNAWALE, PUNE'}
            </div>

            <h1 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: '2.5rem',
              fontWeight: 700,
              color: '#1A1A1A',
              margin: '0 0 16px 0',
              lineHeight: 1.2
            }}>
              {project.name}
            </h1>

            <p style={{
              fontSize: '0.98rem',
              color: '#4A4843',
              lineHeight: 1.6,
              margin: '0 0 28px 0',
              maxWidth: '520px'
            }}>
              {project.overviewText}
            </p>

            {/* CTA Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setShowEnquiryModal(true)}
                style={{
                  background: '#C59B27',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '11px 24px',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = '#B38A1F'}
                onMouseOut={(e) => e.currentTarget.style.background = '#C59B27'}
              >
                Enquire Now
              </button>

              <button
                type="button"
                onClick={handleBrochureDownload}
                style={{
                  background: 'transparent',
                  border: '1.5px solid #1A1A1A',
                  color: '#1A1A1A',
                  borderRadius: '6px',
                  padding: '10px 22px',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = '#1A1A1A';
                  e.currentTarget.style.color = '#FFFFFF';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#1A1A1A';
                }}
              >
                {brochureSuccess ? 'Downloaded ✓' : 'Download Brochure'}
              </button>
            </div>

            <div style={{ fontSize: '0.75rem', color: '#8A8275' }}>
              MahaRERA {project.id === 'vyana' ? 'project ' : ''}registration no: <span style={{ fontWeight: 600, color: '#1A1A1A' }}>{project.reraNumber}</span>
            </div>
          </div>

          {/* Right Hero Image Card */}
          <div>
            <div style={{
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
              border: '1px solid #E6E0D5',
              background: '#FFFFFF',
              maxHeight: '320px'
            }}>
              <img
                src={project.image}
                alt={project.name}
                style={{
                  width: '100%',
                  height: '290px',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
            </div>
            <div style={{
              fontSize: '0.72rem',
              color: '#8A8275',
              fontStyle: 'italic',
              marginTop: '8px',
              textAlign: 'left'
            }}>
              {project.imageCaption || "Artist's impression from the developer's marketing material."}
            </div>
          </div>
        </section>

        {/* 4. STATS BAR matching screenshot 1 */}
        <section style={{
          borderTop: '1px solid #E2DBCF',
          borderBottom: '1px solid #E2DBCF',
          padding: '28px 0',
          marginBottom: '54px'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '24px'
          }}>
            <div>
              <div style={{ fontSize: '0.68rem', color: '#8A8275', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 800 }}>
                CONFIGURATION
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1A1A1A', marginTop: '6px' }}>
                {project.bhk}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.68rem', color: '#8A8275', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 800 }}>
                CARPET AREA
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1A1A1A', marginTop: '6px' }}>
                {project.carpetArea}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.68rem', color: '#8A8275', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 800 }}>
                POSSESSION
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1A1A1A', marginTop: '6px' }}>
                {project.possession}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.68rem', color: '#8A8275', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 800 }}>
                {project.landParcelLabel || 'LAND PARCEL'}
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1A1A1A', marginTop: '6px' }}>
                {project.landParcel}
              </div>
            </div>
          </div>
        </section>

        {/* 5. OVERVIEW Section matching screenshot 1 */}
        <section style={{ marginBottom: '54px' }}>
          <div style={{
            fontSize: '0.72rem',
            fontWeight: 800,
            color: '#8C7355',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: '6px'
          }}>
            OVERVIEW
          </div>

          <h2 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: '1.85rem',
            fontWeight: 700,
            color: '#1A1A1A',
            margin: '0 0 20px 0'
          }}>
            What {project.shortName || project.name} is
          </h2>

          {/* Specifications Table */}
          <div style={{ borderTop: '1px solid #E2DBCF', maxWidth: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid #E2DBCF', fontSize: '0.9rem' }}>
              <span style={{ color: '#5A5852' }}>Developer</span>
              <span style={{ color: '#1A1A1A', fontWeight: 700 }}>{project.developer}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid #E2DBCF', fontSize: '0.9rem' }}>
              <span style={{ color: '#5A5852' }}>Project type</span>
              <span style={{ color: '#1A1A1A', fontWeight: 700 }}>{project.projectType}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid #E2DBCF', fontSize: '0.9rem' }}>
              <span style={{ color: '#5A5852' }}>Structure</span>
              <span style={{ color: '#1A1A1A', fontWeight: 700 }}>{project.structure}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid #E2DBCF', fontSize: '0.9rem' }}>
              <span style={{ color: '#5A5852' }}>{project.masterDevelopment ? 'Master development' : 'Land parcel'}</span>
              <span style={{ color: '#1A1A1A', fontWeight: 700 }}>{project.masterDevelopment || project.landParcel}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid #E2DBCF', fontSize: '0.9rem' }}>
              <span style={{ color: '#5A5852' }}>Location</span>
              <span style={{ color: '#1A1A1A', fontWeight: 700 }}>{project.fullLocation}</span>
            </div>
          </div>

          <p style={{
            fontSize: '0.8rem',
            color: '#8A8275',
            lineHeight: 1.6,
            marginTop: '20px',
            margin: '20px 0 0 0'
          }}>
            {project.disclaimer}
          </p>
        </section>

        {/* 6. CONFIGURATIONS Section matching screenshot 1 */}
        <section style={{ marginBottom: '54px' }}>
          <div style={{
            fontSize: '0.72rem',
            fontWeight: 800,
            color: '#8C7355',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: '6px'
          }}>
            CONFIGURATIONS
          </div>

          <h2 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: '1.85rem',
            fontWeight: 700,
            color: '#1A1A1A',
            margin: '0 0 20px 0'
          }}>
            Unit types and areas
          </h2>

          {/* Table Container */}
          <div style={{
            background: '#FFFFFF',
            border: '1px solid #E2DBCF',
            borderRadius: '6px',
            overflow: 'hidden'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: '#FAF7F0', borderBottom: '1px solid #E2DBCF' }}>
                  <th style={{ padding: '14px 20px', fontWeight: 700, color: '#4A4843', width: '50%' }}>Type</th>
                  <th style={{ padding: '14px 20px', fontWeight: 700, color: '#4A4843', width: '50%' }}>Carpet area</th>
                </tr>
              </thead>
              <tbody>
                {project.units.map((unit, idx) => (
                  <tr key={idx} style={{ borderBottom: idx !== project.units.length - 1 ? '1px solid #EFEAE0' : 'none' }}>
                    <td style={{ padding: '15px 20px', color: '#1A1A1A', fontWeight: 500 }}>{unit.type}</td>
                    <td style={{ padding: '15px 20px', color: '#4A4843' }}>{unit.carpetArea}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 7. AMENITIES Section matching screenshot 2 */}
        <section style={{ marginBottom: '54px' }}>
          <div style={{
            fontSize: '0.72rem',
            fontWeight: 800,
            color: '#8C7355',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: '6px'
          }}>
            AMENITIES
          </div>

          <h2 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: '1.85rem',
            fontWeight: 700,
            color: '#1A1A1A',
            margin: '0 0 20px 0'
          }}>
            On-site amenities
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px'
          }}>
            {project.amenities.map((item, idx) => (
              <div
                key={idx}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E2DBCF',
                  borderRadius: '6px',
                  padding: '12px 18px',
                  fontSize: '0.875rem',
                  color: '#2A2926',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#C59B27' }} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 8. LOCATION Section matching screenshot 2 */}
        <section style={{ marginBottom: '54px' }}>
          <div style={{
            fontSize: '0.72rem',
            fontWeight: 800,
            color: '#8C7355',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: '6px'
          }}>
            LOCATION
          </div>

          <h2 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: '1.85rem',
            fontWeight: 700,
            color: '#1A1A1A',
            margin: '0 0 14px 0'
          }}>
            {project.locationHeading || 'Punawale, Pune'}
          </h2>

          <p style={{
            fontSize: '0.95rem',
            color: '#4A4843',
            lineHeight: 1.6,
            margin: 0,
            maxWidth: '680px'
          }}>
            {project.locationDescription || 'Supreme Rivana sits in Punawale, between NH 48 and the Wakad-Ravet BRTS road, close to Tathawade and the Hinjawadi IT hub.'}
          </p>
        </section>

        {/* 9. FAQ / COMMON QUESTIONS Section matching screenshot 2 */}
        <section style={{ marginBottom: '64px' }}>
          <div style={{
            fontSize: '0.72rem',
            fontWeight: 800,
            color: '#8C7355',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: '6px'
          }}>
            FAQ
          </div>

          <h2 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: '1.85rem',
            fontWeight: 700,
            color: '#1A1A1A',
            margin: '0 0 20px 0'
          }}>
            Common questions
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {(project.faqs || []).map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #E2DBCF',
                    borderRadius: '6px',
                    overflow: 'hidden'
                  }}
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    style={{
                      width: '100%',
                      padding: '16px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'none',
                      border: 'none',
                      textAlign: 'left',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      color: '#1A1A1A',
                      cursor: 'pointer'
                    }}
                  >
                    <span>{faq.question}</span>
                    <span style={{ color: '#8C7355', marginLeft: '12px' }}>
                      {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </span>
                  </button>

                  {isOpen && (
                    <div style={{
                      padding: '0 20px 18px',
                      fontSize: '0.875rem',
                      color: '#5A5852',
                      lineHeight: 1.6,
                      borderTop: '1px solid #F5F1E8'
                    }}>
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Back Link to Pune Explorer */}
        <div style={{ textAlign: 'center', paddingTop: '20px', borderTop: '1px solid #E2DBCF' }}>
          <button
            type="button"
            onClick={() => onNavigate('home')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: '#FFFFFF',
              border: '1px solid #D8D2C4',
              borderRadius: '8px',
              padding: '10px 20px',
              color: '#1A1A1A',
              fontWeight: 600,
              fontSize: '0.875rem',
              cursor: 'pointer'
            }}
          >
            <ArrowLeft size={16} />
            <span>← Back to All Pune Projects</span>
          </button>
        </div>

      </main>

      {/* FLOATING WHATSAPP BUTTON (from Screenshot 2) */}
      <a
        href={`https://wa.me/919876543210?text=Hello,%20I%20am%20interested%20in%20${encodeURIComponent(project.name)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: '#25D366',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
          zIndex: 999,
          cursor: 'pointer',
          transition: 'transform 0.2s ease'
        }}
        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1.0)'}
      >
        <MessageCircle size={32} />
      </a>

      {/* ENQUIRY MODAL */}
      {showEnquiryModal && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1100,
            padding: '16px'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowEnquiryModal(false);
          }}
        >
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            maxWidth: '460px',
            width: '100%',
            padding: '32px',
            position: 'relative',
            boxShadow: '0 20px 40px rgba(0,0,0,0.25)'
          }}>
            <button
              type="button"
              onClick={() => setShowEnquiryModal(false)}
              aria-label="Close"
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: '#F5F2EA',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#666'
              }}
            >
              <X size={18} />
            </button>

            {formSubmitted ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: '#ECFDF5',
                  color: '#059669',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px'
                }}>
                  <CheckCircle2 size={32} />
                </div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 700, margin: '0 0 8px 0', color: '#1A1A1A' }}>
                  Enquiry Received
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#666', lineHeight: 1.5, margin: '0 0 20px 0' }}>
                  Thank you, <b>{formData.name}</b>. An advisor with verified pricing and unit availability for <b>{project.name}</b> will connect with you on <b>{formData.phone}</b>.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setFormSubmitted(false);
                    setShowEnquiryModal(false);
                  }}
                  style={{
                    background: '#1A1A1A',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '10px 24px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitEnquiry}>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#C59B27', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
                  ENQUIRE ABOUT {project.name.toUpperCase()}
                </div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#1A1A1A', margin: '0 0 8px 0' }}>
                  Get Official Brochure &amp; Floor Plans
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#666', margin: '0 0 20px 0' }}>
                  Receive verified unit availability and floor layout plans direct from the developer.
                </p>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#333', marginBottom: '6px' }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your name"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '6px',
                      border: '1px solid #DDD',
                      fontSize: '0.9rem',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#333', marginBottom: '6px' }}>
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 Mobile number"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '6px',
                      border: '1px solid #DDD',
                      fontSize: '0.9rem',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#333', marginBottom: '6px' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your.email@example.com"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '6px',
                      border: '1px solid #DDD',
                      fontSize: '0.9rem',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#333', marginBottom: '6px' }}>
                    Preferred Configuration
                  </label>
                  <select
                    value={selectedUnitType}
                    onChange={(e) => setSelectedUnitType(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '6px',
                      border: '1px solid #DDD',
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
                    background: '#C59B27',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '12px',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = '#B38A1F'}
                  onMouseOut={(e) => e.currentTarget.style.background = '#C59B27'}
                >
                  Submit &amp; Request Brochure
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
