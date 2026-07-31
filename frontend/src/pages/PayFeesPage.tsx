import React, { useEffect, useState } from 'react';
import feeService, { StudentFee } from '../services/feeService';
import paymentService, { PaymentGateway, PaymentOrder, PaymentTransaction } from '../services/paymentService';

export const PayFeesPage: React.FC = () => {
  const [studentId, setStudentId] = useState('');
  const [fees, setFees] = useState<StudentFee[]>([]);
  const [gateways, setGateways] = useState<PaymentGateway[]>([]);
  const [selectedFee, setSelectedFee] = useState<StudentFee | null>(null);
  const [selectedGateway, setSelectedGateway] = useState('');
  const [amount, setAmount] = useState('');
  const [order, setOrder] = useState<PaymentOrder | null>(null);
  const [txn, setTxn] = useState<PaymentTransaction | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const gwList = await paymentService.getGateways();
        const activeGw = gwList.filter((g) => g.is_active);
        setGateways(activeGw);
        if (activeGw.length > 0) setSelectedGateway(activeGw[0].id);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  const handleSearch = async () => {
    if (!studentId.trim()) return;
    setLoading(true);
    setError('');
    setSelectedFee(null);
    setOrder(null);
    setTxn(null);
    try {
      const data = await feeService.getStudentSummary(studentId.trim());
      setFees(data.fees || []);
    } catch {
      setError('Student not found or no outstanding fees.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFee || !selectedGateway || !amount) return;
    setLoading(true);
    setError('');
    try {
      const newOrder = await paymentService.createOrder({
        student_id: selectedFee.student,
        student_fee_id: selectedFee.id,
        gateway_id: selectedGateway,
        amount: parseFloat(amount),
      });
      setOrder(newOrder);
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Failed to create payment order.');
    } finally {
      setLoading(false);
    }
  };

  const handleSimulatePayment = async () => {
    if (!order) return;
    setLoading(true);
    setError('');
    try {
      // Simulate Razorpay successful checkout signature verification
      const mockPaymentId = `pay_${Math.random().toString(36).substring(2, 10)}`;
      const mockSignature = `sig_${Math.random().toString(36).substring(2, 15)}`;

      const verifiedTxn = await paymentService.verifyPayment({
        order_id: order.order_id,
        gateway_payment_id: mockPaymentId,
        gateway_signature: mockSignature,
      });

      setTxn(verifiedTxn);
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Payment verification failed.');
    } finally {
      setLoading(false);
    }
  };

  const fmt = (n: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

  return (
    <div style={{ padding: '32px', background: '#0f172a', minHeight: '100vh', color: '#f8fafc' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: 0 }}>💳 Pay Fees Online</h1>
        <p style={{ color: '#94a3b8', marginTop: '8px' }}>
          Select student fee → generate Razorpay checkout order → verify payment & receipt
        </p>
      </div>

      {/* Step 1: Student Lookup */}
      <div style={{ background: '#1e293b', borderRadius: '16px', border: '1px solid #334155', padding: '24px', marginBottom: '24px' }}>
        <h2 style={{ margin: '0 0 16px', fontSize: '1rem', color: '#f8fafc' }}>Step 1: Locate Student</h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <input
            id="input-student-pay"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="Enter Student UUID or Student ID"
            style={{
              flex: 1,
              background: '#0f172a',
              border: '1px solid #334155',
              borderRadius: '10px',
              padding: '12px 16px',
              color: '#f8fafc',
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            id="btn-search-pay"
            onClick={handleSearch}
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
            {loading ? 'Searching...' : 'Lookup Fees'}
          </button>
        </div>
      </div>

      {error && (
        <div style={{ background: '#ef444422', border: '1px solid #ef4444', borderRadius: '10px', padding: '14px', color: '#ef4444', marginBottom: '24px' }}>
          {error}
        </div>
      )}

      {/* Step 2: Select Fee & Gateway */}
      {fees.length > 0 && !txn && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div style={{ background: '#1e293b', borderRadius: '16px', border: '1px solid #334155', padding: '20px' }}>
            <h3 style={{ margin: '0 0 16px', color: '#f8fafc' }}>Select Pending Fee</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {fees.map((f) => (
                <div
                  key={f.id}
                  onClick={() => {
                    setSelectedFee(f);
                    setAmount(String(f.due_amount));
                  }}
                  style={{
                    background: selectedFee?.id === f.id ? '#6366f122' : '#0f172a',
                    border: `1px solid ${selectedFee?.id === f.id ? '#6366f1' : '#334155'}`,
                    borderRadius: '12px',
                    padding: '14px',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontWeight: 600, color: '#f8fafc' }}>{f.fee_structure_detail?.category_detail?.name || 'Fee'}</span>
                    <span style={{ color: '#ef4444', fontWeight: 700 }}>Due: {fmt(f.due_amount)}</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Total: {fmt(f.total_amount)} | Status: {f.status_display}</div>
                </div>
              ))}
            </div>
          </div>

          {selectedFee && (
            <div style={{ background: '#1e293b', borderRadius: '16px', border: '1px solid #334155', padding: '20px' }}>
              <h3 style={{ margin: '0 0 16px', color: '#f8fafc' }}>Checkout Details</h3>
              <form onSubmit={handleCreateOrder} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.75rem', marginBottom: '6px' }}>Payment Gateway</label>
                  <select
                    value={selectedGateway}
                    onChange={(e) => setSelectedGateway(e.target.value)}
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '10px', color: '#f8fafc' }}
                  >
                    {gateways.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.name} ({g.provider_display})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.75rem', marginBottom: '6px' }}>Amount to Pay (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    max={selectedFee.due_amount}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', color: '#f8fafc', boxSizing: 'border-box' }}
                  />
                </div>

                {!order ? (
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '14px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {loading ? 'Creating Order...' : 'Generate Razorpay Order'}
                  </button>
                ) : (
                  <div style={{ background: '#0f172a', border: '1px solid #10b981', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
                    <p style={{ color: '#10b981', margin: '0 0 12px', fontWeight: 600 }}>
                      Order Created: <code style={{ color: '#fff' }}>{order.order_id}</code>
                    </p>
                    <button
                      type="button"
                      onClick={handleSimulatePayment}
                      disabled={loading}
                      style={{
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '12px 20px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        width: '100%',
                      }}
                    >
                      {loading ? 'Verifying Signature...' : '🚀 Complete Razorpay Checkout'}
                    </button>
                  </div>
                )}
              </form>
            </div>
          )}
        </div>
      )}

      {/* Step 3: Receipt Generated */}
      {txn && (
        <div style={{ background: '#10b98122', border: '1px solid #10b981', borderRadius: '16px', padding: '24px' }}>
          <h3 style={{ color: '#10b981', margin: '0 0 16px' }}>🎉 Payment Successful & Verified</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div>
              <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Transaction ID</div>
              <div style={{ color: '#f8fafc', fontWeight: 700, fontFamily: 'monospace' }}>{txn.transaction_id}</div>
            </div>
            <div>
              <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Order ID</div>
              <div style={{ color: '#f8fafc', fontWeight: 700, fontFamily: 'monospace' }}>{txn.gateway_order_id}</div>
            </div>
            <div>
              <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Amount Paid</div>
              <div style={{ color: '#10b981', fontWeight: 700 }}>{fmt(txn.amount)}</div>
            </div>
            <div>
              <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Auto Fee Receipt</div>
              <div style={{ color: '#3b82f6', fontWeight: 700 }}>{txn.receipt_number || 'Generated'}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayFeesPage;
