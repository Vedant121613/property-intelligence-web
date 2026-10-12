import React, { useState } from 'react';
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  Download, 
  Eye, 
  ExternalLink, 
  Building2, 
  MapPin, 
  ShieldCheck, 
  Filter, 
  ArrowLeft,
  X,
  Layers,
  Sparkles,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { useRequests } from '../context/RequestContext';
import { useAuth } from '../context/AuthContext';

export default function RequestCompletionPage({ onNavigate }) {
  const { requests } = useRequests();
  const { user } = useAuth();

  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'completed', 'pending'
  const [previewPdfModal, setPreviewPdfModal] = useState(null); // request object to preview

  // Filter requests for the current user
  const userRequests = requests.filter(r => 
    r.userId === user?.id || r.userEmail === user?.email || user?.role === 'admin'
  );

  const completedRequests = userRequests.filter(r => r.status === 'completed' || r.status === 'shared');
  const pendingRequests = userRequests.filter(r => r.status === 'pending');

  const filteredList = userRequests.filter(r => {
    if (filterStatus === 'completed') return r.status === 'completed' || r.status === 'shared';
    if (filterStatus === 'pending') return r.status === 'pending';
    return true;
  });

  const handleDownloadPdf = (req) => {
    if (!req.pdfFileData && !req.sharedLink) {
      alert('PDF file is not yet available for this request.');
      return;
    }

    const downloadUrl = req.pdfFileData || req.sharedLink;
    const fileName = req.pdfFileName || `${req.docType}_${req.id}.pdf`;

    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '90vh', padding: '28px 0 64px' }}>
      <div className="content-wrapper">
        
        {/* Top Header & Breadcrumb Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '28px'
        }}>
          <div>
            <button
              type="button"
              onClick={() => onNavigate('home')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                padding: '6px 12px',
                borderRadius: '8px',
                color: '#475569',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                marginBottom: '12px'
              }}
            >
              <ArrowLeft size={14} />
              <span>Back to Home</span>
            </button>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#dcfce7',
              border: '1px solid #86efac',
              color: '#15803d',
              padding: '3px 10px',
              borderRadius: '999px',
              fontSize: '0.75rem',
              fontWeight: 800,
              marginBottom: '8px',
              marginLeft: '8px'
            }}>
              <CheckCircle2 size={13} />
              <span>OFFICIAL DELIVERY DESK</span>
            </div>

            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>
              Request Completion &amp; PDF Repository
            </h1>
            <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
              Track fulfillment status of your Registered Deeds &amp; Index 2 requests. When the Admin uploads the official PDF, view or download it directly here.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => onNavigate('admin')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: '#faf5ff',
                border: '1px solid #d8b4fe',
                color: '#7e22ce',
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '0.825rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <ShieldCheck size={15} />
              <span>Open Admin Panel (To Upload PDF)</span>
            </button>
          </div>
        </div>

        {/* Status Metrics Bar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}>
          <div style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '14px',
            padding: '18px 20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
          }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
              Total Requests Placed
            </div>
            <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
              {userRequests.length}
            </div>
          </div>

          <div style={{
            background: '#ffffff',
            border: '1px solid #bbf7d0',
            borderRadius: '14px',
            padding: '18px 20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
          }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#166534', textTransform: 'uppercase' }}>
              Completed &amp; PDF Uploaded
            </div>
            <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#16a34a', marginTop: '4px' }}>
              {completedRequests.length}
            </div>
          </div>

          <div style={{
            background: '#ffffff',
            border: '1px solid #fde68a',
            borderRadius: '14px',
            padding: '18px 20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
          }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#b45309', textTransform: 'uppercase' }}>
              Pending Admin Upload
            </div>
            <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#d97706', marginTop: '4px' }}>
              {pendingRequests.length}
            </div>
          </div>
        </div>

        {/* Filter Navigation Tabs */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '20px',
          borderBottom: '1px solid #e2e8f0',
          paddingBottom: '10px'
        }}>
          <button
            type="button"
            onClick={() => setFilterStatus('all')}
            style={{
              background: filterStatus === 'all' ? '#0f172a' : '#ffffff',
              color: filterStatus === 'all' ? '#ffffff' : '#475569',
              border: '1px solid #cbd5e1',
              padding: '6px 14px',
              borderRadius: '8px',
              fontSize: '0.825rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            All Requests ({userRequests.length})
          </button>

          <button
            type="button"
            onClick={() => setFilterStatus('completed')}
            style={{
              background: filterStatus === 'completed' ? '#16a34a' : '#ffffff',
              color: filterStatus === 'completed' ? '#ffffff' : '#475569',
              border: '1px solid #cbd5e1',
              padding: '6px 14px',
              borderRadius: '8px',
              fontSize: '0.825rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Completed / PDF Ready ({completedRequests.length})
          </button>

          <button
            type="button"
            onClick={() => setFilterStatus('pending')}
            style={{
              background: filterStatus === 'pending' ? '#d97706' : '#ffffff',
              color: filterStatus === 'pending' ? '#ffffff' : '#475569',
              border: '1px solid #cbd5e1',
              padding: '6px 14px',
              borderRadius: '8px',
              fontSize: '0.825rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Pending Fulfillment ({pendingRequests.length})
          </button>
        </div>

        {/* Request Cards List */}
        {filteredList.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredList.map((req) => {
              const isCompleted = req.status === 'completed' || req.status === 'shared';
              const isDeed = req.docType === 'registered_deed';
              const hasPdf = Boolean(req.pdfFileData || req.sharedLink);

              return (
                <div
                  key={req.id}
                  style={{
                    background: '#ffffff',
                    border: `1px solid ${isCompleted ? '#bbf7d0' : '#fde68a'}`,
                    borderRadius: '16px',
                    padding: '24px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px'
                  }}
                >
                  {/* Card Header Row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        background: isCompleted ? '#dcfce7' : '#fef3c7',
                        color: isCompleted ? '#16a34a' : '#d97706',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {isDeed ? <FileText size={22} /> : <Layers size={22} />}
                      </div>

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <span style={{
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            background: '#f1f5f9',
                            color: '#334155',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            border: '1px solid #e2e8f0'
                          }}>
                            {req.id}
                          </span>
                          <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                            {req.projectName}
                          </h3>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '3px' }}>
                          Requested Document: <b style={{ color: '#0f172a' }}>{req.docTitle}</b>
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div style={{ textAlign: 'right' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: isCompleted ? '#dcfce7' : '#fef3c7',
                        color: isCompleted ? '#15803d' : '#b45309',
                        padding: '5px 12px',
                        borderRadius: '999px',
                        fontSize: '0.8rem',
                        fontWeight: 800,
                        border: `1px solid ${isCompleted ? '#86efac' : '#fde68a'}`
                      }}>
                        {isCompleted ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                        <span>{isCompleted ? 'Request Completed (PDF Ready)' : 'Pending Admin Verification'}</span>
                      </span>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>
                        Fee Paid: ₹{req.fee} (Wallet) • {new Date(req.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </div>
                    </div>
                  </div>

                  {/* Property Details Matrix */}
                  <div style={{
                    background: '#f8fafc',
                    borderRadius: '12px',
                    padding: '14px 18px',
                    border: '1px solid #e2e8f0',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '12px',
                    fontSize: '0.825rem'
                  }}>
                    <div>
                      <span style={{ color: '#64748b', fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 700 }}>Taluka &amp; Village:</span>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>
                        {req.village}, {req.taluka}
                      </div>
                    </div>

                    <div>
                      <span style={{ color: '#64748b', fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 700 }}>Building &amp; Floor:</span>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>
                        {req.buildingName || 'Not specified'} {req.floor ? `(${req.floor})` : ''} {req.flatNo ? `• ${req.flatNo}` : ''}
                      </div>
                    </div>

                    <div>
                      <span style={{ color: '#64748b', fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 700 }}>MahaRERA ID:</span>
                      <div style={{ fontWeight: 700, color: '#2563eb' }}>
                        {req.reraId || 'P52100008590'}
                      </div>
                    </div>

                    <div>
                      <span style={{ color: '#64748b', fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 700 }}>Default Coordinates:</span>
                      <div style={{ fontWeight: 700, color: '#16a34a', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={12} />
                        <span>
                          {req.coordinates ? `${req.coordinates.lat}° N, ${req.coordinates.lng}° E` : '18.5204° N, 73.8567° E'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* FULFILLMENT / PDF SECTION */}
                  {isCompleted ? (
                    <div style={{
                      background: '#f0fdf4',
                      border: '1px solid #86efac',
                      borderRadius: '12px',
                      padding: '16px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '14px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '8px',
                          background: '#16a34a',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <FileText size={20} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, color: '#14532d', fontSize: '0.925rem' }}>
                            {req.pdfFileName || `${req.docType}_${req.id}.pdf`}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#166534', marginTop: '2px' }}>
                            Size: {req.pdfFileSize || '1.2 MB'} • {req.adminNotes || 'Certified and uploaded by MahaRERA Admin Officer'}
                          </div>
                        </div>
                      </div>

                      {/* PDF Action Buttons: View & Download */}
                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          onClick={() => setPreviewPdfModal(req)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            background: '#ffffff',
                            color: '#166534',
                            border: '1px solid #86efac',
                            padding: '8px 14px',
                            borderRadius: '8px',
                            fontSize: '0.825rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                          }}
                        >
                          <Eye size={15} />
                          <span>View PDF</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDownloadPdf(req)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            background: '#16a34a',
                            color: '#ffffff',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '8px',
                            fontSize: '0.825rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            boxShadow: '0 2px 8px rgba(22, 163, 74, 0.3)'
                          }}
                        >
                          <Download size={15} />
                          <span>Download PDF</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={{
                      background: '#fffbeb',
                      border: '1px solid #fde68a',
                      borderRadius: '12px',
                      padding: '14px 18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '12px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.825rem', color: '#92400e' }}>
                        <AlertCircle size={16} color="#d97706" />
                        <span>Admin officer has received this request. When the officer uploads the verified PDF, it will appear here immediately for download.</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => onNavigate('admin')}
                        style={{
                          background: '#d97706',
                          color: '#ffffff',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        Upload as Admin Now
                      </button>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        ) : (
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            padding: '64px 24px',
            textAlign: 'center'
          }}>
            <FileText size={48} color="#cbd5e1" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>
              No document requests found for this filter
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#64748b', maxWidth: '480px', margin: '0 auto 20px' }}>
              You haven't requested any Registered Deeds or Index 2 extracts yet. Select a property from the hierarchy on Home page to request documents.
            </p>
            <button
              type="button"
              onClick={() => onNavigate('home')}
              style={{
                background: '#2563eb',
                color: '#ffffff',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '10px',
                fontSize: '0.875rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Select Property on Home Page
            </button>
          </div>
        )}

      </div>

      {/* PDF PREVIEW MODAL */}
      {previewPdfModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(6px)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '850px',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3)',
            overflow: 'hidden'
          }}>
            {/* Modal Header */}
            <div style={{
              background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
              color: '#ffffff',
              padding: '18px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>
                  {previewPdfModal.docTitle}
                </h3>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>
                  {previewPdfModal.projectName} • Tracking ID: {previewPdfModal.id}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => handleDownloadPdf(previewPdfModal)}
                  style={{
                    background: '#16a34a',
                    color: '#ffffff',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Download size={14} />
                  <span>Download</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPreviewPdfModal(null)}
                  style={{
                    background: 'rgba(255,255,255,0.15)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal Body / PDF Frame */}
            <div style={{ flex: 1, minHeight: '520px', background: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
              {previewPdfModal.pdfFileData ? (
                <iframe
                  src={previewPdfModal.pdfFileData}
                  title="Official PDF Preview"
                  style={{ width: '100%', height: '100%', minHeight: '520px', border: 'none' }}
                />
              ) : (
                <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                  <FileText size={48} color="#94a3b8" style={{ margin: '0 auto 12px' }} />
                  <p>Document available at external registry link:</p>
                  <a
                    href={previewPdfModal.sharedLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#2563eb', fontWeight: 700 }}
                  >
                    Open Document Link
                  </a>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
