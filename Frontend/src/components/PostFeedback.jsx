import React, { useState } from 'react';
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

const PostFeedback = () => {
  const patemail = decodeURIComponent(document.cookie.replace(/(?:(?:^|.*;\s*)patemail\s*=\s*([^;]*).*$)|^.*$/, '$1'));
  const hospitalemail = decodeURIComponent(document.cookie.replace(/(?:(?:^|.*;\s*)hospitalemail\s*=\s*([^;]*).*$)|^.*$/, '$1'));

  const [formData, setFormData] = useState({
    name: '',
    feedback: '',
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.feedback) newErrors.feedback = 'Feedback is required';
    return newErrors;
  };

  const postFeedback = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/feedback/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify({
          ...formData,
          patemail: patemail,hospitalemail:hospitalemail,
        }),
      });

      if (response.ok) {
        console.log('Feedback data posted successfully!');
        alert('Feedback Submitted Successfully');
        window.location.href = "/view_all_hospital";
      } else {
        console.error('Error posting feedback data:', response.statusText);
      }
    } catch (error) {
      console.error('Error posting feedback data:', error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
    } else {
      postFeedback();
    }
  };

  return (
    <div>
      <div>
        <div className="header-area" id="headerArea">
          <div className="container h-100 d-flex align-items-center justify-content-between">
            <div className="header-area" id="headerArea">
              <div className="container h-100 d-flex align-items-center justify-content-between">
                <div className="logo-wrapper" style={{color:'#020310'}}>
                  <img src={imgSmall} alt=""/>
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
                  <div className="user-profile"><img src={imgBg} alt=""/></div>
                  <div className="user-info">
                    <h6 className="user-name mb-1">Hospital Booking App
                    </h6>
                  </div>
                </div>
                <ul className="sidenav-nav ps-0">
                  <li><Link to="/patient_home"><i className="lni lni-home"></i>Home</Link></li>
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
                <h6>Post Feedback</h6>
              </div>
              <div className="profile-wrapper-area py-3">
                <div className="card user-data-card">
                  <div className="card-body">
                    <form onSubmit={handleSubmit} autoComplete="off">
                      <div className="mb-3">
                        <div className="title mb-2"><span>Name</span></div>
                        <input
                          className="form-control"
                          name="name"
                          id="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          type="text"
                        />
                        {errors.name && <p style={{ color: 'red' }}>{errors.name}</p>}
                      </div>
                      <div className="mb-3">
                        <div className="title mb-2"><span>Feedback</span></div>
                        <input
                          className="form-control"
                          name="feedback"
                          id="feedback"
                          value={formData.feedback}
                          onChange={handleInputChange}
                          type="text"
                        />
                        {errors.feedback && <p style={{ color: 'red' }}>{errors.feedback}</p>}
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
                <li className="active"><Link to="/patient_home"><i className="lni lni-home"></i>Home</Link></li>
                <li><Logout /></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostFeedback;
