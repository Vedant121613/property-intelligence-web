import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Building2, 
  Wallet, 
  User, 
  X, 
  Sparkles,
  Link as LinkIcon,
  Send,
  Eye,
  RefreshCw,
  Upload,
  Download,
  PlusCircle,
  AlertCircle,
  FileUp,
  MapPin
} from 'lucide-react';
import { useRequests } from '../context/RequestContext';
import { useAuth } from '../context/AuthContext';
import { createOfficialPdfBlob, blobToDataUrl, formatFileSize } from '../services/pdfHelper';

export default function AdminPanel({ onNavigate }) {
  const { 
    requests, 
    fulfillRequestWithPdf, 
    adminAddUserWalletFunds, 
    walletBalance, 
    walletHistory 
  } = useRequests();
  const { adminUser, adminLogout } = useAuth();

  const [activeTab, setActiveTab] = useState('all'); // 'all', 'pending', 'completed'
  const [searchQuery, setSearchQuery] = useState('');
  
  // PDF Upload modal state
  const [selectedReq, setSelectedReq] = useState(null);
  const [uploadedPdfFile, setUploadedPdfFile] = useState(null);
  const [pdfDataUrl, setPdfDataUrl] = useState('');
  const [pdfFileName, setPdfFileName] = useState('');
  const [pdfFileSize, setPdfFileSize] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [uploadNotice, setUploadNotice] = useState('');

  // Admin Wallet Top-up Modal State
  const [showAdminWalletModal, setShowAdminWalletModal] = useState(false);
  const [walletAddAmount, setWalletAddAmount] = useState('1000');
  const [walletAddRemark, setWalletAddRemark] = useState('Official Admin Top-up');
  const [walletSuccessNotice, setWalletSuccessNotice] = useState('');

  // Metrics
  const totalCount = requests.length;
  const pendingCount = requests.filter(r => r.status === 'pending').length;
  const completedCount = requests.filter(r => r.status === 'completed' || r.status === 'shared').length;
  const totalRevenue = requests.reduce((acc, r) => acc + (r.fee || 0), 0);

  // Filtered requests
  const filteredRequests = requests.filter(req => {
    if (activeTab === 'pending' && req.status !== 'pending') return false;
    if (activeTab === 'completed' && req.status === 'pending') return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      req.id.toLowerCase().includes(q) ||
      req.projectName.toLowerCase().includes(q) ||
      req.reraId.toLowerCase().includes(q) ||
      req.userName.toLowerCase().includes(q) ||
      req.userEmail.toLowerCase().includes(q) ||
      req.village.toLowerCase().includes(q) ||
      req.taluka.toLowerCase().includes(q)
    );
  });

  // Open PDF upload modal
  const handleOpenUploadModal = (req) => {
    setSelectedReq(req);
    setUploadedPdfFile(null);
    setPdfDataUrl(req.pdfFileData || req.sharedLink || '');
    setPdfFileName(req.pdfFileName || `${req.docType}_${req.id}.pdf`);
    setPdfFileSize(req.pdfFileSize || '1.2 MB');
    setAdminNotes(req.adminNotes || `Verified, certified, and officially retrieved from Sub-Registrar Office (${req.taluka}, Pune).`);
    setUploadNotice('');
  };

  // Handle actual file upload from local machine
  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      alert('Please upload a valid PDF document (.pdf).');
      return;
    }

    setUploadedPdfFile(file);
    setPdfFileName(file.name);
    setPdfFileSize(formatFileSize(file.size));

    const reader = new FileReader();
    reader.onload = () => {
      setPdfDataUrl(reader.result);
      setUploadNotice(`File selected: ${file.name} (${formatFileSize(file.size)})`);
    };
    reader.readAsDataURL(file);
  };

  // 1-Click: Generate official mock certified PDF for this specific request
  const handleGenerateOfficialMockPdf = async () => {
    if (!selectedReq) return;
    setIsGeneratingPdf(true);

    try {
      const blob = createOfficialPdfBlob({
        docType: selectedReq.docType,
        docTitle: selectedReq.docTitle,
        projectName: selectedReq.projectName,
        buildingName: selectedReq.buildingName || '',
        floor: selectedReq.floor || '',
        flatNo: selectedReq.flatNo || '',
        village: selectedReq.village,
        taluka: selectedReq.taluka,
        district: selectedReq.district || 'Pune',
        reraId: selectedReq.reraId,
        coordinates: selectedReq.coordinates,
        requestId: selectedReq.id,
        officerName: 'Joint Sub-Registrar Class-II, Haveli / Pune'
      });

      const dataUrl = await blobToDataUrl(blob);
      const generatedName = `${selectedReq.docType}_${selectedReq.reraId || 'P521'}_Certified.pdf`;

      setPdfDataUrl(dataUrl);
      setPdfFileName(generatedName);
      setPdfFileSize(formatFileSize(blob.size));
      setUploadNotice(`Official certified PDF generated (${formatFileSize(blob.size)}) and ready to dispatch!`);
    } catch (err) {
      console.error(err);
      alert('Could not generate sample PDF.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Confirm PDF upload and complete request
  const handleConfirmFulfillment = (e) => {
    e.preventDefault();
    if (!selectedReq) return;

    if (!pdfDataUrl) {
      alert('Please choose a PDF file or click "Generate Certified PDF" to attach the actual document.');
      return;
    }

    const res = fulfillRequestWithPdf(selectedReq.id, {
      pdfFileData: pdfDataUrl,
      pdfFileName: pdfFileName || `${selectedReq.docType}_${selectedReq.id}.pdf`,
      pdfFileSize: pdfFileSize || '1.2 MB',
      adminNotes: adminNotes
    });

    if (res.success) {
      setUploadNotice('');
      setSelectedReq(null);
      alert(`Request ${selectedReq.id} marked as COMPLETED! PDF is now live for the citizen on Request Completion page.`);
    }
  };

  // Handle Admin adding money to the citizen user's wallet
  const handleAdminAddMoney = (e) => {
    e.preventDefault();
    const amountNum = parseInt(walletAddAmount, 10);
    if (isNaN(amountNum) || amountNum <= 0) {
      alert('Please enter a valid amount greater than 0.');
      return;
    }

    const res = adminAddUserWalletFunds(amountNum, walletAddRemark, 'usr_pune_buyer');
    if (res.success) {
      setWalletSuccessNotice(`Successfully credited ₹${amountNum.toLocaleString('en-IN')} to citizen user (Pune Property Buyer)! New Balance: ₹${res.newBalance.toLocaleString('en-IN')}`);
      setTimeout(() => {
        setWalletSuccessNotice('');
        setShowAdminWalletModal(false);
      }, 2500);
    }
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '90vh', padding: '32px 0 64px' }}>
      <div className="content-wrapper">
        
        {/* Top Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '28px'
        }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#f3e8ff',
              border: '1px solid #d8b4fe',
              color: '#7e22ce',
              padding: '3px 10px',
              borderRadius: '999px',
              fontSize: '0.75rem',
              fontWeight: 700,
              marginBottom: '8px'
            }}>
              <ShieldCheck size={14} />
              <span>OFFICIAL FULFILLMENT DESK • PUNE DISTRICT</span>
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>
              MahaRERA Admin Document Management
            </h1>
            <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
              Review citizen requests, upload certified PDFs for delivery, and manage citizen user wallet balance.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            
            {/* ADMIN WALLET BUTTON (ADD MONEY TO USER) */}
            <button
              type="button"
              onClick={() => setShowAdminWalletModal(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: '#16a34a',
                border: 'none',
                color: '#ffffff',
                padding: '9px 16px',
                borderRadius: '10px',
                fontSize: '0.85rem',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(22, 163, 74, 0.3)'
              }}
              title="Add money to single user wallet"
            >
              <Wallet size={16} />
              <span>User Wallet (Add Money)</span>
              <span style={{
                background: 'rgba(255,255,255,0.25)',
                padding: '2px 7px',
                borderRadius: '999px',
                fontSize: '0.75rem'
              }}>
                ₹{walletBalance.toLocaleString('en-IN')}
              </span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('completion')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                color: '#334155',
                padding: '9px 14px',
                borderRadius: '10px',
                fontSize: '0.825rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <Eye size={15} color="#2563eb" />
              <span>Citizen Completion View</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('home')}
              style={{
                padding: '9px 14px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                color: '#334155',
                fontSize: '0.825rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              ← Citizen Portal
            </button>

            <button
              type="button"
              onClick={adminLogout}
              style={{
                padding: '9px 14px',
                borderRadius: '10px',
                border: '1px solid #fecaca',
                background: '#fee2e2',
                color: '#dc2626',
                fontSize: '0.825rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Log Out
            </button>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '28px'
        }}>
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '18px 20px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Total Requests</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>{totalCount}</div>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid #fde68a', borderRadius: '14px', padding: '18px 20px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#b45309', textTransform: 'uppercase' }}>Pending PDF Upload</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#d97706', marginTop: '4px' }}>{pendingCount}</div>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid #bbf7d0', borderRadius: '14px', padding: '18px 20px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#166534', textTransform: 'uppercase' }}>Completed &amp; PDF Live</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#16a34a', marginTop: '4px' }}>{completedCount}</div>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '18px 20px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Total Collected Fees</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1e40af', marginTop: '4px' }}>₹{totalRevenue.toLocaleString('en-IN')}</div>
          </div>
        </div>

        {/* Tab Filters and Search */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '18px'
        }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              style={{
                background: activeTab === 'all' ? '#0f172a' : '#ffffff',
                color: activeTab === 'all' ? '#ffffff' : '#475569',
                border: '1px solid #cbd5e1',
                padding: '7px 14px',
                borderRadius: '8px',
                fontSize: '0.825rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              All Requests ({totalCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('pending')}
              style={{
                background: activeTab === 'pending' ? '#d97706' : '#ffffff',
                color: activeTab === 'pending' ? '#ffffff' : '#475569',
                border: '1px solid #cbd5e1',
                padding: '7px 14px',
                borderRadius: '8px',
                fontSize: '0.825rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Needs PDF Upload ({pendingCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('completed')}
              style={{
                background: activeTab === 'completed' ? '#16a34a' : '#ffffff',
                color: activeTab === 'completed' ? '#ffffff' : '#475569',
                border: '1px solid #cbd5e1',
                padding: '7px 14px',
                borderRadius: '8px',
                fontSize: '0.825rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Completed ({completedCount})
            </button>
          </div>

          <div style={{ position: 'relative', width: '280px' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search request, project, village..."
              style={{
                width: '100%',
                padding: '8px 12px 8px 32px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '0.825rem',
                boxSizing: 'border-box'
              }}
            />
            <Search size={14} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '10px' }} />
          </div>
        </div>

        {/* Requests Management Table */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
        }}>
          {filteredRequests.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                  <tr>
                    <th style={{ padding: '14px 18px', fontWeight: 800 }}>Request ID</th>
                    <th style={{ padding: '14px 18px', fontWeight: 800 }}>Citizen</th>
                    <th style={{ padding: '14px 18px', fontWeight: 800 }}>Project &amp; Property Details</th>
                    <th style={{ padding: '14px 18px', fontWeight: 800 }}>Doc Type</th>
                    <th style={{ padding: '14px 18px', fontWeight: 800 }}>Status</th>
                    <th style={{ padding: '14px 18px', fontWeight: 800 }}>Admin PDF Fulfillment</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((req) => {
                    const isPending = req.status === 'pending';
                    const isCompleted = req.status === 'completed' || req.status === 'shared';
                    const isDeed = req.docType === 'registered_deed';

                    return (
                      <tr key={req.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '14px 18px', verticalAlign: 'top' }}>
                          <span style={{
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            color: '#1e293b',
                            background: '#f1f5f9',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            border: '1px solid #e2e8f0'
                          }}>
                            {req.id}
                          </span>
                          <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '4px' }}>
                            {new Date(req.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </td>

                        <td style={{ padding: '14px 18px', verticalAlign: 'top' }}>
                          <div style={{ fontWeight: 800, color: '#0f172a' }}>{req.userName}</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{req.userEmail}</div>
                        </td>

                        <td style={{ padding: '14px 18px', verticalAlign: 'top' }}>
                          <div style={{ fontWeight: 800, color: '#0f172a' }}>{req.projectName}</div>
                          <div style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: 600 }}>
                            RERA: {req.reraId} • {req.village}, {req.taluka}
                          </div>
                          {(req.buildingName || req.floor || req.flatNo) && (
                            <div style={{ fontSize: '0.725rem', color: '#475569', marginTop: '2px' }}>
                              Unit: {req.buildingName || ''} {req.floor ? `(${req.floor})` : ''} {req.flatNo || ''}
                            </div>
                          )}
                          {req.coordinates && (
                            <div style={{ fontSize: '0.7rem', color: '#16a34a', display: 'flex', alignItems: 'center', gap: '3px', marginTop: '2px' }}>
                              <MapPin size={11} />
                              <span>{req.coordinates.lat}° N, {req.coordinates.lng}° E</span>
                            </div>
                          )}
                        </td>

                        <td style={{ padding: '14px 18px', verticalAlign: 'top' }}>
                          <span style={{
                            display: 'inline-block',
                            background: isDeed ? '#eff6ff' : '#ecfdf5',
                            border: `1px solid ${isDeed ? '#bfdbfe' : '#a7f3d0'}`,
                            color: isDeed ? '#1d4ed8' : '#059669',
                            fontSize: '0.725rem',
                            fontWeight: 800,
                            padding: '3px 8px',
                            borderRadius: '6px'
                          }}>
                            {isDeed ? '📜 Registered Deed' : '📋 Index 2'}
                          </span>
                          <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>
                            Fee: ₹{req.fee} (Wallet)
                          </div>
                        </td>

                        <td style={{ padding: '14px 18px', verticalAlign: 'top' }}>
                          {isPending ? (
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              background: '#fffbeb',
                              border: '1px solid #fde68a',
                              color: '#b45309',
                              fontSize: '0.725rem',
                              fontWeight: 800,
                              padding: '3px 8px',
                              borderRadius: '6px'
                            }}>
                              <Clock size={12} />
                              <span>Pending PDF</span>
                            </span>
                          ) : (
                            <div>
                              <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                background: '#f0fdf4',
                                border: '1px solid #86efac',
                                color: '#15803d',
                                fontSize: '0.725rem',
                                fontWeight: 800,
                                padding: '3px 8px',
                                borderRadius: '6px'
                              }}>
                                <CheckCircle2 size={12} />
                                <span>PDF Uploaded</span>
                              </span>
                              <div style={{ fontSize: '0.7rem', color: '#166534', marginTop: '3px' }}>
                                {req.pdfFileName || 'Document.pdf'}
                              </div>
                            </div>
                          )}
                        </td>

                        <td style={{ padding: '14px 18px', verticalAlign: 'top' }}>
                          <button
                            type="button"
                            onClick={() => handleOpenUploadModal(req)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '7px 12px',
                              borderRadius: '8px',
                              border: 'none',
                              background: isPending ? 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' : '#0f172a',
                              color: '#ffffff',
                              fontSize: '0.78rem',
                              fontWeight: 800,
                              cursor: 'pointer',
                              boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                            }}
                          >
                            <Upload size={13} />
                            <span>{isPending ? 'Upload PDF' : 'Update / View PDF'}</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ padding: '48px 24px', textAlign: 'center', color: '#64748b' }}>
              No requests found matching your current filter.
            </div>
          )}
        </div>

      </div>

      {/* 1. ADMIN WALLET MANAGEMENT MODAL (ADD MONEY TO CITIZEN USER) */}
      {showAdminWalletModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(5px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '480px',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid #e2e8f0'
          }}>
            {/* Header */}
            <div style={{
              background: 'linear-gradient(135deg, #15803d 0%, #166534 100%)',
              color: '#ffffff',
              padding: '20px 24px',
              position: 'relative'
            }}>
              <button
                type="button"
                onClick={() => setShowAdminWalletModal(false)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'rgba(255, 255, 255, 0.2)',
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

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <Wallet size={18} color="#86efac" />
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#bbf7d0', textTransform: 'uppercase' }}>
                  ADMIN RECHARGE CONTROL
                </span>
              </div>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>
                Credit User Wallet Balance
              </h3>
            </div>

            <form onSubmit={handleAdminAddMoney} style={{ padding: '24px' }}>
              {walletSuccessNotice && (
                <div style={{
                  background: '#f0fdf4',
                  border: '1px solid #86efac',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  color: '#166534',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  marginBottom: '16px'
                }}>
                  {walletSuccessNotice}
                </div>
              )}

              {/* Target User Info */}
              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '14px 16px',
                marginBottom: '18px'
              }}>
                <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                  Target Citizen User (Single User System):
                </div>
                <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '1rem', marginTop: '2px' }}>
                  Pune Property Buyer (buyer@pune.gov.in)
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', paddingTop: '8px', borderTop: '1px dashed #cbd5e1' }}>
                  <span style={{ fontSize: '0.8rem', color: '#475569' }}>Current Available Balance:</span>
                  <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#16a34a' }}>
                    ₹{walletBalance.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Quick Preset Buttons */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                  Quick Preset Amounts:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                  {[500, 1000, 2000, 5000].map(amt => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setWalletAddAmount(String(amt))}
                      style={{
                        padding: '8px 4px',
                        borderRadius: '8px',
                        border: walletAddAmount === String(amt) ? '2px solid #16a34a' : '1px solid #cbd5e1',
                        background: walletAddAmount === String(amt) ? '#dcfce7' : '#ffffff',
                        color: walletAddAmount === String(amt) ? '#166534' : '#334155',
                        fontWeight: 800,
                        fontSize: '0.8rem',
                        cursor: 'pointer'
                      }}
                    >
                      +₹{amt.toLocaleString('en-IN')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount Input */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Amount to Add (₹) *
                </label>
                <input
                  type="number"
                  min="1"
                  step="100"
                  value={walletAddAmount}
                  onChange={(e) => setWalletAddAmount(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '1rem',
                    fontWeight: 800,
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Remark Input */}
              <div style={{ marginBottom: '22px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Transaction Remark (Recorded in History)
                </label>
                <input
                  type="text"
                  value={walletAddRemark}
                  onChange={(e) => setWalletAddRemark(e.target.value)}
                  placeholder="e.g. Official Admin Top-up"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.85rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowAdminWalletModal(false)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    color: '#475569',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 2,
                    padding: '12px',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#16a34a',
                    color: '#ffffff',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(22, 163, 74, 0.35)'
                  }}
                >
                  Confirm &amp; Add Money
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. PDF UPLOAD MODAL (ACTUAL PDF FILE UPLOAD & DELIVER) */}
      {selectedReq && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(5px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '560px',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid #e2e8f0',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Modal Header */}
            <div style={{
              background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
              color: '#ffffff',
              padding: '20px 24px',
              position: 'relative'
            }}>
              <button
                type="button"
                onClick={() => setSelectedReq(null)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'rgba(255, 255, 255, 0.2)',
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

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <Upload size={18} color="#93c5fd" />
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#bfdbfe', textTransform: 'uppercase' }}>
                  ACTUAL PDF ATTACHMENT DESK
                </span>
              </div>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>
                Upload Certified PDF for Request {selectedReq.id}
              </h3>
            </div>

            <form onSubmit={handleConfirmFulfillment} style={{ padding: '24px', overflowY: 'auto' }}>
              
              {/* Request Metadata Card */}
              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '14px 16px',
                marginBottom: '20px',
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '8px',
                fontSize: '0.8rem'
              }}>
                <div>
                  <span style={{ color: '#64748b' }}>Project:</span>
                  <div style={{ fontWeight: 800, color: '#0f172a' }}>{selectedReq.projectName}</div>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>Document:</span>
                  <div style={{ fontWeight: 800, color: '#2563eb' }}>{selectedReq.docTitle}</div>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>Location:</span>
                  <div style={{ fontWeight: 600 }}>{selectedReq.village}, {selectedReq.taluka}</div>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>Coordinates:</span>
                  <div style={{ fontWeight: 600, color: '#16a34a' }}>
                    {selectedReq.coordinates ? `${selectedReq.coordinates.lat}, ${selectedReq.coordinates.lng}` : 'Default Pune'}
                  </div>
                </div>
              </div>

              {/* ACTUAL PDF FILE UPLOAD DROPZONE */}
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 800, color: '#1e293b', marginBottom: '8px' }}>
                  Upload Actual PDF Document (.pdf) *
                </label>

                <div style={{
                  border: '2px dashed #93c5fd',
                  borderRadius: '12px',
                  padding: '20px',
                  background: '#f0f9ff',
                  textAlign: 'center',
                  cursor: 'pointer',
                  position: 'relative'
                }}>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileInputChange}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      opacity: 0,
                      cursor: 'pointer',
                      width: '100%',
                      height: '100%'
                    }}
                  />
                  <FileUp size={32} color="#2563eb" style={{ margin: '0 auto 8px' }} />
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1e40af' }}>
                    Click to select PDF from your device or drag &amp; drop
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
                    Supports official .pdf files (Certified Deeds, Scanned Index 2)
                  </div>
                </div>
              </div>

              {/* DISPLAY SELECTED / GENERATED FILE */}
              {pdfFileName && (
                <div style={{
                  background: '#f0fdf4',
                  border: '1px solid #86efac',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileText size={18} color="#16a34a" />
                    <div>
                      <div style={{ fontSize: '0.825rem', fontWeight: 800, color: '#166534' }}>
                        {pdfFileName}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#15803d' }}>
                        Size: {pdfFileSize || '1.2 MB'} • Valid PDF stream loaded
                      </div>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.72rem', background: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: '4px', fontWeight: 800 }}>
                    READY
                  </span>
                </div>
              )}

              {/* OR QUICK 1-CLICK GENERATE CERTIFIED SAMPLE PDF */}
              <div style={{ marginBottom: '18px' }}>
                <button
                  type="button"
                  onClick={handleGenerateOfficialMockPdf}
                  disabled={isGeneratingPdf}
                  style={{
                    width: '100%',
                    background: '#f8fafc',
                    border: '1px solid #cbd5e1',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: '#2563eb',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Sparkles size={14} />
                  <span>{isGeneratingPdf ? 'Generating PDF...' : '1-Click: Auto-Generate Official Certified PDF for Testing'}</span>
                </button>
              </div>

              {/* ADMIN VERIFICATION NOTES */}
              <div style={{ marginBottom: '22px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Admin Officer Stamping &amp; Remarks (Visible to Citizen)
                </label>
                <textarea
                  rows={2}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Verified, certified, and officially retrieved from Sub-Registrar Office."
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.825rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* ACTION BUTTONS */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setSelectedReq(null)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    color: '#475569',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 2,
                    padding: '12px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                    color: '#ffffff',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Send size={15} />
                  <span>Upload PDF &amp; Deliver</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
