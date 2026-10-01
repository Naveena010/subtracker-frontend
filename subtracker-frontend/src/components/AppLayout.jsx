import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function AppLayout({ children }) {
  const { pathname } = useLocation();

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-column">
        <Topbar path={pathname} />
        <main className="main-content">{children}</main>
      </div>
    </div>
  );
}
