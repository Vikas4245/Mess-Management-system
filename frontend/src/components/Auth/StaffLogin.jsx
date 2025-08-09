import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import Header from '../Header';
import Footer from '../Footer';

const StaffLogin = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        'api/v1/staff/login',
        {
          staffid: data.staffid,
          password: data.password
        },
        { withCredentials: true } 
      );
      // Store staff details in cookies
      Cookies.set('staff', JSON.stringify(response.data.data.staff), { expires: 1 }); // Cookie expires in 1 day

      // Redirect to staff profile
      navigate('/staff-profile');
    } catch (error) {
      console.error('Login failed:', error);
      setErrorMessage('Invalid Staff ID or Password. Please try again.');
    }
  };

  return (
    <div id='login-form'>
      <Header />
      <div className="container">
        <h1>Staff's Login</h1>
        {errorMessage && <p className="error">{errorMessage}</p>}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="inputs">
            <label htmlFor="staffid">Staff ID:</label>
            <input
              id="staffid"
              type="text"
              {...register('staffid', { required: 'Staff ID is required' })}
              aria-invalid={errors.staffid ? "true" : "false"}
            />
            {errors.staffid && <span className="error">{errors.staffid.message}</span>}
          </div>
          
          <div className="inputs">
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              type="password"
              {...register('password', { required: 'Password is required' })}
              aria-invalid={errors.password ? "true" : "false"}
            />
            {errors.password && <span className="error">{errors.password.message}</span>}
          </div>

          <button type='submit'>Submit</button> 
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default StaffLogin;
