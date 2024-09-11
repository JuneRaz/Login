import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';

import { useTheme } from '@mui/material/styles';

// TODO: Import the .env file
function Home() {
    const theme =useTheme();
    return (
          <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static" style={{color: theme.palette.primary.main, backgroundColor:theme.palette.background.default}}>
            <Toolbar>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                <Link to='/'>
                  Flood Monitoring System
                </Link>
              </Typography>
              <Link to='/Home'>
                <Button color='inherit' style={{color:'black'}}>Home</Button>
              </Link>
              <Link to='/map'>
                <Button color='inherit' style={{color:'black'}}>Map</Button>
              </Link>
              <Link to='/login'>
                <Button color='inherit' style={{color:'black'}}>Login</Button>
              </Link>
              <Link to='/signup'>
                <Button color='inherit' style={{color:'black'}}>Signup</Button>
              </Link>
              <Link to='/test'>
                <Button color='inherit' style={{color:'black'}}>Test</Button>
              </Link>
            </Toolbar>
          </AppBar>
        </Box>
    );
  }

  export default Home;