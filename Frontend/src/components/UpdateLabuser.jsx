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

// name  vendorname city password phone  locality address city phone 

const UpdateLabuser = () => {
  const { id } = useParams(); // Use useParams to get route parameters

  //const id = match.params.id;
  //const [businessData, setLabData] = useState({});
  
  const [editedLab, setEditedLab] = useState({
    name: '',
    email: '',
    password: '',
    city: '',
    phone: '',
   
    
  });
  
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchLabDetails = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/users/${id}`);
        if (response.ok) {
          const data = await response.json();
          setEditedLab({
            name: data.name  ,
            email: data.email  ,
            password: data.password ,
            city: data.city ,         
            phone: data.phone ,
            role: data.role ,
            question1: data.question1 ,
            question2: data.question2 ,
            status:data.status,
          
          });
        }else {
          console.error('Error fetching Lab data:', response.statusText);
        } 
      } catch (error) {
        console.error('Error fetching Lab data:', error.message);
      }
    };

    fetchLabDetails();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedLab({
      ...editedLab,
      [name]: value,
    });
  };

  const handleUpdateLab  = async (e) =>  {
    e.preventDefault();
    try {

      // Mobile number validation
      if (!/^\d{10}$/.test(editedLab.phone)) {
        console.error('Mobile number must be a 10-digit number');
        //errors.phone = 'Phone must be a 10-digit number';
        alert('Mobile number must be a 10-digit number');
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        //  'x-auth-token': token,
        },
        body: JSON.stringify(editedLab),
      });

      if (response.ok) {
        console.log('user details updated successfully!');
        // Add any additional logic you need after a successful update
        window.location.href = "/view_lab_user";

      } else {
        console.error('Not updating Lab details:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating Lab details:', error.message);
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
          <li><Link to="/hospital_home"><i className="lni lni-home"></i>Home</Link></li>
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
          <div className="card user-data-card">
            <div className="card-body">
              <form onSubmit={handleUpdateLab}  autoComplete="off">
              <div className="mb-3">
                  <div className="title mb-2"><span>Name</span></div>
                  <input className="form-control"
                    name="name" id="name"
                    value={editedLab.name}
                    onChange={handleInputChange}    type="text"  />
                </div>
              <div className="mb-3">
                  <div className="title mb-2"><span>Email</span></div>
                  <input className="form-control"
                    name="email" id="email"
                    value={editedLab.email}
                    onChange={handleInputChange}    type="text" disabled  />
                </div>
                
	  			 <div className="mb-3">
                    <div className="title mb-2"><span>Password - Leave Blank if no changes</span></div>
                  <input className="form-control" name="password" id="password"
                    value={editedLab.password}
                    onChange={handleInputChange}   type="text" placeholder=''/>
                </div>
              
                <div className="mb-3">
                  <div className="title mb-2"><span>City</span></div>
                  <input className="form-control" name="city" id="city"
                    value={editedLab.city}
                    onChange={handleInputChange}   type="text"/>
                </div>


            
	    			 <div className="mb-3">
                  <div className="title mb-2"><span>Phone</span></div>
                  <input className="form-control" name="phone" id="phone"
                    value={editedLab.phone}
                    onChange={handleInputChange}   type="text" />
                </div>
            
  
                <button  className="btn btn-success w-100"  type="submit">Submit</button>
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

export default UpdateLabuser
