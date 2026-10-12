import React from 'react';
import { 
  X, 
  FileText, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  Download, 
  Building2, 
  ShieldCheck 
} from 'lucide-react';
import { useRequests } from '../context/RequestContext';
import { useAuth } from '../context/AuthContext';

export default function MyRequestsModal({ isOpen, onClose, onNavigate }) {
  const { requests } = useRequests();
  const { user } = useAuth();

  if (!isOpen) return null;

  // Filter requests for user (or all if demo)
  const userRequests = requests.filter(r => r.userId === user?.id || r.userEmail === user?.email || user?.role === 'admin');

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.7)',
        backdropFilter: 'blur(6px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          width: '100%',
          maxWidth: '560px',
          background: '#ffffff',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid #e2e8f0',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          color: '#ffffff',
          padding: '22px 24px',
          position: 'relative'
        }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '18px',
              right: '18px',
              background: 'rgba(255, 255, 255, 0.15)',
              border: 'none',
              borderRadius: '50%',
              width: '30px',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              cursor: 'pointer'
            }}
          >
            <X size={16} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <FileText size={18} color="#60a5fa" />
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#93c5fd', textTransform: 'uppercase' }}>
              DOCUMENT TRACKING
            </span>
          </div>

          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: '0 0 4px', color: '#ffffff' }}>
            My Document Requests ({userRequests.length})
          </h2>
          <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
            Track certified Registered Deeds and Index 2 documents requested via Wallet
          </div>
        </div>

        {/* Body List */}
        <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
          {userRequests.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {userRequests.map((req) => {
                const isShared = req.status === 'shared';
                const isDeed = req.docType === 'registered_deed';

                return (
                  <div
                    key={req.id}
                    style={{
                      background: isShared ? '#f0fdf4' : '#fffbeb',
                      border: `1px solid ${isShared ? '#bbf7d0' : '#fde68a'}`,
                      borderRadius: '12px',
                      padding: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                      <div>
                        <span style={{
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          color: '#475569',
                          background: '#ffffff',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          border: '1px solid #e2e8f0'
                        }}>
                          {req.id}
                        </span>
                        <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: '6px 0 2px' }}>
                          {req.projectName}
                        </h4>
                        <div style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: 600 }}>
                          RERA: {req.reraId} • {req.village}, {req.taluka}
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          background: isShared ? '#dcfce7' : '#fef3c7',
                          color: isShared ? '#15803d' : '#b45309'
                        }}>
                          {isShared ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                          <span>{isShared ? 'Link Shared' : 'Pending Link'}</span>
                        </span>
                        <div style={{ fontSize: '0.725rem', color: '#64748b', marginTop: '4px' }}>
                          Paid: ₹{req.fee} via Wallet
                        </div>
                      </div>
                    </div>

                    <div style={{ fontSize: '0.78rem', color: '#475569', borderTop: '1px dashed rgba(0,0,0,0.08)', paddingTop: '8px' }}>
                      <b>Document:</b> {req.docTitle}
                    </div>

                    {(isShared || req.status === 'completed') && (req.pdfFileData || req.sharedLink) && (
                      <div style={{
                        background: '#ffffff',
                        border: '1px solid #bbf7d0',
                        borderRadius: '8px',
                        padding: '10px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '8px'
                      }}>
                        <div style={{ fontSize: '0.75rem', color: '#166534' }}>
                          {req.adminNotes || 'Certified PDF uploaded by MahaRERA Admin.'}
                        </div>

                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              onNavigate && onNavigate('completion');
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              background: '#2563eb',
                              color: '#ffffff',
                              padding: '6px 10px',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              border: 'none',
                              cursor: 'pointer'
                            }}
                          >
                            <span>Open in Request Completion</span>
                          </button>

                          <a
                            href={req.pdfFileData || req.sharedLink}
                            download={req.pdfFileName || `${req.docType}_${req.id}.pdf`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              background: '#16a34a',
                              color: '#ffffff',
                              padding: '6px 12px',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              textDecoration: 'none'
                            }}
                          >
                            <Download size={12} />
                            <span>Download PDF</span>
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 16px', color: '#64748b' }}>
              <FileText size={36} color="#cbd5e1" style={{ margin: '0 auto 8px' }} />
              <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600 }}>No document requests placed yet.</p>
              <p style={{ margin: '4px 0 0', fontSize: '0.78rem', color: '#94a3b8' }}>
                Open any project in Pune to request official Registered Deeds or Index 2 extracts using your wallet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
