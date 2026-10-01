import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Wallet, LogIn, ShieldCheck, BellRing, Ticket } from 'lucide-react';
import { login as loginApi } from '../api/authApi';
import { useAuth } from '../context/AuthContext';
import Banner from '../components/Banner';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const data = await loginApi(email, password);
      login({ token: data.token, role: data.role, email: data.email });
      navigate(data.role === 'ADMIN' ? '/admin/dashboard' : '/subscriptions');
    } catch (err) {
      setError(err.message);
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

          <h2>Stop wasting money on subscriptions you forgot about.</h2>
          <p className="lede">
            Track every recurring charge, get warned before an unused one renews, and cancel it
            before the money leaves your account.
          </p>

          <div className="auth-hero-features">
            <div className="feature">
              <BellRing />
              <span>Alerts sent 3 days before an unused subscription bills you again</span>
            </div>
            <div className="feature">
              <Ticket />
              <span>Redeem coupons straight against an active subscription</span>
            </div>
            <div className="feature">
              <ShieldCheck />
              <span>Your data stays scoped to your account — nothing shared, nothing guessed</span>
            </div>
          </div>
        </div>

        <div className="auth-hero-stats">
          <div className="stat">
            <div className="n">3 day</div>
            <div className="l">early warning</div>
          </div>
          <div className="stat">
            <div className="n">₹0</div>
            <div className="l">wasted, once you know</div>
          </div>
        </div>
      </div>

      <div className="auth-panel">
        <div className="auth-card">
          <h2>Welcome back</h2>
          <div className="sub">Log in to see what's quietly draining your account.</div>

          <form onSubmit={handleSubmit}>
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
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button className="btn full" type="submit" disabled={loading}>
              <LogIn />
              {loading ? 'Logging in…' : 'Log in'}
            </button>
          </form>

          <Banner type="error" message={error} />

          <div className="auth-switch">
            Don't have an account? <Link to="/register">Register</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
