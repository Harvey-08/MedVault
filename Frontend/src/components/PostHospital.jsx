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

// name  vendorname mechanicname hospital available  locality address city mobile 

const PostHospital = () => {
  
  const [formData, setFormData] = useState({
    hospitalemail:  '',
        name:  '',
        doctor_name:  '',
        speciality:  '',
        timing:  '',
        mobile:  '',
        address:  '',
        city:  '',
    
  });
  const [validationErrors, setValidationErrors] = useState({});


  const postHospitalData = async () => {
   
    const hospitalEmail = decodeURIComponent(document.cookie.replace(/(?:(?:^|.*;\s*)hospitalemail\s*=\s*([^;]*).*$)|^.*$/, '$1'));
    //console.log(vendorEmail);  // Output: vendor@gmail.com

    
    try {
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/hospital/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Assuming the server expects JSON
        },
        body: JSON.stringify({ ...formData, hospitalemail: hospitalEmail }),
      });
  

    if (response.ok) {
      console.log('Hospital  data posted successfully!');
      // Handle success, e.g., redirect to another page
      alert('Created Successful');
      window.location.href = 'view_my_hospital';
    } else {
      console.error('Error posting Hospital data:', response.statusText);
    }
  } catch (error) {
    console.error('Error posting Hospital data:', error.message);
  }
};

  
const handleInputChange = (e) => {
  const { name, value } = e.target;
  setFormData({ ...formData, [name]: value });
 
  // Reset validation error for the current field when it's being modified
  setValidationErrors({
    ...validationErrors,
    [name]: '',
  });
};
      // Validation 
      const validateForm = () => {
        let isValid = true;
        const errors = {};
       
        if (!formData.name) {
          errors.name = 'Name is required';
          isValid = false;
        }
        if (!formData.doctor_name) {
          errors.doctor_name = 'Doctor Name is required';
          isValid = false;
        }
        if (!formData.speciality) {
          errors.speciality = 'Speciality is required';
          isValid = false;
        }
        if (!formData.timing) {
          errors.timing = 'Timing is required';
          isValid = false;
        }
        else {
          // Check if timing matches the expected format
          const timePattern = /^\d{1,2}:\d{2} (AM|PM) - \d{1,2}:\d{2} (AM|PM)$/;
          if (!timePattern.test(formData.timing)) {
              errors.timing = "Timing must be in the format 'hh:mm AM/PM - hh:mm AM/PM'";
              isValid = false;
          }
      }
        
      
        if (!formData.city) {
          errors.city = 'City is required';
          isValid = false;
        }
     
        if (!formData.address) {
          errors.address = 'Address is required';
          isValid = false;
        }
        if (!formData.mobile || !/^\d{10}$/.test(formData.mobile)) {
          errors.mobile = 'Mobile must be a 10-digit number';
          isValid = false;
        }
      
        setValidationErrors(errors);
        return isValid;
      };
    
      const handleSubmit = (e) => {
        e.preventDefault();
    
        if (!validateForm()) {
          return;
        }
        postHospitalData();
      };
  // OnForm Submit
 


  return (
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
              <h6>Add Hospital</h6>
            </div>
            <div className="profile-wrapper-area py-3">
              <div className="card user-data-card">
                <div className="card-body">
                  <form onSubmit={handleSubmit} autoComplete="off">
                
                    <div className="mb-3">
                      <div className="title mb-2"><span>Hospital Name</span></div>
                      <input className="form-control" name="name" id="name" value={formData.name} onChange={handleInputChange} type="text" />
                      {validationErrors.name && <p style={{ color: 'red' }}>{validationErrors.name}</p>}
                    </div>
                   
                    <div className="mb-3">
                      <div className="title mb-2"><span>Doctor Name</span></div>
                      <input className="form-control" name="doctor_name" id="doctor_name" value={formData.doctor_name} onChange={handleInputChange} type="text" />
                      {validationErrors.doctor_name && <p style={{ color: 'red' }}>{validationErrors.doctor_name}</p>}
                    </div>
                 
                    <div className="mb-3">
                      <div className="title mb-2"><span>Speciality</span></div>
                      <input className="form-control" name="speciality" id="speciality" value={formData.speciality} onChange={handleInputChange} type="text" />
                      {validationErrors.speciality && <p style={{ color: 'red' }}>{validationErrors.speciality}</p>}
                    </div>
                    <div className="mb-3">
                      <div className="title mb-2"><span>Timing(e.g., 9:00 AM - 5:00 PM)</span></div>
                      <input className="form-control" name="timing" id="timing" value={formData.timing} onChange={handleInputChange} type="text" />
                      {validationErrors.timing && <p style={{ color: 'red' }}>{validationErrors.timing}</p>}
                    </div>
                    <div className="mb-3">
                      <div className="title mb-2"><span>Address</span></div>
                      <input className="form-control" name="address" id="address" value={formData.address} onChange={handleInputChange} type="text" />
                      {validationErrors.address && <p style={{ color: 'red' }}>{validationErrors.address}</p>}
                    </div>
                    <div className="mb-3">
                      <div className="title mb-2"><span>City</span></div>
                      <input className="form-control" name="city" id="city" value={formData.city} onChange={handleInputChange} type="text" />
                      {validationErrors.city && <p style={{ color: 'red' }}>{validationErrors.city}</p>}
                    </div>
                    <div className="mb-3">
                      <div className="title mb-2"><span>Mobile</span></div>
                      <input className="form-control" name="mobile" id="mobile" value={formData.mobile} onChange={handleInputChange} type="text" />
                      {validationErrors.mobile && <p style={{ color: 'red' }}>{validationErrors.mobile}</p>}
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

export default PostHospital;
