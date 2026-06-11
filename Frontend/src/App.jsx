import React, { useEffect } from 'react';
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";
//import "./App.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';  // Import JavaScript for dropdown
import { Routes, Route, Link, BrowserRouter } from "react-router-dom";

import Index from './components/Index';
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
    
          <Route path='/' element={<Index />} />
          <Route path='/consent_settings' element={<ConsentSettings />} />
          <Route path='/view_audit_logs' element={<ViewAuditLogs />} />
          <Route path='/admin_profile' element={<AdminProfile />} />
            <Route path='/update_labuser/:id' element={<UpdateLabuser />} />
        
            
            <Route path='/edit_hospitalprofile/:id' element={<EditHospitalProfile />} />
            <Route path='/edit_adminprofile/:id' element={<EditAdminProfile />} />
          
            <Route path='/edit_patientprofile/:id' element={<EditPatientProfile />} />
         
            <Route path='/hospital_profile' element={<HospitalProfile/>}/>
          
            <Route path='/lab_home' element={<LabHome/>}/>
            
            <Route path='/admin_home' element={<AdminHome/>} />
            <Route path='/logout' element={<Logout/>} />
            <Route path='/post_appointment' element={<PostAppointment/>}/>
            <Route path='/post_billing' element={<PostBilling/>}/>
            <Route path='/post_hospital' element={<PostHospital/>}/>
            <Route path='/post_lab_reg' element={<PostLabReg/>}/>

            <Route path='/post_labtest' element={<PostLabtest/>}/>
            <Route path='/post_prescription' element={<PostPrescription/>}/>
        
            <Route path='/update_billing/:id' element={<UpdateBilling/>}/>
       
            <Route path='/upload_lab_image/:id' element={<UploadLabImage />} />
         
            <Route path='/update_hospital/:id' element={<UpdateHospital/>}/>
            <Route path='/update_prescription/:id' element={<UpdatePrescription/>}/>
           
            <Route path='/patient_home' element={<PatientHome/>} />
            <Route path='/patient_profile' element={<PatientProfile/>}/>
           <Route path='/view_all_hospital' element={<ViewAllHospital/>} />
           <Route path='/view_patient_history' element={<ViewPatientHistory/>} />
            <Route path='/view_all_prescription' element={<ViewAllPrescription/>} />
            <Route path='/update_status_appointment/:id' element={<UpdateStatusAppointment/>} />
              <Route path='/hospital_register' element={<HospitalRegister />} />
              <Route path='/patient_register' element={<PatientRegister />} />
              <Route path='/lab_login' element={<LabLogin />} />
              <Route path='/lab_profile' element={<LabProfile/>}/>
       
              <Route path='/admin_login' element={<AdminLogin />} />
        
            <Route path='/login' element={<Login />} />
            <Route path='/reset_password' element={<ResetPassword/>} />
            <Route path='/change_password' element={<ChangePassword/>} />
            <Route path='/hospital_home' element={<HospitalHome />} />
            <Route path='/update_status_admin/:id' element={<UpdateStatusAdmin />} />
            <Route path='/view_appointment' element={<ViewAppointment />} />
            <Route path='/view_prescription' element={<ViewPrescription />} />
            <Route path='/view_billing' element={<ViewBilling />} />
            <Route path='/view_labtest' element={<ViewLabtest />} />
            <Route path='/view_lab_user' element={<ViewLabUser />} />
         
            <Route path='/view_my_billing' element={<ViewMyBilling />} />
            <Route path='/view_my_appointment' element={<ViewMyAppointment />} />
            <Route path='/view_my_labtest' element={<ViewMyLabtest />} />
            <Route path='/view_patient_labtest' element={<ViewPatientLabtest />} />
            
            <Route path='/view_my_prescription' element={<ViewMyPrescription />} />
            <Route path='/more_info/:id' element={<MoreInfo />} />
            <Route path='/more_info_patient/:id' element={<MoreInfoPatient />} />
        
            <Route path='/view_my_hospital' element={<ViewMyHospital />} />
       
            <Route path='/view_user_admin' element={<ViewUserAdmin />} />
           
            <Route path='/view_hospital_admin' element={<ViewHospitalAdmin />} />
            <Route path='/post_feedback' element={<PostFeedback />} />
            <Route path='/view_my_feedback' element={<ViewMyFeedback />} />
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