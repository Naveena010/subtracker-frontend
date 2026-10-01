import { useEffect, useState } from 'react';
import { Ticket, BadgePercent } from 'lucide-react';
import { getMySubscriptions } from '../../api/subscriptionApi';
import { redeemCoupon } from '../../api/couponApi';
import Banner from '../../components/Banner';

export default function RedeemCoupon() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [couponCode, setCouponCode] = useState('');
  const [subscriptionId, setSubscriptionId] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getMySubscriptions()
      .then((data) => {
        const active = (data.content || []).filter((s) => s.active);
        setSubscriptions(active);
        if (active.length > 0) setSubscriptionId(String(active[0].id));
      })
      .catch((err) => setError(err.message));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);

    if (!couponCode || !subscriptionId) {
      setError('Enter a coupon code and pick a subscription.');
      return;
    }

    setSubmitting(true);
    try {
      const data = await redeemCoupon(couponCode.trim(), parseInt(subscriptionId, 10));
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Redeem a coupon</h1>
        <p>Apply a discount code to one of your active subscriptions.</p>
      </div>

      <div className="section">
        <h3><Ticket size={18} /> Apply a code</h3>
        <div className="desc">Pick an active subscription and enter the coupon code.</div>

        {subscriptions.length === 0 ? (
          <div className="empty">
            <Ticket />
            You have no active subscriptions to apply a coupon to.
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <label>Coupon code</label>
            <input
              type="text"
              placeholder="SAVE20"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
            />

            <label>Subscription</label>
            <select value={subscriptionId} onChange={(e) => setSubscriptionId(e.target.value)}>
              {subscriptions.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.serviceName} — ₹{Number(s.amount).toFixed(2)}
                </option>
              ))}
            </select>

            <button className="btn" type="submit" disabled={submitting}>
              <BadgePercent />
              {submitting ? 'Applying…' : 'Apply coupon'}
            </button>
          </form>
        )}

        <Banner type="error" message={error} />

        {result && (
          <div className="banner ok">
            <BadgePercent />
            <span>
              {result.message}
              <br />
              Was <span className="mono">₹{Number(result.originalAmount).toFixed(2)}</span> → now{' '}
              <span className="mono">₹{Number(result.discountedAmount).toFixed(2)}</span> (
              {result.discountPercentage}% off)
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
