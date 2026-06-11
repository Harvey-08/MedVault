import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { saveAs } from 'file-saver';
import Logout from './Logout.jsx'; // Import your Logout component
import Title from './Title.jsx'; // Import Title component if necessary
import "./css/style.css"; // Assuming the necessary CSS imports
import imgDel from "./img/trash.png"; // Image for delete icon
import imgDown from "./img/download.png"; // Image for delete icon
import imgSmall from "./img/core-img/logo-small.png";
import imgBg from "./img/bg-img/9.png";
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

const ViewPatientLabtest = () => {
  const navigate = useNavigate();

  const [labtestData, setLabtestData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetching the lab test data
  useEffect(() => {
    const fetchLabtestData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/labtest/`, {
          headers: {
            'x-auth-token': token
          }
        });
        const data = await response.json();
        setLabtestData(data);
        setFilteredData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching labtest data:', error.message);
        setLoading(false);
      }
    };

    fetchLabtestData();
  }, []);


  const download = (report) => {
    const fileUrl = report.startsWith('http') ? report : `${import.meta.env.VITE_API_URL}/${report}`;
    const fileName = fileUrl.split('/').pop();
    saveAs(fileUrl, fileName);
  };

  // Export data to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text('Patient Lab Tests', 14, 15);
    autoTable(doc, {
      startY: 22,
      head: [['Hospital Email', 'Lab Email', 'Patient Name', 'Test', 'Range', 'Actual Range', 'Level', 'Date']],
      body: filteredData.map(row => [
        row.hospitalemail, row.labemail, row.patient_name, row.test_name,
        row.range, row.actual_range, row.level, row.date
      ]),
      styles: { fontSize: 7 },
      headStyles: { fillColor: [41, 128, 185] },
    });
    doc.save('patient_lab_tests.pdf');
  };

  // Search function
  const handleSearch = (term) => {
    setSearchTerm(term);
    const filtered = labtestData.filter((labtest) =>
      Object.values(labtest).some((field) =>
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
        <div className="container h-100 d-flex align-items-center justify-content-between">

          <div className="header-area" id="headerArea">
            <div className="container h-100 d-flex align-items-center justify-content-between">
              <div className="logo-wrapper" style={{ color: '#020310' }}><img src={imgSmall} alt="" /> <Title /> </div>

              <div className="suha-navbar-toggler" data-bs-toggle="offcanvas" data-bs-target="#suhaOffcanvas" aria-controls="suhaOffcanvas"><span></span><span></span><span></span></div>
            </div>
          </div>

          {/* taprescriptiondex="-1" */}
          <div className="offcanvas offcanvas-start suha-offcanvas-wrap" id="suhaOffcanvas" aria-labelledby="suhaOffcanvasLabel">
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
        </div>
      </div>

      {/* Page Content */}
      <div className="page-content-wrapper">
        <div className="container">
          <h6>View Patient's Lab Reports</h6>

          {/* Search and Export Section */}
          <input
            className="form-control mb-3"
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <button className="btn btn-primary mb-3" onClick={exportToPDF}>Export PDF</button>

          {/* Table Section */}
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Patient Email</th>
                  <th>Hospital Email</th>
                  <th>Patient Name</th>
                  <th>Test</th>
                  <th>Range</th>
                  <th>Actual Range</th>
                  <th>Level</th>
                  <th>Date</th>
                  <th>Download Report</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((labtest, index) => (
                  <tr key={labtest._id}>
                    <td>{index + 1}</td>
                    <td>{labtest.patemail}</td>
                    <td>{labtest.hospitalemail}</td>
                    <td>{labtest.patient_name}</td>
                    <td>{labtest.test_name}</td>
                    <td>{labtest.range}</td>
                    <td>{labtest.actual_range}</td>
                    <td>
                       <span className={getAlertClass(labtest.level, labtest.range, labtest.actual_range)}>
                         {labtest.level}
                       </span>
                     </td>
                    <td>{labtest.date}</td>

                    <td>
                      <a onClick={() => download(labtest.report)}>
                        <img src={imgDown} alt="Delete" />
                      </a>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="footer-nav-area" id="footerNav">
        <div className="container h-100 px-0">
          <div className="suha-footer-nav h-100">
            <ul className="h-100 d-flex align-items-center justify-content-between ps-0">
              <li className="active">
                <Link to="/patient_home">
                  <i className="lni lni-home"></i>Home
                </Link>
              </li>
              <li>
                <Logout /> {/* Logout button */}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPatientLabtest;
