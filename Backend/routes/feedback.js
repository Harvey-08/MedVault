const {Feedback} = require('../models/feedback');
const express = require('express');
const router = express.Router();
const auth = require('../helpers/jwt');

// vendoremail  useremail  name  feedback

router.get(`/`,  async (req, res) =>{
    const feedbackList = await Feedback.find()
        .populate('patient', '-passwordHash')
        .populate('hospital', '-passwordHash');

    if(!feedbackList) {
        res.status(500).json({success: false})
    } 
    res.status(200).send(feedbackList);
})


    
router.get(`/:id`, async (req, res) =>{
    const feedbackList = await Feedback.findById(req.params.id)
        .populate('patient', '-passwordHash')
        .populate('hospital', '-passwordHash');
    if(!feedbackList) {
        res.status(500).json({success: false})
    } 
    res.send(feedbackList);
})

router.post('/',   async (req,res)=>{
    const { User } = require('../models/user');
    const patientUser = await User.findOne({ email: { $regex: new RegExp('^' + req.body.patemail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i') } });
    const hospitalUser = await User.findOne({ email: { $regex: new RegExp('^' + req.body.hospitalemail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i') } });

    if (!patientUser) {
        return res.status(400).json({ success: false, error: 'Patient account not found.' });
    }
    if (!hospitalUser) {
        return res.status(400).json({ success: false, error: 'Hospital account not found.' });
    }

    let feedback = new Feedback({
        patient: patientUser._id,
        hospital: hospitalUser._id,
        patemail: req.body.patemail,
        hospitalemail: req.body.hospitalemail,
        name: req.body.name,
        feedback: req.body.feedback
    })
    feedback = await feedback.save();

    if(!feedback)
    return res.status(400).send('the feedback cannot be created!')
    res.send(feedback);
    
})





module.exports =router;