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
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';
import axios from 'axios';

const vehicles = {
  cab: [
    {
      id: 1,
      name: 'Luxury Sedan',
      description: 'Premium sedan with professional chauffeur',
      image: 'https://source.unsplash.com/random/800x600/?luxury,car',
      pricePerKm: 25,
      basePrice: 500,
    },
    {
      id: 2,
      name: 'Premium SUV',
      description: 'Spacious SUV for comfortable travel',
      image: 'https://source.unsplash.com/random/800x600/?suv,car',
      pricePerKm: 35,
      basePrice: 700,
    },
  ],
  bike: [
    {
      id: 3,
      name: 'Sport Bike',
      description: 'High-performance motorcycle',
      image: 'https://source.unsplash.com/random/800x600/?sport,motorcycle',
      pricePerKm: 15,
      basePrice: 300,
    },
    {
      id: 4,
      name: 'Cruiser Bike',
      description: 'Comfortable cruiser for long rides',
      image: 'https://source.unsplash.com/random/800x600/?cruiser,motorcycle',
      pricePerKm: 20,
      basePrice: 400,
    },
  ],
};

const RideBooking = () => {
  const [rideType, setRideType] = useState('cab');
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [bookingDetails, setBookingDetails] = useState({
    pickupLocation: '',
    dropLocation: '',
    rideDate: null,
  });
  const [openDialog, setOpenDialog] = useState(false);

  const handleRideTypeChange = (event, newType) => {
    if (newType !== null) {
      setRideType(newType);
    }
  };

  const handleBookNow = (vehicle) => {
    setSelectedVehicle(vehicle);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedVehicle(null);
  };

  // Simplified price calculation (in real app, would use maps API for distance)
  const calculateEstimatedPrice = () => {
    if (!selectedVehicle) return 0;
    const estimatedKm = 10; // Example distance
    return selectedVehicle.basePrice + (selectedVehicle.pricePerKm * estimatedKm);
  };

  const handleConfirmBooking = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      const booking = {
        type: 'ride',
        details: {
          rideType: rideType,
          vehicleName: selectedVehicle.name,
          pickupLocation: bookingDetails.pickupLocation,
          dropLocation: bookingDetails.dropLocation,
          rideDate: bookingDetails.rideDate,
        },
        totalAmount: calculateEstimatedPrice(),
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
            amount: calculateEstimatedPrice(),
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
          Book Your Ride
        </Typography>

        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
          <ToggleButtonGroup
            value={rideType}
            exclusive
            onChange={handleRideTypeChange}
            color="primary"
          >
            <ToggleButton value="cab">
              <DirectionsCarIcon sx={{ mr: 1 }} />
              Cab
            </ToggleButton>
            <ToggleButton value="bike">
              <TwoWheelerIcon sx={{ mr: 1 }} />
              Bike
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Grid container spacing={4}>
          {vehicles[rideType].map((vehicle) => (
            <Grid item xs={12} md={6} key={vehicle.id}>
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
                  image={vehicle.image}
                  alt={vehicle.name}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {vehicle.name}
                  </Typography>
                  <Typography gutterBottom>
                    {vehicle.description}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Base Price: ₹{vehicle.basePrice}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ₹{vehicle.pricePerKm}/km
                  </Typography>
                </CardContent>
                <Button
                  variant="contained"
                  sx={{ m: 2 }}
                  onClick={() => handleBookNow(vehicle)}
                >
                  Book Now
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Book {selectedVehicle?.name}</DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Pickup Location"
            value={bookingDetails.pickupLocation}
            onChange={(e) => setBookingDetails({
              ...bookingDetails,
              pickupLocation: e.target.value
            })}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Drop Location"
            value={bookingDetails.dropLocation}
            onChange={(e) => setBookingDetails({
              ...bookingDetails,
              dropLocation: e.target.value
            })}
          />
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ mt: 2 }}>
              <DateTimePicker
                label="Pickup Date & Time"
                value={bookingDetails.rideDate}
                onChange={(date) => setBookingDetails({
                  ...bookingDetails,
                  rideDate: date
                })}
                renderInput={(params) => <TextField {...params} fullWidth />}
                minDateTime={new Date()}
              />
            </Box>
          </LocalizationProvider>
          {selectedVehicle && (
            <Typography variant="h6" sx={{ mt: 2 }}>
              Estimated Price: ₹{calculateEstimatedPrice().toLocaleString()}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleConfirmBooking}
            variant="contained"
            disabled={!bookingDetails.pickupLocation || !bookingDetails.dropLocation || !bookingDetails.rideDate}
          >
            Confirm Booking
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RideBooking;
