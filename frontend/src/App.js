import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import HotelBooking from './pages/HotelBooking';
import RideBooking from './pages/RideBooking';
import EventServices from './pages/EventServices';
import LuxuryRental from './pages/LuxuryRental';

const theme = createTheme({
  palette: {
    primary: {
      main: '#E91E63', // Pink color theme
    },
    secondary: {
      main: '#FF4081',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/hotel-booking" element={<HotelBooking />} />
            <Route path="/ride-booking" element={<RideBooking />} />
            <Route path="/event-services" element={<EventServices />} />
            <Route path="/luxury-rental" element={<LuxuryRental />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
