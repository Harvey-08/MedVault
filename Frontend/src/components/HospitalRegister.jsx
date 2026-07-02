import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import "./css/bootstrap.min.css";
import "./css/owl.carousel.min.css";
import "./css/font-awesome.min.css";
import "./css/animate.css";
import "./css/lineicons.min.css";
import "./css/magnific-popup.css";
import "./css/style.css";
import imgfolder from "./img/core-img/logo-white.png";
const HospitalRegister = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    city: '',
    role: 'Hospital',  // Default role
    question1: '',
    question2: '',
    agreedToPrivacyPolicy: false,
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [existingEmails, setExistingEmails] = useState([]);

  useEffect(() => {
    const fetchExistingEmails = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/users/`);
        const emails = response.data.map(user => user.email.toLowerCase());
        setExistingEmails(emails);
      } catch (error) {
        console.error('Error fetching existing emails:', error);
      }
    };

    fetchExistingEmails();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));

    setValidationErrors(prevErrors => ({
      ...prevErrors,
      [name]: '',
    }));
  };

  const validateForm = () => {
    let isValid = true;
    const errors = {};

    if (!/^\d{10}$/.test(userData.phone)) {
      errors.phone = 'Phone must be a 10-digit number';
      isValid = false;
    }

    if (!/(?=.*\d)(?=.*[A-Z])(?=.*[!@#$%^&*()_+])(?=.{8,})/.test(userData.password)) {
      errors.password = 'Password must have at least one digit, one uppercase letter, one special character, and be at least 8 characters long';
      isValid = false;
    }

    if (existingEmails.includes(userData.email.toLowerCase())) {
      errors.email = 'Email already exists';
      isValid = false;
    }

    if (!userData.agreedToPrivacyPolicy) {
      errors.agreedToPrivacyPolicy = 'You must accept the Privacy Policy to register';
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/users/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
       
      body: JSON.stringify({
        ...userData,
        role: 'Hospital',
      }),
    });
      if (response.ok) {
        alert('Registered Successfully.');
        window.location.href = "/";
      } else {
        console.error('Error submitting form data:', response.statusText);
      }
    } catch (error) {
      console.error('Error submitting form data:', error.message);
    }
  };

  return (
    <div className="login-wrapper d-flex align-items-center justify-content-center text-center">
      <div className="background-shape"></div>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-9 col-md-7 col-lg-6 col-xl-5">
            <img className="big-logo" src={imgfolder} alt="Logo" />
            <div className="register-form mt-5 px-4">
                <form onSubmit={handleSubmit} autoComplete="off">
               

                <div className="form-group text-start mb-4">
                  <span>Username</span>
                  <label htmlFor="name"><i className="lni lni-user"></i></label>
                  <input className="form-control" name="name" id="name" value={userData.name} onChange={handleChange} type="text" placeholder="Enter the name" autoComplete="one-time-code" />
                </div>

                {validationErrors.email && <p style={{ color: 'white' }}>{validationErrors.email}</p>}

                <div className="form-group text-start mb-4">
                  <span>Email</span>
                  <label htmlFor="email"><i className="lni lni-envelope"></i></label>
                  <input className="form-control" name="email" id="email" value={userData.email} onChange={handleChange} type="email" autoComplete="nope" placeholder="Enter email id" />
                </div>

                {validationErrors.password && <p style={{ color: 'white' }}>{validationErrors.password}</p>}
                <div className="form-group text-start mb-4">
                  <span>Password</span>
                  <label htmlFor="password"><i className="lni lni-lock"></i></label>
                  <input className="input-psswd form-control" name="password" id="password" value={userData.password} onChange={handleChange} type="password" autoComplete="new-password" placeholder="Password"  />
                </div>

                {validationErrors.phone && <p style={{ color: 'white' }}>{validationErrors.phone}</p>}
                <div className="form-group text-start mb-4">
                  <span>Mobile</span>
                  <label htmlFor="phone"><i className="lni lni-arrow-right"></i></label>
                  <input className="form-control" name="phone" id="phone" value={userData.phone} onChange={handleChange} type="number" placeholder="Mobile" autoComplete="one-time-code" />
                </div>

                <div className="form-group text-start mb-4">
                  <span>City</span>
                  <label htmlFor="city"><i className="lni lni-arrow-right"></i></label>
                  <input className="form-control" name="city" id="city" value={userData.city} onChange={handleChange} type="text" placeholder="City" autoComplete="one-time-code" />
                </div>

                <div className="form-group text-start mb-4">
                  <span>What is your pet animal name?</span>
                  <label htmlFor="question1"><i className="lni lni-arrow-right"></i></label>
                  <input className="form-control" name="question1" id="question1" value={userData.question1} onChange={handleChange} type="text" placeholder="Enter the answer" />
                </div>

                <div className="form-group text-start mb-4">
                  <span>What is your school best friend name?</span>
                  <label htmlFor="question2"><i className="lni lni-arrow-right"></i></label>
                  <input className="form-control" name="question2" id="question2" value={userData.question2} onChange={handleChange} type="text" placeholder="Enter the answer" />
                </div>

                {validationErrors.agreedToPrivacyPolicy && <p style={{ color: 'white' }}>{validationErrors.agreedToPrivacyPolicy}</p>}
                <div className="form-check text-start mb-4 ms-1" style={{ color: 'white' }}>
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    name="agreedToPrivacyPolicy" 
                    id="agreedToPrivacyPolicy" 
                    checked={userData.agreedToPrivacyPolicy} 
                    onChange={handleChange} 
                  />
                  <label className="form-check-label" htmlFor="agreedToPrivacyPolicy" style={{ fontSize: '13px', cursor: 'pointer' }}>
                    I agree to the GDPR & HIPAA privacy policy and consent to the secure storage and GCM encryption of my records.
                  </label>
                </div>

                <button className="btn btn-warning btn-lg w-100" type="submit">Sign Up</button>
              </form>
            </div>

            <div className="login-meta-data">
              <p className="mt-3 mb-0">Already have an account?
                <Link 
                  to="/login" 
                  className="ms-1" 
                  onClick={() => localStorage.setItem('expectedRole', 'Hospital')}
                >
                  Sign In
                </Link>
              </p>
              <p className="mb-0"> <Link to="/" className="ms-1">Back Home</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HospitalRegister;
