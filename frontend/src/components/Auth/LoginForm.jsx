import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import Header from '../Header';
import Footer from '../Footer';

const LoginForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        'api/v1/student/login',
        {
          rollno: data.rollno,
          password: data.password
        },
        { withCredentials: true } 
      );
      // Store user details in cookies
      Cookies.set('user', JSON.stringify(response.data.data.student), { expires: 1 }); // Cookie expires in 1 day

      // Redirect to user profile
      navigate('/student-profile');
    } catch (error) {
      console.error('Login failed:', error);
      setErrorMessage('Invalid Roll No. or Password. Please try again.');
    }
  };

  return (
    <div id='login-form'>
      <Header />
      <div className="container">
        <h1>Student's Login</h1>
        {errorMessage && <p className="error">{errorMessage}</p>}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="inputs">
            <label htmlFor="rollno">Roll No.:</label>
            <input
              id="rollno"
              type="text"
              {...register('rollno', { required: 'Roll No. is required' })}
              aria-invalid={errors.rollno ? "true" : "false"}
            />
            {errors.rollno && <span className="error">{errors.rollno.message}</span>}
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

export default LoginForm;
