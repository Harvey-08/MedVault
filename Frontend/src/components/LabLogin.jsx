import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./css/bootstrap.min.css";
import "./css/owl.carousel.min.css";
import "./css/font-awesome.min.css";
import "./css/animate.css";
import "./css/lineicons.min.css";
import "./css/magnific-popup.css";
import "./css/style.css";
import imgfolder from "./img/login.png";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const role = localStorage.getItem('expectedRole') || '';
      
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password) {
      setError('Please fill in all fields.');
      setLoading(false);
      return;
    }
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/users/login`, {
        email: email,
        password: password,
        role: 'Lab', // Explicitly require Lab role
      });

      if (response.status === 200) {
        const { token, role: actualRole, hospitalemail: hospitalEmailFromResponse } = response.data;

        if (actualRole !== 'Lab') {
          setError(`Access denied. This login is for Lab only. Please use the Lab login option.`);
          alert(`Access denied. This login is for Lab only. Please use the Lab login option.`);
          setLoading(false);
          return;
        }

        // Store standard storage items
        localStorage.setItem('token', token);
        localStorage.setItem('role', 'Lab');
        localStorage.setItem('email', email);
        localStorage.setItem('hospitalemail', hospitalEmailFromResponse);

        axios.defaults.headers.common['x-auth-token'] = token;

        alert('Login Successful!');
        window.location.href = "/lab_home";
        console.log('Login successful!');
        
        setError('');
      } else {
        setError('Login failed. Please check your credentials.');
        alert('Login Unsuccessful!');
      }
    } catch (error) {
      console.error('Error during login:', error.message);
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
        alert(error.response.data.error);
      } else {
        setError('Internal Server Error. Please try again later.');
        alert('Login Unsuccessful!');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <title>Hospital Booking App</title>

      <div className="login-wrapper d-flex align-items-center justify-content-center text-center">
        <div className="background-shape"></div>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-sm-9 col-md-7 col-lg-6 col-xl-5">
              <img className="big-logo" src={imgfolder} alt="Logo" />
              <div className="register-form mt-5 px-4">
                <form onSubmit={handleLogin} autoComplete="off">
                  <div className="form-group text-start mb-4">
                    <span>Email</span>
                    <label htmlFor="email"><i className="lni lni-user"></i></label>
                    <input
                       className="form-control"
                       name="email"
                       id="email"
                       value={email}
                       onChange={(e) => setEmail(e.target.value)}
                       type="email"
                       placeholder="info@example.com"
                       aria-required="true"
                       autoComplete="nope"
                    />
                  </div>

                  <div className="form-group text-start mb-4">
                    <span>Password</span>
                    <label htmlFor="password"><i className="lni lni-lock"></i></label>
                    <input
                       className="form-control"
                       name="password"
                       id="password"
                       value={password}
                       onChange={(e) => setPassword(e.target.value)}
                       type="password"
                       placeholder="password"
                       aria-required="true"
                       autoComplete="new-password"
                    />
                  </div>

                  <button className="btn btn-warning btn-lg w-100" type="submit" disabled={loading}>
                    {loading ? 'Logging in...' : 'Log In'}
                  </button>

                  {error && <p style={{ color: 'white' }}>{error}</p>}
                </form>
              </div>

              <div className="login-meta-data">
                <Link className="forgot-password d-block mt-3 mb-1" to="/change_password">Reset Password</Link>
                <p className="mb-0"> <Link to="/" className="ms-1">Back Home</Link></p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
