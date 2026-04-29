import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "./css/bootstrap.min.css";
import "./css/owl.carousel.min.css";
import "./css/font-awesome.min.css";
import "./css/animate.css";
import "./css/lineicons.min.css";
import "./css/magnific-popup.css";
import "./css/style1.css";
import "./js/jquery.min.js";  
import "./js/bootstrap.bundle.min.js";
// import "./js/waypoints.min.js"; // Uncomment if needed
// import "./js/owl.carousel.min.js"; // Uncomment if needed
// import "./js/jquery.magnific-popup.min.js"; // Uncomment if needed
import imgSmall from "./img/core-img/logo-small.png";
import imgbg from "./img/bg.jpg";
import imgst from "./img/sty-1.png";

const Index = () => {
  const [loading, setLoading] = useState(true);

const setCookie = (name, value, days) => {
    let expires = '';
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = `; expires=${date.toUTCString()}`;
    }
    document.cookie = `${name}=${value || ''}${expires}; path=/`;
  };
  const handleLinkClick1 = () => {
    // Set a cookie named "user" with value "JohnDoe" that expires in 7 days
    setCookie('role', 'Admin', 7);
    console.log('Cookie set!');
  };

  const handleLinkClick2 = () => {
    // Set a cookie named "user" with value "JohnDoe" that expires in 7 days
    setCookie('role', 'Hospital', 7);
    console.log('Cookie set!');
  };

  const handleLinkClick3 = () => {
    // Set a cookie named "user" with value "JohnDoe" that expires in 7 days
    setCookie('role', 'Patient', 7);
    console.log('Cookie set!');
  };

  const handleLinkClick4 = () => {
    // Set a cookie named "user" with value "JohnDoe" that expires in 7 days
    setCookie('role', 'Lab', 7);
    console.log('Cookie set!');
  };
  // UseEffect to handle spinner timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // Spinner will disappear after 2 seconds
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      {/* Spinner */}
      {loading && (
        <div id="spinner" className="show bg-white position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center">
          <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}

      {/* Navbar */}
      <div className="container-fluid header position-relative overflow-hidden p-0">
        <nav className="navbar navbar-expand-lg fixed-top navbar-light px-4 px-lg-5 py-3 py-lg-0">
          <Link to="/" className="navbar-brand p-0">
            <h1 className="display-6 text-primary m-0">
            <i class="fas fa-book-medical me-3"></i>
             Hospital Booking App
            </h1>
          </Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
            <span className="fa fa-bars"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarCollapse">
            <div className="navbar-nav ms-auto py-0">
              <Link to="/" className="nav-item nav-link active">Home</Link>
              <div className="nav-item dropdown">
                <Link to="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">Register</Link>
                <div className="dropdown-menu m-0">
                  <Link to="/hospital_register" className="dropdown-item">Hospital</Link>
                  <Link to="/patient_register" className="dropdown-item">Patient</Link>
                </div>
              </div>
              <div className="nav-item dropdown">
                <Link to="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">Login</Link>
                <div className="dropdown-menu m-0">
                  <Link to="/admin_login" onClick={handleLinkClick1} className="dropdown-item">Admin</Link>
                  <Link to="/login" onClick={handleLinkClick2} className="dropdown-item">Hospital</Link>
                  <Link to="/login" onClick={handleLinkClick3} className="dropdown-item">Patient</Link>
                  <Link to="/lab_login" onClick={handleLinkClick4} className="dropdown-item">Lab</Link>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="hero-header overflow-hidden px-5">
          <div className="rotate-img">
            <img src={imgst} className="img-fluid w-100" alt="Rotate" />
            <div className="rotate-sty-2"></div>
          </div>
          <div className="row gy-5 align-items-center">
            <div className="col-lg-6 wow fadeInLeft" data-wow-delay="0.1s">
              <h1 className="display-4 text-dark mb-4 wow fadeInUp" data-wow-delay="0.3s">Hospital Booking </h1>
              <p className="fs-4 mb-4 wow fadeInUp" data-wow-delay="0.5s"  style={{ color: 'black'}}>The system aims to make the appointment booking process easier for patients.</p>
              <Link to="/login" onClick={handleLinkClick3} className="btn btn-primary rounded-pill py-3 px-5 wow fadeInUp" data-wow-delay="0.7s">Get Started</Link>
            </div>
            <div className="col-lg-6 wow fadeInRight" data-wow-delay="0.2s">
              <img src={imgbg} className="img-fluid w-100 h-100" alt="Hero Background" />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container-fluid feature overflow-hidden py-5">
        <div className="container py-5">
          <div className="text-center mx-auto mb-5 wow fadeInUp" data-wow-delay="0.1s" style={{ maxWidth: '900px' }}>
            <h4 className="text-primary">Our Feature</h4>
             <p className="mb-0" style={{ color: 'black'}}>This application is a smart appointment booking system that provides patients or any user an easy
way of booking a doctor’s appointment online. This is a web based portal that overcomes the issue of managing
and booking appointments according to user’s choice or demands.</p>
          </div>
        
        </div>
      </div>
    </div>
  );
};

export default Index;
