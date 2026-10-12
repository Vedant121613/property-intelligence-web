import React, { useState, useMemo, useEffect } from 'react';
import { 
  Building2, 
  MapPin, 
  ShieldCheck, 
  FileText, 
  Compass, 
  Layers, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  Wallet,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Info
} from 'lucide-react';
import { useRequests } from '../context/RequestContext';
import { useAuth } from '../context/AuthContext';
import { lookupCoordinates } from '../services/propertyService';

export default function ContinueRequestPage({ 
  district = 'Pune',
  taluka = 'Haveli',
  talukaSlug = 'haveli',
  village = 'Baner',
  villageSlug = 'baner',
  initialProject = null,
  onNavigate 
}) {
  const { user } = useAuth();
  const { walletBalance, createDocumentRequest, addWalletFunds } = useRequests();

  // Project details (pre-filled, can be blank or edited)
  const [projectName, setProjectName] = useState(initialProject?.name || '');
  const [reraId, setReraId] = useState(initialProject?.rera || initialProject?.reraNumbers || 'P52100008590');
  
  // Empty fields (if blank then also ok)
  const [buildingName, setBuildingName] = useState('');
  const [floor, setFloor] = useState('');
  const [flatNo, setFlatNo] = useState('');

  // Coordinates: GIVEN BY DEFAULT
  const defaultCoords = useMemo(() => {
    if (initialProject?.coordinates && Array.isArray(initialProject.coordinates)) {
      return { lat: initialProject.coordinates[0], lng: initialProject.coordinates[1] };
    }
    const coords = lookupCoordinates(
      initialProject?.rera || reraId,
      initialProject?.id,
      initialProject?.name || projectName,
      talukaSlug
    );
    return { lat: coords[0] || 18.52043, lng: coords[1] || 73.85674 };
  }, [initialProject, reraId, projectName, talukaSlug]);

  const [lat, setLat] = useState(defaultCoords.lat);
  const [lng, setLng] = useState(defaultCoords.lng);

  useEffect(() => {
    setLat(defaultCoords.lat);
    setLng(defaultCoords.lng);
  }, [defaultCoords]);

  // Request feedback modal/alert state
  const [submittingDoc, setSubmittingDoc] = useState(null); // 'deed' | 'index_2' | null
  const [requestSuccess, setRequestSuccess] = useState(null); // { docType, docTitle, reqId, fee }
  const [errorNotice, setErrorNotice] = useState('');

  const handleRequestDoc = (docType) => {
    setErrorNotice('');
    setSubmittingDoc(docType);

    const fee = docType === 'registered_deed' ? 999 : 499;
    const docTitle = docType === 'registered_deed' ? 'Certified Registered Sale Deed' : 'Index 2 Registration Extract';

    if (walletBalance < fee) {
      setErrorNotice(`Insufficient wallet balance (₹${walletBalance.toLocaleString('en-IN')}). Please add funds to proceed.`);
      setSubmittingDoc(null);
      return;
    }

    const effectiveProject = {
      id: initialProject?.id || `proj-${Date.now()}`,
      name: projectName.trim() || 'Unspecified Pune Property',
      rera: reraId.trim() || 'P52100008590',
      taluka: taluka,
      village: village,
      district: 'Pune',
      coordinates: { lat: parseFloat(lat) || defaultCoords.lat, lng: parseFloat(lng) || defaultCoords.lng }
    };

    const res = createDocumentRequest({
      user,
      project: effectiveProject,
      docType,
      fee,
      projectName: effectiveProject.name,
      buildingName: buildingName.trim(),
      floor: floor.trim(),
      flatNo: flatNo.trim(),
      coordinates: effectiveProject.coordinates,
      taluka,
      village,
      district: 'Pune',
      reraId: effectiveProject.rera
    });

    setSubmittingDoc(null);

    if (res.success) {
      setRequestSuccess({
        docType,
        docTitle,
        reqId: res.request.id,
        fee
      });
    } else {
      setErrorNotice(res.message || 'Failed to place request. Please check wallet balance.');
    }
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '90vh', padding: '28px 0 64px' }}>
      <div className="content-wrapper">
        
        {/* Top Back Navigation Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <button
            type="button"
            onClick={() => onNavigate('home')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              padding: '8px 14px',
              borderRadius: '10px',
              color: '#334155',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
            }}
          >
            <ArrowLeft size={16} />
            <span>Back to Hierarchy Selection</span>
          </button>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#eff6ff',
            border: '1px solid #bfdbfe',
            padding: '6px 14px',
            borderRadius: '999px',
            fontSize: '0.8rem',
            color: '#1d4ed8',
            fontWeight: 700
          }}>
            <Wallet size={14} />
            <span>Available Balance: ₹{walletBalance.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Success Modal / Banner when request is placed */}
        {requestSuccess && (
          <div style={{
            background: '#ffffff',
            border: '2px solid #22c55e',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '28px',
            boxShadow: '0 10px 25px -5px rgba(34, 197, 94, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: '#dcfce7',
                color: '#16a34a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <CheckCircle2 size={24} />
              </div>
              <div>
                <h3 style={{ margin: '0 0 4px', fontSize: '1.15rem', fontWeight: 800, color: '#14532d' }}>
                  {requestSuccess.docTitle} Successfully Requested!
                </h3>
                <p style={{ margin: '0 0 6px', fontSize: '0.875rem', color: '#166534' }}>
                  Tracking ID: <b>{requestSuccess.reqId}</b> • ₹{requestSuccess.fee} debited from your wallet.
                </p>
                <div style={{ fontSize: '0.8rem', color: '#475569' }}>
                  The Pune Admin Officer will verify the records and upload the certified PDF. You can preview and download it on the <b>Request Completion</b> page.
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => onNavigate('completion')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '10px 18px',
                  borderRadius: '10px',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 10px rgba(22, 163, 74, 0.3)'
                }}
              >
                <span>Go to Request Completion</span>
                <ArrowRight size={16} />
              </button>
              <button
                type="button"
                onClick={() => setRequestSuccess(null)}
                style={{
                  background: '#f1f5f9',
                  border: '1px solid #cbd5e1',
                  color: '#475569',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {errorNotice && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #f87171',
            borderRadius: '12px',
            padding: '14px 18px',
            color: '#b91c1c',
            fontSize: '0.875rem',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={18} />
              <span>{errorNotice}</span>
            </div>
            <button
              type="button"
              onClick={() => addWalletFunds(1000)}
              style={{
                background: '#b91c1c',
                color: '#ffffff',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Add ₹1,000 to Wallet
            </button>
          </div>
        )}

        {/* Main Form Card Container */}
        <div style={{
          background: '#ffffff',
          borderRadius: '20px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 10px 30px -5px rgba(0,0,0,0.05)',
          overflow: 'hidden'
        }}>
          {/* Header Bar */}
          <div style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            color: '#ffffff',
            padding: '28px 32px',
            position: 'relative'
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(59, 130, 246, 0.2)',
              border: '1px solid rgba(59, 130, 246, 0.4)',
              color: '#93c5fd',
              fontSize: '0.75rem',
              fontWeight: 800,
              padding: '4px 10px',
              borderRadius: '999px',
              marginBottom: '10px'
            }}>
              <ShieldCheck size={14} />
              <span>STEP 2: PROPERTY INFORMATION &amp; DOCUMENT DISPATCH</span>
            </div>

            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, margin: '0 0 6px', color: '#ffffff' }}>
              Property Details &amp; Request Form
            </h1>
            <p style={{ fontSize: '0.875rem', color: '#94a3b8', margin: 0 }}>
              Review pre-selected district, taluka and village details, optionally fill building or floor, and request official Deed or Index 2 extracts.
            </p>
          </div>

          <div style={{ padding: '32px' }}>
            
            {/* 1. SELECTION SUMMARY BADGES (All Information) */}
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '14px',
              padding: '20px',
              marginBottom: '28px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px'
            }}>
              <div>
                <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 800, letterSpacing: '0.04em' }}>
                  District (Auto Selected)
                </span>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                  <MapPin size={16} color="#2563eb" />
                  <span>Pune District</span>
                  <span style={{ background: '#dbeafe', color: '#1e40af', fontSize: '0.65rem', padding: '1px 6px', borderRadius: '4px', fontWeight: 800 }}>
                    Fixed
                  </span>
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 800, letterSpacing: '0.04em' }}>
                  Taluka
                </span>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
                  {taluka}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 800, letterSpacing: '0.04em' }}>
                  Village / Locality
                </span>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
                  {village}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 800, letterSpacing: '0.04em' }}>
                  MahaRERA ID
                </span>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#2563eb', marginTop: '4px' }}>
                  {reraId || 'P52100008590'}
                </div>
              </div>
            </div>

            {/* 2. EDITABLE PROPERTY FIELDS (Optional / If blank then also ok) */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <Building2 size={18} color="#2563eb" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Property &amp; Unit Specifics
                </h3>
                <span style={{ fontSize: '0.75rem', color: '#64748b', background: '#f1f5f9', padding: '2px 8px', borderRadius: '6px' }}>
                  Fields below are optional — if left blank then also ok!
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', maxWidth: '640px' }}>
                
                {/* Project Name (Editable, blank is ok) */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Project Name <span style={{ color: '#94a3b8', fontWeight: 500 }}>(Pre-filled, editable, blank ok)</span>
                  </label>
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="e.g. GOVIND VILAS (or leave blank if unsure)"
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.9rem',
                      color: '#0f172a',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                {/* Building Name / Wing (Empty field, blank ok) */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Building / Wing Name <span style={{ color: '#94a3b8', fontWeight: 500 }}>(Empty field, blank ok)</span>
                  </label>
                  <input
                    type="text"
                    value={buildingName}
                    onChange={(e) => setBuildingName(e.target.value)}
                    placeholder="e.g. Wing A / Tower 2 (Optional)"
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.9rem',
                      color: '#0f172a',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                {/* Floor (Empty field, blank ok) */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Floor Level <span style={{ color: '#94a3b8', fontWeight: 500 }}>(Empty field, blank ok)</span>
                  </label>
                  <input
                    type="text"
                    value={floor}
                    onChange={(e) => setFloor(e.target.value)}
                    placeholder="e.g. 4th Floor / Ground Floor (Optional)"
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.9rem',
                      color: '#0f172a',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                {/* Flat / Unit No (Empty field, blank ok) */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Flat / Unit Number <span style={{ color: '#94a3b8', fontWeight: 500 }}>(Empty field, blank ok)</span>
                  </label>
                  <input
                    type="text"
                    value={flatNo}
                    onChange={(e) => setFlatNo(e.target.value)}
                    placeholder="e.g. Flat 402 / Shop 3 (Optional)"
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.9rem',
                      color: '#0f172a',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* 3. COORDINATES SECTION (Given By Default) */}
            <div style={{
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '32px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Compass size={18} color="#16a34a" />
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#14532d', margin: 0 }}>
                    Geo-Coordinates (Given by Default)
                  </h3>
                </div>
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  background: '#dcfce7',
                  color: '#15803d',
                  padding: '3px 8px',
                  borderRadius: '999px',
                  border: '1px solid #86efac'
                }}>
                  Verified Pune Coordinates Pre-filled
                </span>
              </div>

              <p style={{ fontSize: '0.825rem', color: '#166534', margin: '0 0 16px', lineHeight: 1.5 }}>
                Exact geographic coordinates mapped for {village}, {taluka}. Provided by default automatically. You may adjust them if needed.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '640px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#166534', marginBottom: '4px' }}>
                    Latitude (Default Given)
                  </label>
                  <input
                    type="number"
                    step="0.00001"
                    value={lat}
                    onChange={(e) => setLat(parseFloat(e.target.value) || '')}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #86efac',
                      background: '#ffffff',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      color: '#0f172a',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#166534', marginBottom: '4px' }}>
                    Longitude (Default Given)
                  </label>
                  <input
                    type="number"
                    step="0.00001"
                    value={lng}
                    onChange={(e) => setLng(parseFloat(e.target.value) || '')}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #86efac',
                      background: '#ffffff',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      color: '#0f172a',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                  <div style={{
                    background: '#ffffff',
                    border: '1px solid #bbf7d0',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    fontSize: '0.78rem',
                    color: '#166534',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <MapPin size={14} color="#16a34a" />
                    <span>Pin: <b>{lat}° N, {lng}° E</b> (Pune)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. ACTION BUTTONS: REQUEST DEED & INDEX 2 */}
            <div style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '28px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>
                  Official Document Request Dispatch
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
                  Choose either button below to submit your official request. Admin will upload the certified PDF, viewable in <b>Request Completion</b>.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '640px' }}>
                
                {/* BUTTON 1: REQUEST DEED */}
                <div style={{
                  background: '#ffffff',
                  border: '2px solid #2563eb',
                  borderRadius: '14px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 4px 15px rgba(37, 99, 235, 0.08)'
                }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        background: '#eff6ff',
                        color: '#2563eb',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <FileText size={20} />
                      </div>
                      <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e40af' }}>
                        ₹999 <span style={{ fontSize: '0.72rem', color: '#64748b' }}>(Wallet)</span>
                      </span>
                    </div>

                    <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>
                      Request Registered Sale Deed
                    </h4>
                    <p style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.5, margin: '0 0 16px' }}>
                      Certified copy of the complete registered deed executed at the Pune Sub-Registrar Office, including schedule of property, boundaries, and stamp verification.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRequestDoc('registered_deed')}
                    disabled={submittingDoc === 'registered_deed'}
                    style={{
                      width: '100%',
                      background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)',
                      color: '#ffffff',
                      border: 'none',
                      padding: '14px 20px',
                      borderRadius: '10px',
                      fontSize: '0.95rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 12px rgba(29, 78, 216, 0.35)',
                      transition: 'all 0.2s'
                    }}
                  >
                    <FileText size={18} />
                    <span>{submittingDoc === 'registered_deed' ? 'Processing...' : 'Request Deed'}</span>
                  </button>
                </div>

                {/* BUTTON 2: INDEX 2 */}
                <div style={{
                  background: '#ffffff',
                  border: '2px solid #10b981',
                  borderRadius: '14px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 4px 15px rgba(16, 185, 129, 0.08)'
                }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        background: '#ecfdf5',
                        color: '#059669',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Layers size={20} />
                      </div>
                      <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#047857' }}>
                        ₹499 <span style={{ fontSize: '0.72rem', color: '#64748b' }}>(Wallet)</span>
                      </span>
                    </div>

                    <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>
                      Request Index 2 Registration Extract
                    </h4>
                    <p style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.5, margin: '0 0 16px' }}>
                      Statutory Index-II extract reflecting registered owner, consideration price, market valuation, document number, and Haveli / Pune registration timestamp.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRequestDoc('index_2')}
                    disabled={submittingDoc === 'index_2'}
                    style={{
                      width: '100%',
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: '#ffffff',
                      border: 'none',
                      padding: '14px 20px',
                      borderRadius: '10px',
                      fontSize: '0.95rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.35)',
                      transition: 'all 0.2s'
                    }}
                  >
                    <Layers size={18} />
                    <span>{submittingDoc === 'index_2' ? 'Processing...' : 'Request Index 2'}</span>
                  </button>
                </div>

              </div>

              {/* View in Request Completion Link */}
              <div style={{
                marginTop: '10px',
                textAlign: 'center',
                paddingTop: '16px',
                borderTop: '1px dashed #cbd5e1'
              }}>
                <button
                  type="button"
                  onClick={() => onNavigate('completion')}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#2563eb',
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span>Already placed a request? Check uploaded PDFs on Request Completion Page</span>
                  <ArrowRight size={14} />
                </button>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
