import React, { useState,useEffect }  from 'react';
import { Link } from 'react-router-dom';
import "./css/bootstrap.min.css";
import "./css/owl.carousel.min.css";
import "./css/font-awesome.min.css";
import "./css/animate.css";
import "./css/font-awesome.min.css";
import "./css/lineicons.min.css";
import "./css/magnific-popup.css";
import "./css/style.css";
import "./js/jquery.min.js";  
import "./js/bootstrap.bundle.min.js";
{/*
import "./js/waypoints.min.js";
import "./js/jquery.easing.min.js";
import "./js/owl.carousel.min.js";
import "./js/jquery.magnific-popup.min.js";
*/}
import imgSmall from "./img/core-img/logo-small.png";
import imgBg from "./img/bg-img/9.png";
import Logout from './Logout.jsx';
import Title from './Title.jsx';

// name  vendorname mechanicname service available  locality address city mobile 

const PostLabReg = () => {
  
  const [userData, setUserData] = useState({
   
    name: '',
    email: '',
    passwordHash: '',
    phone: '',
    city: '',
    role: 'Lab',  // Default role
    
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [existingEmails, setExistingEmails] = useState([]);
  
  const hospitalEmail = decodeURIComponent(document.cookie.replace(/(?:(?:^|.*;\s*)hospitalemail\s*=\s*([^;]*).*$)|^.*$/, '$1'));
 
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prevData => ({
      ...prevData,
      [name]: value,
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

    setValidationErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/users/lab/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...userData, hospitalemail: hospitalEmail,role:'Lab' }),
    
    
    });
      if (response.ok) {
        alert('Registered Successfully.');
        window.location.href = "/view_lab_user";
      } else {
        console.error('Error submitting form data:', response.statusText);
      }
    } catch (error) {
      console.error('Error submitting form data:', error.message);
    }
  };
return(
    <div>
      <div className="header-area" id="headerArea">
        <div className="container h-100 d-flex align-items-center justify-content-between">
          <div className="header-area" id="headerArea">
            <div className="container h-100 d-flex align-items-center justify-content-between">
              <div className="logo-wrapper" style={{ color: '#020310' }}>
                <img src={imgSmall} alt="" />
                <Title />
              </div>

              <div className="suha-navbar-toggler" data-bs-toggle="offcanvas" data-bs-target="#suhaOffcanvas" aria-controls="suhaOffcanvas">
                <span></span><span></span><span></span>
              </div>
            </div>
          </div>

          <div className="offcanvas offcanvas-start suha-offcanvas-wrap" id="suhaOffcanvas" aria-labelledby="suhaOffcanvasLabel">
            <button className="btn-close btn-close-white text-reset" type="button" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            <div className="offcanvas-body">
              <div className="sidenav-profile">
                <div className="user-profile">
                  <img src={imgBg} alt="" />
                </div>
                <div className="user-info">
                  <h6 className="user-name mb-1">Hospital Booking App
                  </h6>
                </div>
              </div>
              <ul className="sidenav-nav ps-0">
                <li>
                  <Link to="/hospital_home"><i className="lni lni-home"></i>Home</Link>
                </li>
                <li><Logout /></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="page-content-wrapper">
        <div className="top-products-area py-3">
          <div className="container">
            <div className="section-heading d-flex align-items-center justify-content-between">
              <h6> Lab Register</h6>
            </div>
            <div className="profile-wrapper-area py-3">
              <div className="card user-data-card">
                <div className="card-body">
                  <form onSubmit={handleSubmit} autoComplete="off">
        
                    <div className="mb-3">
                      <div className="title mb-2"><span>Name</span></div>
                      <input className="form-control" name="name" id="name" value={userData.name} onChange={handleInputChange} type="text" />
                      {validationErrors.name && <p style={{ color: 'red' }}>{validationErrors.name}</p>}
                    </div>
                   
                    <div className="mb-3">
                      <div className="title mb-2"><span>Email</span></div>
                      <input className="form-control" name="email" id="email" value={userData.email} onChange={handleInputChange} type="email" autoComplete="nope" />
                      {validationErrors.email && <p style={{ color: 'red' }}>{validationErrors.email}</p>}
                    </div>
                 
                    <div className="mb-3">
                      <div className="title mb-2"><span>Password</span></div>
                      <input className="form-control" name="password" id="password" value={userData.password} onChange={handleInputChange} type="password" autoComplete="new-password" />
                      {validationErrors.password && <p style={{ color: 'red' }}>{validationErrors.password}</p>}
                    </div>
                  
                    <div className="mb-3">
                      <div className="title mb-2"><span>Address</span></div>
                      <input className="form-control" name="address" id="address" value={userData.address} onChange={handleInputChange} type="text" />
                      {validationErrors.address && <p style={{ color: 'red' }}>{validationErrors.address}</p>}
                    </div>
                    <div className="mb-3">
                      <div className="title mb-2"><span>City</span></div>
                      <input className="form-control" name="city" id="city" value={userData.city} onChange={handleInputChange} type="text" />
                      {validationErrors.city && <p style={{ color: 'red' }}>{validationErrors.city}</p>}
                    </div>
                    <div className="mb-3">
                      <div className="title mb-2"><span>Mobile</span></div>
                      <input className="form-control" name="phone" id="phone" value={userData.phone} onChange={handleInputChange} type="text" />
                      {validationErrors.phone && <p style={{ color: 'red' }}>{validationErrors.phone}</p>}
                    </div>

                    <button className="btn btn-success w-100" type="submit">Submit</button>
                  </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-nav-area" id="footerNav">
          <div className="container h-100 px-0">
            <div className="suha-footer-nav h-100">
              <ul className="h-100 d-flex align-items-center justify-content-between ps-0">
                <li className="active"><Link to="/hospital_home"><i className="lni lni-home"></i>Home</Link></li>
                <li><Logout /></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
 
  );
}

export default PostLabReg;
