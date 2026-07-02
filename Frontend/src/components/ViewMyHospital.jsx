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

import "./js/jquery.min.js";  
import "./js/bootstrap.bundle.min.js";

import imgSmall from "./img/core-img/logo-small.png";
import imgBg from "./img/bg-img/9.png";
import Logout from './Logout.jsx';
import Title from './Title.jsx';

const ViewMyHospital = () => {


  ////////////////////////////////////////////////
  //////////////Navgation Code Start//////////////
  ////////////////////////////////////////////////
  
  const [hospitalId, setHospitalId] = useState(''); // Set the initial value accordingly
  // Function to get hospital location and update on the server
  const getUserLocation = async () => {
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
          console.log(`ID: ${hospitalId}`);
          updateLocationOnServer(latitude, longitude);
        },
        (error) => {
          console.error(`Error getting hospital location: ${error.message}`);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };
   // Update location on the server
   async function updateLocationOnServer(latitude, longitude) {
  //  const hospitalId = "6576e6dcfa3350243c6af5b3"; // Replace with the actual hospital ID
    const url = `${import.meta.env.VITE_API_URL}/api/v1/hospital/map/` + hospitalId;
  
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          'x-auth-token': token,
        },
        body: JSON.stringify({
          lat: latitude,
          long: longitude,
        }),
      });
  
      if (response.ok) {
        alert("Location updated successfully!");
        console.log("Location updated successfully!");
        window.location.reload();
      } else {
        console.error(`Error updating location: ${response.statusText}`);
      }
    } catch (error) {
      console.error(`Error updating location: ${error.message}`);
    }
  }
  // Trigger getUserLocation when hospitalId changes
  useEffect(() => {
    if (hospitalId) {
      getUserLocation();
    }
  }, [hospitalId]);

  ////////////////////////////////////////////////
  //////////////Navgation Code End ///////////////
  ////////////////////////////////////////////////

  ////////////////////////////////////////////////
  //////////////Update Delete Code ///////////////
  ////////////////////////////////////////////////

  const navigate = useNavigate();

  const Removefunction = (id) => {
    if (window.confirm('Do you want to remove?')) {
      const token = localStorage.getItem('token');
      fetch(`${import.meta.env.VITE_API_URL}/api/v1/hospital/${id}`, {
        method: "DELETE",
        headers: { 
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
      }).then((res) => {
        // Refresh data instead of reloading the page
        setHospitalId((prevData) => prevData.filter(item => item._id !== id));
        setFilteredData((prevData) => prevData.filter(item => item._id !== id));
        window.location.reload();
      }).catch((err) => {
        console.log(err.message);
      });
    }
  };

const LoadEdit = (id) => {
  navigate("/update_hospital/" + id);
}

  const [hospitalData, setHospitalData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHospitalData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/hospital/my-hospital`, {
          headers: {
            'x-auth-token': token
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setHospitalData([data]);
          setFilteredData([data]);
        } else {
          setHospitalData([]);
          setFilteredData([]);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching hospital data:', error.message);
        setHospitalData([]);
        setFilteredData([]);
        setLoading(false);
      }
    };

    fetchHospitalData();
  }, []);



  // Filter data based on the search term
  const handleSearch = (term) => {
    setSearchTerm(term);
    const filtered = hospitalData.filter((hospital) =>
      Object.values(hospital).some((field) =>
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
        <div className="container h-100 d-flex align-hospitals-center justify-content-between">
    
        <div className="header-area" id="headerArea">
        <div className="container h-100 d-flex align-hospitals-center justify-content-between">
            <div className="logo-wrapper" style={{color:'#020310'}}><img src={imgSmall} alt=""/> <Title /> </div>
        
            <div className="suha-navbar-toggler" data-bs-toggle="offcanvas" data-bs-target="#suhaOffcanvas" aria-controls="suhaOffcanvas"><span></span><span></span><span></span></div>
        </div>
        </div>  

{/* tabindex="-1" */}
        <div className="offcanvas offcanvas-start suha-offcanvas-wrap"  id="suhaOffcanvas" aria-labelledby="suhaOffcanvasLabel">
      <button className="btn-close btn-close-white text-reset" type="button" data-bs-dismiss="offcanvas" aria-label="Close"></button>

      <div className="offcanvas-body">
        <div className="sidenav-profile">
          <div className="hospital-profile"><img src={imgBg} alt=""/></div>
          <div className="hospital-info">
            <h6 className="hospital-name mb-1">Hospital Booking App
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
          
        <div className="section-heading d-flex align-hospitals-center justify-content-between">
            <h6> My Hospital Details</h6>
			
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
                {filteredData.map((hospital) => (
              <div key={hospital._id} className="col-12 col-md-6">                                        
              <div className="card product-card" style={{marginBottom:10}}>
                <div className="card-body"    >
            
              
                      <a className="product-title d-block"  > Name:  <b> {hospital.name} </b></a>
                      <a className="product-title d-block"  >Doctor Name:  <b>  {hospital.doctor_name} </b></a>
                      <a className="product-title d-block"  >Speciality:  <b>  {hospital.speciality} </b></a>
              
                      <a className="product-title d-block"  >Timing:  <b>  {hospital.timing} </b></a>
              
                   <a className="product-title d-block"  >Address:  {hospital.address} </a>	
                   <a className="product-title d-block"  >City:  {hospital.city} </a>	
              
                      <a className="product-title d-block"  >Mobile: {hospital.mobile}  </a>
                  <a className="product-title d-block"  >Lat: {hospital.lat}  </a>
                      <a className="product-title d-block"  >Long: {hospital.long}  </a>
                 
                    </div>
                  </div>   
            
                  <a className="btn btn-danger" onClick={() => { LoadEdit(hospital._id) }}>Edit</a>
                  <a className="btn btn-danger" onClick={() => { Removefunction(hospital._id) }}>Delete</a>
                 <a className="btn btn-danger" onClick={() => setHospitalId(hospital._id)}>Geo Map</a> 

                 <a className="btn btn-danger" target="_blank"
                  href={`https://maps.google.com/?q=${hospital.lat},${hospital.long}`}>
                  Show Map
                </a>
              </div>
              ))}

              
        </div>
                  ) : (
                    <p>No hospital details found for the specified vendor email or search term.</p>
            )}

           {/* Show if Null data in table */}

        </div>
    </div>


            
            <div className="footer-nav-area" id="footerNav">
              <div className="container h-100 px-0">
                <div className="suha-footer-nav h-100">
                  <ul className="h-100 d-flex align-hospitals-center justify-content-between ps-0">
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

export default ViewMyHospital
