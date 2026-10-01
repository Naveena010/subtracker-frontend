import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Wallet, UserPlus, BellRing, Ticket, ShieldCheck } from 'lucide-react';
import { register as registerApi } from '../api/authApi';
import Banner, { fieldErrorsToText } from '../components/Banner';

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!fullName || !email || !password) {
      setError('Fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      await registerApi(fullName, email, password);
      setSuccess('Account created. Redirecting you to log in…');
      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      setError(err.fieldErrors ? fieldErrorsToText(err.fieldErrors) : err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-hero">
        <div className="auth-hero-top">
          <div className="brand-row">
            <div className="brand-mark">
              <Wallet size={20} strokeWidth={2.4} />
            </div>
            <div className="brand">Subtracker</div>
          </div>

          <h2>Every subscription, in one ledger.</h2>
          <p className="lede">
            Add what you're paying for once. Subtracker watches renewal dates and flags anything
            you haven't touched in a while.
          </p>

          <div className="auth-hero-features">
            <div className="feature">
              <BellRing />
              <span>Early warnings before unused subscriptions renew</span>
            </div>
            <div className="feature">
              <Ticket />
              <span>Apply discount coupons to lower what you owe</span>
            </div>
            <div className="feature">
              <ShieldCheck />
              <span>Free to track — takes under a minute to set up</span>
            </div>
          </div>
        </div>

        <div className="auth-hero-stats">
          <div className="stat">
            <div className="n">1 min</div>
            <div className="l">to add your first subscription</div>
          </div>
        </div>
      </div>

      <div className="auth-panel">
        <div className="auth-card">
          <h2>Create your account</h2>
          <div className="sub">New accounts start as customers.</div>

          <form onSubmit={handleSubmit}>
            <label>Full name</label>
            <input
              type="text"
              placeholder="Jordan Rivera"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />

            <label>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label>Password</label>
            <input
              type="password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button className="btn secondary full" type="submit" disabled={loading}>
              <UserPlus />
              {loading ? 'Creating account…' : 'Register'}
            </button>
          </form>

          <Banner type="error" message={error} />
          <Banner type="ok" message={success} />

          <div className="auth-switch">
            Already have an account? <Link to="/login">Log in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
