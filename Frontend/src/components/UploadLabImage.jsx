import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

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

// name  donarname city password phone  locality address city phone 

const UploadReceiptImage = () => {
  const { id } = useParams(); // Use useParams to get route parameters

  //const id = match.params.id;
  //const [complaintData, setComplaintData] = useState({});

  const [editedReceiptImage, setEditedReceiptImage] = useState({


    image: null // New state to hold the selected image file
  });

  const token = localStorage.getItem('token');


  const handleImageChange = (e) => {
    setEditedReceiptImage({
      ...editedReceiptImage,
      receipt: e.target.files[0]
    });
  };

  const handleUpdateReceiptImage = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('receipt', editedReceiptImage.receipt);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/croprequest/upload_receipt/${id}`, {
        method: 'PUT',
        headers: {
          'x-auth-token': token,
        },
        body: formData,
      });

      if (response.ok) {
        console.log('Receipt Uploaded  Successfully!');
        alert('Receipt Uploaded  Successfully!')
        window.location.href = "/view_my_crop_request";
      } else {
        console.error('Failed to update receipt:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating receipt:', error.message);
    }
  };

  return (
    <div>
      <div>

        <div className="header-area" id="headerArea">
          <div className="container h-100 d-flex align-items-center justify-content-between">

            <div className="header-area" id="headerArea">
              <div className="container h-100 d-flex align-items-center justify-content-between">
                <div className="logo-wrapper" style={{ color: '#020310' }}><img src={imgSmall} alt="" /> <Title /> </div>

                <div className="suha-navbar-toggler" data-bs-toggle="offcanvas" data-bs-target="#suhaOffcanvas" aria-controls="suhaOffcanvas"><span></span><span></span><span></span></div>
              </div>
            </div>

            {/* tabindex="-1" */}
            <div className="offcanvas offcanvas-start suha-offcanvas-wrap" id="suhaOffcanvas" aria-labelledby="suhaOffcanvasLabel">
              <button className="btn-close btn-close-white text-reset" type="button" data-bs-dismiss="offcanvas" aria-label="Close"></button>

              <div className="offcanvas-body">
                <div className="sidenav-profile">
                  <div className="user-profile"><img src={imgBg} alt="" /></div>
                  <div className="user-info">
                    <h6 className="user-name mb-1">Lost& Found Items Finder App</h6>

                  </div>
                </div>

                <ul className="sidenav-nav ps-0">
                  <li><Link to="/buyer_home"><i className="lni lni-home"></i>Home</Link></li>
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
                <h6>Upload Receipt</h6>
              </div>
              {/* Form Scrip Start*/}
              <div className="profile-wrapper-area py-3">
                <div className="card user-data-card">
                  <div className="card-body">
                    <form onSubmit={handleUpdateReceiptImage} autoComplete="off">
                      <div className="mb-3">

                        <div className="mb-3">
                          <div className="title mb-2"><span>Upload Receipt</span></div>
                          <input
                            className="form-control"
                            name="receipt"
                            id="receipt"
                            type="file"
                            onChange={handleImageChange}
                          />
                        </div>
                      </div>


                      <button className="btn btn-success w-100" type="submit">Save</button>
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
                <li className="active"> <Link to="/buyer_home" ><i className="lni lni-home"></i>Home </Link> </li>
                <li><Logout /></li>


              </ul>
            </div>
          </div>
        </div>


      </div>
    </div>
  )
}

export default UploadReceiptImage
