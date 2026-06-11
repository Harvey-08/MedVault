import React, { useState, useEffect } from 'react';
import { Link,useNavigate,useParams } from 'react-router-dom';
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

const MoreInfoPatient = () => {

  const { id } = useParams(); // Use useParams to get route parameters

 
  const [prescriptionData, setPrescriptionData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrescriptionData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/prescription/${id}`, {
          headers: {
            'x-auth-token': token
          }
        });
        if (response.ok) {
          const data = await response.json();
          setPrescriptionData([data]);
          setFilteredData([data]);
        } else {
          console.error('Error fetching prescription:', response.statusText);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching prescription data:', error.message);
        setLoading(false);
      }
    };

    fetchPrescriptionData();
  }, [id]);



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
            <h6 className="user-name mb-1">Hospital Booking App </h6>
         
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
            <h6>View Prescription  details</h6>
			
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

            {/* Show if Null data in table */}
           
            {filteredData.length > 0 ? (
            <div className="row" style={{marginTop:10}}>
            {/* Get Details Map field and id */}          
                {filteredData.map((prescription) => (
              <div key={prescription._id} className="col-12 col-md-6">                                        
              <div className="card product-card" style={{marginBottom:10}}>
                <div className="card-body"    >
             
                      <a className="product-title d-block"  >Patient Name:  <b> {prescription.patient_name} </b></a>
                      <a className="product-title d-block"  >Email:  <b> {prescription.patemail} </b></a>
                      <a className="product-title d-block"  >Hospital Email:  <b> {prescription.hospitalemail} </b></a>
                      <a className="product-title d-block"  >Doctor Name:  <b> {prescription.doctor_name} </b></a>
                      <a className="product-title d-block"  >Findings:  <b> {prescription.findings} </b></a>
                      <a className="product-title d-block"  >Medicine 1:  <b> {prescription.medicine_1} </b></a>
                      <a className="product-title d-block"  >Medicine 2:  <b> {prescription.medicine_2} </b></a>
                      <a className="product-title d-block"  >Medicine 3:  <b> {prescription.medicine_3} </b></a>
                      <a className="product-title d-block"  >Medicine 4:  <b> {prescription.medicine_4} </b></a>
                      <a className="product-title d-block"  >Lab Test:  <b> {prescription.lab_test} </b></a>
             
                      <a className="product-title d-block"  >Notes:  <b> {prescription.notes} </b></a>
                   
                
                    </div>
                  </div>   
                  
                 
            </div>
              ))}

              
        </div>
                  ) : (
                    <p>No prescription details found for the specified vendor email or search term.</p>
            )}

           {/* Show if Null data in table */}

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

export default MoreInfoPatient
