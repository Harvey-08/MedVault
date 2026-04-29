import React, { useState, useEffect } from 'react';
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
import imgSmall from "./img/core-img/logo-small.png";
import imgBg from "./img/bg-img/9.png";
import Logout from './Logout.jsx';
import Title from './Title.jsx';

const PostPrescription = () => {
  const [formData, setFormData] = useState({
    patemail: '',
    hospitalemail: '',
    doctor_name: '',
    patient_name: '',
    findings: '',
    lab_test:'',
    medicine_1: '',
    medicine_2: '',
    medicine_3: '',
    medicine_4: '',
    notes: '',
  });
  const [validationErrors, setValidationErrors] = useState({});

  // Utility function to get a cookie value
  const getCookie = (name) => {
    return decodeURIComponent(document.cookie.replace(new RegExp(`(?:(?:^|.*;\\s*)${name}\\s*=\\s*([^;]*).*$)|^.*$`), '$1'));
  };

  // Populate formData from cookies when component mounts
  useEffect(() => {
    const hospitalemail = getCookie('hospitalemail');
    const patemail = getCookie('patemail');
    const patient_name = getCookie('patient_name');
    const doctor_name = getCookie('doctor_name');

    setFormData((prevData) => ({
      ...prevData,
      hospitalemail,
      patemail,
      patient_name,
      doctor_name,
    }));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    // Reset validation error for the current field when it's being modified
    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));
  };

  const validateForm = () => {
    let isValid = true;
    const errors = {};

    if (!formData.findings) {
      errors.findings = 'Findings is required';
      isValid = false;
    }
    if (!formData.medicine_1) {
      errors.medicine_1 = 'Medicine 1 is required';
      isValid = false;
    }
    if (!formData.lab_test) {
      errors.lab_test = 'Lab Test is required';
      isValid = false;
    }
    
    if (!formData.notes) {
      errors.notes = 'Notes are required';
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const postPrescriptionData = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/prescription/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log('Prescription data posted successfully!');
        alert('Created successfully');
        window.location.href = '/view_prescription';
      } else {
        console.error('Error posting Prescription data:', response.statusText);
      }
    } catch (error) {
      console.error('Error posting Prescription data:', error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }
    postPrescriptionData();
  };

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
              <h6>Add Prescription</h6>
            </div>
            <div className="profile-wrapper-area py-3">
              <div className="card user-data-card">
                <div className="card-body">
                  <form onSubmit={handleSubmit} autoComplete="off">
                    <div className="mb-3">
                      <div className="title mb-2"><span>Patient Email</span></div>
                      <input className="form-control" name="patemail" value={formData.patemail} readOnly />
                    </div>
                    <div className="mb-3">
                      <div className="title mb-2"><span>Patient Name</span></div>
                      <input className="form-control" name="patient_name" value={formData.patient_name} readOnly />
                    </div>
                    <div className="mb-3">
                      <div className="title mb-2"><span>Doctor Name</span></div>
                      <input className="form-control" name="doctor_name" value={formData.doctor_name} readOnly />
                    </div>
                    <div className="mb-3">
                      <div className="title mb-2"><span>Findings</span></div>
                      <input className="form-control" name="findings" value={formData.findings} onChange={handleInputChange} />
                      {validationErrors.findings && <p style={{ color: 'red' }}>{validationErrors.findings}</p>}
                    </div>
                    <div className="mb-3">
                      <div className="title mb-2"><span>Medicine 1</span></div>
                      <input className="form-control" name="medicine_1" value={formData.medicine_1} onChange={handleInputChange} />
                      {validationErrors.medicine_1 && <p style={{ color: 'red' }}>{validationErrors.medicine_1}</p>}
                    </div>
                    <div className="mb-3">
                      <div className="title mb-2"><span>Medicine 2</span></div>
                      <input className="form-control" name="medicine_2" value={formData.medicine_2} onChange={handleInputChange} />
                     </div>
                    <div className="mb-3">
                      <div className="title mb-2"><span>Medicine 3</span></div>
                      <input className="form-control" name="medicine_3" value={formData.medicine_3} onChange={handleInputChange} />
                     </div>
                    <div className="mb-3">
                      <div className="title mb-2"><span>Medicine 4</span></div>
                      <input className="form-control" name="medicine_4" value={formData.medicine_4} onChange={handleInputChange} />
                    </div>
                    <div className="mb-3">
                      <div className="title mb-2"><span>Lab Test </span></div>
                      <input className="form-control" name="lab_test" value={formData.lab_test} onChange={handleInputChange}/>
                      {validationErrors.lab_test && <p style={{ color: 'red' }}>{validationErrors.lab_test}</p>}
                    </div>
                    <div className="mb-3">
                      <div className="title mb-2"><span>Notes</span></div>
                      <textarea className="form-control" name="notes" value={formData.notes} onChange={handleInputChange}></textarea>
                      {validationErrors.notes && <p style={{ color: 'red' }}>{validationErrors.notes}</p>}
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

export default PostPrescription;
