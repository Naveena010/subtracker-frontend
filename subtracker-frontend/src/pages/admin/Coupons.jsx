import { useEffect, useState } from 'react';
import { Plus, BadgePercent, Ban } from 'lucide-react';
import { createCoupon, getAllCoupons, deactivateCoupon } from '../../api/couponApi';
import Banner, { fieldErrorsToText } from '../../components/Banner';

const emptyForm = { code: '', discountPercentage: '', expiryDate: '' };

export default function Coupons() {
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadCoupons = async () => {
    setLoading(true);
    try {
      const data = await getAllCoupons();
      setCoupons(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.code || !form.discountPercentage || !form.expiryDate) {
      setError('Fill in code, discount, and expiry date.');
      return;
    }

    setSubmitting(true);
    try {
      await createCoupon({ ...form, discountPercentage: parseFloat(form.discountPercentage) });
      setForm(emptyForm);
      setSuccess('Coupon created.');
      loadCoupons();
    } catch (err) {
      setError(err.fieldErrors ? fieldErrorsToText(err.fieldErrors) : err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeactivate = async (id) => {
    setError('');
    try {
      await deactivateCoupon(id);
      loadCoupons();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Coupons</h1>
        <p>Issue discount codes customers can redeem against an active subscription.</p>
      </div>

      <div className="section">
        <h3><Plus size={18} /> Issue a coupon</h3>
        <div className="desc">Set a code, a discount percentage, and when it expires.</div>

        <form onSubmit={handleCreate}>
          <div className="form-grid">
            <div>
              <label>Coupon code</label>
              <input type="text" placeholder="SAVE20" value={form.code} onChange={handleChange('code')} />
            </div>
            <div>
              <label>Discount percentage</label>
              <input
                type="number"
                step="1"
                placeholder="20"
                value={form.discountPercentage}
                onChange={handleChange('discountPercentage')}
              />
            </div>
            <div>
              <label>Expiry date</label>
              <input type="date" value={form.expiryDate} onChange={handleChange('expiryDate')} />
            </div>
          </div>

          <button className="btn" type="submit" disabled={submitting}>
            <Plus />
            {submitting ? 'Creating…' : 'Create coupon'}
          </button>
        </form>

        <Banner type="error" message={error} />
        <Banner type="ok" message={success} />
      </div>

      <div className="section">
        <div className="section-head">
          <h3><BadgePercent size={18} /> All coupons</h3>
          {!loading && coupons.length > 0 && <div className="count-chip">{coupons.length} issued</div>}
        </div>

        {loading ? (
          <div className="loading-line" style={{ width: '100%' }} />
        ) : coupons.length === 0 ? (
          <div className="empty">
            <BadgePercent />
            No coupons issued yet.
          </div>
        ) : (
          <div className="ledger">
            {coupons.map((c) => (
              <div className="ledger-row" key={c.id}>
                <div className={`row-icon ${c.active ? 'ok' : ''}`}>
                  <BadgePercent />
                </div>
                <div className="name">
                  <div className="service">
                    {c.code}
                    {!c.active && <span className="badge off">INACTIVE</span>}
                  </div>
                  <div className="meta">
                    expires {c.expiryDate} · issued by {c.createdByEmail || '—'}
                  </div>
                </div>
                <div className="amount">{c.discountPercentage}%</div>
                <div className="row-actions">
                  {c.active && (
                    <button onClick={() => handleDeactivate(c.id)}>
                      <Ban />
                      Deactivate
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
