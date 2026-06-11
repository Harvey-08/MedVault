import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import "./css/bootstrap.min.css";
import "./css/owl.carousel.min.css";
import "./css/font-awesome.min.css";
import "./css/animate.css";
import "./css/lineicons.min.css";
import "./css/magnific-popup.css";
import "./css/style.css";
import "./js/jquery.min.js";
import "./js/bootstrap.bundle.min.js";

import imgSmall from "./img/core-img/logo-small.png";
import imgBg from "./img/bg-img/9.png";
import Logout from './Logout.jsx';
import Title from './Title.jsx';

const UpdateStatusAdmin = () => {
  const { id } = useParams();
  

  const navigate = useNavigate(); // Use navigate hook for programmatic navigation
  
  const [loading, setLoading] = useState(false); // For handling loading state
  const [error, setError] = useState(null); // For handling errors
 

  const [editedBuyer, setEditedBuyer] = useState({
    status: ''
  });

  useEffect(() => {
    const fetchBuyerDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/users/${id}`, {
          headers: { 'x-auth-token': token }
        });
        if (response.ok) {
          const data = await response.json();
          setEditedBuyer({
            status: data.status,
          });
        } else {
          console.error('Error fetching Request data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching Request data:', error.message);
      }
    };

    fetchBuyerDetails();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedBuyer({ ...editedBuyer, [name]: value });
  };

  const handleUpdateBuyer = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/users/status/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
      
        body: JSON.stringify(editedBuyer),
      });

      if (response.ok) {
        console.log('Status updated successfully!');
        alert('Status updated successfully');
        navigate("/view_hospital_admin"); // Use navigate for redirection
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to update status');
      }
    } catch (error) {
      setError('Error updating Request details');
      console.error('Error updating Request details:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <header className="header-area" id="headerArea">
        <div className="container h-100 d-flex align-items-center justify-content-between">
          <div className="logo-wrapper" style={{ color: '#020310' }}>
            <img src={imgSmall} alt="Logo" />
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
              <div className="user-profile"><img src={imgBg} alt="User Profile" /></div>
              <div className="user-info">
                <h6 className="user-name mb-1">Hospital Booking App</h6>
              </div>
            </div>
            <ul className="sidenav-nav ps-0">
              <li><Link to="/admin_home"><i className="lni lni-home"></i>Home</Link></li>
              <li><Logout /></li>
            </ul>
          </div>
        </div>
      </header>

      <div className="page-content-wrapper">
        <div className="top-products-area py-3">
          <div className="container">
            <div className="section-heading d-flex align-items-center justify-content-between">
              <h6>Update Status</h6>
            </div>
            {/* Form Script Start */}
            <div className="profile-wrapper-area py-3">
              <div className="card user-data-card">
                <div className="card-body">
                  <form onSubmit={handleUpdateBuyer} autoComplete="off">
                    <div className="mb-3">
                      <div className="title mb-2"><span>Update Status</span></div>
                      <select
                        name="status"
                        id="status"
                        value={editedBuyer.status}
                        onChange={handleInputChange}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>

                    {error && <div className="alert alert-danger">{error}</div>}
                    {loading && <div className="alert alert-info">Updating...</div>}

                    <button className="btn btn-success w-100" type="submit" disabled={loading}>
                      {loading ? 'Submitting...' : 'Submit'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
            {/* Form Script End */}
          </div>
        </div>
      </div>

      <footer className="footer-nav-area" id="footerNav">
        <div className="container h-100 px-0">
          <div className="suha-footer-nav h-100">
            <ul className="h-100 d-flex align-items-center justify-content-between ps-0">
              <li className="active"><Link to="/admin_home"><i className="lni lni-home"></i>Home</Link></li>
              <li><Logout /></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UpdateStatusAdmin;
