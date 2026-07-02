
const mongoose = require('mongoose');

const billingSchema = mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    hospital: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
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
    amount: {
        type: String,
        required: true,    
       
    },
    amount_paid: {
        type: String,
        required: true,    
       
    },
    balance: {
        type: String,
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

billingSchema.index({ patient: 1, hospital: 1 });

billingSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

billingSchema.set('toJSON', {
    virtuals: true,
});


exports.Billing = mongoose.model('Billing', billingSchema);
