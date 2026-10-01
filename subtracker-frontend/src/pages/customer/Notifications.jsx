import { useEffect, useState } from 'react';
import { Bell, BellRing, Check } from 'lucide-react';
import { getMyNotifications, markNotificationRead } from '../../api/notificationApi';
import Banner from '../../components/Banner';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const data = await getMyNotifications();
      setNotifications(data.content || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleMarkRead = async (id) => {
    setError('');
    try {
      await markNotificationRead(id);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div>
      <div className="page-header">
        <h1>Notifications</h1>
        <p>Sent before an unused subscription renews, so you have time to cancel it.</p>
      </div>

      <div className="section">
        <div className="section-head">
          <h3><Bell size={18} /> Alerts</h3>
          {!loading && notifications.length > 0 && (
            <div className="count-chip">{unreadCount} unread</div>
          )}
        </div>

        <Banner type="error" message={error} />

        {loading ? (
          <>
            <div className="loading-line" style={{ width: '100%' }} />
            <div className="loading-line" style={{ width: '70%' }} />
          </>
        ) : notifications.length === 0 ? (
          <div className="empty">
            <Bell />
            No alerts yet. You'll see one here 3 days before an unused subscription renews.
          </div>
        ) : (
          <div className="ledger">
            {notifications.map((n) => (
              <div className="ledger-row" key={n.id}>
                <div className={`row-icon ${!n.isRead ? 'warn' : ''}`}>
                  <BellRing />
                </div>
                <div className="name">
                  <div className="service">
                    {n.serviceName || 'Subtracker'}
                    {!n.isRead && <span className="badge warn">NEW</span>}
                  </div>
                  <div className="meta">{n.message}</div>
                  <div className="meta">{new Date(n.createdAt).toLocaleString()}</div>
                </div>
                <div className="row-actions">
                  {!n.isRead && (
                    <button onClick={() => handleMarkRead(n.id)}>
                      <Check />
                      Mark read
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
