import React, { useState, useEffect } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import "./css/bootstrap.min.css";
import "./css/owl.carousel.min.css";
import "./css/font-awesome.min.css";
import "./css/animate.css";
import "./css/font-awesome.min.css";
import "./css/lineicons.min.css";
import "./css/magnific-popup.css";
import "./css/style.css";
import "./css/Table.css";
import * as XLSX from 'xlsx';
import "./js/jquery.min.js";  
import "./js/bootstrap.bundle.min.js";
import imgUp from "./img/upload.png";
import imgDel from "./img/trash.png";
import imgSmall from "./img/core-img/logo-small.png";
import imgBg from "./img/bg-img/9.png";
import Logout from './Logout.jsx';
import Title from './Title.jsx';
import { saveAs } from 'file-saver';

const ViewAllPrescription = () => {
  
  const navigate = useNavigate();

  const Removefunction = (id) => {
    if (window.confirm('Do you want to remove?')) {
      const token = localStorage.getItem('token');

        fetch(`${import.meta.env.VITE_API_URL}/api/v1/prescription/` + id, {
            method: "DELETE",
            headers: {
              'Content-Type': 'application/json',
         
            },
        }).then((res) => {
          //  alert('Removed successfully.')
            window.location.reload();
        }).catch((err) => {
            console.log(err.message)
        })
    }
}

const MoreInfo = (id) => {
  navigate("/more_info/" + id);
}


const setCookie = (name, value, days) => {
  let expires = '';
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = `; expires=${date.toUTCString()}`;
  }
  document.cookie = `${name}=${value || ''}${expires}; path=/`;
};

const labreport = (patemail,hospitalemail,patient_name) => {
  // Set a cookie for the hospital's email
  setCookie('patemail', patemail, 7);
  setCookie('hospitalemail', hospitalemail, 7);
  setCookie('patient_name', patient_name, 7);
  // Navigate to the appointment booking page
  navigate("/post_labtest/");
}


  const [prescriptionData, setPrescriptionData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchPrescriptionData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/prescription/`);
        const data = await response.json();

        const hospitalemail = decodeURIComponent(document.cookie.replace(/(?:(?:^|.*;\s*)hospitalemail\s*=\s*([^;]*).*$)|^.*$/, '$1'));
        // Filter billing data based on adminemail
        const filteredPrescription = data.filter((prescription) => prescription.hospitalemail === hospitalemail);
        setPrescriptionData(filteredPrescription);
         setFilteredData(filteredPrescription);
         setLoading(false);
        } catch (error) {
          console.error('Error fetching prescription data:', error.message);
          setLoading(false);
        }
    };

    fetchPrescriptionData();
  }, []);

  const exportToExcel = () => {
    const csvData = filteredData.map(row => ({

      patientname:row.patient_name,
      patientemail:row.patemail,
      doctorname:row.doctor_name,
      findings: row.findings,
      medicine1: row.medicine_1,
      medicine2: row.medicine_2,
      medicine3: row.medicine_3,
      medicine4: row.medicine_4,
      notes: row.notes
    }));

  
    // Convert JSON data to worksheet
    const worksheet = XLSX.utils.json_to_sheet(csvData);
    // Create a new workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    // Generate a buffer
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    // Convert buffer to Blob and trigger download
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'table_data.xlsx');
  };



  // Filter data based on the search term
  const handleSearch = (term) => {
    setSearchTerm(term);
    const filtered = prescriptionData.filter((prescription) =>
      Object.values(prescription).some((field) =>
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
          <li><Link to="/lab_home"><i className="lni lni-home"></i>Home</Link></li>
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
            <h6>View Patient's Lab Details</h6>
			
          </div>
          <div className="row g-3" >
              <div className="top-search-form">
                <form>

                  <input className="form-control"  type="text"  placeholder="Search..."     value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}  />
                  <button type="submit"><i className="fa fa-search"></i></button>                
                </form>
              </div>
            </div>
       
            <button onClick={exportToExcel}>Export</button>
             
                <div class="row" id='printablediv'>
                <div className="table-responsive mt-8">
  <table id="tblData" className="table table-hover">
    <thead className="bg-light text-center">
    <tr>
    <th scope="col" >S.No</th>
  
      <th scope="col" >Patient Name</th>
      <th scope="col" >Patient Email</th>
      <th scope="col" >Hospital Email</th>
      <th scope="col" >Doctor Name</th>
  
      <th scope="col" >Findings</th>
      <th scope="col" >Lab Test</th>
   
    
    
      <th scope="col">Upload Lab Report</th>
    
      
    </tr>
  </thead>
  <tbody className="text-center">
    {filteredData.map((prescription, index) => (
      <tr key={prescription._id}>
        <td>{index + 1}</td>
        <td>{prescription.patient_name}</td>
        <td>{prescription.patemail}</td>
        <td>{prescription.hospitalemail}</td>
        <td>{prescription.doctor_name}</td>
      
        <td>{prescription.findings}</td>
     <td>{prescription.lab_test}</td>
  
    
      
       <td>
          <a onClick={() => labreport(prescription.patemail,prescription.hospitalemail,prescription.patient_name)}>
            <img src={imgUp} alt="Edit" />
          </a>
        </td>
    
     
      </tr>
    ))}
   
    </tbody>
  </table>
</div>

    </div>          

   
          

        </div>
    </div>


            
            <div className="footer-nav-area" id="footerNav">
              <div className="container h-100 px-0">
                <div className="suha-footer-nav h-100">
                  <ul className="h-100 d-flex align-items-center justify-content-between ps-0">
                    <li className="active"> <Link to="/lab_home" ><i className="lni lni-home"></i>Home </Link> </li>
                    <li><Logout /></li> 
                  </ul>
                </div>
              </div>
            </div>



</div>


</div>
</div>
  )
}

export default ViewAllPrescription
