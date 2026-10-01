import { useEffect, useState } from 'react';
import { Plus, Wallet, CircleOff, CircleCheck, Trash2, XCircle } from 'lucide-react';
import {
  getMySubscriptions,
  addSubscription,
  updateUsage,
  cancelSubscription,
  deleteSubscription,
} from '../../api/subscriptionApi';
import Banner, { fieldErrorsToText } from '../../components/Banner';

const emptyForm = { serviceName: '', amount: '', billingCycle: 'MONTHLY', nextBillingDate: '' };

export default function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadSubscriptions = async () => {
    setLoading(true);
    try {
      const data = await getMySubscriptions();
      setSubscriptions(data.content || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleAdd = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.serviceName || !form.amount || !form.nextBillingDate) {
      setError('Fill in service name, amount, and next billing date.');
      return;
    }

    setSubmitting(true);
    try {
      await addSubscription({ ...form, amount: parseFloat(form.amount) });
      setForm(emptyForm);
      setSuccess('Subscription added.');
      loadSubscriptions();
    } catch (err) {
      setError(err.fieldErrors ? fieldErrorsToText(err.fieldErrors) : err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleUsage = async (id, nextUsed) => {
    setError('');
    try {
      await updateUsage(id, nextUsed);
      loadSubscriptions();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancel = async (id) => {
    setError('');
    try {
      await cancelSubscription(id);
      setSuccess('Subscription cancelled. That amount now counts toward your savings.');
      loadSubscriptions();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    setError('');
    try {
      await deleteSubscription(id);
      loadSubscriptions();
    } catch (err) {
      setError(err.message);
    }
  };

  const unusedCount = subscriptions.filter((s) => s.active && !s.usedRecently).length;

  return (
    <div>
      <div className="page-header">
        <h1>Subscriptions</h1>
        <p>Every service you're paying for, tracked in one place. Mark anything unused to get an alert before it renews.</p>
      </div>

      <div className="section">
        <h3><Plus size={18} /> Add a subscription</h3>
        <div className="desc">Fill in what you're being charged and when it renews next.</div>

        <form onSubmit={handleAdd}>
          <div className="form-grid">
            <div>
              <label>Service name</label>
              <input
                type="text"
                placeholder="Netflix"
                value={form.serviceName}
                onChange={handleChange('serviceName')}
              />
            </div>
            <div>
              <label>Amount charged</label>
              <input
                type="number"
                step="0.01"
                placeholder="499"
                value={form.amount}
                onChange={handleChange('amount')}
              />
            </div>
            <div>
              <label>Billing cycle</label>
              <select value={form.billingCycle} onChange={handleChange('billingCycle')}>
                <option value="MONTHLY">Monthly</option>
                <option value="YEARLY">Yearly</option>
              </select>
            </div>
            <div>
              <label>Next billing date</label>
              <input
                type="date"
                value={form.nextBillingDate}
                onChange={handleChange('nextBillingDate')}
              />
            </div>
          </div>

          <button className="btn" type="submit" disabled={submitting}>
            <Plus />
            {submitting ? 'Adding…' : 'Add subscription'}
          </button>
        </form>

        <Banner type="error" message={error} />
        <Banner type="ok" message={success} />
      </div>

      <div className="section">
        <div className="section-head">
          <div>
            <h3><Wallet size={18} /> Your subscriptions</h3>
            <div className="desc">Mark anything unused so Subtracker can warn you before it renews.</div>
          </div>
          {!loading && subscriptions.length > 0 && (
            <div className="count-chip">
              {subscriptions.length} tracked{unusedCount > 0 ? ` · ${unusedCount} unused` : ''}
            </div>
          )}
        </div>

        {loading ? (
          <>
            <div className="loading-line" style={{ width: '100%' }} />
            <div className="loading-line" style={{ width: '80%' }} />
          </>
        ) : subscriptions.length === 0 ? (
          <div className="empty">
            <Wallet />
            No subscriptions tracked yet. Add one above.
          </div>
        ) : (
          <div className="ledger">
            {subscriptions.map((s) => {
              const flagged = s.active && !s.usedRecently;
              return (
                <div className="ledger-row" key={s.id}>
                  <div className={`row-icon ${!s.active ? '' : flagged ? 'warn' : 'ok'}`}>
                    {!s.active ? <CircleOff /> : flagged ? <CircleOff /> : <CircleCheck />}
                  </div>
                  <div className="name">
                    <div className="service">
                      {s.serviceName}
                      {!s.active && <span className="badge off">CANCELLED</span>}
                      {flagged && <span className="badge warn">UNUSED</span>}
                    </div>
                    <div className="meta">
                      {s.billingCycle} · renews {s.nextBillingDate}
                    </div>
                  </div>
                  <div className="amount">₹{Number(s.amount).toFixed(2)}</div>
                  <div className="row-actions">
                    {s.active && (
                      <button onClick={() => handleToggleUsage(s.id, !s.usedRecently)}>
                        {s.usedRecently ? <CircleOff /> : <CircleCheck />}
                        {s.usedRecently ? 'Mark unused' : 'Mark used'}
                      </button>
                    )}
                    {s.active && (
                      <button onClick={() => handleCancel(s.id)}>
                        <XCircle />
                        Cancel
                      </button>
                    )}
                    <button onClick={() => handleDelete(s.id)}>
                      <Trash2 />
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
