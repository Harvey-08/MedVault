# MedVault - Hospital Management System

MedVault is a comprehensive Hospital Management System built using the MERN stack. It provides a seamless interface for Patients, Hospitals, Lab Technicians, and Administrators to manage healthcare operations efficiently.

##  Key Features

- **Multi-Role Authentication:** Dedicated portals for Patients, Hospitals, Lab Technicians, and Admins.
- **Appointment Management:** Patients can book appointments, and hospitals can update their status.
- **Digital Prescriptions:** Hospitals can generate and update prescriptions for patients.
- **Lab Report Integration:** Lab technicians can upload reports directly to patient profiles.
- **Billing System:** Automated billing and history tracking.
- **Security:** Secure password hashing and JWT-based authentication.
- **Profile Management:** Users can update their personal information and profiles.

## ️ Technology Stack

- **Frontend:** React.js, Vite, Bootstrap, CSS3, Owl Carousel, Font Awesome
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT (JSON Web Tokens) & Bcrypt (Password Hashing)
- **File Handling:** Multer (for Lab Report uploads)
- **Other Tools:** Axios, React Cookie

##  How to Run Locally

### 1. Prerequisites
- Install [Node.js](https://nodejs.org/)
- Install [MongoDB](https://www.mongodb.com/try/download/community)

### 2. Setup the Backend
Navigate to the **Backend** folder and install dependencies:
```bash
cd Backend
npm install
```
Create a `.env` file in the **Backend** folder:
```env
CONNECTION_STRING = mongodb://localhost:27017/Your_DB_Name
JWT_SECRET = your_secret_key
API_URL = /api/v1
PORT = 4000
```
Start the server:
```bash
npm start
```

> **Note:** Make sure to manually create a folder named `uploads` inside `Backend/public/` to store patient lab reports.

### 3. Setup the Frontend
Open a new terminal, navigate to the **Frontend** folder:
```bash
cd Frontend
npm install
```
Create a `.env` file in the **Frontend** folder:
```env
VITE_API_URL = http://localhost:4000
```
Start the development server:
```bash
npm run dev
```
The app will be available at `http://localhost:5173/`.

---
*MedVault - Modern Healthcare Solution*
