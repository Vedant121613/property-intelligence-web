import React, { useState } from 'react';
import { 
  X, 
  Wallet, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Building2, 
  ArrowRight, 
  ShieldCheck,
  PlusCircle,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRequests } from '../context/RequestContext';

export default function WalletPaymentModal({
  isOpen,
  onClose,
  project,
  docType = 'index_2', // 'registered_deed' or 'index_2'
  onSuccess
}) {
  const { user } = useAuth();
  const { walletBalance, createDocumentRequest, addWalletFunds } = useRequests();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReq, setSubmittedReq] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [addedAmountNotice, setAddedAmountNotice] = useState('');

  if (!isOpen || !project) return null;

  const isDeed = docType === 'registered_deed';
  const fee = isDeed ? 999 : 499;
  const docTitle = isDeed ? 'Certified Registered Sale Deed' : 'Index 2 Registration Extract';
  const docDescription = isDeed 
    ? 'Official sale agreement copy filed at the Sub-Registrar office detailing complete terms, property boundaries, and registered consideration.'
    : 'Summary index document issued by Inspector General of Registration (IGR) verifying ownership, registration number, stamp duty, and date.';

  const hasSufficientFunds = walletBalance >= fee;
  const balanceAfter = walletBalance - fee;

  const handlePayViaWallet = () => {
    if (!hasSufficientFunds) {
      setErrorMessage(`Insufficient wallet balance. Please add funds below to proceed.`);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    setTimeout(() => {
      const res = createDocumentRequest({
        user,
        project,
        docType,
        fee
      });

      setIsSubmitting(false);

      if (res.success) {
        setSubmittedReq(res.request);
        if (onSuccess) onSuccess(res.request);
      } else {
        setErrorMessage(res.message || 'Payment failed.');
      }
    }, 400);
  };

  const handleQuickAddFunds = (amt) => {
    addWalletFunds(amt);
    setErrorMessage('');
    setAddedAmountNotice(`+₹${amt.toLocaleString('en-IN')} added to your wallet!`);
    setTimeout(() => setAddedAmountNotice(''), 3000);
  };

  const handleClose = () => {
    setSubmittedReq(null);
    setErrorMessage('');
    onClose();
  };

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
      onClick={handleClose}
    >
      <div 
        style={{
          width: '100%',
          maxWidth: '460px',
          background: '#ffffff',
          borderRadius: '20px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          border: '1px solid #e2e8f0',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          color: '#ffffff',
          padding: '22px 24px',
          position: 'relative'
        }}>
          <button
            type="button"
            onClick={handleClose}
            style={{
              position: 'absolute',
              top: '18px',
              right: '18px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '50%',
              width: '30px',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#cbd5e1',
              cursor: 'pointer'
            }}
          >
            <X size={16} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{
              background: isDeed ? '#3b82f6' : '#10b981',
              color: '#ffffff',
              fontSize: '0.7rem',
              fontWeight: 800,
              padding: '2px 8px',
              borderRadius: '6px',
              textTransform: 'uppercase'
            }}>
              {isDeed ? 'DEED REQUEST' : 'INDEX 2 EXTRACT'}
            </span>
            <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>MahaRERA Official Records</span>
          </div>

          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 4px', color: '#ffffff' }}>
            {docTitle}
          </h2>
          <p style={{ fontSize: '0.8rem', color: '#cbd5e1', margin: 0 }}>
            Project: <b style={{ color: '#ffffff' }}>{project.name}</b> • RERA: {project.rera || project.reraNumbers || 'P521...'}
          </p>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px' }}>
          {submittedReq ? (
            /* Success State */
            <div style={{ textAlign: 'center', padding: '12px 0 8px' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: '#dcfce7',
                color: '#16a34a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}>
                <CheckCircle2 size={34} />
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>
                Request Placed Successfully!
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 20px', lineHeight: 1.5 }}>
                ₹{fee.toLocaleString('en-IN')} has been deducted from your Pureframe Wallet.
                Your request has been routed to the MahaRERA fulfillment team.
              </p>

              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '16px',
                textAlign: 'left',
                marginBottom: '22px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Request ID:</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0f172a' }}>{submittedReq.id}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Document:</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>{submittedReq.docTitle}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Status:</span>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#d97706',
                    background: '#fef3c7',
                    padding: '2px 8px',
                    borderRadius: '6px'
                  }}>
                    Pending Admin Link
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Remaining Wallet:</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#16a34a' }}>
                    ₹{walletBalance.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                {onNavigate && (
                  <button
                    type="button"
                    onClick={() => {
                      handleClose();
                      onNavigate('completion');
                    }}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '10px',
                      border: 'none',
                      background: '#16a34a',
                      color: '#ffffff',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      cursor: 'pointer'
                    }}
                  >
                    View in Request Completion
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleClose}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    color: '#334155',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  Done &amp; Continue
                </button>
              </div>
            </div>
          ) : (
            /* Checkout View */
            <div>
              {/* Document Overview Box */}
              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '14px 16px',
                marginBottom: '18px'
              }}>
                <div style={{ fontSize: '0.8rem', color: '#475569', lineHeight: 1.5 }}>
                  {docDescription}
                </div>
              </div>

              {/* Exclusive Wallet-Only Payment Box */}
              <div style={{
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '14px',
                padding: '16px 18px',
                marginBottom: '18px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: '#16a34a',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Wallet size={17} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#14532d' }}>
                        Pureframe Wallet (Exclusive Payment)
                      </div>
                      <div style={{ fontSize: '0.725rem', color: '#166534' }}>
                        Fast 1-click verification &amp; instant deduction
                      </div>
                    </div>
                  </div>

                  <span style={{
                    background: '#dcfce7',
                    color: '#15803d',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    padding: '3px 8px',
                    borderRadius: '6px',
                    border: '1px solid #86efac'
                  }}>
                    ACTIVE
                  </span>
                </div>

                {/* Balance breakdown */}
                <div style={{
                  borderTop: '1px solid #dcfce7',
                  paddingTop: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  fontSize: '0.8rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#166534' }}>
                    <span>Current Wallet Balance:</span>
                    <span style={{ fontWeight: 800 }}>₹{walletBalance.toLocaleString('en-IN')}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#166534' }}>
                    <span>Document Retrieval Fee:</span>
                    <span style={{ fontWeight: 800, color: '#b91c1c' }}>- ₹{fee.toLocaleString('en-IN')}</span>
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    color: '#14532d',
                    fontWeight: 800,
                    borderTop: '1px dashed #86efac',
                    paddingTop: '6px',
                    fontSize: '0.85rem'
                  }}>
                    <span>Balance After Payment:</span>
                    <span style={{ color: hasSufficientFunds ? '#15803d' : '#dc2626' }}>
                      {hasSufficientFunds ? `₹${balanceAfter.toLocaleString('en-IN')}` : 'Insufficient Balance'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Add Funds if Needed or Optional */}
              <div style={{
                marginBottom: '20px',
                padding: '12px 14px',
                background: '#f8fafc',
                borderRadius: '10px',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>
                    Need more funds? Quick Wallet Top-up:
                  </span>
                  {addedAmountNotice && (
                    <span style={{ fontSize: '0.7rem', color: '#16a34a', fontWeight: 700 }}>
                      {addedAmountNotice}
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {[500, 1000, 2000].map(amt => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => handleQuickAddFunds(amt)}
                      style={{
                        flex: 1,
                        padding: '6px 8px',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        background: '#ffffff',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: '#1e293b',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px'
                      }}
                    >
                      <PlusCircle size={12} color="#16a34a" />
                      <span>+₹{amt}</span>
                    </button>
                  ))}
                </div>
              </div>

              {errorMessage && (
                <div style={{
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  color: '#b91c1c',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <AlertCircle size={16} />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Pay Button */}
              <button
                type="button"
                onClick={handlePayViaWallet}
                disabled={isSubmitting || !hasSufficientFunds}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '10px',
                  border: 'none',
                  background: hasSufficientFunds 
                    ? 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)' 
                    : '#94a3b8',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  cursor: hasSufficientFunds ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: hasSufficientFunds ? '0 10px 20px -5px rgba(22, 163, 74, 0.4)' : 'none'
                }}
              >
                <Wallet size={18} />
                <span>
                  {isSubmitting 
                    ? 'Processing Wallet Deduction...' 
                    : `Pay ₹${fee.toLocaleString('en-IN')} via Wallet & Submit`}
                </span>
              </button>

              <div style={{
                fontSize: '0.72rem',
                color: '#94a3b8',
                textAlign: 'center',
                marginTop: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px'
              }}>
                <ShieldCheck size={13} color="#16a34a" />
                <span>100% Encrypted &amp; Protected by MahaRERA Verification SLA</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
