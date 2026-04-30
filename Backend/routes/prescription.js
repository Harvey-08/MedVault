const {Prescription} = require('../models/prescription');
const express = require('express');
const router = express.Router();
const auth = require('../helpers/jwt');

// vendoremail  useremail  complaint mobile lat long status

  


// name description mechanicname service available  locality address city mobile 

// vendoremail  useremail  complaint mobile lat long status

router.get(`/`,  async (req, res) =>{
    const prescriptionList = await Prescription.find();

    if(!prescriptionList) {
        res.status(500).json({success: false})
    } 
    res.status(200).send(prescriptionList);
})


    
router.get(`/:id`, async (req, res) =>{
    const prescriptionList = await Prescription.findById(req.params.id);
    if(!prescriptionList) {
        res.status(500).json({success: false})
    } 
    res.send(prescriptionList);
})

router.post('/',   async (req,res)=>{
    let prescription = new Prescription({
        patemail: req.body.patemail,
        hospitalemail: req.body.hospitalemail,
        doctor_name:req.body.doctor_name,
        patient_name: req.body.patient_name,
        findings: req.body.findings,
        lab_test: req.body.lab_test,
        medicine_1: req.body.medicine_1,
        medicine_2: req.body.medicine_2,
        medicine_3: req.body.medicine_3,
        medicine_4: req.body.medicine_4,
        notes: req.body.notes,

      
    })
    prescription = await prescription.save();

    if(!prescription)
    return res.status(400).send('the prescription cannot be created!')
    res.send(prescription);
    
})



router.delete('/:id', (req, res)=>{
    Prescription.findByIdAndDelete(req.params.id).then(prescription =>{
        if(prescription) {
            return res.status(200).json({success: true, message: 'the prescription is deleted!'})
        } else {
            return res.status(404).json({success: false , message: "prescription not found!"})
        }
    }).catch(err=>{
       return res.status(500).json({success: false, error: err}) 
    })
})

router.put('/:id',async (req, res)=> {
    const prescription = await Prescription.findByIdAndUpdate(
        req.params.id,
        {        
            patemail: req.body.patemail,
            hospitalemail: req.body.hospitalemail,
            doctor_name:req.body.doctor_name,
            patient_name: req.body.patient_name,
            findings: req.body.findings,
            lab_test: req.body.lab_test,
            medicine_1: req.body.medicine_1,
            medicine_2: req.body.medicine_2,
            medicine_3: req.body.medicine_3,
            medicine_4: req.body.medicine_4,
            notes: req.body.notes,
        },
        { new: true}
    )

    if(!prescription)
    return res.status(400).send('the prescription cannot be created!')

    res.send(prescription);
})





router.put('/status/:id',  async (req, res)=> {
    const prescription = await Prescription.findByIdAndUpdate(
        req.params.id,
        {        
            status: req.body.status
        },
        { new: true}
    )

    if(!prescription)
    return res.status(400).send('the prescription cannot be created!')

    res.send(prescription);
})



module.exports =router;