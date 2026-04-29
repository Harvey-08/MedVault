const mongoose = require('mongoose');

const appointmentSchema = mongoose.Schema({
    patemail: {
        type: String,
        required: true,    
    },
    hospitalemail: {
        type: String,
        required: true,    
    },
    patient_name: {
        type: String,
        required: true,    
    },
    doctor_name:
    {
        type: String,
       
    },
    reason: {
        type: String,
        required: true,    
    },
    appointment_date: {
        type: Date,
        required: true,    
    },
    timeslot: {
        type: String,
        required: true,    
    },
    
  
    address: {
        type: String,
        required: true,    
    },
    city: {
        type: String,
        required: true,    
    },
    mobile: {
        type: Number,
        required: true,    
    },
    status: {
        type: String,
        default: 'Pending',   
    },
    dateCreated: {
        type: Date,
        default: Date.now,
    }
})


appointmentSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

appointmentSchema.set('toJSON', {
    virtuals: true,
});


exports.Appointment = mongoose.model('Appointment', appointmentSchema);
