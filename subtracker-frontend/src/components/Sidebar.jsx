import { NavLink } from 'react-router-dom';
import { Wallet, Bell, Ticket, BadgePercent, LayoutDashboard, Clock, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const customerLinks = [
  { to: '/subscriptions', label: 'Subscriptions', icon: Wallet },
  { to: '/notifications', label: 'Notifications', icon: Bell },
  { to: '/redeem', label: 'Redeem coupon', icon: Ticket },
];

const adminLinks = [
  { to: '/admin/coupons', label: 'Coupons', icon: BadgePercent },
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/alerts', label: 'Alerts', icon: Clock },
];

export default function Sidebar() {
  const { role, email, logout } = useAuth();
  const links = role === 'ADMIN' ? adminLinks : customerLinks;
  const initials = email ? email.slice(0, 2).toUpperCase() : '??';

  return (
    <aside className="sidebar">
      <div className="brand-row">
        <div className="brand-mark">
          <Wallet size={18} strokeWidth={2.4} />
        </div>
        <div className="brand">Subtracker</div>
      </div>
      <div className="tagline">Track what you pay for. Cancel what you don't use.</div>

      <div className="role-tag">
        <span className="dot" />
        {role}
      </div>

      <nav>
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              <Icon />
              {link.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar">{initials}</div>
          <div className="email">{email}</div>
        </div>
        <button className="logout-btn" onClick={logout}>
          <LogOut />
          Log out
        </button>
      </div>
    </aside>
  );
}
