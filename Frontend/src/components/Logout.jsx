import React from 'react';
import Cookies from 'js-cookie';
import { useNavigate ,Link } from 'react-router-dom';

import "./css/bootstrap.min.css";
import "./css/owl.carousel.min.css";
import "./css/font-awesome.min.css";
import "./css/animate.css";
import "./css/font-awesome.min.css";
import "./css/lineicons.min.css";
import "./css/magnific-popup.css";
import "./css/style.css";

const Logout = () => {
  const history = useNavigate ();
  const handleLogout = () => {
    // Delete all auth/session related cookies
    Cookies.remove('email');
    Cookies.remove('vendoremail');
    Cookies.remove('adminemail');
    Cookies.remove('token');

    // Newly added: clear role-specific cookies so logins don't leak across roles
    Cookies.remove('hospitalemail');
    Cookies.remove('patemail');
    Cookies.remove('labemail');
    Cookies.remove('role');
    Cookies.remove('name');
    Cookies.remove('doctor_name');

    // Delete the token from localStorage
    localStorage.removeItem('token');

    alert('Logout Successful!');
    window.location.href = "/";
  };

  return (
    <div>

    <Link to="/" onClick={handleLogout}  ><i className="lni lni-power-switch"></i>  Logout</Link>
                
    </div>
  );
};


export default Logout;
