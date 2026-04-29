const {Hospital} = require('../models/hospital');
const express = require('express');
const router = express.Router();
const auth = require('../helpers/jwt');

router.get(`/`, async (req, res) => {
    try {
        // Use an aggregation to join Hospital with User collection based on email
        const hospitalList = await Hospital.aggregate([
            {
                $lookup: {
                    from: 'User', // The collection name is 'User' because pluralize is null
                    localField: 'hospitalemail',
                    foreignField: 'email',
                    as: 'owner'
                }
            },
            {
                $unwind: '$owner'
            },
            {
                $match: {
                    'owner.status': 'Approved' // Only show hospitals from Approved users
                }
            }
        ]);

        if (!hospitalList) {
            return res.status(500).json({ success: false });
        }
        res.status(200).send(hospitalList);
    } catch (error) {
        console.error('Error fetching hospitals:', error.message);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});




router.get(`/:id`, async (req, res) =>{
    const hospitalList = await Hospital.findById(req.params.id);

    if(!hospitalList) {
        res.status(500).json({success: false})
    } 
    res.send(hospitalList);
})


router.post('/', async (req,res)=>{
    
    let hospital = new Hospital({
        hospitalemail: req.body.hospitalemail,
        name: req.body.name,
        doctor_name: req.body.doctor_name,
        speciality: req.body.speciality,
        timing: req.body.timing,
        mobile: req.body.mobile,
        address: req.body.address,
        city: req.body.city,
        
    })
    
    hospital = await hospital.save();
    const availableSlots = hospital.generateTimeSlots();

    if(!hospital)
    return res.status(400).send('the hospital cannot be created!')
    res.send(hospital);
    
})



router.delete('/:id', (req, res)=>{
    Hospital.findByIdAndRemove(req.params.id).then(hospital =>{
        if(hospital) {
            return res.status(200).json({success: true, message: 'the hospital is deleted!'})
        } else {
            return res.status(404).json({success: false , message: "hospital not found!"})
        }
    }).catch(err=>{
       return res.status(500).json({success: false, error: err}) 
    })
})



router.put('/:id',async (req, res)=> {
    const hospital = await Hospital.findByIdAndUpdate(
        req.params.id,
        {        
        hospitalemail: req.body.hospitalemail,
        name: req.body.name,
        doctor_name: req.body.doctor_name,
        speciality: req.body.speciality,
        timing: req.body.timing,
        mobile: req.body.mobile,
        address: req.body.address,
        city: req.body.city,
        },
        { new: true}
    )

    if(!hospital)
    return res.status(400).send('the hospital cannot be created!')

    res.send(hospital);
})




router.put('/map/:id',async (req, res)=> {
    const hospital = await Hospital.findByIdAndUpdate(
        req.params.id,
        {        
            lat: req.body.lat,
            long: req.body.long
        },
        { new: true}
    )

    if(!hospital)
    return res.status(400).send('the hospital cannot be created!')

    res.send(hospital);
})




router.put('/status/:id', auth, async (req, res)=> {
    const hospital = await Hospital.findByIdAndUpdate(
        req.params.id,
        {        
            status: req.body.status
        },
        { new: true}
    )

    if(!hospital)
    return res.status(400).send('the hospital cannot be created!')

    res.send(hospital);
})


module.exports =router;