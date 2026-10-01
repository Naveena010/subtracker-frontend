import { useState } from 'react';
import { UserPlus, ShieldPlus } from 'lucide-react';
import { createUser } from '../../api/adminApi';
import Banner, { fieldErrorsToText } from '../../components/Banner';

const emptyForm = { fullName: '', email: '', password: '', role: 'ADMIN' };

export default function AddUser() {
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.fullName || !form.email || !form.password) {
      setError('Fill in all fields.');
      return;
    }

    setSubmitting(true);
    try {
      const data = await createUser(form);
      setSuccess(`${data.role} account created for ${data.email}.`);
      setForm(emptyForm);
    } catch (err) {
      setError(err.fieldErrors ? fieldErrorsToText(err.fieldErrors) : err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Add a user</h1>
        <p>Create another admin or customer account. Only admins can do this.</p>
      </div>

      <div className="section">
        <h3><ShieldPlus size={18} /> New account</h3>
        <div className="desc">Pick a role — admin accounts get full access to coupons, dashboard, and alerts.</div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div>
              <label>Full name</label>
              <input
                type="text"
                placeholder="Jordan Rivera"
                value={form.fullName}
                onChange={handleChange('fullName')}
              />
            </div>
            <div>
              <label>Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange('email')}
              />
            </div>
            <div>
              <label>Password</label>
              <input
                type="password"
                placeholder="At least 6 characters"
                value={form.password}
                onChange={handleChange('password')}
              />
            </div>
            <div>
              <label>Role</label>
              <select value={form.role} onChange={handleChange('role')}>
                <option value="ADMIN">Admin</option>
                <option value="CUSTOMER">Customer</option>
              </select>
            </div>
          </div>

          <button className="btn" type="submit" disabled={submitting}>
            <UserPlus />
            {submitting ? 'Creating…' : 'Create account'}
          </button>
        </form>

        <Banner type="error" message={error} />
        <Banner type="ok" message={success} />
      </div>
    </div>
  );
}