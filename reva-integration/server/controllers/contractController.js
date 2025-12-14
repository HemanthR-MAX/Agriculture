// server/controllers/contractController.js
import Contract from '../models/Contract.js';

// Get all contracts for a farmer
export const getFarmerContracts = async (req, res) => {
  try {
    const contracts = await Contract.find({ farmerId: req.user.id })
      .populate('companyId', 'companyInfo contactPerson')
      .populate('cropId', 'cropDetails')
      .populate('requirementId', 'demandDetails')
      .sort('-createdAt');
    
    res.status(200).json({ success: true, contracts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all contracts for a company
export const getCompanyContracts = async (req, res) => {
  try {
    const contracts = await Contract.find({ companyId: req.user.id })
      .populate('farmerId', 'personalInfo farmInfo')
      .populate('cropId', 'cropDetails prediction')
      .populate('requirementId', 'demandDetails')
      .sort('-createdAt');
    
    res.status(200).json({ success: true, contracts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get contracts for a specific requirement
export const getRequirementContracts = async (req, res) => {
  try {
    const { requirementId } = req.params;
    
    const contracts = await Contract.find({ 
      requirementId,
      companyId: req.user.id 
    })
      .populate('farmerId', 'personalInfo farmInfo')
      .populate('cropId', 'cropDetails prediction')
      .sort('-createdAt');
    
    res.status(200).json({ success: true, contracts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get contract details
export const getContractDetails = async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id)
      .populate('farmerId', 'personalInfo farmInfo')
      .populate('companyId', 'companyInfo contactPerson')
      .populate('cropId')
      .populate('requirementId');
    
    if (!contract) {
      return res.status(404).json({ success: false, message: 'Contract not found' });
    }
    
    res.status(200).json({ success: true, contract });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Confirm contract (by farmer)
export const confirmContract = async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id);
    
    if (!contract) {
      return res.status(404).json({ success: false, message: 'Contract not found' });
    }
    
    contract.status = 'Confirmed';
    await contract.save();
    
    res.status(200).json({
      success: true,
      contract,
      message: 'Contract confirmed successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Complete contract delivery
export const completeContract = async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id)
      .populate('farmerId');
    
    if (!contract) {
      return res.status(404).json({ success: false, message: 'Contract not found' });
    }
    
    // Update quality check
    contract.qualityCheck = req.body.qualityCheck;
    contract.status = 'Completed';
    contract.payment.balancePaid = true;
    
    await contract.save();
    
    // Credit farmer's wallet
    const farmer = contract.farmerId;
    const paymentAmount = contract.payment.balanceAmount;
    
    farmer.wallet.balance += paymentAmount;
    farmer.wallet.transactions.push({
      amount: paymentAmount,
      type: 'credit',
      description: `Payment for contract ${contract._id}`,
      date: new Date()
    });
    
    await farmer.save();
    
    res.status(200).json({
      success: true,
      contract,
      message: 'Contract completed and payment released'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
