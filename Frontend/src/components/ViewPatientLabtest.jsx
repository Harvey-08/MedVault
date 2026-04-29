import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import Logout from './Logout.jsx'; // Import your Logout component
import Title from './Title.jsx'; // Import Title component if necessary
import "./css/style.css"; // Assuming the necessary CSS imports
import imgDel from "./img/trash.png"; // Image for delete icon
import imgDown from "./img/download.png"; // Image for delete icon
import imgSmall from "./img/core-img/logo-small.png";
import imgBg from "./img/bg-img/9.png";
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
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/labtest/`);
        const data = await response.json();
        const patemail = decodeURIComponent(document.cookie.replace(/(?:(?:^|.*;\s*)patemail\s*=\s*([^;]*).*$)|^.*$/, '$1'));
        const filteredLabtest = data.filter((labtest) => labtest.patemail === patemail);
        setLabtestData(filteredLabtest);
        setFilteredData(filteredLabtest);
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

  // Export data to Excel
  const exportToExcel = () => {
    const csvData = filteredData.map(row => ({
      hospitalemail: row.hospitalemail,
      labemail: row.labemail,
      patient_name: row.patient_name,
      test_name: row.test_name,
      range: row.range,
      actual_range: row.actual_range,
      level: row.level,
      date: row.date,
    }));
    
    const worksheet = XLSX.utils.json_to_sheet(csvData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Lab Tests');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'hospital_tests.xlsx');
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
        <div className="logo-wrapper" style={{color:'#020310'}}><img src={imgSmall} alt=""/> <Title /> </div>
    
        <div className="suha-navbar-toggler" data-bs-toggle="offcanvas" data-bs-target="#suhaOffcanvas" aria-controls="suhaOffcanvas"><span></span><span></span><span></span></div>
    </div>
    </div>  

{/* taprescriptiondex="-1" */}
    <div className="offcanvas offcanvas-start suha-offcanvas-wrap"  id="suhaOffcanvas" aria-labelledby="suhaOffcanvasLabel">
  <button className="btn-close btn-close-white text-reset" type="button" data-bs-dismiss="offcanvas" aria-label="Close"></button>

  <div className="offcanvas-body">
    <div className="sidenav-profile">
      <div className="user-profile"><img src={imgBg} alt=""/></div>
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
          <button className="btn btn-primary mb-3" onClick={exportToExcel}>Export</button>
          
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
                    <td>{labtest.level}</td>
                    <td>{labtest.date}</td>
               
                    <td>
                      <a onClick={() =>  download(labtest.report)}>
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
