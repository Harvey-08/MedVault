import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
{/*
import "./js/waypoints.min.js";
import "./js/jquery.easing.min.js";
import "./js/owl.carousel.min.js";
import "./js/jquery.magnific-popup.min.js";
*/}
import imgSmall from "./img/core-img/logo-small.png";
import imgBg from "./img/bg-img/9.png";
import imgMech from "./img/mechanic.png";
import imgClip from "./img/healthcare.png";
import imgRequest from "./img/destination.png";
import imgProfile from "./img/man.png";
import Logout from './Logout.jsx';
import Title from './Title.jsx';
import imgPfl from "./img/pfl.png";
const AdminHome = () => {
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
            <h6>Admin Home</h6>
          </div>
         
          <div className="row g-3">
            <div className="col-6 col-md-12">
              <div className="card horizontal-product-card">
                <div className="card-body d-flex align-items-center">
                  <div className="card-body"><img src={imgClip} className="img-fluid" style={{width:64, height:64}} />&nbsp;&nbsp;
                  <Link  className="text-success" to="/view_hospital_admin">
                  View Hospital For Approval </Link> 
                    </div>
                </div>
              </div>
            </div>
            </div>
         
          <div className="row g-3">
            <div className="col-6 col-md-12">
              <div className="card horizontal-product-card">
                <div className="card-body d-flex align-items-center">
                  <div className="card-body"><img src={imgPfl} className="img-fluid" style={{width:64, height:64}} />
                  <Link  className="text-success" to="/view_user_admin">
                   View Patient / Lab User Details  </Link> 
                    </div>
                </div>
              </div>
            </div>
            </div>
            <div className="row g-3">
            <div className="col-6 col-md-12">
              <div className="card horizontal-product-card">
                <div className="card-body d-flex align-items-center">
                  <div className="card-body"><img src={imgProfile} className="img-fluid" style={{width:64, height:64}} />
                  <Link  className="text-success" to="/admin_profile">
                  My Profile  </Link> 
                    </div>
                </div>
              </div>
            </div>
            </div>
      

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

export default AdminHome
