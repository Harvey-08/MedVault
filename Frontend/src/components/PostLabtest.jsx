import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import "./css/bootstrap.min.css";
import "./css/owl.carousel.min.css";
import "./css/font-awesome.min.css";
import "./css/animate.css";
import "./css/font-awesome.min.css";
import "./css/lineicons.min.css";
import "./css/magnific-popup.css";
import "./css/style.css";
import imgSmall from "./img/core-img/logo-small.png";
import imgBg from "./img/bg-img/9.png";
import Logout from './Logout.jsx';
import Title from './Title.jsx';

const PostLabtest = () => {
    const location = useLocation();
    const [formData, setFormData] = useState({
        patemail: '',
        labemail: '',
        hospitalemail: '',
        patient_name: '',
        test_name: '',
        range: '',
        actual_range: '',
        level: '',
        date: '',
        report: null,
    });
    const [validationErrors, setValidationErrors] = useState({});

    const postLabtestData = async () => {
        const labemail = localStorage.getItem('email') || '';
        const { hospitalemail = '', patemail = '', patient_name = '' } = location.state || {};

        // Validate required fields
        if (!labemail || labemail === 'undefined' || labemail === '') {
            alert('Error: Lab email not found. Please login again.');
            return;
        }
        if (!hospitalemail || hospitalemail === 'undefined' || hospitalemail === '') {
            alert('Error: Hospital email not found. Please login again.');
            return;
        }
        if (!patemail || patemail === 'undefined' || patemail === '') {
            alert('Error: Patient email not found. Please select a patient first.');
            return;
        }
        if (!patient_name || patient_name === 'undefined' || patient_name === '') {
            alert('Error: Patient name not found. Please select a patient first.');
            return;
        }

        try {
            const formDataForServer = new FormData();
            formDataForServer.append('labemail', labemail);
            formDataForServer.append('hospitalemail', hospitalemail);
            formDataForServer.append('patemail', patemail);
            formDataForServer.append('patient_name', patient_name);
            formDataForServer.append('test_name', formData.test_name);
            formDataForServer.append('range', formData.range);
            formDataForServer.append('actual_range', formData.actual_range);
            formDataForServer.append('level', formData.level);
            formDataForServer.append('date', formData.date);
            formDataForServer.append('report', formData.report);

            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/labtest/`, {
                method: 'POST',
                headers: {
                    'x-auth-token': token
                },
                body: formDataForServer
                // Do NOT set Content-Type header - browser will set it automatically with boundary for FormData
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Labtest data posted successfully!', result);
                alert('Lab test created successfully!');
                window.location.href = '/view_my_labtest';
            } else {
                // Try to parse as JSON first
                let errorMessage = 'Failed to create lab test';
                const contentType = response.headers.get('content-type');
                
                if (contentType && contentType.includes('application/json')) {
                    try {
                        const errorData = await response.json();
                        errorMessage = errorData.error || errorData.message || errorMessage;
                    } catch (e) {
                        console.error('Error parsing JSON error:', e);
                    }
                } else {
                    // If not JSON, try to extract error from HTML/text
                    const errorText = await response.text();
                    // Try to extract error message from HTML if present
                    const match = errorText.match(/Error:\s*([^<]+)/i);
                    if (match) {
                        errorMessage = match[1].trim();
                    } else {
                        errorMessage = errorText.substring(0, 200) || errorMessage;
                    }
                }
                console.error('Error posting Labtest data:', errorMessage);
                alert(`Error: ${errorMessage}`);
            }
        } catch (error) {
            console.error('Error posting Labtest data:', error.message);
            alert(`Error: ${error.message || 'Failed to submit lab test. Please try again.'}`);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;

        if (name === 'report') {
            const file = files[0];
            if (file) {
                // Validate file type on client side
                const allowedTypes = [
                    'application/pdf',
                    'image/jpeg',
                    'image/png',
                    'image/jpg',
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
                    'application/vnd.ms-excel', // .xls
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
                    'application/msword', // .doc
                    'text/plain', // .txt
                    'text/csv' // .csv
                ];
                
                const allowedExtensions = ['.pdf', '.jpg', '.jpeg', '.png', '.xlsx', '.xls', '.docx', '.doc', '.txt', '.csv'];
                const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
                
                if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
                    setValidationErrors({
                        ...validationErrors,
                        [name]: 'Invalid file type! Allowed: PDF, JPEG, PNG, Excel (.xlsx, .xls), Word (.docx, .doc), TXT, CSV',
                    });
                    e.target.value = ''; // Clear the file input
                    return;
                }
            }
            setFormData({
                ...formData,
                [name]: file,
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }

        setValidationErrors({
            ...validationErrors,
            [name]: '',
        });
    };

    const validateForm = () => {
        let isValid = true;
        const errors = {};

        // Add validation for required fields
        if (!formData.test_name || formData.test_name.trim() === '') {
            errors.test_name = 'Test Name is required';
            isValid = false;
        }
        if (!formData.range || formData.range.trim() === '') {
            errors.range = 'Range is required';
            isValid = false;
        }
        if (!formData.actual_range || formData.actual_range.trim() === '') {
            errors.actual_range = 'Actual Range is required';
            isValid = false;
        }
        if (!formData.level || formData.level.trim() === '') {
            errors.level = 'Level is required';
            isValid = false;
        }
        if (!formData.date || formData.date.trim() === '') {
            errors.date = 'Date is required';
            isValid = false;
        }
        if (!formData.report) {
            errors.report = 'Report file is required';
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
        postLabtestData();
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
                  <Link to="/lab_home"><i className="lni lni-home"></i>Home</Link>
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
                            <h6>Add Labtest Details</h6>
                        </div>
                        <div className="profile-wrapper-area py-3">
                            <div className="card user-data-card">
                                <div className="card-body">
                                    <form onSubmit={handleSubmit} autoComplete="off">
                                        <div className="mb-3">
                                            <div className="title mb-2"><span>Report File</span></div>
                                            <input 
                                                className="form-control" 
                                                name="report" 
                                                id="report" 
                                                onChange={handleInputChange} 
                                                type="file" 
                                                accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls,.docx,.doc,.txt,.csv"
                                            />
                                            <small className="text-muted">Accepted formats: PDF, JPEG, PNG, Excel (.xlsx, .xls), Word (.docx, .doc), TXT, CSV</small>
                                            {validationErrors.report && <p style={{ color: 'red' }}>{validationErrors.report}</p>}
                                        </div>
                                        <div className="mb-3">
                                            <div className="title mb-2"><span>Date</span></div>
                                            <input className="form-control" name="date" id="date" value={formData.date} onChange={handleInputChange} type="date" />
                                            {validationErrors.date && <p style={{ color: 'red' }}>{validationErrors.date}</p>}
                                        </div>
                                        <div className="mb-3">
                                            <div className="title mb-2"><span>Test Name</span></div>
                                            <input className="form-control" name="test_name" id="test_name" value={formData.test_name} onChange={handleInputChange} type="text" />
                                            {validationErrors.test_name && <p style={{ color: 'red' }}>{validationErrors.test_name}</p>}
                                        </div>
                                        <div className="mb-3">
                                            <div className="title mb-2"><span>Range</span></div>
                                            <input className="form-control" name="range" id="range" value={formData.range} onChange={handleInputChange} type="text" />
                                            {validationErrors.range && <p style={{ color: 'red' }}>{validationErrors.range}</p>}
                                        </div>
                                        <div className="mb-3">
                                            <div className="title mb-2"><span>Actual Range</span></div>
                                            <input className="form-control" name="actual_range" id="actual_range" value={formData.actual_range} onChange={handleInputChange} type="text" />
                                            {validationErrors.actual_range && <p style={{ color: 'red' }}>{validationErrors.actual_range}</p>}
                                        </div>
                                        <div className="mb-3">
                                            <div className="title mb-2"><span>Level</span></div>
                                            <input className="form-control" name="level" id="level" value={formData.level} onChange={handleInputChange} type="text" />
                                            {validationErrors.level && <p style={{ color: 'red' }}>{validationErrors.level}</p>}
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
                <li className="active"><Link to="/lab_home"><i className="lni lni-home"></i>Home</Link></li>
                <li><Logout /></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
  
  );
}
export default PostLabtest;
