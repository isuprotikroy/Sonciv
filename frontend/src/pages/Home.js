import React from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
} from '@mui/material';
import HotelIcon from '@mui/icons-material/Hotel';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import EventIcon from '@mui/icons-material/Event';
import FlightIcon from '@mui/icons-material/Flight';

const services = [
  {
    title: 'Sonciv Hospitality',
    description: 'Luxury hotel bookings for your perfect stay',
    icon: <HotelIcon sx={{ fontSize: 40 }} />,
    link: '/hotel-booking',
    image: 'https://source.unsplash.com/random/800x600/?luxury,hotel'
  },
  {
    title: 'Rides',
    description: 'Book cabs and bikes for convenient travel',
    icon: <DirectionsCarIcon sx={{ fontSize: 40 }} />,
    link: '/ride-booking',
    image: 'https://source.unsplash.com/random/800x600/?taxi,bike'
  },
  {
    title: 'Event Services',
    description: 'Plan and organize your special events',
    icon: <EventIcon sx={{ fontSize: 40 }} />,
    link: '/event-services',
    image: 'https://source.unsplash.com/random/800x600/?event,party'
  },
  {
    title: 'Luxury Rental',
    description: 'Premium vehicles and aircraft for luxury travel',
    icon: <FlightIcon sx={{ fontSize: 40 }} />,
    link: '/luxury-rental',
    image: 'https://source.unsplash.com/random/800x600/?private,jet'
  }
];

const Home = () => {
  return (
    <Box sx={{ minHeight: '100vh', pb: 8 }}>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          mb: 6
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h2" component="h1" gutterBottom>
            Welcome to Sonciv
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom>
            Your Premier Luxury Service Provider
          </Typography>
        </Container>
      </Box>

      {/* Services Section */}
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {services.map((service, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
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
                  height="140"
                  image={service.image}
                  alt={service.title}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                    {service.icon}
                  </Box>
                  <Typography gutterBottom variant="h5" component="h2" align="center">
                    {service.title}
                  </Typography>
                  <Typography align="center">
                    {service.description}
                  </Typography>
                </CardContent>
                <Button
                  component={Link}
                  to={service.link}
                  variant="contained"
                  sx={{ m: 2 }}
                >
                  Explore
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;
