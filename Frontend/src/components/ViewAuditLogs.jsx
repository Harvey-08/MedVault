import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "./css/bootstrap.min.css";
import "./css/owl.carousel.min.css";
import "./css/font-awesome.min.css";
import "./css/animate.css";
import "./css/lineicons.min.css";
import "./css/magnific-popup.css";
import "./css/style.css";

import "./js/jquery.min.js";  
import "./js/bootstrap.bundle.min.js";

import imgSmall from "./img/core-img/logo-small.png";
import imgBg from "./img/bg-img/9.png";
import Logout from './Logout.jsx';
import Title from './Title.jsx';

const ViewAuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAuditLogs = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/users/audit-logs`, {
          headers: {
            'x-auth-token': token
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setLogs(data);
        } else {
          setError(`Failed to fetch: ${response.statusText}`);
        }
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAuditLogs();
  }, []);

  const filteredLogs = logs.filter(log => {
    const term = searchTerm.toLowerCase();
    return (
      (log.actor && log.actor.toLowerCase().includes(term)) ||
      (log.role && log.role.toLowerCase().includes(term)) ||
      (log.action && log.action.toLowerCase().includes(term)) ||
      (log.status && log.status.toLowerCase().includes(term)) ||
      (log.details && log.details.toLowerCase().includes(term))
    );
  });

  return (
    <div>
      <header className="header-area" id="headerArea">
        <div className="container h-100 d-flex align-items-center justify-content-between">
          <div className="logo-wrapper" style={{color:'#020310'}}>
            <img src={imgSmall} alt="Logo" />
            <Title />
          </div>
          <div className="suha-navbar-toggler" data-bs-toggle="offcanvas" data-bs-target="#suhaOffcanvas" aria-controls="suhaOffcanvas">
            <span></span><span></span><span></span>
          </div>
        </div>
        <div className="offcanvas offcanvas-start suha-offcanvas-wrap" id="suhaOffcanvas" aria-labelledby="suhaOffcanvasLabel">
          <button className="btn-close btn-close-white text-reset" type="button" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          <div className="offcanvas-body">
            <div className="sidenav-profile">
              <div className="user-profile"><img src={imgBg} alt="User Profile" /></div>
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
      </header>

      <div className="page-content-wrapper">
        <div className="top-products-area py-3">
          <div className="container">
            <div className="section-heading d-flex align-items-center justify-content-between">
              <h6>System Access & Compliance Audit Logs</h6>
            </div>
            
            <div className="row g-3">
              <div className="top-search-form">
                <form onSubmit={(e) => e.preventDefault()} autoComplete="off">
                  <input 
                    className="form-control" 
                    type="text" 
                    placeholder="Search logs by actor, role, action..." 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                  />
                  <button type="button"><i className="fa fa-search"></i></button>
                </form>
              </div>
            </div>

            <div className="row" style={{marginTop: 20}}>
              <div className="col-12">
                <div className="card shadow-sm">
                  <div className="card-body p-0">
                    {loading ? (
                      <div className="p-4 text-center">Loading audit logs...</div>
                    ) : error ? (
                      <div className="p-4 text-center text-danger">Error: {error}</div>
                    ) : filteredLogs.length === 0 ? (
                      <div className="p-4 text-center">No logs found matching your search.</div>
                    ) : (
                      <div className="table-responsive">
                        <table className="table table-striped table-hover mb-0" style={{ fontSize: '14px' }}>
                          <thead className="table-dark">
                            <tr>
                              <th scope="col">Timestamp</th>
                              <th scope="col">Actor Email</th>
                              <th scope="col">Role</th>
                              <th scope="col">Action</th>
                              <th scope="col">Status</th>
                              <th scope="col">Details</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredLogs.map((log) => (
                              <tr key={log._id}>
                                <td>{new Date(log.timestamp).toLocaleString()}</td>
                                <td><strong>{log.actor}</strong></td>
                                <td>
                                  <span className={`badge ${
                                    log.role === 'Admin' ? 'bg-primary' : 
                                    log.role === 'Hospital' ? 'bg-info text-dark' : 
                                    log.role === 'Lab' ? 'bg-warning text-dark' : 'bg-secondary'
                                  }`}>
                                    {log.role}
                                  </span>
                                </td>
                                <td><code>{log.action}</code></td>
                                <td>
                                  <span className={`badge ${log.status === 'SUCCESS' ? 'bg-success' : 'bg-danger'}`}>
                                    {log.status}
                                  </span>
                                </td>
                                <td>{log.details || '-'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <footer className="footer-nav-area" id="footerNav">
          <div className="container h-100 px-0">
            <div className="suha-footer-nav h-100">
              <ul className="h-100 d-flex align-items-center justify-content-between ps-0">
                <li className="active"><Link to="/admin_home"><i className="lni lni-home"></i>Home</Link></li>
                <li><Logout /></li> 
              </ul>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ViewAuditLogs;
