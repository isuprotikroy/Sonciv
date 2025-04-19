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
  Slider,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';

const eventTypes = [
  {
    id: 1,
    type: 'Wedding',
    description: 'Luxurious wedding planning and execution',
    image: 'https://source.unsplash.com/random/800x600/?wedding',
    basePrice: 200000,
    pricePerGuest: 2500,
  },
  {
    id: 2,
    type: 'Corporate Event',
    description: 'Professional corporate events and conferences',
    image: 'https://source.unsplash.com/random/800x600/?conference',
    basePrice: 150000,
    pricePerGuest: 2000,
  },
  {
    id: 3,
    type: 'Birthday Party',
    description: 'Memorable birthday celebrations',
    image: 'https://source.unsplash.com/random/800x600/?birthday,party',
    basePrice: 75000,
    pricePerGuest: 1500,
  },
  {
    id: 4,
    type: 'Private Party',
    description: 'Exclusive private events and celebrations',
    image: 'https://source.unsplash.com/random/800x600/?party,celebration',
    basePrice: 100000,
    pricePerGuest: 2000,
  },
];

const venues = [
  'Sonciv Grand Ballroom',
  'Royal Garden',
  'Beachfront Resort',
  'Mountain View Resort',
  'City Convention Center',
];

const EventServices = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [bookingDetails, setBookingDetails] = useState({
    eventDate: null,
    venue: '',
    guestCount: 50,
    additionalRequirements: '',
  });
  const [openDialog, setOpenDialog] = useState(false);

  const handleBookNow = (event) => {
    setSelectedEvent(event);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedEvent(null);
  };

  const calculateTotalPrice = () => {
    if (!selectedEvent) return 0;
    return selectedEvent.basePrice + (selectedEvent.pricePerGuest * bookingDetails.guestCount);
  };

  const handleConfirmBooking = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      const booking = {
        type: 'event',
        details: {
          eventType: selectedEvent.type,
          eventDate: bookingDetails.eventDate,
          venue: bookingDetails.venue,
          guestCount: bookingDetails.guestCount,
          additionalRequirements: bookingDetails.additionalRequirements,
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

  return (
    <Box sx={{ minHeight: '100vh', pb: 8, pt: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" component="h1" gutterBottom>
          Event Services
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Create unforgettable moments with our premium event services
        </Typography>

        <Grid container spacing={4}>
          {eventTypes.map((event) => (
            <Grid item xs={12} md={6} key={event.id}>
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
                  height="240"
                  image={event.image}
                  alt={event.type}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {event.type}
                  </Typography>
                  <Typography gutterBottom>
                    {event.description}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Starting from ₹{event.basePrice.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ₹{event.pricePerGuest} per guest
                  </Typography>
                </CardContent>
                <Button
                  variant="contained"
                  sx={{ m: 2 }}
                  onClick={() => handleBookNow(event)}
                >
                  Book Event
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Book {selectedEvent?.type}</DialogTitle>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ mt: 2 }}>
              <DatePicker
                label="Event Date"
                value={bookingDetails.eventDate}
                onChange={(date) => setBookingDetails({
                  ...bookingDetails,
                  eventDate: date
                })}
                renderInput={(params) => <TextField {...params} fullWidth />}
                minDate={new Date()}
              />
            </Box>
          </LocalizationProvider>

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Venue</InputLabel>
            <Select
              value={bookingDetails.venue}
              onChange={(e) => setBookingDetails({
                ...bookingDetails,
                venue: e.target.value
              })}
              label="Venue"
            >
              {venues.map((venue) => (
                <MenuItem key={venue} value={venue}>
                  {venue}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ mt: 3 }}>
            <Typography gutterBottom>Number of Guests</Typography>
            <Slider
              value={bookingDetails.guestCount}
              onChange={(e, newValue) => setBookingDetails({
                ...bookingDetails,
                guestCount: newValue
              })}
              min={20}
              max={500}
              step={10}
              marks={[
                { value: 20, label: '20' },
                { value: 250, label: '250' },
                { value: 500, label: '500' },
              ]}
              valueLabelDisplay="auto"
            />
          </Box>

          <TextField
            margin="normal"
            fullWidth
            multiline
            rows={4}
            label="Additional Requirements"
            value={bookingDetails.additionalRequirements}
            onChange={(e) => setBookingDetails({
              ...bookingDetails,
              additionalRequirements: e.target.value
            })}
          />

          {selectedEvent && (
            <Typography variant="h6" sx={{ mt: 2 }}>
              Estimated Price: ₹{calculateTotalPrice().toLocaleString()}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleConfirmBooking}
            variant="contained"
            disabled={!bookingDetails.eventDate || !bookingDetails.venue}
          >
            Confirm Booking
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EventServices;
