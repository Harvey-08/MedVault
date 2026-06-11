import React from 'react';
import { Link } from 'react-router-dom';
import "./css/bootstrap.min.css";
import "./css/owl.carousel.min.css";
import "./css/font-awesome.min.css";
import "./css/animate.css";
import "./css/lineicons.min.css";
import "./css/magnific-popup.css";
import "./css/style.css";

const Logout = () => {
  const handleLogout = () => {
    // Clear all localStorage data
    localStorage.clear();

    // Also clear cookies just in case any legacy ones remain
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
      document.cookie = name.trim() + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    }

    alert('Logout Successful!');
    window.location.href = "/";
  };

  return (
    <div>
      <Link to="/" onClick={handleLogout}><i className="lni lni-power-switch"></i> Logout</Link>
    </div>
  );
};

export default Logout;
