const Joi = require('joi');

const validateBody = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    next();
  };
};

const registerSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  phone: Joi.string().required(),
  role: Joi.string().valid('Patient', 'Hospital', 'Lab', 'Admin').required(),
  city: Joi.string().allow('', null),
  question1: Joi.string().required(),
  question2: Joi.string().required(),
  status: Joi.string().allow('', null)
});

const labRegisterSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  phone: Joi.string().required(),
  role: Joi.string().valid('Lab').required(),
  city: Joi.string().allow('', null),
  hospitalemail: Joi.string().email().required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  role: Joi.string().valid('Patient', 'Hospital', 'Lab', 'Admin').required()
});

const resetPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
  question1: Joi.string().required(),
  question2: Joi.string().required(),
  newPassword: Joi.string().min(6).required()
});

const changePasswordSchema = Joi.object({
  email: Joi.string().email().required(),
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).required()
});

const appointmentSchema = Joi.object({
  patemail: Joi.string().email().required(),
  hospitalemail: Joi.string().email().required(),
  patient_name: Joi.string().required(),
  doctor_name: Joi.string().required(),
  reason: Joi.string().required(),
  appointment_date: Joi.date().required(),
  timeslot: Joi.string().required(),
  address: Joi.string().required(),
  city: Joi.string().required(),
  mobile: Joi.number().required()
});

const appointmentStatusSchema = Joi.object({
  status: Joi.string().valid('Pending', 'Approved', 'Rejected', 'Completed', 'Confirmed', 'Cancelled').required()
});

const prescriptionSchema = Joi.object({
  patemail: Joi.string().email().required(),
  hospitalemail: Joi.string().email().required(),
  doctor_name: Joi.string().required(),
  patient_name: Joi.string().required(),
  findings: Joi.string().required(),
  lab_test: Joi.string().allow('', null),
  medicine_1: Joi.string().allow('', null),
  medicine_2: Joi.string().allow('', null),
  medicine_3: Joi.string().allow('', null),
  medicine_4: Joi.string().allow('', null),
  notes: Joi.string().allow('', null)
});

const prescriptionStatusSchema = Joi.object({
  status: Joi.string().valid('Pending', 'Approved', 'Completed').required()
});

const labtestSchema = Joi.object({
  patemail: Joi.string().email().required(),
  labemail: Joi.string().email().required(),
  hospitalemail: Joi.string().email().required(),
  patient_name: Joi.string().required(),
  test_name: Joi.string().required(),
  range: Joi.string().required(),
  actual_range: Joi.string().required(),
  level: Joi.string().required(),
  date: Joi.string().required()
});

const billingSchema = Joi.object({
  patemail: Joi.string().email().required(),
  hospitalemail: Joi.string().email().required(),
  patient_name: Joi.string().required(),
  amount: Joi.string().required(),
  amount_paid: Joi.string().required(),
  balance: Joi.string().required(),
  status: Joi.string().valid('Pending', 'Paid', 'Unpaid').allow('', null)
});

const consentRequestSchema = Joi.object({
  patientEmail: Joi.string().email().required()
});

const consentActionSchema = Joi.object({
  hospitalEmail: Joi.string().email().required()
});

module.exports = {
  validateBody,
  registerSchema,
  labRegisterSchema,
  loginSchema,
  resetPasswordSchema,
  changePasswordSchema,
  appointmentSchema,
  appointmentStatusSchema,
  prescriptionSchema,
  prescriptionStatusSchema,
  labtestSchema,
  billingSchema,
  consentRequestSchema,
  consentActionSchema
};
