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

const UpdateHospital = () => {
  const { id } = useParams(); // Use useParams to get route parameters

  //const id = match.params.id;
  //const [donationData, setDonationData] = useState({});
  
  const [editedHospital, setEditedHospital] = useState({
     
    hospitalemail:  '',
    name:  '',
    doctor_name:  '',
    speciality:  '',
    timing:  '',
    mobile:  '',
    address:  '',
    city:  '',
    
  

  });
  
  
  useEffect(() => {
    const fetchHospitalDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/hospital/${id}`, {
          headers: {
            'x-auth-token': token
          }
        });
        if (response.ok) {
          const data = await response.json();
          setEditedHospital({
              hospitalemail: data.hospitalemail  ,
            name: data.name  ,
            doctor_name: data.doctor_name ,      
            address:data.address,  
            mobile: data.mobile,
            speciality:data.speciality,
            timing:data.timing,
            city:data.city,
          });
        }else {
          console.error('Error fetching item data:', response.statusText);
        } 
      } catch (error) {
        console.error('Error fetching item data:', error.message);
      }
    };

    fetchHospitalDetails();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value} = e.target;

   
      // For other input types, update the state with the input value
      setEditedHospital({
        ...editedHospital,
        [name]: value,
      });
    
  
};

// Ctegory =
  const handleUpdateHospital  = async (e) =>  {
    e.preventDefault();
  
    try {

      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/hospital/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify(editedHospital),
      });
    
      if (response.ok) {
        console.log('Hospital Updated successfully!');
        // Handle success, e.g., redirect to another page
        alert('Update Successful');
        window.location.href = '/view_my_hospital';
      } else {
        console.error('Error posting item data:', response.statusText);
      }
    } catch (error) {
      console.error('Error posting item data:', error.message);
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
            <h6>Update Hospital</h6>
          </div>
        {/* Form Scrip Start*/}
        <div className="profile-wrapper-area py-3">
          <div className="card user-data-card">
            <div className="card-body">
            <form onSubmit={handleUpdateHospital} autoComplete="off">
                
                    <div className="mb-3">
                      <div className="title mb-2"><span>Hospital Name</span></div>
                      <input className="form-control" name="name" id="name" value={editedHospital.name} onChange={handleInputChange} type="text" />
                      </div>
                   
                    <div className="mb-3">
                      <div className="title mb-2"><span>Doctor Name</span></div>
                      <input className="form-control" name="doctor_name" id="doctor_name" value={editedHospital.doctor_name} onChange={handleInputChange} type="text" />
                    </div>
                 
                    <div className="mb-3">
                      <div className="title mb-2"><span>Speciality</span></div>
                      <input className="form-control" name="speciality" id="speciality" value={editedHospital.speciality} onChange={handleInputChange} type="text" />
                    </div>
                    <div className="mb-3">
                      <div className="title mb-2"><span>Timing</span></div>
                      <input className="form-control" name="timing" id="timing" value={editedHospital.timing} onChange={handleInputChange} type="text" />
                    </div>
                    <div className="mb-3">
                      <div className="title mb-2"><span>Address</span></div>
                      <input className="form-control" name="address" id="address" value={editedHospital.address} onChange={handleInputChange} type="text" />
                    </div>
                    <div className="mb-3">
                      <div className="title mb-2"><span>City</span></div>
                      <input className="form-control" name="address" id="city" value={editedHospital.city} onChange={handleInputChange} type="text" />
                    </div>
                    <div className="mb-3">
                      <div className="title mb-2"><span>Mobile</span></div>
                      <input className="form-control" name="mobile" id="mobile" value={editedHospital.mobile} onChange={handleInputChange} type="text" />
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


export default UpdateHospital
