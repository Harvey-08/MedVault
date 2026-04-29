import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "./css/bootstrap.min.css";
import "./css/style.css";
import imgSmall from "./img/core-img/logo-small.png";
import imgBg from "./img/bg-img/9.png";
import Logout from './Logout.jsx';
import Title from './Title.jsx';

const ViewMyAppointment = () => {
  const [appointmentData, setAppointmentData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointmentData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/appointment/`);
        const data = await response.json();

        // Get patient email from cookies
        const patemail = decodeURIComponent(document.cookie.replace(/(?:(?:^|.*;\s*)patemail\s*=\s*([^;]*).*$)|^.*$/, '$1'));

        // Filter appointments based on patient email
        const filteredAppointments = data.filter((appointment) => appointment.patemail === patemail);
        
        setAppointmentData(filteredAppointments);
        setFilteredData(filteredAppointments);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching appointment data:', error);
        setError('Unable to fetch appointment data. Please try again later.');
        setLoading(false);
      }
    };

    fetchAppointmentData();
  }, []);

  // Filter appointments based on the search term
  const handleSearch = (term) => {
    setSearchTerm(term);
    const filtered = appointmentData.filter((appointment) =>
      Object.values(appointment).some((field) =>
        field.toString().toLowerCase().includes(term.toLowerCase())
      )
    );
    setFilteredData(filtered);
  };

  if (loading) {
    return <div>Loading appointments...</div>;
  }
  const timeOptions = { hour: '2-digit', minute: '2-digit' };

  return (
    <div>
      <div className="header-area" id="headerArea">
        <div className="container h-100 d-flex align-appointments-center justify-content-between">
          <div className="logo-wrapper" style={{color:'#020310'}}>
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
              <h6 className="user-name mb-1">Hospital Booking App</h6>
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
            <div className="section-heading d-flex align-appointments-center justify-content-between">
              <h6>My Appointment Details</h6>
            </div>

            {/* Search Form */}
            <div className="row g-3">
              <div className="top-search-form">
                <form onSubmit={(e) = autoComplete="off"> e.preventDefault()}>
                  <input 
                    className="form-control" 
                    type="text" 
                    placeholder="Search..." 
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)} 
                  />
                  <button type="submit">
                    <i className="fa fa-search"></i>
                  </button>
                </form>
              </div>
            </div>

            {/* Appointment List */}
            {error && <p className="text-danger">{error}</p>}

            {filteredData.length > 0 ? (
              <div className="row" style={{ marginTop: 10 }}>
                {filteredData.map((appointment) => (
                  <div key={appointment._id} className="col-12 col-md-6">
                    <div className="card product-card" style={{ marginBottom: 10 }}>
                      <div className="card-body">
                      <a className="product-title d-block">Hospital Email: <b>{appointment.hospitalemail}</b></a>
                        <a className="product-title d-block">Patient Name:: <b> {appointment.patient_name}</b></a>
                        <a className="product-title d-block">Doctor Name:: <b> {appointment.doctor_name}</b></a>
                        
                        <a className="product-title d-block">Reason: <b>{appointment.reason}</b></a>

            
                        <a className="product-title d-block">Appointment Date: <b>  {new Date(appointment.appointment_date).toLocaleDateString('en-GB',timeOptions)}  </b></a>
                        <a className="product-title d-block">Time Slot: <b>{appointment.timeslot}</b></a>
                      
                        <a className="product-title d-block">Address: {appointment.address}</a>  
                        <a className="product-title d-block">City: {appointment.city}</a>  
                        <a className="product-title d-block">Mobile:  {appointment.mobile}</a>
                    
                        <p className="product-title d-block" style={{ color: 'green' }}>Status: {appointment.status}</p>
                  
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No appointments found.</p>
            )}

          </div>
        </div>
      </div>

      <div className="footer-nav-area" id="footerNav">
        <div className="container h-100 px-0">
          <div className="suha-footer-nav h-100">
            <ul className="h-100 d-flex align-appointments-center justify-content-between ps-0">
              <li className="active">
                <Link to="/patient_home">
                  <i className="lni lni-home"></i>Home
                </Link>
              </li>
              <li><Logout /></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewMyAppointment;
