import React, { useState } from 'react';
import axios from 'axios';
import { Grid, Avatar } from '@mui/material';
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

  return (
    <div className="container">
      <div className="register-container">
        <div className="circle circle-one"></div>
        <div className="circle circle-two"></div>
        <form className="form-container" onSubmit={handleSubmit}>
          <Avatar className="avatar-icon">
            <AppRegistrationOutlinedIcon color="primary" />
          </Avatar>
          <h2>Registration</h2>
          <div>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <input
              type="text"
              name="number"
              placeholder="Number"
              value={formData.number}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <input
              type="password"
              name="passwordConfirm"
              placeholder="Confirm Password"
              value={formData.passwordConfirm}
              onChange={handleInputChange}
              required
            />
          </div>
          <Button type="submit" variant="contained" color="primary">Submit</Button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default RegistrationForm;
