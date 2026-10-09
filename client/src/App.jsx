import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Portfolio from './pages/Portfolio';
import Commission from './pages/Commission';
import Track from './pages/Track';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Account from './pages/Account';
import BookingDetails from './pages/BookingDetails';
import ArtistLogin from './pages/ArtistLogin';
import ArtistProtectedRoute from './components/ArtistProtectedRoute';
import ArtistLayout from './components/ArtistLayout';
import ArtistDashboard from './pages/ArtistDashboard';
import ArtistBookingDetails from './pages/ArtistBookingDetails';



import SiteLayout from './components/SiteLayout';
import { AuthProvider } from './context/AuthContext';
import { ArtistAuthProvider } from './context/ArtistAuthContext';
import ArtistBookings from './pages/ArtistBookings';

function App() {
  return (
    <AuthProvider>
      <ArtistAuthProvider>
        <BrowserRouter>
          <Routes>

            {/* Public / Customer website */}
            <Route element={<SiteLayout />}>

              <Route path="/" element={<Home />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/commission" element={<Commission />} />
              <Route path="/track" element={<Track />} />

              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route
                path="/forgot-password"
                element={<ForgotPassword />}
              />
              <Route
                path="/reset-password/:token"
                element={<ResetPassword />}
              />
              <Route path="/account" element={<Account />} />
              <Route
               path="/account/bookings/:bookingId"
               element={<BookingDetails />}
              />

            </Route>

            {/* Artist */}
            <Route
              path="/artist/login"
              element={<ArtistLogin />}
            />
           <Route element={<ArtistProtectedRoute />}>
  <Route element={<ArtistLayout />}>

    <Route
      path="/artist/dashboard"
     element={<ArtistDashboard />}
    />
     
      <Route
      path="/artist/bookings"
      element={<ArtistBookings />}
    />

    <Route
      path="/artist/bookings/:bookingId"
      element={<ArtistBookingDetails />}
    />


  </Route>
</Route>

          </Routes>
        </BrowserRouter>
      </ArtistAuthProvider>
    </AuthProvider>
  );
}

export default App;