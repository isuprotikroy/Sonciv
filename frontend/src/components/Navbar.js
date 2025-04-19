import React from 'react';
import { Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
} from '@mui/material';

const Navbar = () => {
  return (
    <AppBar position="fixed" color="primary" sx={{ top: 'auto', bottom: 0 }}>
      <Container maxWidth="xl">
        <Toolbar>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}
          >
            Sonciv Pvt. Ltd.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              color="inherit"
              component={Link}
              to="/hotel-booking"
            >
              Hotels
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/ride-booking"
            >
              Rides
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/event-services"
            >
              Events
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/luxury-rental"
            >
              Luxury
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
