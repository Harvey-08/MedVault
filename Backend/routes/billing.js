const {Billing} = require('../models/billing');
const express = require('express');
const router = express.Router();
const auth = require('../helpers/jwt');


router.get(`/`,  async (req, res) =>{
    const billingList = await Billing.find();

    if(!billingList) {
        res.status(500).json({success: false})
    } 
    res.status(200).send(billingList);
})


    
router.get(`/:id`, async (req, res) =>{
    const billingList = await Billing.findById(req.params.id);
    if(!billingList) {
        res.status(500).json({success: false})
    } 
    res.send(billingList);
})

router.post('/', async (req,res)=>{
    
    let billing = new Billing({
      patemail: req.body.patemail,
      hospitalemail:req.body.hospitalemail,
      patient_name: req.body.patient_name,
      amount: req.body.amount,
      amount_paid: req.body.amount_paid,
      balance: req.body.balance
    })
    billing = await billing.save();

    if(!billing)
    return res.status(400).send('the billing cannot be created!')
    res.send(billing);
    
})


router.delete('/:id', (req, res)=>{
  Billing.findByIdAndDelete(req.params.id).then(billing =>{
      if(billing) {
          return res.status(200).json({success: true, message: 'the billing is deleted!'})
      } else {
          return res.status(404).json({success: false , message: "billing not found!"})
      }
  }).catch(err=>{
     return res.status(500).json({success: false, error: err}) 
  })
})


router.put('/:id',async (req, res)=> {
  const billing = await Billing.findByIdAndUpdate(
      req.params.id,
      {        
        patemail: req.body.patemail,
        hospitalemail:req.body.hospitalemail,
        patient_name: req.body.patient_name,
        amount: req.body.amount,
        amount_paid: req.body.amount_paid,
        balance: req.body.balance
      },
      { new: true}
  )

  if(!billing)
  return res.status(400).send('the billing cannot be created!')

  res.send(billing);
})




module.exports =router;