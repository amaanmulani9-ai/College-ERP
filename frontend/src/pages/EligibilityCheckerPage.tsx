import React, { useEffect, useState } from 'react';
import scholarshipService, { ScholarshipType } from '../services/scholarshipService';

export const EligibilityCheckerPage: React.FC = () => {
  const [types, setTypes] = useState<ScholarshipType[]>([]);
  const [cgpa, setCgpa] = useState<string>('8.5');
  const [income, setIncome] = useState<string>('300000');
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await scholarshipService.getTypes();
        setTypes(data);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  const numCgpa = parseFloat(cgpa) || 0.0;
  const numIncome = income ? parseFloat(income) : null;

  const eligiblePrograms = types.filter((t) => {
    if (!t.is_active) return false;
    if (t.min_cgpa_requirement > 0 && numCgpa < t.min_cgpa_requirement) return false;
    if (t.max_family_income && numIncome && numIncome > t.max_family_income) return false;
    return true;
  });

  return (
    <div style={{ padding: '32px', background: '#0f172a', minHeight: '100vh', color: '#f8fafc' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: 0 }}>⚡ Eligibility Checker</h1>
        <p style={{ color: '#94a3b8', marginTop: '8px' }}>
          Evaluate CGPA and family income against institutional & government scholarship rules
        </p>
      </div>

      {/* Input Form */}
      <div style={{ background: '#1e293b', borderRadius: '16px', border: '1px solid #334155', padding: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 120px', gap: '16px', alignItems: 'flex-end' }}>
          <div>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.75rem', marginBottom: '6px' }}>Current CGPA (0.0 - 10.0)</label>
            <input
              id="input-check-cgpa"
              type="number"
              step="0.1"
              min="0"
              max="10"
              value={cgpa}
              onChange={(e) => setCgpa(e.target.value)}
              style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '12px 14px', color: '#f8fafc', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.75rem', marginBottom: '6px' }}>Annual Family Income (₹)</label>
            <input
              id="input-check-income"
              type="number"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              placeholder="e.g. 250000"
              style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '12px 14px', color: '#f8fafc', boxSizing: 'border-box' }}
            />
          </div>
          <button
            id="btn-run-eligibility-check"
            onClick={() => setChecked(true)}
            style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 16px',
              fontWeight: 700,
              cursor: 'pointer',
              height: '46px',
            }}
          >
            Check
          </button>
        </div>
      </div>

      {/* Results */}
      {checked && (
        <div>
          <h2 style={{ fontSize: '1.25rem', color: '#cbd5e1', marginBottom: '16px' }}>
            Eligible Programs ({eligiblePrograms.length})
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            {eligiblePrograms.map((p) => (
              <div key={p.id} style={{ background: '#10b98111', border: '1px solid #10b981', borderRadius: '16px', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <h3 style={{ margin: 0, color: '#f8fafc', fontSize: '1.125rem' }}>{p.name}</h3>
                  <span style={{ color: '#10b981', fontWeight: 700, fontSize: '0.875rem' }}>✅ Eligible</span>
                </div>
                <p style={{ margin: '0 0 12px', color: '#94a3b8', fontSize: '0.875rem' }}>Code: {p.code} | Provider: {p.provider_display}</p>
                <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
                  Req CGPA: {p.min_cgpa_requirement} | Income Cap: {p.max_family_income ? `₹${p.max_family_income}` : 'None'}
                </div>
              </div>
            ))}
            {eligiblePrograms.length === 0 && (
              <div style={{ background: '#ef444411', border: '1px solid #ef4444', borderRadius: '16px', padding: '24px', textAlign: 'center', color: '#ef4444', gridColumn: '1 / -1' }}>
                ❌ No eligible scholarship programs match these criteria.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EligibilityCheckerPage;
