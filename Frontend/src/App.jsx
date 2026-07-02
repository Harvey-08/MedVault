import React, { useEffect } from 'react';
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";
//import "./App.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';  // Import JavaScript for dropdown
import { Routes, Route, Link, BrowserRouter } from "react-router-dom";

import Index from './components/Index';
import ProtectedRoute from './components/ProtectedRoute';
import AdminHome from './components/AdminHome';
import HospitalRegister from  "./components/HospitalRegister";
import PatientRegister from  "./components/PatientRegister";
import EditAdminProfile from './components/EditAdminProfile';
import EditHospitalProfile from './components/EditHospitalProfile';
import EditPatientProfile from './components/EditPatientProfile';
import ResetPassword from './components/ResetPassword';
import ChangePassword from './components/ChangePassword';

import HospitalHome from './components/HospitalHome';

import HospitalProfile from './components/HospitalProfile';

import LabHome from './components/LabHome';
import Login from './components/login';
import AdminLogin from './components/AdminLogin';
import LabLogin from './components/LabLogin';
import Logout from './components/Logout';
import PatientHome from './components/PatientHome';

import PatientProfile from './components/PatientProfile';
import PostAppointment from './components/PostAppointment';

import PostBilling from './components/PostBilling';

import PostHospital from './components/PostHospital';
import PostLabtest from './components/PostLabtest';

import PostPrescription from './components/PostPrescription';

import PostLabReg from './components/PostLabReg';

import UpdateBilling from './components/UpdateBilling';
import UpdateHospital from './components/UpdateHospital';

import UpdatePrescription from './components/UpdatePrescription';

import UpdateStatusAdmin from './components/UpdateStatusAdmin';

import UpdateStatusAppointment from './components/UpdateStatusAppointment';
import UploadLabImage from './components/UploadLabImage';
import ViewAllHospital from './components/ViewAllHospital';
import PostFeedback from './components/PostFeedback';
import ViewMyFeedback from './components/ViewMyFeedback';
import ViewAllPrescription from './components/ViewAllPrescription';

import ViewBilling from './components/ViewBilling';
import ViewHospitalAdmin from './components/ViewHospitalAdmin';
import ViewLabtest from './components/ViewLabtest';
import ViewLabUser from './components/ViewLabUser';
import ViewAppointment from './components/ViewAppointment';
import ViewMyAppointment from './components/ViewMyAppointment';
import ViewMyBilling from './components/ViewMyBilling';
import ViewMyHospital from './components/ViewMyHospital';
import ViewMyLabtest from './components/ViewMyLabtest';
import ViewMyPrescription from './components/ViewMyPrescription';
import ViewUserAdmin from './components/ViewUserAdmin';
import AdminProfile from './components/AdminProfile';
import MoreInfo from './components/MoreInfo';
import ViewPrescription from './components/ViewPrescription';
import LabProfile from './components/LabProfile';
import UpdateLabuser from './components/UpdateLabuser';
import ViewPatientLabtest from './components/ViewPatientLabtest';
import MoreInfoPatient from './components/MoreInfoPatient';
import ViewPatientHistory from './components/ViewPatientHistory';
import ConsentSettings from './components/ConsentSettings';
import ViewAuditLogs from './components/ViewAuditLogs';

function App() {
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['x-auth-token'] = token;
    }
  }, []);

  return (
    <div>
      <BrowserRouter>
        <Routes>
    
          {/* Public Routes */}
          <Route path='/' element={<Index />} />
          <Route path='/login' element={<Login />} />
          <Route path='/admin_login' element={<AdminLogin />} />
          <Route path='/lab_login' element={<LabLogin />} />
          <Route path='/patient_register' element={<PatientRegister />} />
          <Route path='/hospital_register' element={<HospitalRegister />} />
          <Route path='/reset_password' element={<ResetPassword/>} />

          {/* Patient Routes */}
          <Route path='/patient_home' element={<ProtectedRoute allowedRoles={['Patient']}><PatientHome /></ProtectedRoute>} />
          <Route path='/patient_profile' element={<ProtectedRoute allowedRoles={['Patient']}><PatientProfile /></ProtectedRoute>} />
          <Route path='/edit_patientprofile/:id' element={<ProtectedRoute allowedRoles={['Patient']}><EditPatientProfile /></ProtectedRoute>} />
          <Route path='/consent_settings' element={<ProtectedRoute allowedRoles={['Patient']}><ConsentSettings /></ProtectedRoute>} />
          <Route path='/view_patient_history' element={<ProtectedRoute allowedRoles={['Patient', 'Hospital']}><ViewPatientHistory /></ProtectedRoute>} />
          <Route path='/post_appointment' element={<ProtectedRoute allowedRoles={['Patient']}><PostAppointment /></ProtectedRoute>} />
          <Route path='/view_my_appointment' element={<ProtectedRoute allowedRoles={['Patient']}><ViewMyAppointment /></ProtectedRoute>} />
          <Route path='/view_my_billing' element={<ProtectedRoute allowedRoles={['Patient']}><ViewMyBilling /></ProtectedRoute>} />
          <Route path='/view_my_labtest' element={<ProtectedRoute allowedRoles={['Patient', 'Lab', 'Hospital', 'Admin']}><ViewMyLabtest /></ProtectedRoute>} />
          <Route path='/view_my_prescription' element={<ProtectedRoute allowedRoles={['Patient']}><ViewMyPrescription /></ProtectedRoute>} />
          <Route path='/view_my_hospital' element={<ProtectedRoute allowedRoles={['Patient', 'Hospital']}><ViewMyHospital /></ProtectedRoute>} />
          <Route path='/post_feedback' element={<ProtectedRoute allowedRoles={['Patient']}><PostFeedback /></ProtectedRoute>} />
          <Route path='/view_my_feedback' element={<ProtectedRoute allowedRoles={['Patient', 'Hospital', 'Admin']}><ViewMyFeedback /></ProtectedRoute>} />

          {/* Hospital Routes */}
          <Route path='/hospital_home' element={<ProtectedRoute allowedRoles={['Hospital']}><HospitalHome /></ProtectedRoute>} />
          <Route path='/hospital_profile' element={<ProtectedRoute allowedRoles={['Hospital']}><HospitalProfile /></ProtectedRoute>} />
          <Route path='/edit_hospitalprofile/:id' element={<ProtectedRoute allowedRoles={['Hospital']}><EditHospitalProfile /></ProtectedRoute>} />
          <Route path='/post_hospital' element={<ProtectedRoute allowedRoles={['Hospital']}><PostHospital /></ProtectedRoute>} />
          <Route path='/post_billing' element={<ProtectedRoute allowedRoles={['Hospital']}><PostBilling /></ProtectedRoute>} />
          <Route path='/post_lab_reg' element={<ProtectedRoute allowedRoles={['Hospital']}><PostLabReg /></ProtectedRoute>} />
          <Route path='/post_prescription' element={<ProtectedRoute allowedRoles={['Hospital']}><PostPrescription /></ProtectedRoute>} />
          <Route path='/update_billing/:id' element={<ProtectedRoute allowedRoles={['Hospital']}><UpdateBilling /></ProtectedRoute>} />
          <Route path='/update_hospital/:id' element={<ProtectedRoute allowedRoles={['Hospital']}><UpdateHospital /></ProtectedRoute>} />
          <Route path='/update_prescription/:id' element={<ProtectedRoute allowedRoles={['Hospital']}><UpdatePrescription /></ProtectedRoute>} />
          <Route path='/update_status_appointment/:id' element={<ProtectedRoute allowedRoles={['Hospital']}><UpdateStatusAppointment /></ProtectedRoute>} />
          <Route path='/view_appointment' element={<ProtectedRoute allowedRoles={['Hospital']}><ViewAppointment /></ProtectedRoute>} />
          <Route path='/view_prescription' element={<ProtectedRoute allowedRoles={['Hospital']}><ViewPrescription /></ProtectedRoute>} />
          <Route path='/view_billing' element={<ProtectedRoute allowedRoles={['Hospital']}><ViewBilling /></ProtectedRoute>} />
          <Route path='/view_lab_user' element={<ProtectedRoute allowedRoles={['Hospital']}><ViewLabUser /></ProtectedRoute>} />
          <Route path='/more_info_patient/:id' element={<ProtectedRoute allowedRoles={['Hospital']}><MoreInfoPatient /></ProtectedRoute>} />

          {/* Lab Routes */}
          <Route path='/lab_home' element={<ProtectedRoute allowedRoles={['Lab']}><LabHome /></ProtectedRoute>} />
          <Route path='/lab_profile' element={<ProtectedRoute allowedRoles={['Lab']}><LabProfile /></ProtectedRoute>} />
          <Route path='/update_labuser/:id' element={<ProtectedRoute allowedRoles={['Lab']}><UpdateLabuser /></ProtectedRoute>} />
          <Route path='/post_labtest' element={<ProtectedRoute allowedRoles={['Lab']}><PostLabtest /></ProtectedRoute>} />
          <Route path='/upload_lab_image/:id' element={<ProtectedRoute allowedRoles={['Lab']}><UploadLabImage /></ProtectedRoute>} />
          <Route path='/view_patient_labtest' element={<ProtectedRoute allowedRoles={['Patient', 'Lab']}><ViewPatientLabtest /></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path='/admin_home' element={<ProtectedRoute allowedRoles={['Admin']}><AdminHome /></ProtectedRoute>} />
          <Route path='/admin_profile' element={<ProtectedRoute allowedRoles={['Admin']}><AdminProfile /></ProtectedRoute>} />
          <Route path='/edit_adminprofile/:id' element={<ProtectedRoute allowedRoles={['Admin']}><EditAdminProfile /></ProtectedRoute>} />
          <Route path='/view_audit_logs' element={<ProtectedRoute allowedRoles={['Admin']}><ViewAuditLogs /></ProtectedRoute>} />
          <Route path='/view_all_prescription' element={<ProtectedRoute allowedRoles={['Admin', 'Lab']}><ViewAllPrescription /></ProtectedRoute>} />
          <Route path='/view_user_admin' element={<ProtectedRoute allowedRoles={['Admin']}><ViewUserAdmin /></ProtectedRoute>} />
          <Route path='/view_hospital_admin' element={<ProtectedRoute allowedRoles={['Admin']}><ViewHospitalAdmin /></ProtectedRoute>} />
          <Route path='/update_status_admin/:id' element={<ProtectedRoute allowedRoles={['Admin']}><UpdateStatusAdmin /></ProtectedRoute>} />

          {/* Shared Private Routes */}
          <Route path='/change_password' element={<ProtectedRoute allowedRoles={['Patient', 'Hospital', 'Lab', 'Admin']}><ChangePassword /></ProtectedRoute>} />
          <Route path='/logout' element={<ProtectedRoute allowedRoles={['Patient', 'Hospital', 'Lab', 'Admin']}><Logout /></ProtectedRoute>} />
          <Route path='/view_all_hospital' element={<ProtectedRoute allowedRoles={['Patient', 'Admin']}><ViewAllHospital /></ProtectedRoute>} />
          <Route path='/view_labtest' element={<ProtectedRoute allowedRoles={['Patient', 'Hospital', 'Lab', 'Admin']}><ViewLabtest /></ProtectedRoute>} />
          <Route path='/more_info/:id' element={<ProtectedRoute allowedRoles={['Patient', 'Hospital', 'Lab', 'Admin']}><MoreInfo /></ProtectedRoute>} />
          </Routes>
        </BrowserRouter>
      </div>
    );
}



export default App;

{/*
unused 
import Viewlist from "./assets/unused/Viewlist";
import Edit from "./assets/unused/Edit";
import CreateBusiness from "./assets/unused/CreateBusiness";
import ViewAxios from "./assets/unused/ViewAxios";

<Route path='/viewtest' element={<Viewlist />} />            
<Route path='/axios' element={<ViewAxios />} />
<Route path='/create' element={<CreateBusiness />} />          
<Route path='/edit/:id' element={<Edit />} />

*/}