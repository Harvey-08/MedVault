import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { saveAs } from 'file-saver';
import Logout from './Logout.jsx';
import Title from './Title.jsx';
import imgSmall from "./img/core-img/logo-small.png";
import imgBg from "./img/bg-img/9.png";

const ViewPatientHistory = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [timelineData, setTimelineData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchTimelineData = async () => {
      try {
        const { patemail = '' } = location.state || {};
        const token = localStorage.getItem('token');

        // Build URL: if patemail cookie is present (Hospital checking patient history), query it.
        // If not present (Patient checking own history), query without parameter (backend defaults to req.user.email)
        let url = `${import.meta.env.VITE_API_URL}/api/v1/users/timeline`;
        if (patemail) {
          url += `?patientEmail=${patemail}`;
        }

        const response = await fetch(url, {
          headers: {
            'x-auth-token': token
          }
        });

        if (response.ok) {
          const data = await response.json();
          setTimelineData(data);
          setFilteredData(data);
        } else if (response.status === 403) {
          setErrorMsg('Access Denied. You do not have consent to view this patient\'s history.');
        } else {
          setErrorMsg('Failed to load patient history.');
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching timeline:', error);
        setErrorMsg('Error connecting to server.');
        setLoading(false);
      }
    };

    fetchTimelineData();
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);
    const filtered = timelineData.filter((item) =>
      item.title.toLowerCase().includes(term.toLowerCase()) ||
      item.provider.toLowerCase().includes(term.toLowerCase()) ||
      item.type.toLowerCase().includes(term.toLowerCase()) ||
      JSON.stringify(item.details).toLowerCase().includes(term.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const downloadReport = (reportUrl) => {
    const fileUrl = reportUrl.startsWith('http') ? reportUrl : `${import.meta.env.VITE_API_URL}/${reportUrl}`;
    const fileName = fileUrl.split('/').pop();
    saveAs(fileUrl, fileName);
  };

  const getAlertClass = (level, range, actualRange) => {
    if (!level) return '';
    const lowerLevel = level.toLowerCase();
    if (lowerLevel.includes('high') || lowerLevel.includes('low') || lowerLevel.includes('abnormal') || lowerLevel.includes('critical') || lowerLevel.includes('out of range')) {
      return 'badge bg-danger';
    }
    if (range && actualRange) {
      const rangeMatch = range.match(/(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)/);
      const val = parseFloat(actualRange);
      if (rangeMatch && !isNaN(val)) {
        const min = parseFloat(rangeMatch[1]);
        const max = parseFloat(rangeMatch[2]);
        if (val < min || val > max) {
          return 'badge bg-danger';
        }
      }
    }
    if (lowerLevel.includes('normal')) {
      return 'badge bg-success';
    }
    return 'badge bg-secondary';
  };

  const getTypeBadgeClass = (type) => {
    switch (type) {
      case 'Prescription': return 'badge bg-primary';
      case 'Appointment': return 'badge bg-info text-dark';
      case 'Lab Test': return 'badge bg-purple text-white';
      default: return 'badge bg-secondary';
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text('Unified Medical History Timeline', 14, 15);
    
    const bodyData = filteredData.map(item => {
      let desc = '';
      if (item.type === 'Prescription') {
        desc = `Findings: ${item.details.findings}\nMedicines: ${[item.details.medicine_1, item.details.medicine_2, item.details.medicine_3, item.details.medicine_4].filter(Boolean).join(', ')}`;
      } else if (item.type === 'Appointment') {
        desc = `Reason: ${item.details.reason}\nStatus: ${item.details.status}`;
      } else if (item.type === 'Lab Test') {
        desc = `Test: ${item.title}\nLevel: ${item.details.level} (Range: ${item.details.range}, Val: ${item.details.actual_range})`;
      }
      return [
        new Date(item.date).toLocaleDateString('en-GB'),
        item.type,
        item.title,
        item.provider,
        desc
      ];
    });

    autoTable(doc, {
      startY: 22,
      head: [['Date', 'Type', 'Event', 'Provider/Creator', 'Summary/Details']],
      body: bodyData,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185] },
    });
    doc.save('medical_history_timeline.pdf');
  };

  if (loading) {
    return <div className="text-center py-5"><h4>Loading Medical History...</h4></div>;
  }

  // Detect role to redirect back correctly
  const userRole = localStorage.getItem('role') || 'Patient';
  const homeLink = userRole === 'Hospital' ? '/hospital_home' : '/patient_home';

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
            <li><Link to={homeLink}><i className="lni lni-home"></i>Home</Link></li>
            <li><Logout /></li>
          </ul>
        </div>
      </div>

      <div className="page-content-wrapper">
        <div className="container py-3">
          <div className="section-heading d-flex align-items-center justify-content-between mb-3">
            <h6>Patient Medical History Timeline</h6>
          </div>

          <div className="row g-3 mb-3">
            <div className="top-search-form">
              <form onSubmit={(e) => e.preventDefault()}>
                <input
                  className="form-control"
                  type="text"
                  placeholder="Filter timeline details..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </form>
            </div>
          </div>

          <button className="btn btn-primary mb-3" onClick={exportToPDF}>Export PDF</button>

          {errorMsg ? (
            <div className="alert alert-warning text-center mt-3">{errorMsg}</div>
          ) : filteredData.length === 0 ? (
            <div className="text-center py-5">No records found.</div>
          ) : (
            <div className="timeline-container" style={{ position: 'relative', paddingLeft: '30px' }}>
              {/* Timeline line */}
              <div style={{
                position: 'absolute',
                left: '10px',
                top: '10px',
                bottom: '10px',
                width: '3px',
                backgroundColor: '#00b894'
              }}></div>

              {filteredData.map((item) => (
                <div key={item.id} className="mb-4" style={{ position: 'relative' }}>
                  {/* Timeline dot */}
                  <div style={{
                    position: 'absolute',
                    left: '-26px',
                    top: '8px',
                    width: '15px',
                    height: '15px',
                    borderRadius: '50%',
                    backgroundColor: '#00b894',
                    border: '3px solid #fff',
                    boxShadow: '0 0 5px rgba(0,0,0,0.2)'
                  }}></div>

                  <div className="card shadow-sm border-0" style={{ borderRadius: '12px', background: '#fff', padding: '20px' }}>
                    <div className="card-body p-0">
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <span className={getTypeBadgeClass(item.type)} style={{ padding: '4px 8px', borderRadius: '4px' }}>{item.type}</span>
                        <small className="text-muted">{new Date(item.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</small>
                      </div>

                      <h6 className="card-title mb-1" style={{ fontWeight: '600', color: '#2d3436' }}>{item.title}</h6>
                      <p className="text-muted mb-2" style={{ fontSize: '12px' }}>Provider: {item.provider}</p>

                      {/* Details based on type */}
                      {item.type === 'Prescription' && (
                        <div style={{ fontSize: '13px' }}>
                          <p className="mb-1"><b>Findings:</b> {item.details.findings}</p>
                          <p className="mb-1">
                            <b>Medicines:</b> {[
                              item.details.medicine_1,
                              item.details.medicine_2,
                              item.details.medicine_3,
                              item.details.medicine_4
                            ].filter(Boolean).join(', ')}
                          </p>
                          {item.details.lab_test && <p className="mb-1"><b>Recommended Lab Test:</b> {item.details.lab_test}</p>}
                          {item.details.notes && <p className="mb-1 text-muted"><i>Notes: {item.details.notes}</i></p>}
                          <p className="mb-0 mt-2">Status: <span className="badge bg-success">{item.details.status}</span></p>
                        </div>
                      )}

                      {item.type === 'Appointment' && (
                        <div style={{ fontSize: '13px' }}>
                          <p className="mb-1"><b>Reason for Visit:</b> {item.details.reason}</p>
                          <p className="mb-1"><b>Timeslot:</b> {item.details.timeslot}</p>
                          <p className="mb-0 mt-2">Status: <span className="badge bg-info text-dark">{item.details.status}</span></p>
                        </div>
                      )}

                      {item.type === 'Lab Test' && (
                        <div style={{ fontSize: '13px' }}>
                          <p className="mb-1"><b>Reference Range:</b> {item.details.range}</p>
                          <p className="mb-1"><b>Actual Value:</b> {item.details.actual_range}</p>
                          <p className="mb-2">
                            <b>Level:</b>{' '}
                            <span className={getAlertClass(item.details.level, item.details.range, item.details.actual_range)}>
                              {item.details.level}
                            </span>
                          </p>
                          {item.details.report && (
                            <button 
                              className="btn btn-sm btn-outline-primary mt-1"
                              onClick={() => downloadReport(item.details.report)}
                            >
                              Download Lab Report File
                            </button>
                          )}
                        </div>
                      )}

                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="footer-nav-area" id="footerNav">
        <div className="container h-100 px-0">
          <div className="suha-footer-nav h-100">
            <ul className="h-100 d-flex align-items-center justify-content-between ps-0">
              <li className="active">
                <Link to={homeLink}><i className="lni lni-home"></i>Home</Link>
              </li>
              <li><Logout /></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPatientHistory;
