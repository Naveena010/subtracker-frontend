const titles = {
  '/subscriptions': 'Subscriptions',
  '/notifications': 'Notifications',
  '/redeem': 'Redeem coupon',
  '/admin/coupons': 'Coupons',
  '/admin/dashboard': 'Dashboard',
  '/admin/alerts': 'Alert scheduler',
};

export default function Topbar({ path }) {
  const title = titles[path] || 'Subtracker';
  const today = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="topbar">
      <div className="crumb">
        Subtracker <span style={{ margin: '0 6px' }}>/</span> <strong>{title}</strong>
      </div>
      <div className="date">{today}</div>
    </div>
  );
}
