import { useEffect, useState } from 'react';
import { PiggyBank, Users, Layers, XCircle, TrendingDown } from 'lucide-react';
import { getDashboard } from '../../api/adminApi';
import Banner from '../../components/Banner';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getDashboard()
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>How much money customers have stopped wasting, at a glance.</p>
      </div>

      <Banner type="error" message={error} />

      {loading ? (
        <div className="section">
          <div className="loading-line" style={{ width: '60%', height: 40 }} />
          <div className="loading-line" style={{ width: '100%' }} />
        </div>
      ) : data && (
        <>
          <div className="hero-stat">
            <div className="label">
              <PiggyBank />
              Total money saved from cancelled subscriptions
            </div>
            <div className="num">₹{Number(data.totalMoneySaved).toFixed(2)}</div>
          </div>

          <div className="stat-grid">
            <div className="stat-cell">
              <div className="icon"><Users /></div>
              <div className="n">{data.activeUsersCount}</div>
              <div className="l">Active users</div>
            </div>
            <div className="stat-cell">
              <div className="icon"><Layers /></div>
              <div className="n">{data.totalSubscriptionsTracked}</div>
              <div className="l">Subscriptions tracked</div>
            </div>
            <div className="stat-cell">
              <div className="icon"><XCircle /></div>
              <div className="n">{data.totalCancelledSubscriptions}</div>
              <div className="l">Cancelled</div>
            </div>
          </div>

          <div className="section">
            <h3><TrendingDown /> Most cancelled services</h3>
            <div className="desc">Where people were wasting the most money before catching it.</div>

            {(!data.mostCancelledServices || data.mostCancelledServices.length === 0) ? (
              <div className="empty">
                <XCircle />
                No cancellations recorded yet.
              </div>
            ) : (
              <div className="ledger">
                {data.mostCancelledServices.map((s) => (
                  <div className="ledger-row" key={s.serviceName}>
                    <div className="row-icon">
                      <XCircle />
                    </div>
                    <div className="name">
                      <div className="service">{s.serviceName}</div>
                    </div>
                    <div className="amount">{s.cancelCount}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
