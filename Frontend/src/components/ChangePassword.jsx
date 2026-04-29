import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import "./css/bootstrap.min.css";
import "./css/lineicons.min.css";
import "./css/style.css";
import imgfolder from "./img/core-img/logo-white.png";

const ChangePassword = () => {
  const [userData, setUserData] = useState({
    email: '',
    oldPassword: '',
    newPassword: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userData.email || !userData.oldPassword || !userData.newPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (!/(?=.*\d)(?=.*[A-Z])(?=.*[!@#$%^&*()_+])(?=.{8,})/.test(userData.newPassword)) {
      setError('New password must have at least one digit, one uppercase letter, one special character, and be 8+ characters long');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/users/change_password`, userData);
      if (response.status === 200) {
        alert('Password changed successfully!');
        window.location.href = "/";
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to change password. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper d-flex align-items-center justify-content-center text-center">
      <div className="background-shape"></div>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-9 col-md-7 col-lg-6 col-xl-5">
            <img className="big-logo" src={imgfolder} alt="Logo" />
            <div className="row justify-content-center mt-3"><b className="text-white">Reset Password</b></div>
            <div className="register-form mt-5 px-4">
              <form onSubmit={handleSubmit} autoComplete="off">
                
                <div className="form-group text-start mb-4">
                  <span>Email</span>
                  <label htmlFor="email"><i className="lni lni-envelope"></i></label>
                  <input 
                    className="form-control" 
                    name="email" 
                    id="email" 
                    value={userData.email} 
                    onChange={handleChange} 
                    type="email" autoComplete="nope" 
                    placeholder="Enter email id" 
                    autoComplete="one-time-code"
                  />
                </div>

                <div className="form-group text-start mb-4">
                  <span>Old Password</span>
                  <label htmlFor="oldPassword"><i className="lni lni-lock"></i></label>
                  <input 
                    className="form-control" 
                    name="oldPassword" 
                    id="oldPassword" 
                    value={userData.oldPassword} 
                    onChange={handleChange} 
                    type="password" autoComplete="new-password" 
                    placeholder="Enter old password" 
                    autoComplete="off"
                  />
                </div>

                <div className="form-group text-start mb-4">
                  <span>New Password</span>
                  <label htmlFor="newPassword"><i className="lni lni-lock"></i></label>
                  <input 
                    className="form-control" 
                    name="newPassword" 
                    id="newPassword" 
                    value={userData.newPassword} 
                    onChange={handleChange} 
                    type="password" autoComplete="new-password" 
                    placeholder="Enter new password" 
                    autoComplete="new-password"
                  />
                </div>

                {error && <p className="text-white mb-3" style={{ fontSize: '0.9rem' }}>{error}</p>}

                <button className="btn btn-warning btn-lg w-100" type="submit" disabled={loading}>
                  {loading ? 'Reseting...' : 'Reset Password'}
                </button>
              </form>
              
              <div className="login-meta-data mt-3">
                <p className="mb-0"> <Link to="/" className="ms-1 text-white">Back Home</Link></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
