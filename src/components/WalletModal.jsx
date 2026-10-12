import React, { useState } from 'react';
import { 
  X, 
  Wallet, 
  PlusCircle, 
  CheckCircle2, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock, 
  ShieldCheck 
} from 'lucide-react';
import { useRequests } from '../context/RequestContext';

export default function WalletModal({ isOpen, onClose }) {
  const { walletBalance, walletHistory, addWalletFunds } = useRequests();
  const [customAmount, setCustomAmount] = useState('');
  const [rechargeSuccess, setRechargeSuccess] = useState('');

  if (!isOpen) return null;

  const handleAdd = (amt) => {
    const num = parseInt(amt, 10);
    if (!num || num <= 0) return;
    addWalletFunds(num);
    setCustomAmount('');
    setRechargeSuccess(`₹${num.toLocaleString('en-IN')} added to your wallet!`);
    setTimeout(() => setRechargeSuccess(''), 3000);
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
      onClick={onClose}
    >
      <div 
        style={{
          width: '100%',
          maxWidth: '460px',
          background: '#ffffff',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid #e2e8f0'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #15803d 0%, #166534 100%)',
          color: '#ffffff',
          padding: '24px',
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Wallet size={18} />
            <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              PUREFRAME WALLET
            </span>
          </div>

          <div style={{ fontSize: '2.2rem', fontWeight: 800, margin: '4px 0 2px' }}>
            ₹{walletBalance.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>
            Available balance for Registered Deed &amp; Index 2 requests
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '24px' }}>
          {rechargeSuccess && (
            <div style={{
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              color: '#15803d',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 700,
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <CheckCircle2 size={16} />
              <span>{rechargeSuccess}</span>
            </div>
          )}

          {/* Quick Add Funds */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
              Add Funds to Wallet:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '10px' }}>
              {[500, 1000, 2500].map(amt => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => handleAdd(amt)}
                  style={{
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid #bbf7d0',
                    background: '#f0fdf4',
                    color: '#166534',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px'
                  }}
                >
                  <PlusCircle size={14} />
                  <span>+₹{amt}</span>
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="number"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                placeholder="Custom amount (₹)"
                style={{
                  flex: 1,
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              />
              <button
                type="button"
                onClick={() => handleAdd(customAmount)}
                disabled={!customAmount}
                style={{
                  padding: '9px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  background: customAmount ? '#16a34a' : '#cbd5e1',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: customAmount ? 'pointer' : 'not-allowed'
                }}
              >
                Add
              </button>
            </div>
          </div>

          {/* Wallet Transaction History */}
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '10px' }}>
              Recent Wallet Transactions:
            </div>

            <div style={{
              maxHeight: '180px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              {walletHistory.length > 0 ? (
                walletHistory.slice(0, 5).map((txn) => {
                  const isCredit = txn.type === 'credit';
                  return (
                    <div
                      key={txn.id}
                      style={{
                        padding: '10px 12px',
                        background: '#f8fafc',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '6px',
                          background: isCredit ? '#dcfce7' : '#fee2e2',
                          color: isCredit ? '#16a34a' : '#dc2626',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {isCredit ? <ArrowDownLeft size={15} /> : <ArrowUpRight size={15} />}
                        </div>
                        <div>
                          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>
                            {txn.title}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                            {txn.date}
                          </div>
                        </div>
                      </div>

                      <span style={{
                        fontSize: '0.85rem',
                        fontWeight: 800,
                        color: isCredit ? '#16a34a' : '#dc2626'
                      }}>
                        {isCredit ? '+' : '-'}₹{txn.amount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', textAlign: 'center', padding: '12px' }}>
                  No transactions yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
