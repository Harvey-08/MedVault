import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "./css/bootstrap.min.css";
import "./css/owl.carousel.min.css";
import "./css/font-awesome.min.css";
import "./css/animate.css";
import "./css/lineicons.min.css";
import "./css/magnific-popup.css";
import "./css/style.css";
import "./css/Table.css";
import "./js/jquery.min.js";  
import "./js/bootstrap.bundle.min.js";
import imgSmall from "./img/core-img/logo-small.png";
import imgBg from "./img/bg-img/9.png";
import Logout from './Logout.jsx';
import Title from './Title.jsx';

const ConsentSettings = () => {
  const navigate = useNavigate();
  const [hospitals, setHospitals] = useState([]);
  const [consents, setConsents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const token = localStorage.getItem('token');

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch all approved hospitals
      const hospitalRes = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/hospital/`, {
        headers: { 'x-auth-token': token }
      });
      const hospitalData = await hospitalRes.json();

      // Fetch patient's consent status mappings
      const consentRes = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/consent/status`, {
        headers: { 'x-auth-token': token }
      });
      const consentData = await consentRes.json();

      setHospitals(hospitalData);
      setConsents(consentData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching consent details:', error);
      setErrorMsg('Failed to load sharing settings.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleConsentAction = async (hospitalEmail, action) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/consent/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({ hospitalEmail })
      });

      if (response.ok) {
        alert(`Access ${action}ed successfully!`);
        fetchData(); // Refresh statuses
      } else {
        const errorData = await response.json();
        alert(errorData.error || `Error performing action: ${action}`);
      }
    } catch (error) {
      console.error(`Error performing action ${action}:`, error);
      alert('Internal error performing action.');
    }
  };

  const getHospitalConsentStatus = (hospitalEmail) => {
    const consentRecord = consents.find(c => c.hospitalEmail === hospitalEmail);
    return consentRecord ? consentRecord.status : 'None';
  };

  const getBadgeClass = (status) => {
    switch (status) {
      case 'Granted': return 'badge bg-success';
      case 'Pending': return 'badge bg-warning text-dark';
      case 'Revoked': return 'badge bg-secondary';
      case 'Denied': return 'badge bg-danger';
      default: return 'badge bg-light text-dark';
    }
  };

  if (loading) {
    return <div className="text-center py-5"><h4>Loading Consent Settings...</h4></div>;
  }

  return (
    <div>
      <div className="header-area" id="headerArea">
        <div className="container h-100 d-flex align-items-center justify-content-between">
          <div className="logo-wrapper" style={{ color: '#020310' }}>
            <img src={imgSmall} alt="" /> <Title />
          </div>
          <div className="suha-navbar-toggler" data-bs-toggle="offcanvas" data-bs-target="#suhaOffcanvas" aria-controls="suhaOffcanvas">
            <span></span><span></span><span></span>
          </div>
        </div>
      </div>

      <div className="offcanvas offcanvas-start suha-offcanvas-wrap" id="suhaOffcanvas" tabIndex="-1" aria-labelledby="suhaOffcanvasLabel">
        <button className="btn-close btn-close-white text-reset" type="button" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        <div className="offcanvas-body">
          <div className="sidenav-profile">
            <div className="user-profile"><img src={imgBg} alt="" /></div>
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
        <div className="container py-3">
          <div className="section-heading d-flex align-items-center justify-content-between mb-4">
            <h6>Medical Record Sharing & Consent Control</h6>
          </div>

          {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

          <div className="row g-3">
            {hospitals.map((hospital) => {
              const status = getHospitalConsentStatus(hospital.hospitalemail);
              return (
                <div key={hospital._id} className="col-12 col-md-6">
                  <div className="card shadow-sm border-0 mb-3" style={{ borderRadius: '12px', background: '#fff', padding: '20px' }}>
                    <div className="card-body p-0">
                      <h6 className="mb-2" style={{ fontWeight: '600', color: '#2d3436' }}>{hospital.name}</h6>
                      <p className="mb-1 text-muted" style={{ fontSize: '13px' }}><b>Speciality:</b> {hospital.speciality}</p>
                      <p className="mb-1 text-muted" style={{ fontSize: '13px' }}><b>Doctor:</b> {hospital.doctor_name}</p>
                      <p className="mb-3 text-muted" style={{ fontSize: '13px' }}><b>Email:</b> {hospital.hospitalemail}</p>
                      
                      <hr style={{ margin: '12px 0', borderColor: '#f1f2f6' }} />

                      <div className="d-flex align-items-center justify-content-between">
                        <div style={{ fontSize: '14px', fontWeight: '500', color: '#2d3436' }}>
                          Status: <span className={`${getBadgeClass(status)} ms-1`} style={{ padding: '5px 10px', borderRadius: '20px', display: 'inline-block' }}>{status}</span>
                        </div>
                        <div className="d-flex gap-2">
                          {(status === 'Pending' || status === 'None' || status === 'Revoked' || status === 'Denied') && (
                            <button 
                              className="btn btn-success btn-sm px-3"
                              style={{ borderRadius: '6px', fontSize: '12px', padding: '6px 12px', position: 'static', width: 'auto', height: 'auto' }}
                              onClick={() => handleConsentAction(hospital.hospitalemail, 'grant')}
                            >
                              Grant Access
                            </button>
                          )}
                          {status === 'Pending' && (
                            <button 
                              className="btn btn-danger btn-sm px-3"
                              style={{ borderRadius: '6px', fontSize: '12px', padding: '6px 12px', position: 'static', width: 'auto', height: 'auto' }}
                              onClick={() => handleConsentAction(hospital.hospitalemail, 'deny')}
                            >
                              Deny
                            </button>
                          )}
                          {status === 'Granted' && (
                            <button 
                              className="btn btn-warning btn-sm text-dark px-3"
                              style={{ borderRadius: '6px', fontSize: '12px', padding: '6px 12px', fontWeight: '500', position: 'static', width: 'auto', height: 'auto' }}
                              onClick={() => handleConsentAction(hospital.hospitalemail, 'revoke')}
                            >
                              Revoke Access
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="footer-nav-area" id="footerNav">
        <div className="container h-100 px-0">
          <div className="suha-footer-nav h-100">
            <ul className="h-100 d-flex align-items-center justify-content-between ps-0">
              <li className="active">
                <Link to="/patient_home"><i className="lni lni-home"></i>Home</Link>
              </li>
              <li><Logout /></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsentSettings;
