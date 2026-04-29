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

// name  adminname city password phone  locality address city phone 

const EditAdminProfile = () => {
  const { id } = useParams(); // Use useParams to get route parameters

  //const id = match.params.id;
  //const [contactData, setContactData] = useState({});
 
  const [editedContact, setEditedContact] = useState({
    email: '',
    password: '',
    mobile: '',
    
  });
  
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchContactDetails = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/users/${id}`);
        if (response.ok) {
          const data = await response.json();
          setEditedContact({
           
            email: data.email  ,
            password: data.password ,
            mobile: data.mobile ,         
          
          });
        }else {
          console.error('Error fetching Admin data:', response.statusText);
        } 
      } catch (error) {
        console.error('Error fetching Admin data:', error.message);
      }
    };

    fetchContactDetails();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedContact({
      ...editedContact,
      [name]: value,
    });
  };

  const handleUpdateContact  = async (e) =>  {
    e.preventDefault();
    try {

      // Mobile number validation
      if (!/^\d{10}$/.test(editedContact.mobile)) {
        console.error('Mobile number must be a 10-digit number');
        //errors.phone = 'Phone must be a 10-digit number';
        alert('Mobile number must be a 10-digit number');
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/users/admin/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        //  'x-auth-token': token,
        },
        body: JSON.stringify(editedContact),
      });

      if (response.ok) {
        console.log('Admin details updated successfully!');
        // Add any additional logic you need after a successful update
        window.location.href = "/admin_profile";

      } else {
        console.error('Not updating Admin details:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating Admin details:', error.message);
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

{/* tacontactdex="-1" */}
        <div className="offcanvas offcanvas-start suha-offcanvas-wrap"  id="suhaOffcanvas" aria-labelledby="suhaOffcanvasLabel">
      <button className="btn-close btn-close-white text-reset" type="button" data-bs-dismiss="offcanvas" aria-label="Close"></button>

      <div className="offcanvas-body">
        <div className="sidenav-profile">
          <div className="admin-profile"><img src={imgBg} alt=""/></div>
          <div className="admin-info">
            <h6 className="admin-name mb-1">Hospital Booking App</h6>
         
          </div>
        </div>
    
        <ul className="sidenav-nav ps-0">
          <li><Link to="/admin_home"><i className="lni lni-home"></i>Home</Link></li>
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
            <h6>Edit Profile</h6>
          </div>
        {/* Form Scrip Start*/}
        <div className="profile-wrapper-area py-3">
          <div className="card admin-data-card">
            <div className="card-body">
              <form onSubmit={handleUpdateContact}  autoComplete="off">
              
              <div className="mb-3">
                  <div className="title mb-2"><span>Email</span></div>
                  <input className="form-control"
                    name="email" id="email"
                    value={editedContact.email}
                    onChange={handleInputChange}    type="text" readOnly  />
                </div>
                
	  			 <div className="mb-3">
                    <div className="title mb-2"><span>Password - Leave Blank if no changes</span></div>
                  <input className="form-control" name="password" id="password"
                    value={editedContact.password}
                    onChange={handleInputChange}   type="password" autoComplete="new-password" placeholder=''/>
                </div>
              
                <div className="mb-3">
                  <div className="title mb-2"><span>Mobile</span></div>
                  <input className="form-control" name="mobile" id="mobile"
                    value={editedContact.mobile}
                    onChange={handleInputChange}   type="text" />
                </div>
            
	    		
  
                <button  className="btn btn-success w-100"  type="submit">Save</button>
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
                    <li className="active"> <Link to="/admin_home" ><i className="lni lni-home"></i>Home </Link> </li>
                    <li><Logout /></li> 
                    
                
                  </ul>
                </div>
              </div>
            </div>


</div>
</div>
  )
}

export default EditAdminProfile
