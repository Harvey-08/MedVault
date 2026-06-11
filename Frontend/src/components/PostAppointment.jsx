import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import "./css/bootstrap.min.css";
import imgSmall from "./img/core-img/logo-small.png";
import imgBg from "./img/bg-img/9.png";
import Logout from './Logout.jsx';
import Title from './Title.jsx';

const PostAppointment = () => {
  const location = useLocation();
  const { hospitalemail = '', name = '', doctor_name = '' } = location.state || {};
  const patemail = localStorage.getItem('email') || '';

  const [appointment, setAppointment] = useState({
    patemail: patemail || '',
    hospitalemail: hospitalemail || '',
    patient_name: '',
    doctor_name: doctor_name || '',
    reason: '',
    appointment_date: '',
    timeslot: '',
    address: '',
    city: '',
    mobile: '',
  });

  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [error, setError] = useState('');
  const [loadingSubmit, setLoadingSubmit] = useState(false); // Loading state for form submission

  useEffect(() => {
    if (appointment.appointment_date) {
      const fetchSlots = async () => {
        setLoadingSlots(true);
        setError(''); // Clear previous errors
        try {
          const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/appointment/available-slots`, {
            params: { appointment_date: appointment.appointment_date, name: name },
          });
          setAvailableSlots(res.data.availableSlots);
        } catch (error) {
          console.error('Error fetching available slots', error);
          setError('Error fetching available slots. Please try again later.');
        } finally {
          setLoadingSlots(false);
        }
      };
      fetchSlots();
    }
  }, [appointment.appointment_date]);

  const handleInputChange = (e) => {
    setAppointment({
      ...appointment,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    setLoadingSubmit(true); // Start loading on submit

    // Validate mobile number input
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(appointment.mobile)) {
      setError('Please enter a valid 10-digit mobile number.');
      setLoadingSubmit(false); // Stop loading
      return;
    }
    const convertTo24HourFormat = (time) => {
      const [timePart, modifier] = time.split(' '); // Split time and AM/PM
      let [hours, minutes] = timePart.split(':'); // Split hours and minutes
    
      if (modifier === 'PM' && hours !== '12') {
        hours = parseInt(hours, 10) + 12; // Convert PM hours to 24-hour format
      } else if (modifier === 'AM' && hours === '12') {
        hours = '00'; // Midnight case
      }
    
      return `${hours}:${minutes}`; // Return time in 24-hour format
    };
    const formattedTime = convertTo24HourFormat(appointment.timeslot); // Convert to 24-hour format
    const selectedDateTime = new Date(`${appointment.appointment_date}T${formattedTime}`);
    const currentDateTime = new Date(); // Current date and time
  
    // Check if the selected date/time is in the past
    if (selectedDateTime <= currentDateTime) {
      setError('Appointment time cannot be in the past.');
      setLoadingSubmit(false); // Stop loading
      return;
    }
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/appointment/`, {
        ...appointment,
        patemail,
        hospitalemail,
        doctor_name,
      });

      if (response.status === 201) {
        alert('Appointment Booked Successfully!');
        // Reset the form after successful booking
        setAppointment({
          patemail: patemail || '',
          hospitalemail: hospitalemail || '',
          patient_name: '',
          doctor_name: '',
          reason: '',
          appointment_date: '',
          timeslot: '',
          address: '',
          city: '',
          mobile: '',
        });
      } else {
        setError(response.data.message || 'An unexpected error occurred.');
      }
    } catch (error) {
      // Handle error response from the server
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoadingSubmit(false); // Stop loading after submission attempt
    }
  };

  return (
    <div>
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
              <li>
                <Link to="/patient_home"><i className="lni lni-home"></i>Home</Link>
              </li>
              <li><Logout /></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="page-content-wrapper">
        <div className="top-products-area py-3">
          <div className="container">
            <div className="section-heading d-flex align-items-center justify-content-between">
              <h6>Book Appointment</h6>
            </div>
            <div className="profile-wrapper-area py-3">
              <div className="card user-data-card">
                <div className="card-body">
                  <form onSubmit={handleSubmit} autoComplete="off">
                    {error && <div className="alert alert-danger">{error}</div>} {/* Error message display */}
                    <div className="mb-3">
                      <div className="title mb-2"><span>Patient Name</span></div>
                      <input
                        className="form-control"
                        name="patient_name"
                        value={appointment.patient_name}
                        onChange={handleInputChange}
                        type="text"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <div className="title mb-2"><span>Reason for Appointment</span></div>
                      <input
                        className="form-control"
                        name="reason"
                        value={appointment.reason}
                        onChange={handleInputChange}
                        type="text"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <div className="title mb-2"><span>Appointment Date</span></div>
                      <input
                        className="form-control"
                        name="appointment_date"
                        value={appointment.appointment_date}
                        onChange={handleInputChange}
                        type="date"
                        min={new Date().toISOString().split("T")[0]} // Prevent past dates
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <div className="title mb-2"><span>Select Time Slot</span></div>
                      {loadingSlots ? (
                        <p>Loading slots...</p>
                      ) : (
                        <select
                          className="form-control"
                          name="timeslot"
                          value={appointment.timeslot}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Select a time slot</option>
                          {availableSlots.map((slot, index) => (
                            <option key={index} value={slot}>{slot}</option>
                          ))}
                        </select>
                      )}
                    </div>
                    <div className="mb-3">
                      <div className="title mb-2"><span>Address</span></div>
                      <input
                        className="form-control"
                        name="address"
                        value={appointment.address}
                        onChange={handleInputChange}
                        type="text"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <div className="title mb-2"><span>City</span></div>
                      <input
                        className="form-control"
                        name="city"
                        value={appointment.city}
                        onChange={handleInputChange}
                        type="text"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <div className="title mb-2"><span>Mobile</span></div>
                      <input
                        className="form-control"
                        name="mobile"
                        value={appointment.mobile}
                        onChange={handleInputChange}
                        type="tel"
                        pattern="[0-9]{10}" // Validate mobile number pattern
                        required
                      />
                    </div>
                    <button className="btn btn-success w-100" type="submit" disabled={loadingSubmit}>
                      {loadingSubmit ? 'Submitting...' : 'Submit'}
                    </button>
                  </form>
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
};

export default PostAppointment;
