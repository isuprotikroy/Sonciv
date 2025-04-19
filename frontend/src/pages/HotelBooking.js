import React, { useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';

const hotels = [
  {
    id: 1,
    name: 'Luxury Palace Hotel',
    description: '5-star luxury hotel with premium amenities',
    image: 'https://source.unsplash.com/random/800x600/?luxury,hotel,room',
    pricePerNight: 15000,
    rating: 4.8,
  },
  {
    id: 2,
    name: 'Sonciv Grand Resort',
    description: 'Beachfront resort with private pools',
    image: 'https://source.unsplash.com/random/800x600/?resort,pool',
    pricePerNight: 12000,
    rating: 4.7,
  },
  {
    id: 3,
    name: 'Royal Heritage Hotel',
    description: 'Historic palace converted into luxury hotel',
    image: 'https://source.unsplash.com/random/800x600/?palace,hotel',
    pricePerNight: 18000,
    rating: 4.9,
  },
];

const roomTypes = [
  { value: 'deluxe', label: 'Deluxe Room', multiplier: 1 },
  { value: 'suite', label: 'Executive Suite', multiplier: 1.5 },
  { value: 'presidential', label: 'Presidential Suite', multiplier: 2.5 },
];

const HotelBooking = () => {
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [bookingDetails, setBookingDetails] = useState({
    checkIn: null,
    checkOut: null,
    roomType: 'deluxe',
  });
  const [openDialog, setOpenDialog] = useState(false);

  const handleBookNow = (hotel) => {
    setSelectedHotel(hotel);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedHotel(null);
  };

  const calculateTotalPrice = () => {
    if (!selectedHotel || !bookingDetails.checkIn || !bookingDetails.checkOut) return 0;
    
    const days = Math.ceil(
      (bookingDetails.checkOut - bookingDetails.checkIn) / (1000 * 60 * 60 * 24)
    );
    const roomMultiplier = roomTypes.find(r => r.value === bookingDetails.roomType).multiplier;
    return selectedHotel.pricePerNight * days * roomMultiplier;
  };

  const handleConfirmBooking = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // Redirect to login if not authenticated
        window.location.href = '/login';
        return;
      }

      const booking = {
        type: 'hotel',
        details: {
          hotelName: selectedHotel.name,
          roomType: bookingDetails.roomType,
          checkIn: bookingDetails.checkIn,
          checkOut: bookingDetails.checkOut,
        },
        totalAmount: calculateTotalPrice(),
      };

      const response = await axios.post(
        'http://localhost:5000/api/bookings',
        booking,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data) {
        // Create payment intent
        const paymentResponse = await axios.post(
          'http://localhost:5000/api/payments/create-payment-intent',
          {
            amount: calculateTotalPrice(),
            bookingId: response.data._id
          },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        // TODO: Implement Stripe payment form
        console.log('Payment intent created:', paymentResponse.data);
      }

      handleCloseDialog();
    } catch (error) {
      console.error('Booking error:', error);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', pb: 8, pt: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" component="h1" gutterBottom>
          Luxury Hotel Bookings
        </Typography>
        <Grid container spacing={4}>
          {hotels.map((hotel) => (
            <Grid item xs={12} md={4} key={hotel.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: '0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 6,
                  }
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={hotel.image}
                  alt={hotel.name}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {hotel.name}
                  </Typography>
                  <Typography gutterBottom>
                    {hotel.description}
                  </Typography>
                  <Typography variant="h6" color="primary">
                    ₹{hotel.pricePerNight.toLocaleString()} per night
                  </Typography>
                  <Typography color="text.secondary">
                    Rating: {hotel.rating}/5
                  </Typography>
                </CardContent>
                <Button
                  variant="contained"
                  sx={{ m: 2 }}
                  onClick={() => handleBookNow(hotel)}
                >
                  Book Now
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Book {selectedHotel?.name}</DialogTitle>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ mt: 2 }}>
              <DatePicker
                label="Check-in Date"
                value={bookingDetails.checkIn}
                onChange={(date) => setBookingDetails({ ...bookingDetails, checkIn: date })}
                renderInput={(params) => <TextField {...params} fullWidth />}
                minDate={new Date()}
              />
            </Box>
            <Box sx={{ mt: 2 }}>
              <DatePicker
                label="Check-out Date"
                value={bookingDetails.checkOut}
                onChange={(date) => setBookingDetails({ ...bookingDetails, checkOut: date })}
                renderInput={(params) => <TextField {...params} fullWidth />}
                minDate={bookingDetails.checkIn || new Date()}
              />
            </Box>
          </LocalizationProvider>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Room Type</InputLabel>
            <Select
              value={bookingDetails.roomType}
              onChange={(e) => setBookingDetails({ ...bookingDetails, roomType: e.target.value })}
              label="Room Type"
            >
              {roomTypes.map((room) => (
                <MenuItem key={room.value} value={room.value}>
                  {room.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {selectedHotel && (
            <Typography variant="h6" sx={{ mt: 2 }}>
              Total Price: ₹{calculateTotalPrice().toLocaleString()}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleConfirmBooking}
            variant="contained"
            disabled={!bookingDetails.checkIn || !bookingDetails.checkOut}
          >
            Confirm Booking
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HotelBooking;
