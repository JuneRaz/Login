import React, { useState } from 'react';
import axios from 'axios';
import { Grid, Paper, Avatar } from '@mui/material';
import Button from '@mui/material/Button';
import AppRegistrationOutlinedIcon from '@mui/icons-material/AppRegistrationOutlined';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RegistrationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    number: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (formData.password !== formData.passwordConfirm) {
      toast.error('Passwords do not match');
      return;
    }

    axios.post(`http://localhost:7000/sendotp`, formData)
      .then(response => {
        toast.success('OTP sent successfully! Redirecting...');
        setTimeout(() => {
          navigate('./signupotp', { state: { formData } });
        }, 2000);
      })
      .catch(error => {
        console.error(error);
        toast.error('An error occurred. Please try again.');
      });
  };

  const paperStyle = {
    padding: 20,
    height: 'auto',
    width: 400,
    margin: '20px auto',
  };

  return (
    <div className='Form'>
      <Grid>
        <Paper elevation={10} style={paperStyle} className="form-container">
          <form className='RegistrationForm'>
            <Avatar><AppRegistrationOutlinedIcon color="primary" /></Avatar>
            <h2>Registration</h2>
            <div>
              <label>Email:</label>
              <input
                type="email"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label>Number:</label>
              <input
                type="text"
                name="number"
                value={formData.number}
                onChange={handleInputChange}
                required
              />
            </div>
          
            <div>
              <label>Password:</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label>Confirm Password:</label>
              <input
                type="password"
                name="passwordConfirm"
                value={formData.passwordConfirm}
                onChange={handleInputChange}
                required
              />
            </div>
            <Button onClick={handleSubmit} variant="contained" color="primary">Submit</Button>
          </form>
        </Paper>
      </Grid>
      <ToastContainer />
    </div>
  );
};

export default RegistrationForm;
