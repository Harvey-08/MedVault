import React, { useState,useEffect } from 'react';
import { Link ,useParams} from 'react-router-dom';

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

// name  vendorname mechanicname service available  locality address city mobile 

const UpdatePrescription = () => {
  const { id } = useParams(); // Use useParams to get route parameters

  //const id = match.params.id;
  //const [donationData, setDonationData] = useState({});
  
  const [editedPrescription, setEditedPrescription] = useState({
    patemail: '',
    hospitalemail: '',
    doctor_name:'',
    patient_name: '',
    findings: '',
    medicine_1: '',
    medicine_2: '',
    medicine_3: '',
    medicine_4: '',
    lab_test: '',
    notes: '',
  

  });
  
  useEffect(() => {
    const fetchPrescriptionDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/prescription/${id}`, {
          headers: {
            'x-auth-token': token
          }
        });
        if (response.ok) {
          const data = await response.json();
          setEditedPrescription({
            patemail: data.patemail  ,
            hospitalemail: data.hospitalemail  ,
            doctor_name: data.doctor_name  ,
            patient_name: data.patient_name  ,
            findings: data.findings  ,
            medicine_1: data.medicine_1  ,
            medicine_2: data.medicine_2  ,
            medicine_3: data.medicine_3  ,
            medicine_4: data.medicine_4  ,
            lab_test: data.lab_test  ,
            notes: data.notes  ,
          });
        }else {
          console.error('Error fetching prescription data:', response.statusText);
        } 
      } catch (error) {
        console.error('Error fetching prescription data:', error.message);
      }
    };

    fetchPrescriptionDetails();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value} = e.target;

   
      // For other input types, update the state with the input value
      setEditedPrescription({
        ...editedPrescription,
        [name]: value,
      });
    
  
};

// Ctegory =
  const handleUpdatePrescription  = async (e) =>  {
    e.preventDefault();
    const token = localStorage.getItem('token');
  
    try {

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/prescription/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(editedPrescription),
      });
    
      if (response.ok) {
        console.log('Prescription Updated successfully!');
        // Handle success, e.g., redirect to another page
        alert('Update Successful');
        window.location.href = '/view_prescription';
      } else {
        const errorData = await response.json();
        alert(errorData.error || errorData.message || 'Error updating prescription.');
      }
    } catch (error) {
      console.error('Error posting item data:', error.message);
      alert('Error: ' + error.message);
    }
  };


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

{/* tabindex="-1" */}
        <div className="offcanvas offcanvas-start suha-offcanvas-wrap"  id="suhaOffcanvas" aria-labelledby="suhaOffcanvasLabel">
      <button className="btn-close btn-close-white text-reset" type="button" data-bs-dismiss="offcanvas" aria-label="Close"></button>

      <div className="offcanvas-body">
        <div className="sidenav-profile">
          <div className="user-profile"><img src={imgBg} alt=""/></div>
          <div className="user-info">
            <h6 className="user-name mb-1">Hospital Booking App
            </h6>
         
          </div>
        </div>
    
        <ul className="sidenav-nav ps-0">
          <li><Link to="hospital_home"><i className="lni lni-home"></i>Home</Link></li>
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
            <h6>Update Prescription</h6>
          </div>
        {/* Form Scrip Start*/}
        <div className="profile-wrapper-area py-3">
          <div className="card user-data-card">
            <div className="card-body">
            <form onSubmit={handleUpdatePrescription} autoComplete="off">
          
            <div className="mb-3">
                      <div className="title mb-2"><span>Patient Email</span></div>
                      <input className="form-control" name="patemail" id="patemail" value={editedPrescription.patemail} onChange={handleInputChange} type="text" readOnly/>
                     
                    </div>
                    <div className="mb-3">
                      <div className="title mb-2"><span>Patient Name</span></div>
                      <input className="form-control" name="patient_name" id="patient_name" value={editedPrescription.patient_name} onChange={handleInputChange} type="text" readOnly/>
                     
                    </div>
                 
                    
                    <div className="mb-3">
                      <div className="title mb-2"><span>Findings</span></div>
                      <input className="form-control" name="findings" id="findings" value={editedPrescription.findings} onChange={handleInputChange} type="text" />
                    </div>
                    <div className="mb-3">
                      <div className="title mb-2"><span>Medicine 1</span></div>
                      <input className="form-control" name="medicine_1" id="medicine_1" value={editedPrescription.medicine_1} onChange={handleInputChange} type="text" />
                   </div>
                    <div className="mb-3">
                      <div className="title mb-2"><span>Medicine 2</span></div>
                      <input className="form-control" name="medicine_2" id="medicine_2" value={editedPrescription.medicine_2} onChange={handleInputChange} type="text" />
                    </div>
                    <div className="mb-3">
                      <div className="title mb-2"><span>Medicine 3</span></div>
                      <input className="form-control" name="medicine_3" id="medicine_3" value={editedPrescription.medicine_3} onChange={handleInputChange} type="text" />
                    </div>
                    <div className="mb-3">
                      <div className="title mb-2"><span>Medicine 4</span></div>
                      <input className="form-control" name="medicine_4" id="medicine_4" value={editedPrescription.medicine_4} onChange={handleInputChange} type="text" />
                    </div>
                    <div className="mb-3">
                      <div className="title mb-2"><span>Lab Test</span></div>
                      <input className="form-control" name="lab_test" id="lab_test" value={editedPrescription.lab_test} onChange={handleInputChange} type="text" />
                    </div>
                    <div className="mb-3">
                      <div className="title mb-2"><span>Notes</span></div>
                      <textarea className="form-control" name="notes" id="notes" value={editedPrescription.notes} onChange={handleInputChange} type="text" >
                        </textarea>
                    </div>
                    <button className="btn btn-success w-100" type="submit">Submit</button>
                  </form>
           
            </div>
          </div>
        </div>
        {/* Form Scrip End
        */}



        </div>
      </div>
    </div>
            
            <div className="footer-nav-area" id="footerNav">
              <div className="container h-100 px-0">
                <div className="suha-footer-nav h-100">
                  <ul className="h-100 d-flex align-items-center justify-content-between ps-0">
                    <li className="active"> <Link to="/hospital_home" ><i className="lni lni-home"></i>Home </Link> </li>
                    <li><Logout /></li> 
                    
                
                  </ul>
                </div>
              </div>
            </div>


</div>
</div>
  )
}


export default UpdatePrescription
