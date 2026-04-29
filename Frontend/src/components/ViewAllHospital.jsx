import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import "./css/bootstrap.min.css";
import "./css/owl.carousel.min.css";
import "./css/font-awesome.min.css";
import "./css/animate.css";
import "./css/font-awesome.min.css";
import "./css/lineicons.min.css";
import "./css/magnific-popup.css";
import "./css/style.css";
import axios from 'axios';
import "./js/jquery.min.js";  
import "./js/bootstrap.bundle.min.js";

import imgSmall from "./img/core-img/logo-small.png";
import imgBg from "./img/bg-img/9.png";
import Logout from './Logout.jsx';
import Title from './Title.jsx';

const ViewAllHospital = () => {

  // Initialize useNavigate to handle navigation
  const navigate = useNavigate();

  ////////////////////////////////////////////////
  //////////////Navgation Code Start//////////////
  ////////////////////////////////////////////////
  
  const setCookie = (name, value, days) => {
    let expires = '';
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = `; expires=${date.toUTCString()}`;
    }
    document.cookie = `${name}=${value || ''}${expires}; path=/`;
  };
  
  const bookappointment = (hospitalemail,name,doctor_name) => {
    // Set a cookie for the hospital's email
    setCookie('hospitalemail', hospitalemail, 7);
    setCookie('name', name, 7);
    setCookie('doctor_name', doctor_name, 7);
    // Navigate to the appointment booking page
    navigate("/post_appointment/");
  }

  const setShareFeedback = (hospitalemail) => {
    setCookie('hospitalemail', hospitalemail, 7);
    // Assuming farmer.useremail contains the user's email
    // Store useremail in cookies
    // For example, redirect to another page
    window.location.href = '/post_feedback';
  };
  const [hospitalData, setHospitalData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHospitalData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/hospital/`);
        if (response.status === 200) {
          setHospitalData(response.data);
          setFilteredData(response.data);
          setLoading(false);  // Set loading to false once data is fetched
        } else {
          console.error('Error fetching request data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching request data:', error.message);
      }
    };

    fetchHospitalData();
  }, []);

  // Filter data based on the search term
  const handleSearch = (term) => {
    setSearchTerm(term);
    const filtered = hospitalData.filter((hospital) =>
      Object.values(hospital).some((field) =>
        field.toString().toLowerCase().includes(term.toLowerCase())
      )
    );
    setFilteredData(filtered);
  };
  
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="header-area" id="headerArea">
        <div className="container h-100 d-flex align-hospitals-center justify-content-between">
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
            <div className="hospital-profile"><img src={imgBg} alt=""/></div>
            <div className="hospital-info">
              <h6 className="hospital-name mb-1">Hospital Booking App</h6>
            </div>
          </div>
    
          <ul className="sidenav-nav ps-0">
            <li><Link to="/patient_home"><i className="lni lni-home"></i>Home</Link></li>
            <li><Logout /></li>  
          </ul>
        </div>
      </div>

      <div className="page-content-wrapper">
        <div className="top-products-area py-3">
          <div className="container">
            <div className="section-heading d-flex align-hospitals-center justify-content-between">
              <h6> View All Hospital Details</h6>
            </div>

            <div className="row g-3">
              <div className="top-search-form">
                <form>
                  <input className="form-control" type="text" placeholder="Search..." value={searchTerm} onChange={(e) => handleSearch(e.target.value)} />
                  <button type="submit"><i className="fa fa-search"></i></button>
                </form>
              </div>
            </div>

            {/* Show hospital data if available */}
            {filteredData.length > 0 ? (
              <div className="row" style={{ marginTop: 10 }}>
                {filteredData.map((hospital) => (
                  <div key={hospital._id} className="col-12 col-md-6">                                      
                    <div className="card product-card" style={{ marginBottom: 10 }}>
                      <div className="card-body">
                        <a className="product-title d-block">Name: <b>{hospital.name}</b></a>
                        <a className="product-title d-block">Doctor Name: <b>{hospital.doctor_name}</b></a>
                        <a className="product-title d-block">Speciality: <b>{hospital.speciality}</b></a>
                        <a className="product-title d-block">Timing: <b>{hospital.timing}</b></a>
                        <a className="product-title d-block">Address: {hospital.address}</a>  
                        <a className="product-title d-block">City: {hospital.city}</a>  
                        <a className="product-title d-block">Mobile: {hospital.mobile}</a>
                        <a className="product-title d-block">Lat: {hospital.lat}</a>
                        <a className="product-title d-block">Long: {hospital.long}</a>
                      </div>
                    </div>
                  
                    {/* Button to trigger cookie setting and navigate to appointment page */}
                    <a className="btn btn-danger" onClick={() => { bookappointment(hospital.hospitalemail,hospital.name,hospital.doctor_name) }}>Book Appointment</a>
                    <a className="btn btn-danger"  onClick={() => setShareFeedback(hospital.hospitalemail)}  >Feedback</a>

                    <a className="btn btn-danger" target="_blank" href={`https://maps.google.com/?q=${hospital.lat},${hospital.long}`}>Show Map</a>
                  </div>
                ))}
              </div>
            ) : (
              <p>No hospital details found for the specified search term.</p>
            )}
          </div>
        </div>

        <div className="footer-nav-area" id="footerNav">
          <div className="container h-100 px-0">
            <div className="suha-footer-nav h-100">
              <ul className="h-100 d-flex align-hospitals-center justify-content-between ps-0">
                <li className="active">
                  <Link to="/patient_home"><i className="lni lni-home"></i>Home</Link>
                </li>
                <li><Logout /></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewAllHospital;
