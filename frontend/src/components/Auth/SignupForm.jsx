import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Cookies from 'js-cookie'; // Add cookie management
import Header from '../Header';
import Footer from '../Footer';

const SignupForm = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      // Post request to your backend to register the student
      const response = await axios.post('/api/v1/student/register', data, { withCredentials: true });
      console.log('Form submitted successfully:', response.data);
      
      setSuccessMessage("Signup successful! Redirecting...");
      setServerError(null);

      // Store user data and tokens in cookies
      Cookies.set('user', JSON.stringify(response.data.data.student));
      Cookies.set('accessToken', response.data.data.accessToken);
      Cookies.set('refreshToken', response.data.data.refreshToken);

      // Redirect to user profile page after a short delay
      setTimeout(() => navigate('/student-profile'), 2000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setServerError(error.response?.data?.message || "Signup failed. Please try again.");
    }
  };

  return (
    <div id='signup-form-div'>
      <Header />
      <div className="container">
        <h1>Mess Registration Form</h1>
        
        {serverError && <div className="error-message">{serverError}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}

        <form id='signup-form' onSubmit={handleSubmit(onSubmit)}>
          <div className="inputs">
            <label>Name:</label>
            <input type="text" {...register('name', { required: "Name is required" })} />
            {errors.name && <div className='form-error'>{errors.name.message}</div>}
          </div>
          
          <div className="inputs">
            <label>Email:</label>
            <input type="email" {...register('email', { required: "Email is required" })} />
            {errors.email && <div className='form-error'>{errors.email.message}</div>}
          </div>
          
          <div className="inputs">
            <label>Roll No.:</label>
            <input type="text" {...register('rollno', { required: "Roll No. is required" })} />
            {errors.rollno && <div className='form-error'>{errors.rollno.message}</div>}
          </div>
          
          <div className="inputs">
            <label>Password:</label>
            <input type="password" {...register('password', { required: "Password is required" })} />
            {errors.password && <div className='form-error'>{errors.password.message}</div>}
          </div>
          
          <div className="inputs">
            <label>Card No.:</label>
            <input type="number" {...register('cardno', { required: "Card No. is required" })} />
            {errors.cardno && <div className='form-error'>{errors.cardno.message}</div>}
          </div>
          
          <div className="inputs">
            <label>Discipline:</label>
            <select {...register('discipline', { required: "Discipline is required" })}>
              <option value="CSE">CSE</option>
              <option value="ECE">ECE</option>
              <option value="ME">ME</option>
              <option value="SM">SM</option>
              <option value="DS">DS</option>
            </select>
            {errors.discipline && <div className='form-error'>{errors.discipline.message}</div>}
          </div>
          
          <div className="inputs">
            <label>Mess Registered:</label>
            <select {...register('regmess', { required: "Mess selection is required" })}>
              <option value="mess1">Central Mess 1</option>
              <option value="mess2">Central Mess 2</option>
            </select>
            {errors.regmess && <div className='form-error'>{errors.regmess.message}</div>}
          </div>  

          <button disabled={isSubmitting} type='submit'>
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </form>

        {isSubmitting && <div className='loading'>Loading...</div>}
      </div>
      <Footer />
    </div>
  );
};

export default SignupForm;
