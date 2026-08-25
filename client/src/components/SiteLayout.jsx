import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

function SiteLayout() {
  return (
    <div className="min-h-screen bg-ink text-paper font-sans">
      <Navbar />
      <Outlet />
    </div>
  );
}

export default SiteLayout;
