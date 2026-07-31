import React, { useState } from 'react';
import feeService, { FeeReceipt, StudentFee } from '../services/feeService';

const CollectFeePage: React.FC = () => {
  const [studentId, setStudentId] = useState('');
  const [summary, setSummary] = useState<any>(null);
  const [selectedFee, setSelectedFee] = useState<StudentFee | null>(null);
  const [selectedInstallment, setSelectedInstallment] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState('cash');
  const [remarks, setRemarks] = useState('');
  const [receipt, setReceipt] = useState<FeeReceipt | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const searchStudent = async () => {
    if (!studentId.trim()) return;
    setLoading(true);
    setError('');
    setSummary(null);
    setSelectedFee(null);
    setReceipt(null);
    try {
      const data = await feeService.getStudentSummary(studentId.trim());
      setSummary(data);
    } catch {
      setError('Student not found or no fees assigned.');
    } finally {
      setLoading(false);
    }
  };

  const handleCollect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFee || !amount) return;
    setLoading(true);
    setError('');
    try {
      const r = await feeService.collectFee({
        student_fee_id: selectedFee.id,
        amount: parseFloat(amount),
        payment_mode: paymentMode,
        installment_id: selectedInstallment || undefined,
        remarks,
      });
      setReceipt(r);
      setAmount('');
      setRemarks('');
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Payment failed.');
    } finally {
      setLoading(false);
    }
  };

  const fmt = (n: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

  const payModes = ['cash', 'cheque', 'bank_transfer', 'upi', 'online', 'draft'];

  return (
    <div style={{ padding: '32px', background: '#0f172a', minHeight: '100vh', color: '#f8fafc' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
          💸 Collect Fee
        </h1>
        <p style={{ color: '#94a3b8', marginTop: '8px' }}>Search student → select fee → collect payment → generate receipt</p>
      </div>

      {/* Search */}
      <div style={{ background: '#1e293b', borderRadius: '16px', border: '1px solid #334155', padding: '24px', marginBottom: '24px' }}>
        <h2 style={{ margin: '0 0 16px', color: '#f8fafc', fontSize: '1rem' }}>Search Student</h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <input
            id="student-search-input"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="Enter Student ID or UUID"
            style={{
              flex: 1,
              background: '#0f172a',
              border: '1px solid #334155',
              borderRadius: '10px',
              padding: '12px 16px',
              color: '#f8fafc',
              fontSize: '0.875rem',
            }}
            onKeyDown={(e) => e.key === 'Enter' && searchStudent()}
          />
          <button
            id="btn-search-student"
            onClick={searchStudent}
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
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>

      {error && (
        <div style={{
          background: '#ef444422',
          border: '1px solid #ef4444',
          borderRadius: '10px',
          padding: '12px 16px',
          color: '#ef4444',
          marginBottom: '16px',
        }}>
          {error}
        </div>
      )}

      {/* Receipt Success */}
      {receipt && (
        <div style={{
          background: '#10b98122',
          border: '1px solid #10b981',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
        }}>
          <h3 style={{ color: '#10b981', margin: '0 0 16px' }}>✅ Payment Collected — Receipt Generated</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            {[
              ['Receipt No.', receipt.receipt_number],
              ['Amount', fmt(receipt.amount)],
              ['Mode', receipt.payment_mode_display],
              ['Date', receipt.payment_date],
              ['Status', receipt.status],
            ].map(([k, v]) => (
              <div key={k}>
                <div style={{ color: '#64748b', fontSize: '0.75rem' }}>{k}</div>
                <div style={{ color: '#f8fafc', fontWeight: 600 }}>{v}</div>
              </div>
            ))}
          </div>
          <button
            id="btn-print-receipt"
            onClick={() => window.print()}
            style={{
              marginTop: '16px',
              background: 'transparent',
              border: '1px solid #10b981',
              color: '#10b981',
              borderRadius: '8px',
              padding: '8px 16px',
              cursor: 'pointer',
            }}
          >
            🖨️ Print Receipt
          </button>
        </div>
      )}

      {/* Fee Summary */}
      {summary && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {/* Fee List */}
          <div style={{ background: '#1e293b', borderRadius: '16px', border: '1px solid #334155', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #334155' }}>
              <h3 style={{ margin: 0, color: '#f8fafc' }}>Assigned Fees</h3>
            </div>
            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {(summary.fees || []).map((f: StudentFee) => (
                <div
                  key={f.id}
                  onClick={() => { setSelectedFee(f); setSelectedInstallment(''); }}
                  style={{
                    background: selectedFee?.id === f.id ? '#6366f122' : '#0f172a',
                    border: `1px solid ${selectedFee?.id === f.id ? '#6366f1' : '#334155'}`,
                    borderRadius: '12px',
                    padding: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: '#f8fafc', fontWeight: 600 }}>
                      {f.fee_structure_detail?.category_detail?.name || 'Fee'}
                    </span>
                    <span style={{
                      background: f.status === 'paid' ? '#10b98122' : '#f59e0b22',
                      color: f.status === 'paid' ? '#10b981' : '#f59e0b',
                      padding: '2px 8px',
                      borderRadius: '999px',
                      fontSize: '0.75rem',
                    }}>
                      {f.status_display}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem' }}>
                    <span style={{ color: '#94a3b8' }}>Due: <span style={{ color: '#ef4444' }}>{fmt(f.due_amount)}</span></span>
                    <span style={{ color: '#94a3b8' }}>Paid: <span style={{ color: '#10b981' }}>{fmt(f.paid_amount)}</span></span>
                  </div>
                </div>
              ))}
              {(summary.fees || []).length === 0 && (
                <p style={{ color: '#64748b', textAlign: 'center' }}>No fees assigned.</p>
              )}
            </div>
          </div>

          {/* Payment Form */}
          {selectedFee && (
            <div style={{ background: '#1e293b', borderRadius: '16px', border: '1px solid #334155', padding: '20px' }}>
              <h3 style={{ margin: '0 0 16px', color: '#f8fafc' }}>Collect Payment</h3>
              <form onSubmit={handleCollect} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.75rem', marginBottom: '6px' }}>
                    Installment (optional)
                  </label>
                  <select
                    id="select-installment"
                    value={selectedInstallment}
                    onChange={(e) => setSelectedInstallment(e.target.value)}
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '10px', color: '#f8fafc' }}
                  >
                    <option value="">Full payment / No installment</option>
                    {(selectedFee.installments || []).map((inst) => (
                      <option key={inst.id} value={inst.id}>
                        #{inst.installment_no} — {fmt(inst.amount)} (due {inst.due_date}) [{inst.status}]
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.75rem', marginBottom: '6px' }}>Amount (₹)*</label>
                  <input
                    id="payment-amount"
                    type="number"
                    step="0.01"
                    min="1"
                    max={selectedFee.due_amount}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    placeholder={`Max: ${fmt(selectedFee.due_amount)}`}
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', color: '#f8fafc', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.75rem', marginBottom: '6px' }}>Payment Mode*</label>
                  <select
                    id="payment-mode"
                    value={paymentMode}
                    onChange={(e) => setPaymentMode(e.target.value)}
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '10px', color: '#f8fafc' }}
                  >
                    {payModes.map((m) => (
                      <option key={m} value={m}>{m.replace('_', ' ').toUpperCase()}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.75rem', marginBottom: '6px' }}>Remarks</label>
                  <input
                    id="payment-remarks"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Optional remarks..."
                    style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', color: '#f8fafc', boxSizing: 'border-box' }}
                  />
                </div>

                <button
                  id="btn-collect-payment"
                  type="submit"
                  disabled={loading}
                  style={{
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '14px',
                    cursor: 'pointer',
                    fontWeight: 700,
                    fontSize: '1rem',
                  }}
                >
                  {loading ? 'Processing...' : '💳 Collect & Generate Receipt'}
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CollectFeePage;
