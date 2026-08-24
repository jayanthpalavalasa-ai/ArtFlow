import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

function SiteLayout() {
  return (
    <div className="min-h-screen bg-[#0B0B0B] text-[#F1EEE7]">
      <Navbar />

      <Outlet />
    </div>
  );
}

export default SiteLayout;