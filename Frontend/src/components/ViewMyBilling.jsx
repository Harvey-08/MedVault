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
import imgEdit from "./img/pen.png";
import imgDel from "./img/trash.png";
import imgSmall from "./img/core-img/logo-small.png";
import imgBg from "./img/bg-img/9.png";
import Logout from './Logout.jsx';
import Title from './Title.jsx';
import { saveAs } from 'file-saver';

const ViewMyBilling = () => {
  
  const [billingData, setBillingData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBillingData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/billing/`);
        const data = await response.json();

        // Assuming 'adminemail' is the key in cookies
        const patemail = decodeURIComponent(document.cookie.replace(/(?:(?:^|.*;\s*)patemail\s*=\s*([^;]*).*$)|^.*$/, '$1'));
         // Filter billing data based on adminemail
         const filteredBilling = data.filter((billing) => billing.patemail === patemail);
         setBillingData(filteredBilling);
         setFilteredData(filteredBilling);
         setLoading(false);
      } catch (error) {
        console.error('Error fetching billing data:', error.message);
        setLoading(false);
      }
    };

    fetchBillingData();
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
    const filtered = billingData.filter((billing) =>
      Object.values(billing).some((field) =>
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

{/* tabillingdex="-1" */}
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
    <div className="page-content-wrapper">
      <div className="top-products-area py-3">
        <div className="container">
          
        <div className="section-heading d-flex align-items-center justify-content-between">
            <h6>View Billing details</h6>
			
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
   
      <th scope="col" >Amount</th>
      <th scope="col" >Amount Paid</th>
      <th scope="col" >Balance</th>
   
      
      
    </tr>
  </thead>
  <tbody className="text-center">
    {filteredData.map((billing, index) => (
      <tr key={billing._id}>
        <td>{index + 1}</td>
        <td>{billing.patient_name}</td>
      
        <td>{billing.patemail}</td>
     <td>{billing.hospitalemail}</td>
     <td>{billing.amount}</td>
     <td>{billing.amount_paid}</td>
     <td>{billing.balance}</td>
  
  
    
     
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
                    <li className="active"> <Link to="/patient_home" ><i className="lni lni-home"></i>Home </Link> </li>
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

export default ViewMyBilling
