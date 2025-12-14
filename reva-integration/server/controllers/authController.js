import Farmer from '../models/Farmer.js';
import Company from '../models/Company.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

// 1. Unified Farmer Registration
export const registerFarmer = async (req, res) => {
  try {
    console.log('Registering Farmer:', req.body); // Debug log

    const { 
      phone, 
      pin, 
      personalInfo, 
      farmInfo, 
      bankDetails 
    } = req.body;

    // 1. Basic Validations
    if (!phone || !pin) {
      return res.status(400).json({ success: false, message: 'Phone and PIN are required' });
    }
    
    if (!/^\d{6}$/.test(pin)) {
      return res.status(400).json({ success: false, message: 'PIN must be exactly 6 digits' });
    }

    // 2. Check duplicate phone
    const existingFarmer = await Farmer.findOne({ 'personalInfo.phone': phone });
    if (existingFarmer) {
      return res.status(400).json({ success: false, message: 'Phone number already registered. Please login.' });
    }

    // 3. Hash PIN
    const hashedPin = await bcrypt.hash(pin, 12);

    // 4. Create Farmer Document
    const farmer = new Farmer({
      personalInfo: {
        ...personalInfo,
        phone: phone // Ensure phone is saved in personalInfo
      },
      farmInfo,
      bankDetails,
      pin: hashedPin
    });

    await farmer.save();

    // 5. Auto Login
    const token = generateToken(farmer._id, 'farmer');

    res.status(201).json({
      success: true,
      token,
      message: 'Registration successful',
      farmer: {
        id: farmer._id,
        name: farmer.personalInfo.name,
        phone: farmer.personalInfo.phone,
        role: 'farmer'
      }
    });

  } catch (error) {
    console.error('Registration Error:', error);
    
    // Handle Mongoose Validation Errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ 
        success: false, 
        message: 'Validation Error: ' + messages.join(', ') 
      });
    }

    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

// 2. Farmer Login Check (Step 1 of Login)
export const farmerSendOTP = async (req, res) => {
  try {
    const { phone } = req.body;
    const farmer = await Farmer.findOne({ 'personalInfo.phone': phone });
    
    if (!farmer) {
      return res.status(200).json({
        success: true,
        exists: false,
        message: 'Account not found'
      });
    }
    
    res.status(200).json({
      success: true,
      exists: true,
      message: 'Please enter your PIN'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Farmer Verify PIN (Step 2 of Login)
export const farmerVerifyOTP = async (req, res) => {
  try {
    const { phone, pin } = req.body;
    
    const farmer = await Farmer.findOne({ 'personalInfo.phone': phone });
    
    if (!farmer || !farmer.pin) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    const isValidPin = await bcrypt.compare(pin, farmer.pin);
    
    if (!isValidPin) {
      return res.status(401).json({ success: false, message: 'Invalid PIN' });
    }
    
    const token = generateToken(farmer._id, 'farmer');
    
    res.status(200).json({
      success: true,
      token,
      farmer: {
        id: farmer._id,
        name: farmer.personalInfo.name,
        phone: farmer.personalInfo.phone,
        role: 'farmer'
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ... Company controllers (unchanged for context, assuming existing implementation)
export const registerCompany = async (req, res) => {
  try {
    const company = new Company(req.body);
    await company.save();
    
    res.status(201).json({
      success: true,
      message: 'Company registered successfully',
      companyId: company._id
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const companyLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const company = await Company.findOne({ 'contactPerson.email': email });
    
    if (!company || !(await company.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    const token = generateToken(company._id, 'company');
    
    res.status(200).json({
      success: true,
      token,
      company: {
        id: company._id,
        name: company.companyInfo.companyName,
        email: company.contactPerson.email
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
