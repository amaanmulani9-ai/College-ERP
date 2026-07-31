import React, { useEffect, useState } from 'react';
import paymentService, { PaymentGateway, PaymentTransaction, Refund } from '../services/paymentService';

const statusColors: Record<string, string> = {
  success: '#10b981',
  initiated: '#f59e0b',
  failed: '#ef4444',
  refunded: '#8b5cf6',
  partial_refund: '#ec4899',
};

export const PaymentDashboardPage: React.FC = () => {
  const [gateways, setGateways] = useState<PaymentGateway[]>([]);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [refunds, setRefunds] = useState<Refund[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [gwList, txList, rfList] = await Promise.all([
          paymentService.getGateways(),
          paymentService.getTransactions(),
          paymentService.getRefunds(),
        ]);
        setGateways(gwList);
        setTransactions(txList);
        setRefunds(rfList);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const totalProcessed = transactions
    .filter((t) => t.status === 'success' || t.status === 'refunded' || t.status === 'partial_refund')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalRefunded = refunds
    .filter((r) => r.status === 'success')
    .reduce((sum, r) => sum + Number(r.amount), 0);

  const successCount = transactions.filter((t) => t.status === 'success').length;
  const failedCount = transactions.filter((t) => t.status === 'failed').length;

  const fmt = (n: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

  return (
    <div style={{ padding: '32px', background: '#0f172a', minHeight: '100vh', color: '#f8fafc' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: 0 }}>💳 Payment Gateway Dashboard</h1>
        <p style={{ color: '#94a3b8', marginTop: '8px' }}>
          Overview of online transactions, gateway statuses, and refund processing
        </p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {[
          { label: 'Total Volume', value: fmt(totalProcessed), icon: '💰', color: '#10b981' },
          { label: 'Successful Txns', value: successCount, icon: '✅', color: '#3b82f6' },
          { label: 'Failed Txns', value: failedCount, icon: '⚠️', color: '#ef4444' },
          { label: 'Total Refunded', value: fmt(totalRefunded), icon: '↩️', color: '#8b5cf6' },
        ].map((c) => (
          <div
            key={c.label}
            style={{
              background: 'linear-gradient(135deg, #1e293b, #0f172a)',
              borderRadius: '16px',
              padding: '24px',
              border: `1px solid ${c.color}33`,
              boxShadow: `0 0 20px ${c.color}22`,
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{c.icon}</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: c.color }}>{c.value}</div>
            <div style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '4px' }}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* Active Gateways */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.125rem', color: '#cbd5e1', marginBottom: '16px' }}>Configured Gateways</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          {gateways.map((gw) => (
            <div
              key={gw.id}
              style={{
                background: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '12px',
                padding: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: '1rem', color: '#f8fafc' }}>{gw.name}</h3>
                <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: '#94a3b8' }}>
                  Provider: <span style={{ color: '#6366f1', fontWeight: 600 }}>{gw.provider_display}</span>
                </p>
              </div>
              <span
                style={{
                  background: gw.is_active ? '#10b98122' : '#6b728022',
                  color: gw.is_active ? '#10b981' : '#6b7280',
                  padding: '4px 12px',
                  borderRadius: '999px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                }}
              >
                {gw.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
          ))}
          {gateways.length === 0 && <p style={{ color: '#64748b' }}>No gateways configured.</p>}
        </div>
      </div>

      {/* Recent Transactions */}
      <div style={{ background: '#1e293b', borderRadius: '16px', border: '1px solid #334155', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #334155' }}>
          <h2 style={{ margin: 0, fontSize: '1.125rem', color: '#f8fafc' }}>Recent Payment Transactions</h2>
        </div>
        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#94a3b8' }}>Loading transactions...</div>
        ) : transactions.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#94a3b8' }}>No payment transactions found.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#0f172a' }}>
                  {['Txn ID', 'Gateway', 'Amount', 'Status', 'Receipt', 'Date'].map((h) => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {transactions.slice(0, 10).map((t) => (
                  <tr key={t.id} style={{ borderTop: '1px solid #334155' }}>
                    <td style={{ padding: '14px 16px', color: '#f8fafc', fontWeight: 500, fontFamily: 'monospace' }}>
                      {t.transaction_id}
                    </td>
                    <td style={{ padding: '14px 16px', color: '#cbd5e1' }}>{t.gateway_name}</td>
                    <td style={{ padding: '14px 16px', color: '#10b981', fontWeight: 600 }}>{fmt(t.amount)}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span
                        style={{
                          background: `${statusColors[t.status] || '#6b7280'}22`,
                          color: statusColors[t.status] || '#6b7280',
                          padding: '4px 10px',
                          borderRadius: '999px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          textTransform: 'capitalize',
                        }}
                      >
                        {t.status_display}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', color: '#94a3b8', fontSize: '0.875rem' }}>
                      {t.receipt_number || '—'}
                    </td>
                    <td style={{ padding: '14px 16px', color: '#94a3b8', fontSize: '0.875rem' }}>
                      {new Date(t.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentDashboardPage;
