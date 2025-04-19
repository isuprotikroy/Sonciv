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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import FlightIcon from '@mui/icons-material/Flight';
import DirectionsBoatIcon from '@mui/icons-material/DirectionsBoat';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import HelicopterIcon from '@mui/icons-material/Helicopter';
import axios from 'axios';

const luxuryVehicles = {
  jet: [
    {
      id: 1,
      name: 'Private Jet - Light',
      description: 'Luxury private jet for up to 8 passengers',
      image: 'https://source.unsplash.com/random/800x600/?private,jet',
      pricePerHour: 150000,
      capacity: 8,
    },
    {
      id: 2,
      name: 'Private Jet - Medium',
      description: 'Premium jet with extended range for up to 12 passengers',
      image: 'https://source.unsplash.com/random/800x600/?business,jet',
      pricePerHour: 200000,
      capacity: 12,
    },
  ],
  helicopter: [
    {
      id: 3,
      name: 'Executive Helicopter',
      description: 'Luxury helicopter for city transfers',
      image: 'https://source.unsplash.com/random/800x600/?helicopter',
      pricePerHour: 80000,
      capacity: 6,
    },
  ],
  car: [
    {
      id: 4,
      name: 'Rolls-Royce Phantom',
      description: 'Ultimate luxury car experience',
      image: 'https://source.unsplash.com/random/800x600/?rolls,royce',
      pricePerHour: 25000,
      capacity: 4,
    },
    {
      id: 5,
      name: 'Lamborghini Aventador',
      description: 'Exotic supercar for special occasions',
      image: 'https://source.unsplash.com/random/800x600/?lamborghini',
      pricePerHour: 30000,
      capacity: 2,
    },
  ],
  yacht: [
    {
      id: 6,
      name: 'Luxury Yacht',
      description: 'Premium yacht for sea adventures',
      image: 'https://source.unsplash.com/random/800x600/?yacht',
      pricePerHour: 100000,
      capacity: 15,
    },
  ],
};

const LuxuryRental = () => {
  const [selectedCategory, setSelectedCategory] = useState('jet');
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [bookingDetails, setBookingDetails] = useState({
    startDateTime: null,
    duration: 4,
    passengers: 1,
    pickupLocation: '',
    dropLocation: '',
  });
  const [openDialog, setOpenDialog] = useState(false);

  const handleCategoryChange = (event, newValue) => {
    setSelectedCategory(newValue);
  };

  const handleBookNow = (vehicle) => {
    setSelectedVehicle(vehicle);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedVehicle(null);
  };

  const calculateTotalPrice = () => {
    if (!selectedVehicle) return 0;
    return selectedVehicle.pricePerHour * bookingDetails.duration;
  };

  const handleConfirmBooking = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      const booking = {
        type: 'luxury',
        details: {
          luxuryType: selectedCategory,
          vehicleName: selectedVehicle.name,
          startDateTime: bookingDetails.startDateTime,
          rentalDuration: bookingDetails.duration,
          passengers: bookingDetails.passengers,
          pickupLocation: bookingDetails.pickupLocation,
          dropLocation: bookingDetails.dropLocation,
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

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'jet':
        return <FlightIcon />;
      case 'helicopter':
        return <HelicopterIcon />;
      case 'car':
        return <DirectionsCarIcon />;
      case 'yacht':
        return <DirectionsBoatIcon />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', pb: 8, pt: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" component="h1" gutterBottom>
          Luxury Rentals
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Experience ultimate luxury with our premium vehicle collection
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
          <Tabs
            value={selectedCategory}
            onChange={handleCategoryChange}
            variant="fullWidth"
          >
            <Tab icon={<FlightIcon />} label="Private Jets" value="jet" />
            <Tab icon={<HelicopterIcon />} label="Helicopters" value="helicopter" />
            <Tab icon={<DirectionsCarIcon />} label="Luxury Cars" value="car" />
            <Tab icon={<DirectionsBoatIcon />} label="Yachts" value="yacht" />
          </Tabs>
        </Box>

        <Grid container spacing={4}>
          {luxuryVehicles[selectedCategory].map((vehicle) => (
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
                  height="300"
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
                    Capacity: {vehicle.capacity} passengers
                  </Typography>
                  <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                    ₹{vehicle.pricePerHour.toLocaleString()} per hour
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
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {getCategoryIcon(selectedCategory)}
            Book {selectedVehicle?.name}
          </Box>
        </DialogTitle>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ mt: 2 }}>
              <DateTimePicker
                label="Start Date & Time"
                value={bookingDetails.startDateTime}
                onChange={(date) => setBookingDetails({
                  ...bookingDetails,
                  startDateTime: date
                })}
                renderInput={(params) => <TextField {...params} fullWidth />}
                minDateTime={new Date()}
              />
            </Box>
          </LocalizationProvider>

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Duration (hours)</InputLabel>
            <Select
              value={bookingDetails.duration}
              onChange={(e) => setBookingDetails({
                ...bookingDetails,
                duration: e.target.value
              })}
              label="Duration (hours)"
            >
              {[4, 8, 12, 24].map((hours) => (
                <MenuItem key={hours} value={hours}>
                  {hours} hours
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Number of Passengers</InputLabel>
            <Select
              value={bookingDetails.passengers}
              onChange={(e) => setBookingDetails({
                ...bookingDetails,
                passengers: e.target.value
              })}
              label="Number of Passengers"
            >
              {[...Array(selectedVehicle?.capacity || 0)].map((_, i) => (
                <MenuItem key={i + 1} value={i + 1}>
                  {i + 1} {i === 0 ? 'passenger' : 'passengers'}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

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

          {selectedVehicle && (
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
            disabled={
              !bookingDetails.startDateTime ||
              !bookingDetails.pickupLocation ||
              !bookingDetails.dropLocation
            }
          >
            Confirm Booking
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LuxuryRental;
