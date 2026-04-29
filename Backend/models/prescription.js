const mongoose = require('mongoose');

// vendoremail  useremail  complaint mobile lat long status
const prescriptionSchema = mongoose.Schema({
   
    patemail: {
        type: String,
        required: true,    
    },
    hospitalemail: {
        type: String,
        required: true,    
    },
    doctor_name:
    {
        type: String,
        required: true,    
    },
    patient_name: {
        type: String,
        required: true,    
    },  
    findings: {
        type: String,
        required: true,    
    },
    lab_test: {
        type: String,
       
    },
    medicine_1: {
        type: String,
       
    },
    medicine_2: {
        type: String,
       
    },
    medicine_3: {
        type: String,
       
    },
    medicine_4: {
        type: String,
            
    },
    notes: {
        type: String,
        
    },
   
    status: {
        type: String,
        default: 'Pending',   
    },
    dateCreated: {
        type: String, // Store as string to prevent automatic conversion to local time in MongoDB
        default: new Date().toISOString(),
    }
})


prescriptionSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

prescriptionSchema.set('toJSON', {
    virtuals: true,
});


exports.Prescription = mongoose.model('Prescription', prescriptionSchema);
