import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import Header from '../Header';
import Footer from '../Footer';

const Admin = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        'api/v1/admin/login',
        {
          adminkey: data.adminkey,
          password: data.password
        },
        { withCredentials: true } 
      );
      // Store admin details in cookies
      Cookies.set('admin', JSON.stringify(response.data.data.admin), { expires: 1 }); // Cookie expires in 1 day

      // Redirect to admin profile
      navigate('/admin-profile');
    } catch (error) {
      console.error('Login failed:', error);
      setErrorMessage('Invalid Admin key or Password. Please try again.');
    }
  };

  return (
    <div id='login-form'>
      <Header />
      <div className="container">
        <h1>Admin's Login</h1>
        {errorMessage && <p className="error">{errorMessage}</p>}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="inputs">
            <label htmlFor="adminkey">Admin Key:</label>
            <input
              id="adminkey"
              type="text"
              {...register('adminkey', { required: 'Admin key is required' })}
              aria-invalid={errors.adminkey ? "true" : "false"}
            />
            {errors.adminkey && <span className="error">{errors.adminkey.message}</span>}
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

export default Admin;
