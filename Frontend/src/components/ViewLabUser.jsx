import React, { useState, useEffect } from 'react';
import { Link , useNavigate} from 'react-router-dom';
import axios from 'axios';
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

const ViewLabUser= () => {
  
  

  const [profileData, setProfileData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const Removefunction = (id) => {
    if (window.confirm('Do you want to remove?')) {
      const token = localStorage.getItem('token');
      fetch(`${import.meta.env.VITE_API_URL}/api/v1/users/${id}`, {
        method: "DELETE",
        headers: { 
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
      }).then((res) => {
        // Refresh data instead of reloading the page
        setProfileData((prevData) => prevData.filter(item => item._id !== id));
        window.location.reload();
      }).catch((err) => {
        console.log(err.message);
      });
    }
  };

const LoadEdit = (id) => {
  navigate("/update_labuser/" + id);
}

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/users/`, {
          headers: {
            'x-auth-token': token
          }
        });
        const data = await response.json();

        // Get the logged-in hospital's email from localStorage
        const hospitalemail = localStorage.getItem('email') || '';
        
        // Filter lab users by role AND hospitalemail
        const filteredUser = data.filter((user) => user.role === 'Lab' && user.hospitalemail === hospitalemail);
        setProfileData(filteredUser);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching profile data:', error.message);
        setLoading(false);
      }
     
    };

    fetchProfileData();
  }, []);

   // Filter data based on the search term
   const filteredData = profileData.filter((user) =>{ 
        const isMatch = Object.values(user).some((field) =>
     field.toString().toLowerCase().includes(searchTerm.toLowerCase() )
     );

    // Add an additional condition to filter based on "Approved" status
    //const isApproved = user.status.toLowerCase() === 'approved';

    return isMatch;
  });  

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
            <h6 className="user-name mb-1">Hospital Booking App</h6>
         
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
            <h6>View Lab Users Details</h6>
			
          </div>
          <div className="row g-3" >
              <div className="top-search-form">
                <form>
                  <input className="form-control"  type="text"  placeholder="Search..."     value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}  />
                  <button type="submit"><i className="fa fa-search"></i></button>
                </form>
              </div>
            </div>

            <div className="row" style={{marginTop:10}}>
                {filteredData.map((user) => (
              <div key={user._id} className="col-12 col-md-6">                                        
        
              <div className="card product-card" style={{marginBottom:10}}>
                <div className="card-body"    >
                      <a className="product-title d-block"  >Name:  <b> {user.name} </b></a>
                      <a className="product-title d-block"  >Email: {user.email} </a>
                      <a className="product-title d-block"  >Mobile: {user.phone}  </a>
                      <a className="product-title d-block"  >City: {user.city}  </a>
                      <a className="product-title d-block"  >Role: {user.role}  </a>
                    </div>
                  </div>   
             
            
                  <a className="btn btn-danger" onClick={() => { LoadEdit(user._id) }}>Edit</a>
                  <a className="btn btn-danger" onClick={() => { Removefunction(user._id) }}>Delete</a>
              </div>


              ))}
              
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
</div>
  )
}

export default ViewLabUser
