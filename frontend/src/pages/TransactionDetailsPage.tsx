import React, { useEffect, useState } from 'react';
import paymentService, { PaymentTransaction, Refund } from '../services/paymentService';

const statusColors: Record<string, string> = {
  success: '#10b981',
  initiated: '#f59e0b',
  failed: '#ef4444',
  refunded: '#8b5cf6',
  partial_refund: '#ec4899',
};

export const TransactionDetailsPage: React.FC = () => {
  const [txnId, setTxnId] = useState('');
  const [txn, setTxn] = useState<PaymentTransaction | null>(null);
  const [refundAmount, setRefundAmount] = useState('');
  const [refundReason, setRefundReason] = useState('');
  const [refundResult, setRefundResult] = useState<Refund | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchDetails = async () => {
    if (!txnId.trim()) return;
    setLoading(true);
    setError('');
    setTxn(null);
    setRefundResult(null);
    try {
      const data = await paymentService.getTransactionDetails(txnId.trim());
      setTxn(data);
      setRefundAmount(String(data.amount));
    } catch {
      setError('Transaction not found. Enter a valid transaction UUID or search ID.');
    } finally {
      setLoading(false);
    }
  };

  const handleInitiateRefund = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!txn || !refundAmount || !refundReason) return;
    setLoading(true);
    setError('');
    try {
      const res = await paymentService.createRefund({
        transaction_id: txn.transaction_id,
        amount: parseFloat(refundAmount),
        reason: refundReason,
      });
      setRefundResult(res);
      fetchDetails();
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Refund initiation failed.');
    } finally {
      setLoading(false);
    }
  };

  const fmt = (n: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

  return (
    <div style={{ padding: '32px', background: '#0f172a', minHeight: '100vh', color: '#f8fafc' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: 0 }}>🔍 Transaction Details & Refunds</h1>
        <p style={{ color: '#94a3b8', marginTop: '8px' }}>
          Inspect transaction metadata, order mapping, audit history, and trigger gateway refunds
        </p>
      </div>

      {/* Lookup */}
      <div style={{ background: '#1e293b', borderRadius: '16px', border: '1px solid #334155', padding: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <input
            id="txn-id-input"
            value={txnId}
            onChange={(e) => setTxnId(e.target.value)}
            placeholder="Enter Transaction UUID or Gateway Txn ID..."
            style={{
              flex: 1,
              background: '#0f172a',
              border: '1px solid #334155',
              borderRadius: '10px',
              padding: '12px 16px',
              color: '#f8fafc',
            }}
            onKeyDown={(e) => e.key === 'Enter' && fetchDetails()}
          />
          <button
            id="btn-fetch-txn"
            onClick={fetchDetails}
            disabled={loading}
            style={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              padding: '12px 24px',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            {loading ? 'Searching...' : 'Inspect Transaction'}
          </button>
        </div>
      </div>

      {error && (
        <div style={{ background: '#ef444422', border: '1px solid #ef4444', borderRadius: '10px', padding: '14px', color: '#ef4444', marginBottom: '24px' }}>
          {error}
        </div>
      )}

      {refundResult && (
        <div style={{ background: '#10b98122', border: '1px solid #10b981', borderRadius: '16px', padding: '20px', marginBottom: '24px' }}>
          <h3 style={{ color: '#10b981', margin: '0 0 12px' }}>✅ Refund Successfully Processed</h3>
          <p style={{ margin: 0, color: '#f8fafc' }}>
            Refund ID: <code style={{ color: '#6366f1' }}>{refundResult.refund_id || refundResult.id}</code> | Amount: {fmt(refundResult.amount)} | Status: {refundResult.status_display}
          </p>
        </div>
      )}

      {txn && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {/* Metadata */}
          <div style={{ background: '#1e293b', borderRadius: '16px', border: '1px solid #334155', padding: '24px' }}>
            <h3 style={{ margin: '0 0 20px', color: '#f8fafc' }}>Transaction Overview</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {[
                ['Transaction ID', txn.transaction_id],
                ['Order ID', txn.gateway_order_id],
                ['Gateway', txn.gateway_name],
                ['Amount', fmt(txn.amount)],
                ['Receipt', txn.receipt_number || 'N/A'],
                ['Paid At', txn.paid_at ? new Date(txn.paid_at).toLocaleString() : 'N/A'],
              ].map(([k, v]) => (
                <div key={k}>
                  <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>{k}</div>
                  <div style={{ color: '#f8fafc', fontWeight: 600, fontFamily: 'monospace', marginTop: '2px' }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Current Status:</span>
              <span
                style={{
                  background: `${statusColors[txn.status] || '#6b7280'}22`,
                  color: statusColors[txn.status] || '#6b7280',
                  padding: '6px 14px',
                  borderRadius: '999px',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  textTransform: 'capitalize',
                }}
              >
                {txn.status_display}
              </span>
            </div>
          </div>

          {/* Refund Actions */}
          <div style={{ background: '#1e293b', borderRadius: '16px', border: '1px solid #334155', padding: '24px' }}>
            <h3 style={{ margin: '0 0 20px', color: '#f8fafc' }}>Issue Gateway Refund</h3>
            {txn.status !== 'success' && txn.status !== 'partial_refund' ? (
              <p style={{ color: '#64748b' }}>Only successful or partially refunded transactions can be refunded.</p>
            ) : (
              <form onSubmit={handleInitiateRefund} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.75rem', marginBottom: '6px' }}>Refund Amount (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    max={txn.amount}
                    value={refundAmount}
                    onChange={(e) => setRefundAmount(e.target.value)}
                    required
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', color: '#f8fafc', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.75rem', marginBottom: '6px' }}>Reason for Refund</label>
                  <input
                    value={refundReason}
                    onChange={(e) => setRefundReason(e.target.value)}
                    placeholder="e.g. Duplicate fee payment, Course cancellation"
                    required
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', color: '#f8fafc', boxSizing: 'border-box' }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '14px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {loading ? 'Processing Refund...' : '↩️ Process Gateway Refund'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionDetailsPage;
