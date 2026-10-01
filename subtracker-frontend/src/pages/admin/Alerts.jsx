import { useState } from 'react';
import { Clock, Zap } from 'lucide-react';
import { triggerAlerts } from '../../api/adminApi';
import Banner from '../../components/Banner';

export default function Alerts() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleTrigger = async () => {
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const data = await triggerAlerts();
      setSuccess(typeof data === 'string' ? data : 'Alert check complete. Check the backend console log.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Alert scheduler</h1>
        <p>Alerts normally run automatically once a day.</p>
      </div>

      <div className="section">
        <h3><Clock size={18} /> Run alert check now</h3>
        <div className="desc">
          Use this to run the check immediately instead of waiting for the daily schedule — useful
          while testing. Results appear in the backend's console log and in each affected customer's
          notification list.
        </div>

        <button className="btn amber" onClick={handleTrigger} disabled={loading}>
          <Zap />
          {loading ? 'Running…' : 'Run alert check now'}
        </button>

        <Banner type="error" message={error} />
        <Banner type="ok" message={success} />
      </div>
    </div>
  );
}
