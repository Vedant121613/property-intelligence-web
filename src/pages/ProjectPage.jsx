import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Package, 
  Info, 
  ArrowDown, 
  Search, 
  ChevronRight,
  Zap,
  ChevronDown,
  ShieldCheck,
  MapPin,
  FileText,
  Wallet,
  CheckCircle2,
  ExternalLink,
  Clock,
  Sparkles,
  Download
} from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';
import TransactionsTable from '../components/TransactionsTable';
import EmptyState from '../components/EmptyState';
import TransactionsModal from '../components/TransactionsModal';
import ProjectCard from '../components/ProjectCard';
import ProjectMap from '../components/ProjectMap';
import WalletPaymentModal from '../components/WalletPaymentModal';
import { getProjectDetails } from '../services/propertyService';
import { useRequests } from '../context/RequestContext';

export default function ProjectPage({
  cityId = 'pune',
  localityId = 'saswad-road',
  projectId = 'heera-solitaire',
  talukaId,
  villageName,
  talukaName,
  onNavigate
}) {
  const { getProjectRequests } = useRequests();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAllTxnsModal, setShowAllTxnsModal] = useState(false);
  const [bhkFilter, setBhkFilter] = useState('all');

  // Wallet payment modal state
  const [activePaymentModal, setActivePaymentModal] = useState(null); // 'registered_deed' | 'index_2' | null

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    getProjectDetails(projectId, talukaId, localityId)
      .then(res => {
        if (isMounted) {
          setProject(res);
          setLoading(false);
        }
      })
      .catch(err => {
        console.error(err);
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [projectId, talukaId, localityId]);

  if (loading || !project) {
    return (
      <div style={{ padding: '80px 0', textAlign: 'center', color: '#64748B', minHeight: '60vh' }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          border: '3px solid #e2e8f0',
          borderTopColor: '#2563eb',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 16px'
        }} />
        Loading project details for {projectId}...
      </div>
    );
  }

  const cityName = 'Pune';
  const localityName = villageName || project.locality || 'Pune';
  const talName = talukaName || project.taluka || 'Haveli';

  // Existing requests for this project
  const projectRequests = getProjectRequests(project.id, project.rera);

  const breadcrumbs = [
    { label: 'Pune', target: { page: 'home', params: {} } },
    { label: 'District: Pune', target: { page: 'home', params: {} } },
    { label: `Taluka: ${talName}`, target: { page: 'home', params: {} } },
    { label: `Village: ${localityName}`, target: { page: 'home', params: {} } },
    { label: project.name }
  ];

  return (
    <main className="project-detail-section" style={{ background: '#f8fafc', padding: '24px 0 64px' }}>
      <div className="content-wrapper">
        {/* Breadcrumb Trail */}
        <div style={{ marginBottom: '18px' }}>
          <Breadcrumbs items={breadcrumbs} onNavigate={onNavigate} />
        </div>

        {/* Project Header Overview Card */}
        <div className="project-overview-card" style={{ marginBottom: '24px' }}>
          <div className="project-title-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div className="project-logo-badge" style={{ background: '#2563eb', color: '#ffffff' }}>
                <Building2 size={24} />
              </div>
              <div className="project-name-area">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <h1 style={{ margin: 0 }}>{project.name}</h1>
                  <span style={{
                    background: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    color: '#1d4ed8',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    padding: '3px 10px',
                    borderRadius: '999px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <ShieldCheck size={13} color="#2563eb" />
                    <span>MahaRERA: {project.rera || project.reraNumbers || 'P52100008590'}</span>
                  </span>
                </div>
                <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.9rem' }}>
                  {localityName}, {talName} Taluka, Pune District • MahaRERA Certified
                </p>
              </div>
            </div>

            {/* ACTION BUTTONS: REQUEST REGISTERED DEED & REQUEST INDEX 2 */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setActivePaymentModal('registered_deed')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 18px',
                  borderRadius: '10px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)',
                  color: '#ffffff',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(29, 78, 216, 0.35)',
                  transition: 'all 0.2s'
                }}
              >
                <FileText size={16} />
                <span>Request Registered Deed</span>
                <span style={{
                  background: 'rgba(255,255,255,0.2)',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: '0.75rem'
                }}>
                  ₹999 (Wallet)
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActivePaymentModal('index_2')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 18px',
                  borderRadius: '10px',
                  border: '1px solid #10b981',
                  background: '#ecfdf5',
                  color: '#065f46',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(16, 185, 129, 0.15)',
                  transition: 'all 0.2s'
                }}
              >
                <FileText size={16} color="#059669" />
                <span>Request Index 2</span>
                <span style={{
                  background: '#d1fae5',
                  color: '#047857',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: '0.75rem'
                }}>
                  ₹499 (Wallet)
                </span>
              </button>
            </div>
          </div>

          {/* ACTIVE REQUESTS STATUS & SHARED LINKS (IF ANY) */}
          {projectRequests.length > 0 && (
            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {projectRequests.map((req) => (
                <div
                  key={req.id}
                  style={{
                    background: req.status === 'shared' ? '#f0fdf4' : '#fffbeb',
                    border: `1px solid ${req.status === 'shared' ? '#bbf7d0' : '#fde68a'}`,
                    borderRadius: '12px',
                    padding: '14px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      background: req.status === 'shared' ? '#dcfce7' : '#fef3c7',
                      color: req.status === 'shared' ? '#16a34a' : '#d97706',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {req.status === 'shared' ? <CheckCircle2 size={20} /> : <Clock size={20} />}
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a' }}>
                          {req.docTitle}
                        </span>
                        <span style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '6px',
                          background: req.status === 'shared' ? '#dcfce7' : '#fef3c7',
                          color: req.status === 'shared' ? '#15803d' : '#b45309'
                        }}>
                          {req.status === 'shared' ? '✓ LINK SHARED BY ADMIN' : '⏳ AWAITING ADMIN LINK'}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                        Request ID: {req.id} • Paid via Wallet (₹{req.fee})
                        {req.adminNotes && ` • Note: ${req.adminNotes}`}
                      </div>
                    </div>
                  </div>

                  {req.status === 'shared' && req.sharedLink ? (
                    <a
                      href={req.sharedLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: '#0f172a',
                        color: '#ffffff',
                        padding: '9px 16px',
                        borderRadius: '8px',
                        fontSize: '0.825rem',
                        fontWeight: 700,
                        textDecoration: 'none'
                      }}
                    >
                      <Download size={14} />
                      <span>Open Document Link</span>
                      <ExternalLink size={13} />
                    </a>
                  ) : (
                    <span style={{ fontSize: '0.775rem', color: '#d97706', fontWeight: 600 }}>
                      Processing with Sub-Registrar records...
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Project Body Grid with Specs */}
          <div className="project-body-grid" style={{ marginTop: '20px' }}>
            {/* Photo / Architectural Graphic */}
            <div className="photo-placeholder-box" style={{ background: '#f1f5f9', minHeight: '160px' }}>
              <Package size={32} strokeWidth={1.5} color="#94A3B8" />
              <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 500 }}>
                MahaRERA Registered Project Layout
              </span>
            </div>

            {/* Specifications Grid */}
            <div className="specs-grid">
              <div className="spec-cell">
                <span className="spec-label">Total Units</span>
                <span className="spec-value">{project.totalUnits}</span>
              </div>

              <div className="spec-cell">
                <span className="spec-label">
                  Sold Units
                  <Info size={12} color="#94A3B8" />
                </span>
                <span className="spec-value">{project.soldUnits}</span>
              </div>

              <div className="spec-cell">
                <span className="spec-label">
                  Completion
                  <Info size={12} color="#94A3B8" />
                </span>
                <span className="spec-value">{project.completion}</span>
              </div>

              <div className="spec-cell">
                <span className="spec-label">BHKs</span>
                <span className="spec-value">{project.bhks || '1, 2, 3 BHK'}</span>
              </div>

              <div className="spec-cell">
                <span className="spec-label">Quoted Pricing</span>
                <span className="spec-value">{project.quotedPricing}</span>
              </div>

              <div className="spec-cell">
                <span className="spec-label">Developer</span>
                <span className="spec-value">{project.developer}</span>
              </div>

              <div className="spec-cell">
                <span className="spec-label">RERA Number(s)</span>
                <span className="spec-value" style={{ color: '#2563eb', fontWeight: 800 }}>
                  {project.reraNumbers || project.rera || '-'}
                </span>
              </div>

              <div className="spec-cell">
                <span className="spec-label">Coordinates</span>
                <span className="spec-value" style={{ fontSize: '0.8rem', color: '#059669' }}>
                  {project.latitude?.toFixed(4)}° N, {project.longitude?.toFixed(4)}° E
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* INTERACTIVE GEOGRAPHIC MAP SECTION */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <MapPin size={20} color="#2563eb" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Location &amp; Geo-Coordinates Map
            </h2>
          </div>

          <ProjectMap
            latitude={project.latitude}
            longitude={project.longitude}
            projectName={project.name}
            reraId={project.rera || project.reraNumbers}
            address={project.address}
            village={localityName}
            taluka={talName}
          />
        </div>

        {/* BHK Analysis Section */}
        {project.bhkAnalysis && (
          <div className="bhk-analysis-card" style={{ marginBottom: '24px' }}>
            <div className="bhk-analysis-header">
              <div className="bhk-title-group">
                <h2>{project.name} BHK Analysis</h2>
                <div className="bhk-select-wrapper">
                  <select 
                    value={bhkFilter} 
                    onChange={(e) => setBhkFilter(e.target.value)}
                    className="bhk-filter-select"
                    aria-label="Filter BHK Analysis"
                  >
                    <option value="all">All</option>
                    <option value="1bhk">1 BHK</option>
                    <option value="2bhk">2 BHK</option>
                    <option value="3bhk">3 BHK</option>
                  </select>
                </div>
              </div>

              <div className="bhk-meta-group">
                <span className="bhk-updated-stamp">
                  {project.bhkAnalysis.updatedDate || 'Last Updated on MahaRERA - 2026'}
                </span>
              </div>
            </div>

            <div className="bhk-analysis-body">
              <div className="bhk-donut-metric-row">
                <div className="bhk-donut-graphic">
                  <svg width="76" height="76" viewBox="0 0 76 76">
                    <circle cx="38" cy="38" r="32" fill="none" stroke="#E0F2FE" strokeWidth="7" />
                    <circle
                      cx="38"
                      cy="38"
                      r="32"
                      fill="none"
                      stroke="#0284C7"
                      strokeWidth="7"
                      strokeDasharray="201"
                      strokeDashoffset={201 * (1 - (project.bhkAnalysis.soldPercentage || 78) / 100)}
                      strokeLinecap="round"
                      transform="rotate(-90 38 38)"
                    />
                    <text x="38" y="43" textAnchor="middle" fontSize="14" fontWeight="800" fill="#0369A1">
                      {project.bhkAnalysis.soldPercentage || 78}%
                    </text>
                  </svg>
                </div>

                <div className="bhk-donut-summary">
                  <span className="bhk-units-label">UNITS SOLD</span>
                  <span className="bhk-units-count">
                    {project.bhkAnalysis.unitsSoldSummary || '112 of 144'}
                  </span>
                </div>
              </div>

              <div className="bhk-table-container">
                <table className="bhk-breakdown-table">
                  <thead>
                    <tr>
                      <th>BHK</th>
                      <th>TOTAL UNITS</th>
                      <th>UNITS SOLD</th>
                      <th>% UNITS SOLD</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(project.bhkAnalysis.breakdown || [])
                      .filter(item => bhkFilter === 'all' || item.bhk.toLowerCase().replace(/\s+/g, '') === bhkFilter)
                      .map((row, idx) => (
                        <tr key={idx}>
                          <td className="bhk-cell-bold">{row.bhk}</td>
                          <td>{row.totalUnits}</td>
                          <td>{row.unitsSold}</td>
                          <td className="bhk-cell-pct">{row.percentage}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Recent Registered Transactions Section */}
        <TransactionsTable
          transactions={project.transactions}
          totalTransactionsCount={project.totalTransactionsCount || 5}
          onViewAllClick={() => setShowAllTxnsModal(true)}
          onNavigate={onNavigate}
        />
      </div>

      {/* Full Transactions Modal */}
      <TransactionsModal
        isOpen={showAllTxnsModal}
        onClose={() => setShowAllTxnsModal(false)}
        projectName={project.name}
        transactions={project.transactions}
      />

      {/* Wallet-Only Payment & Request Modal */}
      {activePaymentModal && (
        <WalletPaymentModal
          isOpen={!!activePaymentModal}
          onClose={() => setActivePaymentModal(null)}
          project={project}
          docType={activePaymentModal}
          onNavigate={onNavigate}
          onSuccess={(req) => {
            console.log('Document request submitted successfully:', req);
          }}
        />
      )}
    </main>
  );
}
